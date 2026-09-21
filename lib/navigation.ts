import {
  LayoutDashboard,
  MessageSquareText,
  FileText,
  QrCode,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  /** Shorter label for constrained spaces like mobile nav */
  shortLabel?: string;
  href: string;
  icon: LucideIcon;
};

export const navigationItems: NavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Feedback",
    href: "/feedback",
    icon: MessageSquareText,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    label: "QR Code",
    shortLabel: "QR",
    href: "/qr-code",
    icon: QrCode,
  },
];
