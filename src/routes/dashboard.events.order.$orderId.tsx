import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BRAND } from "@/lib/brand";
import {
  EVENT_ORDER_STATUSES,
  formatOrderDate,
  formatOrderDateTime,
  formatOrderMoney,
  getEventOrder,
  slugFromStatus,
  updateOrderStatus,
  type EventOrder,
  type EventOrderStatus,
} from "@/lib/mock-event-orders";

export const Route = createFileRoute("/dashboard/events/order/$orderId")({
  head: ({ params }) => {
    const order = getEventOrder(params.orderId);
    const title = order
      ? `Order ${order.orderNo} — ${BRAND.name}`
      : `Order Detail — ${BRAND.name}`;
    return { meta: [{ title }] };
  },
  component: OrderDetailPage,
});

function statusBadgeStyle(status: EventOrderStatus): {
  backgroundColor: string;
  color: string;
} {
  switch (status) {
    case "New":
      return { backgroundColor: "#eaf6f5", color: BRAND.primary };
    case "Processing":
      return { backgroundColor: "#fff7e6", color: "#b45309" };
    case "Shipped":
      return { backgroundColor: "#e8f0fe", color: "#1d4ed8" };
    case "Delivered":
      return { backgroundColor: "#ecfdf5", color: "#047857" };
    case "Completed":
      return { backgroundColor: "#f3f4f6", color: "#374151" };
    case "Cancelled":
      return { backgroundColor: "#fef2f2", color: "#b91c1c" };
    default:
      return { backgroundColor: "#f3f4f6", color: "#374151" };
  }
}

function OrderDetailPage() {
  const { orderId } = Route.useParams();
  const [order, setOrder] = useState<EventOrder | undefined>(() =>
    getEventOrder(orderId),
  );
  const [statusDraft, setStatusDraft] = useState<EventOrderStatus>(
    order?.status ?? "New",
  );
  const [trackingNo, setTrackingNo] = useState(order?.trackingNo ?? "");
  const [trackingUrl, setTrackingUrl] = useState(order?.trackingUrl ?? "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const next = getEventOrder(orderId);
    setOrder(next);
    if (next) {
      setStatusDraft(next.status);
      setTrackingNo(next.trackingNo);
      setTrackingUrl(next.trackingUrl);
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="p-6">
        <h1 className="mb-4 text-lg font-semibold uppercase tracking-wide text-[#495057]">
          Order Not Found
        </h1>
        <Link
          to="/dashboard/events/orders/$status"
          params={{ status: "new" }}
          className="text-sm font-medium hover:underline"
          style={{ color: BRAND.primary }}
        >
          Back
        </Link>
      </div>
    );
  }

  const listStatusSlug = slugFromStatus(order.status);
  const trackingDirty =
    trackingNo.trim() !== order.trackingNo ||
    trackingUrl.trim() !== order.trackingUrl;
  const statusDirty = statusDraft !== order.status;
  const canUpdate =
    statusDirty || (statusDraft === "Shipped" && trackingDirty);

  const onUpdateStatus = () => {
    setError("");
    if (statusDraft === "Shipped") {
      if (!trackingNo.trim() || !trackingUrl.trim()) {
        setError("Tracking No and Tracking URL are required for Shipped.");
        return;
      }
    }
    const updated = updateOrderStatus(order.id, statusDraft, {
      trackingNo,
      trackingUrl,
    });
    if (!updated) return;
    setOrder(updated);
    setTrackingNo(updated.trackingNo);
    setTrackingUrl(updated.trackingUrl);
    setMessage(`Status updated to ${updated.status}.`);
  };

  const badge = statusBadgeStyle(order.status);

  return (
    <div className="max-w-full overflow-x-hidden p-4 sm:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-lg font-semibold uppercase tracking-wide text-[#495057]">
            View Order Detail
          </h1>
          <p className="text-sm font-semibold text-[#495057]">
            Order # {order.orderNo}
          </p>
        </div>
        <Link
          to="/dashboard/events/orders/$status"
          params={{ status: listStatusSlug }}
          className="inline-flex items-center rounded-md border border-[#0b8a7a] px-4 py-1.5 text-sm font-medium transition-colors hover:bg-[#eaf6f5]"
          style={{ color: BRAND.primary }}
        >
          Back
        </Link>
      </div>

      {message && (
        <div
          className="mb-4 rounded-md border px-4 py-3 text-sm"
          style={{
            borderColor: BRAND.primary,
            backgroundColor: BRAND.primaryMuted,
            color: BRAND.primary,
          }}
        >
          {message}{" "}
          <Link
            to="/dashboard/events/orders/$status"
            params={{ status: slugFromStatus(order.status) }}
            className="font-medium underline"
          >
            Return to {order.status} list
          </Link>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px] xl:gap-5">
        <aside className="h-fit rounded-lg border border-border bg-white p-4 shadow-sm xl:col-start-2 xl:row-start-1">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#495057]">
            Change Status
          </h2>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Status
          </label>
          <select
            value={statusDraft}
            onChange={(e) => {
              const next = e.target.value as EventOrderStatus;
              setStatusDraft(next);
              setError("");
              setMessage("");
            }}
            className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm outline-none focus:border-[#0b8a7a] focus:ring-2 focus:ring-[#0b8a7a]/20"
          >
            {EVENT_ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {statusDraft === "Shipped" && (
            <div className="mt-3 space-y-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Tracking No <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={trackingNo}
                  onChange={(e) => {
                    setTrackingNo(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter tracking number"
                  className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm outline-none focus:border-[#0b8a7a] focus:ring-2 focus:ring-[#0b8a7a]/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Tracking URL <span className="text-destructive">*</span>
                </label>
                <input
                  type="url"
                  value={trackingUrl}
                  onChange={(e) => {
                    setTrackingUrl(e.target.value);
                    setError("");
                  }}
                  placeholder="https://..."
                  className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm outline-none focus:border-[#0b8a7a] focus:ring-2 focus:ring-[#0b8a7a]/20"
                />
              </div>
            </div>
          )}

          {error && (
            <p className="mt-3 text-sm text-destructive">{error}</p>
          )}

          <button
            type="button"
            onClick={onUpdateStatus}
            disabled={!canUpdate}
            className="mt-4 w-full rounded-md px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: BRAND.primary }}
          >
            Update Status
          </button>
        </aside>

        <div className="min-w-0 space-y-4 xl:col-start-1 xl:row-start-1">
          <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#495057]">
                Order / Event Summary
              </h2>
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                style={badge}
              >
                {order.status}
              </span>
            </div>
            <dl className="grid gap-x-4 gap-y-2.5 text-sm sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <dt className="text-xs text-muted-foreground">Order Date</dt>
                <dd className="font-medium text-[#495057]">
                  {formatOrderDateTime(order.orderDate)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Shipping Method</dt>
                <dd className="font-medium text-[#495057]">
                  {order.shippingMethod}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Event</dt>
                <dd className="font-medium text-[#495057]">
                  {order.eventName}{" "}
                  <span className="text-xs text-muted-foreground">
                    ({order.eventCode})
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Booth</dt>
                <dd className="font-medium text-[#495057]">{order.booth}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Contact</dt>
                <dd className="font-medium text-[#495057]">
                  {order.contactName}
                  <div className="text-xs font-normal text-muted-foreground">
                    {order.contactEmail}
                  </div>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Order Placed By</dt>
                <dd className="font-medium text-[#495057]">
                  {order.orderPlacedBy}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Rental Dates</dt>
                <dd className="font-medium text-[#495057]">
                  {formatOrderDate(order.rentFrom)} –{" "}
                  {formatOrderDate(order.rentTo)}
                </dd>
              </div>
              {(order.status === "Shipped" ||
                order.trackingNo ||
                order.trackingUrl) && (
                <>
                  <div>
                    <dt className="text-xs text-muted-foreground">Tracking No</dt>
                    <dd className="font-medium text-[#495057]">
                      {order.trackingNo || "—"}
                    </dd>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-2">
                    <dt className="text-xs text-muted-foreground">
                      Tracking URL
                    </dt>
                    <dd className="font-medium text-[#495057]">
                      {order.trackingUrl ? (
                        <a
                          href={order.trackingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="break-all underline"
                          style={{ color: BRAND.primary }}
                        >
                          {order.trackingUrl}
                        </a>
                      ) : (
                        "—"
                      )}
                    </dd>
                  </div>
                </>
              )}
            </dl>
          </div>

          <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#495057]">
              Line Items
            </h2>
            <div className="max-w-full overflow-x-auto">
              <table className="w-full min-w-0 border-collapse text-sm">
                <thead>
                  <tr
                    className="text-left text-white"
                    style={{ backgroundColor: BRAND.primary }}
                  >
                    <th className="px-3 py-2 font-semibold">Product</th>
                    <th className="px-3 py-2 font-semibold">Variant</th>
                    <th className="px-3 py-2 font-semibold text-center">Qty</th>
                    <th className="px-3 py-2 font-semibold text-right">
                      Unit Price
                    </th>
                    <th className="px-3 py-2 font-semibold text-right">
                      Line Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.lines.map((line) => (
                    <tr key={line.id} className="border-t border-border">
                      <td className="px-3 py-2 text-[#495057]">
                        {line.productTitle}
                      </td>
                      <td className="px-3 py-2 text-[#495057]">
                        {line.variantLabel || "—"}
                      </td>
                      <td className="px-3 py-2 text-center text-[#495057]">
                        {line.quantity}
                      </td>
                      <td className="px-3 py-2 text-right text-[#495057]">
                        {formatOrderMoney(line.unitPrice)}
                      </td>
                      <td className="px-3 py-2 text-right font-medium text-[#495057]">
                        {formatOrderMoney(line.lineTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border">
                    <td
                      colSpan={4}
                      className="px-3 py-2 text-right font-semibold text-[#495057]"
                    >
                      Order Total
                    </td>
                    <td
                      className="px-3 py-2 text-right font-semibold"
                      style={{ color: BRAND.primary }}
                    >
                      {formatOrderMoney(order.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#495057]">
              Billing / Notes
            </h2>
            <dl className="grid gap-x-4 gap-y-2.5 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-xs text-muted-foreground">Name</dt>
                <dd className="font-medium text-[#495057]">
                  {order.billing.firstName} {order.billing.lastName}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Email</dt>
                <dd className="font-medium break-all text-[#495057]">
                  {order.billing.email}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Phone</dt>
                <dd className="font-medium text-[#495057]">
                  {order.billing.phone || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Address</dt>
                <dd className="font-medium text-[#495057]">
                  {order.billing.address1}
                  {order.billing.address2 ? `, ${order.billing.address2}` : ""}
                  <br />
                  {order.billing.city}, {order.billing.stateCode}{" "}
                  {order.billing.zip}
                </dd>
              </div>
              <div className="sm:col-span-2 lg:col-span-4">
                <dt className="text-xs text-muted-foreground">Order Notes</dt>
                <dd className="font-medium text-[#495057]">
                  {order.notes || "—"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
