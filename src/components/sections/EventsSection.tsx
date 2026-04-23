import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/apiClient";
import { format } from "date-fns";
import type { ApiEvent } from "@/types/api.types";

const EventsSection = () => {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { events: data } = await api.get<{ events: ApiEvent[] }>("/api/events?limit=4");
        setEvents(data.filter(e => e.eventType !== "hackathon").slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Don't render the section if there are no events
  if (!loading && events.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-transparent" id="events">
      <div className="container-custom relative z-10">
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
            <Link to="/all-events">
              <Button variant="outline" size="lg">
                View All Events
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event, index) => {
              const isExternalCompleted = event.externalLink && event.status === 'completed';
              const cardContent = (
                <Card variant="elevated" className="overflow-hidden group h-full">
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    {(event.thumbnailImage || event.bannerImage) ? (
                      <img
                        src={event.thumbnailImage || event.bannerImage || ''}
                        alt={event.title}
                        width={400}
                        height={250}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-semibold capitalize">
                      {event.eventType}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-display font-semibold text-lg mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {event.eventDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          {format(new Date(event.eventDate), "MMM dd, yyyy")}
                        </div>
                      )}
                      {event.locationName && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          {event.locationName}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        {event.registrationCount} Registered
                      </div>
                    </div>
                    <Button variant="default" size="sm" className="w-full mt-4">
                      View Details
                    </Button>
                  </div>
                </Card>
              );

              return (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {isExternalCompleted ? (
                    <a href={event.externalLink!} target="_blank" rel="noopener noreferrer">
                      {cardContent}
                    </a>
                  ) : (
                    <Link to={`/events/${event._id}`}>
                      {cardContent}
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
