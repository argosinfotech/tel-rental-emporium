import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, MapPin } from "lucide-react";
import { RequireStoreEvent, useStoreContext } from "@/components/event-store/StoreShell";
import { BRAND } from "@/lib/brand";
import {
  formatEventAddress,
  formatShortDate,
} from "@/lib/mock-events";

export const Route = createFileRoute("/store/home")({
  head: () => ({
    meta: [{ title: `Home — TEL Events Store` }],
  }),
  component: () => (
    <RequireStoreEvent>
      <StoreHomePage />
    </RequireStoreEvent>
  ),
});

function StoreHomePage() {
  const { event } = useStoreContext();
  const address = formatEventAddress(event);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="overflow-hidden rounded-lg border border-[#e5e5e5] shadow-sm">
        <div className="flex flex-col sm:flex-row">
          <div
            className="flex shrink-0 items-center justify-center px-6 py-8 text-center sm:w-36"
            style={{ backgroundColor: BRAND.primary }}
          >
            <p className="text-sm font-bold leading-tight text-[#0a2540]">
              {formatShortDate(event.fromDate)}
            </p>
          </div>
          <div className="flex flex-1 flex-col gap-3 bg-[#f0f4f8] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-[#0a2540] sm:text-2xl">
                {event.eventName}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-[#555]">
                <Clock className="h-4 w-4" style={{ color: BRAND.primary }} />
                All day
              </p>
              <p className="mt-1 flex items-start gap-2 text-sm text-[#555]">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: BRAND.primary }}
                />
                <span>
                  {address.split(", ").map((part, i, arr) => (
                    <span key={i}>
                      {part === event.stateCode ? (
                        <span className="font-semibold text-red-600">{part}</span>
                      ) : (
                        part
                      )}
                      {i < arr.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </span>
              </p>
            </div>
            <Link
              to="/store/event"
              className="shrink-0 text-sm font-medium underline underline-offset-2"
              style={{ color: BRAND.primary }}
            >
              Find out more
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
