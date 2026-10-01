import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/DashboardShell";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — TEL Inventory Portal" },
      {
        name: "description",
        content: "Overview dashboard for TEL Inventory Portal.",
      },
      { property: "og:title", content: "Dashboard — TEL Inventory Portal" },
      {
        property: "og:description",
        content: "Overview dashboard for TEL Inventory Portal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardLayout,
});

function DashboardLayout() {
  return <DashboardShell />;
}
