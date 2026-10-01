import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, LayoutGrid } from "lucide-react";
import {
  RequireStoreEvent,
} from "@/components/event-store/StoreShell";
import { BRAND } from "@/lib/brand";
import { formatMoney } from "@/lib/event-store-session";
import { STORE_PRODUCTS } from "@/lib/mock-store-products";

export const Route = createFileRoute("/store/shop/")({
  head: () => ({
    meta: [{ title: `Shop — TEL Events Store` }],
  }),
  component: () => (
    <RequireStoreEvent>
      <ShopPage />
    </RequireStoreEvent>
  ),
});

function ShopPage() {
  const [pageSize, setPageSize] = useState(9);
  const [sort, setSort] = useState("default");

  const products = useMemo(() => {
    const list = [...STORE_PRODUCTS];
    if (sort === "price-asc") list.sort((a, b) => a.priceFrom - b.priceFrom);
    if (sort === "price-desc") list.sort((a, b) => b.priceFrom - a.priceFrom);
    if (sort === "name") list.sort((a, b) => a.title.localeCompare(b.title));
    return list.slice(0, pageSize);
  }, [pageSize, sort]);

  return (
    <div>
      <div className="bg-black py-10 text-center">
        <h1 className="text-4xl font-light text-white">Shop</h1>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eee] pb-4 text-sm text-[#555]">
          <p>
            <Link to="/store/home" className="hover:underline">
              Home
            </Link>
            {" / "}
            <span className="text-[#1a1a1a]">Shop</span>
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Show :</span>
              {[9, 12, 18, 24].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPageSize(n)}
                  className={
                    pageSize === n ? "font-semibold" : "text-[#888] hover:text-[#1a1a1a]"
                  }
                  style={pageSize === n ? { color: BRAND.primary } : undefined}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 text-[#888]">
              <LayoutGrid className="h-4 w-4" style={{ color: BRAND.primary }} />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded border border-[#ddd] bg-white px-3 py-1.5 text-sm"
            >
              <option value="default">Default sorting</option>
              <option value="name">Sort by name</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col overflow-hidden rounded border border-[#eee] bg-white"
            >
              <div
                className="aspect-square w-full"
                style={{ backgroundColor: product.imageColor }}
              />
              <div className="flex flex-1 flex-col p-4">
                <h2 className="text-sm font-bold text-[#1a1a1a]">
                  {product.title}
                </h2>
                {product.inStock && (
                  <p
                    className="mt-2 flex items-center gap-1 text-xs font-medium"
                    style={{ color: BRAND.primary }}
                  >
                    <Check className="h-3.5 w-3.5" />
                    In stock
                  </p>
                )}
                <p
                  className="mt-1 text-sm font-medium"
                  style={{ color: BRAND.primary }}
                >
                  {product.priceLabel} {formatMoney(product.priceFrom)}
                </p>
                <Link
                  to="/store/shop/$productId"
                  params={{ productId: product.id }}
                  className="mt-4 block w-full rounded py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-white"
                  style={{ backgroundColor: BRAND.primary }}
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
