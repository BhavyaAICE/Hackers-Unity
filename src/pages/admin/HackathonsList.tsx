import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash2, Users, Eye, Trophy, Calendar } from "lucide-react";
import { toast } from "sonner";
import { format, isPast } from "date-fns";
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

interface Hackathon {
  id: string;
  title: string;
  subtitle: string | null;
  event_date: string | null;
  event_end_date: string | null;
  registration_deadline: string | null;
  registration_count: number;
  status: string;
  prize_pool: string | null;
  location_name: string | null;
}

const HackathonsList = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchHackathons = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("event_type", "hackathon")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch hackathons");
      return;
    }

    setHackathons(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchHackathons();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    // Delete all related data first
    await Promise.all([
      supabase.from("hackathon_challenges").delete().eq("event_id", deleteId),
      supabase.from("hackathon_mentors").delete().eq("event_id", deleteId),
      supabase.from("hackathon_jury").delete().eq("event_id", deleteId),
      supabase.from("hackathon_prizes").delete().eq("event_id", deleteId),
      supabase.from("hackathon_faqs").delete().eq("event_id", deleteId),
      supabase.from("hackathon_winners").delete().eq("event_id", deleteId),
      supabase.from("schedule_items").delete().eq("event_id", deleteId),
      supabase.from("event_registrations").delete().eq("event_id", deleteId),
    ]);

    const { error } = await supabase.from("events").delete().eq("id", deleteId);

    if (error) {
      toast.error("Failed to delete hackathon");
      return;
    }

    toast.success("Hackathon deleted successfully");
    setDeleteId(null);
    fetchHackathons();
  };

  const getStatusColor = (hackathon: Hackathon) => {
    if (hackathon.status === 'completed') return 'bg-green-500/10 text-green-500';
    if (hackathon.status === 'ongoing') return 'bg-blue-500/10 text-blue-500';
    if (hackathon.status === 'cancelled') return 'bg-gray-500/10 text-gray-500';
    
    // Check registration deadline
    if (hackathon.registration_deadline && isPast(new Date(hackathon.registration_deadline))) {
      return 'bg-yellow-500/10 text-yellow-500';
    }
    
    return 'bg-primary/10 text-primary';
  };

  const getStatusLabel = (hackathon: Hackathon) => {
    if (hackathon.status === 'completed') return 'Completed';
    if (hackathon.status === 'ongoing') return 'Ongoing';
    if (hackathon.status === 'cancelled') return 'Cancelled';
    
    if (hackathon.registration_deadline && isPast(new Date(hackathon.registration_deadline))) {
      return 'Reg. Closed';
    }
    
    return 'Upcoming';
  };

  if (loading) {
    return (
      <AdminLayout requiredPermission="can_manage_hackathons">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-muted rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-xl" />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout requiredPermission="can_manage_hackathons">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-display">Hackathons</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage hackathon events with challenges, mentors, prizes, and more
            </p>
          </div>
          <Link to="/admin/hackathons/create">
            <Button variant="hero" size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Create Hackathon
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons.map((hackathon) => (
            <Card key={hackathon.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-semibold uppercase px-2 py-1 rounded-full ${getStatusColor(hackathon)}`}>
                      {getStatusLabel(hackathon)}
                    </span>
                    {hackathon.prize_pool && (
                      <span className="text-xs font-semibold flex items-center gap-1 text-primary">
                        <Trophy className="w-3 h-3" />
                        {hackathon.prize_pool}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold font-display line-clamp-2">
                    {hackathon.title}
                  </h3>
                  {hackathon.subtitle && (
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                      {hackathon.subtitle}
                    </p>
                  )}
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  {hackathon.event_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(hackathon.event_date), "PPP")}</span>
                    </div>
                  )}
                  {hackathon.registration_deadline && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-yellow-500" />
                      <span>Reg. deadline: {format(new Date(hackathon.registration_deadline), "PP")}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{hackathon.registration_count} registrations</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Link to={`/admin/hackathons/edit/${hackathon.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Link to={`/hackathon/${hackathon.id}`} target="_blank">
                    <Button variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleteId(hackathon.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {hackathons.length === 0 && (
          <Card className="p-12 text-center">
            <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">No hackathons yet</h3>
            <p className="text-muted-foreground mb-6">Create your first hackathon event to get started</p>
            <Link to="/admin/hackathons/create">
              <Button variant="hero">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Hackathon
              </Button>
            </Link>
          </Card>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this hackathon and all related data including
              challenges, mentors, jury, prizes, FAQs, winners, and registrations.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default HackathonsList;