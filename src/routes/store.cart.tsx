import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
  formatLongDate,
} from "@/lib/mock-events";
import { getStoreProduct } from "@/lib/mock-store-products";

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
    <div className="bg-white">
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
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
            <div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#e5e5e5] text-left text-xs uppercase tracking-wide text-[#999]">
                      <th className="pb-3 pr-2 font-medium" />
                      <th className="pb-3 font-medium">Product</th>
                      <th className="pb-3 text-center font-medium">Price</th>
                      <th className="pb-3 text-center font-medium">Quantity</th>
                      <th className="pb-3 text-right font-medium">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {draft.map((line) => {
                      const product = getStoreProduct(line.productId);
                      return (
                        <tr
                          key={line.id}
                          className="border-b border-[#e5e5e5]"
                        >
                          <td className="py-5 pr-2 align-middle">
                            <button
                              type="button"
                              aria-label="Remove"
                              onClick={() => {
                                removeFromCart(line.id);
                                refreshCart();
                              }}
                              className="text-[#bbb] hover:text-[#1a1a1a]"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </td>
                          <td className="py-5 pr-4">
                            <div className="flex gap-4">
                              <div className="h-16 w-16 shrink-0 overflow-hidden border border-[#eee] bg-[#f7f7f7]">
                                {product?.imageSrc ? (
                                  <img
                                    src={product.imageSrc}
                                    alt=""
                                    className="h-full w-full object-contain p-1"
                                  />
                                ) : null}
                              </div>
                              <div>
                                <p className="font-semibold text-[#1a1a1a]">
                                  {line.title}
                                  {line.variantLabel
                                    ? ` - ${line.variantLabel}`
                                    : ""}
                                </p>
                                <div className="mt-1.5 space-y-0.5 text-xs text-[#888]">
                                  <p>
                                    Rent from: {formatLongDate(event.fromDate)}
                                  </p>
                                  <p>
                                    Rent to: {formatLongDate(event.toDate)}
                                  </p>
                                  <p>
                                    Rental return within: 3 days ({returnBy})
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-5 text-center align-middle text-[#1a1a1a]">
                            {formatMoney(line.unitPrice)}
                          </td>
                          <td className="py-5 text-center align-middle">
                            <div className="inline-flex items-stretch overflow-hidden border border-[#ddd]">
                              <button
                                type="button"
                                className="px-2.5 py-1.5 hover:bg-[#f7f7f7]"
                                onClick={() =>
                                  updateDraftQty(line.id, line.quantity - 1)
                                }
                              >
                                −
                              </button>
                              <span className="min-w-9 border-x border-[#ddd] px-2 py-1.5 text-center">
                                {line.quantity}
                              </span>
                              <button
                                type="button"
                                className="px-2.5 py-1.5 hover:bg-[#f7f7f7]"
                                onClick={() =>
                                  updateDraftQty(line.id, line.quantity + 1)
                                }
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td
                            className="py-5 text-right align-middle font-semibold"
                            style={{ color: BRAND.primary }}
                          >
                            {formatMoney(line.unitPrice * line.quantity)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Coupon code"
                    className="min-w-[180px] border border-[#ddd] bg-white px-3 py-2.5 text-sm"
                  />
                  <button
                    type="button"
                    className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white"
                    style={{ backgroundColor: BRAND.primary }}
                  >
                    Apply Coupon
                  </button>
                </div>
                <button
                  type="button"
                  onClick={applyUpdate}
                  className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white"
                  style={{ backgroundColor: "#4db6a8" }}
                >
                  Update Cart
                </button>
              </div>
            </div>

            <aside className="h-fit border border-[#e5e5e5] bg-white p-5">
              <h2 className="text-sm font-bold uppercase tracking-wide text-[#1a1a1a]">
                Cart Totals
              </h2>
              <div className="mt-5 space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-[#555]">Subtotal</span>
                  <span className="text-[#1a1a1a]">{formatMoney(subtotal)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#555]">Shipment</span>
                  <div className="max-w-[180px] text-right">
                    <p className="text-[#1a1a1a]">Booth Delivery</p>
                    <p className="mt-1 text-xs leading-snug text-[#888]">
                      Shipping to {event.address1}
                      {event.address2 ? `, ${event.address2}` : ""},{" "}
                      {event.city}, {event.stateCode} {event.zipCode}.
                    </p>
                  </div>
                </div>
                <div className="flex justify-between gap-4 border-t border-[#e5e5e5] pt-4 text-base font-semibold">
                  <span>Total</span>
                  <span style={{ color: BRAND.primary }}>
                    {formatMoney(subtotal)}
                  </span>
                </div>
              </div>
              <Link
                to="/store/checkout"
                className="mt-5 block w-full py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-white"
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
