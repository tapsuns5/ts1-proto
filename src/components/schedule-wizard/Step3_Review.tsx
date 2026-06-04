import { SimpleIcon } from '@/components/SimpleIcon';
import { SimpleLabelButton } from '@/components/SimpleLabelButton';
import type { VenueAvailability, Game } from '@/components/schedule-wizard/types';
import { VENUES, getDivisionById } from '@/components/schedule-wizard/mock-data';

interface Step3Props {
  selectedDivision: string;
  scheduleName: string;
  gamesPerTeam: number;
  gameDuration: number;
  gamesPerDay: number;
  allowByes: boolean;
  allowBackToBack: boolean;
  startDate: string;
  endDate: string;
  venueAvailability: Record<string, VenueAvailability>;
  onVenueAvailabilityChange: (value: Record<string, VenueAvailability>) => void;
  onEndDateChange: (value: string) => void;
  onGamesGenerated: (games: Game[]) => void;
  onManageGames: () => void;
}

export function Step3_Review({
  selectedDivision,
  scheduleName,
  gamesPerTeam,
  gameDuration,
  gamesPerDay,
  allowByes,
  allowBackToBack,
  startDate,
  endDate,
  venueAvailability,
  onVenueAvailabilityChange,
  onEndDateChange,
  onGamesGenerated,
  onManageGames,
}: Step3Props) {
  const formatDateRange = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${fmt(s)} – ${fmt(e)}`;
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
  const slotsShort = Math.max(0, slotsNeeded - totalSlots);
  const capacityPct = slotsNeeded > 0 ? Math.min(100, Math.round((totalSlots / slotsNeeded) * 100)) : 0;
  const hasEnoughSlots = totalSlots >= slotsNeeded;

  // Build enabled sub-venues list
  const enabledSubVenues: string[] = [];
  Object.entries(venueAvailability).forEach(([venueId, venueAvail]) => {
    const venue = VENUES.find((v: any) => v.id === venueId);
    Object.entries(venueAvail).forEach(([subVenueId, subVenue]) => {
      if (subVenue.enabled) {
        const sub = venue?.subVenues.find((s: any) => s.id === subVenueId);
        if (sub) {
          enabledSubVenues.push(`${sub.name} (${venue?.name})`);
        }
      }
    });
  });

  // Build game days & times summary
  const daySlots: Record<string, string[]> = {};
  Object.values(venueAvailability).forEach((venue) => {
    Object.values(venue).forEach((subVenue) => {
      if (subVenue.enabled && subVenue.weekAvailability) {
        Object.entries(subVenue.weekAvailability).forEach(([day, dayAvail]) => {
          if (dayAvail.enabled && dayAvail.timeSlots.length > 0) {
            if (!daySlots[day]) daySlots[day] = [];
            dayAvail.timeSlots.forEach((slot: any) => {
              const timeRange = `${slot.startTime} – ${slot.endTime}`;
              if (!daySlots[day].includes(timeRange)) {
                daySlots[day].push(timeRange);
              }
            });
          }
        });
      }
    });
  });
  
  const daysList = Object.keys(daySlots);
  const dayAbbrevList = daysList.map(d => d.slice(0, 3)).join(', ');
  const firstTimeRange = daySlots[daysList[0]]?.[0] || '';

  return (
    <div className="sui-flex sui-justify-center">
      <div className="sui-w-full sui-max-w-5xl sui-flex sui-flex-col sui-gap-3">
        {/* Summary Cards */}
        <div className="sui-grid sui-grid-cols-2 sui-gap-2">
          {/* Games to create */}
          <div className="sui-rounded-2xl sui-border sui-border-neutral-border sui-bg-white sui-p-3">
            <div className="sui-text-caption sui-font-semibold sui-text-neutral-text-medium sui-uppercase sui-mb-1">Games to create</div>
            <div className="sui-text-heading-lg sui-text-neutral-text sui-mb-0.5">{totalGames}</div>
            <div className="sui-text-caption sui-text-neutral-text-medium">{teamCount} teams × {gamesPerTeam} games</div>
          </div>

          {/* Slot capacity */}
          <div className="sui-rounded-2xl sui-border sui-border-neutral-border sui-bg-white sui-p-3">
            <div className="sui-text-caption sui-font-semibold sui-text-neutral-text-medium sui-uppercase sui-mb-1">Slot capacity</div>
            <div className="sui-flex sui-items-baseline sui-gap-1 sui-mb-1">
              <span className={`sui-text-heading-lg ${hasEnoughSlots ? 'sui-text-neutral-text' : 'sui-text-negative-text'}`}>{totalSlots}</span>
              <span className="sui-text-body sui-text-neutral-text-medium">/ {slotsNeeded} needed</span>
            </div>
            <div className="sui-w-full sui-h-2 sui-bg-neutral-background sui-rounded-full sui-overflow-hidden sui-mb-1">
              <div 
                className={`sui-h-full sui-rounded-full sui-transition-all ${hasEnoughSlots ? 'sui-bg-positive-action-background' : 'sui-bg-negative-action-background'}`}
                style={{ width: `${capacityPct}%` }}
              />
            </div>
            {!hasEnoughSlots && (
              <div className="sui-text-caption sui-flex sui-items-center sui-gap-0.5 sui-text-negative-text">
                <SimpleIcon name="warning" size="s" />
                {slotsShort} slots short
              </div>
            )}
          </div>
        </div>

        {/* Schedule configuration */}
        <div>
          <h3 className="sui-text-heading-sm sui-mb-1">Schedule configuration</h3>
          <div className="sui-rounded-2xl sui-border sui-border-neutral-border sui-bg-white sui-p-3">
            <div className="sui-grid sui-grid-cols-2 sui-gap-2">
              <div className="sui-p-2 sui-border sui-border-neutral-border sui-rounded-lg">
                <div className="sui-text-caption sui-font-semibold sui-text-neutral-text-medium sui-uppercase sui-mb-0.5">Schedule name</div>
                <div className="sui-text-body sui-text-neutral-text">{scheduleName || 'Untitled Schedule'}</div>
              </div>
              <div className="sui-p-2 sui-border sui-border-neutral-border sui-rounded-lg">
                <div className="sui-text-caption sui-font-semibold sui-text-neutral-text-medium sui-uppercase sui-mb-0.5">Season dates</div>
                <div className="sui-text-body sui-text-neutral-text">{formatDateRange(startDate, endDate)}</div>
              </div>
              <div className="sui-p-2 sui-border sui-border-neutral-border sui-rounded-lg">
                <div className="sui-text-caption sui-font-semibold sui-text-neutral-text-medium sui-uppercase sui-mb-0.5">Games per team</div>
                <div className="sui-text-body sui-text-neutral-text">{gamesPerTeam}</div>
              </div>
              <div className="sui-p-2 sui-border sui-border-neutral-border sui-rounded-lg">
                <div className="sui-text-caption sui-font-semibold sui-text-neutral-text-medium sui-uppercase sui-mb-0.5">Games per day</div>
                <div className="sui-text-body sui-text-neutral-text">{gamesPerDay}</div>
              </div>
              <div className="sui-p-2 sui-border sui-border-neutral-border sui-rounded-lg">
                <div className="sui-text-caption sui-font-semibold sui-text-neutral-text-medium sui-uppercase sui-mb-0.5">Duration</div>
                <div className="sui-text-body sui-text-neutral-text">{gameDuration} min</div>
              </div>
              <div className="sui-p-2 sui-border sui-border-neutral-border sui-rounded-lg">
                <div className="sui-text-caption sui-font-semibold sui-text-neutral-text-medium sui-uppercase sui-mb-0.5">Byes allowed</div>
                <div className="sui-text-body sui-text-neutral-text">{allowByes ? 'Yes' : 'No'}</div>
              </div>
              <div className="sui-p-2 sui-border sui-border-neutral-border sui-rounded-lg">
                <div className="sui-text-caption sui-font-semibold sui-text-neutral-text-medium sui-uppercase sui-mb-0.5">Back-to-back games</div>
                <div className="sui-text-body sui-text-neutral-text">{allowBackToBack ? 'Allowed' : 'Not allowed'}</div>
              </div>
              <div className="sui-p-2 sui-border sui-border-neutral-border sui-rounded-lg">
                <div className="sui-text-caption sui-font-semibold sui-text-neutral-text-medium sui-uppercase sui-mb-0.5">Division</div>
                <div className="sui-text-body sui-text-neutral-text">{selectedDivision}</div>
              </div>
              <div className="sui-p-2 sui-border sui-border-neutral-border sui-rounded-lg">
                <div className="sui-text-caption sui-font-semibold sui-text-neutral-text-medium sui-uppercase sui-mb-0.5">Sub-venues</div>
                <div className="sui-text-body sui-text-neutral-text">{enabledSubVenues.join(', ') || 'None selected'}</div>
              </div>
              <div className="sui-p-2 sui-border sui-border-neutral-border sui-rounded-lg">
                <div className="sui-text-caption sui-font-semibold sui-text-neutral-text-medium sui-uppercase sui-mb-0.5">Game days &amp; times</div>
                <div className="sui-flex sui-flex-col sui-gap-0.5">
                  {daysList.length > 0 ? (
                    <div className="sui-text-body sui-text-neutral-text">
                      <span className="sui-font-medium">{dayAbbrevList}</span> · {firstTimeRange}
                    </div>
                  ) : (
                    <div className="sui-text-body sui-text-neutral-text">None configured</div>
                  )}
                </div>
              </div>
              <div className="sui-p-2 sui-border sui-border-neutral-border sui-rounded-lg">
                <div className="sui-text-caption sui-font-semibold sui-text-neutral-text-medium sui-uppercase sui-mb-0.5">Blackouts</div>
                <div className="sui-text-body sui-text-neutral-text">None</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
