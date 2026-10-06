import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { BRAND } from "@/lib/brand";
import {
  cartSubtotal,
  formatMoney,
  removeFromCart,
  updateCartQuantity,
} from "@/lib/event-store-session";
import { eventReturnByDate, formatLongDate } from "@/lib/mock-events";
import { getStoreProduct } from "@/lib/mock-store-products";
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
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-black text-white shadow-xl">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-base font-medium">Shopping cart</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-sm text-white hover:opacity-80"
          >
            <X className="h-4 w-4" />
            Close
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 pb-4">
          {cart.length === 0 && (
            <p className="text-sm text-white/60">Your cart is empty.</p>
          )}
          {cart.map((line) => {
            const product = getStoreProduct(line.productId);
            return (
              <div key={line.id} className="relative flex gap-4">
                <div className="h-[72px] w-[72px] shrink-0 overflow-hidden bg-white">
                  {product?.imageSrc ? (
                    <img
                      src={product.imageSrc}
                      alt=""
                      className="h-full w-full object-contain p-1"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1 pr-5">
                  <p className="text-sm font-semibold leading-snug text-white">
                    {line.title}
                    {line.variantLabel ? ` - ${line.variantLabel}` : ""}
                  </p>
                  <div className="mt-2 space-y-0.5 text-xs leading-relaxed text-white">
                    <p>
                      <span className="font-semibold">Rent from:</span>{" "}
                      {formatLongDate(event.fromDate)}
                    </p>
                    <p>
                      <span className="font-semibold">Rent to:</span>{" "}
                      {formatLongDate(event.toDate)}
                    </p>
                    <p>
                      <span className="font-semibold">Rental return within:</span>{" "}
                      3 days ({returnBy})
                    </p>
                  </div>
                  <div className="mt-3 inline-flex items-stretch overflow-hidden border border-[#555] text-sm">
                    <button
                      type="button"
                      className="px-2.5 py-1 hover:bg-white/10"
                      onClick={() => {
                        updateCartQuantity(line.id, line.quantity - 1);
                        refreshCart();
                      }}
                    >
                      −
                    </button>
                    <span className="min-w-8 border-x border-[#555] px-2 py-1 text-center">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      className="px-2.5 py-1 hover:bg-white/10"
                      onClick={() => {
                        updateCartQuantity(line.id, line.quantity + 1);
                        refreshCart();
                      }}
                    >
                      +
                    </button>
                  </div>
                  <p className="mt-2 text-sm">
                    <span className="text-white">{line.quantity} × </span>
                    <span style={{ color: BRAND.primary }}>
                      {formatMoney(line.unitPrice)}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Remove item"
                  className="absolute right-0 top-0 text-white/70 hover:text-white"
                  onClick={() => {
                    removeFromCart(line.id);
                    refreshCart();
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="space-y-3 px-5 py-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">Subtotal:</span>
            <span className="font-semibold" style={{ color: BRAND.primary }}>
              {formatMoney(subtotal)}
            </span>
          </div>
          <Link
            to="/store/cart"
            onClick={onClose}
            className="block w-full py-3 text-center text-sm font-semibold uppercase tracking-wide text-white"
            style={{ backgroundColor: BRAND.primary }}
          >
            View Cart
          </Link>
          <Link
            to="/store/checkout"
            onClick={onClose}
            className="block w-full py-3 text-center text-sm font-semibold uppercase tracking-wide text-white"
            style={{ backgroundColor: BRAND.primary }}
          >
            Checkout
          </Link>
        </div>
      </aside>
    </div>
  );
}
