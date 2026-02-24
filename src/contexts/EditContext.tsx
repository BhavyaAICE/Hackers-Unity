import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { api } from "@/lib/apiClient";
import { useToast } from "@/hooks/use-toast";

interface EditContextValue {
  isEditMode: boolean;
  pageKey: string;
  content: Record<string, string>;
  changes: Record<string, string>;
  getContent: (key: string, defaultValue: string) => string;
  setContent: (key: string, value: string) => void;
  selectedKey: string | null;
  selectedType: string | null;
  selectElement: (key: string | null, type?: string) => void;
  saveChanges: () => Promise<void>;
  discardChanges: () => void;
  hasChanges: boolean;
  saving: boolean;
}

const EditContext = createContext<EditContextValue | null>(null);

export function useEditContext() {
  return useContext(EditContext);
}

interface EditProviderProps {
  pageKey: string;
  editMode?: boolean;
  children: ReactNode;
}

export function EditProvider({ pageKey, editMode = false, children }: EditProviderProps) {
  const { toast } = useToast();
  const [content, setContentState] = useState<Record<string, string>>({});
  const [changes, setChanges] = useState<Record<string, string>>({});
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get<{ content: Record<string, string> }>(`/api/content/pages/${pageKey}`);
        setContentState(data.content || {});
      } catch {
        // no saved content yet, use defaults
      }
    };
    load();
  }, [pageKey]);

  const getContent = useCallback(
    (key: string, defaultValue: string) => changes[key] ?? content[key] ?? defaultValue,
    [changes, content]
  );

  const setContent = useCallback((key: string, value: string) => {
    setChanges((prev) => ({ ...prev, [key]: value }));
  }, []);

  const selectElement = useCallback((key: string | null, type?: string) => {
    setSelectedKey(key);
    setSelectedType(type || null);
  }, []);

  const saveChanges = useCallback(async () => {
    setSaving(true);
    try {
      const merged = { ...content, ...changes };
      const data = await api.put<{ content: Record<string, string> }>(`/api/content/pages/${pageKey}`, { content: merged });
      setContentState(data.content || merged);
      setChanges({});
      toast({ title: "Changes saved!" });
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }, [content, changes, pageKey, toast]);

  const discardChanges = useCallback(() => {
    setChanges({});
    setSelectedKey(null);
    toast({ title: "Changes discarded" });
  }, [toast]);

  const value: EditContextValue = {
    isEditMode: editMode,
    pageKey,
    content,
    changes,
    getContent,
    setContent,
    selectedKey,
    selectedType,
    selectElement,
    saveChanges,
    discardChanges,
    hasChanges: Object.keys(changes).length > 0,
    saving,
  };

  return <EditContext.Provider value={value}>{children}</EditContext.Provider>;
}
