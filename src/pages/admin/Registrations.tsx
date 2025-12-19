import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Event {
  id: string;
  title: string;
}

interface Registration {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  organization: string | null;
  designation: string | null;
  registered_at: string;
  status: string;
  event_id: string;
}

const Registrations = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrationsByEvent, setRegistrationsByEvent] = useState<
    Record<string, Registration[]>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const { data: eventsData } = await supabase
      .from("events")
      .select("id, title")
      .order("created_at", { ascending: false });

    if (eventsData) {
      setEvents(eventsData);

      const registrationsMap: Record<string, Registration[]> = {};

      for (const event of eventsData) {
        const { data: regs } = await supabase
          .from("event_registrations")
          .select("*")
          .eq("event_id", event.id)
          .order("registered_at", { ascending: false });

        if (regs) {
          registrationsMap[event.id] = regs;
        }
      }

      setRegistrationsByEvent(registrationsMap);
    }

    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-display">Event Registrations</h1>
          <p className="text-muted-foreground mt-2">
            View and manage registrations for each event
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading registrations...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No events found</p>
          </div>
        ) : (
          events.map((event) => {
            const eventRegistrations = registrationsByEvent[event.id] || [];
            return (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle>
                    {event.title} ({eventRegistrations.length} Registrations)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {eventRegistrations.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No registrations yet
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto -mx-6 px-6 scrollbar-thin">
                      <div className="min-w-[800px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="min-w-[150px]">Name</TableHead>
                              <TableHead className="min-w-[200px]">Email</TableHead>
                              <TableHead className="min-w-[120px]">Phone</TableHead>
                              <TableHead className="min-w-[150px]">Organization</TableHead>
                              <TableHead className="min-w-[120px]">Designation</TableHead>
                              <TableHead className="min-w-[100px]">Status</TableHead>
                              <TableHead className="min-w-[150px]">Registered</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {eventRegistrations.map((registration) => (
                              <TableRow key={registration.id}>
                                <TableCell className="font-medium whitespace-nowrap">
                                  {registration.full_name}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">{registration.email}</TableCell>
                                <TableCell className="whitespace-nowrap">{registration.phone || "-"}</TableCell>
                                <TableCell className="whitespace-nowrap">
                                  {registration.organization || "-"}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                  {registration.designation || "-"}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      registration.status === "registered"
                                        ? "default"
                                        : registration.status === "attended"
                                        ? "secondary"
                                        : "outline"
                                    }
                                  >
                                    {registration.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                  {format(
                                    new Date(registration.registered_at),
                                    "PPp"
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </AdminLayout>
  );
};

export default Registrations;
