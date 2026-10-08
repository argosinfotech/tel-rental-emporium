import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute(
  "/dashboard/settings/notification-emails",
)({
  head: () => ({
    meta: [
      { title: `Notification Emails — ${BRAND.name}` },
      {
        name: "description",
        content: `Manage notification email recipients in the ${BRAND.name}.`,
      },
      {
        property: "og:title",
        content: `Notification Emails — ${BRAND.name}`,
      },
      {
        property: "og:description",
        content: `Manage notification email recipients in the ${BRAND.name}.`,
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NotificationEmailsPage,
});

type NotificationRow = {
  id: string;
  title: string;
  name: string;
  email: string;
};

const INITIAL_ROWS: NotificationRow[] = [
  {
    id: "order-placed",
    title: "Order Placed by Client Notification",
    name: "Admin",
    email: "support@argosinfotech.com",
  },
  {
    id: "quantity-threshold",
    title: "Quantity Threshold Notification",
    name: "Admin",
    email: "support@argosinfotech.com",
  },
  {
    id: "inbound-inventory",
    title: "Inbound Inventory Notification",
    name: "Admin",
    email: "support@argosinfotech.com, nilesh@inestweb.com",
  },
  {
    id: "event-store-order",
    title: "Event Store Order Notification",
    name: "Admin",
    email: "support@argosinfotech.com",
  },
];

function NotificationEmailsPage() {
  const [rows, setRows] = useState(INITIAL_ROWS);

  const updateField = (
    id: string,
    field: "name" | "email",
    value: string,
  ) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-lg font-semibold uppercase tracking-wide text-[#495057]">
        Notification Emails
      </h1>

      <div className="space-y-8">
        {rows.map((row) => (
          <section key={row.id}>
            <h2 className="mb-3 text-base font-medium text-[#495057]">
              {row.title}
            </h2>
            <div className="overflow-x-auto rounded-lg border border-border bg-white shadow-sm">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr
                    className="text-left text-white"
                    style={{ backgroundColor: BRAND.primary }}
                  >
                    <th className="w-1/4 px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="w-[100px] px-4 py-3 font-semibold" />
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border align-top">
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        maxLength={50}
                        value={row.name}
                        onChange={(e) =>
                          updateField(row.id, "name", e.target.value)
                        }
                        className="w-full rounded-md border border-border bg-white px-3 py-1.5 text-sm text-[#495057] focus:border-[#0b8a7a] focus:outline-none focus:ring-2 focus:ring-[#0b8a7a]/20"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        maxLength={150}
                        value={row.email}
                        onChange={(e) =>
                          updateField(row.id, "email", e.target.value)
                        }
                        className="w-full rounded-md border border-border bg-white px-3 py-1.5 text-sm text-[#495057] focus:border-[#0b8a7a] focus:outline-none focus:ring-2 focus:ring-[#0b8a7a]/20"
                      />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <button
                        type="button"
                        className="rounded-md px-3 py-1.5 text-sm font-medium text-white transition-colors hover:opacity-90"
                        style={{ backgroundColor: BRAND.primary }}
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
