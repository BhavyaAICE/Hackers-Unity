import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/apiClient";
import { format } from "date-fns";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { ApiEvent } from "@/types/api.types";

const AllEvents = () => {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { events: data } = await api.get<{ events: ApiEvent[] }>("/api/events");
      // Filter out hackathon-type events (same logic as before)
      setEvents(data.filter((e) => e.eventType !== "hackathon"));
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
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
                const imageUrl = event.thumbnailImage || event.bannerImage;

                return (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link to={`/events/${event._id}`}>
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
                            {event.eventType}
                          </span>
                          <span
                            className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${event.status === "upcoming"
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
