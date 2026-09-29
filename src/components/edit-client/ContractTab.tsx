import { useState } from "react";
import type { ContractFee, JobType } from "@/components/edit-client/mock-client";
import {
  ActionIconGroup,
  DeleteIconButton,
  EditIconButton,
} from "@/components/edit-client/ActionIcons";
import {
  FieldLabel,
  FormInput,
  FormSelect,
  FormTextarea,
  PrimaryButton,
  TableHeaderCell,
} from "@/components/edit-client/SearchToolbar";

type ContractTabProps = {
  contract: ContractFee;
  onContractChange: (next: ContractFee) => void;
  jobTypes: JobType[];
  onJobTypesChange: (next: JobType[]) => void;
};

const emptyJob: Omit<JobType, "id"> = {
  jobType: "",
  freePulls: "",
  additionalPrice: "",
  usedPull: "0",
  freePullsUsed: "0",
  pullsRemaining: "",
  returnShipping: false,
  sendToShipStation: false,
  notes: "",
};

export function ContractTab({
  contract,
  onContractChange,
  jobTypes,
  onJobTypesChange,
}: ContractTabProps) {
  const [draft, setDraft] = useState(emptyJob);

  const setContract = <K extends keyof ContractFee>(
    key: K,
    v: ContractFee[K],
  ) => onContractChange({ ...contract, [key]: v });

  const saveJob = () => {
    if (!draft.jobType.trim()) return;
    const remaining =
      draft.pullsRemaining ||
      String(
        Math.max(
          0,
          (Number(draft.freePulls) || 0) - (Number(draft.freePullsUsed) || 0),
        ),
      );
    onJobTypesChange([
      ...jobTypes,
      {
        id: `jt-${Date.now()}`,
        ...draft,
        pullsRemaining: remaining,
      },
    ]);
    setDraft(emptyJob);
  };

  return (
    <div className="space-y-6 p-6">
      <fieldset className="rounded-lg border border-border p-4">
        <legend className="px-2 text-sm font-semibold text-foreground">
          Contract Fee
        </legend>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <FieldLabel required>Monthly Fee ($)</FieldLabel>
            <FormInput
              value={contract.monthlyFee}
              onChange={(e) => setContract("monthlyFee", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel required>Duration</FieldLabel>
            <FormSelect
              value={contract.duration}
              onChange={(e) => setContract("duration", e.target.value)}
            >
              <option>1 Year</option>
              <option>2 Years</option>
              <option>3 Years</option>
              <option>6 Months</option>
            </FormSelect>
          </div>
          <div>
            <FieldLabel required>Start Date</FieldLabel>
            <FormInput
              type="date"
              value={contract.startDate}
              onChange={(e) => setContract("startDate", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>End Date</FieldLabel>
            <FormInput value={contract.endDate} readOnly disabled />
          </div>
          <div className="md:col-span-4">
            <FieldLabel>Notes</FieldLabel>
            <FormTextarea
              rows={3}
              value={contract.notes}
              onChange={(e) => setContract("notes", e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <PrimaryButton onClick={() => undefined}>Update</PrimaryButton>
        </div>
      </fieldset>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          View Job Types
        </h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[1100px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#eef2fb] text-left text-foreground">
                <TableHeaderCell>Job Type</TableHeaderCell>
                <TableHeaderCell>Pulls / Contract (Free Pulls)</TableHeaderCell>
                <TableHeaderCell>Additional Price Per Pull</TableHeaderCell>
                <TableHeaderCell>Used Pull</TableHeaderCell>
                <TableHeaderCell>Free Pulls Used</TableHeaderCell>
                <TableHeaderCell>Pulls remaining</TableHeaderCell>
                <TableHeaderCell>Return Shipping</TableHeaderCell>
                <TableHeaderCell>Send to ShipStation</TableHeaderCell>
                <TableHeaderCell>Notes</TableHeaderCell>
                <TableHeaderCell>Action</TableHeaderCell>
              </tr>
            </thead>
            <tbody>
              {jobTypes.map((jt) => (
                <tr key={jt.id} className="border-t border-border">
                  <td className="px-4 py-3">{jt.jobType}</td>
                  <td className="px-4 py-3">{jt.freePulls}</td>
                  <td className="px-4 py-3">${jt.additionalPrice}</td>
                  <td className="px-4 py-3">{jt.usedPull}</td>
                  <td className="px-4 py-3">{jt.freePullsUsed}</td>
                  <td className="px-4 py-3">{jt.pullsRemaining}</td>
                  <td className="px-4 py-3">{jt.returnShipping ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">
                    {jt.sendToShipStation ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3">{jt.notes}</td>
                  <td className="px-4 py-3">
                    <ActionIconGroup>
                      <EditIconButton label={`Edit ${jt.jobType}`} />
                      <DeleteIconButton
                        label={`Delete ${jt.jobType}`}
                        onClick={() =>
                          onJobTypesChange(jobTypes.filter((x) => x.id !== jt.id))
                        }
                      />
                    </ActionIconGroup>
                  </td>
                </tr>
              ))}
              <tr className="border-t border-border bg-muted/30">
                <td className="px-4 py-2">
                  <FormInput
                    value={draft.jobType}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, jobType: e.target.value }))
                    }
                    placeholder="Job type"
                  />
                </td>
                <td className="px-4 py-2">
                  <FormInput
                    value={draft.freePulls}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, freePulls: e.target.value }))
                    }
                  />
                </td>
                <td className="px-4 py-2">
                  <FormInput
                    value={draft.additionalPrice}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        additionalPrice: e.target.value,
                      }))
                    }
                  />
                </td>
                <td className="px-4 py-2">
                  <FormInput
                    value={draft.usedPull}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, usedPull: e.target.value }))
                    }
                  />
                </td>
                <td className="px-4 py-2">
                  <FormInput
                    value={draft.freePullsUsed}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        freePullsUsed: e.target.value,
                      }))
                    }
                  />
                </td>
                <td className="px-4 py-2">
                  <FormInput
                    value={draft.pullsRemaining}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        pullsRemaining: e.target.value,
                      }))
                    }
                  />
                </td>
                <td className="px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={draft.returnShipping}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        returnShipping: e.target.checked,
                      }))
                    }
                  />
                </td>
                <td className="px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={draft.sendToShipStation}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        sendToShipStation: e.target.checked,
                      }))
                    }
                  />
                </td>
                <td className="px-4 py-2">
                  <FormInput
                    value={draft.notes}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, notes: e.target.value }))
                    }
                  />
                </td>
                <td className="px-4 py-2">
                  <PrimaryButton onClick={saveJob}>Save</PrimaryButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <PrimaryButton onClick={() => undefined}>View Update Logs</PrimaryButton>
    </div>
  );
}
