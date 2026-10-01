import { getEvent, type InventoryEvent } from "@/lib/mock-events";

const EVENT_KEY = "tel-event-store-event-id";
const CART_KEY = "tel-event-store-cart";

export type StoreCartLine = {
  id: string;
  productId: string;
  title: string;
  variantLabel?: string;
  unitPrice: number;
  quantity: number;
  image?: string;
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function getSelectedEventId(): string | null {
  if (!canUseStorage()) return null;
  return localStorage.getItem(EVENT_KEY);
}

export function getSelectedEvent(): InventoryEvent | null {
  const id = getSelectedEventId();
  if (!id) return null;
  return getEvent(id) ?? null;
}

export function setSelectedEventId(id: string): void {
  if (!canUseStorage()) return;
  localStorage.setItem(EVENT_KEY, id);
}

export function clearSelectedEvent(): void {
  if (!canUseStorage()) return;
  localStorage.removeItem(EVENT_KEY);
}

export function getCart(): StoreCartLine[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoreCartLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setCart(lines: StoreCartLine[]): void {
  if (!canUseStorage()) return;
  localStorage.setItem(CART_KEY, JSON.stringify(lines));
}

export function clearCart(): void {
  if (!canUseStorage()) return;
  localStorage.removeItem(CART_KEY);
}

export function clearStoreSession(): void {
  clearSelectedEvent();
  clearCart();
}

export function cartItemCount(lines: StoreCartLine[] = getCart()): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function cartSubtotal(lines: StoreCartLine[] = getCart()): number {
  return lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
}

export function addToCart(line: Omit<StoreCartLine, "id">): StoreCartLine[] {
  const cart = getCart();
  const existing = cart.find(
    (c) =>
      c.productId === line.productId &&
      (c.variantLabel ?? "") === (line.variantLabel ?? ""),
  );
  let next: StoreCartLine[];
  if (existing) {
    next = cart.map((c) =>
      c.id === existing.id
        ? { ...c, quantity: c.quantity + line.quantity }
        : c,
    );
  } else {
    next = [
      ...cart,
      {
        ...line,
        id: `${line.productId}-${line.variantLabel ?? "default"}-${Date.now()}`,
      },
    ];
  }
  setCart(next);
  return next;
}

export function updateCartQuantity(lineId: string, quantity: number): StoreCartLine[] {
  const next =
    quantity <= 0
      ? getCart().filter((c) => c.id !== lineId)
      : getCart().map((c) => (c.id === lineId ? { ...c, quantity } : c));
  setCart(next);
  return next;
}

export function removeFromCart(lineId: string): StoreCartLine[] {
  const next = getCart().filter((c) => c.id !== lineId);
  setCart(next);
  return next;
}

export function formatMoney(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
