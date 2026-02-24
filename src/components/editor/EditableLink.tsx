import { ReactNode, CSSProperties } from "react";
import { useEditContext } from "@/contexts/EditContext";

interface EditableLinkProps {
  contentKey: string;
  defaultHref: string;
  children: (href: string, editProps: Record<string, any>) => ReactNode;
}

export default function EditableLink({ contentKey, defaultHref, children }: EditableLinkProps) {
  const ctx = useEditContext();
  const href = ctx?.getContent(contentKey, defaultHref) ?? defaultHref;
  const isEditMode = ctx?.isEditMode ?? false;
  const isSelected = ctx?.selectedKey === contentKey;

  if (!isEditMode) {
    return <>{children(href, {})}</>;
  }

  const editProps = {
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      ctx?.selectElement(contentKey, "link");
    },
    style: { cursor: "pointer", display: "inline-block" } as CSSProperties,
    className: isSelected
      ? "outline outline-2 outline-primary outline-offset-4 rounded-sm"
      : "hover:outline hover:outline-2 hover:outline-dashed hover:outline-primary/40 hover:outline-offset-4 rounded-sm",
  };

  return <>{children("#", editProps)}</>;
}
