import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Trophy, Clock, Users, ArrowLeft, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { format, isPast, differenceInDays } from "date-fns";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Hackathon {
  id: string;
  title: string;
  subtitle: string | null;
  event_date: string | null;
  event_end_date: string | null;
  registration_deadline: string | null;
  location_name: string | null;
  prize_pool: string | null;
  registration_count: number;
  thumbnail_image: string | null;
  banner_image: string | null;
  status: string | null;
  registration_enabled: boolean;
  external_link: string | null;
}

const AllHackathons = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("event_type", "hackathon")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setHackathons(data);
    }
    setLoading(false);
  };

  const getHackathonStatus = (hackathon: Hackathon) => {
    const eventEndDate = hackathon.event_end_date || hackathon.event_date;
    if (eventEndDate && isPast(new Date(eventEndDate))) {
      return { status: "completed", label: "Completed", canRegister: false };
    }

    if (hackathon.registration_deadline && isPast(new Date(hackathon.registration_deadline))) {
      return { status: "registration-closed", label: "Registration Closed", canRegister: false };
    }

    if (hackathon.registration_enabled) {
      return { status: "registering", label: "Register Now", canRegister: true };
    }

    return { status: "coming-soon", label: "Coming Soon", canRegister: false };
  };

  const getDaysLeft = (deadline: string | null) => {
    if (!deadline) return null;
    const days = differenceInDays(new Date(deadline), new Date());
    return days > 0 ? days : null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-br from-primary/20 via-background to-secondary/20">
        <div className="container-custom relative z-10">
          <Link to="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
              All <span className="text-primary">Hackathons</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover all the hackathons we've organized. From upcoming events to past success stories.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Hackathons Grid */}
      <section className="py-16">
        <div className="container-custom">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : hackathons.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No hackathons available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hackathons.map((hackathon, index) => {
                const { status, canRegister } = getHackathonStatus(hackathon);
                const daysLeft = getDaysLeft(hackathon.registration_deadline);
                const imageUrl = hackathon.thumbnail_image || hackathon.banner_image;

                return (
                  <motion.div
                    key={hackathon.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Card variant="elevated" className="overflow-hidden group h-full flex flex-col">
                      {/* Image */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={hackathon.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

                        {/* Countdown Badge */}
                        {daysLeft && status === "registering" && (
                          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm">
                            <Clock className="w-3.5 h-3.5 text-accent" />
                            <span className="text-xs font-semibold text-accent">{daysLeft} days left</span>
                          </div>
                        )}

                        {/* Status Badge */}
                        <div
                          className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold ${
                            status === "registering"
                              ? "bg-primary text-primary-foreground"
                              : status === "completed"
                              ? "bg-green-500 text-white"
                              : status === "registration-closed"
                              ? "bg-destructive text-destructive-foreground"
                              : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          {status === "completed"
                            ? "Completed"
                            : status === "registration-closed"
                            ? "Closed"
                            : status === "registering"
                            ? "Upcoming"
                            : "Coming Soon"}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        {hackathon.subtitle && (
                          <p className="text-xs text-muted-foreground mb-1">{hackathon.subtitle}</p>
                        )}
                        <h3 className="font-display font-semibold text-xl mb-4 text-foreground group-hover:text-primary transition-colors">
                          {hackathon.title}
                        </h3>

                        <div className="space-y-2 text-sm text-muted-foreground flex-1">
                          {hackathon.event_date && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-primary" />
                              {format(new Date(hackathon.event_date), "MMM d, yyyy")}
                            </div>
                          )}
                          {hackathon.location_name && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary" />
                              {hackathon.location_name}
                            </div>
                          )}
                          {hackathon.prize_pool && (
                            <div className="flex items-center gap-2">
                              <Trophy className="w-4 h-4 text-primary" />
                              Prize Pool: {hackathon.prize_pool}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" />
                            {hackathon.registration_count}+ Participants
                          </div>
                        </div>

                        {/* Button with external link support */}
                        <div className="mt-6">
                          {hackathon.external_link ? (
                            status === "completed" ? (
                              <a href={hackathon.external_link} target="_blank" rel="noopener noreferrer" className="block">
                                <Button variant="outline" className="w-full">
                                  View Details
                                  <ArrowUpRight className="w-4 h-4 ml-1" />
                                </Button>
                              </a>
                            ) : canRegister ? (
                              <a href={hackathon.external_link} target="_blank" rel="noopener noreferrer" className="block">
                                <Button variant="hero" className="w-full">
                                  Register Now
                                  <ArrowUpRight className="w-4 h-4 ml-1" />
                                </Button>
                              </a>
                            ) : (
                              <Link to={`/hackathon/${hackathon.id}`}>
                                <Button variant="outline" className="w-full">
                                  View Details
                                </Button>
                              </Link>
                            )
                          ) : (
                            <Link to={`/hackathon/${hackathon.id}`}>
                              <Button
                                variant={canRegister ? "hero" : "outline"}
                                className="w-full"
                              >
                                {status === "completed"
                                  ? "View Details"
                                  : status === "registration-closed"
                                  ? "View Details"
                                  : canRegister
                                  ? "Register Now"
                                  : "Notify Me"}
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AllHackathons;
