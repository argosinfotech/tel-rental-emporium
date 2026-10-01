import { createFileRoute } from "@tanstack/react-router";
import { EventForm } from "@/components/events/EventForm";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/dashboard/events/new")({
  head: () => ({
    meta: [
      { title: `Add New Event — ${BRAND.name}` },
      {
        name: "description",
        content: `Create a new event in the ${BRAND.name}.`,
      },
      { property: "og:title", content: `Add New Event — ${BRAND.name}` },
      {
        property: "og:description",
        content: `Create a new event in the ${BRAND.name}.`,
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AddEventPage,
});

function AddEventPage() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-lg font-semibold uppercase tracking-wide text-[#495057]">
        Add New Event
      </h1>
      <EventForm />
    </div>
  );
}
