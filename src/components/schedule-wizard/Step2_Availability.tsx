import { useState, useRef } from 'react';
import { SimpleIcon } from '@/components/SimpleIcon';
import { SimpleLabelButton } from '@/components/SimpleLabelButton';
import Toggle from '@/components/Toggle/Toggle';
import type { VenueAvailability, TimeSlot } from '@/components/schedule-wizard/types';
import { VENUES, getDivisionById } from '@/components/schedule-wizard/mock-data';

interface Step2Props {
  selectedDivision: string;
  gamesPerTeam: number;
  gamesPerDay: number;
  gameDuration: number;
  allowByes: boolean;
  allowBackToBack: boolean;
  startDate: string;
  endDate: string;
  venueAvailability: Record<string, VenueAvailability>;
  onGamesPerTeamChange: (value: number) => void;
  onGamesPerDayChange: (value: number) => void;
  onGameDurationChange: (value: number) => void;
  onAllowByesChange: (value: boolean) => void;
  onAllowBackToBackChange: (value: boolean) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onVenueAvailabilityChange: (value: Record<string, VenueAvailability>) => void;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const FULL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// ─── Game Slot helpers ───
function generateTimeOptions(): string[] {
  const options: string[] = [];
  for (let h = 6; h < 23; h++) {
    for (let m = 0; m < 60; m += 15) {
      options.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return options;
}

const TIME_OPTIONS = generateTimeOptions();

function formatTime24to12(time24: string): string {
  const [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:${String(m).padStart(2, '0')} ${ampm}`;
}

function formatShortTime(time24: string): string {
  const [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'P' : 'A';
  const displayH = h % 12 || 12;
  return `${displayH}:${String(m).padStart(2, '0')}${ampm}`;
}

function computeEndTime(startTime24: string, durationMinutes: number): string {
  const [h, m] = startTime24.split(':').map(Number);
  const totalMin = h * 60 + m + durationMinutes;
  const endH = Math.floor(totalMin / 60) % 24;
  const endM = totalMin % 60;
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function getAvailableStartTimes(
  existingSlots: { startTime: string; endTime: string }[],
  gameDuration: number,
): string[] {
  const occupied = existingSlots.map(s => ({
    start: timeToMinutes(s.startTime),
    end: timeToMinutes(s.endTime),
  }));
  return TIME_OPTIONS.filter(opt => {
    const candidateStart = timeToMinutes(opt);
    const candidateEnd = candidateStart + gameDuration;
    return occupied.every(o => candidateEnd <= o.start || candidateStart >= o.end);
  });
}

export function Step2_Availability({
  selectedDivision,
  gamesPerTeam,
  gamesPerDay,
  gameDuration,
  allowByes,
  allowBackToBack,
  startDate,
  endDate,
  venueAvailability,
  onGamesPerTeamChange,
  onGamesPerDayChange,
  onGameDurationChange,
  onAllowByesChange,
  onAllowBackToBackChange,
  onStartDateChange,
  onEndDateChange,
  onVenueAvailabilityChange,
}: Step2Props) {
  const [collapsedVenues, setCollapsedVenues] = useState<Set<string>>(new Set());
  const [editingSlot, setEditingSlot] = useState<{
    venueId: string;
    subVenueId: string;
    day: string;
  } | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ left: number; top: number } | null>(null);
  const [slotStartTime, setSlotStartTime] = useState('09:00');
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  
  const toggleVenueCollapse = (venueId: string) => {
    const newCollapsed = new Set(collapsedVenues);
    if (newCollapsed.has(venueId)) {
      newCollapsed.delete(venueId);
    } else {
      newCollapsed.add(venueId);
    }
    setCollapsedVenues(newCollapsed);
  };

  const toggleSubVenue = (venueId: string, subVenueId: string, maxConcurrent: number) => {
    const updated = { ...venueAvailability };
    if (!updated[venueId]) {
      updated[venueId] = {};
    }
    if (!updated[venueId][subVenueId]) {
      updated[venueId][subVenueId] = {
        enabled: false,
        maxConcurrent: maxConcurrent,
        showAvailabilityEditor: false,
        weekAvailability: {},
        blackoutDates: [],
      };
    }
    updated[venueId][subVenueId] = {
      ...updated[venueId][subVenueId],
      enabled: !updated[venueId][subVenueId].enabled,
    };
    onVenueAvailabilityChange(updated);
  };

  const addSlot = (venueId: string, subVenueId: string, day: string, startTime: string) => {
    const updated = { ...venueAvailability };
    if (!updated[venueId]) updated[venueId] = {};
    if (!updated[venueId][subVenueId]) {
      updated[venueId][subVenueId] = {
        enabled: true,
        maxConcurrent: 1,
        showAvailabilityEditor: false,
        weekAvailability: {},
        blackoutDates: [],
      };
    }
    if (!updated[venueId][subVenueId].weekAvailability) {
      updated[venueId][subVenueId].weekAvailability = {};
    }
    if (!updated[venueId][subVenueId].weekAvailability[day]) {
      updated[venueId][subVenueId].weekAvailability[day] = {
        enabled: true,
        timeSlots: [],
      };
    }
    const endTime = computeEndTime(startTime, gameDuration);
    const newSlot: TimeSlot = {
      id: `slot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      startTime,
      endTime,
    };
    updated[venueId][subVenueId].weekAvailability[day].timeSlots.push(newSlot);
    updated[venueId][subVenueId].weekAvailability[day].enabled = true;
    onVenueAvailabilityChange(updated);
    setEditingSlot(null);
  };

  const updateSlot = (venueId: string, subVenueId: string, day: string, slotId: string, newStartTime: string) => {
    const updated = { ...venueAvailability };
    if (updated[venueId]?.[subVenueId]?.weekAvailability?.[day]) {
      const endTime = computeEndTime(newStartTime, gameDuration);
      const slots = updated[venueId][subVenueId].weekAvailability[day].timeSlots;
      const idx = slots.findIndex((s: any) => s.id === slotId);
      if (idx !== -1) {
        slots[idx] = { ...slots[idx], startTime: newStartTime, endTime };
        onVenueAvailabilityChange(updated);
      }
    }
    setEditingSlot(null);
    setEditingSlotId(null);
    setPopoverPos(null);
  };

  const removeSlot = (venueId: string, subVenueId: string, day: string, slotId: string) => {
    const updated = { ...venueAvailability };
    if (updated[venueId]?.[subVenueId]?.weekAvailability?.[day]) {
      updated[venueId][subVenueId].weekAvailability[day].timeSlots =
        updated[venueId][subVenueId].weekAvailability[day].timeSlots.filter((s: any) => s.id !== slotId);
      onVenueAvailabilityChange(updated);
    }
    setEditingSlot(null);
    setEditingSlotId(null);
    setPopoverPos(null);
  };

  // Calculate weeks in schedule window
  const calculateWeeks = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');
    const diffTime = end.getTime() - start.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    const diffWeeks = Math.ceil((diffDays + 1) / 7);
    return Math.max(1, diffWeeks);
  };

  const weeks = calculateWeeks();
  const teamCount = getDivisionById(selectedDivision)?.teamCount || 14;
  const totalGames = teamCount * gamesPerTeam;

  // Count total slots per week (timeSlots × maxConcurrent per sub-venue per week)
  const slotsPerWeek = Object.values(venueAvailability).reduce((total: number, venue) => {
    return total + Object.values(venue).reduce((venueTotal: number, subVenue) => {
      if (subVenue.enabled && subVenue.weekAvailability) {
        return venueTotal + Object.values(subVenue.weekAvailability).reduce((dayTotal: number, day) => {
          return dayTotal + (day.enabled ? day.timeSlots.length * subVenue.maxConcurrent : 0);
        }, 0);
      }
      return venueTotal;
    }, 0);
  }, 0);

  const totalSlots = slotsPerWeek * weeks;
  const slotsNeeded = totalGames;

  return (
    <div className="sui-flex sui-justify-center">
      <div className="sui-w-full sui-max-w-6xl sui-flex sui-flex-row sui-gap-4">
        {/* Main Content */}
        <div className="sui-flex-1 sui-min-w-0 sui-flex sui-flex-col sui-gap-3">
          {/* Schedule Rules */}
          <div>
            <h3 className="sui-text-heading-sm sui-mb-2">Schedule rules</h3>
            <div className="sui-bg-neutral-background sui-border sui-border-neutral-border sui-rounded-2xl sui-p-3">
              <div className="sui-grid sui-grid-cols-3 sui-gap-2">
                <div>
                  <label className="sui-block sui-text-label sui-font-medium sui-text-neutral-text sui-mb-1">
                    Games per team<span className="sui-text-negative-text">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={gamesPerTeam}
                    onChange={(e) => onGamesPerTeamChange(parseInt(e.target.value) || 1)}
                    className="sui-w-full sui-border sui-border-neutral-border sui-rounded-lg sui-px-3 sui-py-2 sui-text-sm focus:sui-outline-none focus:sui-ring-2 focus:sui-ring-admin-action-border"
                  />
                </div>
                <div>
                  <label className="sui-block sui-text-label sui-font-medium sui-text-neutral-text sui-mb-1">
                    Games per day<span className="sui-text-negative-text">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="3"
                    value={gamesPerDay}
                    onChange={(e) => onGamesPerDayChange(parseInt(e.target.value) || 1)}
                    className="sui-w-full sui-border sui-border-neutral-border sui-rounded-lg sui-px-3 sui-py-2 sui-text-sm focus:sui-outline-none focus:sui-ring-2 focus:sui-ring-admin-action-border"
                  />
                </div>
                <div>
                  <label className="sui-block sui-text-label sui-font-medium sui-text-neutral-text sui-mb-1">
                    Duration (minutes)<span className="sui-text-negative-text">*</span>
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="180"
                    step="15"
                    value={gameDuration}
                    onChange={(e) => onGameDurationChange(parseInt(e.target.value) || 75)}
                    className="sui-w-full sui-border sui-border-neutral-border sui-rounded-lg sui-px-3 sui-py-2 sui-text-sm focus:sui-outline-none focus:sui-ring-2 focus:sui-ring-admin-action-border"
                  />
                </div>
              </div>

                          {/* Toggle: Allow bye weeks */}
              <div className="sui-flex sui-items-start sui-justify-between sui-gap-1 sui-mt-3">
                <div>
                  <div className="sui-text-label sui-text-neutral-text">Allow bye weeks</div>
                  <div className="sui-text-caption sui-text-neutral-text-medium sui-mt-0.5">Permit bye weeks when there is an odd number of teams in a division.</div>
                </div>
                <Toggle
                  name="allow-byes"
                  on={allowByes}
                  onClick={() => onAllowByesChange(!allowByes)}
                />
              </div>

              {/* Toggle: Allow back-to-back games */}
              <div className={`sui-flex sui-items-start sui-justify-between sui-gap-1 sui-mt-2 ${gamesPerDay < 2 ? 'sui-opacity-40' : ''}`}>
                <div>
                  <div className="sui-text-label sui-text-neutral-text">Allow back-to-back games</div>
                  <div className="sui-text-caption sui-text-neutral-text-medium sui-mt-0.5">When scheduling multiple games per week, controls whether games can be clustered on the same day or must be spread across different days.</div>
                  {gamesPerDay < 2 && (
                    <div className="sui-text-caption sui-text-neutral-text-medium sui-mt-0.5">Requires 2 or more games per day.</div>
                  )}
                </div>
                <Toggle
                  name="allow-back-to-back"
                  on={allowBackToBack}
                  onClick={() => onAllowBackToBackChange(!allowBackToBack)}
                  disabled={gamesPerDay < 2}
                />
              </div>
            </div>
          </div>

          {/* Time Window */}
          <div id="time-window-section">
            <h3 className="sui-text-heading-md sui-mb-2">Time window</h3>
            <div className="sui-flex sui-bg-neutral-background sui-border sui-border-neutral-border sui-rounded-2xl sui-p-2 sui-flex-row sui-gap-2">
              <div className="sui-flex-1">
                <label className="sui-block sui-text-label sui-font-medium sui-text-neutral-text sui-mb-1" htmlFor="start-date">Start date<span className="sui-text-negative-text">*</span></label>
                <div className="sui-relative">
                  <input
                    ref={startDateRef}
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => onStartDateChange(e.target.value)}
                    className="sui-w-full sui-border sui-border-neutral-border sui-rounded-lg sui-px-3 sui-py-2 sui-text-sm focus:sui-outline-none focus:sui-ring-2 focus:sui-ring-admin-action-border sui-pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => startDateRef.current?.showPicker?.()}
                    className="sui-absolute sui-right-2 sui-top-1/2 -sui-translate-y-1/2 sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent sui-text-admin-action-text hover:sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover sui-h-[32px] sui-w-[32px] sui-min-w-[32px]"
                  >
                    <SimpleIcon name="calendar_today" size="s" />
                  </button>
                </div>
              </div>
              <div className="sui-flex-1">
                <label className="sui-block sui-text-label sui-font-medium sui-text-neutral-text sui-mb-1" htmlFor="end-date">End date<span className="sui-text-negative-text">*</span></label>
                <div className="sui-relative">
                  <input
                    ref={endDateRef}
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => onEndDateChange(e.target.value)}
                    className="sui-w-full sui-border sui-border-neutral-border sui-rounded-lg sui-px-3 sui-py-2 sui-text-sm focus:sui-outline-none focus:sui-ring-2 focus:sui-ring-admin-action-border sui-pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => endDateRef.current?.showPicker?.()}
                    className="sui-absolute sui-right-2 sui-top-1/2 -sui-translate-y-1/2 sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent sui-text-admin-action-text hover:sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover sui-h-[32px] sui-w-[32px] sui-min-w-[32px]"
                  >
                    <SimpleIcon name="calendar_today" size="s" />
                  </button>
                </div>
              </div>
            </div>
            <div className="sui-text-body sui-text-neutral-text-medium sui-mt-2">{weeks} weeks in schedule window</div>
          </div>

          {/* Game Slots */}
          <div>
            <div className="sui-flex sui-items-center sui-justify-between sui-mb-2 sui-mt-2">
              <h3 className="sui-text-heading-md">Game slots</h3>
              <div className="sui-flex sui-items-center sui-gap-1">
                <SimpleLabelButton type="tertiary" label="Bulk edit venue availability" size="small" />
                <SimpleLabelButton type="tertiary" label="Collapse all" size="small" />
              </div>
            </div>

            <div className="sui-flex sui-flex-col sui-gap-3">
              {VENUES.map((venue: any) => (
                <div key={venue.id} className="sui-rounded-2xl sui-border sui-border-neutral-border sui-bg-white">
                  {/* Venue Header */}
                  <div className="sui-px-3 sui-py-2 sui-flex sui-items-center sui-justify-between">
                    <div className="sui-flex sui-items-center sui-gap-2">
                      <span className="sui-text-heading-sm sui-font-bold">{venue.name}</span>
                      <span className="sui-text-xs sui-text-neutral-text-medium">{venue.address}</span>
                    </div>
                    <div className="sui-flex sui-items-center sui-gap-2">
                      <button
                        onClick={() => toggleVenueCollapse(venue.id)}
                        className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent sui-text-neutral-icon hover:sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover hover:sui-text-action-icon sui-h-[32px] sui-w-[32px] sui-min-w-[32px]"
                      >
                        <SimpleIcon name={collapsedVenues.has(venue.id) ? 'expand_more' : 'expand_less'} size="s" />
                      </button>
                    </div>
                  </div>

                  {/* Venue Content */}
                  <div className={`sui-transition-all sui-duration-300 ${collapsedVenues.has(venue.id) ? 'sui-max-h-0 sui-opacity-0 sui-overflow-hidden' : 'sui-max-h-[5000px] sui-opacity-100'}`}>
                    <div className="sui-px-3 sui-pb-3 sui-flex sui-flex-col sui-gap-2">
                      {venue.subVenues.length === 0 ? (
                        <div className="sui-rounded-2xl sui-border sui-border-dashed sui-border-neutral-border sui-bg-neutral-background-weak sui-p-4 sui-flex sui-flex-col sui-items-center sui-gap-2 sui-text-center">
                          <SimpleIcon name="location_off" size="l" />
                          <p className="sui-text-body sui-text-neutral-text-medium">This venue has no sub-venues (e.g. fields or courts). Add at least one sub-venue to make it available for scheduling.</p>
                          <SimpleLabelButton type="secondary" label="Add sub-venue" size="small" />
                        </div>
                      ) : (
                        <>
                          {venue.subVenues.map((subVenue: any) => {
                            const isEnabled = venueAvailability[venue.id]?.[subVenue.id]?.enabled || false;
                            return (
                              <div key={subVenue.id} className="sui-flex sui-flex-col sui-gap-2">
                                {/* Sub-venue Toggle */}
                                <div className="sui-flex sui-items-center sui-gap-2">
                                  <Toggle
                                    name={`${venue.id}-${subVenue.id}`}
                                    on={isEnabled}
                                    onClick={() => toggleSubVenue(venue.id, subVenue.id, subVenue.maxConcurrent)}
                                  />
                                  <span className="sui-text-label sui-text-neutral-text">{subVenue.name}</span>
                                </div>

                                {/* Availability Grid */}
                                {isEnabled && (
                                  <div className="sui-rounded-2xl sui-border sui-border-neutral-border sui-bg-neutral-background-weak sui-p-3 sui-flex sui-flex-col sui-gap-3">
                                    <div>
                                      <h4 className="sui-text-label sui-font-semibold sui-text-neutral-text sui-mb-2">Availability</h4>
                                      <div className="sui-grid sui-grid-cols-7 sui-gap-1">
                                        {DAYS.map((day, idx) => {
                                          const fullDay = FULL_DAYS[idx];
                                          const dayAvailability = venueAvailability[venue.id]?.[subVenue.id]?.weekAvailability?.[fullDay];
                                          const hasSlots = dayAvailability?.enabled && dayAvailability.timeSlots.length > 0;
                                          
                                          return (
                                            <div key={day} className="sui-flex sui-flex-col sui-gap-1">
                                              <div className="sui-text-caption sui-font-semibold sui-text-neutral-text sui-text-center">{day}</div>
                                              <div className="sui-rounded-xl sui-border sui-border-neutral-border sui-bg-white sui-p-1 sui-flex sui-flex-col sui-gap-0.5 sui-flex-1" style={{ minHeight: '9.5rem' }}>
                                                {hasSlots && dayAvailability.timeSlots.map((slot: any) => (
                                                  <button
                                                    key={slot.id}
                                                    className="sui-bg-info-background-weak sui-border sui-border-neutral-border sui-rounded-xl sui-px-1 sui-py-0.5 sui-text-caption sui-font-medium sui-text-neutral-text sui-cursor-pointer sui-w-full sui-text-center hover:sui-bg-info-background"
                                                    type="button"
                                                    onClick={(e) => {
                                                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                                      setPopoverPos({ left: rect.left, top: rect.bottom + 8 });
                                                      setEditingSlot({ venueId: venue.id, subVenueId: subVenue.id, day: fullDay });
                                                      setEditingSlotId(slot.id);
                                                      setSlotStartTime(slot.startTime);
                                                    }}
                                                  >
                                                    <div>{formatShortTime(slot.startTime)}</div>
                                                    <div>–{formatShortTime(slot.endTime)}</div>
                                                  </button>
                                                ))}
                                                {editingSlot?.venueId === venue.id && editingSlot?.subVenueId === subVenue.id && editingSlot?.day === fullDay ? (
                                                  <div className="sui-relative">
                                                    {/* Popover Card - fixed position anchored to button */}
                                                    <div className="sui-fixed sui-z-50" style={{ left: popoverPos?.left ?? 0, top: popoverPos?.top ?? 0 }}>
                                                      <div className="sui-bg-white sui-rounded-2xl sui-shadow-lg sui-border sui-border-solid sui-border-neutral-border sui-p-3 sui-flex sui-flex-col sui-gap-2" style={{ width: '20rem' }}>
                                                        {/* SVG Arrow at top pointing up */}
                                                        <span className="sui-absolute sui-top-0 sui-left-[36px] -sui-translate-y-full" style={{ transformOrigin: 'center bottom' }}>
                                                          <svg width="14" height="7" viewBox="0 0 30 10" preserveAspectRatio="none" style={{ display: 'block' }}>
                                                            <polygon points="0,10 30,10 15,0" fill="white" stroke="var(--color-neutral-border)" strokeWidth="1"/>
                                                          </svg>
                                                        </span>

                                                        {/* Header */}
                                                        <div className="sui-flex sui-items-center sui-justify-between sui-mb-1">
                                                          <span className="sui-text-heading-sm sui-font-bold">{editingSlotId ? 'Edit slot' : 'Add slot'}</span>
                                                          <button
                                                            type="button"
                                                            onClick={() => { setEditingSlot(null); setEditingSlotId(null); setPopoverPos(null); }}
                                                            className="sui-cursor-pointer sui-p-1 sui-text-neutral-text-weak hover:sui-text-neutral-text"
                                                            aria-label="Close"
                                                          >
                                                            <SimpleIcon name="close" size="s" />
                                                          </button>
                                                        </div>

                                                        {/* Start Time */}
                                                        <div className="sui-flex sui-items-end sui-gap-2 sui-mb-1">
                                                          <div className="sui-flex-1">
                                                            <label className="sui-block sui-text-label sui-mb-0.5" htmlFor={`slot-start-${venue.id}-${subVenue.id}-${fullDay}`}>Start time</label>
                                                            <div className="sui-relative">
                                                              <select
                                                                id={`slot-start-${venue.id}-${subVenue.id}-${fullDay}`}
                                                                value={slotStartTime}
                                                                onChange={(e) => setSlotStartTime(e.target.value)}
                                                                className="sui-w-full sui-appearance-none sui-border sui-border-neutral-border sui-rounded-full sui-px-4 sui-py-2.5 sui-text-body sui-text-neutral-text sui-bg-white focus:sui-outline-none focus:sui-ring-2 focus:sui-ring-admin-action-border sui-pr-10"
                                                              >
                                                                {(() => {
                                                                  // For edit mode, include the current start time in options
                                                                  const slots = dayAvailability?.timeSlots || [];
                                                                  let available = getAvailableStartTimes(slots, gameDuration);
                                                                  if (editingSlotId) {
                                                                    const currentSlot = slots.find((s: any) => s.id === editingSlotId);
                                                                    if (currentSlot && !available.includes(currentSlot.startTime)) {
                                                                      available = [currentSlot.startTime, ...available].sort();
                                                                    }
                                                                  }
                                                                  return available.map((t: string) => (
                                                                    <option key={t} value={t}>{formatTime24to12(t)}</option>
                                                                  ));
                                                                })()}
                                                              </select>
                                                              <div className="sui-absolute sui-right-3 sui-top-1/2 -sui-translate-y-1/2 sui-pointer-events-none sui-text-neutral-text">
                                                                <SimpleIcon name="arrow_drop_down" size="s" />
                                                              </div>
                                                            </div>
                                                          </div>
                                                          <span className="sui-text-body sui-text-neutral-text sui-pb-1">to {formatTime24to12(computeEndTime(slotStartTime, gameDuration))}</span>
                                                        </div>

                                                        {/* Buttons */}
                                                        <div className="sui-flex sui-items-center sui-justify-between sui-gap-1">
                                                          {editingSlotId ? (
                                                            <button
                                                              type="button"
                                                              onClick={() => removeSlot(venue.id, subVenue.id, fullDay, editingSlotId)}
                                                              className="sui-text-negative-text hover:sui-text-negative-text-pressed sui-text-label sui-cursor-pointer"
                                                            >
                                                              Remove
                                                            </button>
                                                          ) : (
                                                            <div></div>
                                                          )}
                                                          <div className="sui-flex sui-items-center sui-gap-1">
                                                            <SimpleLabelButton
                                                              type="secondary"
                                                              label="Cancel"
                                                              size="small"
                                                              onClick={() => { setEditingSlot(null); setEditingSlotId(null); setPopoverPos(null); }}
                                                            />
                                                            <SimpleLabelButton
                                                              type="primary"
                                                              label={editingSlotId ? 'Save' : 'Add'}
                                                              size="small"
                                                              onClick={() => {
                                                                if (editingSlotId) {
                                                                  updateSlot(venue.id, subVenue.id, fullDay, editingSlotId, slotStartTime);
                                                                } else {
                                                                  addSlot(venue.id, subVenue.id, fullDay, slotStartTime);
                                                                }
                                                              }}
                                                            />
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <button
                                                    className="sui-text-caption sui-cursor-pointer hover:sui-underline sui-text-admin-action-text"
                                                    type="button"
                                                    onClick={(e) => {
                                                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                                      setPopoverPos({ left: rect.left, top: rect.bottom + 8 });
                                                      setEditingSlot({ venueId: venue.id, subVenueId: subVenue.id, day: fullDay });
                                                      setEditingSlotId(null);
                                                      const available = getAvailableStartTimes(
                                                        dayAvailability?.timeSlots || [],
                                                        gameDuration
                                                      );
                                                      setSlotStartTime(available[0] || '09:00');
                                                    }}
                                                  >
                                                    + Add slot
                                                  </button>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="sui-text-label sui-font-semibold sui-text-neutral-text sui-mb-2">Blackout dates</h4>
                                      <div className="sui-flex sui-flex-col sui-gap-1">
                                        <button className="sui-text-label sui-text-admin-action-text sui-cursor-pointer hover:sui-underline sui-text-left sui-mt-0.5">+ Add blackout date</button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          <div className="sui-text-body sui-text-neutral-text-medium sui-mt-1">Slots added: {totalSlots}</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Travel Time Between Venues */}
          <div className="sui-mt-3">
            <h3 className="sui-text-heading-sm sui-mb-2">Travel time between venues</h3>
            <div className="sui-rounded-2xl sui-border sui-border-neutral-border sui-bg-white sui-p-3">
              <p className="sui-text-body sui-text-neutral-text-medium sui-mb-2">Set travel time between venues for back-to-back games</p>
              <div className="sui-flex sui-flex-col sui-gap-2">
                {VENUES.slice(0, -1).map((venue: any, idx: number) => {
                  const nextVenue = VENUES[idx + 1];
                  if (!nextVenue) return null;
                  return (
                    <div key={`${venue.id}-${nextVenue.id}`} className="sui-flex sui-items-center sui-justify-between sui-py-2 sui-border-t sui-border-neutral-border">
                      <div className="sui-flex sui-items-center sui-gap-2 sui-flex-1">
                        <span className="sui-text-body sui-text-neutral-text">{venue.name}</span>
                        <SimpleIcon name="arrow_range" size="s" />
                        <span className="sui-text-body sui-text-neutral-text">{nextVenue.name}</span>
                      </div>
                      <div className="sui-flex sui-items-center sui-gap-1">
                        <input
                          type="number"
                          className="sui-w-20 sui-px-2 sui-py-1 sui-border sui-border-neutral-border sui-rounded-lg sui-bg-white sui-text-body sui-text-neutral-text sui-text-right"
                          defaultValue="30"
                        />
                        <span className="sui-text-body sui-text-neutral-text-medium">min</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Add More Venues */}
          <div className="sui-mt-3">
            <SimpleLabelButton type="secondary" label="Add more venues" />
          </div>
        </div>

        {/* Right Sidebar - Schedule Summary */}
        <div className="sui-w-72 sui-flex-shrink-0">
          <div className="sui-sticky sui-top-4">
            <div className="sui-rounded-2xl sui-border sui-border-neutral-border sui-bg-neutral-background-weak sui-p-3">
              <div className="sui-flex sui-flex-col sui-gap-2 sui-max-w-[200px]">
                <h3 className="sui-text-heading-sm">Schedule summary</h3>
                <div className="sui-flex sui-items-center sui-justify-between">
                  <span className="sui-text-body sui-text-neutral-text-medium">Games per team</span>
                  <span className="sui-text-body sui-font-medium">{gamesPerTeam}</span>
                </div>
                <div className="sui-flex sui-items-start sui-justify-between">
                  <span className="sui-text-body sui-text-neutral-text-medium">Weeks</span>
                  <span className="sui-text-body sui-font-medium">{weeks}</span>
                </div>
                <div className="sui-flex sui-items-center sui-justify-between">
                  <span className="sui-text-body sui-text-neutral-text-medium">Total games</span>
                  <span className="sui-text-body sui-font-medium">{totalGames}</span>
                </div>
                <div className="sui-border-t sui-border-neutral-border"></div>
                <div className="sui-flex sui-items-center sui-justify-between">
                  <span className="sui-text-body sui-text-neutral-text-medium">Slots added</span>
                  <span className="sui-text-heading-sm">{totalSlots}</span>
                </div>
                <div className="sui-flex sui-items-center sui-justify-between">
                  <span className="sui-text-body sui-text-neutral-text-medium">Slots needed</span>
                  <span className={`sui-text-heading-sm ${totalSlots >= slotsNeeded ? 'sui-text-neutral-text' : 'sui-text-negative-text'}`}>{slotsNeeded}</span>
                </div>
                <div className="sui-border-t sui-border-neutral-border"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
