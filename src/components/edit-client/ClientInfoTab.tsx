import type { ClientInfo } from "@/components/edit-client/mock-client";
import { US_STATES } from "@/components/edit-client/mock-client";
import {
  FieldLabel,
  FormInput,
  FormSelect,
  FormTextarea,
  PrimaryButton,
} from "@/components/edit-client/SearchToolbar";
import { BRAND } from "@/lib/brand";

type ClientInfoTabProps = {
  value: ClientInfo;
  onChange: (next: ClientInfo) => void;
  onSaveAndNext: () => void;
};

export function ClientInfoTab({
  value,
  onChange,
  onSaveAndNext,
}: ClientInfoTabProps) {
  const set = <K extends keyof ClientInfo>(key: K, v: ClientInfo[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="md:col-span-6">
          <FieldLabel required>Company Name</FieldLabel>
          <FormInput
            value={value.companyName}
            onChange={(e) => set("companyName", e.target.value)}
          />
        </div>
        <div className="hidden md:col-span-6 md:block" />

        <div className="md:col-span-3">
          <FieldLabel required>First Name</FieldLabel>
          <FormInput
            value={value.firstName}
            onChange={(e) => set("firstName", e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <FieldLabel required>Last Name</FieldLabel>
          <FormInput
            value={value.lastName}
            onChange={(e) => set("lastName", e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <FieldLabel required>Company Email</FieldLabel>
          <FormInput
            type="email"
            value={value.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <FieldLabel required>Phone</FieldLabel>
          <FormInput
            value={value.phone}
            placeholder="(XXX) XXX-XXXX"
            onChange={(e) => set("phone", e.target.value)}
          />
        </div>

        <div className="md:col-span-3">
          <FieldLabel required>Address 1</FieldLabel>
          <FormInput
            value={value.address1}
            onChange={(e) => set("address1", e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <FieldLabel>Address 2</FieldLabel>
          <FormInput
            value={value.address2}
            onChange={(e) => set("address2", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <FieldLabel required>City</FieldLabel>
          <FormInput
            value={value.city}
            onChange={(e) => set("city", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <FieldLabel required>State</FieldLabel>
          <FormSelect
            value={value.stateCode}
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
        <div className="md:col-span-2">
          <FieldLabel required>Zip</FieldLabel>
          <FormInput
            value={value.zip}
            onChange={(e) => set("zip", e.target.value)}
          />
        </div>

        <div className="md:col-span-6">
          <FieldLabel>Notes</FieldLabel>
          <FormTextarea
            rows={5}
            value={value.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <FieldLabel required>Payment Required</FieldLabel>
          <div className="flex gap-4 pt-2 text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                checked={value.paymentRequired}
                onChange={() => set("paymentRequired", true)}
                style={{ accentColor: BRAND.primary }}
              />
              Yes
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                checked={!value.paymentRequired}
                onChange={() => set("paymentRequired", false)}
                style={{ accentColor: BRAND.primary }}
              />
              No
            </label>
          </div>
        </div>
        <div className="md:col-span-3">
          <FieldLabel required>Approval required for orders?</FieldLabel>
          <div className="flex gap-4 pt-2 text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                checked={value.approvalRequired}
                onChange={() => set("approvalRequired", true)}
                style={{ accentColor: BRAND.primary }}
              />
              Yes
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                checked={!value.approvalRequired}
                onChange={() => set("approvalRequired", false)}
                style={{ accentColor: BRAND.primary }}
              />
              No
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <PrimaryButton onClick={() => undefined}>Save</PrimaryButton>
        <PrimaryButton onClick={onSaveAndNext}>Save & Next</PrimaryButton>
      </div>
    </div>
  );
}
