import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { ImageUpload } from "@/components/ui/image-upload";

interface Speaker {
  id?: string;
  name: string;
  title: string;
  avatar_url: string;
  linkedin_url: string;
}

interface ScheduleItem {
  id?: string;
  day: number;
  start_time: string;
  end_time: string;
  title: string;
  description: string;
  speaker_index: number;
}

const EventForm = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [useSameAsThumbnail, setUseSameAsThumbnail] = useState(true);
  const [bannerAltText, setBannerAltText] = useState("");
  const [thumbnailAltText, setThumbnailAltText] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    event_type: "conference",
    status: "upcoming",
    event_date: "",
    event_end_date: "",
    registration_deadline: "",
    duration_days: 1,
    timing: "",
    location_type: "online",
    location_name: "",
    location_address: "",
    banner_image: "",
    thumbnail_image: "",
    registration_enabled: true,
    benefits_text: "",
    external_link: "",
  });

  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [speakerAltTexts, setSpeakerAltTexts] = useState<string[]>([]);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      toast.error("Failed to fetch event");
      return;
    }

    setFormData({
      title: data.title || "",
      subtitle: data.subtitle || "",
      description: data.description || "",
      event_type: data.event_type || "conference",
      status: data.status || "upcoming",
      event_date: data.event_date ? new Date(data.event_date).toISOString().slice(0, 16) : "",
      event_end_date: data.event_end_date ? new Date(data.event_end_date).toISOString().slice(0, 16) : "",
      registration_deadline: data.registration_deadline ? new Date(data.registration_deadline).toISOString().slice(0, 16) : "",
      duration_days: data.duration_days || 1,
      timing: data.timing || "",
      location_type: data.location_type || "online",
      location_name: data.location_name || "",
      location_address: data.location_address || "",
      banner_image: data.banner_image || "",
      thumbnail_image: data.thumbnail_image || "",
      registration_enabled: data.registration_enabled ?? true,
      benefits_text: data.benefits_text || "",
      external_link: data.external_link || "",
    });

    const { data: existingSpeakers } = await supabase
      .from("event_speakers")
      .select(`
        id,
        speaker_id,
        speakers (
          id,
          name,
          title,
          avatar_url,
          linkedin_url
        )
      `)
      .eq("event_id", id)
      .order("display_order");

    if (existingSpeakers) {
      setSpeakers(
        existingSpeakers.map((es: any) => ({
          id: es.speaker_id,
          name: es.speakers.name || "",
          title: es.speakers.title || "",
          avatar_url: es.speakers.avatar_url || "",
          linkedin_url: es.speakers.linkedin_url || "",
        }))
      );
    }

    const { data: existingSchedule } = await supabase
      .from("schedule_items")
      .select("*")
      .eq("event_id", id)
      .order("display_order");

    if (existingSchedule) {
      setScheduleItems(
        existingSchedule.map((item: any) => {
          let speakerIndex = -1;
          if (item.speaker_id && existingSpeakers) {
            speakerIndex = existingSpeakers.findIndex((es: any) => es.speaker_id === item.speaker_id);
          }
          return {
            id: item.id,
            day: item.day || 1,
            start_time: item.start_time || "",
            end_time: item.end_time || "",
            title: item.title || "",
            description: item.description || "",
            speaker_index: speakerIndex,
          };
        })
      );
    }
  };

  const addSpeaker = () => {
    setSpeakers([...speakers, { name: "", title: "", avatar_url: "", linkedin_url: "" }]);
    setSpeakerAltTexts([...speakerAltTexts, ""]);
  };

  const removeSpeaker = (index: number) => {
    setSpeakers(speakers.filter((_, i) => i !== index));
    setSpeakerAltTexts(speakerAltTexts.filter((_, i) => i !== index));
  };

  const updateSpeaker = (index: number, field: keyof Speaker, value: string) => {
    const updated = [...speakers];
    updated[index][field] = value as never;
    setSpeakers(updated);
  };

  const addScheduleItem = () => {
    setScheduleItems([
      ...scheduleItems,
      { day: 1, start_time: "", end_time: "", title: "", description: "", speaker_index: -1 },
    ]);
  };

  const removeScheduleItem = (index: number) => {
    setScheduleItems(scheduleItems.filter((_, i) => i !== index));
  };

  const updateScheduleItem = (index: number, field: keyof ScheduleItem, value: string | number) => {
    const updated = [...scheduleItems];
    updated[index][field] = value as never;
    setScheduleItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventData = {
        title: formData.title,
        subtitle: formData.subtitle || null,
        description: formData.description || null,
        event_type: formData.event_type,
        status: formData.status,
        event_date: formData.event_date || null,
        event_end_date: formData.event_end_date || null,
        registration_deadline: formData.registration_deadline || null,
        duration_days: formData.duration_days,
        timing: formData.timing || null,
        location_type: formData.location_type,
        location_name: formData.location_name || null,
        location_address: formData.location_address || null,
        banner_image: formData.banner_image || null,
        thumbnail_image: formData.thumbnail_image || null,
        registration_enabled: formData.registration_enabled,
        benefits_text: formData.benefits_text || null,
        external_link: formData.external_link || null,
        created_by: user?.id,
      };

      let eventId = id;

      if (id) {
        const { error } = await supabase.from("events").update(eventData).eq("id", id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("events")
          .insert([eventData])
          .select()
          .single();

        if (error) throw error;
        eventId = data.id;
      }

      if (id) {
        await supabase.from("event_speakers").delete().eq("event_id", id);
        await supabase.from("schedule_items").delete().eq("event_id", id);
      }

      const speakerIds: (string | null)[] = [];
      for (let i = 0; i < speakers.length; i++) {
        const speaker = speakers[i];
        if (!speaker.name) continue;
        let speakerId = speaker.id;
        if (speakerId) {
          await supabase
            .from("speakers")
            .update({
              name: speaker.name,
              title: speaker.title || null,
              avatar_url: speaker.avatar_url || null,
              linkedin_url: speaker.linkedin_url || null,
            })
            .eq("id", speakerId);
        } else {
          const { data, error } = await supabase
            .from("speakers")
            .insert([
              {
                name: speaker.name,
                title: speaker.title || null,
                avatar_url: speaker.avatar_url || null,
                linkedin_url: speaker.linkedin_url || null,
              },
            ])
            .select()
            .single();
          if (error) throw error;
          speakerId = data.id;
        }
        speakerIds[i] = speakerId;

        await supabase.from("event_speakers").insert([
          {
            event_id: eventId,
            speaker_id: speakerId,
            display_order: i,
          },
        ]);
      }

      for (let i = 0; i < scheduleItems.length; i++) {
        const item = scheduleItems[i];
        if (!item.title) continue;

        const speakerId = item.speaker_index >= 0 ? speakerIds[item.speaker_index] || null : null;

        await supabase.from("schedule_items").insert([
          {
            event_id: eventId,
            title: item.title,
            description: item.description || null,
            start_time: item.start_time || null,
            end_time: item.end_time || null,
            day: item.day,
            speaker_id: speakerId,
            display_order: i,
          },
        ]);
      }

      toast.success(id ? "Event updated successfully" : "Event created successfully");
      navigate("/admin/events");
    } catch (error: any) {
      toast.error(error.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout requiredPermission="can_manage_events">
      <div className="max-w-4xl space-y-6">
        <div>
          <Button variant="ghost" onClick={() => navigate("/admin/events")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
          <h1 className="text-3xl font-bold font-display">
            {id ? "Edit Event" : "Create New Event"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_type">Event Type *</Label>
                <Select
                  value={formData.event_type}
                  onValueChange={(value) => setFormData({ ...formData, event_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="meetup">Meetup</SelectItem>
                    <SelectItem value="bootcamp">Bootcamp</SelectItem>
                    <SelectItem value="hackathon">Hackathon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_date">Event Date *</Label>
                <Input
                  id="event_date"
                  type="datetime-local"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_end_date">End Date</Label>
                <Input
                  id="event_end_date"
                  type="datetime-local"
                  value={formData.event_end_date}
                  onChange={(e) => setFormData({ ...formData, event_end_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registration_deadline">Registration Deadline</Label>
                <Input
                  id="registration_deadline"
                  type="datetime-local"
                  value={formData.registration_deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, registration_deadline: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration_days">Duration (Days)</Label>
                <Input
                  id="duration_days"
                  type="number"
                  value={formData.duration_days}
                  onChange={(e) =>
                    setFormData({ ...formData, duration_days: parseInt(e.target.value) || 1 })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timing">Timing (e.g., 10:00 AM - 5:00 PM)</Label>
                <Input
                  id="timing"
                  value={formData.timing}
                  onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location_type">Location Type</Label>
                <Select
                  value={formData.location_type}
                  onValueChange={(value) => setFormData({ ...formData, location_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location_name">Location Name</Label>
                <Input
                  id="location_name"
                  value={formData.location_name}
                  onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                  placeholder="e.g., Zoom, IIT Delhi, Mumbai"
                />
              </div>

              {(formData.location_type === "offline" || formData.location_type === "hybrid") && (
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location_address">Full Address</Label>
                  <Input
                    id="location_address"
                    value={formData.location_address}
                    onChange={(e) =>
                      setFormData({ ...formData, location_address: e.target.value })
                    }
                  />
                </div>
              )}

            </div>

            <div className="space-y-4 mt-6">
              <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-muted/30 p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Use banner as thumbnail</p>
                  <p className="text-xs text-muted-foreground">
                    When enabled, uploading a banner will also generate the event thumbnail.
                  </p>
                </div>
                <Switch
                  checked={useSameAsThumbnail}
                  onCheckedChange={(checked) => {
                    setUseSameAsThumbnail(checked);
                    if (checked && formData.banner_image) {
                      setFormData((prev) => ({
                        ...prev,
                        thumbnail_image: prev.banner_image,
                      }));
                    }
                  }}
                />
              </div>

              <ImageUpload
                label="Thumbnail Image"
                value={formData.thumbnail_image}
                onChange={(url) => setFormData({ ...formData, thumbnail_image: url })}
                altText={thumbnailAltText || `Thumbnail for ${formData.title}`}
                onAltTextChange={setThumbnailAltText}
                filenamePrefix={`event-${formData.title.toLowerCase().replace(/\s+/g, '-').slice(0, 20)}-thumb`}
                aspectRatio="square"
                disabled={useSameAsThumbnail && !!formData.banner_image}
                description="Used on event cards and listings."
              />
            </div>

            <div className="space-y-4 mt-6">
              <ImageUpload
                label="Banner Image"
                value={formData.banner_image}
                onChange={(url, imageData) => {
                  setFormData((prev) => {
                    const next = { ...prev, banner_image: url };

                    if (useSameAsThumbnail) {
                      const thumbUrl = url
                        ? imageData?.variants.thumbnail?.url ||
                          imageData?.variants.mobile?.url ||
                          url
                        : "";
                      next.thumbnail_image = thumbUrl;
                    }

                    return next;
                  });
                }}
                altText={bannerAltText || formData.title}
                onAltTextChange={setBannerAltText}
                filenamePrefix={`event-${formData.title.toLowerCase().replace(/\s+/g, '-').slice(0, 20)}`}
                aspectRatio="banner"
                description="Upload a high-quality banner image. It will be automatically optimized for web."
              />
            </div>

            {/* External Registration Link */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-4 mt-6">
              <div>
                <Label className="text-base font-semibold">External Registration</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  If registration is hosted on another platform (Devfolio, DoraHacks, etc.), add the link below. 
                  Users will be redirected there for registration and event details.
                </p>
              </div>
              <div>
                <Label>External Link (Optional)</Label>
                <Input
                  value={formData.external_link}
                  onChange={(e) => setFormData({ ...formData, external_link: e.target.value })}
                  placeholder="e.g., https://devfolio.co/event-name or https://lu.ma/..."
                  type="url"
                />
              </div>
              {formData.external_link && (
                <p className="text-sm text-primary">
                  ✓ Registration will redirect to external platform. "View Details" for completed events will also link externally.
                </p>
              )}
            </div>

            <div className="space-y-2 mt-6">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2 mt-6">
              <Label htmlFor="benefits_text">Benefits (one per line)</Label>
              <Textarea
                id="benefits_text"
                rows={4}
                value={formData.benefits_text}
                onChange={(e) => setFormData({ ...formData, benefits_text: e.target.value })}
                placeholder="Learning from experts&#10;Networking opportunities&#10;Industry connect"
              />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Speakers</h2>
              <Button type="button" variant="outline" size="sm" onClick={addSpeaker}>
                <Plus className="w-4 h-4 mr-2" />
                Add Speaker
              </Button>
            </div>

            <div className="space-y-4">
              {speakers.map((speaker, index) => (
                <Card key={index} className="p-4 bg-muted/30">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold">Speaker {index + 1}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSpeaker(index)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name *</Label>
                      <Input
                        value={speaker.name}
                        onChange={(e) => updateSpeaker(index, "name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Title/Role</Label>
                      <Input
                        value={speaker.title}
                        onChange={(e) => updateSpeaker(index, "title", e.target.value)}
                        placeholder="e.g., Senior Engineer at Google"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <ImageUpload
                        label="Speaker Photo"
                        value={speaker.avatar_url}
                        onChange={(url) => updateSpeaker(index, "avatar_url", url)}
                        altText={speakerAltTexts[index] || speaker.name}
                        onAltTextChange={(alt) => {
                          const updated = [...speakerAltTexts];
                          updated[index] = alt;
                          setSpeakerAltTexts(updated);
                        }}
                        filenamePrefix={`speaker-${speaker.name.toLowerCase().replace(/\s+/g, '-').slice(0, 20)}`}
                        aspectRatio="square"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>LinkedIn URL</Label>
                      <Input
                        value={speaker.linkedin_url}
                        onChange={(e) => updateSpeaker(index, "linkedin_url", e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>
                </Card>
              ))}
              {speakers.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No speakers added yet. Click "Add Speaker" to add speakers.
                </p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Schedule</h2>
              <Button type="button" variant="outline" size="sm" onClick={addScheduleItem}>
                <Plus className="w-4 h-4 mr-2" />
                Add Schedule Item
              </Button>
            </div>

            <div className="space-y-4">
              {scheduleItems.map((item, index) => (
                <Card key={index} className="p-4 bg-muted/30">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold">Schedule Item {index + 1}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeScheduleItem(index)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Day</Label>
                      <Input
                        type="number"
                        value={item.day}
                        onChange={(e) =>
                          updateScheduleItem(index, "day", parseInt(e.target.value) || 1)
                        }
                        min="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input
                        value={item.start_time}
                        onChange={(e) => updateScheduleItem(index, "start_time", e.target.value)}
                        placeholder="10:00 AM"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input
                        value={item.end_time}
                        onChange={(e) => updateScheduleItem(index, "end_time", e.target.value)}
                        placeholder="11:00 AM"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-3">
                      <Label>Title *</Label>
                      <Input
                        value={item.title}
                        onChange={(e) => updateScheduleItem(index, "title", e.target.value)}
                        placeholder="Session title"
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-3">
                      <Label>Description</Label>
                      <Textarea
                        value={item.description}
                        onChange={(e) => updateScheduleItem(index, "description", e.target.value)}
                        rows={3}
                        placeholder="Description of the session"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-3">
                      <Label>Speaker (Optional)</Label>
                      <Select
                        value={item.speaker_index.toString()}
                        onValueChange={(value) => updateScheduleItem(index, "speaker_index", parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a speaker" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="-1">No Speaker</SelectItem>
                          {speakers.map((speaker, speakerIndex) => (
                            <SelectItem key={speakerIndex} value={speakerIndex.toString()}>
                              {speaker.name || `Speaker ${speakerIndex + 1}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              ))}
              {scheduleItems.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No schedule items added yet. Click "Add Schedule Item" to create schedule.
                </p>
              )}
            </div>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" variant="hero" disabled={loading}>
              {loading ? "Saving..." : id ? "Update Event" : "Create Event"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/admin/events")}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EventForm;
