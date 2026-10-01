import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { BRAND } from "@/lib/brand";
import {
  cartSubtotal,
  formatMoney,
  removeFromCart,
  updateCartQuantity,
} from "@/lib/event-store-session";
import {
  eventReturnByDate,
  formatLongDate,
} from "@/lib/mock-events";
import { useStoreContext } from "@/components/event-store/StoreShell";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { event, cart, refreshCart } = useStoreContext();
  if (!open) return null;

  const subtotal = cartSubtotal(cart);
  const returnBy = eventReturnByDate(event, 3);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close cart overlay"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#2a2a2a] text-white shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-lg font-semibold">Shopping cart</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm underline underline-offset-2 hover:opacity-80"
          >
            Close
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {cart.length === 0 && (
            <p className="text-sm text-white/60">Your cart is empty.</p>
          )}
          {cart.map((line) => (
            <div
              key={line.id}
              className="relative flex gap-3 border-b border-white/10 pb-4"
            >
              <div
                className="h-16 w-16 shrink-0 rounded bg-white/90"
                style={{ backgroundColor: "#f0f0f0" }}
              />
              <div className="min-w-0 flex-1 pr-6">
                <p className="text-sm font-medium leading-snug">
                  {line.title}
                  {line.variantLabel ? ` - ${line.variantLabel}` : ""}
                </p>
                <p className="mt-1 text-xs text-white/60">
                  Rent from: {formatLongDate(event.fromDate)}
                </p>
                <p className="text-xs text-white/60">
                  Rent to: {formatLongDate(event.toDate)}
                </p>
                <p className="text-xs text-white/60">
                  Rental return within: 3 days ({returnBy})
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center overflow-hidden rounded border border-white/20 bg-white text-black">
                    <button
                      type="button"
                      className="px-2 py-1 text-sm"
                      onClick={() => {
                        updateCartQuantity(line.id, line.quantity - 1);
                        refreshCart();
                      }}
                    >
                      −
                    </button>
                    <span className="min-w-8 px-1 text-center text-sm">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      className="px-2 py-1 text-sm"
                      onClick={() => {
                        updateCartQuantity(line.id, line.quantity + 1);
                        refreshCart();
                      }}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm" style={{ color: BRAND.primary }}>
                    {line.quantity} × {formatMoney(line.unitPrice)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                aria-label="Remove item"
                className="absolute right-0 top-0 text-white/50 hover:text-white"
                onClick={() => {
                  removeFromCart(line.id);
                  refreshCart();
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-3 border-t border-white/10 px-5 py-4">
          <div className="flex items-center justify-between text-sm">
            <span>Subtotal:</span>
            <span className="font-semibold" style={{ color: BRAND.primary }}>
              {formatMoney(subtotal)}
            </span>
          </div>
          <Link
            to="/store/cart"
            onClick={onClose}
            className="block w-full rounded-md py-3 text-center text-sm font-semibold uppercase tracking-wide text-white"
            style={{ backgroundColor: BRAND.primary }}
          >
            View Cart
          </Link>
          <Link
            to="/store/checkout"
            onClick={onClose}
            className="block w-full rounded-md py-3 text-center text-sm font-semibold uppercase tracking-wide text-white"
            style={{ backgroundColor: BRAND.primary }}
          >
            Checkout
          </Link>
        </div>
      </aside>
    </div>
  );
}
