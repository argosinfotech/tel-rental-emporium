import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Eye } from "lucide-react";
import { BRAND } from "@/lib/brand";
import {
  formatOrderDateTime,
  formatOrderMoney,
  listOrdersForReturn,
  type EventOrder,
} from "@/lib/mock-event-orders";

export const Route = createFileRoute("/dashboard/events/orders/returns")({
  head: () => ({
    meta: [
      {
        title: `Update Return Items — ${BRAND.name}`,
      },
      {
        name: "description",
        content: `Update return items for event orders in the ${BRAND.name}.`,
      },
    ],
  }),
  component: UpdateReturnItemsPage,
});

type SortKey =
  | "orderNo"
  | "orderDate"
  | "eventName"
  | "contactName"
  | "booth"
  | "orderPlacedBy"
  | "status"
  | "total";
type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "orderNo", label: "Order #" },
  { key: "orderDate", label: "Order Date" },
  { key: "eventName", label: "Event" },
  { key: "contactName", label: "Contact" },
  { key: "booth", label: "Booth" },
  { key: "orderPlacedBy", label: "Order Placed By" },
  { key: "status", label: "Status" },
  { key: "total", label: "Total" },
];

function sortValue(order: EventOrder, key: SortKey): string {
  if (key === "total") return String(order.total).padStart(12, "0");
  return String(order[key]);
}

function UpdateReturnItemsPage() {
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("orderDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const orders = useMemo(() => listOrdersForReturn(), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = q
      ? orders.filter(
          (o) =>
            o.orderNo.toLowerCase().includes(q) ||
            o.eventName.toLowerCase().includes(q) ||
            o.eventCode.toLowerCase().includes(q) ||
            o.contactName.toLowerCase().includes(q) ||
            o.contactEmail.toLowerCase().includes(q) ||
            o.booth.toLowerCase().includes(q),
        )
      : orders;
    const sorted = [...rows].sort((a, b) =>
      sortValue(a, sortKey).localeCompare(sortValue(b, sortKey)),
    );
    return sortDir === "asc" ? sorted : sorted.reverse();
  }, [orders, search, sortKey, sortDir]);

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

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-lg font-semibold uppercase tracking-wide text-[#495057]">
          Update Return Items
        </h1>
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
              placeholder="Search by Order #, Event, Contact & Booth..."
              className="w-full rounded-md border border-border bg-white px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:border-[#0b8a7a] focus:outline-none focus:ring-2 focus:ring-[#0b8a7a]/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-sm">
            <thead>
              <tr
                className="text-left text-white"
                style={{ backgroundColor: BRAND.primary }}
              >
                {COLUMNS.map(({ key, label }) => (
                  <th key={key} className="px-4 py-3 font-semibold">
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
                <th className="px-4 py-3 font-semibold text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-border hover:bg-muted/40"
                >
                  <td className="px-4 py-3">
                    <Link
                      to="/dashboard/events/order-return/$orderId"
                      params={{ orderId: order.id }}
                      className="hover:underline"
                      style={{ color: BRAND.primary }}
                    >
                      {order.orderNo}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[#495057]">
                    {formatOrderDateTime(order.orderDate)}
                  </td>
                  <td className="px-4 py-3 text-[#495057]">
                    <div>{order.eventName}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.eventCode}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#495057]">
                    <div>{order.contactName}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.contactEmail}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#495057]">{order.booth}</td>
                  <td className="px-4 py-3 text-[#495057]">
                    {order.orderPlacedBy}
                  </td>
                  <td className="px-4 py-3 text-[#495057]">{order.status}</td>
                  <td className="px-4 py-3 font-medium text-[#495057]">
                    {formatOrderMoney(order.total)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to="/dashboard/events/order-return/$orderId"
                      params={{ orderId: order.id }}
                      aria-label={`Return items for ${order.orderNo}`}
                      title="Return Items"
                      className="text-green-600 hover:text-green-700"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td
                    colSpan={COLUMNS.length + 1}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No return orders found.
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
