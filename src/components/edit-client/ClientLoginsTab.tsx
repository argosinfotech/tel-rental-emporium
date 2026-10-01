import { useMemo, useState } from "react";
import type { Brand, ClientLogin } from "@/components/edit-client/mock-client";
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

type ClientLoginsTabProps = {
  logins: ClientLogin[];
  brands: Brand[];
  onChange: (next: ClientLogin[]) => void;
};

const USER_ROLES = [
  "Full Access",
  "Single Brand Only",
  "Single Brand - selected item only",
];

const WELCOME_OPTIONS = ["Select", "Yes", "No"];

export function ClientLoginsTab({
  logins,
  brands,
  onChange,
}: ClientLoginsTabProps) {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [welcomeEmail, setWelcomeEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [brand, setBrand] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return logins;
    return logins.filter((l) =>
      [l.firstName, l.lastName, l.email, l.userRole, l.brand]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [logins, search]);

  const resetForm = () => {
    setEditingId(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setWelcomeEmail("");
    setUserRole("");
    setBrand("");
  };

  const openAdd = () => {
    resetForm();
    setMode("form");
  };

  const openEdit = (login: ClientLogin) => {
    setEditingId(login.id);
    setFirstName(login.firstName);
    setLastName(login.lastName);
    setEmail(login.email);
    setPassword("");
    setConfirmPassword("");
    setWelcomeEmail("");
    setUserRole(login.userRole);
    setBrand(login.brand);
    setMode("form");
  };

  const save = () => {
    if (!email.trim() || !userRole) return;
    if (!editingId) {
      if (!password || !confirmPassword) return;
      if (password !== confirmPassword) return;
      onChange([
        ...logins,
        {
          id: `l-${Date.now()}`,
          firstName,
          lastName,
          email,
          userRole,
          brand: brand || brands[0]?.name || "",
        },
      ]);
    } else {
      if (password || confirmPassword) {
        if (password !== confirmPassword) return;
      }
      onChange(
        logins.map((l) =>
          l.id === editingId
            ? {
                ...l,
                firstName,
                lastName,
                email,
                userRole,
                brand,
              }
            : l,
        ),
      );
    }
    resetForm();
    setMode("list");
  };

  if (mode === "form") {
    return (
      <div className="p-6">
        <h2 className="mb-4 text-base font-semibold text-foreground">
          {editingId ? "Edit Client Login" : "Add New Client Login"}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <FieldLabel>First Name</FieldLabel>
            <FormInput
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>Last Name</FieldLabel>
            <FormInput
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <FieldLabel required>Email</FieldLabel>
            <FormInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <FieldLabel required={!editingId}>Password</FieldLabel>
            <FormInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={editingId ? "Leave blank to keep current" : ""}
            />
          </div>
          <div>
            <FieldLabel required={!editingId}>Confirm Password</FieldLabel>
            <FormInput
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={editingId ? "Leave blank to keep current" : ""}
            />
          </div>
          <div>
            <FieldLabel>Send Welcome Email With</FieldLabel>
            <FormSelect
              value={welcomeEmail}
              onChange={(e) => setWelcomeEmail(e.target.value)}
            >
              {WELCOME_OPTIONS.map((o) => (
                <option key={o} value={o === "Select" ? "" : o}>
                  {o}
                </option>
              ))}
            </FormSelect>
          </div>
          <div>
            <FieldLabel required>User Role</FieldLabel>
            <FormSelect
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
            >
              <option value="">Select</option>
              {USER_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </FormSelect>
          </div>
          <div>
            <FieldLabel>Brand</FieldLabel>
            <FormSelect
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            >
              <option value="">Select</option>
              {brands.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </FormSelect>
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <PrimaryButton onClick={save}>Save</PrimaryButton>
          <PrimaryButton
            onClick={() => {
              resetForm();
              setMode("list");
            }}
          >
            Cancel
          </PrimaryButton>
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
          <PrimaryButton onClick={openAdd}>Add New Client Login</PrimaryButton>
        }
      />
      <div className="overflow-x-auto px-6 pb-6">
        <table className="w-full min-w-[800px] border-collapse text-sm">
          <TealTableHead>
            <TableHeaderCell>First Name</TableHeaderCell>
            <TableHeaderCell>Last Name</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>User Role</TableHeaderCell>
            <TableHeaderCell>Brand</TableHeaderCell>
            <TableHeaderCell>Action</TableHeaderCell>
          </TealTableHead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="border-t border-border">
                <td className="px-4 py-3">{l.firstName}</td>
                <td className="px-4 py-3">{l.lastName}</td>
                <td className="px-4 py-3">{l.email}</td>
                <td className="px-4 py-3">{l.userRole}</td>
                <td className="px-4 py-3">{l.brand}</td>
                <td className="px-4 py-3">
                  <ActionIconGroup>
                    <EditIconButton
                      label={`Edit ${l.email}`}
                      onClick={() => openEdit(l)}
                    />
                    <DeleteIconButton
                      label={`Delete ${l.email}`}
                      onClick={() =>
                        onChange(logins.filter((x) => x.id !== l.id))
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
