import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Pencil, X, Plus } from "lucide-react";
import { BRAND } from "@/lib/brand";
import {
  contactPersonName,
  deleteEvent,
  listEvents,
  type InventoryEvent,
} from "@/lib/mock-events";

export const Route = createFileRoute("/dashboard/events/")({
  head: () => ({
    meta: [
      { title: `View Events — ${BRAND.name}` },
      {
        name: "description",
        content: `List of events in the ${BRAND.name}.`,
      },
      { property: "og:title", content: `View Events — ${BRAND.name}` },
      {
        property: "og:description",
        content: `List of events in the ${BRAND.name}.`,
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ViewEvents,
});

type SortKey =
  | "eventName"
  | "eventCode"
  | "contactPerson"
  | "fromDate"
  | "toDate"
  | "status";
type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "eventName", label: "Event Name" },
  { key: "eventCode", label: "Event Code" },
  { key: "contactPerson", label: "Contact Person" },
  { key: "fromDate", label: "From Date" },
  { key: "toDate", label: "To Date" },
  { key: "status", label: "Status" },
];

function formatDisplayDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${m}/${d}/${y}`;
}

function sortValue(event: InventoryEvent, key: SortKey): string {
  if (key === "contactPerson") return contactPersonName(event);
  return event[key];
}

function ViewEvents() {
  const [version, setVersion] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("eventName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const events = useMemo(() => listEvents(), [version]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = q
      ? events.filter((e) => {
          const person = contactPersonName(e).toLowerCase();
          return (
            e.eventName.toLowerCase().includes(q) ||
            e.eventCode.toLowerCase().includes(q) ||
            person.includes(q)
          );
        })
      : events;
    const sorted = [...rows].sort((a, b) =>
      sortValue(a, sortKey).localeCompare(sortValue(b, sortKey)),
    );
    return sortDir === "asc" ? sorted : sorted.reverse();
  }, [events, search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const visible = filtered.slice(startIndex, startIndex + pageSize);
  const showingFrom = filtered.length === 0 ? 0 : startIndex + 1;
  const showingTo = Math.min(startIndex + pageSize, filtered.length);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const onDelete = (event: InventoryEvent) => {
    if (
      !window.confirm(
        `Delete event "${event.eventName}"? This cannot be undone.`,
      )
    ) {
      return;
    }
    deleteEvent(event.id);
    setVersion((v) => v + 1);
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold uppercase tracking-wide text-[#495057]">
          View Events
        </h1>
        <Link
          to="/dashboard/events/new"
          className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: BRAND.primary }}
        >
          <Plus className="h-4 w-4" />
          Add New Event
        </Link>
      </div>

      <div className="rounded-lg border border-border bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-[#495057]">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-md border border-border bg-white px-2 py-1.5 text-sm focus:border-[#0b8a7a] focus:outline-none"
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span>records.</span>
          </div>
          <div className="flex min-w-[280px] flex-1 items-center justify-end gap-2 text-sm text-[#495057] sm:max-w-xl">
            <span className="shrink-0">Search:</span>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by Event Name, Event Code & Contact Person..."
              className="w-full rounded-md border border-border bg-white px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:border-[#0b8a7a] focus:outline-none focus:ring-2 focus:ring-[#0b8a7a]/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-sm">
            <thead>
              <tr
                className="text-left text-white"
                style={{ backgroundColor: BRAND.primary }}
              >
                {COLUMNS.map(({ key, label }) => (
                  <th key={key} className="px-6 py-3 font-semibold">
                    <button
                      type="button"
                      onClick={() => toggleSort(key)}
                      className="inline-flex items-center gap-1.5 text-white"
                    >
                      {label}
                      <span className="inline-flex flex-col leading-none opacity-80">
                        <ArrowUp
                          className={`h-3 w-3 ${
                            sortKey === key && sortDir === "asc"
                              ? "text-white"
                              : "text-white/40"
                          }`}
                        />
                        <ArrowDown
                          className={`-mt-0.5 h-3 w-3 ${
                            sortKey === key && sortDir === "desc"
                              ? "text-white"
                              : "text-white/40"
                          }`}
                        />
                      </span>
                    </button>
                  </th>
                ))}
                <th className="px-6 py-3 font-semibold text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((event) => (
                <tr
                  key={event.id}
                  className="border-t border-border hover:bg-muted/40"
                >
                  <td className="px-6 py-3">
                    <Link
                      to="/dashboard/events/$eventId"
                      params={{ eventId: event.id }}
                      className="hover:underline"
                      style={{ color: BRAND.primary }}
                    >
                      {event.eventName}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-[#495057]">{event.eventCode}</td>
                  <td className="px-6 py-3 text-[#495057]">
                    {contactPersonName(event)}
                  </td>
                  <td className="px-6 py-3 text-[#495057]">
                    {formatDisplayDate(event.fromDate)}
                  </td>
                  <td className="px-6 py-3 text-[#495057]">
                    {formatDisplayDate(event.toDate)}
                  </td>
                  <td className="px-6 py-3 text-[#495057]">{event.status}</td>
                  <td className="px-6 py-3">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <Link
                        to="/dashboard/events/$eventId"
                        params={{ eventId: event.id }}
                        aria-label={`Edit ${event.eventName}`}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        aria-label={`Delete ${event.eventName}`}
                        onClick={() => onDelete(event)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <Link
                        to="/dashboard/events/$eventId/pick-sheet"
                        params={{ eventId: event.id }}
                        className="text-xs font-medium hover:underline"
                        style={{ color: BRAND.primary }}
                      >
                        Pick Sheet
                      </Link>
                      <Link
                        to="/dashboard/events/$eventId/delivery-sheet"
                        params={{ eventId: event.id }}
                        className="text-xs font-medium hover:underline"
                        style={{ color: BRAND.primary }}
                      >
                        Delivery Sheet
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td
                    colSpan={COLUMNS.length + 1}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    No events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-4 text-sm text-[#495057]">
          <p>
            Showing {showingFrom} to {showingTo} of {filtered.length} records.
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-md px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-muted"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(
                Math.max(0, currentPage - 3),
                Math.max(0, currentPage - 3) + 5,
              )
              .map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={`min-w-8 rounded-md px-2.5 py-1.5 text-center ${
                    n === currentPage ? "text-white" : "hover:bg-muted"
                  }`}
                  style={
                    n === currentPage
                      ? { backgroundColor: BRAND.primary }
                      : undefined
                  }
                >
                  {n}
                </button>
              ))}
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-md px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-muted"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
