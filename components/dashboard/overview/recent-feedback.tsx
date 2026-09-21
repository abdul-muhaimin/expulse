import { type Timestamp } from "firebase/firestore";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { FeedbackDoc } from "@/lib/feedback";

// Derive a display sentiment from the 1–5 rating.
type Sentiment = "great" | "good" | "poor";

function ratingToSentiment(rating: number): Sentiment {
  if (rating >= 5) return "great";
  if (rating >= 3) return "good";
  return "poor";
}

const sentimentConfig: Record<
  Sentiment,
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

function formatRelativeTime(timestamp: Timestamp): string {
  const diffSeconds = Math.floor(
    (Date.now() - timestamp.toDate().getTime()) / 1000,
  );

  if (diffSeconds < 60) return "Just now";
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
  if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)}d ago`;

  return timestamp.toDate().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

type RecentFeedbackProps = {
  feedback: FeedbackDoc[];
};

export function RecentFeedback({ feedback }: RecentFeedbackProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent feedback</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {feedback.length === 0 ? (
          <p className="px-6 py-6 text-center text-sm text-muted-foreground">
            No feedback yet.
          </p>
        ) : (
          feedback.map((item, i) => {
            const sentiment = ratingToSentiment(item.rating);
            const config = sentimentConfig[sentiment];

            return (
              <div key={item.id}>
                {i > 0 && <Separator />}
                <div className="flex items-start gap-3 px-6 py-3.5">
                  {/* Sentiment dot */}
                  <span
                    className={`mt-1.5 size-2 shrink-0 rounded-full ${config.dotClass}`}
                    aria-hidden="true"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-semibold ${config.labelClass}`}>
                        {config.label}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatRelativeTime(item.createdAt)}
                      </span>
                    </div>

                    {item.comment ? (
                      <p className="mt-0.5 text-sm text-foreground">
                        {item.comment}
                      </p>
                    ) : (
                      <p className="mt-0.5 text-sm text-muted-foreground italic">
                        No comment left.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
