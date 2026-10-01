import { createFileRoute } from "@tanstack/react-router";
import {
  RequireStoreEvent,
  useStoreContext,
} from "@/components/event-store/StoreShell";
import { BRAND } from "@/lib/brand";
import {
  formatEventAddress,
  formatLongDate,
} from "@/lib/mock-events";

export const Route = createFileRoute("/store/event")({
  head: () => ({
    meta: [{ title: `Event Details — TEL Events Store` }],
  }),
  component: () => (
    <RequireStoreEvent>
      <StoreEventDetailPage />
    </RequireStoreEvent>
  ),
});

function StoreEventDetailPage() {
  const { event } = useStoreContext();
  const dateLabel =
    event.fromDate === event.toDate
      ? formatLongDate(event.fromDate)
      : `${formatLongDate(event.fromDate).replace(/,?\s*\d{4}$/, "")} - ${formatLongDate(event.toDate).replace(/,?\s*\d{4}$/, "")}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 text-center sm:px-6">
      <h1 className="text-3xl font-bold text-[#0a2540] sm:text-4xl">
        {event.eventName}
      </h1>
      <p className="mt-3 text-base text-[#666]">{dateLabel}</p>

      <div
        className="mx-auto mt-10 flex h-56 max-w-xl items-center justify-center rounded-lg border border-[#eee] sm:h-72"
        style={{ backgroundColor: "#fafafa" }}
      >
        <div className="px-6 text-center">
          <div
            className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white"
            style={{ backgroundColor: "#c41e3a" }}
          >
            ♥
          </div>
          <p className="text-lg font-semibold text-[#0a2540]">
            {event.eventName}
          </p>
          <p className="mt-1 text-sm text-[#888]">{event.shortDescription}</p>
        </div>
      </div>

      <div className="mt-12">
        <h2
          className="text-sm font-semibold uppercase tracking-[0.2em]"
          style={{ color: BRAND.primary }}
        >
          Event &amp; Venue
        </h2>
        <p className="mt-4 text-base font-medium text-[#1a1a1a]">
          {event.eventName.replace(/2026$/, "").trim() || event.eventName}
        </p>
        <p className="mt-2 text-sm text-[#555]">
          {event.address1}
          {event.address2 ? `, ${event.address2}` : ""}
        </p>
        <p className="mt-1 text-xs text-[#888]">{formatEventAddress(event)}</p>
      </div>
    </div>
  );
}
