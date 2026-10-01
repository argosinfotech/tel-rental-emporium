import { useMemo, useState } from "react";
import type { Category } from "@/components/edit-client/mock-client";
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
  TealTableHead,
} from "@/components/edit-client/SearchToolbar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CategoriesTabProps = {
  categories: Category[];
  onChange: (next: Category[]) => void;
};

export function CategoriesTab({ categories, onChange }: CategoriesTabProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, search]);

  const openAdd = () => {
    setEditing(null);
    setName("");
    setOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setName(c.name);
    setOpen(true);
  };

  const save = () => {
    if (!name.trim()) return;
    if (editing) {
      onChange(
        categories.map((c) => (c.id === editing.id ? { ...c, name } : c)),
      );
    } else {
      onChange([...categories, { id: `c-${Date.now()}`, name }]);
    }
    setOpen(false);
  };

  return (
    <div>
      <SearchToolbar
        search={search}
        onSearchChange={setSearch}
        actions={
          <PrimaryButton onClick={openAdd}>Add New Category</PrimaryButton>
        }
      />
      <div className="overflow-x-auto px-6 pb-6">
        <table className="w-full border-collapse text-sm">
          <TealTableHead>
            <TableHeaderCell>Category Name</TableHeaderCell>
            <TableHeaderCell className="text-right">Action</TableHeaderCell>
          </TealTableHead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-4 py-3">{c.name}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <ActionIconGroup>
                      <EditIconButton
                        label={`Edit ${c.name}`}
                        onClick={() => openEdit(c)}
                      />
                      <DeleteIconButton
                        label={`Delete ${c.name}`}
                        onClick={() =>
                          onChange(categories.filter((x) => x.id !== c.id))
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
              {editing ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>
          <div>
            <FieldLabel required>Category Name</FieldLabel>
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
