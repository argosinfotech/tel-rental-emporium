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

export type EventOrderStatusSlug =
  | "new"
  | "processing"
  | "shipped"
  | "delivered"
  | "completed"
  | "cancelled";

export const EVENT_ORDER_STATUS_SLUGS: EventOrderStatusSlug[] = [
  "new",
  "processing",
  "shipped",
  "delivered",
  "completed",
  "cancelled",
];

const STATUS_BY_SLUG: Record<EventOrderStatusSlug, EventOrderStatus> = {
  new: "New",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
};

const SLUG_BY_STATUS: Record<EventOrderStatus, EventOrderStatusSlug> = {
  New: "new",
  Processing: "processing",
  Shipped: "shipped",
  Delivered: "delivered",
  Completed: "completed",
  Cancelled: "cancelled",
};

export function isEventOrderStatusSlug(
  value: string,
): value is EventOrderStatusSlug {
  return (EVENT_ORDER_STATUS_SLUGS as string[]).includes(value);
}

export function statusFromSlug(slug: EventOrderStatusSlug): EventOrderStatus {
  return STATUS_BY_SLUG[slug];
}

export function slugFromStatus(status: EventOrderStatus): EventOrderStatusSlug {
  return SLUG_BY_STATUS[status];
}

export type EventOrderLine = {
  id: string;
  productTitle: string;
  variantLabel: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  /** Empty string means no return qty recorded yet. */
  returnQuantity: string;
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

function baseBilling(
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  city: string,
  zip: string,
): EventOrderBilling {
  return {
    firstName,
    lastName,
    address1: "1200 Commerce St",
    address2: "Suite 100",
    city,
    stateCode: "TX",
    zip,
    email,
    phone,
  };
}

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
    billing: baseBilling(
      "Jamie",
      "Torres",
      "jamie.torres@example.com",
      "(214) 555-0198",
      "Dallas",
      "75201",
    ),
    lines: [
      {
        id: "1a",
        productTitle: "Assorted Bi-Fold Tables",
        variantLabel: "4-Foot Rectangular Table",
        quantity: 2,
        unitPrice: 45,
        lineTotal: 90,
        returnQuantity: "",
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
    billing: baseBilling(
      "Riley",
      "Chen",
      "riley.chen@example.com",
      "(512) 555-0142",
      "Austin",
      "78701",
    ),
    lines: [
      {
        id: "2a",
        productTitle: "3×3 White Cube Display Shelf",
        variantLabel: "",
        quantity: 1,
        unitPrice: 300,
        lineTotal: 300,
        returnQuantity: "",
      },
      {
        id: "2b",
        productTitle: "Chrome Cocktail Table",
        variantLabel: "",
        quantity: 1,
        unitPrice: 75,
        lineTotal: 75,
        returnQuantity: "",
      },
      {
        id: "2c",
        productTitle: "White Folding Chair",
        variantLabel: "",
        quantity: 1,
        unitPrice: 10,
        lineTotal: 10,
        returnQuantity: "",
      },
    ],
  },
  {
    id: "3",
    orderNo: "EVT-10023",
    orderDate: "2026-09-20T11:00:00",
    eventId: "3",
    eventName: "CareFlite's ECU Conference 2026",
    eventCode: "ECU2026",
    contactName: "Morgan Blake",
    contactEmail: "morgan.blake@example.com",
    booth: "Booth 118",
    orderPlacedBy: "Morgan Blake",
    shippingMethod: "Booth Delivery",
    total: 150,
    status: "Processing",
    rentFrom: "2026-10-29",
    rentTo: "2026-10-30",
    notes: "Confirm booth access by Oct 28.",
    trackingNo: "",
    trackingUrl: "",
    billing: baseBilling(
      "Morgan",
      "Blake",
      "morgan.blake@example.com",
      "(214) 555-0110",
      "Irving",
      "75039",
    ),
    lines: [
      {
        id: "3a",
        productTitle: "Chrome Cocktail Table",
        variantLabel: "",
        quantity: 2,
        unitPrice: 75,
        lineTotal: 150,
        returnQuantity: "",
      },
    ],
  },
  {
    id: "4",
    orderNo: "EVT-10024",
    orderDate: "2026-09-15T16:45:00",
    eventId: "1",
    eventName: "Summer Tech Showcase",
    eventCode: "STS2026",
    contactName: "Casey Nguyen",
    contactEmail: "casey.nguyen@example.com",
    booth: "Booth B04",
    orderPlacedBy: "Casey Nguyen",
    shippingMethod: "Booth Delivery",
    total: 85,
    status: "Shipped",
    rentFrom: "2026-06-01",
    rentTo: "2026-06-05",
    notes: "",
    trackingNo: "1Z999AA10123456784",
    trackingUrl: "https://www.ups.com/track?tracknum=1Z999AA10123456784",
    billing: baseBilling(
      "Casey",
      "Nguyen",
      "casey.nguyen@example.com",
      "(512) 555-0177",
      "Austin",
      "78702",
    ),
    lines: [
      {
        id: "4a",
        productTitle: "Retractable Banner Stand",
        variantLabel: "",
        quantity: 1,
        unitPrice: 85,
        lineTotal: 85,
        returnQuantity: "",
      },
    ],
  },
  {
    id: "5",
    orderNo: "EVT-10025",
    orderDate: "2026-09-10T10:20:00",
    eventId: "3",
    eventName: "CareFlite's ECU Conference 2026",
    eventCode: "ECU2026",
    contactName: "Avery Quinn",
    contactEmail: "avery.quinn@example.com",
    booth: "Booth 301",
    orderPlacedBy: "Avery Quinn",
    shippingMethod: "Booth Delivery",
    total: 80,
    status: "Delivered",
    rentFrom: "2026-10-29",
    rentTo: "2026-10-30",
    notes: "",
    trackingNo: "9400111899223344556677",
    trackingUrl: "https://tools.usps.com/go/TrackConfirmAction?tLabels=9400111899223344556677",
    billing: baseBilling(
      "Avery",
      "Quinn",
      "avery.quinn@example.com",
      "(469) 555-0133",
      "Plano",
      "75024",
    ),
    lines: [
      {
        id: "5a",
        productTitle: "Acrylic Literature Rack",
        variantLabel: "",
        quantity: 1,
        unitPrice: 40,
        lineTotal: 40,
        returnQuantity: "",
      },
      {
        id: "5b",
        productTitle: "White Folding Chair",
        variantLabel: "",
        quantity: 4,
        unitPrice: 10,
        lineTotal: 40,
        returnQuantity: "",
      },
    ],
  },
  {
    id: "6",
    orderNo: "EVT-10026",
    orderDate: "2026-08-22T13:05:00",
    eventId: "1",
    eventName: "Summer Tech Showcase",
    eventCode: "STS2026",
    contactName: "Jordan Lee",
    contactEmail: "jordan.lee@example.com",
    booth: "Booth C21",
    orderPlacedBy: "Jordan Lee",
    shippingMethod: "Booth Delivery",
    total: 300,
    status: "Completed",
    rentFrom: "2026-06-01",
    rentTo: "2026-06-05",
    notes: "Returned on time.",
    trackingNo: "",
    trackingUrl: "",
    billing: baseBilling(
      "Jordan",
      "Lee",
      "jordan.lee@example.com",
      "(512) 555-0190",
      "Austin",
      "78701",
    ),
    lines: [
      {
        id: "6a",
        productTitle: "3×3 White Cube Display Shelf",
        variantLabel: "",
        quantity: 1,
        unitPrice: 300,
        lineTotal: 300,
        returnQuantity: "",
      },
    ],
  },
  {
    id: "8",
    orderNo: "EVT-10028",
    orderDate: "2026-08-05T15:20:00",
    eventId: "3",
    eventName: "CareFlite's ECU Conference 2026",
    eventCode: "ECU2026",
    contactName: "Taylor Brooks",
    contactEmail: "taylor.brooks@example.com",
    booth: "Booth 155",
    orderPlacedBy: "Taylor Brooks",
    shippingMethod: "Booth Delivery",
    total: 160,
    status: "Delivered",
    rentFrom: "2026-10-29",
    rentTo: "2026-10-30",
    notes: "Eligible for return after event.",
    trackingNo: "9400111899223344556688",
    trackingUrl:
      "https://tools.usps.com/go/TrackConfirmAction?tLabels=9400111899223344556688",
    billing: baseBilling(
      "Taylor",
      "Brooks",
      "taylor.brooks@example.com",
      "(214) 555-0188",
      "Dallas",
      "75202",
    ),
    lines: [
      {
        id: "8a",
        productTitle: "Chrome Cocktail Table",
        variantLabel: "",
        quantity: 2,
        unitPrice: 75,
        lineTotal: 150,
        returnQuantity: "",
      },
      {
        id: "8b",
        productTitle: "White Folding Chair",
        variantLabel: "",
        quantity: 1,
        unitPrice: 10,
        lineTotal: 10,
        returnQuantity: "",
      },
    ],
  },
  {
    id: "7",
    orderNo: "EVT-10027",
    orderDate: "2026-08-18T08:40:00",
    eventId: "3",
    eventName: "CareFlite's ECU Conference 2026",
    eventCode: "ECU2026",
    contactName: "Sam Rivera",
    contactEmail: "sam.rivera@example.com",
    booth: "Booth 090",
    orderPlacedBy: "Sam Rivera",
    shippingMethod: "Booth Delivery",
    total: 45,
    status: "Cancelled",
    rentFrom: "2026-10-29",
    rentTo: "2026-10-30",
    notes: "Cancelled by exhibitor.",
    trackingNo: "",
    trackingUrl: "",
    billing: baseBilling(
      "Sam",
      "Rivera",
      "sam.rivera@example.com",
      "(312) 555-0166",
      "Chicago",
      "60601",
    ),
    lines: [
      {
        id: "7a",
        productTitle: "Assorted Bi-Fold Tables",
        variantLabel: "4-Foot Rectangular Table",
        quantity: 1,
        unitPrice: 45,
        lineTotal: 45,
        returnQuantity: "",
      },
    ],
  },
];

export const RETURN_ELIGIBLE_STATUSES: EventOrderStatus[] = [
  "Delivered",
  "Completed",
];

export function listNewOrders(): EventOrder[] {
  return listOrdersByStatus("New");
}

export function listOrdersByStatus(status: EventOrderStatus): EventOrder[] {
  return orders.filter((o) => o.status === status);
}

export function listOrdersForReturn(): EventOrder[] {
  return orders.filter((o) =>
    RETURN_ELIGIBLE_STATUSES.includes(o.status),
  );
}

export function listEventOrders(): EventOrder[] {
  return [...orders];
}

export function getEventOrder(id: string): EventOrder | undefined {
  return orders.find((o) => o.id === id);
}

export function updateOrderReturnQuantities(
  id: string,
  returnQuantities: Record<string, string>,
): EventOrder | undefined {
  const index = orders.findIndex((o) => o.id === id);
  if (index < 0) return undefined;
  const current = orders[index];
  if (!current) return undefined;
  const updated: EventOrder = {
    ...current,
    lines: current.lines.map((line) => ({
      ...line,
      returnQuantity: returnQuantities[line.id] ?? line.returnQuantity,
    })),
  };
  orders = [...orders.slice(0, index), updated, ...orders.slice(index + 1)];
  return updated;
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
