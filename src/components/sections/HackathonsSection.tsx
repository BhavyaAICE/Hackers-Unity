import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Trophy, Users, ArrowRight, ArrowUpRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/apiClient";
import { format, isPast, differenceInDays } from "date-fns";
import type { ApiEvent } from "@/types/api.types";

const HackathonsSection = () => {
  const [hackathons, setHackathons] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const { events: data } = await api.get<{ events: ApiEvent[] }>("/api/hackathons");
        setHackathons(data.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch hackathons:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHackathons();
  }, []);

  // Helper to determine hackathon status
  const getHackathonStatus = (hackathon: ApiEvent) => {
    const eventEnd = hackathon.eventEndDate ? new Date(hackathon.eventEndDate) : null;
    const registrationDeadline = hackathon.registrationDeadline ? new Date(hackathon.registrationDeadline) : null;
    const eventStart = hackathon.eventDate ? new Date(hackathon.eventDate) : null;

    if (hackathon.status === 'completed' || (eventEnd && isPast(eventEnd))) {
      return { status: 'completed', label: 'Completed', canRegister: false };
    }
    if (registrationDeadline && isPast(registrationDeadline)) {
      return { status: 'closed', label: 'Registration Closed', canRegister: false };
    }
    if (hackathon.registrationEnabled && registrationDeadline && !isPast(registrationDeadline)) {
      return { status: 'registering', label: 'Upcoming', canRegister: true };
    }
    if (eventStart && !isPast(eventStart)) {
      return { status: 'coming_soon', label: 'Coming Soon', canRegister: false };
    }
    return { status: 'unknown', label: 'TBA', canRegister: false };
  };

  const getDaysLeft = (deadline: string | null | undefined) => {
    if (!deadline) return null;
    const days = differenceInDays(new Date(deadline), new Date());
    return days > 0 ? days : null;
  };

  const getField = (h: ApiEvent, ...fields: string[]) => {
    for (const f of fields) if ((h as any)[f]) return (h as any)[f];
    return undefined;
  };

  // Don't render the section if there are no hackathons
  if (!loading && hackathons.length === 0) {
    return null;
  }

  const handleCardClick = (hackathon: ApiEvent, statusInfo: ReturnType<typeof getHackathonStatus>) => {
    if (statusInfo.status === 'completed' && hackathon.externalLink) {
      window.open(hackathon.externalLink, '_blank');
      return;
    }
    navigate(`/hackathon/${hackathon._id}`);
  };

  const handleRegisterClick = (e: React.MouseEvent, hackathon: ApiEvent) => {
    e.stopPropagation();
    if (hackathon.externalLink) {
      window.open(hackathon.externalLink, '_blank');
    } else {
      navigate(`/events/${hackathon._id}/register`);
    }
  };

  return (
    <section className="py-24 bg-transparent" id="hackathons">
      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-primary text-sm font-semibold uppercase tracking-wider"
            >
              Hackathons
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mt-4"
            >
              Innovation <span className="text-primary">Showcase</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/all-hackathons">
              <Button variant="outline" size="lg">
                View All Hackathons
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-xl aspect-[16/10]" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hackathons.map((hackathon, index) => {
              const statusInfo = getHackathonStatus(hackathon);
              const daysLeft = getDaysLeft(hackathon.registrationDeadline);

              return (
                <motion.div
                  key={hackathon._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onClick={() => handleCardClick(hackathon, statusInfo)}
                >
                  <Card variant="elevated" className="overflow-hidden group h-full flex flex-col">
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      {(hackathon.thumbnailImage || hackathon.bannerImage) ? (
                        <img
                          src={hackathon.thumbnailImage || hackathon.bannerImage || ''}
                          alt={hackathon.title}
                          width={400}
                          height={250}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <Trophy className="w-12 h-12 text-primary/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

                      {/* Status badge */}
                      <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.status === 'completed'
                        ? 'bg-muted text-muted-foreground'
                        : statusInfo.status === 'registering'
                          ? 'bg-green-500/90 text-white'
                          : statusInfo.status === 'closed'
                            ? 'bg-red-500/90 text-white'
                            : 'bg-primary/90 text-primary-foreground'
                        }`}>
                        {statusInfo.label}
                      </span>

                      {/* Days left badge */}
                      {daysLeft && statusInfo.canRegister && (
                        <span className="absolute top-4 right-4 px-2 py-1 rounded-full bg-orange-500/90 text-white text-xs font-semibold">
                          {daysLeft}d left
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-display font-semibold text-lg mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {hackathon.title}
                      </h3>
                      <div className="space-y-2 text-sm text-muted-foreground flex-1">
                        {hackathon.eventDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            {format(new Date(hackathon.eventDate), "MMM dd, yyyy")}
                          </div>
                        )}
                        {hackathon.locationName && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            {hackathon.locationName}
                          </div>
                        )}
                        {hackathon.prizePool && (
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-primary" />
                            {hackathon.prizePool}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          {hackathon.registrationCount}+ Registered
                        </div>
                      </div>

                      <div className="mt-4">
                        {statusInfo.canRegister ? (
                          <Button
                            variant="hero"
                            size="sm"
                            className="w-full"
                            onClick={(e) => handleRegisterClick(e, hackathon)}
                          >
                            Register Now
                            {hackathon.externalLink && <ArrowUpRight className="w-3.5 h-3.5 ml-1" />}
                          </Button>
                        ) : statusInfo.status === 'completed' ? (
                          <Button variant="outline" size="sm" className="w-full">
                            View Details
                            {hackathon.externalLink && <ArrowUpRight className="w-3.5 h-3.5 ml-1" />}
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="w-full">
                            View Details
                          </Button>
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
  );
};

export default HackathonsSection;