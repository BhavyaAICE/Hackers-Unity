import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2, Save, ExternalLink } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  tier: string;
  display_order: number;
  is_active: boolean;
}

interface SponsorAltText {
  [id: string]: string;
}

const Sponsors = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [altTexts, setAltTexts] = useState<SponsorAltText>({});

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    const { data, error } = await supabase
      .from("sponsors")
      .select("*")
      .order("display_order");

    if (error) {
      toast.error("Failed to fetch sponsors");
      return;
    }

    setSponsors(data || []);
    setLoading(false);
  };

  const handleAdd = () => {
    const newSponsor: Sponsor = {
      id: `temp-${Date.now()}`,
      name: "New Sponsor",
      logo_url: "",
      website_url: null,
      tier: "partner",
      display_order: sponsors.length + 1,
      is_active: true,
    };
    setSponsors([...sponsors, newSponsor]);
  };

  const handleUpdate = (id: string, field: keyof Sponsor, value: any) => {
    setSponsors(
      sponsors.map((sponsor) =>
        sponsor.id === id ? { ...sponsor, [field]: value } : sponsor
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      for (const sponsor of sponsors) {
        if (!sponsor.name || !sponsor.logo_url) {
          toast.error("All sponsors must have a name and logo URL");
          setSaving(false);
          return;
        }

        if (sponsor.id.startsWith("temp-")) {
          const { id, ...data } = sponsor;
          const { error } = await supabase.from("sponsors").insert([data]);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("sponsors")
            .update({
              name: sponsor.name,
              logo_url: sponsor.logo_url,
              website_url: sponsor.website_url,
              tier: sponsor.tier,
              display_order: sponsor.display_order,
              is_active: sponsor.is_active,
            })
            .eq("id", sponsor.id);
          if (error) throw error;
        }
      }

      toast.success("Sponsors saved successfully");
      fetchSponsors();
    } catch (error: any) {
      toast.error(error.message || "Failed to save sponsors");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    if (deleteId.startsWith("temp-")) {
      setSponsors(sponsors.filter((s) => s.id !== deleteId));
      setDeleteId(null);
      return;
    }

    const { error } = await supabase.from("sponsors").delete().eq("id", deleteId);

    if (error) {
      toast.error("Failed to delete sponsor");
      return;
    }

    toast.success("Sponsor deleted successfully");
    setDeleteId(null);
    fetchSponsors();
  };

  if (loading) {
    return (
      <AdminLayout requiredPermission="can_manage_sponsors">
        <div>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout requiredPermission="can_manage_sponsors">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-display">Sponsors Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage sponsors and partners displayed on the homepage
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Sponsor
            </Button>
            <Button variant="hero" onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save All"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sponsors.map((sponsor) => (
            <Card key={sponsor.id} className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-semibold">
                    Sponsor #{sponsor.display_order}
                  </Label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${sponsor.id}`} className="text-sm">
                        Active
                      </Label>
                      <Switch
                        id={`active-${sponsor.id}`}
                        checked={sponsor.is_active}
                        onCheckedChange={(checked) =>
                          handleUpdate(sponsor.id, "is_active", checked)
                        }
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(sponsor.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Display Order</Label>
                    <Input
                      type="number"
                      value={sponsor.display_order}
                      onChange={(e) =>
                        handleUpdate(
                          sponsor.id,
                          "display_order",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tier</Label>
                    <Select
                      value={sponsor.tier}
                      onValueChange={(value) =>
                        handleUpdate(sponsor.id, "tier", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="platinum">Platinum</SelectItem>
                        <SelectItem value="gold">Gold</SelectItem>
                        <SelectItem value="silver">Silver</SelectItem>
                        <SelectItem value="partner">Partner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Sponsor Name *</Label>
                  <Input
                    value={sponsor.name}
                    onChange={(e) => handleUpdate(sponsor.id, "name", e.target.value)}
                    placeholder="e.g., Google"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <ImageUpload
                    label="Sponsor Logo"
                    value={sponsor.logo_url}
                    onChange={(url) => handleUpdate(sponsor.id, "logo_url", url)}
                    altText={altTexts[sponsor.id] || `${sponsor.name} logo`}
                    onAltTextChange={(alt) => setAltTexts(prev => ({ ...prev, [sponsor.id]: alt }))}
                    filenamePrefix={`sponsor-${sponsor.name.toLowerCase().replace(/\s+/g, '-').slice(0, 20)}`}
                    aspectRatio="auto"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Website URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={sponsor.website_url || ""}
                      onChange={(e) =>
                        handleUpdate(sponsor.id, "website_url", e.target.value || null)
                      }
                      placeholder="https://example.com"
                    />
                    {sponsor.website_url && (
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                      >
                        <a
                          href={sponsor.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {sponsors.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No sponsors yet</p>
            <Button variant="hero" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Sponsor
            </Button>
          </Card>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this sponsor. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default Sponsors;
