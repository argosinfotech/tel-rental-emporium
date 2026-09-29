import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Pencil, X, Plus } from "lucide-react";

export const Route = createFileRoute("/dashboard/clients/active")({
  head: () => ({
    meta: [
      { title: "View Active Clients — TEL Rental Store" },
      {
        name: "description",
        content: "List of active clients in the TEL Fulfillment Portal.",
      },
      {
        property: "og:title",
        content: "View Active Clients — TEL Rental Store",
      },
      {
        property: "og:description",
        content: "List of active clients in the TEL Fulfillment Portal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ViewActiveClients,
});

type Client = {
  contactName: string;
  companyName: string;
  email: string;
  phone: string;
  active: string;
};

const CLIENTS: Client[] = [
  {
    contactName: "Alison Clem",
    companyName: "The Event Lounge",
    email: "noreply@yopmail.com",
    phone: "(435) 678-8787",
    active: "Yes",
  },
  {
    contactName: "Alison Clem",
    companyName: "The Event Lounge",
    email: "noreply@yopmail.com",
    phone: "(043) 567-8878",
    active: "Yes",
  },
  {
    contactName: "Anee Parker",
    companyName: "Honeywell International Inc",
    email: "argos_anee@yopmail.com",
    phone: "(214) 214-6789",
    active: "Yes",
  },
  {
    contactName: "Brandon Duhon",
    companyName: "Beacon",
    email: "bduhon@yopmail.com",
    phone: "(097) 220-7782",
    active: "Yes",
  },
  {
    contactName: "Clean Alison",
    companyName: "The Longue Event",
    email: "wory@ytet.com",
    phone: "(543) 765-4876",
    active: "Yes",
  },
  {
    contactName: "Daniel Richard",
    companyName: "GuestXM (AKA: Black Box Intelligence)",
    email: "Riciild6666@gmail.com",
    phone: "(645) 879-6541",
    active: "Yes",
  },
  {
    contactName: "Dave Johnson",
    companyName: "Argos InfoTech",
    email: "moreinfo@argosinfotech.com",
    phone: "(214) 245-4846",
    active: "Yes",
  },
  {
    contactName: "David Jones",
    companyName: "USA Telecom",
    email: "david@yopmail.com",
    phone: "(916) 263-9465",
    active: "Yes",
  },
  {
    contactName: "David Jones",
    companyName: "Nienow and Sons",
    email: "nienow@yopmail.com",
    phone: "(987) 654-3210",
    active: "Yes",
  },
  {
    contactName: "Derrick Peter",
    companyName: "Blue Kite Web Solutions LLC",
    email: "derrick@yopmail.com",
    phone: "(838) 020-0202",
    active: "Yes",
  },
  {
    contactName: "Fill Allen",
    companyName: "Fill Allen & Co.",
    email: "fillAllentst.us@gmail.com",
    phone: "(041) 452-3636",
    active: "Yes",
  },
  {
    contactName: "Harry Mike",
    companyName: "Heyway",
    email: "heyway@gmail.com",
    phone: "(655) 464-7474",
    active: "Yes",
  },
  {
    contactName: "Jackson Loyer",
    companyName: "Jackson Constructions",
    email: "jackson@gtalk.us",
    phone: "(214) 545-2255",
    active: "Yes",
  },
];

type SortKey = "contactName" | "companyName" | "email" | "phone" | "active";
type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "contactName", label: "Contact Name" },
  { key: "companyName", label: "Company Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "active", label: "Active" },
];

function ViewActiveClients() {
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("contactName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = q
      ? CLIENTS.filter((c) => c.contactName.toLowerCase().includes(q))
      : CLIENTS;
    const sorted = [...rows].sort((a, b) =>
      a[sortKey].localeCompare(b[sortKey]),
    );
    return sortDir === "asc" ? sorted : sorted.reverse();
  }, [search, sortKey, sortDir]);

  const visible = filtered.slice(0, pageSize);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="p-6">
      {/* Page header */}
      <div className="rounded-lg border border-border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h1 className="text-lg font-semibold uppercase tracking-wide text-foreground">
            View Clients
          </h1>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-[#3b6fe0] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2f5cc4]"
          >
            <Plus className="h-4 w-4" />
            Add New Client
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="rounded-md border border-border bg-white px-2 py-1.5 text-sm focus:border-[#3b6fe0] focus:outline-none"
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span>records.</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <span>Search:</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Contact Name"
              className="w-56 rounded-md border border-border bg-white px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:border-[#3b6fe0] focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#eef2fb] text-left text-foreground">
                {COLUMNS.map(({ key, label }) => (
                  <th key={key} className="px-6 py-3 font-semibold">
                    <button
                      type="button"
                      onClick={() => toggleSort(key)}
                      className="inline-flex items-center gap-1.5 hover:text-[#3b6fe0]"
                    >
                      {label}
                      <span className="inline-flex flex-col leading-none">
                        {sortKey === key && sortDir === "asc" ? (
                          <ArrowUp className="h-3 w-3 text-[#3b6fe0]" />
                        ) : (
                          <ArrowUp className="h-3 w-3 text-muted-foreground/40" />
                        )}
                        {sortKey === key && sortDir === "desc" ? (
                          <ArrowDown className="-mt-0.5 h-3 w-3 text-[#3b6fe0]" />
                        ) : (
                          <ArrowDown className="-mt-0.5 h-3 w-3 text-muted-foreground/40" />
                        )}
                      </span>
                    </button>
                  </th>
                ))}
                <th className="px-6 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((client, idx) => (
                <tr
                  key={`${client.contactName}-${idx}`}
                  className="border-t border-border hover:bg-muted/50"
                >
                  <td className="px-6 py-3">
                    <span className="cursor-pointer text-[#3b6fe0] hover:underline">
                      {client.contactName}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="cursor-pointer text-[#3b6fe0] hover:underline">
                      {client.companyName}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-foreground">{client.email}</td>
                  <td className="px-6 py-3 text-foreground">{client.phone}</td>
                  <td className="px-6 py-3 text-foreground">{client.active}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label={`Edit ${client.contactName}`}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Deactivate ${client.contactName}`}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td
                    colSpan={COLUMNS.length + 1}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    No clients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
