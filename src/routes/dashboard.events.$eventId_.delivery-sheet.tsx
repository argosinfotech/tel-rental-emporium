import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { BRAND } from "@/lib/brand";
import { getEvent } from "@/lib/mock-events";
import { getDeliverySheetGroups } from "@/lib/mock-event-sheets";

export const Route = createFileRoute(
  "/dashboard/events/$eventId_/delivery-sheet",
)({
  head: ({ params }) => {
    const event = getEvent(params.eventId);
    const title = event
      ? `Delivery Sheet — ${event.eventName} — ${BRAND.name}`
      : `Delivery Sheet — ${BRAND.name}`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: `Generate booth delivery sheets for an event in the ${BRAND.name}.`,
        },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content: `Generate booth delivery sheets for an event in the ${BRAND.name}.`,
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: DeliverySheetPage,
});

function DeliverySheetPage() {
  const { eventId } = Route.useParams();
  const event = getEvent(eventId);
  const groups = useMemo(() => getDeliverySheetGroups(eventId), [eventId]);

  if (!event) {
    return (
      <div className="p-6">
        <h1 className="mb-4 text-lg font-semibold uppercase tracking-wide text-[#495057]">
          Event Not Found
        </h1>
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
      <div className="sheet-no-print mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            to="/dashboard/events"
            className="mb-2 inline-block text-sm font-medium hover:underline"
            style={{ color: BRAND.primary }}
          >
            ← Back to View Events
          </Link>
          <h1 className="text-lg font-semibold uppercase tracking-wide text-[#495057]">
            Delivery Sheet
          </h1>
          <p className="mt-1 text-sm text-[#495057]">
            {event.eventName}{" "}
            <span className="text-muted-foreground">({event.eventCode})</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          disabled={groups.length === 0}
          className="rounded-md px-4 py-1.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          style={{ backgroundColor: BRAND.primary }}
        >
          Generate PDF
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="sheet-no-print rounded-lg border border-border bg-white px-6 py-8 text-center text-sm text-muted-foreground shadow-sm">
          No booth deliveries for this event.
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <section
              key={group.booth}
              className="delivery-booth-sheet rounded-lg border border-border bg-white p-5 shadow-sm"
            >
              <div className="mb-4 border-b border-border pb-3">
                <h2 className="text-base font-semibold text-[#495057]">
                  {group.booth}
                </h2>
                <p className="mt-1 text-sm text-[#495057]">
                  Contact: {group.contactName}
                  {group.contactEmail ? ` · ${group.contactEmail}` : ""}
                </p>
                {group.orderNos.length > 0 && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Order(s): {group.orderNos.join(", ")}
                  </p>
                )}
                <p className="sheet-print-only mt-1 hidden text-sm">
                  {event.eventName} ({event.eventCode})
                </p>
              </div>

              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr
                    className="text-left text-white sheet-no-print"
                    style={{ backgroundColor: BRAND.primary }}
                  >
                    <th className="w-20 px-3 py-2 font-semibold">Image</th>
                    <th className="px-3 py-2 font-semibold">Item Name</th>
                    <th className="w-24 px-3 py-2 font-semibold">Quantity</th>
                  </tr>
                  <tr className="sheet-print-only hidden text-left">
                    <th className="border border-gray-300 px-3 py-2">Image</th>
                    <th className="border border-gray-300 px-3 py-2">
                      Item Name
                    </th>
                    <th className="border border-gray-300 px-3 py-2">
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {group.lines.map((line) => (
                    <tr key={line.id} className="border-t border-border">
                      <td className="border-gray-300 px-3 py-2 print:border">
                        <img
                          src={line.imageSrc}
                          alt=""
                          className="h-12 w-12 rounded object-cover"
                        />
                      </td>
                      <td className="border-gray-300 px-3 py-2 text-[#495057] print:border">
                        {line.name}
                      </td>
                      <td className="border-gray-300 px-3 py-2 text-[#495057] print:border">
                        {line.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                <div>
                  <p className="mb-8 text-xs font-medium uppercase tracking-wide text-[#495057]">
                    Received by
                  </p>
                  <div className="border-b border-[#495057]" />
                </div>
                <div>
                  <p className="mb-8 text-xs font-medium uppercase tracking-wide text-[#495057]">
                    Signature
                  </p>
                  <div className="border-b border-[#495057]" />
                </div>
                <div>
                  <p className="mb-8 text-xs font-medium uppercase tracking-wide text-[#495057]">
                    Date
                  </p>
                  <div className="border-b border-[#495057]" />
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
