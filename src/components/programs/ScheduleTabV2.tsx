"use client";

import React, { useState, Fragment, useMemo } from "react";
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
  eventTypeColors,
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
  onToggleUnscheduled,
  onConflictBadgeClick,
  onCoachConflictBadgeClick,
  onStatsClick,
  onCreateScheduleClick,
  addImportDropdown,
}: ScheduleTabV2Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [calendarSubView, setCalendarSubView] = useState<CalendarSubView>("week");
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());

  const baseEvents =
    selectedSchedules.length > 0
      ? events.filter((e) => e.scheduleName && selectedSchedules.includes(e.scheduleName))
      : events;

  const displayEvents = showUnscheduledGames ? potentialUnscheduledEvents : baseEvents;

  const coachConflictCount = displayEvents.filter((e) => e.coachConflicts && e.coachConflicts.length > 0).length;
  const venueConflictCount = displayEvents.filter((e) => e.hasConflict).length;

  const groupedEvents = displayEvents.reduce((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {} as Record<string, ScheduleEvent[]>);

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
    return displayEvents.reduce((acc, event) => {
      const dateKey = eventDateToDate(event.date);
      const key = format(dateKey, "yyyy-MM-dd");
      if (!acc[key]) acc[key] = [];
      acc[key].push(event);
      return acc;
    }, {} as Record<string, ScheduleEvent[]>);
  }, [displayEvents]);

  const dayEvents = useMemo(() => {
    const key = format(calendarDate, "yyyy-MM-dd");
    return eventsByDate[key] || [];
  }, [eventsByDate, calendarDate]);

  const weekEvents = useMemo(() => {
    const weekStart = startOfWeek(calendarDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      const key = format(date, "yyyy-MM-dd");
      return { date, events: eventsByDate[key] || [] };
    });
  }, [eventsByDate, calendarDate]);

  const venueGroups = useMemo(() => eventsToVenueGroups(displayEvents), [displayEvents]);

  return (
    <div className="sui-mb-4">
      {/* Schedule actions and filters row */}
      <div className="sui-flex sui-flex-col sui-gap-2 sm:sui-flex-row sm:sui-items-start sm:sui-justify-between sui-mb-3">
        {/* Filters */}
        <div className="sui-flex sui-flex-wrap sui-items-center sui-gap-2">
          {/* Schedule Filter */}
          <Combobox
            values={selectedSchedules}
            onValuesChange={onSchedulesChange}
          >
            <ComboboxTrigger label="Schedule" />
            <ComboboxContent headerTitle="Select schedules">
              <ComboboxList showSelectAllOption>
                {scheduleOptions.map((opt) => (
                  <ComboboxItem
                    key={opt.value}
                    value={opt.value}
                    label={opt.label}
                    keywords={[opt.label]}
                  />
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>

          {/* Division/Teams Filter */}
          <button className="sui-flex sui-cursor-pointer sui-items-center sui-rounded-full sui-border sui-border-dashed sui-border-neutral-border-medium hover:sui-border-admin-action-border sui-px-2 sui-py-[2px] sui-pl-1 sui-min-h-[32px] sui-gap-1 sui-whitespace-nowrap sui-min-w-[100px]">
            <div className="sui-flex sui-items-center sui-gap-[4px] !sui-font-semibold sui-text-label">
              <SimpleIcon name="add" size="s" />
              <span className="hidden sm:inline">Division/Teams</span>
            </div>
          </button>

          {/* Venues Filter */}
          {!showUnscheduledGames && (
            <button className="sui-flex sui-cursor-pointer sui-items-center sui-rounded-full sui-border sui-border-dashed sui-border-neutral-border-medium hover:sui-border-admin-action-border sui-px-2 sui-py-[2px] sui-pl-1 sui-min-h-[32px] sui-gap-1 sui-whitespace-nowrap sui-min-w-[80px]">
              <div className="sui-flex sui-items-center sui-gap-[4px] !sui-font-semibold sui-text-label">
                <SimpleIcon name="add" size="s" />
                Venues
              </div>
            </button>
          )}

          {/* Event Type Filter */}
          {!showUnscheduledGames && (
            <button className="sui-flex sui-cursor-pointer sui-items-center sui-rounded-full sui-border sui-border-dashed sui-border-neutral-border-medium hover:sui-border-admin-action-border sui-px-2 sui-py-[2px] sui-pl-1 sui-min-h-[32px] sui-gap-1 sui-whitespace-nowrap sui-min-w-[80px]">
              <div className="sui-flex sui-items-center sui-gap-[4px] !sui-font-semibold sui-text-label">
                <SimpleIcon name="add" size="s" />
                <span className="hidden sm:inline">Event Type</span>
              </div>
            </button>
          )}

          {/* Event Status Filter */}
          {!showUnscheduledGames && (
            <button className="sui-flex sui-cursor-pointer sui-items-center sui-rounded-full sui-border sui-border-dashed sui-border-neutral-border-medium hover:sui-border-admin-action-border sui-px-2 sui-py-[2px] sui-pl-1 sui-min-h-[32px] sui-gap-1 sui-whitespace-nowrap sui-min-w-[80px]">
              <div className="sui-flex sui-items-center sui-gap-[4px] !sui-font-semibold sui-text-label">
                <SimpleIcon name="add" size="s" />
                <span className="hidden sm:inline">Event Status</span>
              </div>
            </button>
          )}

          {/* Clear All */}
          {selectedSchedules.length > 0 && (
            <SimpleLabelButton type="tertiary" size="small" label="Clear all" onClick={() => onSchedulesChange([])} />
          )}
        </div>

        {/* Action Buttons */}
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
      <div className="sui-relative sui-overflow-x-auto sui-border sui-border-neutral-border sui-bg-white sui-rounded-lg">
        {/* V2 Table Header with View Switcher and Legend */}
        <div className="sui-flex sui-flex-col sui-gap-2 sui-p-3 sui-border-b sui-border-solid sui-border-neutral-border sui-bg-neutral-background-weak">
          {/* View Switcher / Legend Row */}
          <div className="sui-flex sui-flex-wrap sui-items-center sui-justify-between sui-gap-2">
            <div className="sui-flex sui-items-center sui-gap-2 sui-flex-wrap">
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
            </div>
            <div className="sui-flex sui-items-center sui-gap-1">
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
            </div>
          </div>
            {viewMode === "list" && (
              <div className="sui-flex sui-items-center sui-gap-2 sui-flex-wrap sui-justify-end" data-testid="table-pagination">
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
                  <span className="text-xs sm:text-sm" data-testid="table-pagination-count">1 - {displayEvents.length} of {displayEvents.length}</span>
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
          <table className="sui-w-full sui-border-spacing-0 sui-border-separate sui-text-body-dense sui-min-w-[600px] sm:sui-min-w-[700px]" data-testid="schedule-table">
            <thead className="[&_th]:sui-border-b [&_th]:sui-border-solid [&_th]:sui-border-neutral-border [&_th]:sui-bg-neutral-background-weak">
              <tr className="sui-group/row [&_td]:sui-border-b [&_td]:sui-border-solid [&_td]:sui-border-neutral-border hover:sui-bg-neutral-background-weak data-[state=selected]:sui-bg-admin-action-background-weak-hover data-[state=selected]:hover:sui-bg-admin-action-background-weak-hover">
                <th className="sui-p-2 sui-text-left sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold sui-w-[40px]">
                  <div className="sui-flex sui-items-center sui-gap-2">
                    <SimpleCheckbox
                      checked={displayEvents.length > 0 && selectedEvents.size === displayEvents.length}
                      onChange={(checked) => onToggleSelectAll(checked)}
                    />
                  </div>
                </th>
                <th className="sui-p-2 sui-text-left sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold sui-w-[120px] sm:sui-w-[20%]">
                  <div className="sui-flex sui-items-center sui-gap-2"></div>
                </th>
                <th className="sui-p-2 sui-text-left sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold">
                  <div className="sui-flex sui-items-center sui-gap-2">
                    <span className="hidden sm:inline">Team(s)</span>
                    {coachConflictCount > 0 && (
                      <Badge
                        labelText={`${coachConflictCount} Coach Conflict${coachConflictCount > 1 ? 's' : ''}`}
                        variant="caution1"
                        className="sui-cursor-pointer sui-hover:opacity-80 sui-whitespace-nowrap"
                        onClick={() => onCoachConflictBadgeClick?.()}
                      />
                    )}
                  </div>
                </th>
                <th className="sui-p-2 sui-text-left sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold sui-w-[60px] sm:sui-w-auto">
                  <div className="sui-flex sui-items-center sui-gap-2">Score</div>
                </th>
                <th className="sui-p-2 sui-text-left sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold sui-w-[70px] sm:sui-w-auto">
                  <div className="sui-flex sui-items-center sui-gap-2">Status</div>
                </th>
                <th className="sui-p-2 sui-text-left sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold">
                  <div className="sui-flex sui-items-center sui-gap-2">
                    Venue
                    {venueConflictCount > 0 && (
                      <Badge
                        labelText={`${venueConflictCount} Venue Conflict${venueConflictCount > 1 ? 's' : ''}`}
                        variant="caution1"
                        className="sui-cursor-pointer sui-hover:opacity-80 sui-whitespace-nowrap"
                        onClick={() => onConflictBadgeClick?.()}
                      />
                    )}
                  </div>
                </th>
                <th className="sui-p-2 sui-text-left sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold sui-w-[60px]">
                  <div className="sui-flex sui-items-center sui-gap-2"></div>
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:sui-border-0 sui-body-dense">
              {Object.entries(groupedEvents).map(([date, dateEvents]) => (
                <Fragment key={date}>
                  <tr className="sui-group/row [&_td]:sui-border-b [&_td]:sui-border-solid [&_td]:sui-border-neutral-border hover:sui-bg-neutral-background-weak data-[state=selected]:sui-bg-admin-action-background-weak-hover data-[state=selected]:hover:sui-bg-admin-action-background-weak-hover">
                    <td className="sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-font-bold sui-text-neutral-primary sui-bg-white sui-sticky sui-p-0 sui-z-10 sui-top-[57px]" colSpan={7}>
                      <div className="sui-py-1 sui-px-2 sui-flex sui-gap-2 sui-items-center">
                        <SimpleCheckbox
                          checked={selectedDate.has(date)}
                          onChange={(checked) => onToggleDateSelection(date, dateEvents)}
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
                      <td className="sui-p-2 [&:has([role=checkbox])]:sui-pr-0 sui-w-[40px] sui-pr-0 sui-align-top">
                        <SimpleCheckbox
                          checked={selectedEvents.has(event.id)}
                          onChange={(checked) => {
                            onToggleEventSelection(event.id);
                          }}
                        />
                      </td>
                      <td className={`sui-p-2 [&:has([role=checkbox])]:sui-pr-0 sui-w-[120px] sm:sui-w-[20%] sui-align-top sui-pl-0 ${event.status === "canceled" ? "sui-line-through" : ""}`}>
                        <div className="sui-flex sui-flex-col sui-gap-1">
                          <p className="sui-text-neutral-text-medium sui-text-xs sm:text-sm sui-font-medium">
                            {event.time || "TBD"}
                          </p>
                        </div>
                      </td>
                      <td className={`sui-p-2 [&:has([role=checkbox])]:sui-pr-0 sui-align-top sui-py-0 ${event.status === "canceled" ? "sui-line-through" : ""}`}>
                        <div className="sui-flex sui-gap-2 sui-py-2 sui-h-[70px] sui-items-center">
                          <span className={`sui-block sui-size-[12px] sui-relative ${legendTypeColors[event.type]} sui-rounded-full sui-flex-shrink-0`} />
                          <div className="sui-h-full sui-flex sui-flex-col sui-justify-between sui-min-w-0">
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
                        </div>
                      </td>
                      <td className="sui-p-2 [&:has([role=checkbox])]:sui-pr-0 sui-align-top sui-py-0 sui-w-[60px] sm:sui-w-auto">
                        <div data-testid="score-cell" className="sui-flex sui-h-[70px] sui-py-2">
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
                      <td className={`sui-p-2 sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-w-[70px] sm:sui-w-auto ${event.status === "canceled" ? "sui-line-through" : ""}`}>
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
                      <td className="sui-p-2 sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-pr-4 sui-w-[60px]">
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
