import {
  ArrowUpRight,
  MessageSquareText,
  Star,
  ThumbsUp,
  Users,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const metrics = [
  {
    label: "Experience",
    value: "4.6 / 5",
    detail: "+6% this month",
    icon: Star,
  },
  {
    label: "Recommend",
    value: "91%",
    detail: "+3% this month",
    icon: ThumbsUp,
  },
  {
    label: "NPS",
    value: "+64",
    detail: "+8 this month",
    icon: ArrowUpRight,
  },
  {
    label: "Responses",
    value: "247",
    detail: "this month",
    icon: Users,
  },
];

export function ProductPreview() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">
            Your customer pulse
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Understand the month at a glance.
          </h2>

          <p className="mt-3 text-muted-foreground">
            Simple numbers tell you how customers felt and where your business
            may need attention.
          </p>
        </div>

        {/* This is a visual product example, not live customer data. */}
        <Card className="mx-auto mt-10 max-w-4xl">
          <CardHeader className="border-b">
            <div className="flex items-center gap-2">
              <MessageSquareText className="size-5 text-primary" />

              <CardTitle className="text-base">
                September customer pulse
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="grid grid-cols-2 divide-x divide-y md:grid-cols-4 md:divide-y-0">
              {metrics.map((metric) => {
                const Icon = metric.icon;

                return (
                  <div key={metric.label} className="p-5 md:p-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icon className="size-4" />

                      <span className="text-xs font-medium">
                        {metric.label}
                      </span>
                    </div>

                    <p className="mt-3 text-2xl font-semibold tracking-tight">
                      {metric.value}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {metric.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          Example data shown for illustration.
        </p>
      </div>
    </section>
  );
}
