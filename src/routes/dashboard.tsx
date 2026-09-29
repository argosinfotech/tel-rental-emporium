import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/DashboardShell";

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
  component: DashboardLayout,
});

function DashboardLayout() {
  return <DashboardShell />;
}
