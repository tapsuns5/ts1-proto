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
  setHours,
  setMinutes,
} from "date-fns";
import { SimpleIcon } from "@/components/SimpleIcon";
import LabelButton from "@/components/LabelButton/LabelButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/DropdownMenu/DropdownMenu";
import Tooltip, { TooltipProvider } from "@/components/Tooltip/Tooltip";

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
}

const typeColorMap: Record<EventType, string> = {
  game: "sui-bg-[#bbf7d0] sui-text-emerald-900",
  practice: "sui-bg-[#fed7aa] sui-text-orange-900",
  other: "sui-bg-[#bae6fd] sui-text-sky-900",
};

const typeDotMap: Record<EventType, string> = {
  game: "sui-bg-emerald-500",
  practice: "sui-bg-orange-500",
  other: "sui-bg-sky-500",
};

const typeLabelMap: Record<EventType, string> = {
  game: "Game",
  practice: "Practice",
  other: "Other",
};

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

function EventHoverCard({ event, children }: { event: CalendarEvent; children: React.ReactNode }) {
  const eventType: EventType = event.eventType || "other";
  const dotClass = typeDotMap[eventType];
  const statusText = event.status === "scheduled" ? "Scheduled" : event.status === "pending" ? "Unscheduled" : "Canceled";

  return (
    <Tooltip
      content={
        <div className="sui-min-w-[240px]">
          <div className="sui-flex sui-items-center sui-gap-2 sui-mb-2">
            <span className={`sui-h-2 sui-w-2 sui-rounded-full ${dotClass}`} />
            <span className="sui-font-semibold sui-text-sm">{event.title}</span>
          </div>
          <div className="sui-grid sui-gap-1 sui-text-xs sui-text-white/90">
            {event.teams && event.teams.length > 0 && (
              <div className="sui-flex sui-gap-1">
                <span className="sui-text-white/70">Teams:</span>
                <span>{event.teams.join(", ")}</span>
              </div>
            )}
            {event.venueName && (
              <div className="sui-flex sui-gap-1">
                <span className="sui-text-white/70">Venue:</span>
                <span>{event.venueName}{event.subVenueName ? ` — ${event.subVenueName}` : ""}</span>
              </div>
            )}
            <div className="sui-flex sui-gap-1">
              <span className="sui-text-white/70">Time:</span>
              <span>{format(event.start, "h:mm a")} – {format(event.end, "h:mm a")}</span>
            </div>
            <div className="sui-flex sui-gap-1">
              <span className="sui-text-white/70">Type:</span>
              <span className="sui-capitalize">{typeLabelMap[eventType]}</span>
            </div>
            <div className="sui-flex sui-gap-1">
              <span className="sui-text-white/70">Status:</span>
              <span>{statusText}</span>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </Tooltip>
  );
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

  return <EventHoverCard event={event}>{item}</EventHoverCard>;
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

function WeekView({
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
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDayAndHour = useCallback(
    (day: Date, hour: number) =>
      events.filter((e) => {
        const s = new Date(e.start);
        return isSameDay(s, day) && getHours(s) === hour;
      }),
    [events]
  );

  return (
    <div className="sui-flex sui-flex-col sui-flex-1 sui-overflow-auto">
      <div className="sui-grid sui-grid-cols-8 sui-border-b sui-border-neutral-border sui-min-w-[800px]">
        <div className="sui-py-1 sui-text-center sui-text-xs sui-font-semibold sui-text-neutral-text-medium sui-border-r sui-border-neutral-border" />
        {days.map((d) => (
          <div
            key={d.toISOString()}
            className={`sui-py-1 sui-text-center sui-text-xs sui-font-semibold sui-border-r sui-border-neutral-border last:sui-border-r-0
              ${isToday(d) ? "sui-text-accent-background" : "sui-text-neutral-text-medium"}
            `}
          >
            <div>{format(d, "EEE")}</div>
            <div className={`sui-text-sm sui-mt-0.5 ${isToday(d) ? "sui-bg-accent-background sui-text-white sui-w-3 sui-h-3 sui-rounded-full sui-flex sui-items-center sui-justify-center sui-mx-auto" : ""}`}>
              {format(d, "d")}
            </div>
          </div>
        ))}
      </div>
      <div className="sui-flex-1 sui-overflow-auto sui-min-w-[800px]">
        {hours.map((hour) => (
          <div key={hour} className="sui-grid sui-grid-cols-8 sui-border-b sui-border-neutral-border last:sui-border-b-0">
            <div className="sui-py-1 sui-px-2 sui-text-xs sui-text-neutral-text-medium sui-border-r sui-border-neutral-border sui-text-right">
              {format(setHours(new Date(), hour), "h a")}
            </div>
            {days.map((day) => {
              const hourEvents = getEventsForDayAndHour(day, hour);
              return (
                <DroppableDayCell
                  key={`${day.toISOString()}-${hour}`}
                  date={setHours(day, hour)}
                  onClick={() => onEventCreate(setHours(day, hour))}
                  className="sui-min-h-[48px]"
                >
                  <div className="sui-grid sui-gap-0.5">
                    {hourEvents.map((event) => (
                      <DraggableEventItem
                        key={event.id}
                        event={event}
                        onSelect={onEventSelect}
                      />
                    ))}
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

function DayView({
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
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForHour = useCallback(
    (hour: number) =>
      events.filter((e) => {
        const s = new Date(e.start);
        return isSameDay(s, currentDate) && getHours(s) === hour;
      }),
    [events, currentDate]
  );

  return (
    <div className="sui-flex sui-flex-col sui-flex-1 sui-overflow-auto">
      <div className="sui-py-2 sui-text-center sui-text-base sui-font-semibold sui-border-b sui-border-neutral-border">
        {format(currentDate, "EEEE, MMMM d, yyyy")}
      </div>
      <div className="sui-flex-1">
        {hours.map((hour) => {
          const hourEvents = getEventsForHour(hour);
          return (
            <div key={hour} className="sui-grid sui-grid-cols-[80px_1fr] sui-border-b sui-border-neutral-border last:sui-border-b-0">
              <div className="sui-py-1 sui-px-3 sui-text-xs sui-text-neutral-text-medium sui-border-r sui-border-neutral-border sui-text-right">
                {format(setHours(new Date(), hour), "h a")}
              </div>
              <DroppableDayCell
                date={setHours(currentDate, hour)}
                onClick={() => onEventCreate(setHours(currentDate, hour))}
                className="sui-min-h-[48px]"
              >
                <div className="sui-grid sui-gap-1 sui-py-1">
                  {hourEvents.map((event) => (
                    <DraggableEventItem
                      key={event.id}
                      event={event}
                      onSelect={onEventSelect}
                    />
                  ))}
                </div>
              </DroppableDayCell>
            </div>
          );
        })}
      </div>
    </div>
  );
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

  const viewTitle = useMemo(() => {
    if (view === "month") return format(currentDate, "MMMM yyyy");
    if (view === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      return isSameMonth(start, end)
        ? format(start, "MMMM yyyy")
        : `${format(start, "MMM")} – ${format(end, "MMM yyyy")}`;
    }
    return format(currentDate, "EEEE, MMMM d, yyyy");
  }, [currentDate, view]);

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className={`sui-flex sui-flex-col sui-rounded-lg sui-border sui-border-neutral-border sui-bg-white sui-shadow-1 sui-min-h-[500px] ${className || ""}`}>
        <div className="sui-flex sui-items-center sui-justify-between sui-p-2 sui-border-b sui-border-neutral-border sui-flex-wrap sui-gap-2">
          <div className="sui-flex sui-items-center sui-gap-2">
            <LabelButton variantType="secondary" labelText="Today" onClick={handleToday} size="small" />
            <div className="sui-flex sui-items-center sui-gap-0.5">
              <button
                onClick={handlePrevious}
                className="sui-p-1 sui-rounded sui-hover:sui-bg-neutral-background-medium sui-transition-colors"
                aria-label="Previous"
              >
                <SimpleIcon name="chevron_left" size="s" />
              </button>
              <button
                onClick={handleNext}
                className="sui-p-1 sui-rounded sui-hover:sui-bg-neutral-background-medium sui-transition-colors"
                aria-label="Next"
              >
                <SimpleIcon name="chevron_right" size="s" />
              </button>
            </div>
            <h2 className="sui-text-base sui-font-semibold sui-text-neutral-text">{viewTitle}</h2>
          </div>
          <div className="sui-flex sui-items-center sui-gap-2">
            <div className="sui-flex sui-items-center sui-gap-3 sui-mr-2">
              <span className="sui-flex sui-items-center sui-gap-1 sui-text-xs sui-text-neutral-text-medium">
                <span className="sui-inline-block sui-h-1 sui-w-1 sui-rounded-full sui-bg-[#34d399]" /> Game
              </span>
              <span className="sui-flex sui-items-center sui-gap-1 sui-text-xs sui-text-neutral-text-medium">
                <span className="sui-inline-block sui-h-1 sui-w-1 sui-rounded-full sui-bg-[#fb923c]" /> Practice
              </span>
              <span className="sui-flex sui-items-center sui-gap-1 sui-text-xs sui-text-neutral-text-medium">
                <span className="sui-inline-block sui-h-1 sui-w-1 sui-rounded-full sui-bg-[#38bdf8]" /> Other
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="sui-flex sui-items-center sui-gap-1 sui-rounded-full sui-border sui-border-neutral-border sui-bg-white sui-px-2 sui-py-0.5 sui-text-xs sui-font-medium sui-text-neutral-text hover:sui-bg-neutral-background-medium sui-transition-colors">
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                  <SimpleIcon name="expand_more" size="s" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setView("month")}>Month</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setView("week")}>Week</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setView("day")}>Day</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <LabelButton
              variantType="primary"
              labelText="New Event"
              size="small"
              onClick={() => {
                setSelectedEvent(null);
                handleEventCreate(new Date());
              }}
            />
          </div>
        </div>

        <TooltipProvider>
          <div className="sui-flex sui-flex-1 sui-flex-col sui-overflow-auto">
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
                onEventCreate={handleEventCreate}
              />
            )}
            {view === "day" && (
              <DayView
                currentDate={currentDate}
                events={events}
                onEventSelect={handleEventSelect}
                onEventCreate={handleEventCreate}
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
