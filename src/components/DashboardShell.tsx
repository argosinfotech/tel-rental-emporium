import { Outlet, Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  Gauge,
  Users,
  CalendarDays,
  FileText,
  Settings,
  ExternalLink,
  AlignLeft,
  ChevronRight,
  UserRoundPlus,
} from "lucide-react";
import { BRAND } from "@/lib/brand";

type NavChild = { label: string; to?: string };

const NAV_ITEMS: {
  label: string;
  icon: typeof Gauge;
  to?: string;
  children?: NavChild[];
}[] = [
  { label: "Dashboard", icon: Gauge, to: "/dashboard" },
  {
    label: "Client Management",
    icon: Users,
    children: [
      { label: "View Clients", to: "/dashboard/clients/active" },
      { label: "Inventory Update" },
      { label: "Inbound Inventories" },
      { label: "View Future Shows" },
    ],
  },
  {
    label: "Event Management",
    icon: CalendarDays,
    children: [
      { label: "View Events", to: "/dashboard/events" },
      { label: "View New Orders", to: "/dashboard/events/orders/new" },
      {
        label: "View Processing Orders",
        to: "/dashboard/events/orders/processing",
      },
      { label: "View Shipped Orders", to: "/dashboard/events/orders/shipped" },
      {
        label: "View Delivered Orders",
        to: "/dashboard/events/orders/delivered",
      },
      {
        label: "View Completed Orders",
        to: "/dashboard/events/orders/completed",
      },
      {
        label: "View Cancelled Orders",
        to: "/dashboard/events/orders/cancelled",
      },
      {
        label: "Update Return Items",
        to: "/dashboard/events/orders/returns",
      },
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

  const isDashboardActive =
    pathname === "/dashboard" || pathname === "/dashboard/";
  const isClientManagementActive = pathname.startsWith("/dashboard/clients");
  const isEventManagementActive = pathname.startsWith("/dashboard/events");

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: BRAND.pageBg }}>
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } shrink-0 overflow-hidden border-r border-border bg-white transition-all duration-200`}
      >
        <div className="flex h-16 items-center px-5">
          <span
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: BRAND.primary }}
          >
            {BRAND.nameUpper}
          </span>
        </div>
        <nav className="mt-2 space-y-1 px-3">
          {NAV_ITEMS.map(({ label, icon: Icon, to, children }) => {
            const isOpen = expanded === label;
            const parentActive =
              label === "Dashboard"
                ? isDashboardActive
                : label === "Client Management"
                  ? isClientManagementActive
                  : label === "Event Management"
                    ? isEventManagementActive
                    : false;

            const parentClass = `flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors ${
              parentActive
                ? "font-medium"
                : "hover:bg-muted"
            }`;
            const parentStyle = parentActive
              ? { backgroundColor: BRAND.primaryMuted, color: BRAND.primary }
              : { color: BRAND.primary };

            const parentInner = (
              <>
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{label}</span>
                {children && (
                  <ChevronRight
                    className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                      isOpen ? "rotate-90" : ""
                    }`}
                    style={{ color: BRAND.primary }}
                  />
                )}
              </>
            );

            return (
              <div key={label}>
                {to && !children ? (
                  <Link to={to} className={parentClass} style={parentStyle}>
                    {parentInner}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      children &&
                      setExpanded((prev) => (prev === label ? null : label))
                    }
                    className={parentClass}
                    style={parentStyle}
                  >
                    {parentInner}
                  </button>
                )}
                {children && isOpen && (
                  <div className="mb-1 mt-1 space-y-0.5 pl-8">
                    {children.map((child) => {
                      const childActive =
                        child.to !== undefined &&
                        (child.to === "/dashboard/events/orders/returns"
                          ? pathname === child.to ||
                            pathname.startsWith(`${child.to}/`) ||
                            pathname.startsWith(
                              "/dashboard/events/order-return",
                            )
                          : child.to.startsWith("/dashboard/events/orders/")
                            ? pathname === child.to ||
                              pathname.startsWith(`${child.to}/`)
                            : child.to === "/dashboard/events"
                              ? pathname.startsWith("/dashboard/events") &&
                                !pathname.startsWith(
                                  "/dashboard/events/orders",
                                ) &&
                                !pathname.startsWith("/dashboard/events/order")
                              : pathname === child.to);
                      const className = `block w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                        childActive
                          ? "font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`;
                      const style = childActive
                        ? {
                            backgroundColor: BRAND.primaryMuted,
                            color: BRAND.primary,
                          }
                        : undefined;
                      return child.to ? (
                        <Link
                          key={child.label}
                          to={child.to}
                          className={className}
                          style={style}
                        >
                          {child.label}
                        </Link>
                      ) : (
                        <button
                          key={child.label}
                          type="button"
                          className={className}
                          style={style}
                        >
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

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-white px-4">
          <button
            type="button"
            aria-label="Toggle sidebar"
            onClick={() => setSidebarOpen((v) => !v)}
            className="rounded-md p-2 hover:bg-muted"
            style={{ color: BRAND.primary }}
          >
            <AlignLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Account"
            className="rounded-md p-2 hover:bg-muted"
            style={{ color: BRAND.primary }}
          >
            <UserRoundPlus className="h-5 w-5" />
          </button>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>

        <footer className="bg-white py-6 text-center text-xs text-[#94a3b8]">
          2026 © {BRAND.nameUpper}.
        </footer>
      </div>
    </div>
  );
}
