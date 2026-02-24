import { useState, useEffect } from "react";
import { api } from "@/lib/apiClient";
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

// MongoDB field names (matches backend Achievement model)
interface Achievement {
  _id: string;
  category: string;
  title: string | null;
  statsValue: string;
  statsLabel: string;
  displayOrder: number;
  isActive: boolean;
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

const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const { achievements: data } = await api.get<{ achievements: Achievement[] }>("/api/content/achievements");
      setAchievements(data || []);
    } catch {
      toast.error("Failed to fetch achievements");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    const newAchievement: Achievement = {
      _id: `temp-${Date.now()}`,
      category: "trophy",
      title: null,
      statsValue: "0+",
      statsLabel: "New Achievement",
      displayOrder: achievements.length + 1,
      isActive: true,
    };
    setAchievements([...achievements, newAchievement]);
  };

  const handleUpdate = (id: string, field: keyof Achievement, value: any) => {
    setAchievements(
      achievements.map((a) => (a._id === id ? { ...a, [field]: value } : a))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const achievement of achievements) {
        const { _id, ...data } = achievement;
        if (_id.startsWith("temp-")) {
          await api.post("/api/content/achievements", data);
        } else {
          await api.put(`/api/content/achievements/${_id}`, data);
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
      setAchievements(achievements.filter((a) => a._id !== deleteId));
      setDeleteId(null);
      return;
    }
    try {
      await api.delete(`/api/content/achievements/${deleteId}`);
      toast.success("Achievement deleted successfully");
      setDeleteId(null);
      fetchAchievements();
    } catch {
      toast.error("Failed to delete achievement");
    }
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
              Manage the achievement stats displayed on the homepage
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
            <Card key={achievement._id} className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-semibold">
                    Achievement #{achievement.displayOrder}
                  </Label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${achievement._id}`} className="text-sm">
                        Active
                      </Label>
                      <Switch
                        id={`active-${achievement._id}`}
                        checked={achievement.isActive}
                        onCheckedChange={(checked) =>
                          handleUpdate(achievement._id, "isActive", checked)
                        }
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(achievement._id)}
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
                      value={achievement.displayOrder}
                      onChange={(e) =>
                        handleUpdate(achievement._id, "displayOrder", parseInt(e.target.value) || 0)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Select
                      value={achievement.category}
                      onValueChange={(value) =>
                        handleUpdate(achievement._id, "category", value)
                      }
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
                  <Label>Stat Value</Label>
                  <Input
                    value={achievement.statsValue ?? ""}
                    onChange={(e) =>
                      handleUpdate(achievement._id, "statsValue", e.target.value)
                    }
                    placeholder="e.g., 10,000+"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Stat Label</Label>
                  <Input
                    value={achievement.statsLabel ?? ""}
                    onChange={(e) =>
                      handleUpdate(achievement._id, "statsLabel", e.target.value)
                    }
                    placeholder="e.g., Community Members"
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
