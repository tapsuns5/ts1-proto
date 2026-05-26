"use client";

import { useState, Fragment } from "react";
import { SimpleIcon } from "../SimpleIcon";
import { SimpleLabelButton } from "../SimpleLabelButton";
import { SimpleCheckbox } from "../SimpleCheckbox";
import Status from "../Status/Status";
import LabelButton from "../LabelButton/LabelButton";
import Badge from "../Badge/Badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "../DropdownMenu/DropdownMenu";
import AddGameDialog from "./AddGameDialog";
import AddPracticeDialog from "./AddPracticeDialog";
import AddOtherEventDialog from "./AddOtherEventDialog";
import ConflictDetailsDialog from "./ConflictDetailsDialog";
import BulkEditDialog from "./BulkEditDialog";

interface ScheduleEvent {
  id: string;
  date: string;
  time: string;
  timezone: string;
  type: "game" | "practice" | "other";
  name: string;
  team: string;
  status: "draft" | "published" | "canceled";
  venue: string;
  subvenue?: string;
  hasConflict?: boolean;
}

interface ScheduleTabProps {
  events: ScheduleEvent[];
}

export function ScheduleTab({ events }: ScheduleTabProps) {
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState<Set<string>>(new Set());
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false);
  const [selectedConflictEvent, setSelectedConflictEvent] = useState<ScheduleEvent | undefined>();
  const [bulkEditDialogOpen, setBulkEditDialogOpen] = useState(false);

  const toggleEventSelection = (eventId: string) => {
    const newSelected = new Set(selectedEvents);
    if (newSelected.has(eventId)) {
      newSelected.delete(eventId);
    } else {
      newSelected.add(eventId);
    }
    setSelectedEvents(newSelected);
  };

  const toggleDateSelection = (date: string, dateEvents: ScheduleEvent[]) => {
    const newSelectedDate = new Set(selectedDate);
    const newSelectedEvents = new Set(selectedEvents);

    if (newSelectedDate.has(date)) {
      newSelectedDate.delete(date);
      dateEvents.forEach((event) => newSelectedEvents.delete(event.id));
    } else {
      newSelectedDate.add(date);
      dateEvents.forEach((event) => newSelectedEvents.add(event.id));
    }

    setSelectedDate(newSelectedDate);
    setSelectedEvents(newSelectedEvents);
  };

  const handleIgnoreConflict = (scheduleId: string) => {
    // In a real implementation, this would dismiss the conflict
    console.log('Ignoring conflict for:', scheduleId);
  };

  const handleResolveConflict = (scheduleId: string, newVenueId?: string, newTime?: string) => {
    // In a real implementation, this would update the schedule item
    console.log('Resolving conflict for:', scheduleId, 'New venue:', newVenueId, 'New time:', newTime);
  };

  const handleConflictBadgeClick = (event?: ScheduleEvent) => {
    setSelectedConflictEvent(event);
    setConflictDialogOpen(true);
  };

  const groupedEvents = events.reduce((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {} as Record<string, ScheduleEvent[]>);

  const eventTypeColors = {
    game: "sui-bg-green-50",
    practice: "sui-bg-orange-60",
    other: "sui-bg-skyblue-60",
  };

  return (
    <div className="sui-pb-[100px]">
      <div className="sui-mx-auto">
        <section className="sui-flex sui-flex-col md:sui-flex-row sui-gap-2 sui-mb-2 sui-pt-4 md:sui-justify-between">
          <div className="sui-flex sui-gap-1 sui-flex-wrap">
            <fieldset className="sui-w-fit">
              <button className="sui-flex sui-w-full sui-items-center sui-justify-between sui-gap-1 sui-rounded-full sui-border sui-border-solid sui-border-neutral-border sui-bg-white sui-px-2 sui-text-desktop-5 hover:sui-border-action-border-hover sui-h-[32px] sui-cursor-pointer">
                <span className="sui-flex sui-flex-row sui-gap-1 sui-items-center">
                  <SimpleIcon name="calendar_today" size="s" className="sui-text-neutral-icon-medium" />
                  <span className="sui-flex sui-flex-row sui-gap-1 sui-items-center sui-justify-center sui-p-[4px_8px] sui-rounded-[10px]">
                    01/01/2024
                  </span>{" "}
                  -{" "}
                  <span className="sui-flex sui-flex-row sui-gap-1 sui-items-center sui-justify-center sui-p-[4px_8px] sui-rounded-[10px]">
                    01/01/2026
                  </span>
                </span>
              </button>
            </fieldset>
            <div>
              <button className="sui-flex sui-cursor-pointer sui-items-center sui-rounded-full sui-border sui-border-dashed sui-border-neutral-border-medium hover:sui-border-admin-action-border sui-px-2 sui-py-[2px] sui-pl-1 sui-min-h-[32px] sui-gap-1 sui-whitespace-nowrap sui-min-w-[100px]">
                <div className="sui-flex sui-items-center sui-gap-[4px] !sui-font-semibold sui-text-label">
                  <SimpleIcon name="add" size="s" />
                  Division/Teams
                </div>
              </button>
            </div>
            <div>
              <button className="sui-flex sui-cursor-pointer sui-items-center sui-rounded-full sui-border sui-border-dashed sui-border-neutral-border-medium hover:sui-border-admin-action-border sui-px-2 sui-py-[2px] sui-pl-1 sui-min-h-[32px] sui-gap-1 sui-whitespace-nowrap sui-min-w-[100px]">
                <div className="sui-flex sui-items-center sui-gap-[4px] !sui-font-semibold sui-text-label">
                  <SimpleIcon name="add" size="s" />
                  Venues
                </div>
              </button>
            </div>
            <div>
              <button className="sui-flex sui-cursor-pointer sui-items-center sui-rounded-full sui-border sui-border-dashed sui-border-neutral-border-medium hover:sui-border-admin-action-border sui-px-2 sui-py-[2px] sui-pl-1 sui-min-h-[32px] sui-gap-1 sui-whitespace-nowrap sui-min-w-[100px]">
                <div className="sui-flex sui-items-center sui-gap-[4px] !sui-font-semibold sui-text-label">
                  <SimpleIcon name="add" size="s" />
                  Event Type
                </div>
              </button>
            </div>
            <div>
              <button className="sui-flex sui-cursor-pointer sui-items-center sui-rounded-full sui-border sui-border-dashed sui-border-neutral-border-medium hover:sui-border-admin-action-border sui-px-2 sui-py-[2px] sui-pl-1 sui-min-h-[32px] sui-gap-1 sui-whitespace-nowrap sui-min-w-[100px]">
                <div className="sui-flex sui-items-center sui-gap-[4px] !sui-font-semibold sui-text-label">
                  <SimpleIcon name="add" size="s" />
                  Event Status
                </div>
              </button>
            </div>
            <SimpleLabelButton type="tertiary" size="small" label="Clear all" />
          </div>
          <div className="sui-flex sui-gap-1">
            <SimpleLabelButton type="secondary" size="small" iconLeft="download" label="Export" dataTestId="export-schedule-button" />
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild data-testid="add-import-dropdown-trigger">
                <LabelButton size="small" variantType="primary" labelText="Add/Import" />
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuContent align="end">
                  <AddGameDialog />
                  <AddPracticeDialog />
                  <AddOtherEventDialog />
                  <DropdownMenuItem>Import games by CSV</DropdownMenuItem>
                  <DropdownMenuItem>Import practices by CSV</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenu>
          </div>
        </section>

        <div className="sui-mb-4">
          <header className="sui-flex sui-border sui-border-neutral-border sui-items-center sui-flex-col md:sui-flex-row sui-pl-0 md:sui-pl-[20px] sui-rounded-t-lg sui-bg-white">
            {selectedEvents.size > 0 && (
              <div className="sui-flex sui-items-center sui-gap-2 sui-p-2">
                <p className="sui-font-bold">
                  {selectedEvents.size} selected
                </p>
                <div className="sui-w-px sui-h-6 sui-bg-neutral-border" />
                <SimpleLabelButton
                  type="secondary"
                  size="small"
                  label="Publish All"
                  onClick={() => {
                    // Mock publish functionality
                    console.log(`Publishing ${selectedEvents.size} events`);
                  }}
                />
                <SimpleLabelButton
                  type="secondary"
                  size="small"
                  label="Bulk Edit"
                  onClick={() => setBulkEditDialogOpen(true)}
                  className="!sui-border-black !sui-text-black hover:!sui-bg-gray-50"
                />
                <SimpleLabelButton
                  type="secondary"
                  size="small"
                  label="Cancel All"
                  onClick={() => {
                    // Mock cancel functionality
                    console.log(`Cancelling ${selectedEvents.size} events`);
                  }}
                  className="!border-red-600 !text-red-600 hover:!bg-red-50"
                  style={{ borderColor: '#dc2626', color: '#dc2626' }}
                />
                <SimpleLabelButton
                  type="secondary"
                  size="small"
                  label="Delete"
                  onClick={() => {
                    // Mock delete functionality
                    console.log(`Deleting ${selectedEvents.size} events`);
                  }}
                  className="!border-red-600 !text-red-600 hover:!bg-red-50"
                  style={{ borderColor: '#dc2626', color: '#dc2626' }}
                />
              </div>
            )}
            {selectedEvents.size === 0 && (
              <div className="sui-flex sui-items-center sui-gap-4 sui-flex-wrap sui-pt-1 md:sui-pt-0 sui-px-2 md:sui-px-0">
                <div>
                  <SimpleLabelButton type="tertiary" size="small" label="ET - Eastern" />
                </div>
                <div className="sui-flex sui-gap-2">
                  <p className="sui-flex sui-items-center sui-gap-1 sui-caption">
                    <span className={`sui-block sui-size-[12px] ${eventTypeColors.game} sui-rounded-full`} />
                    Game
                  </p>
                  <p className="sui-flex sui-items-center sui-gap-1 sui-caption">
                    <span className={`sui-block sui-size-[12px] ${eventTypeColors.practice} sui-rounded-full`} />
                    Practice
                  </p>
                  <p className="sui-flex sui-items-center sui-gap-1 sui-caption">
                    <span className={`sui-block sui-size-[12px] ${eventTypeColors.other} sui-rounded-full`} />
                    Other event
                  </p>
                </div>
              </div>
            )}
            <div className="sui-flex sui-items-center sui-gap-2 sui-p-2 sui-flex-wrap md:sui-ml-auto" data-testid="table-pagination">
              <div className="sui-flex sui-items-center sui-gap-2 sui-text-sm sui-w-24 sui-text-right sui-text-[12px] sui-min-w-[80px]">
                <select className="sui-w-full sui-text-sm sui-border sui-border-neutral-border sui-rounded sui-px-2 sui-py-1">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="250">250</option>
                </select>
              </div>
              <div className="sui-flex sui-items-center sui-gap-2 sui-text-sm sui-text-neutral-text-medium">
                <button className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent sui-h-[32px] sui-w-[32px] sui-min-w-[32px] sui-text-neutral-icon-disabled hover:sui-border-transparent hover:sui-bg-transparent hover:sui-text-neutral-icon-disabled active:sui-scale-100 active:sui-bg-transparent" disabled data-testid="table-pagination-previous-page" aria-label="Previous page">
                  <SimpleIcon name="chevron_left" size="s" />
                </button>
                <span data-testid="table-pagination-count">1 - {events.length} of {events.length}</span>
                <button className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent sui-h-[32px] sui-w-[32px] sui-min-w-[32px] sui-text-neutral-icon-disabled hover:sui-border-transparent hover:sui-bg-transparent hover:sui-text-neutral-icon-disabled active:sui-scale-100 active:sui-bg-transparent" disabled data-testid="table-pagination-next-page" aria-label="Next page">
                  <SimpleIcon name="chevron_right" size="s" />
                </button>
              </div>
            </div>
          </header>

          <div className="sui-overflow-x-auto sui-border-l sui-border-r sui-border-b sui-border-neutral-border sui-bg-white sui-rounded-b-lg">
            <table className="sui-w-full sui-border-spacing-0 sui-border-separate sui-text-body-dense sui-min-w-[700px]" data-testid="schedule-table">
            <thead className="[&_th]:sui-border-b [&_th]:sui-border-solid [&_th]:sui-border-neutral-border [&_th]:sui-bg-neutral-background-weak">
              <tr className="sui-group/row [&_td]:sui-border-b [&_td]:sui-border-solid [&_td]:sui-border-neutral-border hover:sui-bg-neutral-background-weak data-[state=selected]:sui-bg-admin-action-background-weak-hover data-[state=selected]:hover:sui-bg-admin-action-background-weak-hover">
                <th className="sui-p-2 sui-text-left sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold">
                  <div className="sui-flex sui-items-center sui-gap-2">
                    <SimpleCheckbox
                      checked={events.length > 0 && selectedEvents.size === events.length}
                      onChange={(checked) => {
                        if (checked) {
                          // Select all
                          setSelectedEvents(new Set(events.map(event => event.id)));
                        } else {
                          // Deselect all
                          setSelectedEvents(new Set());
                        }
                      }}
                    />
                  </div>
                </th>
                <th className="sui-p-2 sui-text-left sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold">
                  <div className="sui-flex sui-items-center sui-gap-2"></div>
                </th>
                <th className="sui-p-2 sui-text-left sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold">
                  <div className="sui-flex sui-items-center sui-gap-2">Team(s)</div>
                </th>
                <th className="sui-p-2 sui-text-left sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold">
                  <div className="sui-flex sui-items-center sui-gap-2">Score</div>
                </th>
                <th className="sui-p-2 sui-text-left sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold">
                  <div className="sui-flex sui-items-center sui-gap-2">Status</div>
                </th>
                <th className="sui-p-2 sui-text-left sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold">
                  <div className="sui-flex sui-items-center sui-gap-2">
                    Venue
                    <span
                      className="sui-inline-flex sui-items-center sui-justify-center sui-min-w-4 sui-h-4 sui-px-1 sui-rounded-full sui-bg-red-50 sui-text-red-600 sui-text-[10px] sui-font-bold sui-cursor-pointer sui-hover:opacity-80"
                      title="View all conflicts"
                      onClick={() => handleConflictBadgeClick()}
                    >
                      2
                    </span>
                  </div>
                </th>
                <th className="sui-p-2 sui-text-left sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold">
                  <div className="sui-flex sui-items-center sui-gap-2"></div>
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:sui-border-0 sui-body-dense">
              {Object.entries(groupedEvents).map(([date, dateEvents]) => (
                <Fragment key={date}>
                  <tr className="sui-group/row [&_td]:sui-border-b [&_td]:sui-border-solid [&_td]:sui-border-neutral-border hover:sui-bg-neutral-background-weak data-[state=selected]:sui-bg-admin-action-background-weak-hover data-[state=selected]:hover:sui-bg-admin-action-background-weak-hover">
                    <td className="sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-font-bold sui-text-neutral-primary sui-bg-white sui-sticky sui-p-0 sui-z-10 sui-top-[73px]" colSpan={7}>
                      <div className="sui-p-2 sui-flex sui-gap-2 sui-items-center">
                        <SimpleCheckbox
                          checked={selectedDate.has(date)}
                          onChange={(checked) => toggleDateSelection(date, dateEvents)}
                        />
                        {date}
                        <div className="sui-mr-auto"></div>
                      </div>
                    </td>
                  </tr>
                  {dateEvents.map((event) => (
                    <tr
                      key={event.id}
                      className="sui-group/row [&_td]:sui-border-b [&_td]:sui-border-solid [&_td]:sui-border-neutral-border hover:sui-bg-neutral-background-weak data-[state=selected]:sui-bg-admin-action-background-weak-hover data-[state=selected]:hover:sui-bg-admin-action-background-weak-hover"
                      data-testid={event.id}
                    >
                      <td className="sui-p-2 [&:has([role=checkbox])]:sui-pr-0 sui-w-[10px] sui-pr-0 sui-align-top">
                        <SimpleCheckbox
                          checked={selectedEvents.has(event.id)}
                          onChange={(checked) => {
                            if (checked) {
                              setSelectedEvents(new Set([...selectedEvents, event.id]));
                            } else {
                              const newSelected = new Set(selectedEvents);
                              newSelected.delete(event.id);
                              setSelectedEvents(newSelected);
                            }
                          }}
                        />
                      </td>
                      <td className={`sui-p-2 [&:has([role=checkbox])]:sui-pr-0 sui-w-[20%] sui-align-top sui-pl-0 ${event.status === "canceled" ? "sui-line-through" : ""}`}>
                        <p className="sui-text-neutral-text-medium sui-pt-[5px]">
                          {event.time} {event.timezone}
                        </p>
                        {event.status === "canceled" && (
                          <div className="sui-mt-1" data-testid="canceled-pill">
                            <Status state="inactive" text="Canceled" />
                          </div>
                        )}
                      </td>
                      <td className={`sui-p-2 [&:has([role=checkbox])]:sui-pr-0 sui-align-top sui-py-0 ${event.status === "canceled" ? "sui-line-through" : ""}`}>
                        <div className="sui-flex sui-gap-2 sui-py-2 sui-h-[70px] sui-items-center">
                          <span className={`sui-block sui-size-[12px] sui-relative ${eventTypeColors[event.type]} sui-rounded-full`} />
                          <div className="sui-h-full sui-flex sui-flex-col sui-justify-between">
                            <div>{event.name}</div>
                            <div>{event.team}</div>
                          </div>
                        </div>
                      </td>
                      <td className="sui-p-2 [&:has([role=checkbox])]:sui-pr-0 sui-align-top sui-py-0">
                        <div data-testid="score-cell" className="sui-flex sui-h-[70px] sui-py-2">
                          <div className="sui-flex sui-h-full sui-text-sm sui-flex-row sui-gap-2">
                            <div className="sui-w-[48px] sui-flex sui-flex-col sui-justify-between">
                              <span>-</span>
                              <span>-</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={`sui-p-2 sui-align-middle [&:has([role=checkbox])]:sui-pr-0 ${event.status === "canceled" ? "sui-line-through" : ""}`}>
                        <Badge
                          labelText={
                            event.status === "draft" ? "Draft"
                            : event.status === "canceled" ? "Cancelled"
                            : "Published"
                          }
                          variant={
                            event.status === "draft" ? "caution1"
                            : event.status === "canceled" ? "negative"
                            : "positive"
                          }
                        />
                      </td>
                      <td className={`sui-p-2 sui-align-middle [&:has([role=checkbox])]:sui-pr-0 ${event.status === "canceled" ? "sui-line-through" : ""}`}>
                        <div className="sui-flex sui-items-center sui-gap-2">
                          {!event.venue && <p>TBD</p>}
                          {event.venue && (
                            <>
                              <div>
                                <p className="sui-mb-0.5">{event.venue}</p>
                                {event.subvenue && (
                                  <p className="sui-caption sui-text-neutral-text-medium">{event.subvenue}</p>
                                )}
                              </div>
                              {event.hasConflict && (
                                <span
                                  className="sui-inline-flex sui-items-center sui-justify-center sui-w-4 sui-h-4 sui-rounded-full sui-text-[10px] sui-font-bold sui-cursor-pointer sui-hover:opacity-80 sui-bg-red-50 sui-text-red-600"
                                  title="View conflict details"
                                  onClick={() => handleConflictBadgeClick(event)}
                                >
                                  !
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="sui-p-2 sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-pr-4">
                        <div className="sui-flex sui-gap-2 sui-items-center sui-justify-end">
                          {event.status !== "canceled" && (
                            <button className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent active:sui-scale-95 sui-text-admin-action-text hover:sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover active:sui-bg-admin-action-background-weak-pressed sui-h-[32px] sui-w-[32px] sui-min-w-[32px]" data-testid="edit-game-dialog-trigger" type="button">
                              <SimpleIcon name="edit" size="s" />
                            </button>
                          )}
                          <button className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent active:sui-scale-95 sui-text-admin-action-text hover:sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover active:sui-bg-admin-action-background-weak-pressed sui-h-[32px] sui-w-[32px] sui-min-w-[32px]" data-testid="icon-button-component" type="button">
                            <SimpleIcon name="chevron_right" size="s" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
      
      <ConflictDetailsDialog
        open={conflictDialogOpen}
        onClose={() => {
          setConflictDialogOpen(false);
          setSelectedConflictEvent(undefined);
        }}
        scheduleItem={selectedConflictEvent}
        conflicts={events}
        showAllConflicts={!selectedConflictEvent}
        onIgnoreConflict={handleIgnoreConflict}
        onResolveConflict={handleResolveConflict}
      />
      <BulkEditDialog
        open={bulkEditDialogOpen}
        onClose={() => setBulkEditDialogOpen(false)}
        selectedEventsCount={selectedEvents.size}
      />
    </div>
  );
}
