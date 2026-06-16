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
import Table from "@/components/table/Table/Table";
import { useTableHelpers, useTablePagination } from "@/components/table/Table/hooks";
import { Columns } from "@/components/table/Table/Table.types";
import Pagination from "@/components/table/Pagination/Pagination";
import { TextLink } from "@/components/TextLink/TextLink";
import { VenueScheduleView, type VenueGroup } from "@/components/programs/VenueScheduleView";
import Combobox from "@/components/Combobox/Combobox";
import { ComboboxTrigger } from "@/components/Combobox/components/ComboboxTrigger";
import { ComboboxContent } from "@/components/Combobox/Combobox";
import { ComboboxList } from "@/components/Combobox/components/ComboboxList";
import { ComboboxItem } from "@/components/Combobox/components/ComboboxItem";

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

const mockVenueGroups: VenueGroup[] = [
  {
    name: "Riverside Athletic Park",
    subVenues: [
      {
        name: "Field 1",
        events: [
          { id: "f1-1", title: "10U Eagles vs 10U Bulls", start: "09:00", end: "11:00", type: "game", teams: ["10U Eagles", "10U Bulls"] },
          { id: "f1-2", title: "8U Hawks Practice", start: "13:00", end: "14:30", type: "practice", teams: ["8U Hawks"] },
        ],
      },
      {
        name: "Field 2",
        events: [
          { id: "f2-1", title: "12U Tigers Practice", start: "10:00", end: "11:30", type: "practice", teams: ["12U Tigers"] },
          { id: "f2-2", title: "14U Lions vs 14U Cobras", start: "14:00", end: "16:00", type: "game", teams: ["14U Lions", "14U Cobras"] },
        ],
      },
      { name: "Field 3", events: [] },
      {
        name: "Field 4",
        events: [
          { id: "f4-1", title: "Field Setup", start: "08:00", end: "10:00", type: "other" },
          { id: "f4-2", title: "8U Sharks vs 8U Hawks", start: "12:00", end: "13:30", type: "game", teams: ["8U Sharks", "8U Hawks"] },
        ],
      },
    ],
  },
  {
    name: "Oakwood Sports Complex",
    subVenues: [
      {
        name: "Court 1",
        events: [
          { id: "c1-1", title: "Bantam A Game", start: "09:00", end: "11:00", type: "game", teams: ["Bantam A"] },
          { id: "c1-2", title: "Midget AA Practice", start: "14:00", end: "15:30", type: "practice", teams: ["Midget AA"] },
        ],
      },
      { name: "Court 2", events: [] },
    ],
  },
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

export default function SchedulePage() {
  const params = useParams() as { orgId: string; programId: string };
  const [activeTab, setActiveTab] = useState("all-schedules");
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [venueDate, setVenueDate] = useState(new Date("2026-03-10T00:00:00"));
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);

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
        <div className="sui-mx-auto">
          {/* Filter bar */}
          <div className="sui-flex sui-flex-wrap sui-items-center sui-justify-between sui-gap-2 sui-p-2 sui-mb-2">
            <div className="sui-flex sui-flex-wrap sui-items-center sui-gap-2">
              <Combobox
                values={selectedPrograms}
                onValuesChange={(vals) => setSelectedPrograms(vals)}
              >
                <ComboboxTrigger label="All Programs" />
                <ComboboxContent headerTitle="Select programs">
                  <ComboboxList showSelectAllOption>
                    <ComboboxItem value="Spring 2025 Soccer" label="Spring 2025 Soccer" keywords={["Spring 2025 Soccer"]} />
                    <ComboboxItem value="Summer 2025 Baseball" label="Summer 2025 Baseball" keywords={["Summer 2025 Baseball"]} />
                    <ComboboxItem value="Fall 2025 Football" label="Fall 2025 Football" keywords={["Fall 2025 Football"]} />
                    <ComboboxItem value="Winter 2025 Basketball" label="Winter 2025 Basketball" keywords={["Winter 2025 Basketball"]} />
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>

              <Combobox
                values={selectedDivisions}
                onValuesChange={(vals) => setSelectedDivisions(vals)}
              >
                <ComboboxTrigger label="All Divisions / Teams" />
                <ComboboxContent headerTitle="Select divisions / teams">
                  <ComboboxList showSelectAllOption>
                    <ComboboxItem value="10U" label="10U" keywords={["10U"]} />
                    <ComboboxItem value="12U" label="12U" keywords={["12U"]} />
                    <ComboboxItem value="14U" label="14U" keywords={["14U"]} />
                    <ComboboxItem value="8U" label="8U" keywords={["8U"]} />
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>

              <Combobox
                values={selectedVenues}
                onValuesChange={(vals) => setSelectedVenues(vals)}
              >
                <ComboboxTrigger label="All Venues" />
                <ComboboxContent headerTitle="Select venues">
                  <ComboboxList showSelectAllOption>
                    <ComboboxItem value="Main Stadium" label="Main Stadium" keywords={["Main Stadium"]} />
                    <ComboboxItem value="Field A" label="Field A" keywords={["Field A"]} />
                    <ComboboxItem value="Field B" label="Field B" keywords={["Field B"]} />
                    <ComboboxItem value="Community Center" label="Community Center" keywords={["Community Center"]} />
                    <ComboboxItem value="Indoor Facility" label="Indoor Facility" keywords={["Indoor Facility"]} />
                    <ComboboxItem value="Community Park" label="Community Park" keywords={["Community Park"]} />
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>

              <Combobox
                values={selectedEventTypes}
                onValuesChange={(vals) => setSelectedEventTypes(vals)}
              >
                <ComboboxTrigger label="All Event Types" />
                <ComboboxContent headerTitle="Select event types">
                  <ComboboxList showSelectAllOption>
                    <ComboboxItem value="game" label="Game" keywords={["Game"]} />
                    <ComboboxItem value="practice" label="Practice" keywords={["Practice"]} />
                    <ComboboxItem value="other" label="Other event" keywords={["Other event"]} />
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            <div className="sui-flex sui-items-center sui-gap-2">
              <button className="sui-font-semibold sui-rounded-full sui-border sui-border-solid sui-cursor-pointer sui-transition-all sui-flex sui-items-center sui-gap-2 sui-flex-shrink-0 sui-bg-white sui-text-admin-action-text sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover active:sui-scale-95 sui-text-sm sui-h-[32px] sui-pl-[18px] sui-pr-3 sui-py-0">
                <span className="material-symbols-rounded sui-text-xl">location_on</span>
                <span>Manage</span>
              </button>
              <button className="sui-font-semibold sui-rounded-full sui-border sui-border-solid sui-cursor-pointer sui-transition-all sui-flex sui-items-center sui-gap-2 sui-flex-shrink-0 sui-bg-white sui-text-admin-action-text sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover active:sui-scale-95 sui-text-sm sui-h-[32px] sui-pl-[18px] sui-pr-3 sui-py-0">
                <span className="material-symbols-rounded sui-text-xl">download</span>
                <span>Export</span>
              </button>
              <LabelButton
                variantType="primary"
                labelText="Add Event"
                size="small"
                onClick={() => {
                  // Handle add event
                }}
              />
            </div>
          </div>
          <EventCalendar
            events={events}
            onEventAdd={handleEventAdd}
            onEventUpdate={handleEventUpdate}
            onEventDelete={handleEventDelete}
            initialView="week"
          />
        </div>
      ),
    },
    {
      value: "venues",
      label: "Venues",
      content: (
        <VenueScheduleView
          date={venueDate}
          onDateChange={setVenueDate}
          venueGroups={mockVenueGroups}
        />
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
      <div className="sui-mx-auto sui-max-w-full sui-overflow-x-hidden sui-relative sui-pt-0">
        <Tabs
          tabs={tabs}
          value={activeTab}
          onChange={(val) => setActiveTab(val)}
        />
      </div>
    </OrgLayout>
  );
}
