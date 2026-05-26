"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OrgLayout } from "@/components/layout/OrgLayout";
import { NavItem, BreadcrumbItem } from "@/components/layout/types";
import LabelButton from "@/components/LabelButton/LabelButton";
import Tabs from "@/components/Tabs/Tabs";
import { Card, CardHeader, CardFooter } from "@/components/Card/Card";
import Badge from "@/components/Badge/Badge";
import IconButton from "@/components/IconButton/IconButton";
import Icon from "@/components/Icon/Icon";

const mockNavItems: NavItem[] = [
  { label: "Registrations", icon: "view_cozy", href: "/organizations/81656/registrations" },
  { label: "Programs", icon: "menu_book", href: "/organizations/81656/programs", active: true },
  { label: "Financials", icon: "payments", href: "/organizations/81656/financials" },
  { label: "Communications", icon: "message", href: "/organizations/81656/communications", hasSubmenu: true },
  { label: "Rostering", icon: "groups", href: "/organizations/81656/rostering" },
  { label: "Settings", icon: "settings", href: "/organizations/81656/settings" },
];

const mockBreadcrumbs: BreadcrumbItem[] = [
  { label: "Programs", href: "/organizations/81656/programs", active: true },
];

const mockPrograms = [
  {
    id: "85703",
    name: "FTL Optimist Baseball League Spring",
    status: "active",
    startDate: new Date("2026-05-01"),
    endDate: new Date("2026-05-31"),
    totalParticipants: 16,
    players: 8,
    staff: 8,
    teams: 3,
  },
  {
    id: "90752",
    name: "New Program",
    status: "active",
    startDate: new Date("2026-01-01"),
    endDate: new Date("2026-12-31"),
    totalParticipants: 0,
    players: 0,
    staff: 0,
    teams: 0,
  },
  {
    id: "88277",
    name: "RCX",
    status: "no-dates",
    startDate: null,
    endDate: null,
    totalParticipants: 0,
    players: 0,
    staff: 0,
    teams: 0,
  },
];

export default function ProgramsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("active");

  const formatDateRange = (startDate: Date | null, endDate: Date | null) => {
    if (!startDate && !endDate) return "No dates";
    const start = startDate ? startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "No start date";
    const end = endDate ? endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "No end date";
    return `${start} - ${end}`;
  };

  const ProgramCard = ({ program }: { program: typeof mockPrograms[0] }) => {
    const isEmpty = program.totalParticipants === 0;
    
    return (
      <Card className="sui-rounded sui-shadow-2 sui-border sui-border-solid sui-border-transparent sui-bg-white sui-px-3 sui-py-2" data-testid={`program-card-${program.id}`}>
        <CardHeader className="sui-flex sui-justify-between sui-mb-0.5 sui-flex-row sui-items-start sui-space-y-0">
          <h2 className="sui-heading-sm sui-text-action-text hover:sui-underline">
            <button 
              onClick={() => router.push(`/organizations/81656/programs/${program.id}`)}
              className="sui-text-action-text hover:sui-underline sui-bg-transparent sui-p-0 sui-cursor-pointer sui-align-middle sui-w-fit sui-border-b sui-border-solid sui-border-transparent sui-pb-px hover:sui-text-admin-action-text-hover hover:[border-color:currentColor] focus:sui-text-admin-action-text-pressed focus:[border-color:currentColor] active:sui-text-admin-action-text-pressed active:[border-color:currentColor] visited:sui-text-admin-action-text-pressed"
            >
              {program.name}
            </button>
          </h2>
          <div className="sui-flex sui-gap-1">
            <IconButton
              icon="edit"
              aria-label="Edit program"
              className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent active:sui-scale-95 sui-text-neutral-icon hover:sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover hover:sui-text-action-icon active:sui-bg-admin-action-background-weak-pressed sui-h-[48px] sui-w-[48px] sui-min-w-[48px]"
            />
            <IconButton
              icon="archive"
              aria-label="Archive program"
              className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent sui-h-[48px] sui-w-[48px] sui-min-w-[48px] sui-text-neutral-icon hover:sui-border-transparent hover:sui-bg-transparent hover:sui-text-neutral-icon-disabled active:sui-scale-100 active:sui-bg-transparent"
              disabled={program.status === "active" && program.totalParticipants > 0}
            />
          </div>
        </CardHeader>
        
        <div className="sui-flex sui-gap-2 sui-mb-1">
          {program.status === "active" && (
            <Badge labelText="Active" variant="positive" className="sui-label sui-text-neutral-text-medium sui-flex sui-gap-1 sui-items-center">
              <span className="sui-h-1 sui-w-1 sui-bg-positive-icon sui-block sui-rounded-[9999px]"></span>
            </Badge>
          )}
          <p className="sui-flex sui-items-center sui-label sui-gap-0.5 sui-text-neutral-text-medium">
            <Icon name="calendar_month" size="s" />
            {formatDateRange(program.startDate, program.endDate)}
          </p>
        </div>

        {program.status === "no-dates" && (
          <div className="sui-grid sui-place-content-center sui-gap-2 sui-p-1 sui-mb-2">
            <LabelButton
              variantType="secondary"
              size="small"
              labelText="Add active dates"
            />
          </div>
        )}

        {isEmpty ? (
          <footer className="sui-grid sui-place-content-center sui-gap-2 sui-p-1">
            <p>No teams or participants.</p>
            <a 
              href={`/organizations/81656/programs/${program.id}`}
              className="LabelButton-module__LabelButton___wUVxI LabelButton-module__type-secondary___X-qqG LabelButton-module__size-small___zI5ht sui-pr-2"
              data-discover="true"
            >
              Continue set up <Icon name="arrow_forward" size="s" />
            </a>
          </footer>
        ) : (
          <>
            <hr className="sui-border-neutral-border sui-my-2" />
            <footer className="sui-flex sui-justify-between sui-px-3">
              <div>
                <p className="sui-caption sui-uppercase sui-mb-0.5">Total Participants</p>
                <p className="sui-heading-md">{program.totalParticipants}</p>
              </div>
              <div>
                <p className="sui-caption sui-uppercase sui-mb-0.5">Players</p>
                <p className="sui-heading-md">{program.players}</p>
              </div>
              <div>
                <p className="sui-caption sui-uppercase sui-mb-0.5">Staff</p>
                <p className="sui-heading-md">{program.staff}</p>
              </div>
              <div>
                <p className="sui-caption sui-uppercase sui-mb-0.5">Teams</p>
                <p className="sui-heading-md">{program.teams}</p>
              </div>
            </footer>
          </>
        )}
      </Card>
    );
  };

  const tabs = [
    { value: "active", label: "Active", content: "" },
    { value: "archived", label: "Archived", content: "" },
  ];

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
      <div className="sui-px-2 md:sui-px-3 lg:sui-px-4 sui-mx-auto sui-mb-4 sui-pt-4">
        <header className="sui-flex sui-justify-end sui-min-h-[48px]">
          <LabelButton variantType="primary" icon="add" labelText="Create Program" />
        </header>
        
        <Tabs
          value={activeTab}
          onChange={setActiveTab}
          tabs={tabs}
          className="sui-mb-4"
        />
      </div>

      <section className="sui-pb-[100px]">
        <div className="sui-px-2 md:sui-px-3 lg:sui-px-4 sui-mx-auto sui-pb-12 sui-max-w-[1200px]" data-testid="programs-cards-container">
          <section className="sui-grid sui-gap-3 sui-mb-4">
            {mockPrograms.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </section>

          <div className="sui-mb-3">
            <Card className="sui-rounded sui-shadow-2 sui-border sui-border-solid sui-border-transparent sui-bg-white sui-px-3 sui-py-2">
              <CardHeader className="sui-flex sui-items-center sui-mb-0.5 sui-gap-1 sui-flex-row">
                <img 
                  alt="TS+ logo" 
                  className="sui-h-[18px] sui-w-[18px]" 
                  src="https://ts-public-assets.teamsnap.com/icons/tsc-logo-icon/v1/sbY4oXPMKpKXhZIuVPP9Z.svg"
                />
                <button className="sui-no-underline sui-bg-transparent sui-p-0 sui-cursor-pointer sui-align-middle sui-w-fit sui-border-b sui-border-solid sui-border-transparent sui-pb-px hover:sui-text-admin-action-text-hover hover:[border-color:currentColor] focus:sui-text-admin-action-text-pressed focus:[border-color:currentColor] active:sui-text-admin-action-text-pressed active:[border-color:currentColor] visited:sui-text-admin-action-text-pressed sui-heading-sm sui-text-action-text sui-flex sui-items-center sui-gap-2 sui-text-sm sui-font-medium">
                  <span className="sui-text-label">Past seasons in TeamSnap</span>
                  <Icon name="open_in_new" size="s" className="sui-leading-none" />
                </button>
              </CardHeader>
              <p className="sui-text-label-lg !sui-font-normal sui-m-0">
                Your existing and historical information in TeamSnap remains safe and accessible anytime.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </OrgLayout>
  );
}
