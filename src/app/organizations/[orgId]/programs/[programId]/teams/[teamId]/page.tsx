"use client";

import { useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { SimpleIcon } from "@/components/SimpleIcon";
import { OrgLayout } from "@/components/layout/OrgLayout";
import { NavItem, BreadcrumbItem } from "@/components/layout/types";
import { TeamHeader } from "@/components/programs/TeamHeader";
import { ProgramTabs } from "@/components/programs/ProgramTabs";
import { TeamsSchedule } from "@/components/programs/TeamsSchedule";
import { TeamParticipants } from "@/components/programs/TeamParticipants";

const mockNavItems: NavItem[] = [
  { label: "Registrations", icon: "view_cozy", href: "/organizations/1/registrations" },
  { label: "Programs", icon: "menu_book", href: "/organizations/1/programs", active: true },
  { label: "Schedule", icon: "calendar_month", href: "/organizations/1/programs/85703/schedule" },
  { label: "Financials", icon: "payments", href: "/organizations/1/financials/transactions" },
  {
    label: "Communications",
    icon: "message",
    href: "/organizations/1/communications",
    hasSubmenu: true,
    items: [
      { label: "Team Chats", href: "/organizations/1/messages/chat" },
      { label: "Messages", href: "/organizations/1/messages" },
    ],
  },
  { label: "Rostering", icon: "groups", href: "/organizations/1/rostering" },
  { label: "Media", icon: "video_library", href: "/organizations/1/media" },
  { label: "Settings", icon: "settings", href: "/organizations/1/settings" },
];

const mockBreadcrumbs: BreadcrumbItem[] = [
  { label: "Programs", href: "/organizations/1/programs", active: true },
  { label: "Teams", href: "/organizations/1/programs/85703", active: true },
  { label: "Team Details", href: "", active: true },
];

export default function TeamPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const teamName = searchParams.get('teamName') || `Team ${params.teamId}`;
  const division = searchParams.get('division') || '';
  const teamId = searchParams.get('teamId') || (typeof params.teamId === 'string' ? params.teamId : params.teamId?.[0]);

  const tabs = [
    {
      id: "Schedule",
      label: "Schedule",
      content: <TeamsSchedule events={[]} teamName={teamName} teamId={teamId} />,
    },
    {
      id: "Participants",
      label: "Participants",
      content: <TeamParticipants teamName={teamName} />,
    },
  ];

  return (
    <OrgLayout
      orgName="Cypress Automation Org"
      orgLogo="https://org-files-public-<env>.teamsnap.com/org/232/logo.png"
      navItems={mockNavItems}
      breadcrumbs={mockBreadcrumbs}
      userName="John Doe"
      userInitials="JD"
      onHelpClick={() => console.log("Help clicked")}
    >
      <button
        onClick={() => router.back()}
        className="sui-flex sui-items-center sui-gap-2 sui-text-admin-action-text sui-text-body sui-font-medium sui-cursor-pointer sui-bg-transparent sui-border-none hover:sui-underline sui-mb-2"
      >
        <SimpleIcon name="arrow_back" size="s" />
        Back to teams
      </button>
      <TeamHeader
        teamName={teamName}
        status="active"
        programName={division || "Fall 2024 Season"}
        seasonName="Regular Season"
        onEdit={() => console.log("Edit team")}
        onArchive={() => console.log("Archive team")}
        onRostering={() => console.log("Go to rostering")}
      />
      <ProgramTabs tabs={tabs} defaultTab="Schedule" />
    </OrgLayout>
  );
}
