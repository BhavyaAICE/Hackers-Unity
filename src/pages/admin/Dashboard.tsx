import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Award, MessageSquare, Trophy } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

const Dashboard = () => {
  const [stats, setStats] = useState({
    events: 0,
    registrations: 0,
    achievements: 0,
    sponsors: 0,
    testimonials: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [eventsRes, registrationsRes, achievementsRes, sponsorsRes, testimonialsRes] = await Promise.allSettled([
          api.get<{ totalCount: number }>("/api/events?limit=1"),
          api.get<{ totalCount: number }>("/api/events/admin/registrations?limit=1"),
          api.get<{ achievements: any[] }>("/api/content/achievements"),
          api.get<{ sponsors: any[] }>("/api/content/sponsors"),
          api.get<{ testimonials: any[] }>("/api/content/testimonials"),
        ]);

        setStats({
          events: eventsRes.status === 'fulfilled' ? (eventsRes.value.totalCount || 0) : 0,
          registrations: registrationsRes.status === 'fulfilled' ? (registrationsRes.value.totalCount || 0) : 0,
          achievements: achievementsRes.status === 'fulfilled' ? (achievementsRes.value.achievements?.length || 0) : 0,
          sponsors: sponsorsRes.status === 'fulfilled' ? (sponsorsRes.value.sponsors?.length || 0) : 0,
          testimonials: testimonialsRes.status === 'fulfilled' ? (testimonialsRes.value.testimonials?.length || 0) : 0,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Events",
      value: stats.events,
      icon: Calendar,
      color: "text-primary",
    },
    {
      title: "Total Registrations",
      value: stats.registrations,
      icon: Users,
      color: "text-secondary",
    },
    {
      title: "Achievements",
      value: stats.achievements,
      icon: Trophy,
      color: "text-amber-500",
    },
    {
      title: "Active Sponsors",
      value: stats.sponsors,
      icon: Award,
      color: "text-accent",
    },
    {
      title: "Testimonials",
      value: stats.testimonials,
      icon: MessageSquare,
      color: "text-green-500",
    },
  ];

  return (
    <AdminLayout requiredPermission="can_view_dashboard">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-display">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to the admin panel. Manage your events and content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
