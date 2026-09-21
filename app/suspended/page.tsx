"use client";

import { useRouter } from "next/navigation";
import { CircleAlert, LogOut } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SuspendedPage() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-md text-center">
        <p className="mb-8 text-xl font-semibold tracking-tight">expulse</p>

        <Card>
          <CardHeader>
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <CircleAlert className="size-6" />
            </div>

            <CardTitle>Business suspended</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">
              Access to this business has been suspended. Please contact Expulse
              if you believe this is a mistake.
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
