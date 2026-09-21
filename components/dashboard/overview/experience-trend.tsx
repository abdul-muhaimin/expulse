import { TrendingDown, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MonthlyTrendPoint, TrendIndicator } from "@/lib/feedback-metrics";

const WIDTH = 280;
const PLOT_TOP = 8;
const PLOT_BOTTOM = 60;
const LABEL_Y = 74;
const SVG_HEIGHT = 80;

function buildChartPaths(data: MonthlyTrendPoint[]) {
  const values = data.map((d) => d.value);
  const min = Math.min(...values) - 0.15;
  const max = Math.max(...values) + 0.05;
  const range = max - min;
  const n = data.length;
  const pad = 10;
  const plotWidth = WIDTH - pad * 2;
  const plotHeight = PLOT_BOTTOM - PLOT_TOP;

  const points = data.map((d, i) => ({
    x: pad + (i / (n - 1)) * plotWidth,
    y: PLOT_TOP + (1 - (d.value - min) / range) * plotHeight,
    month: d.month,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

  const first = points[0];
  const last = points[points.length - 1];
  const areaPath = `${linePath} L ${last.x.toFixed(1)},${PLOT_BOTTOM} L ${first.x.toFixed(1)},${PLOT_BOTTOM} Z`;

  return { points, linePath, areaPath };
}

type ExperienceTrendProps = {
  data: MonthlyTrendPoint[];
  trendIndicator: TrendIndicator;
};

export function ExperienceTrend({ data, trendIndicator }: ExperienceTrendProps) {
  const hasEnoughData = data.length >= 2;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Experience trend</CardTitle>

          {trendIndicator && (
            <span
              className={`flex items-center gap-1 text-xs font-medium ${
                trendIndicator.direction === "up"
                  ? "text-green-600 dark:text-green-500"
                  : "text-destructive"
              }`}
            >
              {trendIndicator.direction === "up" ? (
                <TrendingUp className="size-3.5" />
              ) : (
                <TrendingDown className="size-3.5" />
              )}
              {trendIndicator.label}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {hasEnoughData ? (
          <svg
            viewBox={`0 0 ${WIDTH} ${SVG_HEIGHT}`}
            className="w-full overflow-visible"
            aria-hidden="true"
          >
            {(() => {
              const { points, linePath, areaPath } = buildChartPaths(data);
              return (
                <>
                  <path
                    d={areaPath}
                    style={{ fill: "var(--color-primary)" }}
                    fillOpacity={0.08}
                  />
                  <path
                    d={linePath}
                    fill="none"
                    style={{ stroke: "var(--color-primary)" }}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {points.map((p) => (
                    <circle
                      key={p.month}
                      cx={p.x}
                      cy={p.y}
                      r={3}
                      style={{
                        fill: "var(--color-background)",
                        stroke: "var(--color-primary)",
                      }}
                      strokeWidth={1.5}
                    />
                  ))}
                  {points.map((p) => (
                    <text
                      key={`label-${p.month}`}
                      x={p.x}
                      y={LABEL_Y}
                      textAnchor="middle"
                      fontSize={9}
                      style={{ fill: "var(--color-muted-foreground)" }}
                    >
                      {p.month}
                    </text>
                  ))}
                </>
              );
            })()}
          </svg>
        ) : (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Not enough data to display a trend yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
