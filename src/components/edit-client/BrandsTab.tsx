import { useMemo, useState } from "react";
import type { Brand } from "@/components/edit-client/mock-client";
import {
  ActionIconGroup,
  DeleteIconButton,
  EditIconButton,
} from "@/components/edit-client/ActionIcons";
import {
  FieldLabel,
  FormInput,
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

type BrandsTabProps = {
  brands: Brand[];
  onChange: (next: Brand[]) => void;
};

export function BrandsTab({ brands, onChange }: BrandsTabProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [name, setName] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return brands;
    return brands.filter((b) => b.name.toLowerCase().includes(q));
  }, [brands, search]);

  const openAdd = () => {
    setEditing(null);
    setName("");
    setOpen(true);
  };

  const openEdit = (b: Brand) => {
    setEditing(b);
    setName(b.name);
    setOpen(true);
  };

  const save = () => {
    if (!name.trim()) return;
    if (editing) {
      onChange(brands.map((b) => (b.id === editing.id ? { ...b, name } : b)));
    } else {
      onChange([...brands, { id: `b-${Date.now()}`, name }]);
    }
    setOpen(false);
  };

  return (
    <div>
      <SearchToolbar
        search={search}
        onSearchChange={setSearch}
        actions={
          <PrimaryButton onClick={openAdd}>Add New Brand</PrimaryButton>
        }
      />
      <div className="overflow-x-auto px-6 pb-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#eef2fb] text-left">
              <TableHeaderCell>Brand Name</TableHeaderCell>
              <TableHeaderCell className="text-right">Action</TableHeaderCell>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-t border-border">
                <td className="px-4 py-3">{b.name}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <ActionIconGroup>
                      <EditIconButton
                        label={`Edit ${b.name}`}
                        onClick={() => openEdit(b)}
                      />
                      <DeleteIconButton
                        label={`Delete ${b.name}`}
                        onClick={() =>
                          onChange(brands.filter((x) => x.id !== b.id))
                        }
                      />
                    </ActionIconGroup>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Brand" : "Add New Brand"}
            </DialogTitle>
          </DialogHeader>
          <div>
            <FieldLabel required>Brand Name</FieldLabel>
            <FormInput value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex justify-end">
            <PrimaryButton onClick={save}>Save</PrimaryButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
