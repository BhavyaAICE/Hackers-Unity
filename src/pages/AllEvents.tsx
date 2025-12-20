import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Event {
  id: string;
  title: string;
  subtitle: string | null;
  event_type: string;
  event_date: string | null;
  location_name: string | null;
  registration_count: number;
  thumbnail_image: string | null;
  banner_image: string | null;
  status: string;
}

const AllEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .neq("event_type", "hackathon")
      .order("event_date", { ascending: false });

    if (!error && data) {
      setEvents(data);
    }
    setLoading(false);
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
              All <span className="text-primary">Events</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explore all our conferences, workshops, meetups, and bootcamps. Join us in building the developer community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="container-custom">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No events available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => {
                const imageUrl = event.thumbnail_image || event.banner_image;

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link to={`/events/${event.id}`}>
                      <Card variant="elevated" className="overflow-hidden group h-full">
                        <div className="relative h-52 overflow-hidden">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={event.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                          <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-semibold capitalize">
                            {event.event_type}
                          </span>
                          <span
                            className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                              event.status === "upcoming"
                                ? "bg-green-500/90 text-white"
                                : event.status === "ongoing"
                                ? "bg-blue-500/90 text-white"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {event.status}
                          </span>
                        </div>

                        <div className="p-6">
                          <h3 className="font-display font-semibold text-xl mb-4 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {event.title}
                          </h3>
                          {event.subtitle && (
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {event.subtitle}
                            </p>
                          )}
                          <div className="space-y-2 text-sm text-muted-foreground">
                            {event.event_date && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                {format(new Date(event.event_date), "MMM dd, yyyy")}
                              </div>
                            )}
                            {event.location_name && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                {event.location_name}
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-primary" />
                              {event.registration_count} Registered
                            </div>
                          </div>
                          <Button variant="default" className="w-full mt-6">
                            View Details
                          </Button>
                        </div>
                      </Card>
                    </Link>
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

export default AllEvents;
