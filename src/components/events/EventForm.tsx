import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { US_STATES } from "@/components/edit-client/mock-client";
import {
  FieldLabel,
  FormInput,
  FormSelect,
  FormTextarea,
  PrimaryButton,
} from "@/components/edit-client/SearchToolbar";
import { RichTextEditor } from "@/components/events/RichTextEditor";
import {
  EVENT_STATUSES,
  EVENT_TIME_ZONES,
  emptyEventForm,
  isAlphanumeric,
  isContactEmailUnique,
  isEventCodeUnique,
  isValidEmail,
  saveEvent,
  type InventoryEvent,
} from "@/lib/mock-events";

type EventFormProps = {
  initial?: InventoryEvent;
};

type FormErrors = Partial<Record<keyof Omit<InventoryEvent, "id">, string>>;

export function EventForm({ initial }: EventFormProps) {
  const navigate = useNavigate();
  const [form, setForm] = useState<Omit<InventoryEvent, "id">>(() =>
    initial
      ? {
          eventName: initial.eventName,
          eventCode: initial.eventCode,
          contactFirstName: initial.contactFirstName,
          contactLastName: initial.contactLastName,
          contactEmail: initial.contactEmail,
          fromDate: initial.fromDate,
          toDate: initial.toDate,
          address1: initial.address1,
          address2: initial.address2,
          city: initial.city,
          stateCode: initial.stateCode,
          zipCode: initial.zipCode,
          timeZone: initial.timeZone,
          shortDescription: initial.shortDescription,
          description: initial.description,
          status: initial.status,
        }
      : emptyEventForm(),
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const set = <K extends keyof Omit<InventoryEvent, "id">>(
    key: K,
    value: InventoryEvent[K],
  ) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    const excludeId = initial?.id;

    if (!form.eventName.trim()) next.eventName = "Required";
    else if (form.eventName.length > 150) next.eventName = "Max 150 characters";

    if (!form.eventCode.trim()) next.eventCode = "Required";
    else if (form.eventCode.length > 50) next.eventCode = "Max 50 characters";
    else if (!isAlphanumeric(form.eventCode.trim()))
      next.eventCode = "Alphanumeric only";
    else if (!isEventCodeUnique(form.eventCode, excludeId))
      next.eventCode = "Event Code must be unique";

    if (!form.contactFirstName.trim()) next.contactFirstName = "Required";
    else if (form.contactFirstName.length > 50)
      next.contactFirstName = "Max 50 characters";

    if (!form.contactLastName.trim()) next.contactLastName = "Required";
    else if (form.contactLastName.length > 50)
      next.contactLastName = "Max 50 characters";

    if (!form.contactEmail.trim()) next.contactEmail = "Required";
    else if (form.contactEmail.length > 150)
      next.contactEmail = "Max 150 characters";
    else if (!isValidEmail(form.contactEmail))
      next.contactEmail = "Invalid email";
    else if (!isContactEmailUnique(form.contactEmail, excludeId))
      next.contactEmail = "Email must be unique";

    if (!form.fromDate) next.fromDate = "Required";
    if (!form.toDate) next.toDate = "Required";
    else if (form.fromDate && form.toDate < form.fromDate)
      next.toDate = "Must be on or after From Date";

    if (!form.address1.trim()) next.address1 = "Required";
    else if (form.address1.length > 100) next.address1 = "Max 100 characters";

    if (form.address2.length > 50) next.address2 = "Max 50 characters";

    if (!form.city.trim()) next.city = "Required";
    else if (form.city.length > 100) next.city = "Max 100 characters";

    if (!form.stateCode) next.stateCode = "Required";

    if (!form.zipCode.trim()) next.zipCode = "Required";
    else if (form.zipCode.length > 5) next.zipCode = "Max 5 characters";

    if (form.shortDescription.length > 500)
      next.shortDescription = "Max 500 characters";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    const payload: Omit<InventoryEvent, "id"> & { id?: string } = {
      eventName: form.eventName.trim(),
      eventCode: form.eventCode.trim(),
      contactFirstName: form.contactFirstName.trim(),
      contactLastName: form.contactLastName.trim(),
      contactEmail: form.contactEmail.trim(),
      fromDate: form.fromDate,
      toDate: form.toDate,
      address1: form.address1.trim(),
      address2: form.address2.trim(),
      city: form.city.trim(),
      stateCode: form.stateCode,
      zipCode: form.zipCode.trim(),
      timeZone: form.timeZone,
      shortDescription: form.shortDescription.trim(),
      description: form.description,
      status: form.status,
    };
    if (initial?.id) {
      payload.id = initial.id;
    }
    saveEvent(payload);
    void navigate({ to: "/dashboard/events" });
  };

  const cancel = () => {
    void navigate({ to: "/dashboard/events" });
  };

  const errorText = (key: keyof FormErrors) =>
    errors[key] ? (
      <p className="mt-0.5 text-xs text-destructive">{errors[key]}</p>
    ) : null;

  return (
    <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
      <div className="grid gap-x-4 gap-y-2.5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FieldLabel required>Event Name</FieldLabel>
          <FormInput
            value={form.eventName}
            maxLength={150}
            onChange={(e) => set("eventName", e.target.value)}
          />
          {errorText("eventName")}
        </div>
        <div>
          <FieldLabel required>Event Code</FieldLabel>
          <FormInput
            value={form.eventCode}
            maxLength={50}
            onChange={(e) => set("eventCode", e.target.value)}
          />
          {errorText("eventCode")}
        </div>
        <div>
          <FieldLabel required>Contact First Name</FieldLabel>
          <FormInput
            value={form.contactFirstName}
            maxLength={50}
            onChange={(e) => set("contactFirstName", e.target.value)}
          />
          {errorText("contactFirstName")}
        </div>
        <div>
          <FieldLabel required>Contact Last Name</FieldLabel>
          <FormInput
            value={form.contactLastName}
            maxLength={50}
            onChange={(e) => set("contactLastName", e.target.value)}
          />
          {errorText("contactLastName")}
        </div>
        <div>
          <FieldLabel required>Contact Email</FieldLabel>
          <FormInput
            type="email"
            value={form.contactEmail}
            maxLength={150}
            onChange={(e) => set("contactEmail", e.target.value)}
          />
          {errorText("contactEmail")}
        </div>
        <div>
          <FieldLabel required>Event From Date</FieldLabel>
          <FormInput
            type="date"
            value={form.fromDate}
            onChange={(e) => set("fromDate", e.target.value)}
          />
          {errorText("fromDate")}
        </div>
        <div>
          <FieldLabel required>Event Last Date</FieldLabel>
          <FormInput
            type="date"
            value={form.toDate}
            min={form.fromDate || undefined}
            onChange={(e) => set("toDate", e.target.value)}
          />
          {errorText("toDate")}
        </div>
        <div>
          <FieldLabel>Event Time Zone</FieldLabel>
          <FormSelect
            value={form.timeZone}
            onChange={(e) =>
              set("timeZone", e.target.value as InventoryEvent["timeZone"])
            }
          >
            {EVENT_TIME_ZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </FormSelect>
        </div>

        <div className="lg:col-span-3">
          <h2 className="mb-1.5 mt-2 text-xs font-semibold uppercase tracking-wide text-[#495057]">
            Event Address
          </h2>
        </div>
        <div className="lg:col-span-2">
          <FieldLabel required>Address 1</FieldLabel>
          <FormInput
            value={form.address1}
            maxLength={100}
            onChange={(e) => set("address1", e.target.value)}
          />
          {errorText("address1")}
        </div>
        <div>
          <FieldLabel>Address 2</FieldLabel>
          <FormInput
            value={form.address2}
            maxLength={50}
            onChange={(e) => set("address2", e.target.value)}
          />
          {errorText("address2")}
        </div>
        <div>
          <FieldLabel required>City</FieldLabel>
          <FormInput
            value={form.city}
            maxLength={100}
            onChange={(e) => set("city", e.target.value)}
          />
          {errorText("city")}
        </div>
        <div>
          <FieldLabel required>State</FieldLabel>
          <FormSelect
            value={form.stateCode}
            onChange={(e) => set("stateCode", e.target.value)}
          >
            <option value="">Select State</option>
            {US_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </FormSelect>
          {errorText("stateCode")}
        </div>
        <div>
          <FieldLabel required>Zip Code</FieldLabel>
          <FormInput
            value={form.zipCode}
            maxLength={5}
            onChange={(e) =>
              set("zipCode", e.target.value.replace(/\D/g, "").slice(0, 5))
            }
          />
          {errorText("zipCode")}
        </div>

        <div className="lg:col-span-3">
          <FieldLabel>Short Description</FieldLabel>
          <FormTextarea
            value={form.shortDescription}
            maxLength={500}
            rows={2}
            className="resize-y"
            onChange={(e) => set("shortDescription", e.target.value)}
          />
          {errorText("shortDescription")}
        </div>

        <div className="lg:col-span-3">
          <FieldLabel>Description</FieldLabel>
          <RichTextEditor
            value={form.description}
            minHeight={420}
            onChange={(html) => set("description", html)}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-border pt-4">
        <div className="w-48">
          <FieldLabel>Status</FieldLabel>
          <FormSelect
            value={form.status}
            onChange={(e) =>
              set("status", e.target.value as InventoryEvent["status"])
            }
          >
            {EVENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </FormSelect>
        </div>
        <div className="flex gap-2">
          <PrimaryButton onClick={save}>Save</PrimaryButton>
          <PrimaryButton onClick={cancel}>Cancel</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
