import { Link } from "@tanstack/react-router";
import { BRAND } from "@/lib/brand";

type Step = "cart" | "checkout" | "complete";

const STEPS: { key: Step; label: string; to?: string }[] = [
  { key: "cart", label: "Shopping Cart", to: "/store/cart" },
  { key: "checkout", label: "Checkout", to: "/store/checkout" },
  { key: "complete", label: "Order Complete" },
];

export function CheckoutProgress({ current }: { current: Step }) {
  return (
    <div className="bg-[#1a1a1a] py-6 text-center text-sm uppercase tracking-wide text-white/70">
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {STEPS.map((step, i) => {
          const active = step.key === current;
          const content = (
            <span
              className={active ? "font-semibold underline underline-offset-4" : ""}
              style={active ? { color: BRAND.primary } : undefined}
            >
              {step.label}
            </span>
          );
          return (
            <span key={step.key} className="inline-flex items-center gap-2 sm:gap-3">
              {i > 0 && <span className="text-white/40">→</span>}
              {step.to && !active ? (
                <Link to={step.to} className="hover:text-white">
                  {content}
                </Link>
              ) : (
                content
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
