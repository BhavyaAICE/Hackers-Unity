import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/apiClient";
import { format, isPast, addDays } from "date-fns";
import { Calendar, MapPin, Clock, Users, ArrowLeft, CheckCircle, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { ApiEvent, ApiSpeaker, ApiScheduleItem } from "@/types/api.types";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchEventData();
  }, [id]);

  const fetchEventData = async () => {
    if (!id) return;
    try {
      const { event: data } = await api.get<{ event: ApiEvent }>(`/api/events/${id}`);
      setEvent(data);
    } catch {
      toast.error("Event not found");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container-custom py-24 text-center">
          <p>Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container-custom py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Event not found</h1>
          <Link to="/"><Button variant="hero">Back to Home</Button></Link>
        </div>
      </div>
    );
  }

  const isRegistrationClosed = event.registrationDeadline
    ? isPast(new Date(event.registrationDeadline))
    : false;

  const isEventCompleted = event.eventEndDate
    ? isPast(new Date(event.eventEndDate))
    : event.eventDate
      ? isPast(new Date(event.eventDate))
      : false;

  const canRegister = event.registrationEnabled && !isRegistrationClosed && !isEventCompleted;

  const speakers: ApiSpeaker[] = event.speakers || [];
  const scheduleItems: ApiScheduleItem[] = event.scheduleItems || [];

  const groupedSchedule = scheduleItems.reduce((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {} as Record<number, ApiScheduleItem[]>);

  const getDateForDay = (day: number) => {
    if (!event.eventDate) return "";
    return format(addDays(new Date(event.eventDate), day - 1), "dd MMMM, yyyy");
  };

  const getSpeakerName = (speaker: ApiSpeaker | string | null | undefined) => {
    if (!speaker) return null;
    if (typeof speaker === "string") return null;
    return (speaker as ApiSpeaker).name;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative pt-32 pb-20 overflow-hidden">
        {event.bannerImage && (
          <>
            <div className="absolute inset-0 bg-muted">
              <img src={event.bannerImage} alt={event.title} className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
          </>
        )}
        {!event.bannerImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary" />
        )}

        <div className="container-custom relative z-10">
          <Link to="/">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>

          <div className="max-w-4xl">
            <span className="text-xs font-semibold uppercase px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
              {event.eventType}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-4">{event.title}</h1>
            {event.subtitle && <p className="text-xl text-white/90 mb-8">{event.subtitle}</p>}

            <div className="flex flex-wrap gap-4 text-white/90 mt-6">
              {event.eventDate && (
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <Calendar className="w-5 h-5" />
                  <span>{format(new Date(event.eventDate), "PPP")}</span>
                </div>
              )}
              {event.timing && (
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <Clock className="w-5 h-5" />
                  <span>{event.timing}</span>
                </div>
              )}
              {event.locationName && (
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <MapPin className="w-5 h-5" />
                  <span>{event.locationName}</span>
                </div>
              )}
              {event.durationDays && event.durationDays > 1 && (
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <Calendar className="w-5 h-5" />
                  <span>{event.durationDays} Days</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {event.description && (
                <div>
                  <h2 className="text-2xl font-bold font-display mb-4">About</h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                  </div>
                </div>
              )}

              {event.benefits && event.benefits.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold font-display mb-6">Benefits</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {event.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-card rounded-lg border border-border">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {speakers.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold font-display mb-6">Speakers</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {speakers.map((speaker) => (
                      <div key={speaker._id} className="p-6 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors">
                        <div className="flex items-start gap-4">
                          {speaker.avatarUrl && (
                            <img src={speaker.avatarUrl} alt={speaker.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-foreground">{speaker.name}</h3>
                              {speaker.linkedinUrl && (
                                <a href={speaker.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors" title="View LinkedIn Profile">
                                  <Linkedin className="w-5 h-5" />
                                </a>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{speaker.title}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {scheduleItems.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold font-display mb-6">Schedule</h2>
                  <div className="space-y-8">
                    {Object.entries(groupedSchedule).map(([day, items]) => (
                      <div key={day}>
                        <div className="bg-blue-600 text-white rounded-lg p-4 mb-6 text-center inline-block">
                          <h3 className="font-bold">Day {day} {getDateForDay(parseInt(day))}</h3>
                        </div>
                        <div className="space-y-6">
                          {items.map((item) => {
                            const itemSpeaker = typeof item.speaker === "object" ? item.speaker as ApiSpeaker : null;
                            return (
                              <div key={item._id} className="p-6 bg-card rounded-lg border border-border">
                                <div className="flex items-start gap-3 mb-3">
                                  <Clock className="w-5 h-5 text-foreground flex-shrink-0 mt-0.5" />
                                  <span className="font-bold text-foreground">
                                    {item.startTime} - {item.endTime}
                                  </span>
                                </div>
                                <h4 className="font-bold text-lg text-foreground mb-3">{item.title}</h4>
                                {item.description && (
                                  <p className="text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
                                )}
                                {itemSpeaker && (
                                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                                    {itemSpeaker.avatarUrl && (
                                      <img src={itemSpeaker.avatarUrl} alt={itemSpeaker.name} className="w-12 h-12 rounded-full object-cover" />
                                    )}
                                    <div>
                                      <p className="font-bold text-foreground">{itemSpeaker.name}</p>
                                      <p className="text-sm text-muted-foreground">{itemSpeaker.title}</p>
                                      {itemSpeaker.linkedinUrl && (
                                        <a href={itemSpeaker.linkedinUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block">
                                          <Linkedin className="w-4 h-4 text-primary" />
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-card p-6 rounded-2xl border border-border sticky top-24">
                <h3 className="text-xl font-bold font-display mb-4">Event Details</h3>
                <div className="space-y-4">
                  {event.timing && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-semibold">{event.timing}</p>
                      </div>
                    </div>
                  )}
                  {event.durationDays && event.durationDays > 0 && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-semibold">{event.durationDays} {event.durationDays === 1 ? 'Day' : 'Days'}</p>
                      </div>
                    </div>
                  )}
                  {event.locationName && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-semibold">{event.locationName}</p>
                      </div>
                    </div>
                  )}
                  {speakers.length > 0 && (
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Speakers</p>
                        <p className="font-semibold">{speakers.length} {speakers.length === 1 ? 'Speaker' : 'Speakers'}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Registrations</p>
                      <p className="font-semibold">{event.registrationCount}</p>
                    </div>
                  </div>
                  {event.registrationDeadline && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Registration Deadline</p>
                        <p className="font-semibold">{format(new Date(event.registrationDeadline), "PPP")}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  {isEventCompleted ? (
                    event.externalLink ? (
                      <a href={event.externalLink} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="lg" className="w-full">View on External Site</Button>
                      </a>
                    ) : (
                      <Button variant="outline" size="lg" className="w-full" disabled>Event Completed</Button>
                    )
                  ) : canRegister ? (
                    event.externalLink ? (
                      <a href={event.externalLink} target="_blank" rel="noopener noreferrer">
                        <Button variant="hero" size="lg" className="w-full">Register Now</Button>
                      </a>
                    ) : (
                      <Link to={`/events/${event._id}/register`}>
                        <Button variant="hero" size="lg" className="w-full">Register Now</Button>
                      </Link>
                    )
                  ) : isRegistrationClosed ? (
                    <Button variant="outline" size="lg" className="w-full" disabled>Registration Closed</Button>
                  ) : (
                    <Button variant="outline" size="lg" className="w-full" disabled>Registration Disabled</Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EventDetail;
