import { Outlet, Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  Gauge,
  Users,
  FileText,
  Settings,
  ExternalLink,
  AlignLeft,
  ChevronRight,
  UserRoundPlus,
} from "lucide-react";

type NavChild = { label: string; to?: string };

const NAV_ITEMS: {
  label: string;
  icon: typeof Gauge;
  active?: boolean;
  children?: NavChild[];
}[] = [
  { label: "Dashboard", icon: Gauge, active: true },
  {
    label: "Client Management",
    icon: Users,
    children: [
      { label: "View Active Clients", to: "/dashboard/clients/active" },
      { label: "View Inactive Clients" },
      { label: "Inventory Update" },
      { label: "Inbound Inventories" },
      { label: "View Future Shows" },
    ],
  },
  { label: "Order Management", icon: FileText },
  { label: "Settings", icon: Settings },
  { label: "Reports", icon: ExternalLink },
];

export function DashboardShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expanded, setExpanded] = useState<string | null>("Client Management");
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isDashboardActive = pathname === "/dashboard";
  const isClientManagementActive = pathname.startsWith("/dashboard/clients");

  return (
    <div className="flex min-h-screen bg-[#f4f5fa]">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } shrink-0 overflow-hidden border-r border-border bg-white transition-all duration-200`}
      >
        <div className="flex h-16 items-center px-6">
          <span className="text-sm font-semibold uppercase tracking-wide text-[#3b6fe0]">
            Tel Fulfillment Portal
          </span>
        </div>
        <nav className="mt-2 space-y-1 px-3">
          {NAV_ITEMS.map(({ label, icon: Icon, children }) => {
            const isOpen = expanded === label;
            const parentActive =
              label === "Dashboard" ? isDashboardActive : label === "Client Management" ? isClientManagementActive : false;
            return (
              <div key={label}>
                <button
                  type="button"
                  onClick={() =>
                    children &&
                    setExpanded((prev) => (prev === label ? null : label))
                  }
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors ${
                    parentActive
                      ? "bg-[#3b6fe0]/10 font-medium text-[#3b6fe0]"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{label}</span>
                  {children && (
                    <ChevronRight
                      className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${
                        isOpen ? "rotate-90" : ""
                      }`}
                    />
                  )}
                </button>
                {children && isOpen && (
                  <div className="mb-1 mt-1 space-y-0.5 pl-8">
                    {children.map((child) => {
                      const childActive =
                        child.to !== undefined && pathname === child.to;
                      const className = `block w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                        childActive
                          ? "bg-[#3b6fe0]/10 font-medium text-[#3b6fe0]"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`;
                      return child.to ? (
                        <Link key={child.label} to={child.to} className={className}>
                          {child.label}
                        </Link>
                      ) : (
                        <button key={child.label} type="button" className={className}>
                          {child.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-white px-4">
          <button
            type="button"
            aria-label="Toggle sidebar"
            onClick={() => setSidebarOpen((v) => !v)}
            className="rounded-md p-2 text-foreground hover:bg-muted"
          >
            <AlignLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Account"
            className="rounded-md p-2 text-foreground hover:bg-muted"
          >
            <UserRoundPlus className="h-5 w-5" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="py-6 text-center text-xs text-muted-foreground">
          2026 © Tel Fulfillment Portal.{" "}
          <Link to="/" className="hover:text-[#3b6fe0]">
            Back to home
          </Link>
        </footer>
      </div>
    </div>
  );
}
