import { Search } from "lucide-react";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { BRAND } from "@/lib/brand";

type SearchToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  actions?: ReactNode;
};

export function SearchToolbar({
  search,
  onSearchChange,
  placeholder = "Search...",
  actions,
}: SearchToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
      <div className="relative min-w-[220px] max-w-md flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border border-border bg-white py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-[#0b8a7a] focus:ring-2 focus:ring-[#0b8a7a]/20"
        />
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-md bg-[#0b8a7a] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#09786b] ${className}`}
    >
      {children}
    </button>
  );
}

export function FieldLabel({
  children,
  required,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-foreground">
      {children}
      {required && <span className="text-destructive"> *</span>}
    </label>
  );
}

export function FormInput({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-md border border-input bg-white px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-[#0b8a7a] focus:ring-2 focus:ring-[#0b8a7a]/20 disabled:bg-muted ${className}`}
    />
  );
}

export function FormSelect({
  className = "",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-md border border-input bg-white px-3 py-2 text-sm outline-none focus:border-[#0b8a7a] focus:ring-2 focus:ring-[#0b8a7a]/20 ${className}`}
    >
      {children}
    </select>
  );
}

export function FormTextarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-md border border-input bg-white px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-[#0b8a7a] focus:ring-2 focus:ring-[#0b8a7a]/20 ${className}`}
    />
  );
}

export function TableHeaderCell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th className={`px-4 py-3 font-semibold text-white ${className}`}>
      {children}
    </th>
  );
}

export function TealTableHead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr style={{ backgroundColor: BRAND.primary }}>{children}</tr>
    </thead>
  );
}
