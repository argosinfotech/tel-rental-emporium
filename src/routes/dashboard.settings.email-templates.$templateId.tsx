import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { RichTextEditor } from "@/components/events/RichTextEditor";
import { BRAND } from "@/lib/brand";
import {
  getEmailTemplate,
  saveEmailTemplate,
} from "@/lib/mock-email-templates";

export const Route = createFileRoute(
  "/dashboard/settings/email-templates/$templateId",
)({
  head: ({ params }) => {
    const template = getEmailTemplate(params.templateId);
    const title = template
      ? `Edit Email Template — ${template.templateName} — ${BRAND.name}`
      : `Edit Email Template — ${BRAND.name}`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: `Edit email template in the ${BRAND.name}.`,
        },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content: `Edit email template in the ${BRAND.name}.`,
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: EditEmailTemplatePage,
});

function EditEmailTemplatePage() {
  const { templateId } = Route.useParams();
  const navigate = useNavigate();
  const existing = getEmailTemplate(templateId);

  const [emailSubject, setEmailSubject] = useState(
    existing?.emailSubject ?? "",
  );
  const [emailBody, setEmailBody] = useState(existing?.emailBody ?? "");
  const [saved, setSaved] = useState(false);

  if (!existing) {
    return (
      <div className="p-6">
        <h1 className="mb-4 text-lg font-semibold uppercase tracking-wide text-[#495057]">
          Template Not Found
        </h1>
        <Link
          to="/dashboard/settings/email-templates"
          className="text-sm font-medium hover:underline"
          style={{ color: BRAND.primary }}
        >
          Back to Email Templates
        </Link>
      </div>
    );
  }

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    const bodyText = emailBody.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, "").trim();
    if (!emailSubject.trim() || !bodyText) return;
    saveEmailTemplate({
      id: existing.id,
      templateName: existing.templateName,
      emailSubject: emailSubject.trim(),
      emailBody,
    });
    setSaved(true);
    void navigate({ to: "/dashboard/settings/email-templates" });
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-lg font-semibold uppercase tracking-wide text-[#495057]">
        Edit Email Template — {existing.templateName}
      </h1>

      <form
        onSubmit={onSave}
        className="max-w-4xl rounded-lg border border-border bg-white p-6 shadow-sm"
      >
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-[#495057]">
            Template Name
          </label>
          <input
            type="text"
            value={existing.templateName}
            disabled
            className="w-full rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-[#495057]"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-[#495057]">
            Email Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            maxLength={200}
            value={emailSubject}
            onChange={(e) => {
              setEmailSubject(e.target.value);
              setSaved(false);
            }}
            className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-[#495057] focus:border-[#0b8a7a] focus:outline-none focus:ring-2 focus:ring-[#0b8a7a]/20"
          />
        </div>

        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-medium text-[#495057]">
            Email Body <span className="text-red-500">*</span>
          </label>
          <RichTextEditor
            value={emailBody}
            minHeight={220}
            onChange={(html) => {
              setEmailBody(html);
              setSaved(false);
            }}
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Use placeholders like {"{{OrderNumber}}"}, {"{{EventName}}"},{" "}
            {"{{Booth}}"}.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {saved && (
            <span className="mr-auto text-sm text-green-600">Saved</span>
          )}
          <button
            type="submit"
            className="rounded-md px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: BRAND.primary }}
          >
            Save
          </button>
          <Link
            to="/dashboard/settings/email-templates"
            className="rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-[#495057] hover:bg-muted"
          >
            Back
          </Link>
        </div>
      </form>
    </div>
  );
}
