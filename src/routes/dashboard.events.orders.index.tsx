import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/events/orders/")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/events/orders/$status", params: { status: "new" } });
  },
});
