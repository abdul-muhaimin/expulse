import { Clock, Users, Package, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockAttention } from "@/lib/mock-data";

// Icons mapped by position in the attention list
const issueIcons = [Clock, Users, Package];

export function AttentionCard() {
  const maxCount = mockAttention[0].count;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Needs attention</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockAttention.map((item, i) => {
          const Icon = issueIcons[i] ?? Clock;
          const barWidth = Math.round((item.count / maxCount) * 100);

          return (
            <div key={item.label}>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <Icon className="size-3.5 shrink-0 text-muted-foreground" />
                  <span>{item.label}</span>
                </div>
                <span className="text-sm font-medium tabular-nums text-destructive">
                  {item.count}
                </span>
              </div>

              {/* Proportional bar */}
              <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-destructive/60"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="ghost" size="sm" className="-ml-2 gap-1 text-muted-foreground">
          View feedback
          <ArrowRight className="size-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
