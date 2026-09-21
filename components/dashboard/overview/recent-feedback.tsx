import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type FeedbackItem, mockFeedback } from "@/lib/mock-data";

const sentimentConfig: Record<
  FeedbackItem["sentiment"],
  { label: string; dotClass: string; labelClass: string }
> = {
  great: {
    label: "Great",
    dotClass: "bg-green-500",
    labelClass: "text-green-700 dark:text-green-500",
  },
  good: {
    label: "Good",
    dotClass: "bg-muted-foreground/40",
    labelClass: "text-muted-foreground",
  },
  poor: {
    label: "Poor",
    dotClass: "bg-destructive",
    labelClass: "text-destructive",
  },
};

export function RecentFeedback() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent feedback</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {mockFeedback.map((item, i) => {
          const config = sentimentConfig[item.sentiment];
          return (
            <div key={i}>
              {i > 0 && <Separator />}
              <div className="flex items-start gap-3 px-6 py-3.5">
                {/* Sentiment dot */}
                <span
                  className={`mt-1.5 size-2 shrink-0 rounded-full ${config.dotClass}`}
                  aria-hidden="true"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-semibold ${config.labelClass}`}
                    >
                      {config.label}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {item.time}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-foreground">{item.text}</p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
