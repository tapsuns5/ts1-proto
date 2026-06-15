"use client";

import { useState } from "react";
import { OrgLayout } from "@/components/layout/OrgLayout";
import { NavItem, BreadcrumbItem } from "@/components/layout/types";
import { ProgramHeader } from "@/components/programs/ProgramHeader";
import { ProgramTabs } from "@/components/programs/ProgramTabs";
import { ScheduleTab } from "@/components/programs/ScheduleTab";
import { EditProgramDialog } from "@/components/programs/EditProgramDialog";

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
];

const mockEvents = [
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    date: "Sat Jan 1, 2022",
    time: "7:00 PM - 8:00 PM",
    timezone: "America/New_York",
    type: "other" as const,
    name: "Game 1",
    team: "BearsZ",
    status: "canceled" as const,
    venue: "Main Stadium",
    subvenue: "Field 1",
    hasConflict: false,
  },
  {
    id: "223e4567-e89b-12d3-a456-426614174001",
    date: "Sat Jan 1, 2022",
    time: "9:00 AM - 10:00 AM",
    timezone: "America/New_York",
    type: "game" as const,
    name: "Game 2",
    team: "Tigers",
    status: "draft" as const,
    venue: "Field A",
    subvenue: "Primary",
    hasConflict: true,
  },
  {
    id: "323e4567-e89b-12d3-a456-426614174002",
    date: "Sun Jan 2, 2022",
    time: "5:00 PM - 6:00 PM",
    timezone: "America/New_York",
    type: "practice" as const,
    name: "Practice",
    team: "Lions",
    status: "published" as const,
    venue: "Field B",
    subvenue: "Secondary",
    hasConflict: true,
  },
  {
    id: "423e4567-e89b-12d3-a456-426614174003",
    date: "Sun Jan 2, 2022",
    time: "2:00 PM - 3:00 PM",
    timezone: "America/New_York",
    type: "game" as const,
    name: "Game 3",
    team: "Eagles",
    status: "published" as const,
    venue: "Field A",
    subvenue: "Primary",
    hasConflict: true,
  },
  {
    id: "523e4567-e89b-12d3-a456-426614174004",
    date: "Mon Jan 3, 2022",
    time: "11:00 AM - 12:00 PM",
    timezone: "America/New_York",
    type: "practice" as const,
    name: "Team Practice",
    team: "Wolves",
    status: "draft" as const,
    venue: "Community Center",
    subvenue: "Gym",
    hasConflict: false,
  },
];

const mockProgram = {
  programName: "FTL Optimist Baseball League Spring",
  status: "active" as const,
  startDate: "Jan 1, 2026",
  endDate: "Dec 31, 2026",
  sport: "Baseball",
  type: "League",
  activeDates: [new Date("2026-01-01"), new Date("2026-12-31")] as [Date, Date],
  enableStandings: false,
};

export default function ProgramPage() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const tabs = [
    {
      id: "teams",
      label: "Teams",
      content: <div className="sui-p-4">Teams content coming soon</div>,
    },
    {
      id: "participants",
      label: "Participants",
      content: <div className="sui-p-4">Participants content coming soon</div>,
    },
    {
      id: "schedule",
      label: "Schedule",
      content: <ScheduleTab events={mockEvents} />,
    },
    {
      id: "standings",
      label: "Standings",
      content: <div className="sui-p-4">Standings content coming soon</div>,
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
      <ProgramHeader
        programName={mockProgram.programName}
        status={mockProgram.status}
        startDate={mockProgram.startDate}
        endDate={mockProgram.endDate}
        onEdit={() => setEditDialogOpen(true)}
        onArchive={() => console.log("Archive program")}
        onRostering={() => console.log("Go to rostering")}
      />
      <ProgramTabs tabs={tabs} defaultTab="schedule" />
      <EditProgramDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        initialData={{
          programName: mockProgram.programName,
          sport: mockProgram.sport,
          type: mockProgram.type,
          activeDates: mockProgram.activeDates,
          enableStandings: mockProgram.enableStandings,
        }}
      />
    </OrgLayout>
  );
}
