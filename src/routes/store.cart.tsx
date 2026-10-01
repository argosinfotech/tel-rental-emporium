import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { CheckoutProgress } from "@/components/event-store/CheckoutProgress";
import {
  RequireStoreEvent,
  useStoreContext,
} from "@/components/event-store/StoreShell";
import { BRAND } from "@/lib/brand";
import {
  cartSubtotal,
  formatMoney,
  removeFromCart,
  setCart,
  type StoreCartLine,
} from "@/lib/event-store-session";
import {
  eventReturnByDate,
  formatEventAddress,
  formatLongDate,
} from "@/lib/mock-events";

export const Route = createFileRoute("/store/cart")({
  head: () => ({
    meta: [{ title: `Shopping Cart — TEL Events Store` }],
  }),
  component: () => (
    <RequireStoreEvent>
      <CartPage />
    </RequireStoreEvent>
  ),
});

function CartPage() {
  const { event, cart, refreshCart } = useStoreContext();
  const [draft, setDraft] = useState<StoreCartLine[]>(cart);
  const [coupon, setCoupon] = useState("");

  useEffect(() => {
    setDraft(cart);
  }, [cart]);

  const subtotal = cartSubtotal(draft);
  const returnBy = eventReturnByDate(event, 3);
  const shipTo = formatEventAddress(event);

  const updateDraftQty = (id: string, quantity: number) => {
    setDraft((lines) =>
      quantity <= 0
        ? lines.filter((l) => l.id !== id)
        : lines.map((l) => (l.id === id ? { ...l, quantity } : l)),
    );
  };

  const applyUpdate = () => {
    setCart(draft);
    refreshCart();
  };

  return (
    <div>
      <CheckoutProgress current="cart" />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {draft.length === 0 ? (
          <div className="text-center">
            <p className="text-[#555]">Your cart is currently empty.</p>
            <Link
              to="/store/shop"
              className="mt-4 inline-block text-sm font-medium underline"
              style={{ color: BRAND.primary }}
            >
              Return to shop
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-[#eee] text-left text-[#888]">
                      <th className="pb-3 font-medium" />
                      <th className="pb-3 font-medium">Product</th>
                      <th className="pb-3 font-medium">Price</th>
                      <th className="pb-3 font-medium">Quantity</th>
                      <th className="pb-3 font-medium">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {draft.map((line) => (
                      <tr key={line.id} className="border-b border-[#eee]">
                        <td className="py-4 pr-2 align-top">
                          <button
                            type="button"
                            aria-label="Remove"
                            onClick={() => {
                              removeFromCart(line.id);
                              refreshCart();
                            }}
                            className="text-[#999] hover:text-[#1a1a1a]"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="flex gap-3">
                            <div className="h-16 w-16 shrink-0 rounded border border-[#eee] bg-[#f4f4f4]" />
                            <div>
                              <p className="font-medium text-[#1a1a1a]">
                                {line.title}
                                {line.variantLabel
                                  ? ` - ${line.variantLabel}`
                                  : ""}
                              </p>
                              <p className="mt-1 text-xs text-[#888]">
                                Rent from: {formatLongDate(event.fromDate)}
                              </p>
                              <p className="text-xs text-[#888]">
                                Rent to: {formatLongDate(event.toDate)}
                              </p>
                              <p className="text-xs text-[#888]">
                                Rental return within: 3 days ({returnBy})
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 align-top">
                          {formatMoney(line.unitPrice)}
                        </td>
                        <td className="py-4 align-top">
                          <div className="inline-flex items-center overflow-hidden rounded border border-[#ddd]">
                            <button
                              type="button"
                              className="px-2 py-1"
                              onClick={() =>
                                updateDraftQty(line.id, line.quantity - 1)
                              }
                            >
                              −
                            </button>
                            <span className="min-w-8 px-1 text-center">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              className="px-2 py-1"
                              onClick={() =>
                                updateDraftQty(line.id, line.quantity + 1)
                              }
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td
                          className="py-4 align-top font-medium"
                          style={{ color: BRAND.primary }}
                        >
                          {formatMoney(line.unitPrice * line.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Coupon code"
                    className="rounded border border-[#ddd] px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    className="rounded px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
                    style={{ backgroundColor: BRAND.primary }}
                  >
                    Apply Coupon
                  </button>
                </div>
                <button
                  type="button"
                  onClick={applyUpdate}
                  className="rounded px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
                  style={{ backgroundColor: BRAND.primary }}
                >
                  Update Cart
                </button>
              </div>
            </div>

            <aside className="h-fit rounded border border-[#eee] bg-[#fafafa] p-5">
              <h2 className="text-sm font-bold uppercase tracking-wide">
                Cart Totals
              </h2>
              <div className="mt-4 space-y-3 border-t border-[#eee] pt-4 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatMoney(subtotal)}</span>
                </div>
                <div>
                  <p className="font-medium">Shipment</p>
                  <p className="mt-1 text-[#555]">Booth Delivery</p>
                  <p className="mt-1 text-xs text-[#888]">
                    Shipping to {shipTo}.
                  </p>
                </div>
                <div className="flex justify-between border-t border-[#eee] pt-3 text-base font-semibold">
                  <span>Total</span>
                  <span style={{ color: BRAND.primary }}>
                    {formatMoney(subtotal)}
                  </span>
                </div>
              </div>
              <Link
                to="/store/checkout"
                className="mt-5 block w-full rounded py-3 text-center text-xs font-semibold uppercase tracking-wide text-white"
                style={{ backgroundColor: BRAND.primary }}
              >
                Proceed to Checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
