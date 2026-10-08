import type { jsPDF } from "jspdf";
import type { DeliveryBoothGroup, SheetLineItem } from "@/lib/mock-event-sheets";

const MARGIN = 14;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const IMG_SIZE = 14;
const ROW_H = 18;
const HEADER_H = 10;
const BRAND_TEAL: [number, number, number] = [11, 138, 122];

async function loadJsPdf() {
  const mod = await import("jspdf");
  return mod.jsPDF;
}

async function imageToPngDataUrl(src: string): Promise<string | null> {
  const tryLoad = (url: string) =>
    new Promise<string | null>((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const w = img.naturalWidth || 80;
        const h = img.naturalHeight || 80;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0);
        try {
          resolve(canvas.toDataURL("image/png"));
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });

  if (src.startsWith("data:")) {
    return tryLoad(src);
  }

  const primary = await tryLoad(src);
  if (primary) return primary;
  if (src.endsWith(".jpg") || src.endsWith(".jpeg")) {
    return tryLoad(src.replace(/\.(jpg|jpeg)$/i, ".svg"));
  }
  return null;
}

async function loadLineImages(
  lines: SheetLineItem[],
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  await Promise.all(
    lines.map(async (line) => {
      const dataUrl = await imageToPngDataUrl(line.imageSrc);
      if (dataUrl) map.set(line.id, dataUrl);
    }),
  );
  return map;
}

function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_HEIGHT - MARGIN) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

function drawTableHeader(doc: jsPDF, y: number, qtyLabel: string): number {
  doc.setFillColor(...BRAND_TEAL);
  doc.rect(MARGIN, y, CONTENT_WIDTH, HEADER_H, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Image", MARGIN + 2, y + 6.5);
  doc.text("Name", MARGIN + 24, y + 6.5);
  doc.text(qtyLabel, MARGIN + CONTENT_WIDTH - 28, y + 6.5);
  doc.setTextColor(40, 40, 40);
  doc.setFont("helvetica", "normal");
  return y + HEADER_H;
}

function drawLineRow(
  doc: jsPDF,
  y: number,
  line: SheetLineItem,
  images: Map<string, string>,
): number {
  y = ensureSpace(doc, y, ROW_H);
  const img = images.get(line.id);
  if (img) {
    try {
      doc.addImage(img, "PNG", MARGIN + 2, y + 2, IMG_SIZE, IMG_SIZE);
    } catch {
      doc.setDrawColor(200);
      doc.rect(MARGIN + 2, y + 2, IMG_SIZE, IMG_SIZE);
    }
  } else {
    doc.setDrawColor(200);
    doc.setFillColor(240, 240, 240);
    doc.rect(MARGIN + 2, y + 2, IMG_SIZE, IMG_SIZE, "FD");
  }

  doc.setFontSize(10);
  const nameLines = doc.splitTextToSize(line.name, CONTENT_WIDTH - 60);
  doc.text(nameLines, MARGIN + 24, y + 8);
  doc.text(String(line.quantity), MARGIN + CONTENT_WIDTH - 28, y + 8);
  doc.setDrawColor(220);
  doc.line(MARGIN, y + ROW_H, MARGIN + CONTENT_WIDTH, y + ROW_H);
  return y + ROW_H;
}

function sanitizeFilename(value: string): string {
  return value.replace(/[^a-zA-Z0-9-_]+/g, "_").replace(/_+/g, "_");
}

export async function downloadPickSheetPdf(options: {
  eventName: string;
  eventCode: string;
  lines: SheetLineItem[];
}): Promise<void> {
  const { eventName, eventCode, lines } = options;
  const JsPDF = await loadJsPdf();
  const images = await loadLineImages(lines);
  const doc = new JsPDF({ unit: "mm", format: "a4" });

  let y = MARGIN;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Pick Sheet", MARGIN, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`${eventName} (${eventCode})`, MARGIN, y);
  y += 10;

  y = drawTableHeader(doc, y, "Qty");
  for (const line of lines) {
    y = drawLineRow(doc, y, line, images);
  }

  doc.save(`PickSheet_${sanitizeFilename(eventCode)}.pdf`);
}

function drawSignatureBlock(doc: jsPDF, y: number): number {
  y = ensureSpace(doc, y, 28);
  y += 10;
  const colW = CONTENT_WIDTH / 3;
  const labels = ["Received by", "Signature", "Date"];
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  labels.forEach((label, i) => {
    const x = MARGIN + i * colW;
    doc.text(label.toUpperCase(), x, y);
    doc.setDrawColor(80);
    doc.line(x, y + 12, x + colW - 8, y + 12);
  });
  doc.setFont("helvetica", "normal");
  return y + 18;
}

export async function downloadDeliverySheetPdf(options: {
  eventName: string;
  eventCode: string;
  groups: DeliveryBoothGroup[];
}): Promise<void> {
  const { eventName, eventCode, groups } = options;
  const JsPDF = await loadJsPdf();
  const allLines = groups.flatMap((g) => g.lines);
  const images = await loadLineImages(allLines);
  const doc = new JsPDF({ unit: "mm", format: "a4" });

  groups.forEach((group, index) => {
    if (index > 0) doc.addPage();

    let y = MARGIN;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Delivery Sheet", MARGIN, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`${eventName} (${eventCode})`, MARGIN, y);
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(group.booth, MARGIN, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(
      `Contact: ${group.contactName}${group.contactEmail ? ` · ${group.contactEmail}` : ""}`,
      MARGIN,
      y,
    );
    y += 5;
    if (group.orderNos.length > 0) {
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(`Order(s): ${group.orderNos.join(", ")}`, MARGIN, y);
      doc.setTextColor(40, 40, 40);
      y += 5;
    }
    y += 4;

    y = drawTableHeader(doc, y, "Qty");
    for (const line of group.lines) {
      y = drawLineRow(doc, y, line, images);
    }
    drawSignatureBlock(doc, y);
  });

  doc.save(`DeliverySheet_${sanitizeFilename(eventCode)}.pdf`);
}
