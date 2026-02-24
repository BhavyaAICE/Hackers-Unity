import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/apiClient";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/ui/image-upload";
import AdminLayout from "@/components/admin/AdminLayout";

// MongoDB field names (matches backend Testimonial model)
interface Testimonial {
  _id: string;
  name: string;
  role: string;
  organization?: string;
  testimonial: string;
  avatarUrl?: string;
  rating?: number;
  isFeatured?: boolean;
  displayOrder?: number;
  isActive?: boolean;
}

const Testimonials = () => {
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { testimonials: data } = await api.get<{ testimonials: Testimonial[] }>("/api/content/testimonials");
      setTestimonials(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to fetch testimonials", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTestimonial = () => {
    const newTestimonial: Testimonial = {
      _id: `temp-${Date.now()}`,
      name: "",
      role: "",
      organization: "",
      testimonial: "",
      avatarUrl: "",
      rating: 5,
      isFeatured: false,
      displayOrder: testimonials.length,
      isActive: true,
    };
    setTestimonials([...testimonials, newTestimonial]);
  };

  const handleUpdateTestimonial = (_id: string, field: string, value: any) => {
    setTestimonials(testimonials.map((t) => (t._id === _id ? { ...t, [field]: value } : t)));
  };

  const handleDeleteClick = (_id: string) => setDeleteId(_id);

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      setSaving(true);
      if (deleteId.startsWith("temp-")) {
        setTestimonials(testimonials.filter((t) => t._id !== deleteId));
      } else {
        await api.delete(`/api/content/testimonials/${deleteId}`);
        setTestimonials(testimonials.filter((t) => t._id !== deleteId));
        toast({ title: "Success", description: "Testimonial deleted successfully" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete testimonial", variant: "destructive" });
    } finally {
      setSaving(false);
      setDeleteId(null);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...testimonials];
    [updated[index], updated[index - 1]] = [updated[index - 1], updated[index]];
    updated.forEach((t, i) => { t.displayOrder = i; });
    setTestimonials(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === testimonials.length - 1) return;
    const updated = [...testimonials];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    updated.forEach((t, i) => { t.displayOrder = i; });
    setTestimonials(updated);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      for (const testimonial of testimonials) {
        if (!testimonial.name || !testimonial.role || !testimonial.testimonial) {
          toast({ title: "Error", description: "All testimonials must have a name, role, and quote", variant: "destructive" });
          setSaving(false);
          return;
        }
        const { _id, ...data } = testimonial;
        if (_id.startsWith("temp-")) {
          await api.post("/api/content/testimonials", data);
        } else {
          await api.put(`/api/content/testimonials/${_id}`, data);
        }
      }
      toast({ title: "Success", description: "Testimonials saved successfully" });
      fetchTestimonials();
      setEditingId(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to save testimonials", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout requiredPermission="can_manage_testimonials">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-muted-foreground">Loading testimonials...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout requiredPermission="can_manage_testimonials">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Testimonials Management</h1>
          <Button onClick={handleAddTestimonial} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Testimonial
          </Button>
        </div>

        <div className="grid gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <Input
                        value={testimonial.name}
                        onChange={(e) => handleUpdateTestimonial(testimonial._id, "name", e.target.value)}
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Role</label>
                      <Input
                        value={testimonial.role}
                        onChange={(e) => handleUpdateTestimonial(testimonial._id, "role", e.target.value)}
                        placeholder="Job title"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Organization</label>
                      <Input
                        value={testimonial.organization || ""}
                        onChange={(e) => handleUpdateTestimonial(testimonial._id, "organization", e.target.value)}
                        placeholder="Company name"
                      />
                    </div>
                  </div>

                  <ImageUpload
                    label="Avatar Photo"
                    value={testimonial.avatarUrl || ""}
                    onChange={(url) => handleUpdateTestimonial(testimonial._id, "avatarUrl", url)}
                    altText={`${testimonial.name || "Person"} testimonial photo`}
                    filenamePrefix={`testimonial-${testimonial.name?.slice(0, 20) || "avatar"}`}
                    aspectRatio="square"
                    description="Square image recommended (1:1 ratio)"
                  />

                  <div>
                    <label className="block text-sm font-medium mb-2">Testimonial Quote</label>
                    <Textarea
                      value={testimonial.testimonial}
                      onChange={(e) => handleUpdateTestimonial(testimonial._id, "testimonial", e.target.value)}
                      placeholder="Enter the testimonial quote"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Rating (1-5)</label>
                      <Input
                        type="number"
                        min="1"
                        max="5"
                        value={testimonial.rating || 5}
                        onChange={(e) => handleUpdateTestimonial(testimonial._id, "rating", parseInt(e.target.value))}
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={testimonial.isFeatured || false}
                          onCheckedChange={(checked) => handleUpdateTestimonial(testimonial._id, "isFeatured", checked)}
                        />
                        <span className="text-sm font-medium">Featured</span>
                      </label>
                    </div>
                    <div className="flex items-end gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={testimonial.isActive ?? true}
                          onCheckedChange={(checked) => handleUpdateTestimonial(testimonial._id, "isActive", checked)}
                        />
                        <span className="text-sm font-medium">Active</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" onClick={() => handleMoveUp(index)} disabled={index === 0}>
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleMoveDown(index)} disabled={index === testimonials.length - 1}>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(testimonial._id)}
                      className="gap-2 ml-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSave} disabled={saving} size="lg">
            {saving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>

        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this testimonial? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-4">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default Testimonials;
