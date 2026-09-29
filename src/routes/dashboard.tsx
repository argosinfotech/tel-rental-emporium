import { createFileRoute, Link } from "@tanstack/react-router";
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

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — TEL Rental Store" },
      {
        name: "description",
        content: "Overview dashboard for TEL Rental Store.",
      },
      { property: "og:title", content: "Dashboard — TEL Rental Store" },
      {
        property: "og:description",
        content: "Overview dashboard for TEL Rental Store.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const NAV_ITEMS = [
  { label: "Dashboard", icon: Gauge, active: true },
  {
    label: "Client Management",
    icon: Users,
    children: [
      "View Active Clients",
      "View Inactive Clients",
      "Inventory Update",
      "Inbound Inventories",
      "View Future Shows",
    ],
  },
  { label: "Order Management", icon: FileText },
  { label: "Settings", icon: Settings },
  { label: "Reports", icon: ExternalLink },
];

const STATS = [
  { title: "New Orders", value: "898" },
  { title: "Processing Orders", value: "95" },
];

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
          {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              type="button"
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors ${
                active
                  ? "bg-[#3b6fe0]/10 font-medium text-[#3b6fe0]"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{label}</span>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            </button>
          ))}
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
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {STATS.map(({ title, value }) => (
              <div
                key={title}
                className="rounded-lg border border-border bg-white shadow-sm"
              >
                <h2 className="border-b border-border px-6 py-4 text-lg font-semibold text-foreground">
                  {title}
                </h2>
                <p className="px-6 py-6 text-4xl font-normal text-foreground">
                  {value}
                </p>
              </div>
            ))}
          </div>
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
