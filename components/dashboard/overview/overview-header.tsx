import { ChevronDown } from "lucide-react";
import { cn } from "cn";

import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { RollingPeriod } from "@/lib/feedback-metrics";

type OverviewHeaderProps = {
  periods: RollingPeriod[];
  selectedPeriod: RollingPeriod;
  onPeriodChange: (period: RollingPeriod) => void;
};

export function OverviewHeader({
  periods,
  selectedPeriod,
  onPeriodChange,
}: OverviewHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&#39;s how customers experienced your business over the last{" "}
          {selectedPeriod.days} days.
        </p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "mt-0.5 shrink-0",
          )}
        >
          {selectedPeriod.label}
          <ChevronDown className="size-3.5 opacity-60" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {periods.map((period) => (
            <DropdownMenuItem
              key={period.days}
              onClick={() => onPeriodChange(period)}
            >
              {period.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
