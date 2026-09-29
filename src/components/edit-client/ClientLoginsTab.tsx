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

export function ClientLoginsTab({
  logins,
  brands,
  onChange,
}: ClientLoginsTabProps) {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"list" | "add">("list");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sendWelcome, setSendWelcome] = useState(false);
  const [userRole, setUserRole] = useState("");

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
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setSendWelcome(false);
    setUserRole("");
  };

  const save = () => {
    if (!email.trim() || !password || !confirmPassword || !userRole) return;
    if (password !== confirmPassword) return;
    onChange([
      ...logins,
      {
        id: `l-${Date.now()}`,
        firstName,
        lastName,
        email,
        userRole,
        brand: brands[0]?.name ?? "",
        approver: "",
      },
    ]);
    resetForm();
    setMode("list");
  };

  if (mode === "add") {
    return (
      <div className="p-6">
        <h2 className="mb-4 text-base font-semibold text-foreground">
          Add New Client Login
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
            <FieldLabel required>Password</FieldLabel>
            <FormInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <FieldLabel required>Confirm Password</FieldLabel>
            <FormInput
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex items-end pb-2">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={sendWelcome}
                onChange={(e) => setSendWelcome(e.target.checked)}
              />
              Send Welcome Email
            </label>
          </div>
          <div className="md:col-span-3 md:max-w-sm">
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
          <PrimaryButton
            onClick={() => {
              resetForm();
              setMode("add");
            }}
          >
            + Add New Client Login
          </PrimaryButton>
        }
      />
      <div className="overflow-x-auto px-6 pb-6">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead>
            <tr className="bg-[#eef2fb] text-left">
              <TableHeaderCell>First Name</TableHeaderCell>
              <TableHeaderCell>Last Name</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>User Role</TableHeaderCell>
              <TableHeaderCell>Brand</TableHeaderCell>
              <TableHeaderCell>Approver</TableHeaderCell>
              <TableHeaderCell>Action</TableHeaderCell>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="border-t border-border">
                <td className="px-4 py-3">{l.firstName}</td>
                <td className="px-4 py-3">{l.lastName}</td>
                <td className="px-4 py-3">{l.email}</td>
                <td className="px-4 py-3">{l.userRole}</td>
                <td className="px-4 py-3">{l.brand}</td>
                <td className="px-4 py-3">{l.approver}</td>
                <td className="px-4 py-3">
                  <ActionIconGroup>
                    <EditIconButton label={`Edit ${l.email}`} />
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
