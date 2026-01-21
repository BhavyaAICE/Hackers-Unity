import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { format, isPast, differenceInDays } from "date-fns";
import { 
  Calendar, MapPin, Clock, Users, ArrowLeft, Trophy, 
  Lightbulb, HelpCircle, Award, UserCheck, Linkedin,
  ExternalLink, Github, ChevronRight, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Event {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  event_type: string;
  event_date: string | null;
  event_end_date: string | null;
  registration_deadline: string | null;
  duration_days: number;
  timing: string | null;
  location_type: string | null;
  location_name: string | null;
  location_address: string | null;
  banner_image: string | null;
  registration_count: number;
  registration_enabled: boolean;
  prize_pool: string | null;
  status: string | null;
  external_link: string | null;
}

interface Challenge {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  detailed_description: string | null;
}

interface Mentor {
  id: string;
  name: string;
  title: string | null;
  organization: string | null;
  avatar_url: string | null;
  linkedin_url: string | null;
  bio: string | null;
}

interface Jury {
  id: string;
  name: string;
  title: string | null;
  organization: string | null;
  avatar_url: string | null;
  linkedin_url: string | null;
  bio: string | null;
}

interface Prize {
  id: string;
  position: string;
  title: string | null;
  prize_amount: string | null;
  description: string | null;
  icon_url: string | null;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface Winner {
  id: string;
  position: string;
  team_name: string;
  project_name: string;
  project_description: string | null;
  members: string | null;
  prize_won: string | null;
  image_url: string | null;
  github_url: string | null;
  project_url: string | null;
}

interface ScheduleItem {
  id: string;
  day: number;
  schedule_date: string | null;
  start_time: string;
  end_time: string;
  title: string;
  description: string | null;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const HackathonDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [jury, setJury] = useState<Jury[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("about");
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [sidebarSticky, setSidebarSticky] = useState(true);
  const faqSectionRef = useRef<HTMLElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Track scroll position to stop sidebar at FAQ section
  useEffect(() => {
    const handleScroll = () => {
      if (faqSectionRef.current && sidebarRef.current) {
        const faqRect = faqSectionRef.current.getBoundingClientRect();
        const sidebarHeight = sidebarRef.current.offsetHeight;
        const navbarHeight = 128; // top-32 = 8rem = 128px
        
        // Stop sticky when FAQ section top reaches sidebar bottom
        if (faqRect.top <= sidebarHeight + navbarHeight + 50) {
          setSidebarSticky(false);
        } else {
          setSidebarSticky(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [faqs]);

  useEffect(() => {
    if (id) {
      fetchAllData();
    }
  }, [id]);

  const fetchAllData = async () => {
    if (!id) return;

    const [eventRes, challengesRes, mentorsRes, juryRes, prizesRes, faqsRes, winnersRes, scheduleRes] = await Promise.all([
      supabase.from("events").select("*").eq("id", id).maybeSingle(),
      supabase.from("hackathon_challenges").select("*").eq("event_id", id).eq("is_active", true).order("display_order"),
      supabase.from("hackathon_mentors").select("*").eq("event_id", id).eq("is_active", true).order("display_order"),
      supabase.from("hackathon_jury").select("*").eq("event_id", id).eq("is_active", true).order("display_order"),
      supabase.from("hackathon_prizes").select("*").eq("event_id", id).eq("is_active", true).order("display_order"),
      supabase.from("hackathon_faqs").select("*").eq("event_id", id).eq("is_active", true).order("display_order"),
      supabase.from("hackathon_winners").select("*").eq("event_id", id).order("display_order"),
      supabase.from("schedule_items").select("*").eq("event_id", id).order("day").order("display_order")
    ]);

    if (eventRes.error || !eventRes.data) {
      toast.error("Hackathon not found");
      setLoading(false);
      return;
    }

    setEvent(eventRes.data);
    setChallenges(challengesRes.data || []);
    setMentors(mentorsRes.data || []);
    setJury(juryRes.data || []);
    setPrizes(prizesRes.data || []);
    setFaqs(faqsRes.data || []);
    setWinners(winnersRes.data || []);
    setSchedule(scheduleRes.data || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container-custom py-24 text-center">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-muted rounded mx-auto mb-4" />
            <div className="h-4 w-32 bg-muted rounded mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container-custom py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Hackathon not found</h1>
          <Link to="/">
            <Button variant="hero">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isRegistrationClosed = event.registration_deadline
    ? isPast(new Date(event.registration_deadline))
    : false;

  const isEventCompleted = event.status === 'completed' || (event.event_end_date
    ? isPast(new Date(event.event_end_date))
    : event.event_date
    ? isPast(new Date(event.event_date))
    : false);

  const canRegister = event.registration_enabled && !isRegistrationClosed && !isEventCompleted;

  const sections = [
    { id: "about", label: "About" },
    ...(challenges.length > 0 ? [{ id: "challenges", label: "Challenges" }] : []),
    ...(mentors.length > 0 ? [{ id: "mentors", label: "Mentors" }] : []),
    ...(jury.length > 0 ? [{ id: "jury", label: "Jury Panel" }] : []),
    ...(schedule.length > 0 ? [{ id: "schedule", label: "Schedule" }] : []),
    ...(prizes.length > 0 ? [{ id: "prizes", label: "Prizes" }] : []),
    ...(winners.length > 0 ? [{ id: "winners", label: "Winners" }] : []),
    ...(faqs.length > 0 ? [{ id: "faqs", label: "FAQs" }] : []),
  ];

  // Group schedule by date if available, otherwise by day
  const groupedSchedule = schedule.reduce((acc, item) => {
    const key = item.schedule_date || `day-${item.day}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, ScheduleItem[]>);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section with Banner */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {event.banner_image && (
          <div className="absolute inset-0 bg-muted">
            <img
              src={event.banner_image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
          </div>
        )}
        {!event.banner_image && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-background" />
        )}

        <div className="container-custom relative z-10">
          <motion.div {...fadeInUp}>
            <Link to="/">
              <Button variant="ghost" className="mb-6 hover:bg-primary/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>

            <div className="max-w-4xl">
              <motion.span 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block text-xs font-semibold uppercase px-3 py-1 rounded-full bg-primary/20 text-primary mb-4"
              >
                {event.event_type}
              </motion.span>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-bold mb-4"
              >
                <span className="text-primary">{event.title}</span>
              </motion.h1>
              
              {event.subtitle && (
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl text-muted-foreground mb-8"
                >
                  {event.subtitle}
                </motion.p>
              )}

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-3"
              >
                {event.event_date && (
                  <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm">{format(new Date(event.event_date), "PPP")}</span>
                  </div>
                )}
                {event.location_name && (
                  <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm">{event.location_name}</span>
                  </div>
                )}
                {event.prize_pool && (
                  <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
                    <Trophy className="w-4 h-4 text-primary" />
                    <span className="text-sm">Prize Pool: {event.prize_pool}</span>
                  </div>
                )}
                {event.registration_deadline && !isRegistrationClosed && !isEventCompleted && (
                  <div className="flex items-center gap-2 bg-destructive/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-destructive/30">
                    <Clock className="w-4 h-4 text-destructive" />
                    <span className="text-sm text-destructive font-medium">
                      {differenceInDays(new Date(event.registration_deadline), new Date()) > 0 
                        ? `${differenceInDays(new Date(event.registration_deadline), new Date())} days left to register`
                        : "Last day to register!"}
                    </span>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container-custom">
          <nav className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeSection === section.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="container-custom py-12 pb-24 lg:pb-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            {/* About Section */}
            <section id="about">
              <motion.div {...fadeInUp}>
                <h2 className="text-3xl font-bold font-display mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                  About
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
                    {event.description || "No description available."}
                  </p>
                </div>
              </motion.div>
            </section>

            {/* Challenges Section */}
            {challenges.length > 0 && (
              <section id="challenges">
                <motion.div {...fadeInUp}>
                  <h2 className="text-3xl font-bold font-display mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-secondary" />
                    </div>
                    Challenges
                  </h2>
                  <motion.div 
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 gap-6"
                  >
                    {challenges.map((challenge) => (
                      <motion.div
                        key={challenge.id}
                        variants={fadeInUp}
                        whileHover={{ scale: 1.02, y: -3 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Card className="p-5 h-full bg-card border-border hover:shadow-lg hover:shadow-primary/5 transition-all rounded-2xl">
                          <div className="flex items-start gap-4">
                            {challenge.image_url ? (
                              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                                <img 
                                  src={challenge.image_url} 
                                  alt={challenge.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-3xl">{challenge.icon || "💡"}</span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-base leading-tight mb-3 line-clamp-3">{challenge.title}</h3>
                              <button
                                onClick={() => setSelectedChallenge(challenge)}
                                className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:text-primary/80 transition-colors group"
                              >
                                View more
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                              </button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </section>
            )}

            {/* Mentors Section */}
            {mentors.length > 0 && (
              <section id="mentors">
                <motion.div {...fadeInUp}>
                  <h2 className="text-3xl font-bold font-display mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-accent" />
                    </div>
                    Hackathon Mentors
                  </h2>
                  <motion.div 
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {mentors.map((mentor) => (
                      <motion.div
                        key={mentor.id}
                        variants={fadeInUp}
                        whileHover={{ y: -5 }}
                      >
                        <Card className="p-6 h-full text-center bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all group">
                          <div className="relative mx-auto w-24 h-24 mb-4">
                            {mentor.avatar_url ? (
                              <img
                                src={mentor.avatar_url}
                                alt={mentor.name}
                                className="w-full h-full rounded-full object-cover border-2 border-primary/30 group-hover:border-primary transition-colors"
                              />
                            ) : (
                              <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                <span className="text-2xl font-bold text-primary">{mentor.name.charAt(0)}</span>
                              </div>
                            )}
                          </div>
                          <h3 className="font-bold text-lg">{mentor.name}</h3>
                          {mentor.title && <p className="text-primary text-sm">{mentor.title}</p>}
                          {mentor.organization && <p className="text-muted-foreground text-sm">{mentor.organization}</p>}
                          {mentor.linkedin_url && (
                            <a
                              href={mentor.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-3 text-primary hover:text-primary/80 transition-colors"
                            >
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </section>
            )}

            {/* Jury Section */}
            {jury.length > 0 && (
              <section id="jury">
                <motion.div {...fadeInUp}>
                  <h2 className="text-3xl font-bold font-display mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-yellow-500" />
                    </div>
                    Jury Panel
                  </h2>
                  <motion.div 
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {jury.map((member) => (
                      <motion.div
                        key={member.id}
                        variants={fadeInUp}
                        whileHover={{ y: -5 }}
                      >
                        <Card className="p-6 h-full text-center bg-card/50 backdrop-blur-sm border-border hover:border-yellow-500/50 transition-all group">
                          <div className="relative mx-auto w-24 h-24 mb-4">
                            {member.avatar_url ? (
                              <img
                                src={member.avatar_url}
                                alt={member.name}
                                className="w-full h-full rounded-full object-cover border-2 border-yellow-500/30 group-hover:border-yellow-500 transition-colors"
                              />
                            ) : (
                              <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                                <span className="text-2xl font-bold text-yellow-500">{member.name.charAt(0)}</span>
                              </div>
                            )}
                          </div>
                          <h3 className="font-bold text-lg">{member.name}</h3>
                          {member.title && <p className="text-yellow-500 text-sm">{member.title}</p>}
                          {member.organization && <p className="text-muted-foreground text-sm">{member.organization}</p>}
                          {member.linkedin_url && (
                            <a
                              href={member.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-3 text-yellow-500 hover:text-yellow-400 transition-colors"
                            >
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </section>
            )}

            {/* Schedule Section */}
            {schedule.length > 0 && (
              <section id="schedule">
                <motion.div {...fadeInUp}>
                  <h2 className="text-3xl font-bold font-display mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-500" />
                    </div>
                    Schedule
                  </h2>
                  <div className="space-y-8">
                    {Object.entries(groupedSchedule).map(([key, items]) => {
                      const isDateKey = !key.startsWith('day-');
                      const displayLabel = isDateKey 
                        ? format(new Date(key), "d MMM yyyy")
                        : `Day ${key.replace('day-', '')}`;
                      
                      return (
                        <motion.div key={key} variants={fadeInUp}>
                          <div className="inline-block bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg px-6 py-3 mb-6 font-bold">
                            {displayLabel}
                          </div>
                        <div className="space-y-4 ml-4 border-l-2 border-primary/30 pl-6">
                          {items.map((item) => (
                            <motion.div
                              key={item.id}
                              whileHover={{ x: 5 }}
                              className="relative"
                            >
                              <div className="absolute -left-8 top-3 w-3 h-3 rounded-full bg-primary" />
                              <Card className="p-5 bg-card/50 backdrop-blur-sm">
                                <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                                  <Clock className="w-4 h-4" />
                                  {item.start_time} - {item.end_time}
                                </div>
                                <h4 className="font-bold text-lg">{item.title}</h4>
                                {item.description && (
                                  <p className="text-muted-foreground mt-2">{item.description}</p>
                                )}
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </section>
            )}

            {/* Prizes Section */}
            {prizes.length > 0 && (
              <section id="prizes">
                <motion.div {...fadeInUp}>
                  <h2 className="text-3xl font-bold font-display mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                    </div>
                    Prizes
                  </h2>
                  <motion.div 
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {prizes.map((prize, index) => (
                      <motion.div
                        key={prize.id}
                        variants={fadeInUp}
                        whileHover={{ scale: 1.05, y: -10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Card className={`p-6 h-full text-center relative overflow-hidden ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-500/50' :
                          index === 1 ? 'bg-gradient-to-br from-gray-400/20 to-gray-500/10 border-gray-400/50' :
                          index === 2 ? 'bg-gradient-to-br from-orange-600/20 to-orange-700/10 border-orange-600/50' :
                          'bg-card/50 border-border'
                        }`}>
                          <div className="text-4xl mb-4">
                            {prize.icon_url || (index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏆')}
                          </div>
                          <h3 className="font-bold text-xl mb-1">{prize.position}</h3>
                          {prize.title && <p className="text-muted-foreground mb-2">{prize.title}</p>}
                          {prize.prize_amount && (
                            <p className="text-2xl font-bold text-primary">{prize.prize_amount}</p>
                          )}
                          {prize.description && (
                            <p className="text-sm text-muted-foreground mt-2">{prize.description}</p>
                          )}
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </section>
            )}

            {/* Winners Section */}
            {winners.length > 0 && (
              <section id="winners">
                <motion.div {...fadeInUp}>
                  <h2 className="text-3xl font-bold font-display mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Award className="w-5 h-5 text-green-500" />
                    </div>
                    Winners
                  </h2>
                  <motion.div 
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 gap-6"
                  >
                    {winners.map((winner, index) => (
                      <motion.div
                        key={winner.id}
                        variants={fadeInUp}
                        whileHover={{ y: -5 }}
                      >
                        <Card className={`p-6 relative overflow-hidden ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-500/50' :
                          index === 1 ? 'bg-gradient-to-br from-gray-400/20 to-gray-500/10 border-gray-400/50' :
                          index === 2 ? 'bg-gradient-to-br from-orange-600/20 to-orange-700/10 border-orange-600/50' :
                          'bg-card/50 border-border'
                        }`}>
                          <div className="flex items-start gap-4">
                            <div className="text-4xl">
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏆'}
                            </div>
                            <div className="flex-1">
                              <span className="text-sm font-semibold text-primary">{winner.position}</span>
                              <h3 className="font-bold text-xl">{winner.team_name}</h3>
                              <p className="text-lg text-muted-foreground">{winner.project_name}</p>
                              {winner.project_description && (
                                <p className="text-sm text-muted-foreground mt-2">{winner.project_description}</p>
                              )}
                              {winner.members && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  <span className="text-foreground">Team:</span> {winner.members}
                                </p>
                              )}
                              {winner.prize_won && (
                                <p className="text-primary font-bold mt-2">{winner.prize_won}</p>
                              )}
                              <div className="flex gap-3 mt-4">
                                {winner.github_url && (
                                  <a href={winner.github_url} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="sm">
                                      <Github className="w-4 h-4 mr-1" /> GitHub
                                    </Button>
                                  </a>
                                )}
                                {winner.project_url && (
                                  <a href={winner.project_url} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="sm">
                                      <ExternalLink className="w-4 h-4 mr-1" /> Demo
                                    </Button>
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </section>
            )}

            {/* FAQs Section */}
            {faqs.length > 0 && (
              <section id="faqs" ref={faqSectionRef}>
                <motion.div {...fadeInUp}>
                  <h2 className="text-3xl font-bold font-display mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-purple-500" />
                    </div>
                    Frequently Asked Questions
                  </h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {faqs.map((faq, index) => (
                      <motion.div
                        key={faq.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <AccordionItem value={faq.id} className="border border-border rounded-lg px-6 bg-card/50 backdrop-blur-sm">
                          <AccordionTrigger className="text-left font-semibold hover:text-primary">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      </motion.div>
                    ))}
                  </Accordion>
                </motion.div>
              </section>
            )}
          </div>

          {/* Sidebar - hidden on mobile */}
          <div className="hidden lg:block space-y-6">
            <motion.div
              ref={sidebarRef}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className={sidebarSticky ? "sticky top-32" : ""}
            >
              <Card className="p-6 bg-card/80 backdrop-blur-sm border-border">
                <h3 className="text-xl font-bold font-display mb-6">Event Details</h3>

                <div className="space-y-5">
                  {event.event_date && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Date</p>
                        <p className="font-semibold">{format(new Date(event.event_date), "PPP")}</p>
                      </div>
                    </div>
                  )}

                  {event.timing && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Time</p>
                        <p className="font-semibold">{event.timing}</p>
                      </div>
                    </div>
                  )}

                  {event.location_name && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Location</p>
                        <p className="font-semibold">{event.location_name}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Registrations</p>
                      <p className="font-semibold">{event.registration_count}+ Participants</p>
                    </div>
                  </div>

                  {event.registration_deadline && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Registration Deadline</p>
                        <p className="font-semibold">{format(new Date(event.registration_deadline), "PPP")}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 space-y-3">
                  {canRegister && event.external_link ? (
                    <a href={event.external_link} target="_blank" rel="noopener noreferrer" className="block">
                      <Button variant="hero" size="lg" className="w-full">
                        Register Now <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </a>
                  ) : canRegister ? (
                    <Link to={`/events/${event.id}/register`} className="block">
                      <Button variant="hero" size="lg" className="w-full">
                        Register Now
                      </Button>
                    </Link>
                  ) : isEventCompleted && event.external_link ? (
                    <a href={event.external_link} target="_blank" rel="noopener noreferrer" className="block">
                      <Button variant="outline" size="lg" className="w-full">
                        View Event <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </a>
                  ) : isEventCompleted ? (
                    <Button variant="outline" size="lg" className="w-full" disabled>
                      Event Completed
                    </Button>
                  ) : (
                    <Button variant="outline" size="lg" className="w-full" disabled>
                      Registration Closed
                    </Button>
                  )}
                </div>

                {isRegistrationClosed && !isEventCompleted && (
                  <p className="text-sm text-destructive mt-3 text-center">
                    Registration deadline has passed
                  </p>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Register Button */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-background border-t border-border p-4 z-50">
        <div className="container-custom">
          {canRegister && event.external_link ? (
            <a href={event.external_link} target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="hero" size="lg" className="w-full uppercase font-bold tracking-wide">
                Register Now <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          ) : canRegister ? (
            <Link to={`/events/${event.id}/register`} className="block">
              <Button variant="hero" size="lg" className="w-full uppercase font-bold tracking-wide">
                Register Now
              </Button>
            </Link>
          ) : isEventCompleted && event.external_link ? (
            <a href={event.external_link} target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="outline" size="lg" className="w-full">
                View Event <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          ) : isEventCompleted ? (
            <Button variant="outline" size="lg" className="w-full" disabled>
              Event Completed
            </Button>
          ) : (
            <Button variant="outline" size="lg" className="w-full" disabled>
              Registration Closed
            </Button>
          )}
        </div>
      </div>

      <Footer />

      {/* Challenge Detail Dialog */}
      <Dialog open={!!selectedChallenge} onOpenChange={() => setSelectedChallenge(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader className="border-b border-border pb-4">
            <DialogTitle className="text-xl font-bold pr-8">Problem Statement in detail</DialogTitle>
          </DialogHeader>
          {selectedChallenge && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6 py-4">
                <h2 className="text-2xl font-bold text-center">{selectedChallenge.title}</h2>
                
                {selectedChallenge.detailed_description ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {selectedChallenge.detailed_description.split('\n').map((paragraph, idx) => (
                      <p key={idx} className="text-muted-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : selectedChallenge.description ? (
                  <p className="text-muted-foreground leading-relaxed">{selectedChallenge.description}</p>
                ) : (
                  <p className="text-muted-foreground text-center italic">No detailed description available.</p>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HackathonDetail;