import { useMemo, useState } from "react";
import type { Project } from "@/components/edit-client/mock-client";
import {
  ActionIconGroup,
  DeleteIconButton,
  EditIconButton,
} from "@/components/edit-client/ActionIcons";
import {
  FieldLabel,
  FormInput,
  FormTextarea,
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

type ProjectsTabProps = {
  projects: Project[];
  onChange: (next: Project[]) => void;
};

export function ProjectsTab({ projects, onChange }: ProjectsTabProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.notes.toLowerCase().includes(q),
    );
  }, [projects, search]);

  const openAdd = () => {
    setEditing(null);
    setName("");
    setNotes("");
    setOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setName(p.name);
    setNotes(p.notes);
    setOpen(true);
  };

  const save = () => {
    if (!name.trim()) return;
    if (editing) {
      onChange(
        projects.map((p) =>
          p.id === editing.id ? { ...p, name, notes } : p,
        ),
      );
    } else {
      onChange([...projects, { id: `p-${Date.now()}`, name, notes }]);
    }
    setOpen(false);
  };

  return (
    <div>
      <SearchToolbar
        search={search}
        onSearchChange={setSearch}
        actions={
          <PrimaryButton onClick={openAdd}>Add New Project</PrimaryButton>
        }
      />
      <div className="overflow-x-auto px-6 pb-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#eef2fb] text-left">
              <TableHeaderCell>Project Name</TableHeaderCell>
              <TableHeaderCell>Project Notes</TableHeaderCell>
              <TableHeaderCell className="text-right">Action</TableHeaderCell>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3">{p.notes}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <ActionIconGroup>
                      <EditIconButton
                        label={`Edit ${p.name}`}
                        onClick={() => openEdit(p)}
                      />
                      <DeleteIconButton
                        label={`Delete ${p.name}`}
                        onClick={() =>
                          onChange(projects.filter((x) => x.id !== p.id))
                        }
                      />
                    </ActionIconGroup>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Project" : "Add New Project"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <FieldLabel required>Project Name</FieldLabel>
              <FormInput value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <FieldLabel>Project Notes</FieldLabel>
              <FormTextarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
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
