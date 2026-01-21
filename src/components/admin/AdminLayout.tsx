import { ReactNode, useState } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { usePermissions, UserPermissions } from "@/hooks/usePermissions";
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Award,
  MessageSquare,
  Loader2,
  Menu,
  X,
  Trophy,
  Inbox,
  Shield,
  Megaphone,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/hackers-unity-logo.png";

interface AdminLayoutProps {
  children: ReactNode;
  requiredPermission?: keyof UserPermissions;
}

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  permission?: keyof UserPermissions;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin", permission: "can_view_dashboard" },
  { icon: Trophy, label: "Hackathons", href: "/admin/hackathons", permission: "can_manage_hackathons" },
  { icon: Calendar, label: "Events", href: "/admin/events", permission: "can_manage_events" },
  { icon: Users, label: "Registrations", href: "/admin/registrations", permission: "can_view_registrations" },
  { icon: Inbox, label: "Contact Queries", href: "/admin/contact-queries", permission: "can_view_contact_queries" },
  { icon: Award, label: "Achievements", href: "/admin/achievements", permission: "can_manage_achievements" },
  { icon: FileText, label: "Content", href: "/admin/content", permission: "can_manage_content" },
  { icon: Megaphone, label: "Sponsors", href: "/admin/sponsors", permission: "can_manage_sponsors" },
  { icon: MessageSquare, label: "Testimonials", href: "/admin/testimonials", permission: "can_manage_testimonials" },
  { icon: Shield, label: "User Management", href: "/admin/users", permission: "can_manage_users" },
];

const AdminLayout = ({ children, requiredPermission }: AdminLayoutProps) => {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { permissions, loading: permissionsLoading, hasAnyPermission, hasPermission } = usePermissions();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loading = adminLoading || permissionsLoading;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Check if user has any admin access (super admin or any permission)
  const hasAccess = isAdmin || hasAnyPermission();
  
  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  // Check specific permission if required
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">
            You don't have permission to access this page.
          </p>
          <Link to="/admin">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Filter nav items based on permissions
  const visibleNavItems = navItems.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-16 flex items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mr-4"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Hacker's Unity" className="h-8 w-auto" />
        </Link>
      </div>

      <div className="flex pt-16 lg:pt-0">
        <aside
          className={`
            fixed lg:sticky top-16 lg:top-0 left-0 z-40
            w-64 bg-card border-r border-border min-h-screen
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <div className="p-6 hidden lg:block">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Hacker's Unity" className="h-10 w-auto" />
            </Link>
          </div>

          <nav className="px-4 space-y-2 pb-4">
            {visibleNavItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-30 top-16"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
