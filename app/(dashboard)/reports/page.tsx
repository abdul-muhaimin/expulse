"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Download } from "lucide-react";

import { useBusiness } from "@/components/business/business-provider";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { type FeedbackDoc, useBusinessFeedback } from "@/lib/feedback";
import {
  computeMetrics,
  computeRatingDistribution,
} from "@/lib/feedback-metrics";
import { generateReportPdf } from "@/lib/report-pdf";

type ReportMonth = {
  year: number;
  month: number;
};

export default function ReportsPage() {
  const { business } = useBusiness();

  const { feedback, loading, error } = useBusinessFeedback();

  const months = useMemo(() => getCompletedMonths(12), []);

  const [selectedMonth, setSelectedMonth] = useState<ReportMonth>(months[0]);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const currentFeedback = useMemo(
    () => filterByMonth(feedback, selectedMonth),
    [feedback, selectedMonth],
  );

  const previousMonth = getPreviousMonth(selectedMonth);

  const previousFeedback = useMemo(
    () => filterByMonth(feedback, previousMonth),
    [feedback, previousMonth],
  );

  const metrics = useMemo(
    () => computeMetrics(currentFeedback),
    [currentFeedback],
  );

  const previousMetrics = useMemo(
    () => computeMetrics(previousFeedback),
    [previousFeedback],
  );

  const distribution = useMemo(
    () => computeRatingDistribution(currentFeedback),
    [currentFeedback],
  );

  async function handleDownloadPdf() {
    setIsGeneratingPdf(true);
    try {
      await generateReportPdf({
        businessName: business?.name ?? "",
        selectedMonth,
        metrics,
        previousMetrics,
        distribution,
        feedback: currentFeedback,
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  }

  if (loading) {
    return (
      <div className="p-2 text-sm text-muted-foreground">Loading report...</div>
    );
  }

  if (error) {
    return (
      <div className="p-2 text-sm text-destructive">
        We couldn&apos;t load this report.
      </div>
    );
  }

  return (
    <div className="space-y-8 p-2">
      <ReportHeader
        selectedMonth={selectedMonth}
        months={months}
        onChange={setSelectedMonth}
        onDownloadPdf={handleDownloadPdf}
        isGeneratingPdf={isGeneratingPdf}
      />

      <div className="p-2">
        <p className="text-sm font-medium">Monthly performance</p>

        <p className="mt-1 text-sm text-muted-foreground">
          {formatMonthRange(selectedMonth)}
        </p>
      </div>

      <div className="divide-y border-y p-2">
        <MetricRow
          label="Responses"
          description="Total customer responses"
          value={String(metrics.totalResponses)}
          change={calculateChange(
            metrics.totalResponses,
            previousMetrics.totalResponses,
            "number",
          )}
        />

        <MetricRow
          label="Average experience"
          description="Average customer rating"
          value={
            metrics.totalResponses ? `${metrics.avgRating.toFixed(1)} / 5` : "—"
          }
          change={calculateChange(
            metrics.avgRating,
            previousMetrics.avgRating,
            "rating",
          )}
        />

        <MetricRow
          label="Recommendation"
          description="Customers who would recommend"
          value={
            metrics.totalResponses
              ? `${Math.round(metrics.recommendPct)}%`
              : "—"
          }
          change={calculateChange(
            metrics.recommendPct,
            previousMetrics.recommendPct,
            "percentage",
          )}
        />
      </div>

      <section className="space-y-5 p-2">
        <div>
          <h2 className="text-lg font-semibold">Rating distribution</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            How customers rated their experience.
          </p>
        </div>

        <div className="max-w-3xl space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = getDistributionCount(distribution, rating);

            const percentage =
              metrics.totalResponses > 0
                ? (count / metrics.totalResponses) * 100
                : 0;

            return (
              <div
                key={rating}
                className="grid grid-cols-[64px_1fr_44px] items-center gap-4"
              >
                <span className="text-sm">
                  {rating} star{rating !== 1 ? "s" : ""}
                </span>

                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <span className="text-right text-sm text-muted-foreground">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <FeedbackSummary feedback={currentFeedback} />

      <ReportComments feedback={currentFeedback} />
    </div>
  );
}

function ReportHeader({
  selectedMonth,
  months,
  onChange,
  onDownloadPdf,
  isGeneratingPdf,
}: {
  selectedMonth: ReportMonth;
  months: ReportMonth[];
  onChange: (month: ReportMonth) => void;
  onDownloadPdf: () => void;
  isGeneratingPdf: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Review your completed monthly performance.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onDownloadPdf}
          disabled={isGeneratingPdf}
        >
          <Download className="size-3.5 opacity-60" />
          {isGeneratingPdf ? "Generating..." : "Download PDF"}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "sm",
              }),
            )}
          >
            {formatMonth(selectedMonth)}
            <ChevronDown className="size-3.5 opacity-60" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {months.map((month) => (
              <DropdownMenuItem
                key={`${month.year}-${month.month}`}
                onClick={() => onChange(month)}
              >
                {formatMonth(month)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function MetricRow({
  label,
  description,
  value,
  change,
}: {
  label: string;
  description: string;
  value: string;
  change: string | null;
}) {
  return (
    <div className="grid gap-3 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="sm:text-right">
        <p className="text-2xl font-semibold tabular-nums">{value}</p>

        {change && (
          <p className="mt-1 text-xs text-muted-foreground">{change}</p>
        )}
      </div>
    </div>
  );
}

function FeedbackSummary({ feedback }: { feedback: FeedbackDoc[] }) {
  const positive = feedback.filter(
    (item) => item.rating >= 4 && item.recommend,
  ).length;

  const needsAttention = feedback.filter(
    (item) => item.rating <= 2 || !item.recommend,
  ).length;

  const noComment = feedback.filter((item) => !item.comment?.trim()).length;

  return (
    <section className="space-y-4 border-t pt-8 p-2">
      <div>
        <h2 className="text-lg font-semibold">Customer feedback</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          A simple breakdown of responses from this month.
        </p>
      </div>

      <div className="divide-y">
        <SummaryRow label="Positive experiences" value={positive} />

        <SummaryRow label="Needs attention" value={needsAttention} />

        <SummaryRow label="No written comment" value={noComment} />
      </div>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm">{label}</span>

      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}

function ReportComments({ feedback }: { feedback: FeedbackDoc[] }) {
  const comments = feedback.filter((item) => item.comment?.trim()).slice(0, 10);

  return (
    <section className="space-y-4 border-t pt-8 p-2">
      <div>
        <h2 className="text-lg font-semibold">Recent comments</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Latest written feedback from this report period.
        </p>
      </div>

      {comments.length === 0 ? (
        <p className="py-6 text-sm text-muted-foreground">
          No written comments for this month.
        </p>
      ) : (
        <div className="divide-y border-y p-2">
          {comments.map((item) => (
            <div key={item.id} className="py-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="text-sm"
                  aria-label={`${item.rating} out of 5 stars`}
                >
                  {renderStars(item.rating)}
                </span>

                <Badge variant="outline">
                  {item.recommend ? "Recommended" : "Not recommended"}
                </Badge>
              </div>

              <p className="mt-2 text-sm leading-6">{item.comment}</p>

              {item.createdAt?.toDate?.() && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatDate(item.createdAt.toDate())}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function getCompletedMonths(count: number): ReportMonth[] {
  const now = new Date();

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - index - 1, 1);

    return {
      year: date.getFullYear(),
      month: date.getMonth(),
    };
  });
}

function getPreviousMonth(period: ReportMonth): ReportMonth {
  const date = new Date(period.year, period.month - 1, 1);

  return {
    year: date.getFullYear(),
    month: date.getMonth(),
  };
}

function filterByMonth(feedback: FeedbackDoc[], period: ReportMonth) {
  return feedback.filter((item) => {
    const date = item.createdAt?.toDate?.();

    if (!date) return false;

    return (
      date.getFullYear() === period.year && date.getMonth() === period.month
    );
  });
}

function formatMonth(period: ReportMonth) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(new Date(period.year, period.month, 1));
}

function formatMonthRange(period: ReportMonth) {
  const start = new Date(period.year, period.month, 1);

  const end = new Date(period.year, period.month + 1, 0);

  const formatter = new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return `${formatter.format(start)} – ${formatter.format(end)}`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function renderStars(rating: number) {
  return `${"★".repeat(rating)}${"☆".repeat(5 - rating)}`;
}

function calculateChange(
  current: number,
  previous: number,
  type: "number" | "rating" | "percentage",
) {
  if (!previous) return null;

  const difference = current - previous;

  if (difference === 0) {
    return "No change vs previous month";
  }

  const sign = difference > 0 ? "+" : "";

  if (type === "rating") {
    return `${sign}${difference.toFixed(1)} vs previous month`;
  }

  if (type === "percentage") {
    return `${sign}${Math.round(difference)} pts vs previous month`;
  }

  return `${sign}${difference} vs previous month`;
}

function getDistributionCount(
  distribution: ReturnType<typeof computeRatingDistribution>,
  rating: number,
) {
  const entry = distribution.find((item) => item.rating === rating);

  return entry?.count ?? 0;
}
