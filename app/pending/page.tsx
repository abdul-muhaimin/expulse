"use client";

import { useRouter } from "next/navigation";
import { Clock3, LogOut } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PendingPage() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <p className="text-xl font-semibold tracking-tight">expulse</p>
        </div>

        <Card>
          <CardHeader>
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Clock3 className="size-6" />
            </div>

            <CardTitle>Business submitted</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">
              Your business has been submitted for review. Once approved, you&apos;ll
              be able to start collecting customer feedback.
            </p>

            {user?.email && (
              <p className="mt-4 text-xs text-muted-foreground">
                Signed in as {user.email}
              </p>
            )}

            <Button
              variant="outline"
              className="mt-6 w-full"
              onClick={handleSignOut}
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
