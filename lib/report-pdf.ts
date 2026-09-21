import type { FeedbackDoc } from "@/lib/feedback";
import type { PulseMetrics, RatingDistributionItem } from "@/lib/feedback-metrics";

export type ReportMonth = {
  year: number;
  month: number;
};

export type ReportPdfOptions = {
  businessName: string;
  selectedMonth: ReportMonth;
  metrics: PulseMetrics;
  previousMetrics: PulseMetrics;
  distribution: RatingDistributionItem[];
  feedback: FeedbackDoc[];
};

// ─── colours (always light, regardless of dashboard theme) ───────────────────
const C = {
  bg: "#ffffff",
  text: "#18181b",
  muted: "#52525b",
  subtle: "#a1a1aa",
  border: "#e4e4e7",
  primary: "#18181b",
  barBg: "#f4f4f5",
  barFill: "#18181b",
};

// ─── layout constants (mm) ───────────────────────────────────────────────────
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 18;
const CONTENT_W = PAGE_W - MARGIN * 2;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toFileName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function formatMonthRange(period: ReportMonth) {
  const start = new Date(period.year, period.month, 1);
  const end = new Date(period.year, period.month + 1, 0);
  const fmt = new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}

function formatMonth(period: ReportMonth) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(new Date(period.year, period.month, 1));
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function calculateChange(
  current: number,
  previous: number,
  type: "number" | "rating" | "percentage",
): string | null {
  if (!previous) return null;
  const difference = current - previous;
  if (difference === 0) return "No change vs previous month";
  const sign = difference > 0 ? "+" : "";
  if (type === "rating") return `${sign}${difference.toFixed(1)} vs previous month`;
  if (type === "percentage") return `${sign}${Math.round(difference)} pts vs previous month`;
  return `${sign}${difference} vs previous month`;
}

// ─── main export ─────────────────────────────────────────────────────────────
export async function generateReportPdf(options: ReportPdfOptions): Promise<void> {
  const { default: jsPDF } = await import("jspdf");

  const {
    businessName,
    selectedMonth,
    metrics,
    previousMetrics,
    distribution,
    feedback,
  } = options;

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  // Shared drawing helpers that close over `doc` and a mutable cursor `y`.
  let y = MARGIN;

  function newPage() {
    doc.addPage();
    y = MARGIN;
  }

  function ensureSpace(needed: number) {
    if (y + needed > PAGE_H - MARGIN) newPage();
  }

  function hRule(thickness = 0.2) {
    doc.setDrawColor(C.border);
    doc.setLineWidth(thickness);
    doc.line(MARGIN, y, MARGIN + CONTENT_W, y);
  }

  // ── header ────────────────────────────────────────────────────────────────
  doc.setFillColor(C.bg);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");

  // Branding
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(C.text);
  doc.text("ExPulse", MARGIN, y);

  // Business name (right-aligned)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(C.muted);
  doc.text(businessName, PAGE_W - MARGIN, y, { align: "right" });

  y += 7;
  hRule();
  y += 6;

  // Report title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(C.text);
  doc.text("Monthly Customer Experience Report", MARGIN, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(C.muted);
  doc.text(formatMonthRange(selectedMonth), MARGIN, y);
  y += 12;

  // ── section: monthly performance ─────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(C.text);
  doc.text("Monthly Performance", MARGIN, y);
  y += 2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(C.muted);
  doc.text(formatMonth(selectedMonth), MARGIN, y + 4);
  y += 10;

  hRule();

  const metricRows: { label: string; value: string; change: string | null }[] = [
    {
      label: "Responses",
      value: String(metrics.totalResponses),
      change: calculateChange(metrics.totalResponses, previousMetrics.totalResponses, "number"),
    },
    {
      label: "Average experience",
      value: metrics.totalResponses ? `${metrics.avgRating.toFixed(1)} / 5` : "—",
      change: calculateChange(metrics.avgRating, previousMetrics.avgRating, "rating"),
    },
    {
      label: "Recommendation",
      value: metrics.totalResponses ? `${Math.round(metrics.recommendPct)}%` : "—",
      change: calculateChange(metrics.recommendPct, previousMetrics.recommendPct, "percentage"),
    },
  ];

  for (const row of metricRows) {
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(C.muted);
    doc.text(row.label.toUpperCase(), MARGIN, y);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(C.text);
    doc.text(row.value, PAGE_W - MARGIN, y + 4, { align: "right" });

    if (row.change) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(C.subtle);
      doc.text(row.change, PAGE_W - MARGIN, y + 9, { align: "right" });
    }

    y += 14;
    hRule();
  }

  y += 10;

  // ── section: rating distribution ──────────────────────────────────────────
  ensureSpace(60);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(C.text);
  doc.text("Rating Distribution", MARGIN, y);
  y += 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(C.muted);
  doc.text("How customers rated their experience.", MARGIN, y);
  y += 8;

  const BAR_H = 3;
  const BAR_MAX_W = CONTENT_W - 28;
  const LABEL_W = 16;

  for (const item of distribution) {
    const pct =
      metrics.totalResponses > 0 ? item.count / metrics.totalResponses : 0;
    const barW = pct * BAR_MAX_W;
    const starLabel = `${item.rating} ${item.rating === 1 ? "star" : "stars"}`;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(C.text);
    doc.text(starLabel, MARGIN, y + BAR_H / 2 + 1);

    // bar background
    doc.setFillColor(C.barBg);
    doc.roundedRect(MARGIN + LABEL_W, y - 0.5, BAR_MAX_W, BAR_H + 1, 1, 1, "F");

    // bar fill
    if (barW > 0) {
      doc.setFillColor(C.barFill);
      doc.roundedRect(MARGIN + LABEL_W, y - 0.5, barW, BAR_H + 1, 1, 1, "F");
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(C.muted);
    doc.text(String(item.count), PAGE_W - MARGIN, y + BAR_H / 2 + 1, { align: "right" });

    y += 8;
  }

  y += 6;

  // ── section: feedback summary ──────────────────────────────────────────────
  ensureSpace(45);

  const positive = feedback.filter((f) => f.rating >= 4 && f.recommend).length;
  const needsAttention = feedback.filter((f) => f.rating <= 2 || !f.recommend).length;
  const noComment = feedback.filter((f) => !f.comment?.trim()).length;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(C.text);
  doc.text("Customer Feedback", MARGIN, y);
  y += 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(C.muted);
  doc.text("A simple breakdown of responses from this month.", MARGIN, y);
  y += 8;

  hRule();

  const summaryRows = [
    { label: "Positive experiences", value: positive },
    { label: "Needs attention", value: needsAttention },
    { label: "No written comment", value: noComment },
  ];

  for (const row of summaryRows) {
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(C.text);
    doc.text(row.label, MARGIN, y);
    doc.setFont("helvetica", "bold");
    doc.text(String(row.value), PAGE_W - MARGIN, y, { align: "right" });
    y += 4;
    hRule();
  }

  y += 10;

  // ── section: written comments ──────────────────────────────────────────────
  const comments = feedback.filter((f) => f.comment?.trim());

  ensureSpace(20);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(C.text);
  doc.text("Written Comments", MARGIN, y);
  y += 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(C.muted);
  doc.text("All written feedback from this report period.", MARGIN, y);
  y += 8;

  if (comments.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(C.muted);
    doc.text("No written comments for this month.", MARGIN, y);
    y += 8;
  } else {
    for (const item of comments) {
      // stars + badge
      const stars = "★".repeat(item.rating) + "☆".repeat(5 - item.rating);
      const badge = item.recommend ? "Recommended" : "Not recommended";

      ensureSpace(24);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(C.text);
      doc.text(stars, MARGIN, y);

      // badge (outlined box)
      const badgeX = MARGIN + 22;
      const badgeW = doc.getTextWidth(badge) + 4;
      doc.setDrawColor(C.border);
      doc.setLineWidth(0.3);
      doc.roundedRect(badgeX, y - 4, badgeW, 5.5, 1, 1, "S");
      doc.setFontSize(7.5);
      doc.setTextColor(C.muted);
      doc.text(badge, badgeX + 2, y);

      y += 5;

      // comment text with wrapping
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(C.text);
      const lines = doc.splitTextToSize(item.comment ?? "", CONTENT_W);
      for (const line of lines) {
        ensureSpace(6);
        doc.text(line, MARGIN, y);
        y += 5;
      }

      // date
      if (item.createdAt?.toDate?.()) {
        doc.setFontSize(8);
        doc.setTextColor(C.subtle);
        doc.text(formatDate(item.createdAt.toDate()), MARGIN, y);
        y += 4;
      }

      y += 3;
      hRule(0.15);
      y += 5;
    }
  }

  // ── page numbers ───────────────────────────────────────────────────────────
  const totalPages = (doc as unknown as { internal: { getNumberOfPages: () => number } })
    .internal.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(C.subtle);
    doc.text(
      `Page ${i} of ${totalPages}`,
      PAGE_W / 2,
      PAGE_H - 8,
      { align: "center" },
    );
  }

  // ── save ───────────────────────────────────────────────────────────────────
  const year = selectedMonth.year;
  const month = pad(selectedMonth.month + 1);
  const filename = `${toFileName(businessName)}-expulse-report-${year}-${month}.pdf`;

  doc.save(filename);
}
