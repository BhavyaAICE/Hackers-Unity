import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Ticket, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { ApiEventRegistration, ApiEvent } from "@/types/api.types";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<ApiEventRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!user) return;
      try {
        const { registrations: data } = await api.get<{ registrations: ApiEventRegistration[] }>(
          "/api/events/my/registrations"
        );
        setRegistrations(data);
      } catch (err) {
        console.error("Failed to fetch registrations:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchRegistrations();
  }, [user]);

  // Helper to get populated event object
  const getEvent = (reg: ApiEventRegistration) =>
    typeof reg.event === "object" ? (reg.event as ApiEvent) : null;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "registered": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "cancelled": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "attended": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-primary/10 text-primary border-primary/20";
      case "ongoing": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "completed": return "bg-muted text-muted-foreground border-border";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container-custom">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground">
              My Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {user?.fullName || user?.email}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <Card className="bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Ticket className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{registrations.length}</p>
                    <p className="text-sm text-muted-foreground">Total Registrations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <Calendar className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {registrations.filter(r => getEvent(r)?.status === "upcoming").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Upcoming Events</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <Clock className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {registrations.filter(r => getEvent(r)?.status === "completed").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Events Attended</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Registrations List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-xl font-display">My Registered Events</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : registrations.length === 0 ? (
                  <div className="text-center py-12">
                    <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No registrations yet</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't registered for any events yet.
                    </p>
                    <Button onClick={() => navigate("/#events")}>Explore Events</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {registrations.map((registration, index) => {
                      const ev = getEvent(registration);
                      return (
                        <motion.div
                          key={registration._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border border-border/50 bg-background/50 hover:border-primary/30 transition-colors"
                        >
                          {/* Event Thumbnail */}
                          <div className="w-full md:w-32 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={ev?.thumbnailImage || "/placeholder.svg"}
                              alt={ev?.title || "Event"}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Event Details */}
                          <div className="flex-1">
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Badge variant="outline" className={getEventStatusColor(ev?.status || "")}>
                                {ev?.status || "Unknown"}
                              </Badge>
                              <Badge variant="outline" className={getStatusColor(registration.status || "")}>
                                {registration.status || "Registered"}
                              </Badge>
                              <Badge variant="outline" className="bg-muted/50">
                                {ev?.eventType || "Event"}
                              </Badge>
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-1">
                              {ev?.title || "Unknown Event"}
                            </h3>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              {ev?.eventDate && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {format(new Date(ev.eventDate), "MMM d, yyyy")}
                                </span>
                              )}
                              {ev?.locationName && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {ev.locationName}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action */}
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (ev?.eventType === "hackathon") {
                                  navigate(`/hackathons/${ev._id}`);
                                } else {
                                  navigate(`/events/${ev?._id}`);
                                }
                              }}
                            >
                              View Event
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
