"use client";

import { OrgLayout } from "@/components/layout/OrgLayout";
import { NavItem, BreadcrumbItem } from "@/components/layout/types";

const mockNavItems: NavItem[] = [
  { label: "Registrations", icon: "view_cozy", href: "/organizations/81656/registrations" },
  { label: "Programs", icon: "menu_book", href: "/organizations/81656/programs" },
  { label: "Financials", icon: "payments", href: "/organizations/81656/financials" },
  {
    label: "Communications",
    icon: "message",
    href: "/organizations/81656/communications",
    hasSubmenu: true,
    items: [
      { label: "Team Chats", href: "/organizations/81656/messages/chat" },
      { label: "Messages", href: "/organizations/81656/messages", active: true },
    ],
  },
  { label: "Rostering", icon: "groups", href: "/organizations/81656/rostering" },
  { label: "Settings", icon: "settings", href: "/organizations/81656/settings" },
];

const mockBreadcrumbs: BreadcrumbItem[] = [
  { label: "Communications", href: "/organizations/81656/communications" },
  { label: "Messages", active: true },
];

export default function MessagesPage() {
  return (
    <OrgLayout
      orgName="Tyler Palmer"
      orgLogo="https://ts-public-assets.teamsnap.com/sports/5/icon/v2/Q3N7Xt4HzM8Bu5ln90ywU.svg"
      navItems={mockNavItems}
      breadcrumbs={mockBreadcrumbs}
      userName="John Doe"
      userInitials="TP"
      onHelpClick={() => console.log("Help clicked")}
    >
      <div className="sui-p-4">
        <h1 className="sui-heading-lg sui-text-neutral-text">Messages</h1>
        <p className="sui-text-neutral-text-medium sui-mt-2">
          Messages content coming soon.
        </p>
      </div>
    </OrgLayout>
  );
}
