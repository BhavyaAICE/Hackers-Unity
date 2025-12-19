import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Trophy, Clock, ArrowRight, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { format, isPast, differenceInDays } from "date-fns";

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
}

const HackathonsSection = () => {
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
      .order("event_date", { ascending: true })
      .limit(4);

    if (!error && data) {
      setHackathons(data);
    }
    setLoading(false);
  };

  const getHackathonStatus = (hackathon: Hackathon) => {
    const now = new Date();
    
    // Check if event is completed
    const eventEndDate = hackathon.event_end_date || hackathon.event_date;
    if (eventEndDate && isPast(new Date(eventEndDate))) {
      return { status: 'completed', label: 'Completed', canRegister: false };
    }

    // Check if registration is closed
    if (hackathon.registration_deadline && isPast(new Date(hackathon.registration_deadline))) {
      return { status: 'registration-closed', label: 'Registration Closed', canRegister: false };
    }

    // Registration is open
    if (hackathon.registration_enabled) {
      return { status: 'registering', label: 'Register Now', canRegister: true };
    }

    return { status: 'coming-soon', label: 'Coming Soon', canRegister: false };
  };

  const getDaysLeft = (deadline: string | null) => {
    if (!deadline) return null;
    const days = differenceInDays(new Date(deadline), new Date());
    return days > 0 ? days : null;
  };

  if (loading) {
    return (
      <section className="py-24 bg-muted/30" id="hackathons">
        <div className="container-custom">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-64 bg-muted rounded" />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 bg-muted rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (hackathons.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-muted/30" id="hackathons">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-primary text-sm font-semibold uppercase tracking-wider"
            >
              Our Hackathons
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mt-4"
            >
              Hackathons <span className="text-primary">Showcase</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/hackathons">
              <Button variant="outline" size="lg">
                Discover All Hackathons
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Hackathons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hackathons.map((hackathon, index) => {
            const { status, label, canRegister } = getHackathonStatus(hackathon);
            const daysLeft = getDaysLeft(hackathon.registration_deadline);
            const imageUrl = hackathon.thumbnail_image || hackathon.banner_image;

            return (
              <motion.div
                key={hackathon.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card variant="neon" className="overflow-hidden group h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={hackathon.title}
                        width={400}
                        height={160}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                    
                    {/* Countdown Badge */}
                    {daysLeft && status === 'registering' && (
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm">
                        <Clock className="w-3.5 h-3.5 text-accent" />
                        <span className="text-xs font-semibold text-accent">{daysLeft} days left</span>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
                      status === 'registering' 
                        ? 'bg-primary text-primary-foreground' 
                        : status === 'completed'
                        ? 'bg-green-500 text-white'
                        : status === 'registration-closed'
                        ? 'bg-destructive text-destructive-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {status === 'completed' ? 'Completed' : 
                       status === 'registration-closed' ? 'Closed' :
                       status === 'registering' ? 'Open' : 'Coming Soon'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    {hackathon.subtitle && (
                      <p className="text-xs text-muted-foreground mb-1">{hackathon.subtitle}</p>
                    )}
                    <h3 className="font-display font-semibold text-lg mb-3 text-foreground group-hover:text-primary transition-colors">
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

                    <Link to={`/hackathon/${hackathon.id}`}>
                      <Button 
                        variant={canRegister ? 'hero' : 'outline'} 
                        size="sm" 
                        className="w-full mt-4"
                      >
                        {status === 'completed' ? 'View Details' : 
                         status === 'registration-closed' ? 'View Details' :
                         canRegister ? 'Register Now' : 'Notify Me'}
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HackathonsSection;