import { useState, useEffect } from "react";
import { api } from "@/lib/apiClient";
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

// MongoDB field names (matches backend Sponsor model)
interface Sponsor {
  _id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string | null;
  tier: string;
  displayOrder: number;
  isActive: boolean;
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
    try {
      const { sponsors: data } = await api.get<{ sponsors: Sponsor[] }>("/api/content/sponsors");
      setSponsors(data || []);
    } catch {
      toast.error("Failed to fetch sponsors");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSponsors((prev) => {
      const newSponsor: Sponsor = {
        _id: `temp-${Date.now()}`,
        name: "New Sponsor",
        logoUrl: "",
        websiteUrl: null,
        tier: "partner",
        displayOrder: prev.length + 1,
        isActive: true,
      };
      return [...prev, newSponsor];
    });
  };

  const handleUpdate = (_id: string, field: keyof Sponsor, value: any) => {
    setSponsors(sponsors.map((s) => (s._id === _id ? { ...s, [field]: value } : s)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const sponsor of sponsors) {
        if (!sponsor.name || !sponsor.logoUrl) {
          toast.error("All sponsors must have a name and logo URL");
          setSaving(false);
          return;
        }
        const { _id, ...data } = sponsor;
        if (_id.startsWith("temp-")) {
          await api.post("/api/content/sponsors", data);
        } else {
          await api.put(`/api/content/sponsors/${_id}`, data);
        }
      }
      toast.success("Sponsors saved successfully");
      await fetchSponsors(); // await so state is fresh before user can interact
    } catch (error: any) {
      toast.error(error.message || "Failed to save sponsors");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    if (deleteId.startsWith("temp-")) {
      setSponsors(sponsors.filter((s) => s._id !== deleteId));
      setDeleteId(null);
      return;
    }
    try {
      await api.delete(`/api/content/sponsors/${deleteId}`);
      toast.success("Sponsor deleted successfully");
      setDeleteId(null);
      fetchSponsors();
    } catch {
      toast.error("Failed to delete sponsor");
    }
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
            <Card key={sponsor._id} className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-semibold">
                    Sponsor #{sponsor.displayOrder}
                  </Label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${sponsor._id}`} className="text-sm">Active</Label>
                      <Switch
                        id={`active-${sponsor._id}`}
                        checked={sponsor.isActive}
                        onCheckedChange={(checked) => handleUpdate(sponsor._id, "isActive", checked)}
                      />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(sponsor._id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Display Order</Label>
                    <Input
                      type="number"
                      value={sponsor.displayOrder}
                      onChange={(e) => handleUpdate(sponsor._id, "displayOrder", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tier</Label>
                    <Select
                      value={sponsor.tier}
                      onValueChange={(value) => handleUpdate(sponsor._id, "tier", value)}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
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
                    onChange={(e) => handleUpdate(sponsor._id, "name", e.target.value)}
                    placeholder="e.g., Google"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <ImageUpload
                    label="Sponsor Logo"
                    value={sponsor.logoUrl}
                    onChange={(url) => handleUpdate(sponsor._id, "logoUrl", url)}
                    altText={altTexts[sponsor._id] || `${sponsor.name} logo`}
                    onAltTextChange={(alt) => setAltTexts((prev) => ({ ...prev, [sponsor._id]: alt }))}
                    filenamePrefix={`sponsor-${sponsor.name.toLowerCase().replace(/\s+/g, "-").slice(0, 20)}`}
                    aspectRatio="auto"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Website URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={sponsor.websiteUrl || ""}
                      onChange={(e) => handleUpdate(sponsor._id, "websiteUrl", e.target.value || null)}
                      placeholder="https://example.com"
                    />
                    {sponsor.websiteUrl && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer">
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
