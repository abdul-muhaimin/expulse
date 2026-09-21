"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { db } from "@/lib/firebase/client";
import { useBusiness } from "../business/business-provider";

const categories = [
  "Restaurant / Café",
  "Guesthouse / Hotel",
  "Retail",
  "Salon / Beauty",
  "Healthcare",
  "Professional Services",
  "Activities / Tours",
  "Other",
];

export function BusinessOnboardingForm() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { refreshBusiness } = useBusiness();

  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      setError("You must be logged in to set up a business.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      // Create the business first.
      const businessRef = await addDoc(collection(db, "businesses"), {
        ownerId: user.uid,
        name: businessName.trim(),
        category,
        location: location.trim(),
        status: "pending",
        createdAt: serverTimestamp(),
      });

      // Connect the logged-in user to their business.
      await updateDoc(doc(db, "users", user.uid), {
        businessId: businessRef.id,
      });

      await refreshBusiness();

      router.replace("/pending");
    } catch (error) {
      console.error("Business onboarding failed:", error);

      setError("We couldn't set up your business. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Business details</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business name</Label>

            <Input
              id="businessName"
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
              placeholder="Sam's Café"
              required
              disabled={isSubmitting || loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>

            <select
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              required
              disabled={isSubmitting || loading}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled>
                Select a category
              </option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Island / location</Label>

            <Input
              id="location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Malé"
              required
              disabled={isSubmitting || loading}
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || loading}
          >
            {isSubmitting ? "Submitting..." : "Submit business"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
