export type EmailTemplate = {
  id: string;
  templateName: string;
  emailSubject: string;
  emailBody: string;
};

let templates: EmailTemplate[] = [
  {
    id: "1",
    templateName: "Contract Renewal for Admin",
    emailSubject: "TEL contract for {{ClientName}} about to expire!!",
    emailBody:
      "<p>Hi Admin,<br><br>The TEL contract for {{ClientName}} is about to expire.<br><br>TEL Support Team</p>",
  },
  {
    id: "2",
    templateName: "Contract Renewal for Client",
    emailSubject: "TEL contract about to expire!!",
    emailBody:
      "<p>Hi {{FirstName}},<br><br>Your TEL contract is about to expire.<br><br>TEL Support Team</p>",
  },
  {
    id: "3",
    templateName: "Customer Welcome Email",
    emailSubject: "TEL: Welcome Email",
    emailBody:
      "<p>Hi {{FirstName}},<br><br>Welcome to the TEL Fulfillment Portal.<br><br>TEL Support Team</p>",
  },
  {
    id: "4",
    templateName: "Email Template - Approval Confirm",
    emailSubject: "Your TEL order #{{OrderNumber}} - Approval Confirmation",
    emailBody:
      "<p>Hello {{ApproverName}},<br><br>{{OrderSummary}}<br><br>TEL Support Team</p>",
  },
  {
    id: "5",
    templateName: "Email Template - Order Approved Email",
    emailSubject: "Your TEL order #{{OrderNumber}} - Approved",
    emailBody:
      "<p>Hello {{FirstName}},<br><br>Your order has been approved.<br><br>{{OrderSummary}}<br><br>TEL Support Team</p>",
  },
  {
    id: "6",
    templateName: "Email Template - Order Reject Email",
    emailSubject: "Your TEL order #{{OrderNumber}} - Rejected",
    emailBody:
      "<p>Hello {{FirstName}},<br><br>Your order has been rejected.<br>Rejected Notes: {{RejectedNotes}}<br><br>{{OrderSummary}}<br><br>TEL Support Team</p>",
  },
  {
    id: "7",
    templateName: "Forgot Password",
    emailSubject: "TEL: Forgot Password",
    emailBody:
      "<p>Hi {{FirstName}},<br><br>We received a request for forgot password for user {{Email}}.<br>Your password: {{LoginPassword}}<br><br>TEL Support Team</p>",
  },
  {
    id: "8",
    templateName: "Inbound Inventory Modified – Notify Admin",
    emailSubject: "Inbound Inventory Modified – {{CompanyName}}",
    emailBody:
      "<p>Hello {{Name}},<br><br>Inbound inventory has been modified.<br><br>TEL Support Team</p>",
  },
  {
    id: "9",
    templateName: "Inbound Inventory Processing – Notify Client",
    emailSubject: "Commencement of Inventory Processing",
    emailBody:
      "<p>We have commenced processing of the inventory.<br><br>The Event Lounge Team</p>",
  },
  {
    id: "10",
    templateName: "Inbound Inventory Received – Notify Client",
    emailSubject: "Acknowledgment of Shipment Receipt",
    emailBody:
      "<p>We have successfully received the shipment.<br><br>The Event Lounge Team</p>",
  },
  {
    id: "11",
    templateName: "Inbound Inventory Sent – Notify Admin",
    emailSubject:
      "Shipment Notification: Your Order from {{CompanyName}} is on its Way!",
    emailBody:
      "<p>Shipment details including tracking number {{TrackingNumber}}.<br><br>TEL Support Team</p>",
  },
  {
    id: "12",
    templateName: "Inbound Inventory Stocked – Notify Client",
    emailSubject: "Completion of Inventory Stocking",
    emailBody:
      "<p>Inventory has been successfully processed and stocked.<br><br>The Event Lounge Team</p>",
  },
  {
    id: "13",
    templateName: "Invoice Portal Notification",
    emailSubject:
      "Your Monthly Invoice is Ready – {{ClientName}} – {{MonthYear}}",
    emailBody:
      "<p>Hi {{ClientName}},<br><br>Your monthly invoice for {{MonthYear}} is ready.<br><br>TEL Support Team</p>",
  },
  {
    id: "14",
    templateName: "Low Quantity Alert",
    emailSubject: "Low Quantity Alert for {{ProductName}}",
    emailBody:
      "<p>Hi,<br><br>{{ProductName}} has reached a low quantity threshold.<br><br>TEL Support Team</p>",
  },
  {
    id: "15",
    templateName: "Order Confirmation Email",
    emailSubject: "Your TEL order #{{OrderNumber}}",
    emailBody:
      "<p>Hello {{FirstName}},<br><br>Thank you for shopping with us.<br>Order Date &amp; Time: {{OrderDateTime}}<br>{{OrderSummary}}<br><br>TEL Support Team</p>",
  },
  {
    id: "16",
    templateName: "Event Store Order Confirmation",
    emailSubject: "Your Event Store order #{{OrderNumber}}",
    emailBody:
      "<p>Hello {{FirstName}},<br>&nbsp;</p><p>Thank you for your Event Store order. We will send another update when your items are on the way to the booth.<br>&nbsp;</p><p>Order Date &amp; Time: {{OrderDateTime}}<br>Event: {{EventName}} ({{EventCode}})<br>Booth: {{Booth}}<br>Contact: {{ContactName}}<br>Rental Period: {{RentFrom}} – {{RentTo}}<br>Notes: {{Notes}}<br>&nbsp;</p><p>{{OrderSummary}}<br><br><br>TEL Support Team</p>",
  },
];

export function listEmailTemplates(): EmailTemplate[] {
  return [...templates].sort((a, b) =>
    a.templateName.localeCompare(b.templateName),
  );
}

export function getEmailTemplate(id: string): EmailTemplate | undefined {
  return templates.find((t) => t.id === id);
}

export function saveEmailTemplate(
  input: Omit<EmailTemplate, "id"> & { id?: string },
): EmailTemplate {
  if (input.id) {
    const idx = templates.findIndex((t) => t.id === input.id);
    if (idx >= 0) {
      templates[idx] = {
        id: input.id,
        templateName: input.templateName,
        emailSubject: input.emailSubject,
        emailBody: input.emailBody,
      };
      return templates[idx];
    }
  }
  const created: EmailTemplate = {
    id: String(Date.now()),
    templateName: input.templateName,
    emailSubject: input.emailSubject,
    emailBody: input.emailBody,
  };
  templates = [...templates, created];
  return created;
}

export function deleteEmailTemplate(id: string): boolean {
  const before = templates.length;
  templates = templates.filter((t) => t.id !== id);
  return templates.length < before;
}
