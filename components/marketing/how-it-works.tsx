import { BarChart3, MessageSquareText, QrCode } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    title: "Display your QR",
    description:
      "Place your Expulse QR code where customers can easily scan it.",
    icon: QrCode,
  },
  {
    number: "02",
    title: "Customers share feedback",
    description:
      "Customers answer a few quick questions about their experience.",
    icon: MessageSquareText,
  },
  {
    number: "03",
    title: "See how you're doing",
    description:
      "Understand customer experience, recommendations, and what needs attention.",
    icon: BarChart3,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-muted/30 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">How it works</p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Feedback without the complicated surveys.
          </h2>

          <p className="mt-3 text-muted-foreground">
            Get started in minutes and give customers a quick way to tell you
            how their experience went.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <Card key={step.number}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>

                    <span className="text-sm font-medium text-muted-foreground">
                      {step.number}
                    </span>
                  </div>

                  <CardTitle className="pt-3 text-lg">{step.title}</CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
