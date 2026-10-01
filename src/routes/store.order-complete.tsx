import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckoutProgress } from "@/components/event-store/CheckoutProgress";
import { RequireStoreEvent } from "@/components/event-store/StoreShell";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/store/order-complete")({
  head: () => ({
    meta: [{ title: `Order Complete — TEL Events Store` }],
  }),
  component: () => (
    <RequireStoreEvent>
      <OrderCompletePage />
    </RequireStoreEvent>
  ),
});

function OrderCompletePage() {
  return (
    <div>
      <CheckoutProgress current="complete" />
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-3xl font-bold text-[#1a1a1a]">Thank you</h1>
        <p className="mt-3 text-sm text-[#555]">
          Your order has been received. This is a prototype confirmation — no
          payment was processed.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/store/shop"
            className="rounded px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white"
            style={{ backgroundColor: BRAND.primary }}
          >
            Continue Shopping
          </Link>
          <Link
            to="/store/home"
            className="rounded border border-[#ddd] px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#1a1a1a]"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
