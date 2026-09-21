"use client";

import { useMemo, useState } from "react";
import { MessageSquareText } from "lucide-react";

import { useBusiness } from "@/components/business/business-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type FeedbackDoc, useBusinessFeedback } from "@/lib/feedback";

type Filter = "all" | "positive" | "attention";

export default function FeedbackPage() {
  const { business } = useBusiness();

  const { feedback, loading, error } = useBusinessFeedback();

  const [filter, setFilter] = useState<Filter>("all");

  const filteredFeedback = useMemo(() => {
    if (filter === "positive") {
      return feedback.filter((item) => item.rating >= 4 && item.recommend);
    }

    if (filter === "attention") {
      return feedback.filter((item) => item.rating <= 2 || !item.recommend);
    }

    return feedback;
  }, [feedback, filter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Feedback</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          See what your customers are saying about their experiences.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterButton
          active={filter === "all"}
          onClick={() => setFilter("all")}
        >
          All
        </FilterButton>

        <FilterButton
          active={filter === "positive"}
          onClick={() => setFilter("positive")}
        >
          Positive
        </FilterButton>

        <FilterButton
          active={filter === "attention"}
          onClick={() => setFilter("attention")}
        >
          Needs attention
        </FilterButton>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground">Loading feedback...</p>
      )}

      {error && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-sm text-destructive">
              We couldn&apos;t load your feedback.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && feedback.length === 0 && <EmptyFeedback />}

      {!loading &&
        !error &&
        feedback.length > 0 &&
        filteredFeedback.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-sm text-muted-foreground">
                No feedback matches this filter.
              </p>
            </CardContent>
          </Card>
        )}

      {!loading && !error && filteredFeedback.length > 0 && (
        <div className="space-y-3">
          {filteredFeedback.map((item) => (
            <FeedbackCard key={item.id} feedback={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant={active ? "default" : "outline"}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function FeedbackCard({ feedback }: { feedback: FeedbackDoc }) {
  const createdAt = feedback.createdAt?.toDate?.();

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p
                className="text-base tracking-wide"
                aria-label={`${feedback.rating} out of 5 stars`}
              >
                {renderStars(feedback.rating)}
              </p>

              <Badge variant="outline">
                {feedback.recommend ? "Recommended" : "Not recommended"}
              </Badge>
            </div>

            {feedback.comment ? (
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6">
                {feedback.comment}
              </p>
            ) : (
              <p className="mt-3 text-sm italic text-muted-foreground">
                No written comment
              </p>
            )}
          </div>

          {createdAt && (
            <time
              dateTime={createdAt.toISOString()}
              className="shrink-0 text-xs text-muted-foreground"
            >
              {formatFeedbackDate(createdAt)}
            </time>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyFeedback() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center py-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <MessageSquareText className="size-5 text-muted-foreground" />
        </div>

        <h2 className="mt-4 font-medium">No feedback yet</h2>

        <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
          Customer feedback will appear here once people start submitting
          responses.
        </p>
      </CardContent>
    </Card>
  );
}

function renderStars(rating: number) {
  return `${"★".repeat(rating)}${"☆".repeat(5 - rating)}`;
}

function formatFeedbackDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
