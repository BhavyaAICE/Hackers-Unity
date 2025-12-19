import { ReactNode, useState } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
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
  Inbox
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/hackers-unity-logo.png";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Trophy, label: "Hackathons", href: "/admin/hackathons" },
  { icon: Calendar, label: "Events", href: "/admin/events" },
  { icon: Users, label: "Registrations", href: "/admin/registrations" },
  { icon: Inbox, label: "Contact Queries", href: "/admin/contact-queries" },
  { icon: Award, label: "Achievements", href: "/admin/achievements" },
  { icon: FileText, label: "Content", href: "/admin/content" },
  { icon: Award, label: "Sponsors", href: "/admin/sponsors" },
  { icon: MessageSquare, label: "Testimonials", href: "/admin/testimonials" },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isAdmin, loading } = useAdmin();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

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
            {navItems.map((item) => {
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
