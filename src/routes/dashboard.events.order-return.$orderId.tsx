import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BRAND } from "@/lib/brand";
import {
  formatOrderDateTime,
  getEventOrder,
  updateOrderReturnQuantities,
  type EventOrder,
  type EventOrderLine,
} from "@/lib/mock-event-orders";

export const Route = createFileRoute("/dashboard/events/order-return/$orderId")({
  head: ({ params }) => {
    const order = getEventOrder(params.orderId);
    const title = order
      ? `Return Items ${order.orderNo} — ${BRAND.name}`
      : `Update Return Items — ${BRAND.name}`;
    return { meta: [{ title }] };
  },
  component: OrderReturnPage,
});

type DraftLine = {
  id: string;
  productTitle: string;
  variantLabel: string;
  quantity: number;
  returnQuantity: string;
};

function toDraftLines(lines: EventOrderLine[]): DraftLine[] {
  return lines.map((line) => ({
    id: line.id,
    productTitle: line.productTitle,
    variantLabel: line.variantLabel,
    quantity: line.quantity,
    returnQuantity: line.returnQuantity,
  }));
}

function hasReturnQty(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  const n = Number(trimmed);
  return !Number.isNaN(n) && n > 0;
}

function OrderReturnPage() {
  const { orderId } = Route.useParams();
  const [order, setOrder] = useState<EventOrder | undefined>(() =>
    getEventOrder(orderId),
  );
  const [drafts, setDrafts] = useState<DraftLine[]>(() =>
    order ? toDraftLines(order.lines) : [],
  );
  const [previewMode, setPreviewMode] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const next = getEventOrder(orderId);
    setOrder(next);
    setDrafts(next ? toDraftLines(next.lines) : []);
    setPreviewMode(false);
    setMessage("");
    setError("");
  }, [orderId]);

  const willUpdate = useMemo(
    () => drafts.filter((d) => hasReturnQty(d.returnQuantity)),
    [drafts],
  );
  const willNotUpdate = useMemo(
    () => drafts.filter((d) => !hasReturnQty(d.returnQuantity)),
    [drafts],
  );

  if (!order) {
    return (
      <div className="p-6">
        <h1 className="mb-4 text-lg font-semibold uppercase tracking-wide text-[#495057]">
          Order Not Found
        </h1>
        <Link
          to="/dashboard/events/orders/returns"
          className="text-sm font-medium hover:underline"
          style={{ color: BRAND.primary }}
        >
          Back
        </Link>
      </div>
    );
  }

  const setReturnQty = (lineId: string, value: string) => {
    setDrafts((prev) =>
      prev.map((d) =>
        d.id === lineId ? { ...d, returnQuantity: value } : d,
      ),
    );
  };

  const onUpdateInventory = () => {
    setError("");
    setMessage("");
    setPreviewMode(true);
  };

  const onCancelPreview = () => {
    setPreviewMode(false);
    setError("");
  };

  const onConfirm = () => {
    const quantities: Record<string, string> = {};
    for (const d of drafts) {
      quantities[d.id] = d.returnQuantity.trim();
    }
    const updated = updateOrderReturnQuantities(order.id, quantities);
    if (!updated) {
      setError("Unable to update return quantities.");
      return;
    }
    setOrder(updated);
    setDrafts(toDraftLines(updated.lines));
    setPreviewMode(false);
    setMessage("Inventory return quantities updated.");
  };

  return (
    <div className="max-w-full overflow-x-hidden p-4 sm:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-lg font-semibold uppercase tracking-wide text-[#495057]">
          Update Return Items
        </h1>
        <Link
          to="/dashboard/events/orders/returns"
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
            to="/dashboard/events/orders/returns"
            className="font-medium underline"
          >
            Return to list
          </Link>
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-4 rounded-lg border border-border bg-white px-4 py-3">
        <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="min-w-0">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Event
            </dt>
            <dd className="truncate text-[#495057]">{order.eventName}</dd>
            <dd className="text-xs text-muted-foreground">{order.eventCode}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Order #
            </dt>
            <dd className="text-[#495057]">{order.orderNo}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Order Date
            </dt>
            <dd className="text-[#495057]">
              {formatOrderDateTime(order.orderDate)}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Status
            </dt>
            <dd className="text-[#495057]">{order.status}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Booth
            </dt>
            <dd className="truncate text-[#495057]">{order.booth}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Contact
            </dt>
            <dd className="truncate text-[#495057]">{order.contactName}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Order Placed By
            </dt>
            <dd className="truncate text-[#495057]">{order.orderPlacedBy}</dd>
          </div>
        </dl>
      </div>

      {!previewMode ? (
        <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr
                  className="text-left text-white"
                  style={{ backgroundColor: BRAND.primary }}
                >
                  <th className="px-3 py-2 font-semibold">Item</th>
                  <th className="px-3 py-2 text-center font-semibold">
                    Order Quantity
                  </th>
                  <th className="px-3 py-2 text-center font-semibold">
                    Order Return Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                {drafts.map((line) => (
                  <tr key={line.id} className="border-t border-border">
                    <td className="px-3 py-2 text-[#495057]">
                      <div>{line.productTitle}</div>
                      {line.variantLabel && (
                        <div className="text-xs text-muted-foreground">
                          {line.variantLabel}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 text-center text-[#495057]">
                      {line.quantity}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input
                        type="number"
                        min={0}
                        max={line.quantity}
                        value={line.returnQuantity}
                        onChange={(e) =>
                          setReturnQty(line.id, e.target.value)
                        }
                        className="mx-auto w-24 rounded-md border border-border px-2 py-1 text-center text-sm focus:border-[#0b8a7a] focus:outline-none"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={onUpdateInventory}
            className="mt-4 rounded-md px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: BRAND.primary }}
          >
            Update Inventory
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-[#495057]">
            Products - (Inventory will be updated.)
          </h2>
          <div className="mb-6 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr
                  className="text-left text-white"
                  style={{ backgroundColor: BRAND.primary }}
                >
                  <th className="px-3 py-2 font-semibold">Item Id</th>
                  <th className="px-3 py-2 font-semibold">Item Name</th>
                  <th className="px-3 py-2 text-center font-semibold">
                    Order Quantity
                  </th>
                  <th className="px-3 py-2 text-center font-semibold">
                    Order Return Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                {willUpdate.map((line) => (
                  <tr key={line.id} className="border-t border-border">
                    <td className="px-3 py-2 text-[#495057]">{line.id}</td>
                    <td className="px-3 py-2 text-[#495057]">
                      {line.productTitle}
                      {line.variantLabel
                        ? ` — ${line.variantLabel}`
                        : ""}
                    </td>
                    <td className="px-3 py-2 text-center text-[#495057]">
                      {line.quantity}
                    </td>
                    <td className="px-3 py-2 text-center text-[#495057]">
                      {line.returnQuantity}
                    </td>
                  </tr>
                ))}
                {willUpdate.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-6 text-center text-muted-foreground"
                    >
                      No record with inventory will be updated.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <h2 className="mb-3 text-base font-semibold text-[#495057]">
            Products - (Inventory will not be updated.)
          </h2>
          <div className="mb-6 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr
                  className="text-left text-white"
                  style={{ backgroundColor: BRAND.primary }}
                >
                  <th className="px-3 py-2 font-semibold">Item Id</th>
                  <th className="px-3 py-2 font-semibold">Item Name</th>
                  <th className="px-3 py-2 text-center font-semibold">
                    Order Quantity
                  </th>
                  <th className="px-3 py-2 text-center font-semibold">
                    Order Return Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                {willNotUpdate.map((line) => (
                  <tr key={line.id} className="border-t border-border">
                    <td className="px-3 py-2 text-[#495057]">{line.id}</td>
                    <td className="px-3 py-2 text-[#495057]">
                      {line.productTitle}
                      {line.variantLabel
                        ? ` — ${line.variantLabel}`
                        : ""}
                    </td>
                    <td className="px-3 py-2 text-center text-[#495057]">
                      {line.quantity}
                    </td>
                    <td className="px-3 py-2 text-center text-[#495057]">
                      {line.returnQuantity || "—"}
                    </td>
                  </tr>
                ))}
                {willNotUpdate.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-6 text-center text-muted-foreground"
                    >
                      No record with inventory will not be updated.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap gap-2">
            {willUpdate.length > 0 && (
              <button
                type="button"
                onClick={onConfirm}
                className="rounded-md px-4 py-2 text-sm font-medium text-white"
                style={{ backgroundColor: BRAND.primary }}
              >
                Confirm
              </button>
            )}
            <button
              type="button"
              onClick={onCancelPreview}
              className="rounded-md px-4 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: BRAND.primary }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
