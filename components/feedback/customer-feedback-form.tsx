"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, CheckCircle2 } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/firebase/client";
import {
  hasRecentFeedback,
  markFeedbackSubmitted,
} from "@/lib/feedback-cooldown";

type Business = {
  id: string;
  name: string;
  category: string;
  location: string;
};

const ratings = [
  { value: 1, emoji: "😞", label: "Very bad" },
  { value: 2, emoji: "😕", label: "Bad" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😍", label: "Excellent" },
];

export function CustomerFeedbackForm({ business }: { business: Business }) {
  const [rating, setRating] = useState<number | null>(null);
  const [recommend, setRecommend] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");

  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = setTimeout(() => {
      setAlreadySubmitted(hasRecentFeedback(business.id));
    }, 0);
    return () => clearTimeout(id);
  }, [business.id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (rating === null) {
      setError("Please rate your experience.");
      return;
    }

    if (recommend === null) {
      setError("Please tell us if you would recommend this business.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await addDoc(collection(db, "feedback"), {
        businessId: business.id,
        rating,
        recommend,
        comment: comment.trim(),
        createdAt: serverTimestamp(),
      });

      markFeedbackSubmitted(business.id);
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit feedback:", error);

      setError("We couldn't submit your feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (alreadySubmitted) {
    return (
      <div className="py-10 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
          <Check className="size-5" />
        </div>

        <h2 className="mt-4 text-xl font-semibold">Thanks for your feedback</h2>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          You&apos;ve already shared feedback with {business.name} recently.
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="size-7" />
          </div>

          <h2 className="mt-5 text-xl font-semibold">Thank you!</h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Your feedback has been shared with {business.name}.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend className="text-center text-lg font-semibold">
              How was your experience today?
            </legend>

            <div className="mt-5 grid grid-cols-5 gap-2">
              {ratings.map((item) => {
                const selected = rating === item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setRating(item.value);
                      setError("");
                    }}
                    aria-label={item.label}
                    aria-pressed={selected}
                    className={`rounded-xl border px-1 py-3 text-center transition ${
                      selected
                        ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                        : "hover:bg-muted"
                    }`}
                  >
                    <span className="block text-2xl">{item.emoji}</span>

                    <span className="mt-1 block text-xs text-muted-foreground">
                      {item.value}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="my-7 border-t" />

          <fieldset>
            <legend className="text-sm font-medium">
              Would you recommend {business.name}?
            </legend>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={recommend === true ? "default" : "outline"}
                onClick={() => {
                  setRecommend(true);
                  setError("");
                }}
              >
                Yes
              </Button>

              <Button
                type="button"
                variant={recommend === false ? "default" : "outline"}
                onClick={() => {
                  setRecommend(false);
                  setError("");
                }}
              >
                No
              </Button>
            </div>
          </fieldset>

          <div className="my-7 border-t" />

          <div>
            <label htmlFor="comment" className="text-sm font-medium">
              Anything you&apos;d like us to know?
            </label>

            <p className="mt-1 text-xs text-muted-foreground">Optional</p>

            <textarea
              id="comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              maxLength={1000}
              rows={4}
              placeholder="Tell us about your experience..."
              className="mt-3 flex w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />

            <p className="mt-1 text-right text-xs text-muted-foreground">
              {comment.length}/1000
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="mt-6 w-full"
            size="lg"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit feedback"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
