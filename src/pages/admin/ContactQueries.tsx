import { useState, useEffect } from "react";
import { api } from "@/lib/apiClient";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Loader2, CheckCircle, Trash2, Mail, Phone, Clock, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ContactQuery {
  _id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  createdAt: string;
}

const ContactQueries = () => {
  const { toast } = useToast();
  const [queries, setQueries] = useState<ContactQuery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [markingDone, setMarkingDone] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchQueries = async () => {
    try {
      const { queries: data } = await api.get<{ queries: ContactQuery[] }>("/api/content/contact");
      setQueries(data || []);
    } catch {
      toast({ title: "Error", description: "Failed to fetch contact queries", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchQueries(); }, []);

  const markDone = async (id: string) => {
    setMarkingDone(id);
    try {
      await api.put(`/api/content/contact/${id}`, { status: "done" });
      fetchQueries();
      toast({ title: "Query marked as done" });
    } catch {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    } finally {
      setMarkingDone(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/api/content/contact/${deleteId}`);
      fetchQueries();
      toast({ title: "Query deleted" });
      setDeleteId(null);
    } catch {
      toast({ title: "Error", description: "Failed to delete query", variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  const pendingQueries = queries?.filter((q) => q.status === "pending") || [];
  const doneQueries = queries?.filter((q) => q.status === "done") || [];

  return (
    <AdminLayout requiredPermission="can_view_contact_queries">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-display">Contact Queries</h1>
          <p className="text-muted-foreground mt-2">
            Manage contact form submissions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingQueries.length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{doneQueries.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </Card>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : queries?.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No contact queries yet</h3>
            <p className="text-muted-foreground mt-2">
              When someone submits the contact form, their queries will appear here.
            </p>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queries?.map((query) => (
                  <TableRow key={query._id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{query.name}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <a href={`mailto:${query.email}`} className="hover:text-primary">
                            {query.email}
                          </a>
                        </div>
                        {query.phone && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            <a href={`tel:${query.phone}`} className="hover:text-primary">
                              {query.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="max-w-md line-clamp-2">{query.message}</p>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(query.createdAt), "MMM d, yyyy h:mm a")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={query.status === "done" ? "default" : "secondary"}
                        className={
                          query.status === "done"
                            ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                            : "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                        }
                      >
                        {query.status === "done" ? "Done" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {query.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markDone(query._id)}
                            disabled={markingDone === query._id}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark Done
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(query._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Query</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this contact query? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
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

export default ContactQueries;
