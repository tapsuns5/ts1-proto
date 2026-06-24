"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  getHours,
  getMinutes,
} from "date-fns";
import { SimpleIcon } from "@/components/SimpleIcon";
import LabelButton from "@/components/LabelButton/LabelButton";
import { TooltipProvider } from "@/components/Tooltip/Tooltip";

export type CalendarView = "month" | "week" | "day";

export type EventType = "game" | "practice" | "other";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  eventType?: EventType;
  location?: string;
  venueName?: string;
  subVenueName?: string;
  teams?: string[];
  status?: "scheduled" | "pending" | "canceled";
}

interface EventCalendarProps {
  events?: CalendarEvent[];
  onEventAdd?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
  className?: string;
  initialView?: CalendarView;
  filterBar?: React.ReactNode;
}

const typeColorMap: Record<EventType, string> = {
  game: "sui-bg-green-90 sui-text-green-30",
  practice: "sui-bg-orange-90 sui-text-orange-30",
  other: "sui-bg-skyblue-90 sui-text-skyblue-30",
};

const typeDotMap: Record<EventType, string> = {
  game: "sui-bg-green-50",
  practice: "sui-bg-orange-60",
  other: "sui-bg-skyblue-60",
};

const typeLabelMap: Record<EventType, string> = {
  game: "Game",
  practice: "Practice",
  other: "Other",
};

const START_HOUR = 7;
const END_HOUR = 23;
const HOUR_HEIGHT = 48;
const DAY_HEADER_HEIGHT = 48;
const TIME_COLUMN_WIDTH = 64;

function getMinutesSinceStart(date: Date): number {
  return getHours(date) * 60 + getMinutes(date) - START_HOUR * 60;
}

function eventDurationMinutes(start: Date, end: Date): number {
  return Math.max((end.getTime() - start.getTime()) / 1000 / 60, 30);
}

function formatEventTime(date: Date): string {
  return format(date, "h:mm a");
}

function formatHour(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  if (hour > 12) return `${hour - 12} PM`;
  return `${hour} AM`;
}

function useCalendarDnd(onEventUpdate?: (event: CalendarEvent) => void, events: CalendarEvent[] = []) {
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || !onEventUpdate) return;

      const eventId = active.id as string;
      const targetId = over.id as string;
      const calendarEvent = events.find((e) => e.id === eventId);
      if (!calendarEvent) return;

      const targetDate = new Date(targetId);
      const duration = calendarEvent.end.getTime() - calendarEvent.start.getTime();

      const newStart = new Date(targetDate);
      newStart.setHours(calendarEvent.start.getHours(), calendarEvent.start.getMinutes());

      const newEnd = new Date(newStart.getTime() + duration);

      onEventUpdate({
        ...calendarEvent,
        start: newStart,
        end: newEnd,
      });
    },
    [onEventUpdate, events]
  );

  return { handleDragEnd };
}

function DraggableEventItem({
  event,
  onSelect,
}: {
  event: CalendarEvent;
  onSelect: (event: CalendarEvent) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event.id,
    data: event,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 50 : undefined,
      }
    : undefined;

  const eventType: EventType = event.eventType || "other";
  const colorClass = typeColorMap[eventType];
  const dotClass = typeDotMap[eventType];
  const isCanceled = event.status === "canceled";

  const item = (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(event);
      }}
      className={`sui-cursor-pointer sui-rounded sui-px-1.5 sui-py-0.5 sui-text-[10px] sui-font-medium sui-truncate sui-select-none sui-w-full ${colorClass} ${isDragging ? "sui-opacity-70" : ""} ${isCanceled ? "sui-line-through sui-opacity-60" : ""}`}
    >
      <span className="sui-flex sui-items-center sui-gap-1">
        <span className={`sui-h-1.5 sui-w-1.5 sui-rounded-full sui-shrink-0 ${dotClass}`} />
        <span className="sui-truncate">{event.title}</span>
      </span>
    </div>
  );

  return <CalendarEventBlock event={event}>{item}</CalendarEventBlock>;
}

function DroppableDayCell({
  date,
  children,
  onClick,
  isOutside = false,
  className,
}: {
  date: Date;
  children: React.ReactNode;
  onClick: () => void;
  isOutside?: boolean;
  className?: string;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: date.toISOString(),
  });

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={`sui-relative sui-p-0.5 sui-transition-colors sui-cursor-pointer sui-border-r sui-border-neutral-border last:sui-border-r-0
        ${isOutside ? "sui-bg-neutral-background-medium/50 sui-text-neutral-text-disabled" : "sui-bg-white sui-text-neutral-text"}
        ${isToday(date) ? "sui-bg-accent-background-weak/30" : ""}
        ${isOver ? "sui-bg-accent-background-weak/60" : ""}
        ${className || ""}
      `}
    >
      {children}
    </div>
  );
}

function MonthView({
  currentDate,
  events,
  onEventSelect,
  onEventCreate,
}: {
  currentDate: Date;
  events: CalendarEvent[];
  onEventSelect: (event: CalendarEvent) => void;
  onEventCreate: (date: Date) => void;
}) {
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
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

  const weekdays = useMemo(
    () => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    []
  );

  const getEventsForDay = useCallback(
    (day: Date) =>
      events.filter((e) => isSameDay(new Date(e.start), day)),
    [events]
  );

  return (
    <div className="sui-flex sui-flex-col sui-flex-1">
      <div className="sui-grid sui-grid-cols-7 sui-border-b sui-border-neutral-border">
        {weekdays.map((d) => (
          <div key={d} className="sui-py-1 sui-text-center sui-text-xs sui-font-semibold sui-text-neutral-text-medium">
            {d}
          </div>
        ))}
      </div>
      <div className="sui-grid sui-flex-1" style={{ gridTemplateRows: `repeat(${weeks.length}, 1fr)` }}>
        {weeks.map((week, wi) => (
          <div key={wi} className="sui-grid sui-grid-cols-7 sui-border-b sui-border-neutral-border last:sui-border-b-0">
            {week.map((day, di) => {
              const isOutside = !isSameMonth(day, currentDate);
              const dayEvents = getEventsForDay(day);
              return (
                <DroppableDayCell
                  key={`${wi}-${di}`}
                  date={day}
                  isOutside={isOutside}
                  onClick={() => onEventCreate(day)}
                  className="sui-min-h-[90px]"
                >
                  <div className="sui-flex sui-justify-between sui-items-start sui-mb-1">
                    <span
                      className={`sui-text-xs sui-font-medium sui-leading-none
                        ${isToday(day) ? "sui-bg-accent-background sui-text-white sui-w-3 sui-h-3 sui-flex sui-items-center sui-justify-center sui-rounded-full" : ""}
                      `}
                    >
                      {format(day, "d")}
                    </span>
                  </div>
                  <div className="sui-flex sui-flex-col sui-gap-1">
                    {dayEvents.slice(0, 4).map((event) => (
                      <DraggableEventItem
                        key={event.id}
                        event={event}
                        onSelect={onEventSelect}
                      />
                    ))}
                    {dayEvents.length > 4 && (
                      <span className="sui-text-[10px] sui-text-neutral-text-medium sui-pl-1 sui-mt-0.5">
                        +{dayEvents.length - 4} more
                      </span>
                    )}
                  </div>
                </DroppableDayCell>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function CalendarTimeGrid({
  dates,
  events,
  onEventSelect,
}: {
  dates: Date[];
  events: CalendarEvent[];
  onEventSelect: (event: CalendarEvent) => void;
}) {
  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);
  const totalHeight = hours.length * HOUR_HEIGHT;
  const isSingleDay = dates.length === 1;

  return (
    <div className="sui-border sui-border-neutral-border sui-rounded-lg sui-bg-white sui-overflow-x-auto">
      <div className="sui-min-w-max">
        {/* Header row */}
        <div className="sui-flex sui-border-b sui-border-neutral-border sui-sticky sui-top-0 sui-z-20 sui-bg-white">
          <div
            className="sui-flex-shrink-0 sui-bg-neutral-background-weak sui-border-r sui-border-neutral-border"
            style={{ width: TIME_COLUMN_WIDTH, height: DAY_HEADER_HEIGHT, position: "sticky", left: 0, zIndex: 30 }}
          />
          {dates.map((date) => (
            <div
              key={date.toISOString()}
              className="sui-flex-1 sui-flex sui-flex-col sui-items-center sui-justify-center sui-border-r sui-border-neutral-border sui-p-2"
              style={{ minWidth: isSingleDay ? 280 : 140, height: DAY_HEADER_HEIGHT }}
            >
              <span className={`sui-text-xs sui-font-medium ${isToday(date) ? "sui-text-accent-background" : "sui-text-neutral-text-medium"}`}>{format(date, "EEE")}</span>
              <span className={`sui-text-sm sui-font-semibold ${isToday(date) ? "sui-text-accent-background" : "sui-text-neutral-text"}`}>{format(date, "MMM d")}</span>
            </div>
          ))}
        </div>

        {/* Grid body */}
        <div className="sui-flex" style={{ height: totalHeight }}>
          {/* Sticky time column */}
          <div
            className="sui-flex-shrink-0 sui-bg-neutral-background-weak sui-border-r sui-border-neutral-border"
            style={{ width: TIME_COLUMN_WIDTH, position: "sticky", left: 0, zIndex: 15 }}
          >
            {hours.map((hour) => (
              <div key={hour} className="sui-flex sui-items-start sui-justify-center sui-text-[10px] sui-text-neutral-text-medium sui-pt-1" style={{ height: HOUR_HEIGHT }}>
                {formatHour(hour)}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {dates.map((date) => {
            const dayEvents = events.filter((e) => isSameDay(new Date(e.start), date));
            return (
              <div
                key={date.toISOString()}
                className="sui-flex-1 sui-relative sui-border-r sui-border-neutral-border last:sui-border-r-0"
                style={{ minWidth: isSingleDay ? 280 : 140 }}
              >
                {/* Hour grid lines */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="sui-absolute sui-left-0 sui-right-0 sui-border-b sui-border-neutral-border/50"
                    style={{ top: (hour - START_HOUR) * HOUR_HEIGHT, height: HOUR_HEIGHT }}
                  />
                ))}
                {/* Events */}
                {dayEvents.map((event) => {
                  const start = new Date(event.start);
                  const end = new Date(event.end);
                  const top = (getMinutesSinceStart(start) / 60) * HOUR_HEIGHT;
                  const height = (eventDurationMinutes(start, end) / 60) * HOUR_HEIGHT;
                  if (top < 0 || top > totalHeight) return null;
                  const eventType = event.eventType || "other";
                  return (
                    <CalendarEventBlock
                      key={event.id}
                      event={event}
                      className={`sui-absolute sui-left-1 sui-right-1 sui-rounded sui-px-2 sui-py-1 sui-text-xs sui-font-medium sui-text-left sui-border sui-border-white/50 sui-shadow-sm sui-overflow-hidden ${typeColorMap[eventType]} sui-cursor-pointer hover:sui-opacity-90`}
                      style={{ top: Math.max(top, 0), height: Math.max(height, 20), minHeight: 20 }}
                    >
                      <button
                        type="button"
                        onClick={() => onEventSelect(event)}
                        className="sui-w-full sui-h-full sui-text-left"
                      >
                        <p className="sui-truncate sui-font-semibold">{event.title}</p>
                        <p className="sui-truncate sui-text-[10px] sui-opacity-90">{formatEventTime(start)} – {formatEventTime(end)} · {event.location || event.venueName || "TBD"}</p>
                      </button>
                    </CalendarEventBlock>
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

function CalendarEventBlock({
  event,
  className,
  style,
  children,
}: {
  event: CalendarEvent;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  const dotColorForType = (type: CalendarEvent["eventType"]) => {
    if (type === "game") return "sui-bg-green-50";
    if (type === "practice") return "sui-bg-orange-60";
    return "sui-bg-skyblue-60";
  };
  const [hovered, setHovered] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
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
            <span className={`sui-block sui-size-[10px] sui-rounded-full ${dotColorForType(event.eventType)}`} />
            <p className="sui-font-semibold sui-text-sm">{event.title}</p>
          </div>
          <div className="sui-grid sui-grid-cols-[auto_1fr] sui-gap-x-3 sui-gap-y-1 sui-text-sm">
            <span className="sui-text-white/70">Teams:</span>
            <span>{event.teams?.join(", ") || "—"}</span>
            <span className="sui-text-white/70">Venue:</span>
            <span>{event.location || event.venueName || "TBD"}{event.subVenueName ? ` · ${event.subVenueName}` : ""}</span>
            <span className="sui-text-white/70">Time:</span>
            <span>{formatEventTime(new Date(event.start))} – {formatEventTime(new Date(event.end))}</span>
            <span className="sui-text-white/70">Type:</span>
            <span className="sui-capitalize">{event.eventType || "other"}</span>
            <span className="sui-text-white/70">Status:</span>
            <span className="sui-capitalize">{event.status === "canceled" ? "Cancelled" : event.status || "scheduled"}</span>
          </div>
          <div className="sui-absolute sui-size-[10px] sui-bg-neutral-text sui-rotate-45 sui-left-1/2 -sui-translate-x-1/2 sui-bottom-[-5px]" />
        </div>
      )}
    </>
  );
}

function WeekView({
  currentDate,
  events,
  onEventSelect,
}: {
  currentDate: Date;
  events: CalendarEvent[];
  onEventSelect: (event: CalendarEvent) => void;
}) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  return <CalendarTimeGrid dates={days} events={events} onEventSelect={onEventSelect} />;
}

function DayView({
  currentDate,
  events,
  onEventSelect,
}: {
  currentDate: Date;
  events: CalendarEvent[];
  onEventSelect: (event: CalendarEvent) => void;
}) {
  return <CalendarTimeGrid dates={[currentDate]} events={events} onEventSelect={onEventSelect} />;
}

function EventDialog({
  event,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (id: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [eventType, setEventType] = useState<EventType>("other");

  useState(() => {
    if (event) {
      setTitle(event.title);
      setLocation(event.location || "");
      setStartDate(format(event.start, "yyyy-MM-dd"));
      setStartTime(format(event.start, "HH:mm"));
      setEndDate(format(event.end, "yyyy-MM-dd"));
      setEndTime(format(event.end, "HH:mm"));
      setEventType(event.eventType || "other");
    } else {
      setTitle("");
      setLocation("");
      const now = new Date();
      setStartDate(format(now, "yyyy-MM-dd"));
      setStartTime(format(now, "HH:mm"));
      const later = new Date(now.getTime() + 60 * 60 * 1000);
      setEndDate(format(later, "yyyy-MM-dd"));
      setEndTime(format(later, "HH:mm"));
      setEventType("other");
    }
  });

  if (!isOpen) return null;

  const handleSave = () => {
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    onSave({
      id: event?.id || Math.random().toString(36).substring(2, 11),
      title,
      location,
      start,
      end,
      eventType,
    });
    onClose();
  };

  const handleDelete = () => {
    if (event?.id && onDelete) {
      onDelete(event.id);
    }
    onClose();
  };

  return (
    <div className="sui-fixed sui-inset-0 sui-z-50 sui-flex sui-items-center sui-justify-center sui-bg-black/40">
      <div className="sui-bg-white sui-rounded-lg sui-shadow-2 sui-w-full sui-max-w-md sui-p-4 sui-mx-4">
        <h3 className="sui-heading-sm sui-mb-3">{event?.id ? "Edit Event" : "New Event"}</h3>
        <div className="sui-grid sui-gap-3">
          <div>
            <label className="sui-text-label sui-mb-1 sui-block">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="sui-w-full sui-rounded sui-border sui-border-neutral-border sui-px-2 sui-py-1 sui-text-sm"
              placeholder="Event title"
            />
          </div>
          <div>
            <label className="sui-text-label sui-mb-1 sui-block">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="sui-w-full sui-rounded sui-border sui-border-neutral-border sui-px-2 sui-py-1 sui-text-sm"
              placeholder="Location"
            />
          </div>
          <div className="sui-grid sui-grid-cols-2 sui-gap-2">
            <div>
              <label className="sui-text-label sui-mb-1 sui-block">Start</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="sui-w-full sui-rounded sui-border sui-border-neutral-border sui-px-2 sui-py-1 sui-text-sm"
              />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="sui-w-full sui-rounded sui-border sui-border-neutral-border sui-px-2 sui-py-1 sui-text-sm sui-mt-1"
              />
            </div>
            <div>
              <label className="sui-text-label sui-mb-1 sui-block">End</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="sui-w-full sui-rounded sui-border sui-border-neutral-border sui-px-2 sui-py-1 sui-text-sm"
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="sui-w-full sui-rounded sui-border sui-border-neutral-border sui-px-2 sui-py-1 sui-text-sm sui-mt-1"
              />
            </div>
          </div>
          <div>
            <label className="sui-text-label sui-mb-1 sui-block">Event Type</label>
            <div className="sui-flex sui-gap-2">
              {(Object.keys(typeColorMap) as EventType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setEventType(t)}
                  className={`sui-px-3 sui-py-1 sui-rounded sui-text-xs sui-font-medium sui-border ${typeColorMap[t]} ${eventType === t ? "sui-ring-2 sui-ring-offset-1 sui-ring-neutral-text" : ""}`}
                >
                  {typeLabelMap[t]}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="sui-flex sui-justify-end sui-gap-2 sui-mt-4">
          {event?.id && (
            <LabelButton variantType="primary" sentiment="negative" labelText="Delete" onClick={handleDelete} />
          )}
          <LabelButton variantType="secondary" labelText="Cancel" onClick={onClose} />
          <LabelButton variantType="primary" labelText="Save" onClick={handleSave} />
        </div>
      </div>
    </div>
  );
}

export function EventCalendar({
  events = [],
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  className,
  initialView = "week",
  filterBar,
}: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date("2026-06-15"));
  const [view, setView] = useState<CalendarView>(initialView);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const { handleDragEnd } = useCalendarDnd(onEventUpdate, events);

  const handlePrevious = () => {
    if (view === "month") setCurrentDate(subMonths(currentDate, 1));
    else if (view === "week") setCurrentDate(subWeeks(currentDate, 1));
    else if (view === "day") setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (view === "month") setCurrentDate(addMonths(currentDate, 1));
    else if (view === "week") setCurrentDate(addWeeks(currentDate, 1));
    else if (view === "day") setCurrentDate(addDays(currentDate, 1));
  };

  const handleToday = () => setCurrentDate(new Date());

  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleEventCreate = (date: Date) => {
    const start = new Date(date);
    if (start.getHours() === 0 && start.getMinutes() === 0) {
      start.setHours(9, 0, 0, 0);
    }
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    setSelectedEvent({
      id: "",
      title: "",
      start,
      end,
    });
    setIsDialogOpen(true);
  };

  const handleSave = (event: CalendarEvent) => {
    if (event.id) {
      onEventUpdate?.(event);
    } else {
      onEventAdd?.(event);
    }
    setIsDialogOpen(false);
    setSelectedEvent(null);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className={`sui-flex sui-flex-col sui-rounded-lg sui-border sui-border-neutral-border sui-bg-white sui-shadow-1 sui-min-h-[500px] ${className || ""}`}>
        {filterBar && (
          <div className="sui-flex sui-flex-wrap sui-items-center sui-justify-between sui-gap-2 sui-px-3 sui-py-2 sui-border-b sui-border-neutral-border sui-bg-neutral-background-weak">
            {filterBar}
          </div>
        )}
        {/* Unified toolbar */}
        <div className="sui-flex sui-flex-wrap sui-items-center sui-justify-between sui-gap-2 sui-px-3 sui-py-2 sui-border-b sui-border-neutral-border sui-bg-neutral-background-weak">
          <div className="sui-flex sui-items-center sui-gap-2 sui-flex-wrap">
            <div className="sui-flex sui-bg-white sui-rounded-full sui-border sui-border-solid sui-border-neutral-border sui-p-1 sui-gap-1">
              {(["day", "week", "month"] as CalendarView[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`sui-px-3 sui-py-1 sui-rounded-full sui-text-label sui-font-semibold sui-transition-all sui-capitalize ${
                    view === v
                      ? "sui-bg-admin-action-background sui-text-white"
                      : "sui-text-neutral-text-medium hover:sui-bg-neutral-background-weak"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <LabelButton variantType="secondary" labelText="Today" onClick={handleToday} size="small" />
            <button
              onClick={handlePrevious}
              className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-neutral-border sui-bg-white sui-h-[28px] sui-w-[28px] hover:sui-bg-neutral-background-weak"
              aria-label="Previous"
            >
              <SimpleIcon name="chevron_left" size="s" />
            </button>
            <span className="sui-text-sm sui-font-medium sui-text-neutral-text">
              {view === "month" && format(currentDate, "MMMM yyyy")}
              {view === "week" && `Week of ${format(startOfWeek(currentDate, { weekStartsOn: 0 }), "MMM d, yyyy")}`}
              {view === "day" && format(currentDate, "EEEE, MMMM d, yyyy")}
            </span>
            <button
              onClick={handleNext}
              className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-neutral-border sui-bg-white sui-h-[28px] sui-w-[28px] hover:sui-bg-neutral-background-weak"
              aria-label="Next"
            >
              <SimpleIcon name="chevron_right" size="s" />
            </button>
          </div>
          <div className="sui-flex sui-items-center sui-gap-3">
            <div className="sui-flex sui-items-center sui-gap-3">
              <span className="sui-flex sui-items-center sui-gap-1 sui-caption">
                <span className={`sui-block sui-size-[12px] ${typeDotMap.game} sui-rounded-full`} />
                <span className="hidden sm:inline">Game</span>
              </span>
              <span className="sui-flex sui-items-center sui-gap-1 sui-caption">
                <span className={`sui-block sui-size-[12px] ${typeDotMap.practice} sui-rounded-full`} />
                <span className="hidden sm:inline">Practice</span>
              </span>
              <span className="sui-flex sui-items-center sui-gap-1 sui-caption">
                <span className={`sui-block sui-size-[12px] ${typeDotMap.other} sui-rounded-full`} />
                <span className="hidden sm:inline">Other</span>
              </span>
            </div>
          </div>
        </div>

        <TooltipProvider>
          <div className="sui-flex sui-flex-1 sui-flex-col sui-overflow-auto sui-p-4 sui-bg-white">
            {view === "month" && (
              <MonthView
                currentDate={currentDate}
                events={events}
                onEventSelect={handleEventSelect}
                onEventCreate={handleEventCreate}
              />
            )}
            {view === "week" && (
              <WeekView
                currentDate={currentDate}
                events={events}
                onEventSelect={handleEventSelect}
              />
            )}
            {view === "day" && (
              <DayView
                currentDate={currentDate}
                events={events}
                onEventSelect={handleEventSelect}
              />
            )}
          </div>
        </TooltipProvider>
      </div>

      <EventDialog
        event={selectedEvent}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedEvent(null);
        }}
        onSave={handleSave}
        onDelete={onEventDelete}
      />
    </DndContext>
  );
}
