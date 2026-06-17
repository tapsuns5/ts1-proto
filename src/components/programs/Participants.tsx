"use client";

import { useState } from "react";
import { SimpleIcon } from "../SimpleIcon";
import { SimpleLabelButton } from "../SimpleLabelButton";
import { SimpleCheckbox } from "../SimpleCheckbox";
import Status from "../Status/Status";
import Avatar from "../Avatar/Avatar";
import Input from "../Input/Input";

export interface Participant {
  id: string;
  name: string;
  initials: string;
  dateOfBirth?: string;
  age?: number;
  gender?: string;
  team?: string;
  division?: string;
  role: string;
  hasAccount?: boolean;
  additionalTeams?: Array<{ team: string; division?: string; role: string }>;
  availability?: "available" | "maybe" | "unavailable" | "unknown";
  rsvp?: "yes" | "no" | "maybe" | "unknown";
  availabilityData?: {
    games?: number;
    practices?: number;
    events?: number;
  };
}

interface ParticipantsProps {
  participants: Participant[];
  teamFilter?: string;
  showAvailabilityColumns?: boolean;
}

function generateMockParticipants(): Participant[] {
  const teams = [
    'Dodgers', 'Marlins', "Tyler's Baseball Team"
  ];
  
  const baseParticipants: Participant[] = [
    {
      id: "1",
      name: "Emily Palmer",
      initials: "EP",
      dateOfBirth: "3/19/1994",
      age: 32,
      team: "Test",
      division: "10U",
      role: "Player",
      hasAccount: true,
      availability: "available",
      rsvp: "yes",
      availabilityData: { games: 5, practices: 3, events: 2 },
    },
    {
      id: "2",
      name: "Jack Jones",
      initials: "JJ",
      gender: "male",
      team: "Dodgers",
      division: "8U",
      role: "Player",
      hasAccount: false,
      availability: "available",
      rsvp: "yes",
      availabilityData: { games: 4, practices: 2, events: 1 },
      additionalTeams: [
        { team: "Marlins", division: "No Division", role: "Player" },
        { team: "Unassigned", division: "No Division", role: "Player" },
      ],
    },
    {
      id: "3",
      name: "Jack Jones",
      initials: "JJ",
      gender: "male",
      team: "Marlins",
      role: "Player",
      hasAccount: false,
      availability: "maybe",
      rsvp: "maybe",
      availabilityData: { games: 3, practices: 4, events: 2 },
      additionalTeams: [
        { team: "Dodgers", division: "No Division", role: "Player" },
        { team: "Unassigned", division: "No Division", role: "Player" },
      ],
    },
    {
      id: "4",
      name: "TT PP",
      initials: "TP",
      gender: "male",
      dateOfBirth: "3/3/2016",
      age: 10,
      team: "Unassigned",
      role: "Player",
      hasAccount: false,
      availability: "unknown",
      rsvp: "unknown",
    },
    {
      id: "5",
      name: "TTT PPP",
      initials: "TP",
      gender: "female",
      dateOfBirth: "12/12/2016",
      age: 9,
      team: "Unassigned",
      role: "Player",
      hasAccount: false,
      availability: "unknown",
      rsvp: "unknown",
    },
    {
      id: "6",
      name: "Tyler Palmer",
      initials: "TP",
      dateOfBirth: "9/20/1991",
      age: 34,
      team: "Marlins",
      division: "8U",
      role: "Head Coach",
      hasAccount: true,
      availability: "available",
      rsvp: "yes",
      availabilityData: { games: 6, practices: 5, events: 3 },
    },
    {
      id: "7",
      name: "Tyler Palmer",
      initials: "TP",
      dateOfBirth: "9/20/1991",
      age: 34,
      team: "Marlins",
      division: "8U",
      role: "Player",
      hasAccount: true,
      availability: "available",
      rsvp: "yes",
      availabilityData: { games: 4, practices: 3, events: 2 },
      additionalTeams: [
        { team: "Dodgers", division: "8U", role: "Player" },
        { team: "Unassigned", division: "No Division", role: "Player" },
      ],
    },
    {
      id: "8",
      name: "Tyler Staff",
      initials: "TS",
      dateOfBirth: "9/20/1991",
      age: 34,
      team: "Tyler's Baseball Team",
      division: "9U",
      role: "Coach",
      hasAccount: true,
      availability: "available",
      rsvp: "yes",
      availabilityData: { games: 5, practices: 4, events: 2 },
    },
    {
      id: "9",
      name: "Tyler StaffPalmer",
      initials: "TS",
      team: "Tyler's Baseball Team",
      division: "9U",
      role: "Head Coach",
      hasAccount: false,
      availability: "available",
      rsvp: "yes",
      availabilityData: { games: 7, practices: 6, events: 4 },
    },
    {
      id: "10",
      name: "Tyler Palmer",
      initials: "TP",
      dateOfBirth: "9/20/1991",
      age: 34,
      team: "Marlins",
      division: "8U",
      role: "Head Coach",
      hasAccount: true,
      availability: "available",
      rsvp: "yes",
      availabilityData: { games: 5, practices: 4, events: 3 },
    },
    {
      id: "11",
      name: "Tyler Palmer",
      initials: "TP",
      gender: "male",
      dateOfBirth: "9/20/1991",
      age: 34,
      team: "Dodgers",
      division: "8U",
      role: "Player",
      hasAccount: true,
      availability: "maybe",
      rsvp: "maybe",
      availabilityData: { games: 3, practices: 2, events: 1 },
    },
    {
      id: "12",
      name: "Tyler 2nd User",
      initials: "TU",
      team: "Marlins",
      role: "Player",
      hasAccount: true,
      availability: "available",
      rsvp: "yes",
      availabilityData: { games: 4, practices: 3, events: 2 },
    },
    {
      id: "13",
      name: "Tyler Staf Palmer",
      initials: "TP",
      dateOfBirth: "9/20/1991",
      age: 34,
      team: "Tyler's Baseball Team",
      division: "9U",
      role: "Head Coach",
      hasAccount: true,
      availability: "available",
      rsvp: "yes",
      availabilityData: { games: 6, practices: 5, events: 3 },
    },
    {
      id: "14",
      name: "Tyler Staff2 Palmer",
      initials: "TP",
      team: "Tyler's Baseball Team",
      division: "9U",
      role: "Head Coach",
      hasAccount: false,
      availability: "available",
      rsvp: "yes",
      availabilityData: { games: 5, practices: 4, events: 2 },
    },
    {
      id: "15",
      name: "Tyler Staff5 Palmer",
      initials: "TP",
      team: "Dodgers",
      division: "8U",
      role: "Coach",
      hasAccount: false,
      availability: "available",
      rsvp: "yes",
      availabilityData: { games: 4, practices: 3, events: 2 },
    },
    {
      id: "16",
      name: "Tyler Staff52 Palmer",
      initials: "TP",
      team: "Unassigned",
      role: "Coach",
      hasAccount: false,
      availability: "unknown",
      rsvp: "unknown",
    },
    {
      id: "17",
      name: "Tyler User Palmer",
      initials: "TP",
      gender: "male",
      dateOfBirth: "9/20/2009",
      age: 16,
      team: "Marlins",
      role: "Player",
      hasAccount: true,
      availability: "unavailable",
      rsvp: "no",
      availabilityData: { games: 2, practices: 1, events: 0 },
    },
  ];

  return baseParticipants;
}

export function Participants({ participants: propParticipants, teamFilter, showAvailabilityColumns }: ParticipantsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<Set<string>>(new Set());
  const [pageSize, setPageSize] = useState(10);
  
  const participants = propParticipants.length > 0 ? propParticipants : generateMockParticipants();
  
  const filteredParticipants = participants.filter((p) => {
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTeam = !teamFilter || p.team === teamFilter;
    return matchesSearch && matchesTeam;
  });

  const displayedParticipants = filteredParticipants.slice(0, pageSize);

  const toggleParticipantSelection = (participantId: string) => {
    const newSelected = new Set(selectedParticipants);
    if (newSelected.has(participantId)) {
      newSelected.delete(participantId);
    } else {
      newSelected.add(participantId);
    }
    setSelectedParticipants(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedParticipants.size === displayedParticipants.length) {
      setSelectedParticipants(new Set());
    } else {
      setSelectedParticipants(new Set(displayedParticipants.map((p) => p.id)));
    }
  };

  return (
    <section className="sui-pb-[100px]">
      <div className="sui-pt-4 sui-mx-auto">
        <div className="sui-flex sui-flex-col sui-gap-1">
          {/* Search and Action Buttons */}
          <div className="sui-flex sui-gap-1 sui-items-center sui-flex-wrap">
            <div className="sui-flex-1 sui-max-w-[300px]">
              <Input
                type="text"
                name="search"
                placeholder="Search by Name, Email, Phone"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                leftIcon="search"
                size="small"
              />
            </div>
            <div className="sui-flex sui-ml-auto sui-gap-1">
              <div>
                <SimpleLabelButton type="primary" size="small" label="Add" />
              </div>
              <SimpleLabelButton type="secondary" size="small" iconLeft="download" label="Export All" />
              <SimpleLabelButton type="secondary" size="small" label="Import" className="sui-hidden t:sui-block" />
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="sui-flex sui-justify-between sui-items-center sui-flex-wrap">
            <div className="sui-flex sui-items-center sui-gap-1 sui-flex-wrap sui-mb-1">
              <button className="sui-flex sui-cursor-pointer sui-items-center sui-rounded-full sui-border sui-border-dashed sui-border-neutral-border-medium hover:sui-border-admin-action-border sui-px-2 sui-py-[2px] sui-pl-1 sui-min-h-[32px] sui-gap-1 sui-whitespace-nowrap">
                <div className="sui-flex sui-items-center sui-gap-[4px] !sui-font-semibold sui-text-label">
                  <SimpleIcon name="filter_list" size="s" />
                  Gender
                </div>
              </button>
              <button className="sui-flex sui-cursor-pointer sui-items-center sui-rounded-full sui-border sui-border-dashed sui-border-neutral-border-medium hover:sui-border-admin-action-border sui-px-2 sui-py-[2px] sui-pl-1 sui-min-h-[32px] sui-gap-1 sui-whitespace-nowrap">
                <div className="sui-flex sui-flex-1 sui-gap-0.5 sui-max-w-[calc(100%-36px)]">
                  <span className="sui-text-label !sui-font-semibold sui-text-neutral-text sui-flex sui-items-center">
                    <SimpleIcon name="filter_list" size="s" />
                    Date of Birth
                  </span>
                </div>
              </button>
              <button className="sui-flex sui-cursor-pointer sui-items-center sui-rounded-full sui-border sui-border-dashed sui-border-neutral-border-medium hover:sui-border-admin-action-border sui-px-2 sui-py-[2px] sui-pl-1 sui-min-h-[32px] sui-gap-1 sui-whitespace-nowrap">
                <div className="sui-flex sui-items-center sui-gap-[4px] !sui-font-semibold sui-text-label">
                  <SimpleIcon name="filter_list" size="s" />
                  Teams
                </div>
              </button>
              <button className="sui-flex sui-cursor-pointer sui-items-center sui-rounded-full sui-border sui-border-dashed sui-border-neutral-border-medium hover:sui-border-admin-action-border sui-px-2 sui-py-[2px] sui-pl-1 sui-min-h-[32px] sui-gap-1 sui-whitespace-nowrap">
                <div className="sui-flex sui-items-center sui-gap-[4px] !sui-font-semibold sui-text-label">
                  <SimpleIcon name="filter_list" size="s" />
                  Roles
                </div>
              </button>
            </div>
            <div className="sui-flex sui-items-center sui-gap-1 sui-flex-wrap">
              <div className="sui-flex sui-items-center sui-gap-2 sui-mt-0.5">
                <label htmlFor="sort-select" className="sui-text-sm sui-text-neutral-text-medium sui-whitespace-nowrap">
                  Sort By:
                </label>
                <select
                  id="sort-select"
                  className="sui-w-[225px] sui-border sui-border-solid sui-border-neutral-border sui-rounded-full sui-px-3 sui-py-2 sui-text-body-dense sui-bg-white"
                >
                  <option>First Name: A to Z</option>
                  <option>First Name: Z to A</option>
                  <option>Last Name: A to Z</option>
                  <option>Last Name: Z to A</option>
                </select>
              </div>
              <button
                className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent active:sui-scale-95 sui-text-admin-action-text hover:sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover active:sui-bg-admin-action-background-weak-pressed sui-h-[32px] sui-w-[32px] sui-min-w-[32px]"
                type="button"
                aria-label="Manage columns"
              >
                <SimpleIcon name="view_column" size="s" />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="sui-shadow-1 sui-rounded sui-overflow-hidden sui-bg-white sui-mt-2">
          <header className="sui-flex sui-items-center sui-px-[20px] sui-py-2 sui-gap-2 sui-flex-wrap">
            <div className="sui-flex sui-items-center sui-gap-2 sui-p-2 sui-flex-wrap sui-ml-auto sui-px-0">
              <div className="sui-flex sui-items-center sui-gap-2 sui-text-sm">
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="sui-w-24 sui-text-right sui-text-[12px] sui-min-w-[80px] sui-border sui-border-solid sui-border-neutral-border sui-rounded-full sui-px-2 sui-py-1 sui-bg-white"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="250">250</option>
                </select>
              </div>
              <div className="sui-flex sui-items-center sui-gap-2 sui-text-sm sui-text-neutral-text-medium">
                <button
                  className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent sui-h-[32px] sui-w-[32px] sui-min-w-[32px] sui-text-neutral-icon-disabled hover:sui-border-transparent hover:sui-bg-transparent hover:sui-text-neutral-icon-disabled active:sui-scale-100 active:sui-bg-transparent"
                  disabled
                  aria-label="Previous page"
                >
                  <SimpleIcon name="chevron_left" size="s" />
                </button>
                <span>
                  1 - {displayedParticipants.length} of {filteredParticipants.length}
                </span>
                <button
                  className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent sui-h-[32px] sui-w-[32px] sui-min-w-[32px] sui-text-neutral-icon-disabled hover:sui-border-transparent hover:sui-bg-transparent hover:sui-text-neutral-icon-disabled active:sui-scale-100 active:sui-bg-transparent"
                  disabled
                  aria-label="Next page"
                >
                  <SimpleIcon name="chevron_right" size="s" />
                </button>
              </div>
            </div>
          </header>

          <div className="sui-w-full sui-overflow-x-auto">
            <table className="sui-w-full sui-border-spacing-0 sui-border-separate sui-text-body-dense sui-min-w-[600px]">
              <thead className="[&_th]:sui-border-b [&_th]:sui-border-solid [&_th]:sui-border-neutral-border [&_th]:sui-bg-neutral-background-weak">
                <tr>
                  <th className="sui-p-2 sui-text-left sui-align-middle sui-body-dense sui-w-[50px]">
                    <div className="sui-flex sui-items-center sui-justify-center">
                      <SimpleCheckbox
                        checked={selectedParticipants.size === displayedParticipants.length && displayedParticipants.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </div>
                  </th>
                  <th className="sui-p-2 sui-text-left sui-align-middle sui-body-dense">
                    <span>Participant ({filteredParticipants.length})</span>
                  </th>
                  <th className="sui-p-2 sui-text-left sui-align-middle sui-body-dense">
                    <span>Date of Birth (Age)</span>
                  </th>
                  <th className="sui-p-2 sui-text-left sui-align-middle sui-body-dense">
                    <span>Team</span>
                  </th>
                  {showAvailabilityColumns && (
                    <>
                      <th className="sui-p-2 sui-text-left sui-align-middle sui-body-dense">
                        <span>Availability</span>
                      </th>
                      <th className="sui-p-2 sui-text-left sui-align-middle sui-body-dense">
                        <span>RSVP</span>
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:sui-border-0 sui-body-dense">
                {displayedParticipants.map((participant) => (
                  <tr
                    key={participant.id}
                    className="hover:sui-bg-neutral-background-weak sui-border-b sui-border-solid sui-border-neutral-border"
                  >
                    <td className="sui-p-2 sui-align-middle sui-body-dense sui-w-[50px]">
                      <div className="sui-flex sui-items-center sui-justify-center">
                        <SimpleCheckbox
                          checked={selectedParticipants.has(participant.id)}
                          onChange={() => toggleParticipantSelection(participant.id)}
                        />
                      </div>
                    </td>
                    <td className="sui-p-2 sui-align-middle sui-body-dense">
                      <div className="sui-flex sui-gap-2 sui-py-2">
                        <Avatar type="initials" initials={participant.initials} size="default" />
                        <div className="sui-flex sui-flex-col sui-gap-1 sui-justify-center">
                          <div className="sui-flex sui-gap-1 sui-flex-wrap">
                            <a
                              href="#"
                              className="sui-label sui-text-admin-action-text hover:sui-underline"
                            >
                              {participant.name}
                            </a>
                            {!participant.hasAccount && (
                              <Status state="warning" text="No contact account" className="sui-text-xs" />
                            )}
                          </div>
                          {participant.gender && (
                            <span className="sui-caption sui-text-neutral-text-medium sui-capitalize">
                              {participant.gender}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="sui-p-2 sui-align-middle sui-body-dense">
                      <div className="sui-body-dense">
                        {participant.dateOfBirth ? (
                          <>
                            {participant.dateOfBirth}
                            {participant.age && (
                              <span className="sui-text-neutral-text-medium"> ({participant.age})</span>
                            )}
                          </>
                        ) : (
                          <span className="sui-text-neutral-text-medium"></span>
                        )}
                      </div>
                    </td>
                    <td className="sui-p-2 sui-align-middle sui-body-dense">
                      <div className="sui-flex sui-gap-2">
                        <div className="sui-flex sui-flex-col sui-gap-1 sui-justify-center">
                          <span>{participant.team}</span>
                          <span className="sui-caption sui-text-neutral-text-medium">
                            {participant.division && `${participant.division} · `}
                            {participant.role}
                          </span>
                        </div>
                        {participant.additionalTeams && participant.additionalTeams.length > 0 && (
                          <button className="sui-label sui-text-admin-action-text sui-cursor-pointer">
                            + {participant.additionalTeams.length} more
                          </button>
                        )}
                      </div>
                    </td>
                    {showAvailabilityColumns && (
                      <>
                        <td className="sui-p-2 sui-align-middle sui-body-dense">
                          <div className="sui-body-dense sui-flex sui-items-center sui-gap-2">
                            {participant.availabilityData && (
                              <>
                                <div className="sui-flex sui-items-center sui-gap-1 sui-text-neutral-text-medium">
                                  <SimpleIcon name="check_circle" size="s" className="sui-text-success-icon" />
                                  <span>{participant.availabilityData.games || 0}</span>
                                </div>
                                <div className="sui-flex sui-items-center sui-gap-1 sui-text-neutral-text-medium">
                                  <SimpleIcon name="cancel" size="s" className="sui-text-error-icon" />
                                  <span>{participant.availabilityData.practices || 0}</span>
                                </div>
                                <div className="sui-flex sui-items-center sui-gap-1 sui-text-neutral-text-medium">
                                  <SimpleIcon name="help" size="s" className="sui-text-warning-icon" />
                                  <span>{participant.availabilityData.events || 0}</span>
                                </div>
                              </>
                            )}
                            {!participant.availabilityData && (
                              <span className="sui-text-neutral-text-medium">—</span>
                            )}
                          </div>
                        </td>
                        <td className="sui-p-2 sui-align-middle sui-body-dense">
                          <div className="sui-body-dense">
                            {participant.rsvp === "yes" && (
                              <div className="sui-flex sui-items-center sui-gap-1">
                                <SimpleIcon name="check" size="s" className="sui-text-success-icon" />
                                <span className="sui-text-success-text">Yes</span>
                              </div>
                            )}
                            {participant.rsvp === "no" && (
                              <div className="sui-flex sui-items-center sui-gap-1">
                                <SimpleIcon name="close" size="s" className="sui-text-error-icon" />
                                <span className="sui-text-error-text">No</span>
                              </div>
                            )}
                            {participant.rsvp === "maybe" && (
                              <div className="sui-flex sui-items-center sui-gap-1">
                                <SimpleIcon name="help" size="s" className="sui-text-warning-icon" />
                                <span className="sui-text-warning-text">Maybe</span>
                              </div>
                            )}
                            {!participant.rsvp || participant.rsvp === "unknown" && (
                              <span className="sui-text-neutral-text-medium">—</span>
                            )}
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Pagination */}
          <div className="sui-flex sui-items-center sui-gap-2 sui-p-2 sui-flex-wrap sui-justify-end sui-border-t sui-border-solid sui-border-neutral-border">
            <div className="sui-flex sui-items-center sui-gap-2 sui-text-sm">
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="sui-w-24 sui-text-right sui-text-[12px] sui-min-w-[80px] sui-border sui-border-solid sui-border-neutral-border sui-rounded-full sui-px-2 sui-py-1 sui-bg-white"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="250">250</option>
              </select>
            </div>
            <div className="sui-flex sui-items-center sui-gap-2 sui-text-sm sui-text-neutral-text-medium">
              <button
                className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent sui-h-[32px] sui-w-[32px] sui-min-w-[32px] sui-text-neutral-icon-disabled hover:sui-border-transparent hover:sui-bg-transparent hover:sui-text-neutral-icon-disabled active:sui-scale-100 active:sui-bg-transparent"
                disabled
                aria-label="Previous page"
              >
                <SimpleIcon name="chevron_left" size="s" />
              </button>
              <span>
                1 - {displayedParticipants.length} of {filteredParticipants.length}
              </span>
              <button
                className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent sui-h-[32px] sui-w-[32px] sui-min-w-[32px] sui-text-neutral-icon-disabled hover:sui-border-transparent hover:sui-bg-transparent hover:sui-text-neutral-icon-disabled active:sui-scale-100 active:sui-bg-transparent"
                disabled
                aria-label="Next page"
              >
                <SimpleIcon name="chevron_right" size="s" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
