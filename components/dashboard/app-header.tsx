"use client";

import { useRouter } from "next/navigation";
import { Bell, LogOut, Moon, Settings, Sun, UserRound } from "lucide-react";
import { useTheme } from "next-themes";

import { useAuth } from "@/components/auth/auth-provider";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppHeader() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  // Use the user's name first, then email, for the avatar letter.
  const avatarLetter =
    user?.displayName?.charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "U";

  return (
    <header className="sticky top-0 z-40 h-14 border-b bg-background">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        {/* Product branding */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight">ExPulse</span>
        </div>

        {/* User actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="size-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Open user menu"
            >
              <Avatar className="size-8 cursor-pointer">
                <AvatarFallback>{avatarLetter}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    {user?.displayName && (
                      <span className="font-medium">{user.displayName}</span>
                    )}

                    <span className="truncate text-xs font-normal text-muted-foreground">
                      {user?.email ?? "Loading..."}
                    </span>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem onClick={toggleTheme}>
                  {isDark ? (
                    <Sun className="size-4" />
                  ) : (
                    <Moon className="size-4" />
                  )}
                  {isDark ? "Light mode" : "Dark mode"}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="size-4" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
