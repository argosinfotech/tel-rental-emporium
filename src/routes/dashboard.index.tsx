import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

const STATS = [
  { title: "New Orders", value: "898" },
  { title: "Processing Orders", value: "95" },
];

function DashboardHome() {
  return (
    <div className="p-6">
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
    </div>
  );
}
