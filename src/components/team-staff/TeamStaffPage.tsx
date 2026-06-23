"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { TeamLayout } from "./TeamLayout";
import { SimpleIcon } from "@/components/SimpleIcon";
import Tabs from "@/components/Tabs/Tabs";
import Avatar from "@/components/Avatar/Avatar";
import { SimpleCheckbox } from "@/components/SimpleCheckbox";
import Status from "@/components/Status/Status";

interface TeamEvent {
  id: string;
  date: string;
  time: string;
  name: string;
  type: "Game" | "Practice" | "Other";
  opponent?: string;
  location: string;
  subLocation?: string;
  status?: "live" | "cancelled";
  isHome?: boolean;
  availability: { yes: number; no: number; maybe: number };
  rsvp?: "yes" | "no" | "maybe";
}

interface Player {
  id: string;
  name: string;
  initials: string;
  role: string;
  guardian: string;
  status: "active" | "pending";
}

const mockEvents: TeamEvent[] = [
  {
    id: "e1",
    date: "Today",
    time: "LIVE",
    name: "Tar Heels vs Duke",
    type: "Game",
    opponent: "Duke",
    location: "Van Nuys Sherman Oaks Recreation Center",
    subLocation: "Indoor Basketball Court",
    status: "live",
    isHome: true,
    availability: { yes: 0, no: 0, maybe: 0 },
  },
  {
    id: "e2",
    date: "Thu 4/27",
    time: "6:00 PM - 7:00 PM",
    name: "Thursday Practice",
    type: "Practice",
    location: "VNSO Recreation Center",
    subLocation: "Indoor Basketball Court",
    availability: { yes: 6, no: 1, maybe: 3 },
    rsvp: "yes",
  },
  {
    id: "e3",
    date: "Sat 4/29",
    time: "12:00 PM - 1:00 PM",
    name: "vs. Gators",
    type: "Game",
    opponent: "Gators",
    location: "Van Nuys Sherman Oaks Recreation Center",
    subLocation: "Indoor Basketball Court",
    isHome: true,
    availability: { yes: 1, no: 1, maybe: 8 },
    rsvp: "yes",
  },
  {
    id: "e4",
    date: "Mon 5/1",
    time: "6:00 PM - 7:00 PM",
    name: "Team Picture Day",
    type: "Other",
    location: "VBS",
    availability: { yes: 0, no: 0, maybe: 0 },
    status: "cancelled",
  },
];

const mockPlayers: Player[] = [
  {
    id: "p1",
    name: "Ava Johnson",
    initials: "AJ",
    role: "Player",
    guardian: "Mark Johnson",
    status: "active",
  },
  {
    id: "p2",
    name: "Brianna Smith",
    initials: "BS",
    role: "Player",
    guardian: "Laura Smith",
    status: "active",
  },
  {
    id: "p3",
    name: "Chloe Davis",
    initials: "CD",
    role: "Goalie",
    guardian: "Sam Davis",
    status: "pending",
  },
  {
    id: "p4",
    name: "Dylan Brown",
    initials: "DB",
    role: "Player",
    guardian: "Chris Brown",
    status: "active",
  },
];

export function TeamStaffPage() {
  const { orgId, programId } = useParams() as {
    orgId: string;
    programId: string;
  };
  const searchParams = useSearchParams();
  const teamName = searchParams.get("teamName") || "Team";
  const division = searchParams.get("division") || "";

  const [scheduleView, setScheduleView] = useState<"upcoming" | "past">(
    "upcoming",
  );

  const teamLogo = "https://org-files-public-<env>.teamsnap.com/org/232/logo.png";

  const navItems = [
    { label: "Home", icon: "home", href: "#", active: true },
    { label: "Schedule", icon: "calendar_month", href: "#" },
    { label: "Roster", icon: "groups", href: "#" },
    { label: "Chat", icon: "chat", href: "#" },
    { label: "Settings", icon: "settings", href: "#" },
  ];

  const scheduleRows = mockEvents.filter((event) =>
    scheduleView === "upcoming"
      ? event.status !== "cancelled"
      : event.status === "cancelled",
  );

  const tabs = [
    {
      value: "schedule",
      label: "Schedule",
      content: (
        <div className="sui-grid sui-gap-4 sui-pt-4">
          <div className="sui-flex sui-flex-col-reverse sui-justify-between sui-gap-3 md:sui-flex-row md:sui-items-center">
            <div className="sui-flex sui-p-1 sui-rounded-full sui-bg-neutral-background-weak sui-border sui-border-solid sui-border-neutral-border sui-w-fit">
              <button
                type="button"
                onClick={() => setScheduleView("upcoming")}
                className={`sui-px-4 sui-py-1.5 sui-rounded-full sui-text-label sui-font-semibold sui-transition-all ${
                  scheduleView === "upcoming"
                    ? "sui-bg-white sui-text-neutral-text sui-shadow-sm"
                    : "sui-text-neutral-text-medium"
                }`}
              >
                Upcoming
              </button>
              <button
                type="button"
                onClick={() => setScheduleView("past")}
                className={`sui-px-4 sui-py-1.5 sui-rounded-full sui-text-label sui-font-semibold sui-transition-all ${
                  scheduleView === "past"
                    ? "sui-bg-white sui-text-neutral-text sui-shadow-sm"
                    : "sui-text-neutral-text-medium"
                }`}
              >
                Past
              </button>
            </div>
            <div className="sui-flex sui-items-center sui-gap-2">
              <button
                type="button"
                className="sui-flex sui-items-center sui-gap-2 sui-px-4 sui-h-[40px] sui-rounded-full sui-bg-consumer-action-background sui-text-white sui-font-semibold sui-text-label sui-border sui-border-solid sui-border-consumer-action-border hover:sui-bg-consumer-action-background-hover active:sui-scale-95 sui-transition-all"
              >
                <SimpleIcon name="add" size="s" />
                Add event
              </button>
              <button
                type="button"
                className="sui-grid sui-place-content-center sui-h-[40px] sui-w-[40px] sui-rounded-full sui-border sui-border-solid sui-border-neutral-border sui-text-neutral-icon hover:sui-text-consumer-action-text hover:sui-border-consumer-action-border sui-transition-colors"
                aria-label="Calendar view"
              >
                <SimpleIcon name="calendar_month" size="s" />
              </button>
            </div>
          </div>

          <div className="sui-rounded-xl sui-overflow-hidden sui-shadow-2 sui-border sui-border-solid sui-border-neutral-border sui-bg-white">
            <table className="sui-w-full sui-border-spacing-0 sui-border-separate sui-text-body-dense">
              <thead className="[&_th]:sui-border-b [&_th]:sui-border-solid [&_th]:sui-border-neutral-border [&_th]:sui-bg-neutral-background-weak">
                <tr>
                  <th className="sui-px-3 sui-py-2 sui-align-middle sui-w-[32px]">
                    <SimpleCheckbox />
                  </th>
                  <th className="sui-px-3 sui-py-2 sui-align-middle sui-text-left sui-text-label !sui-font-semibold sui-min-h-[48px]">
                    Date
                  </th>
                  <th className="sui-px-3 sui-py-2 sui-align-middle sui-text-left sui-text-label !sui-font-semibold sui-min-h-[48px]">
                    Event
                  </th>
                  <th className="sui-px-3 sui-py-2 sui-align-middle sui-text-left sui-text-label !sui-font-semibold sui-min-h-[48px]">
                    Location
                  </th>
                  <th className="sui-px-3 sui-py-2 sui-align-middle sui-text-left sui-text-label !sui-font-semibold sui-min-h-[48px]">
                    Availability
                  </th>
                  <th className="sui-px-3 sui-py-2 sui-align-middle sui-text-left sui-text-label !sui-font-semibold sui-min-h-[48px]">
                    RSVP
                  </th>
                  <th className="sui-px-3 sui-py-2 sui-align-middle sui-w-[40px]"></th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:sui-border-0">
                {scheduleRows.map((event) => (
                  <tr
                    key={event.id}
                    className="sui-group/row [&_td]:sui-border-b [&_td]:sui-border-solid [&_td]:sui-border-neutral-border hover:sui-bg-neutral-background-weak sui-border-b sui-border-solid sui-border-neutral-border last:sui-border-0"
                  >
                    <td className="sui-px-3 sui-py-2 sui-align-middle">
                      <SimpleCheckbox />
                    </td>
                    <td className="sui-px-3 sui-py-2 sui-align-middle">
                      <div className="sui-flex sui-flex-col sui-gap-0.5">
                        <span className="sui-font-medium">{event.date}</span>
                        <span className="sui-caption sui-text-neutral-text-medium">
                          {event.time}
                        </span>
                      </div>
                    </td>
                    <td className="sui-px-3 sui-py-2 sui-align-middle">
                      <div className="sui-flex sui-flex-col sui-gap-0.5">
                        <span className="sui-font-medium sui-text-admin-action-text">
                          {event.opponent && event.type === "Game"
                            ? `vs. ${event.opponent}`
                            : event.name}
                        </span>
                        <span className="sui-caption sui-text-neutral-text-medium">
                          {event.type === "Game"
                            ? event.isHome
                              ? "Home Game"
                              : "Away Game"
                            : event.type}
                        </span>
                      </div>
                    </td>
                    <td className="sui-px-3 sui-py-2 sui-align-middle">
                      <div className="sui-flex sui-flex-col sui-gap-0.5">
                        <span className="sui-text-neutral-text-medium">
                          {event.location}
                        </span>
                        {event.subLocation && (
                          <span className="sui-caption sui-text-neutral-text-medium">
                            {event.subLocation}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="sui-px-3 sui-py-2 sui-align-middle">
                      {event.status === "live" ? (
                        <span className="sui-inline-flex sui-items-center sui-px-2 sui-py-0.5 sui-rounded-full sui-bg-live-background sui-text-live-text sui-text-caption sui-font-semibold sui-uppercase">
                          Live
                        </span>
                      ) : (
                        <div className="sui-flex sui-flex-col sui-gap-0.5 sui-text-caption">
                          <span className="sui-flex sui-items-center sui-gap-1">
                            <SimpleIcon
                              name="check"
                              size="s"
                              className="sui-text-positive-icon"
                            />{" "}
                            {event.availability.yes}
                          </span>
                          <span className="sui-flex sui-items-center sui-gap-1">
                            <SimpleIcon
                              name="close"
                              size="s"
                              className="sui-text-negative-icon"
                            />{" "}
                            {event.availability.no}
                          </span>
                          <span className="sui-flex sui-items-center sui-gap-1">
                            <SimpleIcon
                              name="question_mark"
                              size="s"
                              className="sui-text-neutral-text-medium"
                            />{" "}
                            {event.availability.maybe}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="sui-px-3 sui-py-2 sui-align-middle">
                      {event.status === "live" || event.status === "cancelled" ? (
                        <span className="sui-text-caption sui-text-neutral-text-medium">
                          —
                        </span>
                      ) : (
                        <div className="sui-flex sui-items-center sui-gap-2">
                          <div className="sui-flex sui-gap-1">
                            <button
                              type="button"
                              className={`sui-grid sui-place-content-center sui-h-[24px] sui-w-[24px] sui-rounded-full sui-border sui-border-solid ${
                                event.rsvp === "yes"
                                  ? "sui-bg-positive-background sui-border-positive-border"
                                  : "sui-border-neutral-border sui-bg-white"
                              }`}
                            >
                              <SimpleIcon
                                name="check"
                                size="s"
                                className={
                                  event.rsvp === "yes"
                                    ? "sui-text-positive-icon"
                                    : "sui-text-neutral-icon"
                                }
                              />
                            </button>
                            <button
                              type="button"
                              className={`sui-grid sui-place-content-center sui-h-[24px] sui-w-[24px] sui-rounded-full sui-border sui-border-solid ${
                                event.rsvp === "no"
                                  ? "sui-bg-negative-background sui-border-negative-border"
                                  : "sui-border-neutral-border sui-bg-white"
                              }`}
                            >
                              <SimpleIcon
                                name="close"
                                size="s"
                                className={
                                  event.rsvp === "no"
                                    ? "sui-text-negative-icon"
                                    : "sui-text-neutral-icon"
                                }
                              />
                            </button>
                            <button
                              type="button"
                              className={`sui-grid sui-place-content-center sui-h-[24px] sui-w-[24px] sui-rounded-full sui-border sui-border-solid ${
                                event.rsvp === "maybe"
                                  ? "sui-bg-neutral-background-strong sui-border-neutral-border-medium"
                                  : "sui-border-neutral-border sui-bg-white"
                              }`}
                            >
                              <SimpleIcon
                                name="question_mark"
                                size="s"
                                className="sui-text-neutral-icon"
                              />
                            </button>
                          </div>
                          <Avatar
                            type="initials"
                            initials="You"
                            size="small"
                          />
                        </div>
                      )}
                    </td>
                    <td className="sui-px-3 sui-py-2 sui-align-middle">
                      <button
                        type="button"
                        className="sui-grid sui-place-content-center sui-h-[24px] sui-w-[24px] sui-rounded-full sui-text-neutral-icon hover:sui-text-consumer-action-text"
                      >
                        <SimpleIcon name="chevron_right" size="s" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      value: "roster",
      label: "Roster",
      content: (
        <div className="sui-rounded-xl sui-mt-4 sui-overflow-hidden sui-shadow-2 sui-border sui-border-solid sui-border-neutral-border sui-bg-white">
          <table className="sui-w-full sui-border-spacing-0 sui-border-separate sui-text-body-dense">
            <thead className="[&_th]:sui-border-b [&_th]:sui-border-solid [&_th]:sui-border-neutral-border [&_th]:sui-bg-neutral-background-weak">
              <tr>
                <th className="sui-px-3 sui-py-2 sui-align-middle sui-w-[32px]">
                  <SimpleCheckbox />
                </th>
                <th className="sui-px-3 sui-py-2 sui-align-middle sui-text-left sui-text-label !sui-font-semibold sui-min-h-[48px]">
                  Name
                </th>
                <th className="sui-px-3 sui-py-2 sui-align-middle sui-text-left sui-text-label !sui-font-semibold sui-min-h-[48px]">
                  Role
                </th>
                <th className="sui-px-3 sui-py-2 sui-align-middle sui-text-left sui-text-label !sui-font-semibold sui-min-h-[48px]">
                  Guardian
                </th>
                <th className="sui-px-3 sui-py-2 sui-align-middle sui-text-left sui-text-label !sui-font-semibold sui-min-h-[48px]">
                  Status
                </th>
                <th className="sui-px-3 sui-py-2 sui-align-middle sui-text-left sui-text-label !sui-font-semibold sui-min-h-[48px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:sui-border-0">
              {mockPlayers.map((player) => (
                <tr
                  key={player.id}
                  className="sui-group/row [&_td]:sui-border-b [&_td]:sui-border-solid [&_td]:sui-border-neutral-border hover:sui-bg-neutral-background-weak sui-border-b sui-border-solid sui-border-neutral-border last:sui-border-0"
                >
                  <td className="sui-px-3 sui-py-2 sui-align-middle">
                    <SimpleCheckbox />
                  </td>
                  <td className="sui-px-3 sui-py-2 sui-align-middle">
                    <div className="sui-flex sui-items-center sui-gap-2">
                      <Avatar
                        type="initials"
                        initials={player.initials}
                        size="default"
                      />
                      <span className="sui-font-medium">{player.name}</span>
                    </div>
                  </td>
                  <td className="sui-px-3 sui-py-2 sui-align-middle">{player.role}</td>
                  <td className="sui-px-3 sui-py-2 sui-align-middle sui-text-neutral-text-medium">
                    {player.guardian}
                  </td>
                  <td className="sui-px-3 sui-py-2 sui-align-middle">
                    <Status
                      state={player.status === "active" ? "success" : "warning"}
                      text={player.status === "active" ? "Active" : "Pending"}
                    />
                  </td>
                  <td className="sui-px-3 sui-py-2 sui-align-middle">
                    <div className="sui-flex sui-gap-1">
                      <button
                        type="button"
                        className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent active:sui-scale-95 sui-text-neutral-icon hover:sui-border-consumer-action-border hover:sui-bg-consumer-action-background-weak-hover hover:sui-text-consumer-action-icon active:sui-bg-consumer-action-background-weak-pressed sui-h-[28px] sui-w-[28px] sui-min-w-[28px]"
                      >
                        <SimpleIcon name="edit" size="s" />
                      </button>
                      <button
                        type="button"
                        className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent active:sui-scale-95 sui-text-neutral-icon hover:sui-border-negative-border hover:sui-bg-negative-background-weak-hover hover:sui-text-negative-icon active:sui-bg-negative-background-weak-pressed sui-h-[28px] sui-w-[28px] sui-min-w-[28px]"
                      >
                        <SimpleIcon name="delete" size="s" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
  ];

  return (
    <TeamLayout
      teamName={teamName}
      teamLogo={teamLogo}
      backHref={`/organizations/${orgId}/programs/${programId}`}
      navItems={navItems}
      userName="John Doe"
      userInitials="JD"
    >
      <div className="sui-flex sui-flex-col sui-gap-4">
        <div className="sui-flex sui-items-center sui-gap-4">
          <div className="sui-h-16 sui-w-16 sui-rounded-full sui-overflow-hidden sui-bg-neutral-background-weak sui-border sui-border-solid sui-border-neutral-border sui-grid sui-place-items-center sui-flex-shrink-0">
            {teamLogo ? (
              <img
                src={teamLogo}
                alt={`${teamName} logo`}
                className="sui-w-full sui-h-full sui-object-cover"
              />
            ) : (
              <span className="sui-text-display-sm sui-font-bold">
                {teamName.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h1 className="sui-heading-lg sui-font-medium">{teamName}</h1>
            <p className="sui-text-body sui-text-neutral-text-medium">
              Summer Basketball 2026{division ? ` (${division})` : ""}
            </p>
          </div>
        </div>

        <Tabs
          tabs={tabs}
          defaultValue="schedule"
          variantType="consumer"
          ariaLabel="Team sections"
        />
      </div>
    </TeamLayout>
  );
}
