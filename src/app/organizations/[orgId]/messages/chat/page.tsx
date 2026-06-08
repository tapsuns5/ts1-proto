"use client";

import { OrgLayout } from "@/components/layout/OrgLayout";
import { NavItem, BreadcrumbItem } from "@/components/layout/types";
import TeamChatsDashboard from "@/components/TeamChatsDashboard";

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
      { label: "Team Chats", href: "/organizations/81656/messages/chat", active: true },
      { label: "Messages", href: "/organizations/81656/messages" },
    ],
  },
  { label: "Rostering", icon: "groups", href: "/organizations/81656/rostering" },
  { label: "Settings", icon: "settings", href: "/organizations/81656/settings" },
];

const mockBreadcrumbs: BreadcrumbItem[] = [
  { label: "Communications", href: "/organizations/81656/communications" },
  { label: "Team Chats", active: true },
];

export default function TeamChatsPage() {
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
      <TeamChatsDashboard />
    </OrgLayout>
  );
}
