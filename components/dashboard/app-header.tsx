import { Bell } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 h-14 border-b bg-background">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        {/* Product branding */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight">expulse</span>
        </div>

        {/* User actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="size-4" />
          </Button>

          <Avatar className="size-8">
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
