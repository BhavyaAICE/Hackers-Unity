import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Plus, Trash2, GripVertical } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { ImageUpload } from "@/components/ui/image-upload";
import type { Json } from "@/integrations/supabase/types";

interface HeroImage {
  id: string;
  url: string;
  alt: string;
  order: number;
}

interface HeroContent {
  badge_text: string;
  heading: string;
  heading_highlight: string;
  subheading: string;
  cta_text: string;
  images: HeroImage[];
}

const defaultHeroContent: HeroContent = {
  badge_text: "Learn | Build | Innovate",
  heading: "Empowering Developers with",
  heading_highlight: "Hacker's Unity",
  subheading: "Hacker's Unity is India's leading tech community, uniting developers, innovators, and technology enthusiasts across the nation. Driven by a mission to empower students with real-world skills and connect them with industry opportunities.",
  cta_text: "Get Started",
  images: [
    { id: "1", url: "", alt: "Hackathon event", order: 0 },
    { id: "2", url: "", alt: "Developer community", order: 1 },
    { id: "3", url: "", alt: "Tech workshop", order: 2 },
  ],
};

const Content = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroContent, setHeroContent] = useState<HeroContent>(defaultHeroContent);
  const [contentId, setContentId] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from("website_content")
        .select("*")
        .eq("section_key", "hero")
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setContentId(data.id);
        const content = data.content as unknown as HeroContent | null;
        if (content) {
          setHeroContent({
            ...defaultHeroContent,
            ...content,
            images: content?.images || defaultHeroContent.images,
          });
        }
      }
    } catch (error: any) {
      console.error("Error fetching content:", error);
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const contentJson = JSON.parse(JSON.stringify(heroContent)) as Json;
      
      if (contentId) {
        const { error } = await supabase
          .from("website_content")
          .update({
            section_key: "hero",
            title: "Hero Section",
            content: contentJson,
            is_active: true,
          })
          .eq("id", contentId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("website_content")
          .insert([{
            section_key: "hero",
            title: "Hero Section",
            content: contentJson,
            is_active: true,
          }])
          .select()
          .single();
        if (error) throw error;
        setContentId(data.id);
      }

      toast.success("Hero content saved successfully");
    } catch (error: any) {
      console.error("Error saving content:", error);
      toast.error(error.message || "Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  const updateImage = (index: number, field: keyof HeroImage, value: string) => {
    setHeroContent((prev) => {
      const images = prev.images.map((img, i) =>
        i === index ? { ...img, [field]: value } : img
      );
      return { ...prev, images };
    });
  };

  const addImage = () => {
    setHeroContent((prev) => {
      if (prev.images.length >= 5) return prev;

      const newImage: HeroImage = {
        id: `new-${Date.now()}`,
        url: "",
        alt: "New image",
        order: prev.images.length,
      };

      return {
        ...prev,
        images: [...prev.images, newImage],
      };
    });
  };

  const removeImage = (index: number) => {
    setHeroContent((prev) => {
      if (prev.images.length <= 1) {
        toast.error("You need at least one image in the hero section");
        return prev;
      }

      const images = prev.images
        .filter((_, i) => i !== index)
        .map((img, i) => ({ ...img, order: i }));

      return { ...prev, images };
    });
  };

  const moveImage = (fromIndex: number, direction: "up" | "down") => {
    setHeroContent((prev) => {
      const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
      if (toIndex < 0 || toIndex >= prev.images.length) return prev;

      const images = [...prev.images];
      [images[fromIndex], images[toIndex]] = [images[toIndex], images[fromIndex]];

      const ordered = images.map((img, i) => ({ ...img, order: i }));
      return { ...prev, images: ordered };
    });
  };

  if (loading) {
    return (
      <AdminLayout requiredPermission="can_manage_content">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-muted rounded" />
          <div className="h-96 bg-muted rounded-xl" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout requiredPermission="can_manage_content">
      <div className="space-y-6 max-w-4xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-display">Content Management</h1>
            <p className="text-muted-foreground mt-2">
              Edit the hero section content and images
            </p>
          </div>
          <Button variant="hero" onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Hero Text Content */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Hero Text Content</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="badge_text">Badge Text</Label>
              <Input
                id="badge_text"
                value={heroContent.badge_text}
                onChange={(e) =>
                  setHeroContent({ ...heroContent, badge_text: e.target.value })
                }
                placeholder="Learn | Build | Innovate"
              />
              <p className="text-xs text-muted-foreground">
                Use " | " to separate items (they will be styled differently)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="heading">Main Heading</Label>
                <Input
                  id="heading"
                  value={heroContent.heading}
                  onChange={(e) =>
                    setHeroContent({ ...heroContent, heading: e.target.value })
                  }
                  placeholder="Empowering Developers with"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heading_highlight">Highlighted Text</Label>
                <Input
                  id="heading_highlight"
                  value={heroContent.heading_highlight}
                  onChange={(e) =>
                    setHeroContent({ ...heroContent, heading_highlight: e.target.value })
                  }
                  placeholder="Hacker's Unity"
                />
                <p className="text-xs text-muted-foreground">
                  This text will have gradient styling
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subheading">Subheading / Description</Label>
              <Textarea
                id="subheading"
                rows={4}
                value={heroContent.subheading}
                onChange={(e) =>
                  setHeroContent({ ...heroContent, subheading: e.target.value })
                }
                placeholder="Describe your community..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cta_text">Button Text (for non-logged in users)</Label>
              <Input
                id="cta_text"
                value={heroContent.cta_text}
                onChange={(e) =>
                  setHeroContent({ ...heroContent, cta_text: e.target.value })
                }
                placeholder="Get Started"
              />
            </div>
          </div>
        </Card>

        {/* Hero Images */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold">Hero Images</h2>
              <p className="text-sm text-muted-foreground">
                Add up to 5 images for the hero section gallery
              </p>
            </div>
            {heroContent.images.length < 5 && (
              <Button variant="outline" size="sm" onClick={addImage}>
                <Plus className="w-4 h-4 mr-2" />
                Add Image
              </Button>
            )}
          </div>

          <div className="space-y-6">
            {heroContent.images.map((image, index) => (
              <Card key={image.id} className="p-4 bg-muted/30">
                <div className="flex items-start gap-4">
                  {/* Reorder controls */}
                  <div className="flex flex-col items-center gap-1 pt-2">
                    <GripVertical className="w-5 h-5 text-muted-foreground" />
                    <div className="flex flex-col gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => moveImage(index, "up")}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => moveImage(index, "down")}
                        disabled={index === heroContent.images.length - 1}
                      >
                        ↓
                      </Button>
                    </div>
                  </div>

                  {/* Image content */}
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <Label className="text-base font-semibold">
                        Image {index + 1}
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(index)}
                        disabled={heroContent.images.length <= 1}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>

                    <ImageUpload
                      value={image.url}
                      onChange={(url) => updateImage(index, "url", url)}
                      altText={image.alt}
                      onAltTextChange={(alt) => updateImage(index, "alt", alt)}
                      filenamePrefix={`hero-image-${index + 1}`}
                      aspectRatio="auto"
                      description="Recommended: Portrait orientation (3:4 ratio), min 400px wide"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {heroContent.images.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No images added yet</p>
              <Button variant="outline" onClick={addImage}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Image
              </Button>
            </div>
          )}
        </Card>

        {/* Preview Note */}
        <Card className="p-4 bg-primary/5 border-primary/20">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Changes will be visible on the homepage after saving. 
            The hero section will display the images in a staggered gallery layout.
          </p>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Content;
