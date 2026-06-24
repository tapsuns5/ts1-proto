"use client";

import React, { useState, Fragment, useMemo } from "react";
import * as Popover from "@radix-ui/react-popover";
import { parse, format, startOfWeek, addDays, addMonths, subMonths, isSameDay, isToday } from "date-fns";
import { SimpleIcon } from "../SimpleIcon";
import { SimpleLabelButton } from "../SimpleLabelButton";
import { SimpleCheckbox } from "../SimpleCheckbox";
import Badge from "../Badge/Badge";
import Combobox from "../Combobox/Combobox";
import { ComboboxTrigger } from "../Combobox/components/ComboboxTrigger";
import { ComboboxContent } from "../Combobox/Combobox";
import { ComboboxList } from "../Combobox/components/ComboboxList";
import { ComboboxItem } from "../Combobox/components/ComboboxItem";
import { getDeterministicScore } from "./scoreUtils";
import type { ScheduleEvent } from "./ScheduleTab";

interface ScheduleTabV2Props {
  events: ScheduleEvent[];
  selectedEvents: Set<string>;
  selectedDate: Set<string>;
  selectedSchedules: string[];
  scheduleOptions: { value: string; label: string }[];
  showUnscheduledGames: boolean;
  potentialUnscheduledEvents: ScheduleEvent[];
  onToggleEventSelection: (eventId: string) => void;
  onToggleDateSelection: (date: string, dateEvents: ScheduleEvent[]) => void;
  onToggleSelectAll: (checked: boolean) => void;
  onSchedulesChange: (vals: string[]) => void;
  onToggleUnscheduled: () => void;
  onConflictBadgeClick?: (event?: ScheduleEvent) => void;
  onCoachConflictBadgeClick?: (event?: ScheduleEvent) => void;
  onStatsClick?: () => void;
  onCreateScheduleClick?: () => void;
  addImportDropdown?: React.ReactNode;
}

type ViewMode = "list" | "calendar" | "venue";
type CalendarSubView = "day" | "week" | "month";

const LIST_COLUMNS = [
  { key: "checkbox", label: "Checkbox", alwaysVisible: true },
  { key: "schedule", label: "Schedule", alwaysVisible: false },
  { key: "time", label: "Time", alwaysVisible: false },
  { key: "type", label: "Type", alwaysVisible: false },
  { key: "team", label: "Team(s)", alwaysVisible: false },
  { key: "score", label: "Score", alwaysVisible: false },
  { key: "status", label: "Status", alwaysVisible: false },
  { key: "venue", label: "Venue", alwaysVisible: false },
  { key: "actions", label: "Actions", alwaysVisible: true },
] as const;

function eventDateToDate(dateStr: string): Date {
  // Event dates are formatted like "Sat, Apr 5, 2025"
  const parsed = parse(dateStr, "EEE, MMM d, yyyy", new Date());
  if (isNaN(parsed.getTime())) {
    return new Date();
  }
  return parsed;
}

function eventTimeToMinutes(time: string): number {
  if (!time || time === "TBD") return 8 * 60;
  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return 8 * 60;
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return hour * 60 + minute;
}

function eventDurationMinutes(type: ScheduleEvent["type"]): number {
  if (type === "game") return 120;
  if (type === "practice") return 90;
  return 60;
}

function typeLabel(type: ScheduleEvent["type"]) {
  return type === "game" ? "Game" : type === "practice" ? "Practice" : "Other";
}

function formatHour(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  if (hour > 12) return `${hour - 12} PM`;
  return `${hour} AM`;
}

type VenueGroupLocal = {
  name: string;
  subVenues: { name: string; events: ScheduleEvent[] }[];
};

function eventsToVenueGroups(events: ScheduleEvent[]): VenueGroupLocal[] {
  const venueMap = new Map<string, Map<string, ScheduleEvent[]>>();
  events.forEach((event) => {
    const venueName = event.venue || "TBD";
    const subVenueName = event.subvenue || "Main";
    if (!venueMap.has(venueName)) {
      venueMap.set(venueName, new Map());
    }
    const subVenueMap = venueMap.get(venueName)!;
    if (!subVenueMap.has(subVenueName)) {
      subVenueMap.set(subVenueName, []);
    }
    subVenueMap.get(subVenueName)!.push(event);
  });
  return Array.from(venueMap.entries()).map(([name, subVenueMap]) => ({
    name,
    subVenues: Array.from(subVenueMap.entries()).map(([name, events]) => ({
      name,
      events,
    })),
  }));
}

const HOUR_HEIGHT = 48;
const DAY_HEADER_HEIGHT = 48;

function eventEndTime(time: string, type: ScheduleEvent["type"]): string {
  if (!time || time === "TBD") return "TBD";
  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return time;
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  const duration = eventDurationMinutes(type);
  const endMinutes = hour * 60 + minute + duration;
  const endHour = Math.floor(endMinutes / 60) % 24;
  const endMin = endMinutes % 60;
  const endPeriod = endHour >= 12 ? "PM" : "AM";
  const displayHour = endHour === 0 ? 12 : endHour > 12 ? endHour - 12 : endHour;
  return `${displayHour}:${endMin.toString().padStart(2, "0")} ${endPeriod}`;
}

function EventBlock({
  event,
  eventTypeColors: _eventTypeColors,
  className,
  style,
  children,
}: {
  event: ScheduleEvent;
  eventTypeColors: Record<ScheduleEvent["type"], string>;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  const dotColorForType = (type: ScheduleEvent["type"]) => {
    if (type === "game") return "sui-bg-green-50";
    if (type === "practice") return "sui-bg-orange-60";
    return "sui-bg-skyblue-60";
  };
  const [hovered, setHovered] = useState(false);
  const blockRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const handleMouseEnter = () => {
    if (blockRef.current) {
      const rect = blockRef.current.getBoundingClientRect();
      const cardWidth = 280;
      let left = rect.left + rect.width / 2 - cardWidth / 2;
      left = Math.max(8, Math.min(left, window.innerWidth - cardWidth - 8));
      const top = rect.top - 8;
      setPosition({ top, left });
    }
    setHovered(true);
  };

  return (
    <>
      <div
        ref={blockRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setHovered(false)}
        className={className}
        style={style}
      >
        {children}
      </div>
      {hovered && (
        <div
          className="sui-fixed sui-z-50 sui-w-[280px] sui-bg-neutral-text sui-text-white sui-rounded-xl sui-shadow-2 sui-p-4 sui-flex sui-flex-col sui-gap-2 sui-translate-y-[-100%]"
          style={{ top: position.top, left: position.left }}
        >
          <div className="sui-flex sui-items-center sui-gap-2 sui-pb-1 sui-border-b sui-border-white/20">
            <span className={`sui-block sui-size-[10px] sui-rounded-full ${dotColorForType(event.type)}`} />
            <p className="sui-font-semibold sui-text-sm">{event.name}</p>
          </div>
          <div className="sui-grid sui-grid-cols-[auto_1fr] sui-gap-x-3 sui-gap-y-1 sui-text-sm">
            <span className="sui-text-white/70">Teams:</span>
            <span>{event.team || "—"}</span>
            <span className="sui-text-white/70">Venue:</span>
            <span>{event.venue || "TBD"}{event.subvenue ? ` · ${event.subvenue}` : ""}</span>
            <span className="sui-text-white/70">Time:</span>
            <span>{event.time || "TBD"} – {eventEndTime(event.time, event.type)}</span>
            <span className="sui-text-white/70">Type:</span>
            <span className="sui-capitalize">{event.type}</span>
            <span className="sui-text-white/70">Status:</span>
            <span className="sui-capitalize">{event.status === "canceled" ? "Cancelled" : event.status}</span>
          </div>
          <div className="sui-absolute sui-size-[10px] sui-bg-neutral-text sui-rotate-45 sui-left-1/2 -sui-translate-x-1/2 sui-bottom-[-5px]" />
        </div>
      )}
    </>
  );
}

interface CalendarTimeGridProps {
  dates: Date[];
  eventsByDate: Record<string, ScheduleEvent[]>;
  eventTypeColors: Record<ScheduleEvent["type"], string>;
  eventTypeTextColors: Record<ScheduleEvent["type"], string>;
  startHour: number;
  endHour: number;
}

function CalendarTimeGrid({ dates, eventsByDate, eventTypeColors, eventTypeTextColors, startHour, endHour }: CalendarTimeGridProps) {
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  const totalHeight = hours.length * HOUR_HEIGHT;

  return (
    <div className="sui-border sui-border-neutral-border sui-rounded-lg sui-bg-white sui-overflow-x-auto">
      <div className="sui-min-w-max">
        {/* Header row */}
        <div className="sui-flex sui-border-b sui-border-neutral-border sui-sticky sui-top-0 sui-z-20 sui-bg-white">
          <div
            className="sui-flex-shrink-0 sui-bg-neutral-background-weak sui-border-r sui-border-neutral-border"
            style={{ width: 64, height: DAY_HEADER_HEIGHT, position: "sticky", left: 0, zIndex: 30 }}
          />
          {dates.map((date) => (
            <div
              key={format(date, "yyyy-MM-dd")}
              className="sui-flex-1 sui-flex sui-flex-col sui-items-center sui-justify-center sui-border-r sui-border-neutral-border sui-p-2"
              style={{ minWidth: dates.length === 1 ? 280 : 140, height: DAY_HEADER_HEIGHT }}
            >
              <span className="sui-text-xs sui-font-medium sui-text-neutral-text-medium">{format(date, "EEE")}</span>
              <span className="sui-text-sm sui-font-semibold sui-text-neutral-text">{format(date, "MMM d")}</span>
            </div>
          ))}
        </div>

        {/* Grid body */}
        <div className="sui-flex" style={{ height: totalHeight }}>
          {/* Time labels */}
          <div
            className="sui-flex-shrink-0 sui-bg-neutral-background-weak sui-border-r sui-border-neutral-border"
            style={{ width: 64, position: "sticky", left: 0, zIndex: 15 }}
          >
            {hours.map((h) => (
              <div key={h} className="sui-flex sui-items-start sui-justify-center sui-text-[10px] sui-text-neutral-text-medium sui-pt-1" style={{ height: HOUR_HEIGHT }}>
                {formatHour(h)}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {dates.map((date) => {
            const key = format(date, "yyyy-MM-dd");
            const dayEvents = eventsByDate[key] || [];
            return (
              <div
                key={key}
                className="sui-flex-1 sui-relative sui-border-r sui-border-neutral-border"
                style={{ minWidth: dates.length === 1 ? 280 : 140 }}
              >
                {/* Hour grid lines */}
                {hours.map((h) => (
                  <div
                    key={h}
                    className="sui-absolute sui-left-0 sui-right-0 sui-border-b sui-border-neutral-border/50"
                    style={{ top: (h - startHour) * HOUR_HEIGHT, height: HOUR_HEIGHT }}
                  />
                ))}
                {/* Events */}
                {dayEvents.map((event) => {
                  const startMinutes = eventTimeToMinutes(event.time);
                  const duration = eventDurationMinutes(event.type);
                  const top = ((startMinutes - startHour * 60) / 60) * HOUR_HEIGHT;
                  const height = (duration / 60) * HOUR_HEIGHT;
                  if (top < 0 || top > totalHeight) return null;
                  return (
                    <EventBlock
                      key={event.id}
                      event={event}
                      eventTypeColors={eventTypeColors}
                      className={`sui-absolute sui-left-1 sui-right-1 sui-rounded sui-px-2 sui-py-1 sui-text-xs sui-font-medium ${eventTypeTextColors[event.type]} sui-border sui-border-white/50 sui-shadow-sm sui-overflow-hidden ${eventTypeColors[event.type]} sui-cursor-pointer hover:sui-opacity-90`}
                      style={{ top: Math.max(top, 0), height: Math.max(height, 20), minHeight: 20 }}
                    >
                      <p className="sui-truncate sui-font-semibold">{event.name}</p>
                      <p className="sui-truncate sui-text-[10px] sui-opacity-90">{event.time} · {event.venue || "TBD"}</p>
                    </EventBlock>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface CalendarMonthGridProps {
  currentDate: Date;
  eventsByDate: Record<string, ScheduleEvent[]>;
  eventTypeColors: Record<ScheduleEvent["type"], string>;
  eventTypeTextColors: Record<ScheduleEvent["type"], string>;
  onDateSelect: (date: Date) => void;
}

function CalendarMonthGrid({ currentDate, eventsByDate, eventTypeColors, eventTypeTextColors, onDateSelect }: CalendarMonthGridProps) {
  const days = useMemo(() => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const result: Date[] = [];
    let d = startDate;
    while (d <= monthEnd || result.length % 7 !== 0) {
      result.push(d);
      d = addDays(d, 1);
      if (result.length > 0 && result.length % 7 === 0 && d > monthEnd) break;
    }
    return result;
  }, [currentDate]);

  const weeks = useMemo(() => {
    const result: Date[][] = [];
    let week: Date[] = [];
    days.forEach((day, i) => {
      week.push(day);
      if (week.length === 7 || i === days.length - 1) {
        result.push([...week]);
        week = [];
      }
    });
    return result;
  }, [days]);

  const dotClassFor = (type: ScheduleEvent["type"]) => {
    if (type === "game") return "sui-bg-emerald-500";
    if (type === "practice") return "sui-bg-orange-500";
    return "sui-bg-sky-500";
  };


  return (
    <div className="sui-flex sui-flex-col sui-flex-1 sui-border sui-border-neutral-border sui-rounded-lg sui-bg-white sui-overflow-hidden">
      {/* Weekday headers */}
      <div className="sui-grid sui-grid-cols-7 sui-border-b sui-border-neutral-border">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="sui-py-1 sui-text-center sui-text-xs sui-font-semibold sui-text-neutral-text-medium">
            {d}
          </div>
        ))}
      </div>

      {/* Weeks */}
      <div className="sui-grid sui-flex-1" style={{ gridTemplateRows: `repeat(${weeks.length}, 1fr)` }}>
        {weeks.map((week, wi) => (
          <div key={wi} className="sui-grid sui-grid-cols-7 sui-border-b sui-border-neutral-border last:sui-border-b-0">
            {week.map((date, di) => {
              const key = format(date, "yyyy-MM-dd");
              const dayEvents = eventsByDate[key] || [];
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              const dayIsToday = isToday(date);
              return (
                <button
                  key={`${wi}-${di}`}
                  type="button"
                  onClick={() => onDateSelect(date)}
                  className={`sui-relative sui-flex sui-flex-col sui-items-start sui-justify-start sui-pt-0.5 sui-pl-1 sui-pr-0.5 sui-pb-0.5 sui-text-left sui-transition-colors sui-cursor-pointer sui-border-r sui-border-neutral-border last:sui-border-r-0 sui-min-h-[90px] ${
                    !isCurrentMonth ? "sui-bg-neutral-background-weak/50 sui-text-neutral-text-disabled" : "sui-bg-white sui-text-neutral-text"
                  } ${dayIsToday ? "sui-bg-accent-background-weak/30" : ""}`}
                >
                  <span
                    className={`sui-text-xs sui-font-medium sui-leading-none sui-px-1 sui-py-0.5 sui-mb-1 ${
                      dayIsToday
                        ? "sui-bg-accent-background sui-text-white sui-rounded-full"
                        : ""
                    }`}
                  >
                    {format(date, "d")}
                  </span>
                  <div className="sui-flex sui-flex-col sui-gap-1 sui-w-full sui-pr-0.5">
                    {dayEvents.slice(0, 4).map((event) => (
                      <EventBlock
                        key={event.id}
                        event={event}
                        eventTypeColors={eventTypeColors}
                        className={`sui-cursor-pointer sui-rounded sui-px-1.5 sui-py-0.5 sui-text-[10px] sui-font-medium sui-truncate sui-select-none sui-w-full ${eventTypeColors[event.type]} ${eventTypeTextColors[event.type]}`}
                      >
                        <span className="sui-flex sui-items-center sui-gap-1">
                          <span className={`sui-h-1.5 sui-w-1.5 sui-rounded-full sui-shrink-0 ${dotClassFor(event.type)}`} />
                          <span className="sui-truncate">{event.name}</span>
                        </span>
                      </EventBlock>
                    ))}
                    {dayEvents.length > 4 && (
                      <span className="sui-text-[10px] sui-text-neutral-text-medium sui-pl-1 sui-mt-0.5">
                        +{dayEvents.length - 4} more
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

interface VenueTimeGridProps {
  date: Date;
  onDateChange: (date: Date) => void;
  venueGroups: VenueGroupLocal[];
  eventTypeColors: Record<ScheduleEvent["type"], string>;
  eventTypeTextColors: Record<ScheduleEvent["type"], string>;
  startHour: number;
  endHour: number;
}

function VenueTimeGrid({ date, onDateChange, venueGroups, eventTypeColors, eventTypeTextColors, startHour, endHour }: VenueTimeGridProps) {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  const hourWidth = 80;
  const totalWidth = hours.length * hourWidth;
  const labelWidth = 160;

  const toggleGroup = (name: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div className="sui-flex sui-flex-col sui-gap-4">
      <div className="sui-flex sui-flex-wrap sui-items-center sui-justify-between sui-gap-2">
        <div className="sui-flex sui-items-center sui-gap-2">
          <button
            onClick={() => onDateChange(addDays(date, -1))}
            className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-neutral-border sui-bg-white sui-h-[32px] sui-w-[32px] hover:sui-bg-neutral-background-weak"
          >
            <SimpleIcon name="chevron_left" size="s" />
          </button>
          <span className="sui-text-sm sui-font-semibold sui-text-neutral-text">{format(date, "EEEE, MMMM d, yyyy")}</span>
          <button
            onClick={() => onDateChange(addDays(date, 1))}
            className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-neutral-border sui-bg-white sui-h-[32px] sui-w-[32px] hover:sui-bg-neutral-background-weak"
          >
            <SimpleIcon name="chevron_right" size="s" />
          </button>
        </div>
      </div>

      <div className="sui-border sui-border-neutral-border sui-rounded-lg sui-bg-white sui-overflow-x-auto">
        <div className="sui-min-w-max">
          {/* Header row */}
          <div className="sui-flex sui-border-b sui-border-neutral-border sui-sticky sui-top-0 sui-z-20 sui-bg-white">
            <div
              className="sui-flex-shrink-0 sui-bg-neutral-background-weak sui-p-2 sui-text-[12px] sui-font-semibold sui-text-neutral-text-medium sui-flex sui-items-center sui-border-r sui-border-neutral-border"
              style={{ width: labelWidth, position: "sticky", left: 0, zIndex: 30 }}
            >
              Venue / Sub-venue
            </div>
            <div className="sui-flex" style={{ width: totalWidth }}>
              {hours.map((h) => (
                <div
                  key={h}
                  className="sui-flex-shrink-0 sui-border-r sui-border-neutral-border sui-p-1 sui-text-[10px] sui-font-medium sui-text-neutral-text-medium sui-text-center"
                  style={{ width: hourWidth }}
                >
                  {formatHour(h)}
                </div>
              ))}
            </div>
          </div>

          {/* Venue groups */}
          {venueGroups.map((group) => {
            const isCollapsed = collapsedGroups.has(group.name);
            const totalGroupEvents = group.subVenues.reduce((sum, sv) => sum + sv.events.filter((e) => isSameDay(eventDateToDate(e.date), date)).length, 0);
            return (
              <div key={group.name} className="sui-border-b sui-border-neutral-border last:sui-border-b-0">
                {/* Group header */}
                <div className="sui-flex sui-bg-neutral-background-weak">
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.name)}
                    className="sui-flex-shrink-0 sui-p-2 sui-text-xs sui-font-semibold sui-text-neutral-text sui-flex sui-items-center sui-gap-2 sui-text-left hover:sui-bg-neutral-background-medium"
                    style={{ width: labelWidth, position: "sticky", left: 0, zIndex: 25 }}
                  >
                    <SimpleIcon name="location_on" size="s" />
                    <span className="sui-truncate">{group.name}</span>
                    <span className="sui-text-neutral-text-disabled sui-text-xs sui-whitespace-nowrap">
                      — {group.subVenues.length} sub-venues; {totalGroupEvents} events today
                    </span>
                    <SimpleIcon name={isCollapsed ? "chevron_right" : "expand_more"} size="s" className="sui-text-neutral-text-medium sui-ml-auto" />
                  </button>
                  <div className="sui-flex-1" style={{ width: totalWidth, height: 36 }} />
                </div>

                {/* Sub-venue rows */}
                {!isCollapsed && group.subVenues.map((sv) => {
                  const dayEvents = sv.events.filter((e) => isSameDay(eventDateToDate(e.date), date));
                  return (
                    <div key={sv.name} className="sui-flex sui-border-t sui-border-neutral-border">
                      <div
                        className="sui-flex-shrink-0 sui-bg-white sui-p-2 sui-text-xs sui-text-neutral-text sui-flex sui-items-center sui-border-r sui-border-neutral-border"
                        style={{ width: labelWidth, position: "sticky", left: 0, zIndex: 15 }}
                      >
                        {sv.name}
                      </div>
                      <div className="sui-flex sui-relative" style={{ width: totalWidth, height: 48 }}>
                        {/* Hour grid lines */}
                        {hours.map((h) => (
                          <div
                            key={h}
                            className="sui-absolute sui-top-0 sui-bottom-0 sui-border-r sui-border-neutral-border/50"
                            style={{ left: (h - startHour) * hourWidth }}
                          />
                        ))}
                        {/* Events */}
                        {dayEvents.map((event) => {
                          const startMinutes = eventTimeToMinutes(event.time);
                          const duration = eventDurationMinutes(event.type);
                          const left = ((startMinutes - startHour * 60) / 60) * hourWidth;
                          const width = (duration / 60) * hourWidth;
                          return (
                            <EventBlock
                              key={event.id}
                              event={event}
                              eventTypeColors={eventTypeColors}
                              className={`sui-absolute sui-top-1 sui-bottom-1 sui-rounded sui-px-1 sui-py-0.5 sui-flex sui-items-center sui-gap-1 sui-overflow-hidden sui-cursor-pointer hover:sui-opacity-90 sui-border sui-border-white/50 sui-shadow-sm ${eventTypeColors[event.type]} ${eventTypeTextColors[event.type]}`}
                              style={{ left: Math.max(left, 0), width: Math.max(width, 60) }}
                            >
                              <SimpleIcon name={event.type === "game" ? "sports_baseball" : event.type === "practice" ? "timer" : "stadium"} size="s" className={`sui-flex-shrink-0 ${eventTypeTextColors[event.type]}`} />
                              <span className="sui-text-[10px] sui-font-medium sui-truncate">{event.name}</span>
                            </EventBlock>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {venueGroups.length === 0 && (
            <div className="sui-p-8 sui-text-center sui-text-neutral-text-medium">
              No venues or events found for the selected date.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ScheduleTabV2({
  events,
  selectedEvents,
  selectedDate,
  selectedSchedules,
  scheduleOptions,
  showUnscheduledGames,
  potentialUnscheduledEvents,
  onToggleEventSelection,
  onToggleDateSelection,
  onToggleSelectAll,
  onSchedulesChange,
  onToggleUnscheduled: _onToggleUnscheduled,
  onConflictBadgeClick,
  onCoachConflictBadgeClick,
  onStatsClick,
  onCreateScheduleClick,
  addImportDropdown,
}: ScheduleTabV2Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [calendarSubView, setCalendarSubView] = useState<CalendarSubView>("week");
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    checkbox: true,
    schedule: true,
    time: true,
    type: true,
    team: true,
    score: true,
    status: true,
    venue: true,
    actions: true,
  });
  const [columnSelectorOpen, setColumnSelectorOpen] = useState(false);
  const [pendingVisibleColumns, setPendingVisibleColumns] = useState<Record<string, boolean>>(visibleColumns);

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const rowHeightClass = {
    short: "sui-h-[48px]",
    default: "sui-h-[70px]",
    tall: "sui-h-[96px]",
  };

  const FilterOptionList = ({
    options,
    selectedValues,
    onValuesChange,
  }: {
    options: { value: string; label: string }[];
    selectedValues: string[];
    onValuesChange: (values: string[]) => void;
  }) => {
    const [search, setSearch] = useState("");
    const filtered = options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()));
    const allSelected = options.length > 0 && options.every((o) => selectedValues.includes(o.value));
    return (
      <div className="sui-flex sui-flex-col sui-gap-1">
        <div className="sui-relative">
          <SimpleIcon name="search" size="s" className="sui-absolute sui-left-3 sui-top-1/2 -sui-translate-y-1/2 sui-text-neutral-icon-medium sui-text-[14px]" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sui-w-full sui-h-[28px] sui-pl-8 sui-pr-3 sui-rounded-full sui-border sui-border-solid sui-border-neutral-border sui-text-sm sui-text-neutral-text focus:sui-border-admin-action-border focus:sui-outline-none"
          />
        </div>
        <div className="sui-flex sui-items-center sui-gap-2 sui-py-0.5 sui-border-b sui-border-solid sui-border-neutral-border">
          <SimpleCheckbox
            checked={allSelected}
            onChange={(checked) => {
              if (checked) onValuesChange(options.map((o) => o.value));
              else onValuesChange([]);
            }}
          />
          <span className="sui-text-label-sm">Select All</span>
        </div>
        <div className="sui-flex sui-flex-col sui-gap-0 sui-max-h-[160px] sui-overflow-y-auto">
          {filtered.map((opt) => (
            <div key={opt.value} className="sui-flex sui-items-center sui-gap-2">
              <SimpleCheckbox
                checked={selectedValues.includes(opt.value)}
                onChange={(checked) => {
                  if (checked) onValuesChange([...selectedValues, opt.value]);
                  else onValuesChange(selectedValues.filter((v) => v !== opt.value));
                }}
              />
              <span className="sui-text-body-dense">{opt.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderColumnHeader = (
    columnKey: string,
    label: string,
    filterOptions?: { value: string; label: string }[],
    selectedValues?: string[],
    onValuesChange?: (values: string[]) => void,
    extra?: React.ReactNode,
  ) => {
    const isOpen = activeHeaderMenu === columnKey;
    const isSorted = sortConfig?.key === columnKey;
    return (
      <div className="sui-flex sui-items-center sui-gap-2 sui-w-full">
        <Popover.Root open={isOpen} onOpenChange={(open) => setActiveHeaderMenu(open ? columnKey : null)}>
          <Popover.Trigger asChild>
            <button
              type="button"
              className="sui-flex sui-items-center sui-justify-between sui-gap-1 sui-w-full sui-h-full sui-text-left sui-text-neutral-text-medium hover:sui-text-admin-action-text sui-transition-colors"
            >
              <span className="sui-flex-1 sui-truncate sui-leading-none">{label}</span>
              {selectedValues && selectedValues.length > 0 && (
                <span className="sui-text-label-sm sui-text-admin-action-text sui-leading-none sui-shrink-0">({selectedValues.length})</span>
              )}
              <SimpleIcon name="arrow_drop_down" size="s" className="sui-text-neutral-icon sui-text-[14px] sui-shrink-0" />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              align="start"
              sideOffset={4}
              className="sui-z-50 sui-w-[240px] sui-rounded-lg sui-border sui-border-solid sui-border-neutral-border sui-bg-white sui-shadow-2 sui-p-2 sui-flex sui-flex-col sui-gap-2"
            >
              <p className="sui-text-body-dense sui-font-semibold">{label}</p>
              <div className="sui-flex sui-flex-col sui-gap-0">
                <button
                  type="button"
                  onClick={() => setSortConfig({ key: columnKey, direction: "asc" })}
                  className={`sui-flex sui-items-center sui-gap-2 sui-w-full sui-px-2 sui-py-1 sui-text-left sui-text-body-dense sui-rounded-md hover:sui-bg-neutral-background-weak ${isSorted && sortConfig?.direction === "asc" ? "sui-bg-admin-action-background-weak-hover sui-text-admin-action-text" : ""}`}
                >
                  <SimpleIcon name="arrow_upward" size="s" className="sui-text-[14px]" />
                  Sort ascending
                </button>
                <button
                  type="button"
                  onClick={() => setSortConfig({ key: columnKey, direction: "desc" })}
                  className={`sui-flex sui-items-center sui-gap-2 sui-w-full sui-px-2 sui-py-1 sui-text-left sui-text-body-dense sui-rounded-md hover:sui-bg-neutral-background-weak ${isSorted && sortConfig?.direction === "desc" ? "sui-bg-admin-action-background-weak-hover sui-text-admin-action-text" : ""}`}
                >
                  <SimpleIcon name="arrow_downward" size="s" className="sui-text-[14px]" />
                  Sort descending
                </button>
                {isSorted && (
                  <button
                    type="button"
                    onClick={() => setSortConfig(null)}
                    className="sui-flex sui-items-center sui-gap-2 sui-w-full sui-px-2 sui-py-1 sui-text-left sui-text-body-dense sui-rounded-md hover:sui-bg-neutral-background-weak"
                  >
                    <SimpleIcon name="clear" size="s" className="sui-text-[14px]" />
                    Clear sort
                  </button>
                )}
              </div>
              {filterOptions && onValuesChange && (
                <div className="sui-flex sui-flex-col sui-gap-1">
                  <p className="sui-text-label-sm sui-text-neutral-text-medium">Filter</p>
                  <FilterOptionList options={filterOptions} selectedValues={selectedValues || []} onValuesChange={onValuesChange} />
                </div>
              )}
              <div className="sui-border-t sui-border-solid sui-border-neutral-border sui-pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setVisibleColumns((prev) => ({ ...prev, [columnKey]: false }));
                    setActiveHeaderMenu(null);
                  }}
                  className="sui-flex sui-items-center sui-gap-2 sui-w-full sui-px-2 sui-py-1 sui-text-left sui-text-body-dense sui-rounded-md hover:sui-bg-neutral-background-weak"
                >
                  <SimpleIcon name="visibility_off" size="s" className="sui-text-[14px]" />
                  Hide column
                </button>
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        {extra}
      </div>
    );
  };

  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [columnSearch, setColumnSearch] = useState("");
  const [rowHeight, setRowHeight] = useState<"short" | "default" | "tall">("default");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [rowHeightMenuOpen, setRowHeightMenuOpen] = useState(false);
  const [activeHeaderMenu, setActiveHeaderMenu] = useState<string | null>(null);

  const baseEvents =
    selectedSchedules.length > 0
      ? events.filter((e) => e.scheduleName && selectedSchedules.includes(e.scheduleName))
      : events;

  const displayEvents = showUnscheduledGames ? potentialUnscheduledEvents : baseEvents;

  const teamOptions = useMemo(() => {
    const teams = new Set<string>();
    events.forEach((e) => { if (e.team) teams.add(e.team); });
    return Array.from(teams).sort().map((t) => ({ value: t, label: t }));
  }, [events]);

  const venueOptions = useMemo(() => {
    const venues = new Set<string>();
    events.forEach((e) => { if (e.venue) venues.add(e.venue); });
    return Array.from(venues).sort().map((v) => ({ value: v, label: v }));
  }, [events]);

  const typeOptions = useMemo(() => {
    const types = new Set<string>();
    events.forEach((e) => { if (e.type) types.add(e.type); });
    return Array.from(types).sort().map((t) => ({ value: t, label: typeLabel(t as ScheduleEvent["type"]) }));
  }, [events]);

  const statusOptions = useMemo(() => {
    const statuses = new Set<string>();
    events.forEach((e) => { if (e.status) statuses.add(e.status); });
    return Array.from(statuses).sort().map((s) => ({ value: s, label: s === "canceled" ? "Cancelled" : s.charAt(0).toUpperCase() + s.slice(1) }));
  }, [events]);

  const activeFilterCount = selectedSchedules.length + selectedTeams.length + selectedVenues.length + selectedTypes.length + selectedStatuses.length;
  const resetFilters = () => {
    onSchedulesChange([]);
    setSelectedTeams([]);
    setSelectedVenues([]);
    setSelectedTypes([]);
    setSelectedStatuses([]);
  };

  const filteredEvents = useMemo(() => {
    return displayEvents.filter((e) => {
      if (selectedTeams.length > 0 && (!e.team || !selectedTeams.includes(e.team))) return false;
      if (selectedVenues.length > 0 && (!e.venue || !selectedVenues.includes(e.venue))) return false;
      if (selectedTypes.length > 0 && !selectedTypes.includes(e.type)) return false;
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(e.status)) return false;
      return true;
    });
  }, [displayEvents, selectedTeams, selectedVenues, selectedTypes, selectedStatuses]);

  const coachConflictCount = filteredEvents.filter((e) => e.coachConflicts && e.coachConflicts.length > 0).length;
  const venueConflictCount = filteredEvents.filter((e) => e.hasConflict).length;

  const groupedEvents = useMemo(() => {
    const groups = filteredEvents.reduce((acc, event) => {
      if (!acc[event.date]) acc[event.date] = [];
      acc[event.date].push(event);
      return acc;
    }, {} as Record<string, ScheduleEvent[]>);
    if (!sortConfig) return groups;
    const { key, direction } = sortConfig;
    Object.values(groups).forEach((dateEvents) => {
      dateEvents.sort((a, b) => {
        let aVal: string | number;
        let bVal: string | number;
        switch (key) {
          case "schedule": aVal = a.scheduleName || ""; bVal = b.scheduleName || ""; break;
          case "time": aVal = eventTimeToMinutes(a.time); bVal = eventTimeToMinutes(b.time); break;
          case "type": aVal = a.type; bVal = b.type; break;
          case "team": aVal = a.team; bVal = b.team; break;
          case "score": {
            const getScore = (event: ScheduleEvent) => {
              if (event.type === "game" && event.team) {
                const { score1 } = getDeterministicScore(`${event.date}-${event.team}-${event.id || ""}`);
                return score1;
              }
              return -1;
            };
            aVal = getScore(a);
            bVal = getScore(b);
            break;
          }
          case "status": aVal = a.status; bVal = b.status; break;
          case "venue": aVal = a.venue || ""; bVal = b.venue || ""; break;
          default: return 0;
        }
        if (aVal < bVal) return direction === "asc" ? -1 : 1;
        if (aVal > bVal) return direction === "asc" ? 1 : -1;
        return 0;
      });
    });
    return groups;
  }, [filteredEvents, sortConfig]);

  const eventTypeColors = {
    game: "sui-bg-green-90",
    practice: "sui-bg-orange-90",
    other: "sui-bg-skyblue-90",
  };

  const eventTypeTextColors = {
    game: "sui-text-green-30",
    practice: "sui-text-orange-30",
    other: "sui-text-skyblue-30",
  };

  const legendTypeColors = {
    game: "sui-bg-green-50",
    practice: "sui-bg-orange-60",
    other: "sui-bg-skyblue-60",
  };

  const eventsByDate = useMemo(() => {
    return filteredEvents.reduce((acc, event) => {
      const dateKey = eventDateToDate(event.date);
      const key = format(dateKey, "yyyy-MM-dd");
      if (!acc[key]) acc[key] = [];
      acc[key].push(event);
      return acc;
    }, {} as Record<string, ScheduleEvent[]>);
  }, [filteredEvents]);

  const weekEvents = useMemo(() => {
    const weekStart = startOfWeek(calendarDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      const key = format(date, "yyyy-MM-dd");
      return { date, events: eventsByDate[key] || [] };
    });
  }, [eventsByDate, calendarDate]);

  const venueGroups = useMemo(() => eventsToVenueGroups(filteredEvents), [filteredEvents]);

  return (
    <div className="sui-mb-4">
      <div className="sui-border sui-border-neutral-border sui-bg-white sui-rounded-lg">
        {/* Unified Table Header */}
        <div className="sui-flex sui-flex-col sui-border-b sui-border-solid sui-border-neutral-border sui-bg-neutral-background-weak">
          {/* Row 1: View Switcher + Legend/Timezone */}
          <div className="sui-flex sui-flex-wrap sui-items-center sui-justify-between sui-gap-2 sui-px-3 sui-py-2">
            <div className="sui-flex sui-bg-white sui-rounded-full sui-border sui-border-solid sui-border-neutral-border sui-p-1 sui-gap-1">
              <button
                onClick={() => setViewMode("list")}
                className={`sui-flex sui-items-center sui-gap-1 sui-px-3 sui-py-1 sui-rounded-full sui-text-label sui-font-semibold sui-transition-all ${
                  viewMode === "list"
                    ? "sui-bg-admin-action-background sui-text-white"
                    : "sui-text-neutral-text-medium hover:sui-bg-neutral-background-weak"
                }`}
                title="List view"
              >
                <SimpleIcon name="list" size="s" />
                <span className="hidden sm:inline">List</span>
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`sui-flex sui-items-center sui-gap-1 sui-px-3 sui-py-1 sui-rounded-full sui-text-label sui-font-semibold sui-transition-all ${
                  viewMode === "calendar"
                    ? "sui-bg-admin-action-background sui-text-white"
                    : "sui-text-neutral-text-medium hover:sui-bg-neutral-background-weak"
                }`}
                title="Calendar view"
              >
                <SimpleIcon name="calendar_today" size="s" />
                <span className="hidden sm:inline">Calendar</span>
              </button>
              <button
                onClick={() => setViewMode("venue")}
                className={`sui-flex sui-items-center sui-gap-1 sui-px-3 sui-py-1 sui-rounded-full sui-text-label sui-font-semibold sui-transition-all ${
                  viewMode === "venue"
                    ? "sui-bg-admin-action-background sui-text-white"
                    : "sui-text-neutral-text-medium hover:sui-bg-neutral-background-weak"
                }`}
                title="Venue view"
              >
                <SimpleIcon name="place" size="s" />
                <span className="hidden sm:inline">Venue</span>
              </button>
            </div>
            <div className="sui-flex sui-items-center sui-gap-3">
              <SimpleLabelButton type="tertiary" size="small" label="ET - Eastern" className="sui-flex-shrink-0" />
              <div className="sui-flex sui-gap-2 sui-items-center">
                <p className="sui-flex sui-items-center sui-gap-1 sui-caption">
                  <span className={`sui-block sui-size-[12px] ${legendTypeColors.game} sui-rounded-full`} />
                  <span className="hidden sm:inline">Game</span>
                </p>
                <p className="sui-flex sui-items-center sui-gap-1 sui-caption">
                  <span className={`sui-block sui-size-[12px] ${legendTypeColors.practice} sui-rounded-full`} />
                  <span className="hidden sm:inline">Practice</span>
                </p>
                <p className="sui-flex sui-items-center sui-gap-1 sui-caption">
                  <span className={`sui-block sui-size-[12px] ${legendTypeColors.other} sui-rounded-full`} />
                  <span className="hidden sm:inline">Other event</span>
                </p>
              </div>
              <Popover.Root open={filterMenuOpen} onOpenChange={setFilterMenuOpen}>
                <Popover.Trigger asChild>
                  <button
                    type="button"
                    className="sui-grid sui-place-content-center sui-h-[32px] sui-w-[32px] sui-rounded-full sui-border sui-border-solid sui-border-neutral-border sui-bg-white sui-text-neutral-icon hover:sui-text-admin-action-text hover:sui-border-admin-action-border sui-transition-colors sui-relative"
                    title="Filter"
                  >
                    <SimpleIcon name="filter_list" size="s" />
                    {activeFilterCount > 0 && (
                      <span className="sui-absolute sui-right-0 sui-top-0 sui-block sui-size-[8px] sui-bg-admin-action-background sui-rounded-full sui-border sui-border-white" />
                    )}
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    align="end"
                    sideOffset={4}
                    className="sui-z-50 sui-w-[320px] sui-rounded-xl sui-border sui-border-solid sui-border-neutral-border sui-bg-white sui-shadow-2 sui-p-3 sui-flex sui-flex-col sui-gap-3"
                  >
                    <p className="sui-text-body-dense sui-font-bold">Filter by</p>
                    <div className="sui-flex sui-flex-col sui-gap-3">
                      <div className="sui-flex sui-flex-col sui-gap-1">
                        <span className="sui-text-label-sm sui-text-neutral-text-medium">Schedule</span>
                        <Combobox values={selectedSchedules} onValuesChange={onSchedulesChange}>
                          <ComboboxTrigger label="Schedule" />
                          <ComboboxContent headerTitle="Select schedules">
                            <ComboboxList showSelectAllOption>
                              {scheduleOptions.map((opt) => (
                                <ComboboxItem key={opt.value} value={opt.value} label={opt.label} keywords={[opt.label]} />
                              ))}
                            </ComboboxList>
                          </ComboboxContent>
                        </Combobox>
                      </div>
                      <div className="sui-flex sui-flex-col sui-gap-1">
                        <span className="sui-text-label-sm sui-text-neutral-text-medium">Event Type</span>
                        <Combobox values={selectedTypes} onValuesChange={setSelectedTypes}>
                          <ComboboxTrigger label="Event Type" />
                          <ComboboxContent headerTitle="Select event types">
                            <ComboboxList showSelectAllOption>
                              {typeOptions.map((opt) => (
                                <ComboboxItem key={opt.value} value={opt.value} label={opt.label} keywords={[opt.label]} />
                              ))}
                            </ComboboxList>
                          </ComboboxContent>
                        </Combobox>
                      </div>
                      <div className="sui-flex sui-flex-col sui-gap-1">
                        <span className="sui-text-label-sm sui-text-neutral-text-medium">Division/Teams</span>
                        <Combobox values={selectedTeams} onValuesChange={setSelectedTeams}>
                          <ComboboxTrigger label="Division/Teams" />
                          <ComboboxContent headerTitle="Select teams">
                            <ComboboxList showSelectAllOption>
                              {teamOptions.map((opt) => (
                                <ComboboxItem key={opt.value} value={opt.value} label={opt.label} keywords={[opt.label]} />
                              ))}
                            </ComboboxList>
                          </ComboboxContent>
                        </Combobox>
                      </div>
                      <div className="sui-flex sui-flex-col sui-gap-1">
                        <span className="sui-text-label-sm sui-text-neutral-text-medium">Event Status</span>
                        <Combobox values={selectedStatuses} onValuesChange={setSelectedStatuses}>
                          <ComboboxTrigger label="Event Status" />
                          <ComboboxContent headerTitle="Select statuses">
                            <ComboboxList showSelectAllOption>
                              {statusOptions.map((opt) => (
                                <ComboboxItem key={opt.value} value={opt.value} label={opt.label} keywords={[opt.label]} />
                              ))}
                            </ComboboxList>
                          </ComboboxContent>
                        </Combobox>
                      </div>
                      <div className="sui-flex sui-flex-col sui-gap-1">
                        <span className="sui-text-label-sm sui-text-neutral-text-medium">Venues</span>
                        <Combobox values={selectedVenues} onValuesChange={setSelectedVenues}>
                          <ComboboxTrigger label="Venues" />
                          <ComboboxContent headerTitle="Select venues">
                            <ComboboxList showSelectAllOption>
                              {venueOptions.map((opt) => (
                                <ComboboxItem key={opt.value} value={opt.value} label={opt.label} keywords={[opt.label]} />
                              ))}
                            </ComboboxList>
                          </ComboboxContent>
                        </Combobox>
                      </div>
                    </div>
                    <div className="sui-flex sui-justify-between sui-pt-2 sui-border-t sui-border-solid sui-border-neutral-border">
                      <SimpleLabelButton type="tertiary" size="small" label="Reset filters" onClick={resetFilters} />
                      <SimpleLabelButton type="primary" size="small" label="Apply" onClick={() => setFilterMenuOpen(false)} />
                    </div>
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
              <Popover.Root open={sortMenuOpen} onOpenChange={setSortMenuOpen}>
                <Popover.Trigger asChild>
                  <button
                    type="button"
                    className="sui-grid sui-place-content-center sui-h-[32px] sui-w-[32px] sui-rounded-full sui-border sui-border-solid sui-border-neutral-border sui-bg-white sui-text-neutral-icon hover:sui-text-admin-action-text hover:sui-border-admin-action-border sui-transition-colors sui-relative"
                    title="Sort"
                  >
                    <SimpleIcon name="sort" size="s" />
                    {sortConfig && (
                      <span className="sui-absolute sui-right-0 sui-top-0 sui-block sui-size-[8px] sui-bg-admin-action-background sui-rounded-full sui-border sui-border-white" />
                    )}
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    align="end"
                    sideOffset={4}
                    className="sui-z-50 sui-w-[220px] sui-rounded-xl sui-border sui-border-solid sui-border-neutral-border sui-bg-white sui-shadow-2 sui-p-3 sui-flex sui-flex-col sui-gap-3"
                  >
                    <p className="sui-text-body-dense sui-font-bold">Sort</p>
                    <div className="sui-flex sui-flex-col sui-gap-1">
                      {[
                        { key: "schedule", label: "Schedule" },
                        { key: "time", label: "Time" },
                        { key: "type", label: "Type" },
                        { key: "team", label: "Team(s)" },
                        { key: "score", label: "Score" },
                        { key: "status", label: "Status" },
                        { key: "venue", label: "Venue" },
                      ].map((col) => {
                        const active = sortConfig?.key === col.key;
                        return (
                          <button
                            key={col.key}
                            type="button"
                            onClick={() => {
                              setSortConfig((prev) => {
                                if (prev?.key === col.key) {
                                  return prev.direction === "asc" ? { key: col.key, direction: "desc" } : null;
                                }
                                return { key: col.key, direction: "asc" };
                              });
                            }}
                            className={`sui-flex sui-items-center sui-justify-between sui-w-full sui-px-3 sui-py-2 sui-text-left sui-text-body-dense sui-rounded-lg hover:sui-bg-neutral-background-weak ${active ? "sui-bg-admin-action-background-weak-hover sui-text-admin-action-text" : ""}`}
                          >
                            <span>{col.label}</span>
                            {active && sortConfig && (
                              <SimpleIcon name={sortConfig.direction === "asc" ? "arrow_upward" : "arrow_downward"} size="s" className="sui-text-[14px]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <div className="sui-flex sui-justify-end sui-pt-2 sui-border-t sui-border-solid sui-border-neutral-border">
                      <SimpleLabelButton type="tertiary" size="small" label="Clear" onClick={() => setSortConfig(null)} />
                    </div>
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
              <Popover.Root open={rowHeightMenuOpen} onOpenChange={setRowHeightMenuOpen}>
                <Popover.Trigger asChild>
                  <button
                    type="button"
                    className="sui-grid sui-place-content-center sui-h-[32px] sui-w-[32px] sui-rounded-full sui-border sui-border-solid sui-border-neutral-border sui-bg-white sui-text-neutral-icon hover:sui-text-admin-action-text hover:sui-border-admin-action-border sui-transition-colors"
                    title="Row height"
                  >
                    <SimpleIcon name="height" size="s" />
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    align="end"
                    sideOffset={4}
                    className="sui-z-50 sui-w-[180px] sui-rounded-xl sui-border sui-border-solid sui-border-neutral-border sui-bg-white sui-shadow-2 sui-p-3 sui-flex sui-flex-col sui-gap-3"
                  >
                    <p className="sui-text-body-dense sui-font-bold">Row height</p>
                    <div className="sui-flex sui-flex-col sui-gap-1">
                      {[
                        { key: "short", label: "Short" },
                        { key: "default", label: "Default" },
                        { key: "tall", label: "Tall" },
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => {
                            setRowHeight(opt.key as "short" | "default" | "tall");
                            setRowHeightMenuOpen(false);
                          }}
                          className={`sui-flex sui-items-center sui-justify-between sui-w-full sui-px-3 sui-py-2 sui-text-left sui-text-body-dense sui-rounded-lg hover:sui-bg-neutral-background-weak ${rowHeight === opt.key ? "sui-bg-admin-action-background-weak-hover sui-text-admin-action-text" : ""}`}
                        >
                          <span>{opt.label}</span>
                          {rowHeight === opt.key && <SimpleIcon name="check" size="s" className="sui-text-[14px]" />}
                        </button>
                      ))}
                    </div>
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
              <Popover.Root
                open={columnSelectorOpen}
                onOpenChange={(open) => {
                  setColumnSelectorOpen(open);
                  if (open) setPendingVisibleColumns(visibleColumns);
                }}
              >
                <Popover.Trigger asChild>
                  <button
                    type="button"
                    className="sui-grid sui-place-content-center sui-h-[32px] sui-w-[32px] sui-rounded-full sui-border sui-border-solid sui-border-neutral-border sui-bg-white sui-text-neutral-icon hover:sui-text-admin-action-text hover:sui-border-admin-action-border sui-transition-colors"
                    title="Select columns"
                  >
                    <SimpleIcon name="view_column" size="s" />
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    align="end"
                    sideOffset={4}
                    className="sui-z-50 sui-w-[280px] sui-rounded-xl sui-border sui-border-solid sui-border-neutral-border sui-bg-white sui-shadow-2 sui-p-3 sui-flex sui-flex-col sui-gap-3"
                  >
                    <p className="sui-text-body-dense sui-font-bold">Select columns</p>
                    <div className="sui-relative">
                      <SimpleIcon name="search" size="s" className="sui-absolute sui-left-3 sui-top-1/2 -sui-translate-y-1/2 sui-text-neutral-icon-medium" />
                      <input
                        type="text"
                        placeholder="Search by column name"
                        value={columnSearch}
                        onChange={(e) => setColumnSearch(e.target.value)}
                        className="sui-w-full sui-h-[32px] sui-pl-9 sui-pr-3 sui-rounded-full sui-border sui-border-solid sui-border-neutral-border sui-text-sm sui-text-neutral-text focus:sui-border-admin-action-border focus:sui-outline-none"
                      />
                    </div>
                    <div className="sui-flex sui-items-center sui-gap-2 sui-py-1 sui-border-b sui-border-solid sui-border-neutral-border">
                      <SimpleCheckbox
                        checked={LIST_COLUMNS.filter((c) => !c.alwaysVisible).every((c) => pendingVisibleColumns[c.key])}
                        onChange={(checked) => {
                          setPendingVisibleColumns((prev) => {
                            const next = { ...prev };
                            LIST_COLUMNS.filter((c) => !c.alwaysVisible).forEach((c) => { next[c.key] = checked; });
                            return next;
                          });
                        }}
                      />
                      <span className="sui-text-label">Select All</span>
                    </div>
                    <div className="sui-flex sui-flex-col sui-gap-1 sui-max-h-[300px] sui-overflow-y-auto">
                      {LIST_COLUMNS.filter((c) => !c.alwaysVisible && c.label.toLowerCase().includes(columnSearch.toLowerCase())).map((c) => (
                        <div key={c.key} className="sui-flex sui-items-center sui-gap-2">
                          <SimpleCheckbox
                            checked={pendingVisibleColumns[c.key]}
                            onChange={(checked) => setPendingVisibleColumns((prev) => ({ ...prev, [c.key]: checked }))}
                          />
                          <span className="sui-text-body-dense">{c.label}</span>
                        </div>
                      ))}
                    </div>
                    <div className="sui-flex sui-justify-end sui-gap-2 sui-pt-2 sui-border-t sui-border-solid sui-border-neutral-border">
                      <SimpleLabelButton type="tertiary" size="small" label="Cancel" onClick={() => setColumnSelectorOpen(false)} />
                      <SimpleLabelButton
                        type="primary"
                        size="small"
                        label="Apply"
                        onClick={() => {
                          setVisibleColumns(pendingVisibleColumns);
                          setColumnSelectorOpen(false);
                        }}
                      />
                    </div>
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            </div>
          </div>

          {/* Row 2: Actions */}
          <div className="sui-flex sui-flex-wrap sui-items-center sui-justify-end sui-gap-2 sui-px-3 sui-py-2 sui-border-t sui-border-neutral-border/50">
            <div className="sui-flex sui-gap-1 sui-flex-wrap sm:sui-nowrap">
              <button
                className="sui-font-semibold sui-rounded-full sui-border sui-border-solid sui-cursor-pointer sui-transition-all sui-flex sui-items-center sui-justify-center sui-flex-shrink-0 sui-bg-white sui-text-admin-action-text sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover active:sui-scale-95 sui-text-sm sui-h-[32px] sui-w-[32px]"
                title="Export"
                data-testid="export-schedule-button"
              >
                <SimpleIcon name="upload" size="s" />
              </button>
              <button
                onClick={onStatsClick}
                className="sui-font-semibold sui-rounded-full sui-border sui-border-solid sui-cursor-pointer sui-transition-all sui-flex sui-items-center sui-justify-center sui-flex-shrink-0 sui-bg-white sui-text-admin-action-text sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover active:sui-scale-95 sui-text-sm sui-h-[32px] sui-w-[32px]"
                title="Stats"
              >
                <SimpleIcon name="bar_chart" size="s" />
              </button>
              {addImportDropdown}
              <SimpleLabelButton type="primary" size="small" label="Create Schedule" className="sui-flex-shrink-0" onClick={onCreateScheduleClick} />
            </div>
          </div>

          {/* Row 3: Pagination (list view only) */}
          {viewMode === "list" && (
            <div className="sui-flex sui-p-1 sui-items-center sui-gap-2 sui-flex-wrap sui-justify-end sui-px-3 sui-py-1.5 sui-border-t sui-border-neutral-border/50" data-testid="table-pagination">
              <div className="sui-flex sui-items-center sui-gap-2 sui-text-sm sui-w-20 sui-text-right sui-text-[12px] sui-min-w-[70px]">
                <select className="sui-w-full sui-text-sm sui-border sui-border-neutral-border sui-rounded-full sui-px-2 sui-py-1">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="250">250</option>
                </select>
              </div>
              <div className="sui-flex sui-items-center sui-gap-1 sui-text-sm sui-text-neutral-text-medium">
                <button className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent sui-h-[32px] sui-w-[32px] sui-min-w-[32px] sui-text-neutral-icon-disabled hover:sui-border-transparent hover:sui-bg-transparent hover:sui-text-neutral-icon-disabled active:sui-scale-100 active:sui-bg-transparent" disabled data-testid="table-pagination-previous-page" aria-label="Previous page">
                  <SimpleIcon name="chevron_left" size="s" />
                </button>
                <span className="text-xs sm:text-sm" data-testid="table-pagination-count">1 - {filteredEvents.length} of {filteredEvents.length}</span>
                <button className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent sui-h-[32px] sui-w-[32px] sui-min-w-[32px] sui-text-neutral-icon-disabled hover:sui-border-transparent hover:sui-bg-transparent hover:sui-text-neutral-icon-disabled active:sui-scale-100 active:sui-bg-transparent" disabled data-testid="table-pagination-next-page" aria-label="Next page">
                  <SimpleIcon name="chevron_right" size="s" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Calendar Sub-View Tabs */}
        {viewMode === "calendar" && (
          <div className="sui-flex sui-items-center sui-gap-2 sui-px-3 sui-py-2 sui-border-b sui-border-solid sui-border-neutral-border sui-bg-white">
            <div className="sui-flex sui-bg-neutral-background-weak sui-rounded-full sui-p-1 sui-gap-1">
              {(["day", "week", "month"] as CalendarSubView[]).map((subView) => (
                <button
                  key={subView}
                  onClick={() => setCalendarSubView(subView)}
                  className={`sui-px-3 sui-py-1 sui-rounded-full sui-text-label sui-font-semibold sui-transition-all sui-capitalize ${
                    calendarSubView === subView
                      ? "sui-bg-admin-action-background sui-text-white"
                      : "sui-text-neutral-text-medium hover:sui-bg-white"
                  }`}
                >
                  {subView}
                </button>
              ))}
            </div>
            <div className="sui-ml-auto sui-flex sui-items-center sui-gap-2">
              <button
                onClick={() => setCalendarDate((d) => {
                  if (calendarSubView === "day") return addDays(d, -1);
                  if (calendarSubView === "week") return addDays(d, -7);
                  return subMonths(d, 1);
                })}
                className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-neutral-border sui-bg-white sui-h-[28px] sui-w-[28px] hover:sui-bg-neutral-background-weak"
              >
                <SimpleIcon name="chevron_left" size="s" />
              </button>
              <span className="sui-text-sm sui-font-medium sui-text-neutral-text">
                {calendarSubView === "day" && format(calendarDate, "EEEE, MMMM d, yyyy")}
                {calendarSubView === "week" && `Week of ${format(startOfWeek(calendarDate, { weekStartsOn: 1 }), "MMM d, yyyy")}`}
                {calendarSubView === "month" && format(calendarDate, "MMMM yyyy")}
              </span>
              <button
                onClick={() => setCalendarDate((d) => {
                  if (calendarSubView === "day") return addDays(d, 1);
                  if (calendarSubView === "week") return addDays(d, 7);
                  return addMonths(d, 1);
                })}
                className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-neutral-border sui-bg-white sui-h-[28px] sui-w-[28px] hover:sui-bg-neutral-background-weak"
              >
                <SimpleIcon name="chevron_right" size="s" />
              </button>
            </div>
          </div>
        )}

        {/* Table Content */}
        {viewMode === "list" && (
          <div className="sui-relative sui-overflow-x-auto">
            <table className="sui-w-full sui-border-spacing-0 sui-border-separate sui-text-body-dense sui-min-w-[600px] sm:sui-min-w-[700px] [&_td]:sui-border-r [&_td]:sui-border-r-neutral-border [&_th]:sui-border-r [&_th]:sui-border-r-neutral-border" data-testid="schedule-table">
            <thead className="[&_th]:sui-border-b [&_th]:sui-border-solid [&_th]:sui-border-neutral-border [&_th]:sui-bg-neutral-background-weak [&_th]:sui-text-neutral-text-medium">
              <tr className="sui-group/row [&_td]:sui-border-b [&_td]:sui-border-solid [&_td]:sui-border-neutral-border hover:sui-bg-neutral-background-weak data-[state=selected]:sui-bg-admin-action-background-weak-hover data-[state=selected]:hover:sui-bg-admin-action-background-weak-hover">
                <th className={`sui-p-2 sui-text-left sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold sui-w-[40px] ${!visibleColumns.checkbox ? "sui-hidden" : ""}`}>
                  <div className="sui-flex sui-items-center sui-gap-2">
                    <SimpleCheckbox
                      checked={filteredEvents.length > 0 && selectedEvents.size === filteredEvents.length}
                      onChange={(checked) => onToggleSelectAll(checked)}
                    />
                  </div>
                </th>
                <th className={`sui-p-2 sui-text-left sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold sui-w-[140px] ${!visibleColumns.schedule ? "sui-hidden" : ""}`}>
                  {renderColumnHeader("schedule", "Schedule", scheduleOptions, selectedSchedules, onSchedulesChange)}
                </th>
                <th className={`sui-p-2 sui-text-left sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold sui-w-[120px] sm:sui-w-[16%] ${!visibleColumns.time ? "sui-hidden" : ""}`}>
                  {renderColumnHeader("time", "Time")}
                </th>
                <th className={`sui-p-2 sui-text-left sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold sui-w-[120px] ${!visibleColumns.type ? "sui-hidden" : ""}`}>
                  {renderColumnHeader("type", "Event Type", typeOptions, selectedTypes, setSelectedTypes)}
                </th>
                <th className={`sui-p-2 sui-text-left sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold ${!visibleColumns.team ? "sui-hidden" : ""}`}>
                  {renderColumnHeader("team", "Team(s)", teamOptions, selectedTeams, setSelectedTeams)}
                </th>
                <th className={`sui-p-2 sui-text-left sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold sui-w-[60px] sm:sui-w-auto ${!visibleColumns.score ? "sui-hidden" : ""}`}>
                  {renderColumnHeader("score", "Score")}
                </th>
                <th className={`sui-p-2 sui-text-left sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold sui-w-[80px] sm:sui-w-auto ${!visibleColumns.status ? "sui-hidden" : ""}`}>
                  {renderColumnHeader("status", "Event Status", statusOptions, selectedStatuses, setSelectedStatuses)}
                </th>
                <th className={`sui-p-2 sui-text-left sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold ${!visibleColumns.venue ? "sui-hidden" : ""}`}>
                  {renderColumnHeader("venue", "Venues", venueOptions, selectedVenues, setSelectedVenues)}
                </th>
                <th className={`sui-p-2 sui-text-left sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold sui-w-[60px] sui-border-r-0 ${!visibleColumns.actions ? "sui-hidden" : ""}`}>
                  <div className="sui-flex sui-items-center sui-gap-2"></div>
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:sui-border-0 sui-body-dense">
              {Object.entries(groupedEvents).map(([date, dateEvents]) => (
                <Fragment key={date}>
                  <tr className="sui-group/row [&_td]:sui-border-b [&_td]:sui-border-solid [&_td]:sui-border-neutral-border hover:sui-bg-neutral-background-weak data-[state=selected]:sui-bg-admin-action-background-weak-hover data-[state=selected]:hover:sui-bg-admin-action-background-weak-hover">
                    <td className="sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-font-bold sui-text-neutral-icon-medium sui-bg-white sui-sticky sui-p-0 sui-z-10 sui-top-0 sui-border-r-0" colSpan={9}>
                      <div className="sui-py-1 sui-px-2 sui-flex sui-gap-2 sui-items-center">
                        <SimpleCheckbox
                          checked={selectedDate.has(date)}
                          onChange={() => onToggleDateSelection(date, dateEvents)}
                        />
                        <span className="text-sm sm:text-base">{date}</span>
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
                      <td className={`sui-p-2 [&:has([role=checkbox])]:sui-pr-0 sui-w-[40px] sui-pr-0 sui-align-top ${!visibleColumns.checkbox ? "sui-hidden" : ""}`}>
                        <SimpleCheckbox
                          checked={selectedEvents.has(event.id)}
                          onChange={() => {
                            onToggleEventSelection(event.id);
                          }}
                        />
                      </td>
                      <td className={`sui-p-2 [&:has([role=checkbox])]:sui-pr-0 sui-align-top sui-py-0 sui-w-[140px] ${!visibleColumns.schedule ? "sui-hidden" : ""} ${event.status === "canceled" ? "sui-line-through" : ""}`}>
                        <div className={`sui-flex sui-items-center ${rowHeightClass[rowHeight]} sui-py-2`}>
                          <span className="sui-text-xs sm:text-sm sui-text-neutral-text sui-truncate" title={event.scheduleName || ""}>{event.scheduleName || "—"}</span>
                        </div>
                      </td>
                      <td className={`sui-p-2 sui-pl-2 [&:has([role=checkbox])]:sui-pr-0 sui-w-[120px] sm:sui-w-[16%] sui-align-top sui-pl-0 ${!visibleColumns.time ? "sui-hidden" : ""} ${event.status === "canceled" ? "sui-line-through" : ""}`}>
                        <div className="sui-flex sui-flex-col sui-gap-1">
                          <p className="sui-text-neutral-text-medium sui-text-xs sm:text-sm sui-font-medium">
                            {event.time || "TBD"}
                          </p>
                        </div>
                      </td>
                      <td className={`sui-p-2 [&:has([role=checkbox])]:sui-pr-0 sui-align-top sui-py-0 sui-w-[120px] ${!visibleColumns.type ? "sui-hidden" : ""} ${event.status === "canceled" ? "sui-line-through" : ""}`}>
                        <div className={`sui-flex sui-items-center sui-gap-2 ${rowHeightClass[rowHeight]} sui-py-2`}>
                          <span className={`sui-block sui-size-[12px] sui-relative ${legendTypeColors[event.type]} sui-rounded-full sui-flex-shrink-0`} />
                          <span className="sui-text-xs sm:text-sm sui-capitalize">{typeLabel(event.type)}</span>
                        </div>
                      </td>
                      <td className={`sui-p-2 [&:has([role=checkbox])]:sui-pr-0 sui-align-top sui-py-0 ${!visibleColumns.team ? "sui-hidden" : ""} ${event.status === "canceled" ? "sui-line-through" : ""}`}>
                        <div className={`sui-flex sui-flex-col sui-justify-between ${rowHeightClass[rowHeight]} sui-py-2 sui-min-w-0`}>
                          <div className="sui-truncate sm:sui-truncate" title={event.name}>{event.name}</div>
                          <div className="sui-flex sui-items-center sui-gap-1">
                            <div className="sui-truncate sm:sui-truncate text-xs sm:text-sm sui-text-neutral-text-medium" title={event.team}>{event.team}</div>
                            {event.coachConflicts && event.coachConflicts.length > 0 && (
                              <Badge
                                labelText="Coach Conflict"
                                variant="caution1"
                                className="sui-cursor-pointer sui-hover:opacity-80 sui-flex-shrink-0"
                                onClick={() => onCoachConflictBadgeClick?.(event)}
                              />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className={`sui-p-2 [&:has([role=checkbox])]:sui-pr-0 sui-align-top sui-py-0 sui-w-[60px] sm:sui-w-auto ${!visibleColumns.score ? "sui-hidden" : ""}`}>
                        <div data-testid="score-cell" className={`sui-flex ${rowHeightClass[rowHeight]} sui-py-2`}>
                          <div className="sui-flex sui-h-full sui-text-xs sm:text-sm sui-flex-row sui-gap-2">
                            <div className="sui-w-[40px] sm:sui-w-[48px] sui-flex sui-flex-col sui-justify-between">
                              {event.type === "game" && event.team ? (
                                (() => {
                                  const { score1, score2 } = getDeterministicScore(`${event.date}-${event.team}-${event.id || ''}`);
                                  return (
                                    <>
                                      <span>{score1}</span>
                                      <span>{score2}</span>
                                    </>
                                  );
                                })()
                              ) : (
                                <>
                                  <span>-</span>
                                  <span>-</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={`sui-p-2 sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-w-[80px] sm:sui-w-auto ${!visibleColumns.status ? "sui-hidden" : ""} ${event.status === "canceled" ? "sui-line-through" : ""}`}>
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
                      <td className={`sui-p-2 sui-align-middle [&:has([role=checkbox])]:sui-pr-0 ${!visibleColumns.venue ? "sui-hidden" : ""} ${event.status === "canceled" ? "sui-line-through" : ""}`}>
                        <div className="sui-flex sui-items-center sui-gap-2 sui-min-w-0">
                          {!event.venue && <p className="text-xs sm:text-sm">TBD</p>}
                          {event.venue && (
                            <>
                              <div className="sui-min-w-0">
                                <p className="sui-mb-0.5 sui-truncate text-xs sm:text-sm" title={event.venue}>{event.venue}</p>
                                {event.subvenue && (
                                  <p className="sui-caption sui-text-neutral-text-medium sui-truncate text-xs" title={event.subvenue}>{event.subvenue}</p>
                                )}
                              </div>
                              {event.hasConflict && (
                                <Badge
                                  labelText="Venue Conflict"
                                  variant="caution1"
                                  className="sui-cursor-pointer sui-hover:opacity-80"
                                  onClick={() => onConflictBadgeClick?.(event)}
                                />
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      <td className={`sui-p-2 sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-pr-4 sui-w-[60px] sui-border-r-0 ${!visibleColumns.actions ? "sui-hidden" : ""}`}>
                        <div className="sui-flex sui-gap-1 sm:sui-gap-2 sui-items-center sui-justify-end">
                          {event.status !== "canceled" && (
                            <button className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent active:sui-scale-95 sui-text-admin-action-text hover:sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover active:sui-bg-admin-action-background-weak-pressed sui-h-[28px] sui-w-[28px] sm:sui-h-[32px] sm:sui-w-[32px] sui-min-w-[28px] sm:sui-min-w-[32px]" data-testid="edit-game-dialog-trigger" type="button">
                              <SimpleIcon name="edit" size="s" />
                            </button>
                          )}
                          <button className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent active:sui-scale-95 sui-text-admin-action-text hover:sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover active:sui-bg-admin-action-background-weak-pressed sui-h-[28px] sui-w-[28px] sm:sui-h-[32px] sm:sui-w-[32px] sui-min-w-[28px] sm:sui-min-w-[32px]" data-testid="icon-button-component" type="button">
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
        )}

        {viewMode === "calendar" && (
          <div className="sui-p-4 sui-bg-white">
            {calendarSubView === "day" && (
              <CalendarTimeGrid
                dates={[calendarDate]}
                eventsByDate={eventsByDate}
                eventTypeColors={eventTypeColors}
                eventTypeTextColors={eventTypeTextColors}
                startHour={7}
                endHour={23}
              />
            )}
            {calendarSubView === "week" && (
              <CalendarTimeGrid
                dates={weekEvents.map((d) => d.date)}
                eventsByDate={eventsByDate}
                eventTypeColors={eventTypeColors}
                eventTypeTextColors={eventTypeTextColors}
                startHour={7}
                endHour={23}
              />
            )}
            {calendarSubView === "month" && (
              <CalendarMonthGrid
                currentDate={calendarDate}
                eventsByDate={eventsByDate}
                eventTypeColors={eventTypeColors}
                eventTypeTextColors={eventTypeTextColors}
                onDateSelect={(date) => {
                  setCalendarDate(date);
                  setCalendarSubView("day");
                }}
              />
            )}
          </div>
        )}

        {viewMode === "venue" && (
          <div className="sui-p-4 sui-bg-white">
            <VenueTimeGrid
              date={calendarDate}
              onDateChange={setCalendarDate}
              venueGroups={venueGroups}
              eventTypeColors={eventTypeColors}
              eventTypeTextColors={eventTypeTextColors}
              startHour={8}
              endHour={21}
            />
          </div>
        )}
      </div>
    </div>
  );
}
