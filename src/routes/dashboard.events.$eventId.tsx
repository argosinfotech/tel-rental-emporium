import { createFileRoute, Link } from "@tanstack/react-router";
import { EventForm } from "@/components/events/EventForm";
import { BRAND } from "@/lib/brand";
import { getEvent } from "@/lib/mock-events";

export const Route = createFileRoute("/dashboard/events/$eventId")({
  head: ({ params }) => {
    const event = getEvent(params.eventId);
    const title = event
      ? `Edit Event — ${event.eventName} — ${BRAND.name}`
      : `Edit Event — ${BRAND.name}`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: `Edit event details in the ${BRAND.name}.`,
        },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content: `Edit event details in the ${BRAND.name}.`,
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: EditEventPage,
});

function EditEventPage() {
  const { eventId } = Route.useParams();
  const event = getEvent(eventId);

  if (!event) {
    return (
      <div className="p-6">
        <h1 className="mb-4 text-lg font-semibold uppercase tracking-wide text-[#495057]">
          Event Not Found
        </h1>
        <p className="mb-4 text-sm text-muted-foreground">
          This event does not exist or was deleted.
        </p>
        <Link
          to="/dashboard/events"
          className="text-sm font-medium hover:underline"
          style={{ color: BRAND.primary }}
        >
          Back to View Events
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="mb-4 text-lg font-semibold uppercase tracking-wide text-[#495057]">
        Edit Event — {event.eventName}
      </h1>
      <EventForm initial={event} />
    </div>
  );
}
