import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { EditProvider } from "@/contexts/EditContext";
import EditToolbar from "@/components/editor/EditToolbar";
import EditSidePanel from "@/components/editor/EditSidePanel";
import Index from "@/pages/Index";
import AboutUs from "@/pages/AboutUs";
import FAQs from "@/pages/FAQs";

const pageMap: Record<string, { component: React.ComponentType; key: string }> = {
  "/edit": { component: Index, key: "home" },
  "/edit/about-us": { component: AboutUs, key: "about" },
  "/edit/faqs": { component: FAQs, key: "faqs" },
};

export default function EditPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!authLoading && !adminLoading && (!user || !isAdmin)) {
      navigate("/login");
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  const page = pageMap[location.pathname] || pageMap["/edit"];
  const PageComponent = page.component;

  return (
    <EditProvider pageKey={page.key} editMode={true}>
      <EditToolbar />
      <div className="pt-14">
        <PageComponent />
      </div>
      <EditSidePanel />
    </EditProvider>
  );
}
