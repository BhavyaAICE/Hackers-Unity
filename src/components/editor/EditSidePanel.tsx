import { useEditContext } from "@/contexts/EditContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, Link as LinkIcon, Type } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EditSidePanel() {
  const ctx = useEditContext();
  const isVisible = ctx?.isEditMode && ctx.selectedKey;

  return (
    <AnimatePresence>
      {isVisible && ctx && (
        <motion.div
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed right-0 top-14 bottom-0 w-80 bg-card/95 backdrop-blur-xl border-l border-border z-[99] shadow-2xl overflow-y-auto"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                {ctx.selectedType === "link" ? (
                  <LinkIcon className="w-4 h-4 text-primary" />
                ) : (
                  <Type className="w-4 h-4 text-primary" />
                )}
                Edit {ctx.selectedType === "link" ? "Link" : "Text"}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => ctx.selectElement(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mb-4 font-mono bg-muted px-2 py-1 rounded break-all">
              {ctx.selectedKey}
            </p>

            {ctx.selectedType === "link" && (
              <div className="space-y-4">
                <div>
                  <Label className="text-xs">URL / Link</Label>
                  <Input
                    value={ctx.getContent(ctx.selectedKey!, "")}
                    onChange={(e) => ctx.setContent(ctx.selectedKey!, e.target.value)}
                    className="mt-1"
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}

            {ctx.selectedType === "text" && (
              <div className="space-y-4">
                <div>
                  <Label className="text-xs">Text Content</Label>
                  <Textarea
                    value={ctx.getContent(ctx.selectedKey!, "")}
                    onChange={(e) => ctx.setContent(ctx.selectedKey!, e.target.value)}
                    className="mt-1 min-h-[120px]"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
