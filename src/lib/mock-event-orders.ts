export type EventOrderStatus =
  | "New"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Completed"
  | "Cancelled";

export const EVENT_ORDER_STATUSES: EventOrderStatus[] = [
  "New",
  "Processing",
  "Shipped",
  "Delivered",
  "Completed",
  "Cancelled",
];

export type EventOrderLine = {
  id: string;
  productTitle: string;
  variantLabel: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type EventOrderBilling = {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  stateCode: string;
  zip: string;
  email: string;
  phone: string;
};

export type EventOrder = {
  id: string;
  orderNo: string;
  orderDate: string;
  eventId: string;
  eventName: string;
  eventCode: string;
  contactName: string;
  contactEmail: string;
  booth: string;
  orderPlacedBy: string;
  shippingMethod: string;
  total: number;
  status: EventOrderStatus;
  rentFrom: string;
  rentTo: string;
  notes: string;
  trackingNo: string;
  trackingUrl: string;
  billing: EventOrderBilling;
  lines: EventOrderLine[];
};

let orders: EventOrder[] = [
  {
    id: "1",
    orderNo: "EVT-10021",
    orderDate: "2026-10-01T14:30:00",
    eventId: "3",
    eventName: "CareFlite's ECU Conference 2026",
    eventCode: "ECU2026",
    contactName: "Jamie Torres",
    contactEmail: "jamie.torres@example.com",
    booth: "Booth 214 / CareFlite Exhibits",
    orderPlacedBy: "Jamie Torres",
    shippingMethod: "Booth Delivery",
    total: 90,
    status: "New",
    rentFrom: "2026-10-29",
    rentTo: "2026-10-30",
    notes: "Deliver before 8 AM on setup day.",
    trackingNo: "",
    trackingUrl: "",
    billing: {
      firstName: "Jamie",
      lastName: "Torres",
      address1: "1200 Commerce St",
      address2: "Suite 400",
      city: "Dallas",
      stateCode: "TX",
      zip: "75201",
      email: "jamie.torres@example.com",
      phone: "(214) 555-0198",
    },
    lines: [
      {
        id: "1a",
        productTitle: "Assorted Bi-Fold Tables",
        variantLabel: "4-Foot Rectangular Table",
        quantity: 2,
        unitPrice: 45,
        lineTotal: 90,
      },
    ],
  },
  {
    id: "2",
    orderNo: "EVT-10022",
    orderDate: "2026-09-28T09:15:00",
    eventId: "1",
    eventName: "Summer Tech Showcase",
    eventCode: "STS2026",
    contactName: "Riley Chen",
    contactEmail: "riley.chen@example.com",
    booth: "Booth A12 / North Hall",
    orderPlacedBy: "Riley Chen",
    shippingMethod: "Booth Delivery",
    total: 385,
    status: "New",
    rentFrom: "2026-06-01",
    rentTo: "2026-06-05",
    notes: "",
    trackingNo: "",
    trackingUrl: "",
    billing: {
      firstName: "Riley",
      lastName: "Chen",
      address1: "88 Innovation Way",
      address2: "",
      city: "Austin",
      stateCode: "TX",
      zip: "78701",
      email: "riley.chen@example.com",
      phone: "(512) 555-0142",
    },
    lines: [
      {
        id: "2a",
        productTitle: "3×3 White Cube Display Shelf",
        variantLabel: "",
        quantity: 1,
        unitPrice: 300,
        lineTotal: 300,
      },
      {
        id: "2b",
        productTitle: "Chrome Cocktail Table",
        variantLabel: "",
        quantity: 1,
        unitPrice: 75,
        lineTotal: 75,
      },
      {
        id: "2c",
        productTitle: "White Folding Chair",
        variantLabel: "",
        quantity: 1,
        unitPrice: 10,
        lineTotal: 10,
      },
    ],
  },
];

export function listNewOrders(): EventOrder[] {
  return orders.filter((o) => o.status === "New");
}

export function listEventOrders(): EventOrder[] {
  return [...orders];
}

export function getEventOrder(id: string): EventOrder | undefined {
  return orders.find((o) => o.id === id);
}

export function updateOrderStatus(
  id: string,
  status: EventOrderStatus,
  tracking?: { trackingNo?: string; trackingUrl?: string },
): EventOrder | undefined {
  const index = orders.findIndex((o) => o.id === id);
  if (index < 0) return undefined;
  const current = orders[index];
  if (!current) return undefined;
  const updated: EventOrder = {
    ...current,
    status,
    trackingNo:
      status === "Shipped"
        ? (tracking?.trackingNo ?? current.trackingNo).trim()
        : current.trackingNo,
    trackingUrl:
      status === "Shipped"
        ? (tracking?.trackingUrl ?? current.trackingUrl).trim()
        : current.trackingUrl,
  };
  orders = [...orders.slice(0, index), updated, ...orders.slice(index + 1)];
  return updated;
}

export function formatOrderMoney(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatOrderDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatOrderDate(iso: string): string {
  const d = new Date(iso.includes("T") ? iso : `${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
