import type { FeedbackDoc } from "@/lib/feedback";

// Represents a rolling time window selectable in the dashboard.
export type RollingPeriod = {
  days: number;  // window length, e.g. 30
  label: string; // display label, e.g. "Last 30 days"
};

export const ROLLING_PERIODS: RollingPeriod[] = [
  { days: 30, label: "Last 30 days" },
  { days: 90, label: "Last 90 days" },
  { days: 180, label: "Last 180 days" },
];

// Filters feedback to entries created within the rolling window ending now.
export function filterByRollingPeriod(
  feedback: FeedbackDoc[],
  period: RollingPeriod,
): FeedbackDoc[] {
  const cutoff = Date.now() - period.days * 24 * 60 * 60 * 1000;
  return feedback.filter((f) => f.createdAt.toDate().getTime() >= cutoff);
}

export type PulseMetrics = {
  totalResponses: number;
  avgRating: number;   // rounded to 1 decimal place
  recommendPct: number; // 0–100, whole number
};

export type RatingDistributionItem = {
  rating: number; // 1–5
  count: number;
};

export type MonthlyTrendPoint = {
  month: string; // "Jan", "Feb", …
  value: number; // average rating for that calendar month
};

export type TrendIndicator = {
  label: string;    // e.g. "+0.3" or "−0.2"
  direction: "up" | "down";
} | null;

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function computeMetrics(feedback: FeedbackDoc[]): PulseMetrics {
  if (feedback.length === 0) {
    return { totalResponses: 0, avgRating: 0, recommendPct: 0 };
  }

  const totalRating = feedback.reduce((sum, f) => sum + f.rating, 0);
  const totalRecommend = feedback.filter((f) => f.recommend).length;

  return {
    totalResponses: feedback.length,
    avgRating: Math.round((totalRating / feedback.length) * 10) / 10,
    recommendPct: Math.round((totalRecommend / feedback.length) * 100),
  };
}

// Returns counts for ratings 5 → 1, always all five rows.
export function computeRatingDistribution(
  feedback: FeedbackDoc[],
): RatingDistributionItem[] {
  return [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: feedback.filter((f) => f.rating === rating).length,
  }));
}

// Returns average ratings for each of the last 6 calendar months that have
// at least one feedback entry. Months with no data are omitted entirely.
export function computeMonthlyTrend(
  feedback: FeedbackDoc[],
): MonthlyTrendPoint[] {
  if (feedback.length === 0) return [];

  const now = new Date();

  // Pre-build buckets for the last 6 calendar months so we iterate them
  // in chronological order (oldest first).
  const buckets: { year: number; month: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ year: d.getFullYear(), month: d.getMonth() });
  }

  return buckets
    .map(({ year, month }) => {
      const monthFeedback = feedback.filter((f) => {
        const d = f.createdAt.toDate();
        return d.getFullYear() === year && d.getMonth() === month;
      });

      if (monthFeedback.length === 0) return null;

      const avg =
        monthFeedback.reduce((sum, f) => sum + f.rating, 0) /
        monthFeedback.length;

      return {
        month: MONTH_LABELS[month],
        value: Math.round(avg * 10) / 10,
      };
    })
    .filter((p): p is MonthlyTrendPoint => p !== null);
}

// Compares the last two months in the trend to produce a change indicator.
// Returns null when there aren't enough months to compare or there's no change.
export function computeTrendIndicator(
  trend: MonthlyTrendPoint[],
): TrendIndicator {
  if (trend.length < 2) return null;

  const latest = trend[trend.length - 1].value;
  const previous = trend[trend.length - 2].value;
  const diff = Math.round((latest - previous) * 10) / 10;

  if (diff === 0) return null;

  return {
    label: diff > 0 ? `+${diff}` : `${diff}`,
    direction: diff > 0 ? "up" : "down",
  };
}
