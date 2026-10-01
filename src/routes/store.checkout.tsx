import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { CreditCard } from "lucide-react";
import { CheckoutProgress } from "@/components/event-store/CheckoutProgress";
import {
  RequireStoreEvent,
  useStoreContext,
} from "@/components/event-store/StoreShell";
import { US_STATES } from "@/components/edit-client/mock-client";
import { BRAND } from "@/lib/brand";
import {
  cartSubtotal,
  clearCart,
  formatMoney,
} from "@/lib/event-store-session";
import {
  eventReturnByDate,
  formatLongDate,
} from "@/lib/mock-events";

export const Route = createFileRoute("/store/checkout")({
  head: () => ({
    meta: [{ title: `Checkout — TEL Events Store` }],
  }),
  component: () => (
    <RequireStoreEvent>
      <CheckoutPage />
    </RequireStoreEvent>
  ),
});

type Billing = {
  firstName: string;
  lastName: string;
  country: string;
  address1: string;
  address2: string;
  city: string;
  stateCode: string;
  zip: string;
  phone: string;
  email: string;
  booth: string;
  contactName: string;
  contactMobile: string;
  notes: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};

const emptyBilling = (): Billing => ({
  firstName: "",
  lastName: "",
  country: "United States (US)",
  address1: "",
  address2: "",
  city: "",
  stateCode: "TX",
  zip: "",
  phone: "",
  email: "",
  booth: "",
  contactName: "",
  contactMobile: "",
  notes: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
});

function CheckoutPage() {
  const navigate = useNavigate();
  const { event, cart, refreshCart } = useStoreContext();
  const [form, setForm] = useState(emptyBilling);
  const [error, setError] = useState("");
  const subtotal = cartSubtotal(cart);
  const returnBy = eventReturnByDate(event, 3);

  const set = <K extends keyof Billing>(key: K, value: Billing[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const placeOrder = (e: FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    const required: (keyof Billing)[] = [
      "firstName",
      "lastName",
      "address1",
      "city",
      "stateCode",
      "zip",
      "email",
      "booth",
      "contactName",
      "contactMobile",
      "cardNumber",
      "expiry",
      "cvc",
    ];
    for (const key of required) {
      if (!String(form[key]).trim()) {
        setError("Please complete all required fields.");
        return;
      }
    }
    clearCart();
    refreshCart();
    void navigate({ to: "/store/order-complete" });
  };

  const fieldClass =
    "mt-1 w-full rounded border border-[#ddd] bg-white px-3 py-2 text-sm outline-none focus:border-[#0b8a7a]";

  return (
    <div className="bg-[#f5f5f5]">
      <CheckoutProgress current="checkout" />
      <form
        onSubmit={placeOrder}
        className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_360px] sm:px-6"
      >
        <div className="space-y-6">
          <div className="space-y-1 text-sm">
            <p>
              <button
                type="button"
                className="underline"
                style={{ color: BRAND.primary }}
              >
                Returning customer? Click here to login
              </button>
            </p>
            <p>
              <button
                type="button"
                className="underline"
                style={{ color: BRAND.primary }}
              >
                Have a coupon? Click here to enter your code
              </button>
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wide">
              Billing Details
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm">
                  First name <span className="text-red-500">*</span>
                </label>
                <input
                  className={fieldClass}
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm">
                  Last name <span className="text-red-500">*</span>
                </label>
                <input
                  className={fieldClass}
                  value={form.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm">
                  Country / Region <span className="text-red-500">*</span>
                </label>
                <select
                  className={fieldClass}
                  value={form.country}
                  onChange={(e) => set("country", e.target.value)}
                >
                  <option>United States (US)</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm">
                  Street address <span className="text-red-500">*</span>
                </label>
                <input
                  className={fieldClass}
                  placeholder="House number and street name"
                  value={form.address1}
                  onChange={(e) => set("address1", e.target.value)}
                />
                <input
                  className={`${fieldClass} mt-2`}
                  placeholder="Apartment, suite, unit, etc. (optional)"
                  value={form.address2}
                  onChange={(e) => set("address2", e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm">
                  Town / City <span className="text-red-500">*</span>
                </label>
                <input
                  className={fieldClass}
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  className={fieldClass}
                  value={form.stateCode}
                  onChange={(e) => set("stateCode", e.target.value)}
                >
                  {US_STATES.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  className={fieldClass}
                  maxLength={5}
                  value={form.zip}
                  onChange={(e) =>
                    set("zip", e.target.value.replace(/\D/g, "").slice(0, 5))
                  }
                />
              </div>
              <div>
                <label className="text-sm">Phone (optional)</label>
                <input
                  className={fieldClass}
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className={fieldClass}
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[#e8e0d5] bg-[#f7f2ea] p-6">
            <h2 className="text-lg font-bold">Booth delivery</h2>
            <p className="mt-2 text-sm text-[#555]">
              Your rental will be delivered to {event.eventName}. Booth number
              and a contact mobile are required.
            </p>
            <div className="mt-3 text-sm text-[#444]">
              <p>{event.address1}</p>
              {event.address2 ? <p>{event.address2}</p> : null}
              <p>
                {event.city}, {event.stateCode} {event.zipCode}
              </p>
              <p>United States (US)</p>
            </div>
            <div className="mt-4 space-y-3 rounded-md border border-[#e5dccf] bg-[#faf6f0] p-4">
              <div>
                <label className="text-sm">
                  Booth# / Exhibiting Company Name{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  className={fieldClass}
                  value={form.booth}
                  onChange={(e) => set("booth", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm">
                  Contact person name <span className="text-red-500">*</span>
                </label>
                <input
                  className={fieldClass}
                  value={form.contactName}
                  onChange={(e) => set("contactName", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm">
                  Contact person mobile number{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  className={fieldClass}
                  value={form.contactMobile}
                  onChange={(e) => set("contactMobile", e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm">
                Order notes <span className="text-[#888]">(optional)</span>
              </label>
              <textarea
                rows={4}
                className={fieldClass}
                placeholder="Notes about your order, e.g. special notes for delivery."
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
            </div>
          </div>
        </div>

        <aside className="h-fit">
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wide">
              Your Order
            </h2>
            <div className="mt-4 space-y-3 border-t border-[#eee] pt-4 text-sm">
              {cart.map((line) => (
                <div key={line.id} className="border-b border-[#eee] pb-3">
                  <div className="flex justify-between gap-2">
                    <p className="font-medium">
                      {line.title}
                      {line.variantLabel ? ` - ${line.variantLabel}` : ""} ×{" "}
                      {line.quantity}
                    </p>
                    <p>{formatMoney(line.unitPrice * line.quantity)}</p>
                  </div>
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
              ))}
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipment</span>
                <span>Booth Delivery</span>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span style={{ color: BRAND.primary }}>
                  {formatMoney(subtotal)}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <p className="flex items-center gap-2 text-sm font-medium">
                <CreditCard className="h-4 w-4" />
                Credit / Debit Card
              </p>
              <div className="mt-3 space-y-3 rounded border border-[#ddd] p-3">
                <input
                  className={fieldClass}
                  placeholder="1234 1234 1234 1234"
                  value={form.cardNumber}
                  onChange={(e) => set("cardNumber", e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className={fieldClass}
                    placeholder="MM / YY"
                    value={form.expiry}
                    onChange={(e) => set("expiry", e.target.value)}
                  />
                  <input
                    className={fieldClass}
                    placeholder="CVC"
                    value={form.cvc}
                    onChange={(e) => set("cvc", e.target.value)}
                  />
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[#666]">
                Your personal data will be used to process your order, support
                your experience throughout this website, and for other purposes
                described in our{" "}
                <span
                  className="font-semibold"
                  style={{ color: BRAND.primary }}
                >
                  privacy policy
                </span>
                .
              </p>
              {error && (
                <p className="mt-3 text-sm text-red-600">{error}</p>
              )}
              <button
                type="submit"
                className="mt-4 w-full rounded py-3 text-sm font-semibold uppercase tracking-wide text-white"
                style={{ backgroundColor: BRAND.primary }}
              >
                Place Order
              </button>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
