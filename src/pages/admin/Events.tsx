import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash2, Users, Settings } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
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

interface Event {
  id: string;
  title: string;
  subtitle: string | null;
  event_type: string;
  event_date: string | null;
  registration_count: number;
  status: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch events");
      return;
    }

    setEvents(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    const { error } = await supabase.from("events").delete().eq("id", deleteId);

    if (error) {
      toast.error("Failed to delete event");
      return;
    }

    toast.success("Event deleted successfully");
    setDeleteId(null);
    fetchEvents();
  };

  if (loading) {
    return (
      <AdminLayout requiredPermission="can_manage_events">
        <div>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout requiredPermission="can_manage_events">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-display">Events Management</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage events, hackathons, workshops, and more
            </p>
          </div>
          <Link to="/admin/events/create">
            <Button variant="hero" size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Create Event
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {event.event_type}
                    </span>
                    <span className={`text-xs font-semibold uppercase px-2 py-1 rounded-full ${
                      event.status === 'upcoming' ? 'bg-green-500/10 text-green-500' :
                      event.status === 'ongoing' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-gray-500/10 text-gray-500'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-display line-clamp-2">
                    {event.title}
                  </h3>
                  {event.subtitle && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {event.subtitle}
                    </p>
                  )}
                </div>

                {event.event_date && (
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(event.event_date), "PPP")}
                  </p>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{event.registration_count} registrations</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link to={`/admin/events/edit/${event.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  {event.event_type === 'hackathon' && (
                    <Link to={`/admin/hackathon/${event.id}`}>
                      <Button variant="outline" className="text-primary">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleteId(event.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {events.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No events created yet</p>
            <Link to="/admin/events/create">
              <Button variant="hero">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Event
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
              This will permanently delete this event and all related registrations.
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

export default Events;
