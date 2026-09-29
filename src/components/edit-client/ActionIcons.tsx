import type { ReactNode } from "react";
import { Eye, FileText, Pencil, Plus, X } from "lucide-react";

type IconBtnProps = {
  label: string;
  onClick?: () => void;
  className?: string;
};

export function EditIconButton({ label, onClick, className }: IconBtnProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={className ?? "text-green-600 hover:text-green-700"}
    >
      <Pencil className="h-4 w-4" />
    </button>
  );
}

export function DeleteIconButton({ label, onClick }: IconBtnProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="text-red-500 hover:text-red-600"
    >
      <X className="h-4 w-4" />
    </button>
  );
}

export function ViewIconButton({ label, onClick }: IconBtnProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="text-[#3b6fe0] hover:text-[#2f5cc4]"
    >
      <Eye className="h-4 w-4" />
    </button>
  );
}

export function PlusIconButton({ label, onClick }: IconBtnProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="text-[#3b6fe0] hover:text-[#2f5cc4]"
    >
      <Plus className="h-4 w-4" />
    </button>
  );
}

export function DocIconButton({ label, onClick }: IconBtnProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="text-[#3b6fe0] hover:text-[#2f5cc4]"
    >
      <FileText className="h-4 w-4" />
    </button>
  );
}

export function ActionIconGroup({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-3">{children}</div>;
}
