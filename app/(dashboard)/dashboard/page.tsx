import { OverviewHeader } from "@/components/dashboard/overview/overview-header";
import { PulseSummary } from "@/components/dashboard/overview/pulse-summary";
import { ExperienceTrend } from "@/components/dashboard/overview/experience-trend";
import { AttentionCard } from "@/components/dashboard/overview/attention-card";
import { RecentFeedback } from "@/components/dashboard/overview/recent-feedback";

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 p-4 md:space-y-6 md:p-6">
      <OverviewHeader />

      <PulseSummary />

      {/* Two-column on large screens: trend takes 2/3, attention takes 1/3 */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ExperienceTrend />
        </div>
        <AttentionCard />
      </div>

      <RecentFeedback />
    </div>
  );
}
