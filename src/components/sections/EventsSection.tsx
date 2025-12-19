import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  subtitle: string | null;
  event_type: string;
  event_date: string | null;
  location_name: string | null;
  registration_count: number;
  thumbnail_image: string | null;
  status: string;
}

const EventsSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .neq("event_type", "hackathon")
        .order("event_date", { ascending: false })
        .limit(4);

      if (!error && data) {
        setEvents(data);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  return (
    <section className="py-24 bg-muted/30" id="events">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-primary text-sm font-semibold uppercase tracking-wider"
            >
              Our Events
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mt-4"
            >
              Events <span className="text-primary">Gallery</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Button variant="outline" size="lg">
              View All Events
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No events available at the moment</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link to={`/events/${event.id}`}>
                  <Card variant="elevated" className="overflow-hidden group h-full">
                    <div className="relative h-48 overflow-hidden">
                      {event.thumbnail_image ? (
                        <img
                          src={event.thumbnail_image}
                          alt={event.title}
                          width={400}
                          height={192}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-semibold capitalize">
                        {event.event_type}
                      </span>
                    </div>

                    <div className="p-5">
                      <h3 className="font-display font-semibold text-lg mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {event.title}
                      </h3>
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
                      <Button variant="default" size="sm" className="w-full mt-4">
                        View Details
                      </Button>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
