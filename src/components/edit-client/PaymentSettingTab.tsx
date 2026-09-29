import type { PaymentSetting } from "@/components/edit-client/mock-client";
import {
  FieldLabel,
  FormInput,
  PrimaryButton,
} from "@/components/edit-client/SearchToolbar";

type PaymentSettingTabProps = {
  value: PaymentSetting;
  onChange: (next: PaymentSetting) => void;
};

export function PaymentSettingTab({
  value,
  onChange,
}: PaymentSettingTabProps) {
  return (
    <div className="max-w-3xl space-y-5 p-6">
      <div>
        <FieldLabel required>Stripe Publishable Key / API Key</FieldLabel>
        <FormInput
          value={value.publishableKey}
          onChange={(e) =>
            onChange({ ...value, publishableKey: e.target.value })
          }
        />
      </div>
      <div>
        <FieldLabel required>Stripe Secret Key / API Signature</FieldLabel>
        <FormInput
          type="password"
          value={value.secretKey}
          onChange={(e) => onChange({ ...value, secretKey: e.target.value })}
        />
      </div>
      <PrimaryButton onClick={() => undefined}>Save</PrimaryButton>
    </div>
  );
}
