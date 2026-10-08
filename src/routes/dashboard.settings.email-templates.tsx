import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/settings/email-templates")({
  component: () => <Outlet />,
});
