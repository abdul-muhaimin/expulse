import { Star } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { RatingDistributionItem } from "@/lib/feedback-metrics";

type RatingDistributionProps = {
  distribution: RatingDistributionItem[];
  total: number;
};

export function RatingDistribution({
  distribution,
  total,
}: RatingDistributionProps) {
  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Rating distribution</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {total === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No ratings yet.
          </p>
        ) : (
          distribution.map((item) => {
            const barWidth = Math.round((item.count / maxCount) * 100);
            return (
              <div key={item.rating}>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Star className="size-3.5 shrink-0 text-muted-foreground" />
                    <span>{item.rating}</span>
                  </div>
                  <span className="text-sm font-medium tabular-nums text-muted-foreground">
                    {item.count}
                  </span>
                </div>

                <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary/60"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
