import { Star, ThumbsUp, TrendingUp, Users } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockPulse } from "@/lib/mock-data";

type Metric = {
  label: string;
  value: string;
  suffix?: string;
  change: string;
  icon: typeof Star;
  positive: boolean;
};

const metrics: Metric[] = [
  {
    label: "Experience",
    value: mockPulse.experience.value.toString(),
    suffix: `/ ${mockPulse.experience.max}`,
    change: `+${mockPulse.experience.change}% from last month`,
    icon: Star,
    positive: true,
  },
  {
    label: "Recommend",
    value: `${mockPulse.recommend.value}%`,
    change: `+${mockPulse.recommend.change}% from last month`,
    icon: ThumbsUp,
    positive: true,
  },
  {
    label: "NPS",
    value: `+${mockPulse.nps.value}`,
    change: `+${mockPulse.nps.change} from last month`,
    icon: TrendingUp,
    positive: true,
  },
  {
    label: "Responses",
    value: mockPulse.responses.value.toString(),
    change: "this month",
    icon: Users,
    positive: false,
  },
];

export function PulseSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer pulse</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label}>
                <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
                  <Icon className="size-3.5 shrink-0" />
                  <span className="text-xs font-medium">{metric.label}</span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-semibold tabular-nums tracking-tight">
                    {metric.value}
                  </span>
                  {metric.suffix && (
                    <span className="text-sm text-muted-foreground">
                      {metric.suffix}
                    </span>
                  )}
                </div>

                <p
                  className={`mt-0.5 text-xs ${
                    metric.positive
                      ? "text-green-600 dark:text-green-500"
                      : "text-muted-foreground"
                  }`}
                >
                  {metric.change}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
