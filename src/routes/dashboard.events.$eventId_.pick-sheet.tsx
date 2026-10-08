import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BRAND } from "@/lib/brand";
import { getEvent } from "@/lib/mock-events";
import { getPickSheetLines } from "@/lib/mock-event-sheets";

export const Route = createFileRoute("/dashboard/events/$eventId_/pick-sheet")({
  head: ({ params }) => {
    const event = getEvent(params.eventId);
    const title = event
      ? `Pick Sheet — ${event.eventName} — ${BRAND.name}`
      : `Pick Sheet — ${BRAND.name}`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: `Generate a pick sheet PDF for an event in the ${BRAND.name}.`,
        },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content: `Generate a pick sheet PDF for an event in the ${BRAND.name}.`,
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: PickSheetPage,
});

function PickSheetPage() {
  const { eventId } = Route.useParams();
  const event = getEvent(eventId);
  const lines = useMemo(() => getPickSheetLines(eventId), [eventId]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [generating, setGenerating] = useState(false);

  const checkedCount = lines.filter((l) => checked[l.id]).length;
  const allChecked = lines.length > 0 && checkedCount === lines.length;

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectAll = () => {
    const next: Record<string, boolean> = {};
    for (const line of lines) next[line.id] = true;
    setChecked(next);
  };

  const clearAll = () => setChecked({});

  const generatePdf = async () => {
    if (!event || checkedCount === 0 || generating) return;
    const selected = lines.filter((l) => checked[l.id]);
    setGenerating(true);
    try {
      const { downloadPickSheetPdf } = await import("@/lib/event-sheet-pdf");
      await downloadPickSheetPdf({
        eventName: event.eventName,
        eventCode: event.eventCode,
        lines: selected,
      });
    } finally {
      setGenerating(false);
    }
  };

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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            to="/dashboard/events"
            className="mb-2 inline-block text-sm font-medium hover:underline"
            style={{ color: BRAND.primary }}
          >
            ← Back to View Events
          </Link>
          <h1 className="text-lg font-semibold uppercase tracking-wide text-[#495057]">
            Pick Sheet
          </h1>
          <p className="mt-1 text-sm text-[#495057]">
            {event.eventName}{" "}
            <span className="text-muted-foreground">({event.eventCode})</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={selectAll}
            disabled={lines.length === 0 || allChecked}
            className="rounded-md border border-border bg-white px-3 py-1.5 text-sm text-[#495057] hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            Select all
          </button>
          <button
            type="button"
            onClick={clearAll}
            disabled={checkedCount === 0}
            className="rounded-md border border-border bg-white px-3 py-1.5 text-sm text-[#495057] hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => void generatePdf()}
            disabled={checkedCount === 0 || generating}
            className="rounded-md px-4 py-1.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ backgroundColor: BRAND.primary }}
          >
            {generating ? "Generating…" : "Generate PDF"}
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-white shadow-sm">
        {lines.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-muted-foreground">
            No order items for this event.
          </p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr
                className="text-left text-white"
                style={{ backgroundColor: BRAND.primary }}
              >
                <th className="w-20 px-4 py-3 font-semibold">Image</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="w-24 px-4 py-3 font-semibold">Qty</th>
                <th className="w-20 px-4 py-3 text-center font-semibold">
                  Check
                </th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <tr
                  key={line.id}
                  className="border-t border-border hover:bg-muted/40"
                >
                  <td className="px-4 py-3">
                    <img
                      src={line.imageSrc}
                      alt=""
                      className="h-12 w-12 rounded object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 text-[#495057]">{line.name}</td>
                  <td className="px-4 py-3 text-[#495057]">{line.quantity}</td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={!!checked[line.id]}
                      onChange={() => toggle(line.id)}
                      aria-label={`Select ${line.name}`}
                      className="h-4 w-4 accent-[#0b8a7a]"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
