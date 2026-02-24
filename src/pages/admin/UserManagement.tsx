import { useState, useEffect } from "react";
import { api } from "@/lib/apiClient";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Users, Mail, UserPlus, Loader2, Trash2, Shield, Eye, Calendar,
  Trophy, FileSpreadsheet, Megaphone, MessageSquare, Award, FileText,
  UserCog, Send, Check,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader,
  DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";

// MongoDB camelCase field names — match AdminPermission model
interface Permission {
  _id: string;
  email: string;
  user: { _id: string; fullName: string; email: string; avatarUrl?: string } | null;
  isActive: boolean;
  canViewDashboard: boolean;
  canManageEvents: boolean;
  canManageHackathons: boolean;
  canViewRegistrations: boolean;
  canExportData: boolean;
  canManageSponsors: boolean;
  canManageTestimonials: boolean;
  canManageContent: boolean;
  canManageAchievements: boolean;
  canViewContactQueries: boolean;
  canManageUsers: boolean;
  createdAt: string;
  inviteAcceptedAt: string | null;
}

// Used for invite form — camelCase matches what backend stores in MongoDB
const defaultPermissions = {
  canViewDashboard: true,
  canManageEvents: false,
  canManageHackathons: false,
  canViewRegistrations: false,
  canExportData: false,
  canManageSponsors: false,
  canManageTestimonials: false,
  canManageContent: false,
  canManageAchievements: false,
  canViewContactQueries: false,
  canManageUsers: false,
};

const permissionLabels = [
  { key: "canViewDashboard", label: "View Dashboard", icon: Eye, description: "Can view admin dashboard" },
  { key: "canManageEvents", label: "Manage Events", icon: Calendar, description: "Create, edit, delete events" },
  { key: "canManageHackathons", label: "Manage Hackathons", icon: Trophy, description: "Create, edit, delete hackathons" },
  { key: "canViewRegistrations", label: "View Registrations", icon: Users, description: "View event registrations" },
  { key: "canExportData", label: "Export Data", icon: FileSpreadsheet, description: "Download registration data" },
  { key: "canManageSponsors", label: "Manage Sponsors", icon: Megaphone, description: "Add, edit, remove sponsors" },
  { key: "canManageTestimonials", label: "Manage Testimonials", icon: MessageSquare, description: "Manage testimonials" },
  { key: "canManageContent", label: "Manage Content", icon: FileText, description: "Edit website content" },
  { key: "canManageAchievements", label: "Manage Achievements", icon: Award, description: "Edit achievements" },
  { key: "canViewContactQueries", label: "View Contact Queries", icon: Mail, description: "View contact form submissions" },
  { key: "canManageUsers", label: "Manage Users", icon: UserCog, description: "Invite and manage admin users" },
];

const UserManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [newPermissions, setNewPermissions] = useState(defaultPermissions);
  const [sending, setSending] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);

  useEffect(() => { fetchPermissions(); }, []);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const { permissions: data } = await api.get<{ permissions: Permission[] }>("/api/admin/all-permissions");
      setPermissions(data || []);
    } catch {
      toast({ title: "Error", description: "Failed to load user permissions", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail || !inviteEmail.includes("@")) {
      toast({ title: "Invalid Email", description: "Please enter a valid email address", variant: "destructive" });
      return;
    }
    const hasAnyPermission = Object.values(newPermissions).some((v) => v);
    if (!hasAnyPermission) {
      toast({ title: "No Permissions Selected", description: "Please select at least one permission", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      const result = await api.post<{ message: string }>("/api/admin/invite", {
        email: inviteEmail.trim().toLowerCase(),
        permissions: newPermissions,   // camelCase — stored directly in MongoDB
      });
      toast({ title: "Invitation Sent! 🎉", description: result.message });
      setIsInviteOpen(false);
      setInviteEmail("");
      setNewPermissions(defaultPermissions);
      fetchPermissions();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to send invitation", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const handleUpdatePermissions = async () => {
    if (!editingPermission) return;
    try {
      const { _id, user: _u, email: _e, createdAt: _c, inviteAcceptedAt: _ia, ...updateData } = editingPermission;
      await api.put(`/api/admin/all-permissions/${_id}`, updateData);
      toast({ title: "Permissions Updated", description: "User permissions have been updated successfully" });
      setEditingPermission(null);
      fetchPermissions();
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to update permissions", variant: "destructive" });
    }
  };

  const handleDelete = async (_id: string) => {
    try {
      await api.delete(`/api/admin/all-permissions/${_id}`);
      toast({ title: "Access Revoked", description: "User access has been removed" });
      fetchPermissions();
    } catch {
      toast({ title: "Error", description: "Failed to revoke access", variant: "destructive" });
    }
  };

  const getActivePermissionsCount = (perm: Permission) =>
    permissionLabels.filter((p) => perm[p.key as keyof Permission]).length;

  return (
    <AdminLayout requiredPermission="can_manage_users">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              User Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Invite team members and manage their admin permissions
            </p>
          </div>

          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Invite User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Invite New Admin User</DialogTitle>
                <DialogDescription>
                  Enter an email address and select the permissions to grant.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Permissions</Label>
                  <div className="grid gap-3">
                    {permissionLabels.map((perm) => (
                      <div
                        key={perm.key}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <perm.icon className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">{perm.label}</p>
                            <p className="text-xs text-muted-foreground">{perm.description}</p>
                          </div>
                        </div>
                        <Switch
                          checked={newPermissions[perm.key as keyof typeof newPermissions]}
                          onCheckedChange={(checked) =>
                            setNewPermissions((prev) => ({ ...prev, [perm.key]: checked }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setNewPermissions(
                          Object.fromEntries(permissionLabels.map((p) => [p.key, true])) as typeof defaultPermissions
                        )
                      }
                    >
                      Select All
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setNewPermissions(defaultPermissions)}>
                      Reset
                    </Button>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInvite} disabled={sending}>
                  {sending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</>
                  ) : (
                    <><Send className="w-4 h-4 mr-2" />Send Invitation</>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Users</CardTitle>
            <CardDescription>Manage team members with admin access to the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : permissions.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No admin users yet</h3>
                <p className="text-muted-foreground mt-1">Invite team members to help manage your platform</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Invited</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.map((perm) => (
                      <TableRow key={perm._id}>
                        <TableCell className="font-medium">{perm.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {perm.inviteAcceptedAt ? (
                              <Badge variant="default" className="gap-1">
                                <Check className="w-3 h-3" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="gap-1">
                                <Mail className="w-3 h-3" />
                                Pending
                              </Badge>
                            )}
                            {!perm.isActive && <Badge variant="destructive">Disabled</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{getActivePermissionsCount(perm)} permissions</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {perm.createdAt ? format(new Date(perm.createdAt), "MMM d, yyyy") : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Edit Dialog */}
                            <Dialog
                              open={editingPermission?._id === perm._id}
                              onOpenChange={(open) => setEditingPermission(open ? perm : null)}
                            >
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">Edit</Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Edit Permissions</DialogTitle>
                                  <DialogDescription>Update permissions for {perm.email}</DialogDescription>
                                </DialogHeader>

                                {editingPermission && (
                                  <div className="space-y-6 py-4">
                                    <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                                      <div>
                                        <p className="font-medium">Account Active</p>
                                        <p className="text-sm text-muted-foreground">Enable or disable this user's access</p>
                                      </div>
                                      <Switch
                                        checked={editingPermission.isActive}
                                        onCheckedChange={(checked) =>
                                          setEditingPermission({ ...editingPermission, isActive: checked })
                                        }
                                      />
                                    </div>

                                    <div className="grid gap-3">
                                      {permissionLabels.map((permLabel) => (
                                        <div
                                          key={permLabel.key}
                                          className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                                        >
                                          <div className="flex items-center gap-3">
                                            <permLabel.icon className="w-4 h-4 text-muted-foreground" />
                                            <div>
                                              <p className="font-medium text-sm">{permLabel.label}</p>
                                              <p className="text-xs text-muted-foreground">{permLabel.description}</p>
                                            </div>
                                          </div>
                                          <Switch
                                            checked={editingPermission[permLabel.key as keyof Permission] as boolean}
                                            onCheckedChange={(checked) =>
                                              setEditingPermission({ ...editingPermission, [permLabel.key]: checked })
                                            }
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setEditingPermission(null)}>Cancel</Button>
                                  <Button onClick={handleUpdatePermissions}>Save Changes</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            {/* Delete */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Revoke Access?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will remove all admin permissions for <strong>{perm.email}</strong>. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(perm._id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Revoke Access
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
