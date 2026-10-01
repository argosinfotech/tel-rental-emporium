export type EventStatus = "Draft" | "Live" | "Completed";
export type EventTimeZone = "EDT" | "CDT" | "MST" | "PDT";

export type InventoryEvent = {
  id: string;
  eventName: string;
  eventCode: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  fromDate: string;
  toDate: string;
  address1: string;
  address2: string;
  city: string;
  stateCode: string;
  zipCode: string;
  timeZone: EventTimeZone;
  shortDescription: string;
  description: string;
  status: EventStatus;
};

export const EVENT_TIME_ZONES: { value: EventTimeZone; label: string }[] = [
  { value: "EDT", label: "EDT" },
  { value: "CDT", label: "CST/CDT" },
  { value: "MST", label: "MST" },
  { value: "PDT", label: "PDT" },
];

export const EVENT_STATUSES: EventStatus[] = ["Draft", "Live", "Completed"];

export function emptyEventForm(): Omit<InventoryEvent, "id"> {
  return {
    eventName: "",
    eventCode: "",
    contactFirstName: "",
    contactLastName: "",
    contactEmail: "",
    fromDate: "",
    toDate: "",
    address1: "",
    address2: "",
    city: "",
    stateCode: "",
    zipCode: "",
    timeZone: "CDT",
    shortDescription: "",
    description: "",
    status: "Draft",
  };
}

export function contactPersonName(event: {
  contactFirstName: string;
  contactLastName: string;
}): string {
  return `${event.contactFirstName} ${event.contactLastName}`.trim();
}

let events: InventoryEvent[] = [
  {
    id: "1",
    eventName: "Summer Tech Showcase",
    eventCode: "STS2026",
    contactFirstName: "Jordan",
    contactLastName: "Lee",
    contactEmail: "jordan.lee@example.com",
    fromDate: "2026-06-01",
    toDate: "2026-06-05",
    address1: "100 Main Street",
    address2: "Suite 200",
    city: "Austin",
    stateCode: "TX",
    zipCode: "78701",
    timeZone: "CDT",
    shortDescription: "Annual summer technology showcase.",
    description: "<p>Join us for the <strong>Summer Tech Showcase</strong>.</p>",
    status: "Live",
  },
  {
    id: "2",
    eventName: "Holiday Gifting Expo",
    eventCode: "HGE2026",
    contactFirstName: "Sam",
    contactLastName: "Rivera",
    contactEmail: "sam.rivera@example.com",
    fromDate: "2026-11-10",
    toDate: "2026-11-14",
    address1: "500 Market Ave",
    address2: "",
    city: "Chicago",
    stateCode: "IL",
    zipCode: "60601",
    timeZone: "CDT",
    shortDescription: "",
    description: "",
    status: "Draft",
  },
  {
    id: "3",
    eventName: "CareFlite's ECU Conference 2026",
    eventCode: "ECU2026",
    contactFirstName: "Alex",
    contactLastName: "Morgan",
    contactEmail: "alex.morgan@careflite.example.com",
    fromDate: "2026-10-29",
    toDate: "2026-10-30",
    address1: "Irving Convention Center at Las Colinas",
    address2: "500 W. Las Colinas Blvd.",
    city: "Irving",
    stateCode: "TX",
    zipCode: "75039",
    timeZone: "CDT",
    shortDescription: "CareFlite's Emergency Care Update Conference.",
    description:
      "<p>CareFlite's <strong>Emergency Care Update Conference</strong> at Irving Convention Center.</p>",
    status: "Live",
  },
];

let nextId = 4;

export function listEvents(): InventoryEvent[] {
  return [...events];
}

export function getEvent(id: string): InventoryEvent | undefined {
  return events.find((e) => e.id === id);
}

export function getEventByCode(code: string): InventoryEvent | undefined {
  const normalized = code.trim().toLowerCase();
  return events.find((e) => e.eventCode.trim().toLowerCase() === normalized);
}

export function getLiveEventByCode(code: string): InventoryEvent | undefined {
  const event = getEventByCode(code);
  return event?.status === "Live" ? event : undefined;
}

export function formatEventAddress(event: InventoryEvent): string {
  const line2 = event.address2.trim();
  const parts = [
    event.address1.trim(),
    line2,
    `${event.city.trim()}, ${event.stateCode} ${event.zipCode.trim()}`.trim(),
    "United States",
  ].filter(Boolean);
  return parts.join(", ");
}

export function formatEventDateRange(event: InventoryEvent): string {
  return `${formatLongDate(event.fromDate)} – ${formatLongDate(event.toDate)}`;
}

export function formatLongDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).toUpperCase();
}

export function eventRentalDayCount(event: InventoryEvent): number {
  const from = new Date(`${event.fromDate}T12:00:00`);
  const to = new Date(`${event.toDate}T12:00:00`);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return 1;
  const days =
    Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, days);
}

export function eventReturnByDate(event: InventoryEvent, withinDays = 3): string {
  const to = new Date(`${event.toDate}T12:00:00`);
  if (Number.isNaN(to.getTime())) return "";
  to.setDate(to.getDate() + withinDays);
  return formatLongDate(to.toISOString().slice(0, 10));
}

export function isEventCodeUnique(code: string, excludeId?: string): boolean {
  const normalized = code.trim().toLowerCase();
  return !events.some(
    (e) =>
      e.id !== excludeId && e.eventCode.trim().toLowerCase() === normalized,
  );
}

export function isContactEmailUnique(
  email: string,
  excludeId?: string,
): boolean {
  const normalized = email.trim().toLowerCase();
  return !events.some(
    (e) =>
      e.id !== excludeId && e.contactEmail.trim().toLowerCase() === normalized,
  );
}

export function saveEvent(
  data: Omit<InventoryEvent, "id"> & { id?: string },
): InventoryEvent {
  if (data.id) {
    const index = events.findIndex((e) => e.id === data.id);
    if (index >= 0) {
      const updated: InventoryEvent = { ...data, id: data.id };
      events = [
        ...events.slice(0, index),
        updated,
        ...events.slice(index + 1),
      ];
      return updated;
    }
  }
  const created: InventoryEvent = {
    ...data,
    id: String(nextId++),
  };
  events = [...events, created];
  return created;
}

export function deleteEvent(id: string): void {
  events = events.filter((e) => e.id !== id);
}

export function isAlphanumeric(value: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(value);
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
