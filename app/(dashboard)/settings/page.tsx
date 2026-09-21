"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";

import { useAuth } from "@/components/auth/auth-provider";
import { useBusiness } from "@/components/business/business-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { db } from "@/lib/firebase/client";

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

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { business, refreshBusiness } = useBusiness();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState(business?.name ?? "");
  const [category, setCategory] = useState(business?.category ?? "");
  const [location, setLocation] = useState(business?.location ?? "");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  if (!business) {
    return null;
  }

  const hasChanges =
    name.trim() !== business.name ||
    category !== business.category ||
    location.trim() !== business.location;

  async function handleSave() {
    if (!business || !name.trim() || !category || !location.trim()) {
      return;
    }

    setSaving(true);
    setSaved(false);
    setError("");

    try {
      await updateDoc(doc(db, "businesses", business.id), {
        name: name.trim(),
        category,
        location: location.trim(),
      });

      await refreshBusiness();

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to update business:", error);

      setError("We couldn't save your changes.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    await signOut();
  }

  return (
    <div className="max-w-3xl space-y-10 p-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your business and account preferences.
        </p>
      </div>

      <section>
        <SectionHeader
          title="Business"
          description="Information shown across your Expulse account."
        />

        <div className="divide-y border-y">
          <SettingRow
            label="Business name"
            description="The name customers see on your feedback page."
          >
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full sm:w-72"
            />
          </SettingRow>

          <SettingRow
            label="Category"
            description="Your primary type of business."
          >
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full justify-between sm:w-72",
                )}
              >
                {category}
                <ChevronDown className="size-4 opacity-60" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-72">
                {categories.map((item) => (
                  <DropdownMenuItem
                    key={item}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SettingRow>

          <SettingRow
            label="Location"
            description="Where this business operates."
          >
            <Input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="w-full sm:w-72"
            />
          </SettingRow>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges || saving}
          >
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving
              </>
            ) : saved ? (
              <>
                <Check className="size-4" />
                Saved
              </>
            ) : (
              "Save changes"
            )}
          </Button>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </section>

      <section>
        <SectionHeader
          title="Appearance"
          description="Choose how Expulse looks on this device."
        />

        <div className="divide-y border-y">
          <SettingRow
            label="Theme"
            description="Use light, dark, or your device preference."
          >
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full justify-between capitalize sm:w-48",
                )}
              >
                {theme ?? "system"}
                <ChevronDown className="size-4 opacity-60" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SettingRow>
        </div>
      </section>

      <section>
        <SectionHeader
          title="Account"
          description="Your Expulse account information."
        />

        <div className="divide-y border-y">
          <ReadOnlyRow label="Name" value={user?.displayName || "—"} />

          <ReadOnlyRow label="Email" value={user?.email || "—"} />
        </div>

        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={handleSignOut}
        >
          Sign out
        </Button>
      </section>
    </div>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold">{title}</h2>

      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-3 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <p className="text-sm font-medium">{label}</p>

        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>

      <div>{children}</div>
    </div>
  );
}

function ReadOnlyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[180px_1fr]">
      <p className="text-sm text-muted-foreground">{label}</p>

      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
