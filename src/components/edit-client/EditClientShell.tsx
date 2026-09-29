import type { ReactNode } from "react";
import {
  EDIT_CLIENT_TABS,
  type EditClientTab,
} from "@/components/edit-client/mock-client";

type EditClientShellProps = {
  title: string;
  activeTab: EditClientTab;
  onTabChange: (tab: EditClientTab) => void;
  children: ReactNode;
};

export function EditClientShell({
  title,
  activeTab,
  onTabChange,
  children,
}: EditClientShellProps) {
  return (
    <div className="p-6">
      <div className="overflow-hidden rounded-lg border border-border bg-white shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <h1 className="text-lg font-semibold uppercase tracking-wide text-foreground">
            {title}
          </h1>
        </div>

        <div className="overflow-x-auto border-b border-border">
          <nav className="flex min-w-max gap-1 px-4" aria-label="Edit client tabs">
            {EDIT_CLIENT_TABS.map(({ id, label }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onTabChange(id)}
                  className={`relative whitespace-nowrap px-3 py-3 text-sm transition-colors ${
                    isActive
                      ? "font-medium text-[#3b6fe0]"
                      : "text-[#3b6fe0]/80 hover:text-[#3b6fe0]"
                  }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#3b6fe0]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="min-h-[320px]">{children}</div>
      </div>
    </div>
  );
}
