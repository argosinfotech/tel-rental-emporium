import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Info,
  LayoutGrid,
  X,
} from "lucide-react";
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
import {
  getStoreProduct,
  STORE_PRODUCTS,
} from "@/lib/mock-store-products";

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
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const productIndex = STORE_PRODUCTS.findIndex((p) => p.id === productId);
  const prevProduct =
    productIndex > 0 ? STORE_PRODUCTS[productIndex - 1] : undefined;
  const nextProduct =
    productIndex >= 0 && productIndex < STORE_PRODUCTS.length - 1
      ? STORE_PRODUCTS[productIndex + 1]
      : undefined;

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
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <div
            className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-white p-4"
            style={{ backgroundColor: "#fafafa" }}
          >
            <img
              src={product.imageSrc}
              alt={product.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="mt-3">
            <button
              type="button"
              aria-label="Expand image"
              onClick={() => setLightboxOpen(true)}
              className="flex h-12 w-12 items-center justify-center border border-[#e5e5e5] bg-white text-[#888] transition-colors hover:border-[#ccc] hover:text-[#1a1a1a]"
            >
              <Expand className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-start justify-between gap-3">
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
            <div className="flex items-center gap-1 text-[#555]">
              {prevProduct ? (
                <Link
                  to="/store/shop/$productId"
                  params={{ productId: prevProduct.id }}
                  aria-label="Previous product"
                  className="rounded p-1.5 hover:bg-[#f3f3f3]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              ) : (
                <span className="rounded p-1.5 opacity-30">
                  <ChevronLeft className="h-4 w-4" />
                </span>
              )}
              <Link
                to="/store/shop"
                aria-label="Back to shop"
                className="rounded p-1.5 hover:bg-[#f3f3f3]"
              >
                <LayoutGrid className="h-4 w-4" />
              </Link>
              {nextProduct ? (
                <Link
                  to="/store/shop/$productId"
                  params={{ productId: nextProduct.id }}
                  aria-label="Next product"
                  className="rounded p-1.5 hover:bg-[#f3f3f3]"
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <span className="rounded p-1.5 opacity-30">
                  <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </div>
          </div>

          <h1 className="mt-3 text-3xl font-bold text-[#1a1a1a]">
            {product.title}
          </h1>
          <p
            className="mt-2 text-lg font-medium"
            style={{ color: BRAND.primary }}
          >
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
                className="mt-1.5 w-full border border-[#ddd] bg-white px-3 py-2 text-sm"
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

          <div
            className="mt-5 border border-[#e8e0d5] border-l-4 bg-[#f7f5f0] px-4 py-3 text-sm leading-relaxed text-[#444]"
            style={{ borderLeftColor: BRAND.primary }}
          >
            <p>Rental dates {formatEventDateRange(event)}.</p>
            <p>
              Locked to {event.eventName}. To use a different event, enter a new
              event code.
            </p>
          </div>

          <div className="mt-4">
            <label className="text-sm font-semibold text-[#1a1a1a]">
              Rental dates
            </label>
            <input
              readOnly
              value={dateRangeDisplay}
              className="mt-1.5 w-full border border-[#ddd] bg-white px-3 py-2.5 text-sm"
            />
          </div>

          <div
            className="mt-4 flex items-start gap-3 px-4 py-3.5 text-white"
            style={{ backgroundColor: "#c4a035" }}
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/80">
              <Info className="h-3.5 w-3.5" />
            </span>
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
            <div className="flex items-center overflow-hidden border border-[#ddd] bg-white">
              <button
                type="button"
                className="px-3 py-2.5 text-sm hover:bg-[#f7f7f7]"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <input
                type="text"
                readOnly
                value={qty}
                className="w-12 border-x border-[#ddd] py-2.5 text-center text-sm"
              />
              <button
                type="button"
                className="px-3 py-2.5 text-sm hover:bg-[#f7f7f7]"
                onClick={() => setQty((q) => q + 1)}
              >
                +
              </button>
            </div>
            <button
              type="button"
              disabled={!canAdd}
              onClick={onAdd}
              className="px-8 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: BRAND.primary }}
            >
              Add to Cart
            </button>
          </div>

          <p className="mt-5 text-sm text-[#555]">
            Categories:{" "}
            <Link
              to="/store/shop"
              className="hover:underline"
              style={{ color: BRAND.primary }}
            >
              {product.category}
            </Link>
            {product.sku !== "N/A" ? (
              <>
                <span className="mx-2 text-[#ccc]">|</span>
                <span>
                  SKU: <span className="text-[#1a1a1a]">{product.sku}</span>
                </span>
              </>
            ) : null}
          </p>
        </div>
      </div>

      <div className="mt-12 border-t border-[#eee] pt-12">
        <div className="text-center">
          <div
            className="mx-auto mb-3 h-0.5 w-10"
            style={{ backgroundColor: BRAND.primary }}
          />
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1a1a1a]">
            Additional Information
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-3xl space-y-4">
          <div className="flex items-baseline justify-between gap-8 text-sm">
            <span className="shrink-0 font-medium text-[#555]">Dimensions</span>
            <span className="text-right text-[#555]">{product.dimensions}</span>
          </div>
          {product.sizes.length > 0 && (
            <div className="flex items-baseline justify-between gap-8 text-sm">
              <span className="shrink-0 font-medium text-[#555]">Size</span>
              <span className="text-right text-[#555]">
                {product.sizes.join(", ")}
              </span>
            </div>
          )}
        </div>
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Product image"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={product.imageSrc}
            alt={product.title}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

function formatDisplaySlash(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return formatLongDate(iso);
  return `${m}/${d}/${y}`;
}
