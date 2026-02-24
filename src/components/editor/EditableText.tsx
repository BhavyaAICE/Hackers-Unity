import { useRef, useState, createElement } from "react";
import { useEditContext } from "@/contexts/EditContext";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  contentKey: string;
  defaultValue: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export default function EditableText({
  contentKey,
  defaultValue,
  as: Tag = "span",
  className,
}: EditableTextProps) {
  const ctx = useEditContext();
  const ref = useRef<HTMLElement>(null);
  const [editing, setEditing] = useState(false);

  const value = ctx?.getContent(contentKey, defaultValue) ?? defaultValue;
  const isEditMode = ctx?.isEditMode ?? false;

  if (!isEditMode) {
    return createElement(Tag, { className }, value);
  }

  const handleBlur = () => {
    setEditing(false);
    if (ref.current && ctx) {
      const newValue = ref.current.innerText || "";
      if (newValue.trim() !== value) {
        ctx.setContent(contentKey, newValue.trim());
      }
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editing) {
      setEditing(true);
      ctx.selectElement(contentKey, "text");
      setTimeout(() => ref.current?.focus(), 0);
    }
  };

  return createElement(
    Tag,
    {
      ref,
      className: cn(
        className,
        "transition-all duration-150 rounded-sm",
        editing
          ? "outline outline-2 outline-primary bg-primary/5 outline-offset-4"
          : "hover:outline hover:outline-2 hover:outline-dashed hover:outline-primary/40 hover:outline-offset-4 cursor-pointer"
      ),
      contentEditable: editing,
      suppressContentEditableWarning: true,
      onClick: handleClick,
      onBlur: handleBlur,
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
          setEditing(false);
          ref.current?.blur();
        }
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          ref.current?.blur();
        }
      },
    },
    value
  );
}
