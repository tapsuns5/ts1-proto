"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { OrgLayout } from "@/components/layout/OrgLayout";
import { NavItem, BreadcrumbItem } from "@/components/layout/types";
import { EventCalendar, CalendarEvent } from "@/components/event-calendar/EventCalendar";
import Tabs from "@/components/Tabs/Tabs";
import LabelButton from "@/components/LabelButton/LabelButton";
import Input from "@/components/Input/Input";
import Status from "@/components/Status/Status";
import Table from "@/components/table/Table/Table";
import { useTableHelpers, useTablePagination } from "@/components/table/Table/hooks";
import { Columns } from "@/components/table/Table/Table.types";
import Pagination from "@/components/table/Pagination/Pagination";
import { TextLink } from "@/components/TextLink/TextLink";

const mockNavItems: NavItem[] = [
  { label: "Registrations", icon: "view_cozy", href: "/organizations/1/registrations" },
  { label: "Programs", icon: "menu_book", href: "/organizations/1/programs" },
  { label: "Schedule", icon: "calendar_month", href: "/organizations/1/programs/85703/schedule", active: true },
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

/* ────────────── Mock Data ────────────── */

interface ScheduleRow {
  id: string;
  program: string;
  divisions: string[];
  events: number;
  completedGames: { scored: number; unscored: number };
  startDate: string;
  endDate: string;
}

const mockSchedules: ScheduleRow[] = [
  {
    id: "1",
    program: "Spring 2025 Soccer",
    divisions: ["U10 Boys", "U12 Boys", "U14 Boys"],
    events: 48,
    completedGames: { scored: 32, unscored: 4 },
    startDate: "2025-03-01",
    endDate: "2025-05-15",
  },
  {
    id: "2",
    program: "Summer 2025 Baseball",
    divisions: ["Minors", "Majors"],
    events: 36,
    completedGames: { scored: 12, unscored: 0 },
    startDate: "2025-06-01",
    endDate: "2025-08-20",
  },
  {
    id: "3",
    program: "Fall 2025 Football",
    divisions: ["Pee Wee", "Junior Varsity", "Varsity"],
    events: 24,
    completedGames: { scored: 0, unscored: 0 },
    startDate: "2025-09-01",
    endDate: "2025-11-15",
  },
  {
    id: "4",
    program: "Winter 2025 Basketball",
    divisions: ["U8 Coed", "U10 Coed", "U12 Girls", "U14 Girls"],
    events: 64,
    completedGames: { scored: 58, unscored: 2 },
    startDate: "2024-12-01",
    endDate: "2025-02-28",
  },
];

const initialEvents: CalendarEvent[] = [
  // April events
  { id: "1", title: "BearsZ vs Tigers", start: new Date("2026-04-05T09:00:00"), end: new Date("2026-04-05T10:00:00"), eventType: "game", venueName: "Main Stadium", subVenueName: "Field 1", teams: ["BearsZ", "Tigers"], status: "scheduled" },
  { id: "2", title: "Thunder Hawks vs Red Wolves", start: new Date("2026-04-05T11:00:00"), end: new Date("2026-04-05T12:00:00"), eventType: "game", venueName: "Field A", teams: ["Thunder Hawks", "Red Wolves"], status: "scheduled" },
  { id: "3", title: "Lions Practice", start: new Date("2026-04-07T18:00:00"), end: new Date("2026-04-07T19:00:00"), eventType: "practice", venueName: "Field B", subVenueName: "Secondary", teams: ["Lions"], status: "scheduled" },
  { id: "4", title: "Eagles vs Blue Strikers", start: new Date("2026-04-12T09:00:00"), end: new Date("2026-04-12T10:00:00"), eventType: "game", venueName: "Field A", teams: ["Eagles", "Blue Strikers"], status: "scheduled" },
  { id: "5", title: "Silver Sharks Practice", start: new Date("2026-04-14T18:00:00"), end: new Date("2026-04-14T19:00:00"), eventType: "practice", venueName: "Community Center", subVenueName: "Gym", teams: ["Silver Sharks"], status: "pending" },
  { id: "6", title: "Tournament: Opening Round", start: new Date("2026-04-19T09:00:00"), end: new Date("2026-04-19T12:00:00"), eventType: "other", venueName: "Main Stadium", subVenueName: "Field 1", teams: ["All Teams"], status: "scheduled" },
  { id: "7", title: "Green Gators vs Golden Eagles", start: new Date("2026-04-26T09:00:00"), end: new Date("2026-04-26T10:00:00"), eventType: "game", venueName: "Field B", teams: ["Green Gators", "Golden Eagles"], status: "canceled" },
  { id: "8", title: "Storm Breakers Practice", start: new Date("2026-04-28T18:00:00"), end: new Date("2026-04-28T19:00:00"), eventType: "practice", venueName: "Field A", teams: ["Storm Breakers"], status: "scheduled" },
  // June events (matching screenshot density)
  { id: "9", title: "Practice 13U-A", start: new Date("2026-06-14T17:00:00"), end: new Date("2026-06-14T18:00:00"), eventType: "practice", venueName: "Field A", teams: ["13U-A"], status: "scheduled" },
  { id: "10", title: "Practice 13U-AAA", start: new Date("2026-06-17T17:00:00"), end: new Date("2026-06-17T18:00:00"), eventType: "practice", venueName: "Field B", teams: ["13U-AAA"], status: "scheduled" },
  { id: "11", title: "13U-AAA vs Minnetonka 13AAA", start: new Date("2026-06-19T18:00:00"), end: new Date("2026-06-19T19:30:00"), eventType: "game", venueName: "Main Stadium", teams: ["13U-AAA", "Minnetonka 13AAA"], status: "scheduled" },
  { id: "12", title: "Practice 13U-A", start: new Date("2026-06-21T17:00:00"), end: new Date("2026-06-21T18:00:00"), eventType: "practice", venueName: "Field A", teams: ["13U-A"], status: "scheduled" },
  { id: "13", title: "Batting Cages 13U-AA", start: new Date("2026-06-23T16:00:00"), end: new Date("2026-06-23T17:00:00"), eventType: "other", venueName: "Indoor Facility", teams: ["13U-AA"], status: "scheduled" },
  { id: "14", title: "Practice 13U-AAA", start: new Date("2026-06-24T17:00:00"), end: new Date("2026-06-24T18:00:00"), eventType: "practice", venueName: "Field B", teams: ["13U-AAA"], status: "scheduled" },
  { id: "15", title: "13U-A vs Bears", start: new Date("2026-06-26T18:00:00"), end: new Date("2026-06-26T19:30:00"), eventType: "game", venueName: "Main Stadium", teams: ["13U-A", "Bears"], status: "scheduled" },
  { id: "16", title: "USABL Tournament 13U-A", start: new Date("2026-06-28T09:00:00"), end: new Date("2026-06-28T12:00:00"), eventType: "other", venueName: "Community Park", teams: ["13U-A"], status: "scheduled" },
  { id: "17", title: "Batting Cages 13U-AA", start: new Date("2026-06-30T16:00:00"), end: new Date("2026-06-30T17:00:00"), eventType: "other", venueName: "Indoor Facility", teams: ["13U-AA"], status: "scheduled" },
  { id: "18", title: "Practice 13U-AAA", start: new Date("2026-07-01T17:00:00"), end: new Date("2026-07-01T18:00:00"), eventType: "practice", venueName: "Field B", teams: ["13U-AAA"], status: "scheduled" },
  { id: "19", title: "13U-A vs Eagles", start: new Date("2026-07-01T18:30:00"), end: new Date("2026-07-01T20:00:00"), eventType: "game", venueName: "Main Stadium", teams: ["13U-A", "Eagles"], status: "scheduled" },
  { id: "20", title: "Practice 13U-AAA", start: new Date("2026-07-03T17:00:00"), end: new Date("2026-07-03T18:00:00"), eventType: "practice", venueName: "Field B", teams: ["13U-AAA"], status: "scheduled" },
  { id: "21", title: "13U-AAA vs Bears", start: new Date("2026-07-05T18:00:00"), end: new Date("2026-07-05T19:30:00"), eventType: "game", venueName: "Main Stadium", teams: ["13U-AAA", "Bears"], status: "scheduled" },
];

interface VenueScheduleItem {
  id: string;
  date: string;
  time: string;
  name: string;
  type: "game" | "practice" | "other";
  teams: string[];
  venueName: string;
  subVenueName?: string;
  status: "scheduled" | "pending" | "canceled";
}

const mockVenueScheduleItems: VenueScheduleItem[] = [
  { id: "1", date: "2025-04-05", time: "09:00 AM", name: "BearsZ vs Tigers", type: "game", teams: ["BearsZ", "Tigers"], venueName: "Main Stadium", subVenueName: "Field 1", status: "scheduled" },
  { id: "2", date: "2025-04-05", time: "11:00 AM", name: "Thunder Hawks vs Red Wolves", type: "game", teams: ["Thunder Hawks", "Red Wolves"], venueName: "Field A", status: "scheduled" },
  { id: "3", date: "2025-04-07", time: "06:00 PM", name: "Lions Practice", type: "practice", teams: ["Lions"], venueName: "Field B", subVenueName: "Secondary", status: "scheduled" },
  { id: "4", date: "2025-04-12", time: "09:00 AM", name: "Eagles vs Blue Strikers", type: "game", teams: ["Eagles", "Blue Strikers"], venueName: "Field A", status: "scheduled" },
  { id: "5", date: "2025-04-14", time: "06:00 PM", name: "Silver Sharks Practice", type: "practice", teams: ["Silver Sharks"], venueName: "Community Center", subVenueName: "Gym", status: "pending" },
  { id: "6", date: "2025-04-19", time: "09:00 AM", name: "Tournament: Opening Round", type: "other", teams: ["All Teams"], venueName: "Main Stadium", subVenueName: "Field 1", status: "scheduled" },
  { id: "7", date: "2025-04-26", time: "09:00 AM", name: "Green Gators vs Golden Eagles", type: "game", teams: ["Green Gators", "Golden Eagles"], venueName: "Field B", status: "canceled" },
  { id: "8", date: "2025-04-28", time: "06:00 PM", name: "Storm Breakers Practice", type: "practice", teams: ["Storm Breakers"], venueName: "Field A", status: "scheduled" },
];

/* ────────────── Table Configs ────────────── */

const SCHEDULE_COLUMNS: Columns = {
  program: {
    label: "Schedule Name",
    align: "left",
    width: "25%",
    getBodyProps: (row) => ({
      type: "custom" as const,
      children: (
        <TextLink href="#" variantType="primary">
          {row.program}
        </TextLink>
      ),
    }),
  },
  divisions: {
    label: "Division(s)",
    align: "left",
    width: "25%",
    getBodyProps: (row) => ({
      type: "custom" as const,
      children: row.divisions.join(", "),
    }),
  },
  events: {
    label: "Events",
    align: "center",
    width: "10%",
    getBodyProps: (row) => ({
      type: "text" as const,
      text: String(row.events),
    }),
  },
  completedGames: {
    label: "Completed Games",
    align: "center",
    width: "20%",
    getBodyProps: (row) => ({
      type: "custom" as const,
      children: (
        <span>
          {row.completedGames.scored} / {row.completedGames.unscored}
        </span>
      ),
    }),
  },
  timePeriod: {
    label: "Time Period",
    align: "center",
    width: "20%",
    getBodyProps: (row) => ({
      type: "custom" as const,
      children: (
        <span>
          {format(new Date(row.startDate), "MM/dd/yyyy")} → {format(new Date(row.endDate), "MM/dd/yyyy")}
        </span>
      ),
    }),
  },
};

/* ────────────── Components ────────────── */

function AllSchedulesTable({ data }: { data: ScheduleRow[] }) {
  const { rows, headerRow } = useTableHelpers({
    data,
    columns: SCHEDULE_COLUMNS,
  });
  const { currentPage, onPageChange, totalCount, currentRows, pageSize } =
    useTablePagination({ rows, pageSize: 10 });

  return (
    <>
      <div className="sui-bg-white sui-mb-4 sui-rounded-[16px] sui-border sui-border-solid sui-border-neutral-border/100">
        <Table headerRow={headerRow} rows={currentRows} />
      </div>
      <Pagination
        currentPage={currentPage}
        onPageChange={onPageChange}
        totalCount={totalCount}
        pageSize={pageSize}
      />
    </>
  );
}

function VenuesScheduleView({ data }: { data: VenueScheduleItem[] }) {
  const itemsByDate = useMemo(() => {
    const sorted = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sorted.reduce((acc, item) => {
      const dateKey = format(new Date(item.date), "EEE MMM d, yyyy");
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(item);
      return acc;
    }, {} as Record<string, VenueScheduleItem[]>);
  }, [data]);

  return (
    <div className="sui-mb-4">
      {Object.entries(itemsByDate).map(([date, items]) => (
        <div key={date} className="sui-mb-4">
          <div className="sui-sticky sui-top-0 sui-z-10 sui-bg-neutral-background sui-px-3 sui-py-2 sui-text-label sui-font-semibold sui-border-b sui-border-neutral-border">
            {date}
          </div>
          <div className="sui-bg-white sui-border-l sui-border-r sui-border-b sui-border-neutral-border sui-rounded-b-lg">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className={`sui-grid sui-grid-cols-[12%_25%_12%_20%_20%_11%] sui-items-center sui-py-3 sui-px-3 sui-body-dense ${idx !== items.length - 1 ? "sui-border-b sui-border-neutral-border" : ""}`}
              >
                <div className="sui-text-left">{item.time}</div>
                <div className={`sui-text-left ${item.status === "canceled" ? "sui-line-through" : ""}`}>
                  <TextLink href="#" variantType="primary">
                    {item.name}
                  </TextLink>
                </div>
                <div className="sui-text-center sui-capitalize sui-text-label-sm">{item.type}</div>
                <div className="sui-text-left">{item.teams.join(", ")}</div>
                <div className="sui-text-left">
                  <p>{item.venueName}</p>
                  {item.subVenueName && (
                    <p className="sui-text-xs sui-text-neutral-text-medium">{item.subVenueName}</p>
                  )}
                </div>
                <div className="sui-text-center">
                  {item.status === "scheduled" && <Status state="success" text="Scheduled" />}
                  {item.status === "pending" && <Status state="warning" text="Unscheduled" />}
                  {item.status === "canceled" && <Status state="inactive" text="Canceled" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {data.length === 0 && (
        <p className="sui-p-4 sui-text-center">No events found for the selected venue filters.</p>
      )}
    </div>
  );
}

export default function SchedulePage() {
  const params = useParams() as { orgId: string; programId: string };
  const [activeTab, setActiveTab] = useState("all-schedules");
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [searchQuery, setSearchQuery] = useState("");

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Programs", href: `/organizations/${params.orgId}/programs` },
    { label: "Schedule", active: true },
  ];

  const handleEventAdd = (event: CalendarEvent) => {
    setEvents((prev) => [...prev, event]);
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
    );
  };

  const handleEventDelete = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  const filteredSchedules = useMemo(() => {
    if (!searchQuery.trim()) return mockSchedules;
    const q = searchQuery.toLowerCase();
    return mockSchedules.filter(
      (s) =>
        s.program.toLowerCase().includes(q) ||
        s.divisions.some((d) => d.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const filteredVenueSchedule = useMemo(() => {
    if (!searchQuery.trim()) return mockVenueScheduleItems;
    const q = searchQuery.toLowerCase();
    return mockVenueScheduleItems.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.venueName.toLowerCase().includes(q) ||
        v.teams.some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const tabs = [
    {
      value: "all-schedules",
      label: "All Schedules",
      content: (
        <section className="sui-mt-1">
          <div className="sui-flex sui-flex-col sui-gap-1 sui-my-2 sui-flex-wrap sui-py-2">
            <Input
              name="search"
              leftIcon="search"
              allowClear
              type="text"
              placeholder="Search by program or division name"
              size="small"
              inputProps={{ autoComplete: "off" }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              className="sui-flex-1 sui-max-w-[400px]"
            />
          </div>
          <AllSchedulesTable data={filteredSchedules} />
        </section>
      ),
    },
    {
      value: "calendar",
      label: "Calendar",
      content: (
        <div className="sui-mx-auto sui-pt-4">
          <EventCalendar
            events={events}
            onEventAdd={handleEventAdd}
            onEventUpdate={handleEventUpdate}
            onEventDelete={handleEventDelete}
            initialView="month"
          />
        </div>
      ),
    },
    {
      value: "venues",
      label: "Venues",
      content: (
        <section className="sui-mt-1">
          <div className="sui-flex sui-flex-col sui-gap-1 sui-my-2 sui-flex-wrap sui-py-2">
            <Input
              name="venue-search"
              leftIcon="search"
              allowClear
              type="text"
              placeholder="Search by event, venue, or team name"
              size="small"
              inputProps={{ autoComplete: "off" }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              className="sui-flex-1 sui-max-w-[400px]"
            />
          </div>
          <VenuesScheduleView data={filteredVenueSchedule} />
        </section>
      ),
    },
  ];

  return (
    <OrgLayout
      orgName="Cypress Automation Org"
      orgLogo="https://org-files-public-<env>.teamsnap.com/org/232/logo.png"
      navItems={mockNavItems}
      breadcrumbs={breadcrumbs}
      userName="John Doe"
      userInitials="JD"
      onHelpClick={() => console.log("Help clicked")}
    >
      <div className="sui-px-2 md:sui-px-2 lg:sui-px-2 sui-mx-auto sui-max-w-full sui-overflow-x-hidden sui-relative sui-pt-4">
        <header className="sui-flex sui-justify-end sui-min-h-[48px]">
          <LabelButton
            variantType="primary"
            icon="add"
            iconPosition="left"
            labelText="New Schedule"
            onClick={() => console.log("New schedule clicked")}
          />
        </header>
        <Tabs
          tabs={tabs}
          value={activeTab}
          onChange={(val) => setActiveTab(val)}
        />
      </div>
    </OrgLayout>
  );
}
