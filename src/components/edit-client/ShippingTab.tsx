import { useMemo, useState } from "react";
import type { ShippingAddress } from "@/components/edit-client/mock-client";
import { US_STATES } from "@/components/edit-client/mock-client";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ShippingTabProps = {
  addresses: ShippingAddress[];
  onChange: (next: ShippingAddress[]) => void;
};

const emptyForm = (): Omit<ShippingAddress, "id"> => ({
  firstName: "",
  lastName: "",
  companyName: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  stateCode: "",
  zip: "",
  groupName: "",
});

export function ShippingTab({ addresses, onChange }: ShippingTabProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return addresses;
    return addresses.filter((a) =>
      [a.firstName, a.lastName, a.companyName, a.city, a.address1]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [addresses, search]);

  const set = <K extends keyof ReturnType<typeof emptyForm>>(
    key: K,
    v: ReturnType<typeof emptyForm>[K],
  ) => setForm((f) => ({ ...f, [key]: v }));

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm());
    setOpen(true);
  };

  const openEdit = (a: ShippingAddress) => {
    setEditingId(a.id);
    const { id: _id, ...rest } = a;
    setForm(rest);
    setOpen(true);
  };

  const save = () => {
    if (!form.address1.trim() || !form.city.trim() || !form.stateCode || !form.zip.trim()) {
      return;
    }
    if (editingId) {
      onChange(
        addresses.map((a) => (a.id === editingId ? { ...a, ...form } : a)),
      );
    } else {
      onChange([...addresses, { id: `s-${Date.now()}`, ...form }]);
    }
    setOpen(false);
  };

  return (
    <div>
      <SearchToolbar
        search={search}
        onSearchChange={setSearch}
        actions={
          <>
            <PrimaryButton onClick={() => undefined}>
              Import Shipping Address
            </PrimaryButton>
            <PrimaryButton onClick={openAdd}>
              Add New Shipping Address
            </PrimaryButton>
          </>
        }
      />
      <div className="overflow-x-auto px-6 pb-6">
        <table className="w-full min-w-[1000px] border-collapse text-sm">
          <thead>
            <tr className="bg-[#eef2fb] text-left">
              <TableHeaderCell>First Name</TableHeaderCell>
              <TableHeaderCell>Last Name</TableHeaderCell>
              <TableHeaderCell>Company Name</TableHeaderCell>
              <TableHeaderCell>Phone Number</TableHeaderCell>
              <TableHeaderCell>Address</TableHeaderCell>
              <TableHeaderCell>City</TableHeaderCell>
              <TableHeaderCell>State</TableHeaderCell>
              <TableHeaderCell>Zip</TableHeaderCell>
              <TableHeaderCell>Group Name</TableHeaderCell>
              <TableHeaderCell>Action</TableHeaderCell>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-t border-border">
                <td className="px-4 py-3">{a.firstName}</td>
                <td className="px-4 py-3">{a.lastName}</td>
                <td className="px-4 py-3">{a.companyName}</td>
                <td className="px-4 py-3">{a.phone}</td>
                <td className="px-4 py-3">{a.address1}</td>
                <td className="px-4 py-3">{a.city}</td>
                <td className="px-4 py-3">{a.stateCode}</td>
                <td className="px-4 py-3">{a.zip}</td>
                <td className="px-4 py-3">{a.groupName}</td>
                <td className="px-4 py-3">
                  <ActionIconGroup>
                    <EditIconButton
                      label={`Edit ${a.firstName}`}
                      onClick={() => openEdit(a)}
                    />
                    <DeleteIconButton
                      label={`Delete ${a.firstName}`}
                      onClick={() =>
                        onChange(addresses.filter((x) => x.id !== a.id))
                      }
                    />
                  </ActionIconGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Shipping Address" : "Add Shipping Address"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FieldLabel>Company Name</FieldLabel>
              <FormInput
                value={form.companyName}
                onChange={(e) => set("companyName", e.target.value)}
              />
            </div>
            <div>
              <FieldLabel required>First Name</FieldLabel>
              <FormInput
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
              />
            </div>
            <div>
              <FieldLabel required>Last Name</FieldLabel>
              <FormInput
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel required>Phone</FieldLabel>
              <FormInput
                value={form.phone}
                placeholder="(XXX) XXX-XXXX"
                onChange={(e) => set("phone", e.target.value)}
              />
            </div>
            <div>
              <FieldLabel required>Address Line 1</FieldLabel>
              <FormInput
                value={form.address1}
                onChange={(e) => set("address1", e.target.value)}
              />
            </div>
            <div>
              <FieldLabel>Address Line 2</FieldLabel>
              <FormInput
                value={form.address2}
                onChange={(e) => set("address2", e.target.value)}
              />
            </div>
            <div>
              <FieldLabel required>City</FieldLabel>
              <FormInput
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
              />
            </div>
            <div>
              <FieldLabel required>State</FieldLabel>
              <FormSelect
                value={form.stateCode}
                onChange={(e) => set("stateCode", e.target.value)}
              >
                <option value="">Select</option>
                {US_STATES.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </FormSelect>
            </div>
            <div>
              <FieldLabel required>Zip Code</FieldLabel>
              <FormInput
                value={form.zip}
                onChange={(e) => set("zip", e.target.value)}
              />
            </div>
            <div>
              <FieldLabel>Group Name</FieldLabel>
              <FormInput
                value={form.groupName}
                onChange={(e) => set("groupName", e.target.value)}
              />
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            <PrimaryButton onClick={save}>Save</PrimaryButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
