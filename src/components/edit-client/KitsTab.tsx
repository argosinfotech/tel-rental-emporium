import { ImageIcon } from "lucide-react";
import { useMemo, useState } from "react";
import type { Kit } from "@/components/edit-client/mock-client";
import {
  ActionIconGroup,
  DeleteIconButton,
  EditIconButton,
  PlusIconButton,
  ViewIconButton,
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

type KitsTabProps = {
  kits: Kit[];
  onChange: (next: Kit[]) => void;
};

export function KitsTab({ kits, onChange }: KitsTabProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Kit | null>(null);
  const [name, setName] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return kits;
    return kits.filter((k) => k.name.toLowerCase().includes(q));
  }, [kits, search]);

  const openAdd = () => {
    setEditing(null);
    setName("");
    setWidth("");
    setHeight("");
    setOpen(true);
  };

  const openEdit = (k: Kit) => {
    setEditing(k);
    setName(k.name);
    setWidth(k.width);
    setHeight(k.height);
    setOpen(true);
  };

  const save = () => {
    if (!name.trim()) return;
    if (editing) {
      onChange(
        kits.map((k) =>
          k.id === editing.id ? { ...k, name, width, height } : k,
        ),
      );
    } else {
      onChange([
        ...kits,
        {
          id: `k-${Date.now()}`,
          name,
          width,
          height,
          imageUrl: "",
          productCount: 0,
        },
      ]);
    }
    setOpen(false);
  };

  return (
    <div>
      <SearchToolbar
        search={search}
        onSearchChange={setSearch}
        actions={<PrimaryButton onClick={openAdd}>Add New Kit</PrimaryButton>}
      />
      <div className="overflow-x-auto px-6 pb-6">
        <table className="w-full min-w-[800px] border-collapse text-sm">
          <TealTableHead>
            <TableHeaderCell>Kit Name</TableHeaderCell>
            <TableHeaderCell>Dimension (W X H)</TableHeaderCell>
            <TableHeaderCell>Image</TableHeaderCell>
            <TableHeaderCell>Number of Products</TableHeaderCell>
            <TableHeaderCell>View Products</TableHeaderCell>
            <TableHeaderCell>Action</TableHeaderCell>
          </TealTableHead>
          <tbody>
            {filtered.map((k) => (
              <tr key={k.id} className="border-t border-border">
                <td className="px-4 py-3">{k.name}</td>
                <td className="px-4 py-3">
                  {k.width} X {k.height}
                </td>
                <td className="px-4 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded border border-border bg-muted">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </td>
                <td className="px-4 py-3">{k.productCount}</td>
                <td className="px-4 py-3">
                  <ViewIconButton label={`View products in ${k.name}`} />
                </td>
                <td className="px-4 py-3">
                  <ActionIconGroup>
                    <PlusIconButton label={`Add products to ${k.name}`} />
                    <EditIconButton
                      label={`Edit ${k.name}`}
                      onClick={() => openEdit(k)}
                    />
                    <DeleteIconButton
                      label={`Delete ${k.name}`}
                      onClick={() =>
                        onChange(kits.filter((x) => x.id !== k.id))
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Kit" : "Add New Kit"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Kit Details</h3>
            <div>
              <FieldLabel>Kit Name</FieldLabel>
              <FormInput value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <FieldLabel>Packaging Dimension (W X H)</FieldLabel>
              <div className="flex items-center gap-2">
                <FormInput
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="max-w-[120px]"
                />
                <span className="text-sm text-muted-foreground">x</span>
                <FormInput
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="max-w-[120px]"
                />
              </div>
            </div>
            <div>
              <FieldLabel>Image</FieldLabel>
              <FormInput type="file" accept="image/*" />
            </div>
            <div className="flex justify-end">
              <PrimaryButton onClick={save}>Save</PrimaryButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
