import { useEditContext } from "@/contexts/EditContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Save, X, Undo2, Loader2, FileEdit, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const pages = [
  { key: "home", label: "Homepage", path: "/edit" },
  { key: "about", label: "About Us", path: "/edit/about-us" },
  { key: "faqs", label: "FAQs", path: "/edit/faqs" },
];

export default function EditToolbar() {
  const ctx = useEditContext();
  const navigate = useNavigate();
  const location = useLocation();

  if (!ctx) return null;

  const currentPage = pages.find((p) => p.path === location.pathname) || pages[0];

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-card/95 backdrop-blur-xl border-b-2 border-primary/40 shadow-lg shadow-primary/10">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          <FileEdit className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold text-primary hidden sm:inline">Visual Editor</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                {currentPage.label}
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {pages.map((page) => (
                <DropdownMenuItem key={page.key} onClick={() => navigate(page.path)}>
                  {page.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="text-sm text-muted-foreground hidden md:block">
          {ctx.hasChanges ? (
            <span className="text-primary font-medium">
              {Object.keys(ctx.changes).length} unsaved change
              {Object.keys(ctx.changes).length !== 1 ? "s" : ""}
            </span>
          ) : (
            "Click any highlighted text or link to edit"
          )}
        </div>

        <div className="flex items-center gap-2">
          {ctx.hasChanges && (
            <Button variant="ghost" size="sm" onClick={ctx.discardChanges}>
              <Undo2 className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Discard</span>
            </Button>
          )}
          <Button
            variant="default"
            size="sm"
            onClick={ctx.saveChanges}
            disabled={!ctx.hasChanges || ctx.saving}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {ctx.saving ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-1" />
            )}
            Save
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
