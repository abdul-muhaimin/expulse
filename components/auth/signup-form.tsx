"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      // Create the real Firebase Auth account.
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      // Store the display name in Firebase Auth.
      await updateProfile(credential.user, {
        displayName: name.trim(),
      });

      // Create the Expulse user profile.
      //
      // The document ID is the same as the Firebase Auth UID.
      // This makes ownership checks simple and secure.
      await setDoc(doc(db, "users", credential.user.uid), {
        name: name.trim(),
        email: credential.user.email,
        createdAt: serverTimestamp(),
      });

      // The user doesn't have a business yet.
      // Business onboarding is the next step.
      router.push("/onboarding");
    } catch (error) {
      console.error("Signup failed:", error);

      setError(
        "We couldn't create your account. Please check your details and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your details</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Your name</Label>

            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Abdul"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessName">Business name</Label>

            <Input
              id="businessName"
              name="businessName"
              type="text"
              placeholder="Your business"
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@business.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>

            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 6 characters"
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={isSubmitting}
            />

            <p className="text-xs text-muted-foreground">
              Use at least 6 characters.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
