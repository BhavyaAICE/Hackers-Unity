import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { isPast } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Event {
  id: string;
  title: string;
  banner_image: string | null;
  registration_deadline: string | null;
  registration_enabled: boolean;
}

const countryCodes = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+852", country: "Hong Kong", flag: "🇭🇰" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
];

const countries = [
  "India", "United States", "United Kingdom", "Canada", "Australia", 
  "Germany", "France", "Japan", "China", "Singapore", "UAE", 
  "South Africa", "Brazil", "Netherlands", "Sweden", "Other"
];

const occupations = [
  { value: "student", label: "Student" },
  { value: "professional", label: "Working Professional" },
  { value: "freelancer", label: "Freelancer" },
  { value: "entrepreneur", label: "Entrepreneur" },
  { value: "other", label: "Other" },
];

const hearAboutOptions = [
  { value: "social_media", label: "Social Media" },
  { value: "friend", label: "Friend/Colleague" },
  { value: "college", label: "College/University" },
  { value: "website", label: "Website" },
  { value: "email", label: "Email" },
  { value: "event", label: "Previous Event" },
  { value: "other", label: "Other" },
];

const EventRegister = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    country: "India",
    city: "",
    date_of_birth: "",
    gender: "",
    occupation: "",
    organization: "",
    github_url: "",
    linkedin_url: "",
    hear_about_us: "",
    agree_to_terms: false,
  });

  useEffect(() => {
    if (!user) {
      toast.error("Please login to register for events");
      navigate("/login");
      return;
    }
    fetchEvent();
  }, [id, user]);

  const fetchEvent = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from("events")
      .select("id, title, banner_image, registration_deadline, registration_enabled")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      toast.error("Event not found");
      navigate("/");
      return;
    }

    const isRegistrationClosed = data.registration_deadline
      ? isPast(new Date(data.registration_deadline))
      : false;

    if (!data.registration_enabled || isRegistrationClosed) {
      toast.error("Registration is closed for this event");
      navigate(`/events/${id}`);
      return;
    }

    setEvent(data);

    if (user) {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("full_name, email")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        setFormData((prev) => ({
          ...prev,
          full_name: profile.full_name || "",
          email: profile.email || "",
        }));
      }
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !event) return;

    if (!formData.agree_to_terms) {
      toast.error("Please agree to the Terms and Conditions");
      return;
    }

    setSubmitting(true);

    const fullPhone = `${countryCode}${phoneNumber}`;

    const { data: eventData } = await supabase
      .from("events")
      .select("event_type, title")
      .eq("id", event.id)
      .maybeSingle();

    const customFields = {
      country: formData.country,
      github_url: formData.github_url,
      linkedin_url: formData.linkedin_url,
      hear_about_us: formData.hear_about_us,
      occupation: formData.occupation,
    };

    const { error } = await supabase.from("event_registrations").insert([
      {
        event_id: event.id,
        user_id: user.id,
        full_name: formData.full_name,
        email: formData.email,
        phone: fullPhone,
        organization: formData.organization,
        designation: formData.occupation,
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender,
        city: formData.city,
        agree_to_contact: formData.agree_to_terms,
        custom_fields: customFields,
      },
    ]);

    if (error) {
      if (error.code === "23505") {
        toast.error("You are already registered for this event");
      } else {
        toast.error("Failed to register. Please try again.");
      }
      setSubmitting(false);
      return;
    }

    try {
      // Use Supabase client to invoke edge function (no hardcoded keys)
      const { error: emailError } = await supabase.functions.invoke('send-registration-email', {
        body: {
          to: formData.email,
          userName: formData.full_name,
          eventType: eventData?.event_type || "Event",
          eventTitle: eventData?.title || event.title,
        },
      });

      if (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }
    } catch (emailError) {
      console.error("Error sending email:", emailError);
    }

    setSuccess(true);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container-custom py-24 text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container-custom py-24">
          <Card className="max-w-md mx-auto p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold font-display mb-2">
              Registration Successful!
            </h1>
            <p className="text-muted-foreground mb-6">
              You have successfully registered for {event.title}
            </p>
            <Button variant="hero" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container-custom py-12 md:py-24">
        <div className="max-w-2xl mx-auto">
          <Card className="overflow-hidden">
            {/* Event Banner */}
            {event.banner_image && (
              <div className="w-full h-40 md:h-48 overflow-hidden">
                <img 
                  src={event.banner_image} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Form Header */}
            <div className="px-6 py-6 border-b border-border">
              <h1 className="text-xl md:text-2xl font-semibold text-center">
                Registration for {event.title}
              </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-foreground">
                  Full Name: <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="full_name"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  required
                  className="bg-muted/50"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email: <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="bg-muted/50"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">
                  Phone Number: <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="w-[100px] bg-muted/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      {countryCodes.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          <span className="flex items-center gap-1">
                            <span>{country.flag}</span>
                            <span className="text-sm">{country.code}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    required
                    className="flex-1 bg-muted/50"
                  />
                </div>
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="country" className="text-foreground">
                  Select Country: <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.country} 
                  onValueChange={(value) => setFormData({ ...formData, country: value })}
                >
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city" className="text-foreground">
                  City: <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  required
                  className="bg-muted/50"
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="date_of_birth" className="text-foreground">
                  Date of Birth: <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) =>
                    setFormData({ ...formData, date_of_birth: e.target.value })
                  }
                  required
                  className="bg-muted/50"
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-foreground">
                  Gender:
                </Label>
                <Select 
                  value={formData.gender} 
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer Not To Say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Occupation */}
              <div className="space-y-2">
                <Label htmlFor="occupation" className="text-foreground">
                  Are you a? <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.occupation} 
                  onValueChange={(value) => setFormData({ ...formData, occupation: value })}
                  required
                >
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder="Select occupation" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {occupations.map((occ) => (
                      <SelectItem key={occ.value} value={occ.value}>
                        {occ.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Organization */}
              <div className="space-y-2">
                <Label htmlFor="organization" className="text-foreground">
                  Organization/College Name:
                </Label>
                <Input
                  id="organization"
                  placeholder="Enter your organization or college"
                  value={formData.organization}
                  onChange={(e) =>
                    setFormData({ ...formData, organization: e.target.value })
                  }
                  className="bg-muted/50"
                />
              </div>

              {/* GitHub URL */}
              <div className="space-y-2">
                <Label htmlFor="github_url" className="text-foreground">
                  GitHub Profile URL: <span className="text-muted-foreground text-sm">(Include https://)</span>
                </Label>
                <Input
                  id="github_url"
                  type="url"
                  placeholder="https://github.com/username"
                  value={formData.github_url}
                  onChange={(e) =>
                    setFormData({ ...formData, github_url: e.target.value })
                  }
                  className="bg-muted/50"
                />
              </div>

              {/* LinkedIn URL */}
              <div className="space-y-2">
                <Label htmlFor="linkedin_url" className="text-foreground">
                  LinkedIn Profile URL: <span className="text-muted-foreground text-sm">(Include https://)</span>
                </Label>
                <Input
                  id="linkedin_url"
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedin_url}
                  onChange={(e) =>
                    setFormData({ ...formData, linkedin_url: e.target.value })
                  }
                  className="bg-muted/50"
                />
              </div>

              {/* How did you hear about us */}
              <div className="space-y-2">
                <Label htmlFor="hear_about_us" className="text-foreground">
                  Where did you hear about us:
                </Label>
                <Select 
                  value={formData.hear_about_us} 
                  onValueChange={(value) => setFormData({ ...formData, hear_about_us: value })}
                >
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {hearAboutOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-3 pt-2">
                <Checkbox
                  id="agree_terms"
                  checked={formData.agree_to_terms}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, agree_to_terms: checked as boolean })
                  }
                  className="mt-0.5"
                />
                <Label htmlFor="agree_terms" className="text-sm cursor-pointer text-foreground">
                  I agree to the{" "}
                  <Link
                    to="/terms-of-service"
                    className="text-primary font-medium hover:underline"
                  >
                    Terms and Conditions
                  </Link>
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-medium mt-6"
                variant="hero"
                disabled={submitting}
              >
                {submitting ? "Registering..." : "Register Now"}
              </Button>
            </form>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EventRegister;
