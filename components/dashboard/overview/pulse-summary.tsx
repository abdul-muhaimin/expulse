import { Star, ThumbsUp, Users } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PulseMetrics } from "@/lib/feedback-metrics";

type Metric = {
  label: string;
  value: string;
  suffix?: string;
  sublabel: string;
  icon: typeof Star;
};

function buildMetrics(metrics: PulseMetrics): Metric[] {
  const hasData = metrics.totalResponses > 0;

  return [
    {
      label: "Experience",
      value: hasData ? metrics.avgRating.toFixed(1) : "—",
      suffix: "/ 5",
      sublabel: "Average rating",
      icon: Star,
    },
    {
      label: "Recommend",
      value: hasData ? `${metrics.recommendPct}%` : "—",
      sublabel: "Would recommend",
      icon: ThumbsUp,
    },
    {
      label: "Responses",
      value: metrics.totalResponses.toString(),
      sublabel: "Total responses",
      icon: Users,
    },
  ];
}

type PulseSummaryProps = {
  metrics: PulseMetrics;
};

export function PulseSummary({ metrics }: PulseSummaryProps) {
  const items = buildMetrics(metrics);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer pulse</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label}>
                <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
                  <Icon className="size-3.5 shrink-0" />
                  <span className="text-xs font-medium">{item.label}</span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-semibold tabular-nums tracking-tight">
                    {item.value}
                  </span>
                  {item.suffix && (
                    <span className="text-sm text-muted-foreground">
                      {item.suffix}
                    </span>
                  )}
                </div>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.sublabel}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
