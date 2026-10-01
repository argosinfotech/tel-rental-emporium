import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import {
  RequireStoreEvent,
  useStoreContext,
} from "@/components/event-store/StoreShell";
import { BRAND } from "@/lib/brand";
import {
  addToCart,
  formatMoney,
  type StoreCartLine,
} from "@/lib/event-store-session";
import {
  eventRentalDayCount,
  formatEventDateRange,
  formatLongDate,
} from "@/lib/mock-events";
import { getStoreProduct } from "@/lib/mock-store-products";

export const Route = createFileRoute("/store/shop/$productId")({
  head: ({ params }) => {
    const product = getStoreProduct(params.productId);
    return {
      meta: [
        {
          title: `${product?.title ?? "Product"} — TEL Events Store`,
        },
      ],
    };
  },
  component: () => (
    <RequireStoreEvent>
      <ProductDetailPage />
    </RequireStoreEvent>
  ),
});

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const product = getStoreProduct(productId);
  const { event, refreshCart, openCart } = useStoreContext();
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);

  const unitPrice = useMemo(() => {
    if (!product) return 0;
    if (product.variants.length && size) {
      return (
        product.variants.find((v) => v.label === size)?.price ??
        product.priceFrom
      );
    }
    return product.priceFrom;
  }, [product, size]);

  const days = eventRentalDayCount(event);
  const dateRangeDisplay = `${formatDisplaySlash(event.fromDate)} - ${formatDisplaySlash(event.toDate)}`;

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Link
          to="/store/shop"
          className="mt-4 inline-block text-sm underline"
          style={{ color: BRAND.primary }}
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const needsSize = product.variants.length > 0;
  const canAdd = !needsSize || !!size;

  const onAdd = () => {
    if (!canAdd) return;
    const payload: Omit<StoreCartLine, "id"> = {
      productId: product.id,
      title: product.title,
      unitPrice,
      quantity: qty,
    };
    if (size) {
      payload.variantLabel = size;
    }
    addToCart(payload);
    refreshCart();
    openCart();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div
            className="relative aspect-square w-full rounded border border-[#eee]"
            style={{ backgroundColor: product.imageColor }}
          />
          <div
            className="mt-3 h-20 w-20 rounded border border-[#eee]"
            style={{ backgroundColor: product.imageColor }}
          />
        </div>

        <div>
          <p className="text-xs text-[#888]">
            <Link to="/store/home" className="hover:underline">
              Home
            </Link>
            {" / "}
            <Link to="/store/shop" className="hover:underline">
              {product.category}
            </Link>
            {" / "}
            <span>{product.title}</span>
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[#1a1a1a]">
            {product.title}
          </h1>
          <p className="mt-2 text-lg font-medium" style={{ color: BRAND.primary }}>
            {product.priceLabel} {formatMoney(product.priceFrom)}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#555]">
            {product.description}
          </p>

          {needsSize && (
            <div className="mt-5">
              <label className="text-sm font-medium">
                Size:{" "}
                {size && (
                  <button
                    type="button"
                    className="ml-2 text-xs underline"
                    style={{ color: BRAND.primary }}
                    onClick={() => setSize("")}
                  >
                    Clear
                  </button>
                )}
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="mt-1.5 w-full rounded border border-[#ddd] px-3 py-2 text-sm"
              >
                <option value="">Choose an option</option>
                {product.variants.map((v) => (
                  <option key={v.label} value={v.label}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mt-5 rounded border border-[#e5e5e5] border-l-4 bg-[#f7f5f0] px-4 py-3 text-sm text-[#444]"
            style={{ borderLeftColor: BRAND.primary }}
          >
            Rental dates {formatEventDateRange(event)}. Locked to{" "}
            {event.eventName}. To use a different event, enter a new event code.
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium">Rental dates</label>
            <input
              readOnly
              value={dateRangeDisplay}
              className="mt-1.5 w-full rounded border border-[#ddd] bg-white px-3 py-2 text-sm"
            />
          </div>

          <div className="mt-4 flex items-start gap-3 rounded px-4 py-3 text-white"
            style={{ backgroundColor: "#c4a035" }}
          >
            <Info className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">
                Total: {formatMoney(unitPrice * qty)} ({days} day
                {days === 1 ? "" : "s"})
              </p>
              <p className="text-sm text-white/90">
                Rental return within 3 days
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex items-center overflow-hidden rounded border border-[#ddd]">
              <button
                type="button"
                className="px-3 py-2 text-sm"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <input
                type="text"
                readOnly
                value={qty}
                className="w-12 border-x border-[#ddd] py-2 text-center text-sm"
              />
              <button
                type="button"
                className="px-3 py-2 text-sm"
                onClick={() => setQty((q) => q + 1)}
              >
                +
              </button>
            </div>
            <button
              type="button"
              disabled={!canAdd}
              onClick={onAdd}
              className="rounded px-8 py-2.5 text-sm font-semibold uppercase tracking-wide text-white disabled:opacity-50"
              style={{ backgroundColor: BRAND.primary }}
            >
              Add to Cart
            </button>
          </div>

          <div className="mt-4 space-y-1 text-sm text-[#555]">
            <p>
              SKU: <span className="text-[#1a1a1a]">{product.sku}</span>
            </p>
            <p>
              Category:{" "}
              <Link
                to="/store/shop"
                className="underline"
                style={{ color: BRAND.primary }}
              >
                {product.category}
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex justify-center">
          <div className="text-center">
            <div
              className="mx-auto mb-2 h-0.5 w-12"
              style={{ backgroundColor: BRAND.primary }}
            />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#1a1a1a]">
              Additional Information
            </h2>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-2xl overflow-hidden rounded border border-[#eee]">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-[#eee]">
                <th className="w-40 bg-[#fafafa] px-4 py-3 text-left font-medium">
                  Dimensions
                </th>
                <td className="px-4 py-3 text-[#555]">{product.dimensions}</td>
              </tr>
              {product.sizes.length > 0 && (
                <tr>
                  <th className="bg-[#fafafa] px-4 py-3 text-left font-medium align-top">
                    Size
                  </th>
                  <td className="px-4 py-3 text-[#555]">
                    {product.sizes.join(", ")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function formatDisplaySlash(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return formatLongDate(iso);
  return `${m}/${d}/${y}`;
}
