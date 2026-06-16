"use client";

import { useState, useMemo } from "react";
import { format, addDays, subDays } from "date-fns";
import { SimpleIcon } from "../SimpleIcon";
import { SimpleLabelButton } from "../SimpleLabelButton";
import LabelButton from "../LabelButton/LabelButton";
import Combobox from "../Combobox/Combobox";
import { ComboboxTrigger } from "../Combobox/components/ComboboxTrigger";
import { ComboboxContent } from "../Combobox/Combobox";
import { ComboboxList } from "../Combobox/components/ComboboxList";
import { ComboboxItem } from "../Combobox/components/ComboboxItem";

export interface VenueEvent {
  id: string;
  title: string;
  start: string; // "HH:MM" 24h
  end: string;   // "HH:MM" 24h
  type: "game" | "practice" | "other";
  subVenueName?: string;
  teams?: string[];
}

export interface VenueSubVenue {
  name: string;
  events: VenueEvent[];
}

export interface VenueGroup {
  name: string;
  subVenues: VenueSubVenue[];
}

interface VenueScheduleViewProps {
  date: Date;
  onDateChange: (date: Date) => void;
  venueGroups: VenueGroup[];
}

const START_HOUR = 8;
const END_HOUR = 21;
const PIXELS_PER_HOUR = 80;

const hours = Array.from(
  { length: END_HOUR - START_HOUR + 1 },
  (_, i) => START_HOUR + i
);

const typeColors: Record<VenueEvent["type"], string> = {
  game: "sui-bg-green-90",
  practice: "sui-bg-orange-90",
  other: "sui-bg-skyblue-90",
};

const typeTextColors: Record<VenueEvent["type"], string> = {
  game: "sui-text-green-30",
  practice: "sui-text-orange-30",
  other: "sui-text-skyblue-30",
};

const typeIcons: Record<VenueEvent["type"], string> = {
  game: "sports_baseball",
  practice: "timer",
  other: "stadium",
};

function eventStyle(event: VenueEvent) {
  const [sh, sm] = event.start.split(":").map(Number);
  const [eh, em] = event.end.split(":").map(Number);
  const startMinutes = (sh - START_HOUR) * 60 + sm;
  const durationMinutes = (eh - START_HOUR) * 60 + em - startMinutes;
  const left = (startMinutes / 60) * PIXELS_PER_HOUR;
  const width = (durationMinutes / 60) * PIXELS_PER_HOUR;
  return { left, width };
}

export function VenueScheduleView({
  date,
  onDateChange,
  venueGroups,
}: VenueScheduleViewProps) {
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const dateLabel = format(date, "EEEE, MMMM d, yyyy");
  const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  function formatHour(h: number): string {
    if (h === 12) return "12:00 PM";
    if (h > 12) return `${h - 12}:00 PM`;
    return `${h}:00 AM`;
  }

  const toggleGroup = (name: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const filteredGroups = useMemo(() => {
    return venueGroups.map((group) => ({
      ...group,
      subVenues: group.subVenues.map((sv) => ({
        ...sv,
        events: sv.events.filter((ev) => {
          if (selectedEventTypes.length > 0 && !selectedEventTypes.includes(ev.type)) return false;
          return true;
        }),
      })),
    }));
  }, [venueGroups, selectedEventTypes]);

  return (
    <div className="sui-flex sui-flex-col sui-gap-2 sui-pt-2">
     

      {/* Filters + Actions row */}
      <div className="sui-flex sui-flex-wrap sui-items-center sui-gap-2">
        <Combobox
          values={selectedPrograms}
          onValuesChange={(vals) => setSelectedPrograms(vals)}
        >
          <ComboboxTrigger label="All Programs" />
          <ComboboxContent headerTitle="Select programs">
            <ComboboxList showSelectAllOption>
              <ComboboxItem value="Clover Hill Baseball" label="Clover Hill Baseball" keywords={["Clover Hill Baseball"]} />
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
              {venueGroups.map((g) => (
                <ComboboxItem key={g.name} value={g.name} label={g.name} keywords={[g.name]} />
              ))}
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

        <div className="sui-flex sui-items-center sui-gap-2">
          <SimpleLabelButton
            type="secondary"
            size="small"
            iconLeft="location_on"
            label="Manage"
          />
          <SimpleLabelButton
            type="secondary"
            size="small"
            iconLeft="download"
            label="Export"
          />
          <LabelButton
            size="small"
            variantType="primary"
            icon="add"
            iconPosition="left"
            labelText="Add Event"
            onClick={() => console.log("Add event")}
          />
        </div>
      </div>

      {/* Date nav + Indicators */}
      <div className="sui-flex sui-items-center sui-justify-between sui-gap-2">
        <div className="sui-flex sui-items-center sui-gap-2">
          <button
            className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-neutral-border sui-bg-white sui-h-[32px] sui-w-[32px] hover:sui-bg-neutral-background-weak"
            onClick={() => onDateChange(subDays(date, 1))}
          >
            <SimpleIcon name="chevron_left" size="s" />
          </button>
          <span className="sui-text-xs sui-font-medium sui-text-neutral-text">
            {dateLabel}
          </span>
          <button
            className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-neutral-border sui-bg-white sui-h-[32px] sui-w-[32px] hover:sui-bg-neutral-background-weak"
            onClick={() => onDateChange(addDays(date, 1))}
          >
            <SimpleIcon name="chevron_right" size="s" />
          </button>
          {!isToday && (
            <button
              className="sui-px-2 sui-py-0.5 sui-rounded-full sui-border sui-border-neutral-border sui-bg-white sui-text-xs sui-text-neutral-text hover:sui-bg-neutral-background-weak"
              onClick={() => onDateChange(new Date())}
            >
              Today
            </button>
          )}
        </div>

        <div className="sui-flex sui-gap-2 sui-items-center">
          <p className="sui-flex sui-items-center sui-gap-1 sui-caption">
            <span className="sui-block sui-size-[12px] sui-bg-green-50 sui-rounded-full" />
            <span className="hidden sm:inline">Game</span>
          </p>
          <p className="sui-flex sui-items-center sui-gap-1 sui-caption">
            <span className="sui-block sui-size-[12px] sui-bg-orange-60 sui-rounded-full" />
            <span className="hidden sm:inline">Practice</span>
          </p>
          <p className="sui-flex sui-items-center sui-gap-1 sui-caption">
            <span className="sui-block sui-size-[12px] sui-bg-skyblue-60 sui-rounded-full" />
            <span className="hidden sm:inline">Other event</span>
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="sui-border sui-border-neutral-border sui-rounded-lg sui-bg-white sui-overflow-x-auto">
        <div className="sui-flex sui-flex-col sui-min-w-max">
          {/* Header row with hour columns */}
          <div className="sui-flex sui-border-b sui-border-neutral-border sui-sticky sui-top-0 sui-z-20 sui-bg-white">
            <div
              className="sui-flex-shrink-0 sui-bg-neutral-background-weak sui-p-1 sui-text-[12px] sui-font-semibold sui-text-neutral-text-medium sui-flex sui-items-center sui-whitespace-nowrap"
              style={{ position: 'sticky', left: 0, zIndex: 30, minWidth: '140px' }}
            >
              Venue / Sub-venue
            </div>
            <div className="sui-flex">
              {hours.map((h) => (
                <div
                  key={h}
                  className="sui-flex-shrink-0 sui-border-r sui-border-neutral-border sui-p-1 sui-text-[10px] sui-font-medium sui-text-neutral-text-medium sui-text-center"
                  style={{ width: PIXELS_PER_HOUR }}
                >
                  {h === 12 ? "12 PM" : h > 12 ? `${h - 12} PM` : `${h} AM`}
                </div>
              ))}
            </div>
          </div>

          {/* Venue groups */}
          {filteredGroups.map((group) => (
            <div key={group.name} className="sui-border-b sui-border-neutral-border last:sui-border-b-0">
              {/* Group header */}
              <div className="sui-flex sui-sticky sui-top-[34px] sui-z-10 sui-bg-neutral-background-weak">
                <div
                  className="sui-flex-shrink-0 sui-p-1 sui-text-xs sui-font-medium sui-text-neutral-text sui-flex sui-items-center sui-whitespace-nowrap"
                  style={{ position: 'sticky', left: 0, zIndex: 20, minWidth: '140px' }}
                >
                  <button
                    type="button"
                    className="sui-w-full sui-flex sui-items-center sui-justify-between sui-gap-2 sui-bg-neutral-background-weak sui-px-2 sui-py-1 sui-text-xs sui-font-medium sui-text-neutral-text hover:sui-bg-neutral-background-medium sui-cursor-pointer"
                    onClick={() => toggleGroup(group.name)}
                  >
                    <div className="sui-flex sui-items-center sui-gap-2">
                      <SimpleIcon name="location_on" size="s" />
                      <span>{group.name}</span>
                      <span className="sui-text-neutral-text-disabled sui-text-xs">
                        &mdash; {group.subVenues.length} sub-venues; {group.subVenues.reduce((sum, sv) => sum + sv.events.length, 0)} events today
                      </span>
                    </div>
                    <SimpleIcon
                      name={collapsedGroups.has(group.name) ? "chevron_right" : "expand_more"}
                      size="s"
                      className="sui-text-neutral-text-medium"
                    />
                  </button>
                </div>
                <div className="sui-flex-1 sui-bg-neutral-background-weak" style={{ minWidth: hours.length * PIXELS_PER_HOUR }} />
              </div>

              {/* Sub-venue rows */}
              {!collapsedGroups.has(group.name) && group.subVenues.map((sv) => (
                <div key={sv.name} className="sui-flex sui-border-t sui-border-neutral-border">
                  <div
                    className="sui-flex-shrink-0 sui-bg-white sui-p-2 sui-text-xs sui-text-neutral-text sui-flex sui-items-center sui-whitespace-nowrap"
                    style={{ position: 'sticky', left: 0, zIndex: 10, minWidth: '140px' }}
                  >
                    {sv.name}
                  </div>
                  <div className="sui-flex sui-relative sui-h-[48px]" style={{ minWidth: hours.length * PIXELS_PER_HOUR }}>
                    {/* Hour grid lines */}
                    {hours.map((h) => (
                      <div
                        key={h}
                        className="sui-absolute sui-top-0 sui-bottom-0 sui-border-r sui-border-neutral-border/50"
                        style={{ left: (h - START_HOUR) * PIXELS_PER_HOUR }}
                      />
                    ))}

                    {/* Events */}
                    {sv.events.map((ev) => {
                      const { left, width } = eventStyle(ev);
                      return (
                        <div
                          key={ev.id}
                          className={`sui-absolute sui-top-1 sui-bottom-1 sui-rounded sui-px-1 sui-py-0.5 sui-flex sui-items-center sui-gap-1 sui-overflow-hidden sui-cursor-pointer hover:sui-opacity-90 sui-border sui-border-white/50 sui-shadow-sm ${typeColors[ev.type]}`}
                          style={{ left, width: Math.max(width, 60) }}
                          title={`${ev.title} (${ev.start}-${ev.end})`}
                        >
                          <SimpleIcon
                            name={typeIcons[ev.type]}
                            size="s"
                            className={`sui-flex-shrink-0 ${typeTextColors[ev.type]}`}
                          />
                          <span className={`sui-text-[10px] sui-font-medium sui-truncate ${typeTextColors[ev.type]}`}>
                            {ev.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="sui-p-8 sui-text-center sui-text-neutral-text-medium">
            No venues or events found for the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}
