"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { SignupForm } from "@/components/auth/signup-form";
import { useAuth } from "@/components/auth/auth-provider";

export default function SignupPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            expulse
          </Link>

          <h1 className="mt-6 text-2xl font-semibold tracking-tight">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Start understanding what your customers really think.
          </p>
        </div>

        <SignupForm />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
