"use client";

import { OverviewHeader } from "@/components/dashboard/overview/overview-header";
import { PulseSummary } from "@/components/dashboard/overview/pulse-summary";
import { ExperienceTrend } from "@/components/dashboard/overview/experience-trend";
import { RatingDistribution } from "@/components/dashboard/overview/rating-distribution";
import { RecentFeedback } from "@/components/dashboard/overview/recent-feedback";
import { useBusinessFeedback } from "@/lib/feedback";
import {
  computeMetrics,
  computeMonthlyTrend,
  computeRatingDistribution,
  computeTrendIndicator,
} from "@/lib/feedback-metrics";

export default function DashboardPage() {
  const { feedback, loading, error } = useBusinessFeedback();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-6xl p-4 md:p-6">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  const metrics = computeMetrics(feedback);
  const trend = computeMonthlyTrend(feedback);
  const trendIndicator = computeTrendIndicator(trend);
  const ratingDist = computeRatingDistribution(feedback);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 p-4 md:space-y-6 md:p-6">
      <OverviewHeader />

      <PulseSummary metrics={metrics} />

      {/* Two-column on large screens: trend takes 2/3, distribution takes 1/3 */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ExperienceTrend data={trend} trendIndicator={trendIndicator} />
        </div>
        <RatingDistribution
          distribution={ratingDist}
          total={metrics.totalResponses}
        />
      </div>

      <RecentFeedback feedback={feedback.slice(0, 10)} />
    </div>
  );
}
