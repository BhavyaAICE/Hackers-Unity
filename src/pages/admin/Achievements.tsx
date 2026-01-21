import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2, Save } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
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

interface Achievement {
  id: string;
  icon_name: string;
  value: string;
  label: string;
  gradient: string;
  glow: string;
  display_order: number;
  is_active: boolean;
}

const iconOptions = [
  { value: "trophy", label: "Trophy" },
  { value: "users", label: "Users" },
  { value: "building2", label: "Building" },
  { value: "calendar", label: "Calendar" },
  { value: "award", label: "Award" },
  { value: "target", label: "Target" },
  { value: "rocket", label: "Rocket" },
  { value: "star", label: "Star" },
];

const gradientOptions = [
  { value: "from-amber-500 to-orange-600", label: "Amber to Orange" },
  { value: "from-cyan-400 to-blue-600", label: "Cyan to Blue" },
  { value: "from-purple-500 to-pink-600", label: "Purple to Pink" },
  { value: "from-emerald-400 to-teal-600", label: "Emerald to Teal" },
  { value: "from-red-500 to-pink-600", label: "Red to Pink" },
  { value: "from-yellow-400 to-orange-500", label: "Yellow to Orange" },
  { value: "from-green-400 to-cyan-500", label: "Green to Cyan" },
  { value: "from-primary to-secondary", label: "Primary to Secondary" },
];

const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("display_order");

    if (error) {
      toast.error("Failed to fetch achievements");
      return;
    }

    setAchievements(data || []);
    setLoading(false);
  };

  const handleAdd = () => {
    const newAchievement: Achievement = {
      id: `temp-${Date.now()}`,
      icon_name: "trophy",
      value: "0+",
      label: "New Achievement",
      gradient: "from-primary to-secondary",
      glow: "shadow-primary/30",
      display_order: achievements.length + 1,
      is_active: true,
    };
    setAchievements([...achievements, newAchievement]);
  };

  const handleUpdate = (id: string, field: keyof Achievement, value: any) => {
    setAchievements(
      achievements.map((achievement) =>
        achievement.id === id ? { ...achievement, [field]: value } : achievement
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      for (const achievement of achievements) {
        if (achievement.id.startsWith("temp-")) {
          const { id, ...data } = achievement;
          const { error } = await supabase.from("achievements").insert([data]);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("achievements")
            .update({
              icon_name: achievement.icon_name,
              value: achievement.value,
              label: achievement.label,
              gradient: achievement.gradient,
              glow: achievement.glow,
              display_order: achievement.display_order,
              is_active: achievement.is_active,
            })
            .eq("id", achievement.id);
          if (error) throw error;
        }
      }

      toast.success("Achievements saved successfully");
      fetchAchievements();
    } catch (error: any) {
      toast.error(error.message || "Failed to save achievements");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    if (deleteId.startsWith("temp-")) {
      setAchievements(achievements.filter((a) => a.id !== deleteId));
      setDeleteId(null);
      return;
    }

    const { error } = await supabase.from("achievements").delete().eq("id", deleteId);

    if (error) {
      toast.error("Failed to delete achievement");
      return;
    }

    toast.success("Achievement deleted successfully");
    setDeleteId(null);
    fetchAchievements();
  };

  if (loading) {
    return (
      <AdminLayout requiredPermission="can_manage_achievements">
        <div>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout requiredPermission="can_manage_achievements">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-display">Achievements Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage the achievements displayed on the homepage
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Achievement
            </Button>
            <Button variant="hero" onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save All"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-semibold">Achievement #{achievement.display_order}</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${achievement.id}`} className="text-sm">Active</Label>
                      <Switch
                        id={`active-${achievement.id}`}
                        checked={achievement.is_active}
                        onCheckedChange={(checked) => handleUpdate(achievement.id, "is_active", checked)}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(achievement.id)}
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
                      value={achievement.display_order}
                      onChange={(e) => handleUpdate(achievement.id, "display_order", parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Select
                      value={achievement.icon_name}
                      onValueChange={(value) => handleUpdate(achievement.id, "icon_name", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Value</Label>
                  <Input
                    value={achievement.value}
                    onChange={(e) => handleUpdate(achievement.id, "value", e.target.value)}
                    placeholder="e.g., 10,000+"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Label</Label>
                  <Input
                    value={achievement.label}
                    onChange={(e) => handleUpdate(achievement.id, "label", e.target.value)}
                    placeholder="e.g., Community Members"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Gradient</Label>
                  <Select
                    value={achievement.gradient}
                    onValueChange={(value) => handleUpdate(achievement.id, "gradient", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {gradientOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Glow Effect</Label>
                  <Input
                    value={achievement.glow}
                    onChange={(e) => handleUpdate(achievement.id, "glow", e.target.value)}
                    placeholder="e.g., shadow-primary/30"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {achievements.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No achievements yet</p>
            <Button variant="hero" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Achievement
            </Button>
          </Card>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this achievement. This action cannot be undone.
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

export default Achievements;
