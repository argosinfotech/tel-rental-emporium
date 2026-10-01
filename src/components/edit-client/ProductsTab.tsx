import { ImageIcon } from "lucide-react";
import { useMemo, useState } from "react";
import type {
  Brand,
  Category,
  Product,
} from "@/components/edit-client/mock-client";
import {
  ActionIconGroup,
  DeleteIconButton,
  EditIconButton,
} from "@/components/edit-client/ActionIcons";
import {
  FieldLabel,
  FormInput,
  FormSelect,
  PrimaryButton,
  SearchToolbar,
  TableHeaderCell,
  TealTableHead,
} from "@/components/edit-client/SearchToolbar";
import { BRAND } from "@/lib/brand";

type ProductsTabProps = {
  products: Product[];
  brands: Brand[];
  categories: Category[];
  onChange: (next: Product[]) => void;
};

const emptyProduct = (): Omit<Product, "id"> => ({
  itemNumber: "",
  itemName: "",
  brand: "",
  category: "",
  description1: "",
  description2: "",
  weight: "",
  availableStock: "0",
  thresholdQty: "",
  imageUrl: "",
  vendorName: "",
  categoryName: "",
  retailPrice: "",
  costPrice: "0",
  openingStock: "",
  availableForRent: false,
  rentalPrice: "",
});

function sanitizeDecimal(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length <= 1) return cleaned;
  return `${parts[0]}.${parts.slice(1).join("").slice(0, 2)}`;
}

function toForm(product: Product): Omit<Product, "id"> {
  const { id: _id, ...rest } = product;
  return rest;
}

export function ProductsTab({
  products,
  brands,
  categories,
  onChange,
}: ProductsTabProps) {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProduct());

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.itemNumber, p.itemName, p.brand, p.category, p.description1]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [products, search]);

  const set = <K extends keyof ReturnType<typeof emptyProduct>>(
    key: K,
    v: ReturnType<typeof emptyProduct>[K],
  ) => setForm((f) => ({ ...f, [key]: v }));

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyProduct());
    setMode("form");
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setForm(toForm(product));
    setMode("form");
  };

  const cancelForm = () => {
    setEditingId(null);
    setForm(emptyProduct());
    setMode("list");
  };

  const save = () => {
    if (!form.itemNumber.trim() || !form.itemName.trim()) return;
    if (form.availableForRent && !form.rentalPrice.trim()) return;
    if (editingId) {
      onChange(
        products.map((p) =>
          p.id === editingId
            ? {
                ...p,
                ...form,
                availableStock: form.availableStock || form.openingStock,
              }
            : p,
        ),
      );
    } else {
      onChange([
        ...products,
        {
          id: `pr-${Date.now()}`,
          ...form,
          availableStock: form.openingStock || form.availableStock,
        },
      ]);
    }
    cancelForm();
  };

  if (mode === "form") {
    return (
      <div className="p-6">
        <h2
          className="mb-4 text-base font-semibold"
          style={{ color: BRAND.primary }}
        >
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="md:col-span-6">
            <FieldLabel>Brand</FieldLabel>
            <FormSelect
              value={form.brand}
              onChange={(e) => set("brand", e.target.value)}
            >
              <option value="">Select</option>
              {brands.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </FormSelect>
          </div>
          <div className="md:col-span-6">
            <FieldLabel>Category</FieldLabel>
            <FormSelect
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              <option value="">Select</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </FormSelect>
          </div>
          <div className="md:col-span-6">
            <FieldLabel required>Item Number</FieldLabel>
            <FormInput
              value={form.itemNumber}
              onChange={(e) => set("itemNumber", e.target.value)}
            />
          </div>
          <div className="md:col-span-6">
            <FieldLabel required>Item Name</FieldLabel>
            <FormInput
              value={form.itemName}
              onChange={(e) => set("itemName", e.target.value)}
            />
          </div>
          <div className="md:col-span-6">
            <FieldLabel>Vendor Name</FieldLabel>
            <FormInput
              value={form.vendorName}
              onChange={(e) => set("vendorName", e.target.value)}
            />
          </div>
          <div className="md:col-span-6">
            <FieldLabel>Category Name</FieldLabel>
            <FormInput
              value={form.categoryName}
              onChange={(e) => set("categoryName", e.target.value)}
            />
          </div>
          <div className="md:col-span-6">
            <FieldLabel>Description 1</FieldLabel>
            <FormInput
              value={form.description1}
              onChange={(e) => set("description1", e.target.value)}
            />
          </div>
          <div className="md:col-span-6">
            <FieldLabel>Description 2</FieldLabel>
            <FormInput
              value={form.description2}
              onChange={(e) => set("description2", e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <FieldLabel required>Weight (LBS)</FieldLabel>
            <FormInput
              value={form.weight}
              onChange={(e) => set("weight", e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <FieldLabel required>Retail Price</FieldLabel>
            <FormInput
              value={form.retailPrice}
              onChange={(e) => set("retailPrice", e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <FieldLabel required>Cost Price</FieldLabel>
            <FormInput
              value={form.costPrice}
              onChange={(e) => set("costPrice", e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <FieldLabel required>Threshold Quantity</FieldLabel>
            <FormInput
              value={form.thresholdQty}
              onChange={(e) => set("thresholdQty", e.target.value)}
            />
          </div>
          <div className="md:col-span-4">
            <FieldLabel required>Opening Stock</FieldLabel>
            <FormInput
              value={form.openingStock}
              onChange={(e) => set("openingStock", e.target.value)}
            />
          </div>
          <div className="md:col-span-4">
            <FieldLabel>Available Stock</FieldLabel>
            <FormInput value={form.availableStock} disabled />
          </div>
          <div className="md:col-span-4">
            <FieldLabel>Item Image</FieldLabel>
            <FormInput type="file" accept="image/*" />
          </div>
          <div className="md:col-span-4 flex items-end pb-2">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
              <input
                type="checkbox"
                checked={form.availableForRent}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setForm((f) => ({
                    ...f,
                    availableForRent: checked,
                    rentalPrice: checked ? f.rentalPrice : "",
                  }));
                }}
                className="h-4 w-4 rounded border-input"
                style={{ accentColor: BRAND.primary }}
              />
              Is Available for Rent?
            </label>
          </div>
          {form.availableForRent && (
            <div className="md:col-span-4">
              <FieldLabel required>Rental Price</FieldLabel>
              <FormInput
                inputMode="decimal"
                value={form.rentalPrice}
                placeholder="0.00"
                onChange={(e) =>
                  set("rentalPrice", sanitizeDecimal(e.target.value))
                }
              />
            </div>
          )}
        </div>
        <div className="mt-6 flex gap-2">
          <PrimaryButton onClick={save}>Save</PrimaryButton>
          <PrimaryButton onClick={cancelForm}>Cancel</PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SearchToolbar
        search={search}
        onSearchChange={setSearch}
        actions={
          <>
            <PrimaryButton onClick={() => undefined}>
              Export Products
            </PrimaryButton>
            <PrimaryButton onClick={() => undefined}>
              Import Products
            </PrimaryButton>
            <PrimaryButton onClick={openAdd}>Add New Products</PrimaryButton>
          </>
        }
      />
      <div className="overflow-x-auto px-6 pb-6">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <TealTableHead>
            <TableHeaderCell>Item Number</TableHeaderCell>
            <TableHeaderCell>Item Name</TableHeaderCell>
            <TableHeaderCell>Description</TableHeaderCell>
            <TableHeaderCell>Available Stock</TableHeaderCell>
            <TableHeaderCell>Threshold Qty</TableHeaderCell>
            <TableHeaderCell>Item Image</TableHeaderCell>
            <TableHeaderCell>Action</TableHeaderCell>
          </TealTableHead>
          <tbody>
            {filtered.map((p, idx) => (
              <tr
                key={p.id}
                className={`border-t border-border ${
                  idx % 2 === 1 ? "bg-muted/30" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => openEdit(p)}
                    className="hover:underline"
                    style={{ color: BRAND.primary }}
                  >
                    {p.itemNumber}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => openEdit(p)}
                    className="hover:underline"
                    style={{ color: BRAND.primary }}
                  >
                    {p.itemName}
                  </button>
                </td>
                <td className="px-4 py-3 text-[#495057]">{p.description1}</td>
                <td className="px-4 py-3 text-[#495057]">{p.availableStock}</td>
                <td className="px-4 py-3 text-[#495057]">{p.thresholdQty}</td>
                <td className="px-4 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded border border-border bg-muted">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <ActionIconGroup>
                    <EditIconButton
                      label={`Edit ${p.itemName}`}
                      onClick={() => openEdit(p)}
                    />
                    <DeleteIconButton
                      label={`Delete ${p.itemName}`}
                      onClick={() =>
                        onChange(products.filter((x) => x.id !== p.id))
                      }
                    />
                  </ActionIconGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
