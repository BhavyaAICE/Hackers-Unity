import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import AdminLayout from "@/components/admin/AdminLayout";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Event {
  id: string;
  title: string;
  event_type: string;
}

interface Registration {
  id: string;
  full_name: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  organization: string | null;
  designation: string | null;
  city: string | null;
  gender: string | null;
  date_of_birth: string | null;
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
      .select("id, title, event_type")
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

  const exportToExcel = async (event: Event, registrations: Registration[]) => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Hacker's Unity";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Registrations");

    // Define columns with proper widths
    worksheet.columns = [
      { header: "S.No", key: "sno", width: 8 },
      { header: "Full Name", key: "fullName", width: 25 },
      { header: "Email", key: "email", width: 35 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Organization", key: "organization", width: 25 },
      { header: "Designation", key: "designation", width: 20 },
      { header: "City", key: "city", width: 15 },
      { header: "Gender", key: "gender", width: 10 },
      { header: "Date of Birth", key: "dob", width: 15 },
      { header: "Status", key: "status", width: 12 },
      { header: "Registered On", key: "registeredOn", width: 22 },
    ];

    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4F46E5" },
    };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.height = 24;

    // Add border to header
    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      };
    });

    // Add data rows
    registrations.forEach((reg, index) => {
      const row = worksheet.addRow({
        sno: index + 1,
        fullName: reg.full_name || `${reg.first_name || ""} ${reg.last_name || ""}`.trim(),
        email: reg.email,
        phone: reg.phone || "-",
        organization: reg.organization || "-",
        designation: reg.designation || "-",
        city: reg.city || "-",
        gender: reg.gender || "-",
        dob: reg.date_of_birth ? format(new Date(reg.date_of_birth), "dd MMM yyyy") : "-",
        status: reg.status?.charAt(0).toUpperCase() + reg.status?.slice(1) || "-",
        registeredOn: format(new Date(reg.registered_at), "dd MMM yyyy, hh:mm a"),
      });

      // Alternating row colors
      if (index % 2 === 0) {
        row.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF3F4F6" },
        };
      }

      // Add borders to data cells
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin", color: { argb: "FFE5E7EB" } },
          bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
          left: { style: "thin", color: { argb: "FFE5E7EB" } },
          right: { style: "thin", color: { argb: "FFE5E7EB" } },
        };
        cell.alignment = { vertical: "middle" };
      });
    });

    // Freeze the header row
    worksheet.views = [{ state: "frozen", ySplit: 1 }];

    // Generate and download file
    const eventType = event.event_type === "hackathon" ? "Hackathon" : "Event";
    const fileName = `${event.title.replace(/[^a-zA-Z0-9]/g, "_")}_${eventType}_Registrations_${format(new Date(), "yyyy-MM-dd")}.xlsx`;

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = (event: Event, registrations: Registration[]) => {
    const doc = new jsPDF({ orientation: "landscape" });

    // Add title
    const eventType = event.event_type === "hackathon" ? "Hackathon" : "Event";
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(`${event.title} - Registration List`, 14, 20);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`${eventType} | Total Registrations: ${registrations.length} | Generated: ${format(new Date(), "dd MMM yyyy, hh:mm a")}`, 14, 28);

    // Prepare table data
    const tableData = registrations.map((reg, index) => [
      index + 1,
      reg.full_name || `${reg.first_name || ""} ${reg.last_name || ""}`.trim(),
      reg.email,
      reg.phone || "-",
      reg.organization || "-",
      reg.designation || "-",
      reg.city || "-",
      reg.status?.charAt(0).toUpperCase() + reg.status?.slice(1) || "-",
      format(new Date(reg.registered_at), "dd MMM yyyy"),
    ]);

    autoTable(doc, {
      head: [["#", "Name", "Email", "Phone", "Organization", "Designation", "City", "Status", "Registered"]],
      body: tableData,
      startY: 35,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [243, 244, 246],
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 10 },
        1: { cellWidth: 35 },
        2: { cellWidth: 45 },
        3: { cellWidth: 25 },
        4: { cellWidth: 35 },
        5: { cellWidth: 30 },
        6: { cellWidth: 25 },
        7: { halign: "center", cellWidth: 20 },
        8: { halign: "center", cellWidth: 25 },
      },
    });

    // Add footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text(
        `Page ${i} of ${pageCount} | Hacker's Unity`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }

    const fileName = `${event.title.replace(/[^a-zA-Z0-9]/g, "_")}_${eventType}_Registrations_${format(new Date(), "yyyy-MM-dd")}.pdf`;
    doc.save(fileName);
  };

  return (
    <AdminLayout requiredPermission="can_view_registrations">
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
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <span>{event.title}</span>
                    <Badge variant="outline" className="capitalize">
                      {event.event_type}
                    </Badge>
                    <Badge variant="secondary">
                      {eventRegistrations.length} Registrations
                    </Badge>
                  </CardTitle>
                  {eventRegistrations.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => exportToExcel(event, eventRegistrations)}>
                          <FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" />
                          Download Excel
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => exportToPDF(event, eventRegistrations)}>
                          <FileText className="w-4 h-4 mr-2 text-red-600" />
                          Download PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
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
