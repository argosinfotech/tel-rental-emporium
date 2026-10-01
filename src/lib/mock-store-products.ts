export type StoreProductVariant = {
  label: string;
  price: number;
};

export type StoreProduct = {
  id: string;
  title: string;
  category: string;
  sku: string;
  description: string;
  priceFrom: number;
  priceLabel: "Rent for" | "Rent from";
  inStock: boolean;
  dimensions: string;
  sizes: string[];
  variants: StoreProductVariant[];
  imageColor: string;
};

export const STORE_PRODUCTS: StoreProduct[] = [
  {
    id: "cube-shelf",
    title: "3×3 White Cube Display Shelf",
    category: "Furniture",
    sku: "CUBE-3X3",
    description:
      "Modular white cube display shelf ideal for booth product presentation.",
    priceFrom: 300,
    priceLabel: "Rent for",
    inStock: true,
    dimensions: "36 x 12 x 36 in",
    sizes: [],
    variants: [],
    imageColor: "#e8eef2",
  },
  {
    id: "bi-fold-tables",
    title: "Assorted Bi-Fold Tables",
    category: "Tables",
    sku: "N/A",
    description:
      "Sleek round cocktail table featuring a black tabletop and polished chrome pedestal base.",
    priceFrom: 45,
    priceLabel: "Rent from",
    inStock: true,
    dimensions: "48 x 30 x 29 in",
    sizes: [
      "4-Foot Rectangular Table",
      "6-Foot Rectangular Table",
      "8-Foot Rectangular Table",
      "6-Foot Round Table",
    ],
    variants: [
      { label: "4-Foot Rectangular Table", price: 45 },
      { label: "6-Foot Rectangular Table", price: 55 },
      { label: "8-Foot Rectangular Table", price: 65 },
      { label: "6-Foot Round Table", price: 50 },
    ],
    imageColor: "#f4f4f4",
  },
  {
    id: "folding-chair",
    title: "White Folding Chair",
    category: "Seating",
    sku: "CHAIR-WHT",
    description: "Lightweight white folding chair for exhibit seating.",
    priceFrom: 12,
    priceLabel: "Rent for",
    inStock: true,
    dimensions: "18 x 20 x 32 in",
    sizes: [],
    variants: [],
    imageColor: "#eef6f4",
  },
  {
    id: "cocktail-table",
    title: "Chrome Cocktail Table",
    category: "Tables",
    sku: "CT-CHR",
    description: "Round cocktail table with chrome base for networking areas.",
    priceFrom: 75,
    priceLabel: "Rent for",
    inStock: true,
    dimensions: "30 x 30 x 42 in",
    sizes: [],
    variants: [],
    imageColor: "#f0ece6",
  },
  {
    id: "literature-rack",
    title: "Acrylic Literature Rack",
    category: "Displays",
    sku: "LIT-ACR",
    description: "Clear acrylic multi-tier literature display rack.",
    priceFrom: 40,
    priceLabel: "Rent for",
    inStock: true,
    dimensions: "14 x 12 x 48 in",
    sizes: [],
    variants: [],
    imageColor: "#e9f0fa",
  },
  {
    id: "banner-stand",
    title: "Retractable Banner Stand",
    category: "Displays",
    sku: "BAN-RET",
    description: "Portable retractable banner stand for aisle visibility.",
    priceFrom: 85,
    priceLabel: "Rent for",
    inStock: true,
    dimensions: "33 x 11 x 83 in",
    sizes: [],
    variants: [],
    imageColor: "#f5eee8",
  },
];

export function getStoreProduct(id: string): StoreProduct | undefined {
  return STORE_PRODUCTS.find((p) => p.id === id);
}
