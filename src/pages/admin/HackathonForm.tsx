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
import { ArrowLeft, Plus, Trash2, Save, ChevronDown, ChevronUp } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ImageUpload } from "@/components/ui/image-upload";

interface Challenge {
  id?: string;
  title: string;
  description: string;
  detailed_description: string;
  icon: string;
  image_url: string;
  image_alt?: string;
  is_active: boolean;
}

interface Mentor {
  id?: string;
  name: string;
  title: string;
  organization: string;
  avatar_url: string;
  avatar_alt?: string;
  linkedin_url: string;
  bio: string;
  is_active: boolean;
}

interface Jury {
  id?: string;
  name: string;
  title: string;
  organization: string;
  avatar_url: string;
  avatar_alt?: string;
  linkedin_url: string;
  bio: string;
  is_active: boolean;
}

interface Prize {
  id?: string;
  position: string;
  title: string;
  prize_amount: string;
  description: string;
  icon_url: string;
  is_active: boolean;
}

interface FAQ {
  id?: string;
  question: string;
  answer: string;
  is_active: boolean;
}

interface Winner {
  id?: string;
  position: string;
  team_name: string;
  project_name: string;
  project_description: string;
  members: string;
  prize_won: string;
  image_url: string;
  image_alt?: string;
  github_url: string;
  project_url: string;
}

interface ScheduleItem {
  id?: string;
  day: number;
  schedule_date: string;
  start_time: string;
  end_time: string;
  title: string;
  description: string;
}

const HackathonForm = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [useSameAsThumbnail, setUseSameAsThumbnail] = useState(true);
  const [bannerAltText, setBannerAltText] = useState("Hackathon banner");

  // Collapsible states
  const [openSections, setOpenSections] = useState({
    basic: true,
    about: true,
    challenges: false,
    mentors: false,
    jury: false,
    schedule: false,
    prizes: false,
    faqs: false,
    winners: false,
  });

  // Basic info
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    status: "upcoming",
    event_date: "",
    event_end_date: "",
    registration_deadline: "",
    duration_days: 1,
    timing: "",
    location_type: "offline",
    location_name: "",
    location_address: "",
    banner_image: "",
    thumbnail_image: "",
    registration_enabled: true,
    prize_pool: "",
    max_participants: "",
    external_link: "",
  });

  // Related data
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [jury, setJury] = useState<Jury[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    if (id) {
      fetchHackathon();
    }
  }, [id]);

  const fetchHackathon = async () => {
    setLoading(true);
    const [eventRes, challengesRes, mentorsRes, juryRes, prizesRes, faqsRes, winnersRes, scheduleRes] = await Promise.all([
      supabase.from("events").select("*").eq("id", id).maybeSingle(),
      supabase.from("hackathon_challenges").select("*").eq("event_id", id).order("display_order"),
      supabase.from("hackathon_mentors").select("*").eq("event_id", id).order("display_order"),
      supabase.from("hackathon_jury").select("*").eq("event_id", id).order("display_order"),
      supabase.from("hackathon_prizes").select("*").eq("event_id", id).order("display_order"),
      supabase.from("hackathon_faqs").select("*").eq("event_id", id).order("display_order"),
      supabase.from("hackathon_winners").select("*").eq("event_id", id).order("display_order"),
      supabase.from("schedule_items").select("*").eq("event_id", id).order("day").order("display_order"),
    ]);

    if (eventRes.data) {
      const data = eventRes.data;
      setFormData({
        title: data.title || "",
        subtitle: data.subtitle || "",
        description: data.description || "",
        status: data.status || "upcoming",
        event_date: data.event_date ? new Date(data.event_date).toISOString().slice(0, 16) : "",
        event_end_date: data.event_end_date ? new Date(data.event_end_date).toISOString().slice(0, 16) : "",
        registration_deadline: data.registration_deadline ? new Date(data.registration_deadline).toISOString().slice(0, 16) : "",
        duration_days: data.duration_days || 1,
        timing: data.timing || "",
        location_type: data.location_type || "offline",
        location_name: data.location_name || "",
        location_address: data.location_address || "",
        banner_image: data.banner_image || "",
        thumbnail_image: data.thumbnail_image || "",
        registration_enabled: data.registration_enabled ?? true,
        prize_pool: data.prize_pool || "",
        max_participants: data.max_participants?.toString() || "",
        external_link: data.external_link || "",
      });
    }

    setChallenges((challengesRes.data || []).map(c => ({ ...c, image_alt: `${c.title} challenge` })));
    setMentors((mentorsRes.data || []).map(m => ({ ...m, avatar_alt: `${m.name} photo` })));
    setJury((juryRes.data || []).map(j => ({ ...j, avatar_alt: `${j.name} photo` })));
    setPrizes(prizesRes.data || []);
    setFaqs(faqsRes.data || []);
    setWinners((winnersRes.data || []).map(w => ({ ...w, image_alt: `${w.team_name} project` })));
    setSchedule((scheduleRes.data || []).map(s => ({ ...s, schedule_date: s.schedule_date || "" })));
    setLoading(false);
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Add/Remove handlers for each section
  const addChallenge = () => setChallenges([...challenges, { title: "", description: "", detailed_description: "", icon: "💡", image_url: "", image_alt: "Challenge image", is_active: true }]);
  const removeChallenge = (i: number) => setChallenges(challenges.filter((_, idx) => idx !== i));
  const updateChallenge = (i: number, field: keyof Challenge, value: any) => {
    const updated = [...challenges];
    (updated[i] as any)[field] = value;
    setChallenges(updated);
  };

  const addMentor = () => setMentors([...mentors, { name: "", title: "", organization: "", avatar_url: "", avatar_alt: "Mentor photo", linkedin_url: "", bio: "", is_active: true }]);
  const removeMentor = (i: number) => setMentors(mentors.filter((_, idx) => idx !== i));
  const updateMentor = (i: number, field: keyof Mentor, value: any) => {
    const updated = [...mentors];
    (updated[i] as any)[field] = value;
    if (field === "name") {
      updated[i].avatar_alt = `${value} photo`;
    }
    setMentors(updated);
  };

  const addJury = () => setJury([...jury, { name: "", title: "", organization: "", avatar_url: "", avatar_alt: "Jury member photo", linkedin_url: "", bio: "", is_active: true }]);
  const removeJury = (i: number) => setJury(jury.filter((_, idx) => idx !== i));
  const updateJury = (i: number, field: keyof Jury, value: any) => {
    const updated = [...jury];
    (updated[i] as any)[field] = value;
    if (field === "name") {
      updated[i].avatar_alt = `${value} photo`;
    }
    setJury(updated);
  };

  const addPrize = () => setPrizes([...prizes, { position: "", title: "", prize_amount: "", description: "", icon_url: "", is_active: true }]);
  const removePrize = (i: number) => setPrizes(prizes.filter((_, idx) => idx !== i));
  const updatePrize = (i: number, field: keyof Prize, value: any) => {
    const updated = [...prizes];
    (updated[i] as any)[field] = value;
    setPrizes(updated);
  };

  const addFaq = () => setFaqs([...faqs, { question: "", answer: "", is_active: true }]);
  const removeFaq = (i: number) => setFaqs(faqs.filter((_, idx) => idx !== i));
  const updateFaq = (i: number, field: keyof FAQ, value: any) => {
    const updated = [...faqs];
    (updated[i] as any)[field] = value;
    setFaqs(updated);
  };

  const addWinner = () => setWinners([...winners, { position: "", team_name: "", project_name: "", project_description: "", members: "", prize_won: "", image_url: "", image_alt: "Winner project", github_url: "", project_url: "" }]);
  const removeWinner = (i: number) => setWinners(winners.filter((_, idx) => idx !== i));
  const updateWinner = (i: number, field: keyof Winner, value: any) => {
    const updated = [...winners];
    (updated[i] as any)[field] = value;
    if (field === "team_name") {
      updated[i].image_alt = `${value} project`;
    }
    setWinners(updated);
  };

  const addScheduleItem = () => setSchedule((prev) => [...prev, { day: 1, schedule_date: "", start_time: "", end_time: "", title: "", description: "" } as ScheduleItem]);
  const removeScheduleItem = (i: number) => setSchedule((prev) => prev.filter((_, idx) => idx !== i));
  const updateScheduleItem = (i: number, field: keyof ScheduleItem, value: any) => {
    const updated = [...schedule];
    (updated[i] as any)[field] = value;
    setSchedule(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Please enter a hackathon title");
      return;
    }
    setSaving(true);

    try {
      const eventData = {
        title: formData.title,
        subtitle: formData.subtitle || null,
        description: formData.description || null,
        event_type: "hackathon",
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
        prize_pool: formData.prize_pool || null,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
        external_link: formData.external_link || null,
        created_by: user?.id,
      };

      let eventId = id;

      if (id) {
        const { error } = await supabase.from("events").update(eventData).eq("id", id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("events").insert([eventData]).select().single();
        if (error) throw error;
        eventId = data.id;
      }

      // Delete existing related data
      if (eventId) {
        await Promise.all([
          supabase.from("hackathon_challenges").delete().eq("event_id", eventId),
          supabase.from("hackathon_mentors").delete().eq("event_id", eventId),
          supabase.from("hackathon_jury").delete().eq("event_id", eventId),
          supabase.from("hackathon_prizes").delete().eq("event_id", eventId),
          supabase.from("hackathon_faqs").delete().eq("event_id", eventId),
          supabase.from("hackathon_winners").delete().eq("event_id", eventId),
          supabase.from("schedule_items").delete().eq("event_id", eventId),
        ]);

        // Insert new related data
        const insertPromises = [];

        if (challenges.filter(c => c.title).length > 0) {
          insertPromises.push(
            supabase.from("hackathon_challenges").insert(
              challenges.filter(c => c.title).map((c, i) => ({
                event_id: eventId,
                title: c.title,
                description: c.description || null,
                detailed_description: c.detailed_description || null,
                icon: c.icon || null,
                image_url: c.image_url || null,
                is_active: c.is_active,
                display_order: i,
              }))
            )
          );
        }

        if (mentors.filter(m => m.name).length > 0) {
          insertPromises.push(
            supabase.from("hackathon_mentors").insert(
              mentors.filter(m => m.name).map((m, i) => ({
                event_id: eventId,
                name: m.name,
                title: m.title || null,
                organization: m.organization || null,
                avatar_url: m.avatar_url || null,
                linkedin_url: m.linkedin_url || null,
                bio: m.bio || null,
                is_active: m.is_active,
                display_order: i,
              }))
            )
          );
        }

        if (jury.filter(j => j.name).length > 0) {
          insertPromises.push(
            supabase.from("hackathon_jury").insert(
              jury.filter(j => j.name).map((j, i) => ({
                event_id: eventId,
                name: j.name,
                title: j.title || null,
                organization: j.organization || null,
                avatar_url: j.avatar_url || null,
                linkedin_url: j.linkedin_url || null,
                bio: j.bio || null,
                is_active: j.is_active,
                display_order: i,
              }))
            )
          );
        }

        if (prizes.filter(p => p.position).length > 0) {
          insertPromises.push(
            supabase.from("hackathon_prizes").insert(
              prizes.filter(p => p.position).map((p, i) => ({
                event_id: eventId,
                position: p.position,
                title: p.title || null,
                prize_amount: p.prize_amount || null,
                description: p.description || null,
                icon_url: p.icon_url || null,
                is_active: p.is_active,
                display_order: i,
              }))
            )
          );
        }

        if (faqs.filter(f => f.question).length > 0) {
          insertPromises.push(
            supabase.from("hackathon_faqs").insert(
              faqs.filter(f => f.question).map((f, i) => ({
                event_id: eventId,
                question: f.question,
                answer: f.answer,
                is_active: f.is_active,
                display_order: i,
              }))
            )
          );
        }

        if (winners.filter(w => w.team_name).length > 0) {
          insertPromises.push(
            supabase.from("hackathon_winners").insert(
              winners.filter(w => w.team_name).map((w, i) => ({
                event_id: eventId,
                position: w.position,
                team_name: w.team_name,
                project_name: w.project_name,
                project_description: w.project_description || null,
                members: w.members || null,
                prize_won: w.prize_won || null,
                image_url: w.image_url || null,
                github_url: w.github_url || null,
                project_url: w.project_url || null,
                display_order: i,
              }))
            )
          );
        }

        if (schedule.filter(s => s.title).length > 0) {
          insertPromises.push(
            supabase.from("schedule_items").insert(
              schedule.filter(s => s.title).map((s, i) => ({
                event_id: eventId,
                day: s.day,
                schedule_date: s.schedule_date || null,
                start_time: s.start_time || null,
                end_time: s.end_time || null,
                title: s.title,
                description: s.description || null,
                display_order: i,
              }))
            )
          );
        }

        await Promise.all(insertPromises);
      }

      toast.success(id ? "Hackathon updated successfully!" : "Hackathon created successfully!");
      navigate("/admin/hackathons");
    } catch (error: any) {
      toast.error(error.message || "Failed to save hackathon");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-muted rounded" />
          <div className="h-96 bg-muted rounded-xl" />
        </div>
      </AdminLayout>
    );
  }

  const SectionHeader = ({ title, count, section }: { title: string; count?: number; section: keyof typeof openSections }) => (
    <CollapsibleTrigger asChild onClick={() => toggleSection(section)}>
      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 rounded-t-lg transition-colors">
        <h3 className="text-lg font-bold flex items-center gap-2">
          {title}
          {count !== undefined && <span className="text-sm font-normal text-muted-foreground">({count})</span>}
        </h3>
        {openSections[section] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </div>
    </CollapsibleTrigger>
  );

  return (
    <AdminLayout requiredPermission="can_manage_hackathons">
      <form onSubmit={handleSubmit} className="max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button type="button" variant="ghost" onClick={() => navigate("/admin/hackathons")} className="mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hackathons
            </Button>
            <h1 className="text-3xl font-bold font-display">
              {id ? "Edit Hackathon" : "Create New Hackathon"}
            </h1>
          </div>
          <Button type="submit" variant="hero" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Hackathon"}
          </Button>
        </div>

        {/* Basic Information */}
        <Card>
          <Collapsible open={openSections.basic}>
            <SectionHeader title="Basic Information" section="basic" />
            <CollapsibleContent className="p-4 pt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>Hackathon Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., IDEATRON - AI for Good"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Subtitle / Tagline</Label>
                  <Input
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g., Harness AI for Public Good Hackathon"
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Prize Pool</Label>
                  <Input
                    value={formData.prize_pool}
                    onChange={(e) => setFormData({ ...formData, prize_pool: e.target.value })}
                    placeholder="e.g., ₹10,00,000"
                  />
                </div>
                <div>
                  <Label>Event Start Date *</Label>
                  <Input
                    type="datetime-local"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Event End Date</Label>
                  <Input
                    type="datetime-local"
                    value={formData.event_end_date}
                    onChange={(e) => setFormData({ ...formData, event_end_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Registration Deadline</Label>
                  <Input
                    type="datetime-local"
                    value={formData.registration_deadline}
                    onChange={(e) => setFormData({ ...formData, registration_deadline: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Duration (Days)</Label>
                  <Input
                    type="number"
                    value={formData.duration_days}
                    onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <Label>Timing</Label>
                  <Input
                    value={formData.timing}
                    onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                    placeholder="e.g., 9:00 AM - 6:00 PM"
                  />
                </div>
                <div>
                  <Label>Max Participants</Label>
                  <Input
                    type="number"
                    value={formData.max_participants}
                    onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                    placeholder="Leave empty for unlimited"
                  />
                </div>
                <div>
                  <Label>Location Type</Label>
                  <Select value={formData.location_type} onValueChange={(v) => setFormData({ ...formData, location_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Location / Venue Name</Label>
                  <Input
                    value={formData.location_name}
                    onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                    placeholder="e.g., IIT Delhi, Zoom"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Full Address</Label>
                  <Input
                    value={formData.location_address}
                    onChange={(e) => setFormData({ ...formData, location_address: e.target.value })}
                    placeholder="Complete venue address"
                  />
                </div>
                
                {/* Banner Image Upload */}
                <div className="md:col-span-2">
                  <ImageUpload
                    label="Banner Image"
                    value={formData.banner_image}
                    onChange={(url) => setFormData({ ...formData, banner_image: url })}
                    altText={bannerAltText}
                    onAltTextChange={setBannerAltText}
                    filenamePrefix={`hackathon-${formData.title.slice(0, 20) || 'banner'}`}
                    aspectRatio="banner"
                    description="Recommended: 21:9 aspect ratio, min 1920px wide"
                    showThumbnailOption={true}
                    thumbnailValue={formData.thumbnail_image}
                    onThumbnailChange={(url) => setFormData({ ...formData, thumbnail_image: url })}
                    useSameAsThumbnail={useSameAsThumbnail}
                    onUseSameAsThumbnailChange={setUseSameAsThumbnail}
                  />
                </div>

                {/* External Registration Link */}
                <div className="md:col-span-2 p-4 bg-muted/50 rounded-lg space-y-4">
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
                      placeholder="e.g., https://devfolio.co/hackathon-name or https://dorahacks.io/hackathon/..."
                      type="url"
                    />
                  </div>
                  {formData.external_link && (
                    <p className="text-sm text-primary">
                      ✓ Registration will redirect to external platform. "View Details" for completed events will also link externally.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    checked={formData.registration_enabled}
                    onCheckedChange={(v) => setFormData({ ...formData, registration_enabled: v })}
                  />
                  <Label>Registration Enabled</Label>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* About Section */}
        <Card>
          <Collapsible open={openSections.about}>
            <SectionHeader title="About / Description" section="about" />
            <CollapsibleContent className="p-4 pt-0">
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of your hackathon..."
                rows={6}
              />
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Challenges Section */}
        <Card>
          <Collapsible open={openSections.challenges}>
            <SectionHeader title="Challenges / Tracks" count={challenges.length} section="challenges" />
            <CollapsibleContent className="p-4 pt-0 space-y-4">
              {challenges.map((challenge, i) => (
                <div key={i} className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <div className="flex gap-4">
                    <div className="w-20">
                      <Label>Icon</Label>
                      <Input value={challenge.icon} onChange={(e) => updateChallenge(i, "icon", e.target.value)} placeholder="💡" />
                    </div>
                    <div className="flex-1">
                      <Label>Title *</Label>
                      <Input value={challenge.title} onChange={(e) => updateChallenge(i, "title", e.target.value)} placeholder="Challenge title" />
                    </div>
                    <Button type="button" variant="destructive" size="icon" className="mt-6" onClick={() => removeChallenge(i)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <ImageUpload
                    label="Challenge Image"
                    value={challenge.image_url}
                    onChange={(url) => updateChallenge(i, "image_url", url)}
                    altText={challenge.image_alt || "Challenge image"}
                    onAltTextChange={(alt) => updateChallenge(i, "image_alt", alt)}
                    filenamePrefix={`challenge-${challenge.title.slice(0, 20) || i}`}
                    aspectRatio="video"
                    description="Optional: Add an image for this challenge"
                  />
                  <div>
                    <Label>Short Description</Label>
                    <Textarea value={challenge.description} onChange={(e) => updateChallenge(i, "description", e.target.value)} placeholder="Brief description (shown as preview)" rows={2} />
                  </div>
                  <div>
                    <Label>Detailed Description (View More)</Label>
                    <Textarea 
                      value={challenge.detailed_description} 
                      onChange={(e) => updateChallenge(i, "detailed_description", e.target.value)} 
                      placeholder="Full problem statement with details like Problem Brief, Solution Approach, Datasets, etc. Use line breaks for paragraphs." 
                      rows={6} 
                    />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addChallenge} className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Add Challenge
              </Button>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Mentors Section */}
        <Card>
          <Collapsible open={openSections.mentors}>
            <SectionHeader title="Hackathon Mentors" count={mentors.length} section="mentors" />
            <CollapsibleContent className="p-4 pt-0 space-y-4">
              {mentors.map((mentor, i) => (
                <div key={i} className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">Mentor {i + 1}</h4>
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeMentor(i)}>
                      <Trash2 className="w-4 h-4 mr-2" /> Remove
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label>Name *</Label>
                      <Input value={mentor.name} onChange={(e) => updateMentor(i, "name", e.target.value)} placeholder="Full Name" />
                    </div>
                    <div>
                      <Label>Title</Label>
                      <Input value={mentor.title} onChange={(e) => updateMentor(i, "title", e.target.value)} placeholder="Job Title" />
                    </div>
                    <div>
                      <Label>Organization</Label>
                      <Input value={mentor.organization} onChange={(e) => updateMentor(i, "organization", e.target.value)} placeholder="Company/Organization" />
                    </div>
                    <div>
                      <Label>LinkedIn URL</Label>
                      <Input value={mentor.linkedin_url} onChange={(e) => updateMentor(i, "linkedin_url", e.target.value)} placeholder="https://linkedin.com/in/..." />
                    </div>
                  </div>
                  <ImageUpload
                    label="Avatar Photo"
                    value={mentor.avatar_url}
                    onChange={(url) => updateMentor(i, "avatar_url", url)}
                    altText={mentor.avatar_alt || `${mentor.name || 'Mentor'} photo`}
                    onAltTextChange={(alt) => updateMentor(i, "avatar_alt", alt)}
                    filenamePrefix={`mentor-${mentor.name.slice(0, 20) || i}`}
                    aspectRatio="square"
                    description="Square image recommended (1:1 ratio)"
                  />
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addMentor} className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Add Mentor
              </Button>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Jury Panel Section */}
        <Card>
          <Collapsible open={openSections.jury}>
            <SectionHeader title="Jury Panel" count={jury.length} section="jury" />
            <CollapsibleContent className="p-4 pt-0 space-y-4">
              {jury.map((member, i) => (
                <div key={i} className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">Jury Member {i + 1}</h4>
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeJury(i)}>
                      <Trash2 className="w-4 h-4 mr-2" /> Remove
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label>Name *</Label>
                      <Input value={member.name} onChange={(e) => updateJury(i, "name", e.target.value)} placeholder="Full Name" />
                    </div>
                    <div>
                      <Label>Title</Label>
                      <Input value={member.title} onChange={(e) => updateJury(i, "title", e.target.value)} placeholder="Job Title" />
                    </div>
                    <div>
                      <Label>Organization</Label>
                      <Input value={member.organization} onChange={(e) => updateJury(i, "organization", e.target.value)} placeholder="Company/Organization" />
                    </div>
                    <div>
                      <Label>LinkedIn URL</Label>
                      <Input value={member.linkedin_url} onChange={(e) => updateJury(i, "linkedin_url", e.target.value)} placeholder="https://linkedin.com/in/..." />
                    </div>
                  </div>
                  <ImageUpload
                    label="Avatar Photo"
                    value={member.avatar_url}
                    onChange={(url) => updateJury(i, "avatar_url", url)}
                    altText={member.avatar_alt || `${member.name || 'Jury member'} photo`}
                    onAltTextChange={(alt) => updateJury(i, "avatar_alt", alt)}
                    filenamePrefix={`jury-${member.name.slice(0, 20) || i}`}
                    aspectRatio="square"
                    description="Square image recommended (1:1 ratio)"
                  />
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addJury} className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Add Jury Member
              </Button>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Schedule Section */}
        <Card>
          <Collapsible open={openSections.schedule}>
            <SectionHeader title="Schedule / Timeline" count={schedule.length} section="schedule" />
            <CollapsibleContent className="p-4 pt-0 space-y-4">
              {schedule.map((item, i) => (
                <div key={i} className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                    <div>
                      <Label>Day</Label>
                      <Input type="number" value={item.day} onChange={(e) => updateScheduleItem(i, "day", parseInt(e.target.value) || 1)} min={1} />
                    </div>
                    <div>
                      <Label>Date (optional)</Label>
                      <Input type="date" value={item.schedule_date} onChange={(e) => updateScheduleItem(i, "schedule_date", e.target.value)} />
                    </div>
                    <div>
                      <Label>Start Time</Label>
                      <Input value={item.start_time} onChange={(e) => updateScheduleItem(i, "start_time", e.target.value)} placeholder="10:00 AM" />
                    </div>
                    <div>
                      <Label>End Time</Label>
                      <Input value={item.end_time} onChange={(e) => updateScheduleItem(i, "end_time", e.target.value)} placeholder="11:00 AM" />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Title *</Label>
                      <Input value={item.title} onChange={(e) => updateScheduleItem(i, "title", e.target.value)} placeholder="Session title" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">If date is set, it will show date instead of "Day X"</p>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Label>Description</Label>
                      <Textarea value={item.description} onChange={(e) => updateScheduleItem(i, "description", e.target.value)} placeholder="Session description" rows={2} />
                    </div>
                    <Button type="button" variant="destructive" size="icon" className="mt-6" onClick={() => removeScheduleItem(i)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addScheduleItem} className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Add Schedule Item
              </Button>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Prizes Section */}
        <Card>
          <Collapsible open={openSections.prizes}>
            <SectionHeader title="Prizes" count={prizes.length} section="prizes" />
            <CollapsibleContent className="p-4 pt-0 space-y-4">
              {prizes.map((prize, i) => (
                <div key={i} className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Input value={prize.position} onChange={(e) => updatePrize(i, "position", e.target.value)} placeholder="Position (e.g., 1st Place) *" />
                    <Input value={prize.title} onChange={(e) => updatePrize(i, "title", e.target.value)} placeholder="Title (e.g., Winner)" />
                    <Input value={prize.prize_amount} onChange={(e) => updatePrize(i, "prize_amount", e.target.value)} placeholder="Prize Amount (e.g., ₹50,000)" />
                    <Button type="button" variant="destructive" onClick={() => removePrize(i)}>
                      <Trash2 className="w-4 h-4 mr-2" /> Remove
                    </Button>
                  </div>
                  <Textarea value={prize.description} onChange={(e) => updatePrize(i, "description", e.target.value)} placeholder="Prize description (what's included)" rows={2} />
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addPrize} className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Add Prize
              </Button>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* FAQs Section */}
        <Card>
          <Collapsible open={openSections.faqs}>
            <SectionHeader title="Frequently Asked Questions" count={faqs.length} section="faqs" />
            <CollapsibleContent className="p-4 pt-0 space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Label>Question *</Label>
                      <Input value={faq.question} onChange={(e) => updateFaq(i, "question", e.target.value)} placeholder="Frequently asked question" />
                    </div>
                    <Button type="button" variant="destructive" size="icon" className="mt-6" onClick={() => removeFaq(i)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div>
                    <Label>Answer *</Label>
                    <Textarea value={faq.answer} onChange={(e) => updateFaq(i, "answer", e.target.value)} placeholder="Answer to the question" rows={3} />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addFaq} className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Add FAQ
              </Button>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Winners Section */}
        <Card>
          <Collapsible open={openSections.winners}>
            <SectionHeader title="Winners (Post-Event)" count={winners.length} section="winners" />
            <CollapsibleContent className="p-4 pt-0 space-y-4">
              {winners.map((winner, i) => (
                <div key={i} className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">Winner {i + 1}</h4>
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeWinner(i)}>
                      <Trash2 className="w-4 h-4 mr-2" /> Remove
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label>Position *</Label>
                      <Input value={winner.position} onChange={(e) => updateWinner(i, "position", e.target.value)} placeholder="e.g., 1st Place" />
                    </div>
                    <div>
                      <Label>Team Name *</Label>
                      <Input value={winner.team_name} onChange={(e) => updateWinner(i, "team_name", e.target.value)} placeholder="Team name" />
                    </div>
                    <div>
                      <Label>Project Name *</Label>
                      <Input value={winner.project_name} onChange={(e) => updateWinner(i, "project_name", e.target.value)} placeholder="Project name" />
                    </div>
                    <div>
                      <Label>Prize Won</Label>
                      <Input value={winner.prize_won} onChange={(e) => updateWinner(i, "prize_won", e.target.value)} placeholder="e.g., ₹50,000" />
                    </div>
                    <div>
                      <Label>GitHub URL</Label>
                      <Input value={winner.github_url} onChange={(e) => updateWinner(i, "github_url", e.target.value)} placeholder="https://github.com/..." />
                    </div>
                    <div>
                      <Label>Project URL</Label>
                      <Input value={winner.project_url} onChange={(e) => updateWinner(i, "project_url", e.target.value)} placeholder="https://..." />
                    </div>
                  </div>
                  <div>
                    <Label>Team Members</Label>
                    <Input value={winner.members} onChange={(e) => updateWinner(i, "members", e.target.value)} placeholder="Comma-separated names" />
                  </div>
                  <div>
                    <Label>Project Description</Label>
                    <Textarea value={winner.project_description} onChange={(e) => updateWinner(i, "project_description", e.target.value)} placeholder="Brief description of the winning project" rows={2} />
                  </div>
                  <ImageUpload
                    label="Project Image"
                    value={winner.image_url}
                    onChange={(url) => updateWinner(i, "image_url", url)}
                    altText={winner.image_alt || `${winner.team_name || 'Winner'} project`}
                    onAltTextChange={(alt) => updateWinner(i, "image_alt", alt)}
                    filenamePrefix={`winner-${winner.team_name.slice(0, 20) || i}`}
                    aspectRatio="video"
                    description="Project screenshot or team photo"
                  />
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addWinner} className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Add Winner
              </Button>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" variant="hero" size="lg" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Hackathon"}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default HackathonForm;
