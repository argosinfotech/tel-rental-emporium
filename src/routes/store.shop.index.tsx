import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Columns2, Columns3, LayoutGrid } from "lucide-react";
import { RequireStoreEvent } from "@/components/event-store/StoreShell";
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

type ColumnCount = 2 | 3 | 4;

function ShopPage() {
  const [pageSize, setPageSize] = useState(9);
  const [sort, setSort] = useState("default");
  const [columns, setColumns] = useState<ColumnCount>(4);

  const products = useMemo(() => {
    const list = [...STORE_PRODUCTS];
    if (sort === "price-asc") list.sort((a, b) => a.priceFrom - b.priceFrom);
    if (sort === "price-desc") list.sort((a, b) => b.priceFrom - a.priceFrom);
    if (sort === "name") list.sort((a, b) => a.title.localeCompare(b.title));
    return list.slice(0, pageSize);
  }, [pageSize, sort]);

  const gridClass =
    columns === 2
      ? "mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2"
      : columns === 3
        ? "mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        : "mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4";

  const columnButtons: {
    value: ColumnCount;
    label: string;
    icon: typeof Columns2;
  }[] = [
    { value: 2, label: "2 columns", icon: Columns2 },
    { value: 3, label: "3 columns", icon: Columns3 },
    { value: 4, label: "4 columns", icon: LayoutGrid },
  ];

  return (
    <div>
      <div className="bg-black py-12 text-center sm:py-16">
        <h1 className="text-[2.75rem] font-normal leading-none tracking-tight text-white [font-family:'Playfair_Display',Georgia,serif] sm:text-5xl">
          Shop
        </h1>
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
                    pageSize === n
                      ? "font-semibold"
                      : "text-[#888] hover:text-[#1a1a1a]"
                  }
                  style={pageSize === n ? { color: BRAND.primary } : undefined}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              {columnButtons.map(({ value, label, icon: Icon }) => {
                const active = columns === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-label={label}
                    aria-pressed={active}
                    onClick={() => setColumns(value)}
                    className="rounded p-1 text-[#888] hover:text-[#1a1a1a]"
                    style={active ? { color: BRAND.primary } : undefined}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })}
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

        <div className={gridClass}>
          {products.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col overflow-hidden border border-[#eee] bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d8d8d8] hover:shadow-md"
            >
              <div
                className="flex aspect-square items-center justify-center overflow-hidden p-4"
                style={{ backgroundColor: product.imageColor }}
              >
                <img
                  src={product.imageSrc}
                  alt={product.title}
                  className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
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
                  className="mt-4 block w-full py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:opacity-90"
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
