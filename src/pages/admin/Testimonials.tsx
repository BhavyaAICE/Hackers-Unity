import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/ui/image-upload";
import AdminLayout from "@/components/admin/AdminLayout";
interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization?: string;
  testimonial: string;
  avatar_url?: string;
  rating?: number;
  is_featured?: boolean;
  display_order?: number;
  is_active?: boolean;
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
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("display_order");
      if (error) throw error;
      setTestimonials(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to fetch testimonials", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: `temp-${Date.now()}`,
      name: "",
      role: "",
      organization: "",
      testimonial: "",
      avatar_url: "",
      rating: 5,
      is_featured: false,
      display_order: testimonials.length,
      is_active: true,
    };
    setTestimonials([...testimonials, newTestimonial]);
  };

  const handleUpdateTestimonial = (id: string, field: string, value: any) => {
    setTestimonials(
      testimonials.map((t) =>
        t.id === id ? { ...t, [field]: value } : t
      )
    );
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      setSaving(true);
      if (deleteId.startsWith("temp-")) {
        setTestimonials(testimonials.filter((t) => t.id !== deleteId));
      } else {
        const { error } = await supabase
          .from("testimonials")
          .delete()
          .eq("id", deleteId);
        if (error) throw error;
        setTestimonials(testimonials.filter((t) => t.id !== deleteId));
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
    const newTestimonials = [...testimonials];
    [newTestimonials[index], newTestimonials[index - 1]] = [
      newTestimonials[index - 1],
      newTestimonials[index],
    ];
    newTestimonials.forEach((t, i) => {
      t.display_order = i;
    });
    setTestimonials(newTestimonials);
  };

  const handleMoveDown = (index: number) => {
    if (index === testimonials.length - 1) return;
    const newTestimonials = [...testimonials];
    [newTestimonials[index], newTestimonials[index + 1]] = [
      newTestimonials[index + 1],
      newTestimonials[index],
    ];
    newTestimonials.forEach((t, i) => {
      t.display_order = i;
    });
    setTestimonials(newTestimonials);
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

        if (testimonial.id.startsWith("temp-")) {
          const { id, ...data } = testimonial;
          const { error } = await supabase.from("testimonials").insert([data]);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("testimonials")
            .update({
              name: testimonial.name,
              role: testimonial.role,
              organization: testimonial.organization,
              testimonial: testimonial.testimonial,
              avatar_url: testimonial.avatar_url,
              rating: testimonial.rating,
              is_featured: testimonial.is_featured,
              display_order: testimonial.display_order,
              is_active: testimonial.is_active,
            })
            .eq("id", testimonial.id);
          if (error) throw error;
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
            key={testimonial.id}
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
                      onChange={(e) =>
                        handleUpdateTestimonial(testimonial.id, "name", e.target.value)
                      }
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Role</label>
                    <Input
                      value={testimonial.role}
                      onChange={(e) =>
                        handleUpdateTestimonial(testimonial.id, "role", e.target.value)
                      }
                      placeholder="Job title"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Organization</label>
                    <Input
                      value={testimonial.organization || ""}
                      onChange={(e) =>
                        handleUpdateTestimonial(testimonial.id, "organization", e.target.value)
                      }
                      placeholder="Company name"
                    />
                  </div>
                </div>
                
                <ImageUpload
                  label="Avatar Photo"
                  value={testimonial.avatar_url || ""}
                  onChange={(url) => handleUpdateTestimonial(testimonial.id, "avatar_url", url)}
                  altText={`${testimonial.name || 'Person'} testimonial photo`}
                  filenamePrefix={`testimonial-${testimonial.name?.slice(0, 20) || 'avatar'}`}
                  aspectRatio="square"
                  description="Square image recommended (1:1 ratio)"
                />

                <div>
                  <label className="block text-sm font-medium mb-2">Testimonial Quote</label>
                  <Textarea
                    value={testimonial.testimonial}
                    onChange={(e) =>
                      handleUpdateTestimonial(testimonial.id, "testimonial", e.target.value)
                    }
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
                      onChange={(e) =>
                        handleUpdateTestimonial(testimonial.id, "rating", parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={testimonial.is_featured || false}
                        onCheckedChange={(checked) =>
                          handleUpdateTestimonial(testimonial.id, "is_featured", checked)
                        }
                      />
                      <span className="text-sm font-medium">Featured</span>
                    </label>
                  </div>
                  <div className="flex items-end gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={testimonial.is_active || true}
                        onCheckedChange={(checked) =>
                          handleUpdateTestimonial(testimonial.id, "is_active", checked)
                        }
                      />
                      <span className="text-sm font-medium">Active</span>
                    </label>
                  </div>
                </div>


                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="gap-2"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === testimonials.length - 1}
                    className="gap-2"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(testimonial.id)}
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
