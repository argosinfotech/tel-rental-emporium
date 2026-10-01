import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { BRAND } from "@/lib/brand";
import { clearCart, setSelectedEventId } from "@/lib/event-store-session";
import { getLiveEventByCode } from "@/lib/mock-events";

export const Route = createFileRoute("/store/")({
  head: () => ({
    meta: [
      { title: `TEL Events Store — ${BRAND.name}` },
      {
        name: "description",
        content: "Enter your event code to access the TEL Events Store.",
      },
    ],
  }),
  component: StoreGatePage,
});

function StoreGatePage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const event = getLiveEventByCode(code);
    if (!event) {
      setError(
        "Invalid or inactive event code. Use a Live event code from Event Management.",
      );
      return;
    }
    clearCart();
    setSelectedEventId(event.id);
    setError("");
    void navigate({ to: "/store/event" });
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#1a1a1a] px-4">
      <div
        className="absolute inset-0 opacity-40 blur-sm"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #0b8a7a 0%, #1a1a1a 50%, #333 100%)",
        }}
      />
      <div className="relative z-10 w-full max-w-lg rounded-lg bg-white px-8 py-10 shadow-2xl sm:px-12">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-[#888]">
          TEL Events Store
        </p>
        <h1 className="mt-3 text-center text-2xl font-bold tracking-tight text-[#1a1a1a] sm:text-3xl">
          Enter your event code
        </h1>
        <p className="mt-3 text-center text-sm leading-relaxed text-[#666]">
          This store is available to event exhibitors only. Enter the event code
          you were given to continue shopping.
        </p>
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError("");
              }}
              placeholder="EVENT CODE"
              maxLength={50}
              className="flex-1 rounded-md border border-[#ccc] px-4 py-3 text-sm uppercase tracking-wide placeholder:normal-case placeholder:tracking-normal placeholder:text-[#999] focus:border-[#0b8a7a] focus:outline-none focus:ring-2 focus:ring-[#0b8a7a]/20"
            />
            <button
              type="submit"
              className="rounded-md bg-[#d8d8d8] px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#1a1a1a] transition-colors hover:bg-[#c8c8c8]"
            >
              Continue to Shop
            </button>
          </div>
          {error && (
            <p className="mt-3 text-center text-sm text-red-600">{error}</p>
          )}
        </form>
        <p className="mt-6 text-center text-xs text-[#999]">
          Demo Live codes: ECU2026, STS2026
        </p>
      </div>
    </div>
  );
}
