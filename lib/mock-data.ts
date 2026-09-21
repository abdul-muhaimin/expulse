export const mockPulse = {
  experience: { value: 4.6, max: 5, change: 6 },
  recommend: { value: 91, change: 3 },
  nps: { value: 64, change: 8 },
  responses: { value: 247 },
};

export const mockTrend: { month: string; value: number }[] = [
  { month: "Apr", value: 4.1 },
  { month: "May", value: 4.3 },
  { month: "Jun", value: 4.2 },
  { month: "Jul", value: 4.4 },
  { month: "Aug", value: 4.3 },
  { month: "Sep", value: 4.6 },
];

export const mockAttention = [
  { label: "Waiting time", count: 17 },
  { label: "Service", count: 8 },
  { label: "Quality", count: 4 },
];

export type FeedbackSentiment = "great" | "good" | "poor";

export type FeedbackItem = {
  sentiment: FeedbackSentiment;
  text: string;
  time: string;
};

export const mockFeedback: FeedbackItem[] = [
  {
    sentiment: "great",
    text: "Great experience and friendly staff.",
    time: "10m ago",
  },
  {
    sentiment: "good",
    text: "Food was good and staff were helpful.",
    time: "1h ago",
  },
  {
    sentiment: "poor",
    text: "Waited too long for our order.",
    time: "2h ago",
  },
];
