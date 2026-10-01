import type { ReactNode } from "react";
import {
  EDIT_CLIENT_TABS,
  type EditClientTab,
} from "@/components/edit-client/mock-client";
import { BRAND } from "@/lib/brand";

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
      <h1 className="mb-4 text-lg font-semibold uppercase tracking-wide text-[#495057]">
        {title}
      </h1>

      <div className="overflow-hidden rounded-lg border border-border bg-white shadow-sm">
        <div className="overflow-x-auto border-b border-border">
          <nav className="flex min-w-max gap-1 px-4" aria-label="Edit client tabs">
            {EDIT_CLIENT_TABS.map(({ id, label }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onTabChange(id)}
                  className="relative whitespace-nowrap px-3 py-3 text-sm transition-colors"
                  style={{
                    color: BRAND.primary,
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {label}
                  {isActive && (
                    <span
                      className="absolute inset-x-2 bottom-0 h-0.5 rounded-full"
                      style={{ backgroundColor: BRAND.primary }}
                    />
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
