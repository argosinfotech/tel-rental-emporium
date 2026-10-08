import { listEventOrders, type EventOrder } from "@/lib/mock-event-orders";
import { STORE_PRODUCTS } from "@/lib/mock-store-products";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect fill="#e8eef2" width="80" height="80"/><text x="40" y="44" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="sans-serif">No image</text></svg>`,
  );

export type SheetLineItem = {
  id: string;
  name: string;
  quantity: number;
  imageSrc: string;
};

export type DeliveryBoothGroup = {
  booth: string;
  contactName: string;
  contactEmail: string;
  orderNos: string[];
  lines: SheetLineItem[];
};

function activeOrdersForEvent(eventId: string): EventOrder[] {
  return listEventOrders().filter(
    (o) => o.eventId === eventId && o.status !== "Cancelled",
  );
}

export function resolveProductImage(productTitle: string): string {
  const exact = STORE_PRODUCTS.find((p) => p.title === productTitle);
  if (exact) return exact.imageSrc;
  const lower = productTitle.toLowerCase();
  const fuzzy = STORE_PRODUCTS.find((p) => p.title.toLowerCase() === lower);
  return fuzzy?.imageSrc ?? PLACEHOLDER_IMAGE;
}

function lineDisplayName(productTitle: string, variantLabel: string): string {
  return variantLabel ? `${productTitle} — ${variantLabel}` : productTitle;
}

function lineKey(productTitle: string, variantLabel: string): string {
  return `${productTitle}::${variantLabel}`;
}

/** Aggregated pick lines for an event (non-cancelled orders). */
export function getPickSheetLines(eventId: string): SheetLineItem[] {
  const map = new Map<
    string,
    { name: string; quantity: number; imageSrc: string }
  >();

  for (const order of activeOrdersForEvent(eventId)) {
    for (const line of order.lines) {
      const key = lineKey(line.productTitle, line.variantLabel);
      const existing = map.get(key);
      if (existing) {
        existing.quantity += line.quantity;
      } else {
        map.set(key, {
          name: lineDisplayName(line.productTitle, line.variantLabel),
          quantity: line.quantity,
          imageSrc: resolveProductImage(line.productTitle),
        });
      }
    }
  }

  return Array.from(map.entries())
    .map(([id, value]) => ({ id, ...value }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Booth-grouped delivery lines for an event (non-cancelled orders). */
export function getDeliverySheetGroups(eventId: string): DeliveryBoothGroup[] {
  const groups = new Map<
    string,
    {
      booth: string;
      contactName: string;
      contactEmail: string;
      orderNos: Set<string>;
      lines: Map<string, SheetLineItem>;
    }
  >();

  for (const order of activeOrdersForEvent(eventId)) {
    const boothKey = order.booth.trim() || "Unassigned booth";
    let group = groups.get(boothKey);
    if (!group) {
      group = {
        booth: boothKey,
        contactName: order.contactName,
        contactEmail: order.contactEmail,
        orderNos: new Set(),
        lines: new Map(),
      };
      groups.set(boothKey, group);
    }
    group.orderNos.add(order.orderNo);

    for (const line of order.lines) {
      const key = lineKey(line.productTitle, line.variantLabel);
      const existing = group.lines.get(key);
      if (existing) {
        existing.quantity += line.quantity;
      } else {
        group.lines.set(key, {
          id: key,
          name: lineDisplayName(line.productTitle, line.variantLabel),
          quantity: line.quantity,
          imageSrc: resolveProductImage(line.productTitle),
        });
      }
    }
  }

  return Array.from(groups.values())
    .map((g) => ({
      booth: g.booth,
      contactName: g.contactName,
      contactEmail: g.contactEmail,
      orderNos: Array.from(g.orderNos).sort(),
      lines: Array.from(g.lines.values()).sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    }))
    .sort((a, b) => a.booth.localeCompare(b.booth));
}
