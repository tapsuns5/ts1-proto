"use client";

import { useState, Fragment, useEffect } from "react";
import { SimpleIcon } from "../SimpleIcon";
import { SimpleLabelButton } from "../SimpleLabelButton";
import { SimpleCheckbox } from "../SimpleCheckbox";
import { getDeterministicScore } from "./scoreUtils";
import Status from "../Status/Status";
import LabelButton from "../LabelButton/LabelButton";
import Badge from "../Badge/Badge";
import Combobox from "../Combobox/Combobox";
import { ComboboxTrigger } from "../Combobox/components/ComboboxTrigger";
import { ComboboxContent } from "../Combobox/Combobox";
import { ComboboxList } from "../Combobox/components/ComboboxList";
import { ComboboxItem } from "../Combobox/components/ComboboxItem";
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
import CoachConflictDialog from "./CoachConflictDialog";
import BulkEditDialog from "./BulkEditDialog";
import ScheduleWizard from "../schedule-wizard/ScheduleWizard";
import { DraftGamesReadyModal } from "../schedule-wizard/DraftGamesReadyModal";
import { ScheduleCards, type ScheduleCardItem } from "./ScheduleCards";
import { Sheet, SheetContent, SheetHeader, SheetBody, SheetFooter, SheetTitle } from "../Sheet/Sheet";
import { DataReport } from "./DataReport";
import { getCreatedEvents, getCreatedSchedules, updateScheduleStatus } from "../schedule-wizard/utils/scheduleStorage";
import { getDrafts, deleteDraft } from "../schedule-wizard/utils/draftStorage";
import type { Game } from "../schedule-wizard/types";

export interface ScheduleEvent {
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
  scheduleName?: string;
  coaches?: string[];
  coachConflicts?: string[];
}

interface ScheduleTabProps {
  events: ScheduleEvent[];
}

function generateMockEvents(): ScheduleEvent[] {
  const teams = [
    'Thunder Hawks', 'Red Wolves', 'Blue Strikers', 'Green Gators',
    'Silver Sharks', 'Golden Eagles', 'Storm Breakers', 'Iron Rhinos'
  ];
  const venues = ['Main Stadium', 'Field A', 'Field B', 'Community Center'];
  const subvenues = ['Field 1', 'Primary', 'Secondary', 'Gym'];

  // 4 coaches for 8 teams so each coach handles 2 teams → guaranteed conflicts
  const teamToCoach: Record<string, string> = {};
  const coaches = ['Coach Mike', 'Coach Sarah', 'Coach Dave', 'Coach Lisa'];
  teams.forEach((team, idx) => {
    teamToCoach[team] = coaches[Math.floor(idx / 2)];
  });

  const mockEvents: ScheduleEvent[] = [];
  let idCounter = 1;

  // Create 2 games at the SAME time on the SAME day using different venues
  // Each coach handles 2 teams, so cross-game conflicts are guaranteed
  const conflictSlots = [
    { date: 'Sat, Apr 5, 2025', time: '09:00 AM', games: [
      { home: 0, away: 2, venue: 0 }, // Thunder Hawks(Mike) vs Blue Strikers(Sarah)
      { home: 1, away: 3, venue: 1 }, // Red Wolves(Mike) vs Green Gators(Sarah) → Mike & Sarah conflict
    ]},
    { date: 'Sat, Apr 5, 2025', time: '11:00 AM', games: [
      { home: 4, away: 6, venue: 2 }, // Silver Sharks(Dave) vs Storm Breakers(Lisa)
      { home: 5, away: 7, venue: 3 }, // Golden Eagles(Dave) vs Iron Rhinos(Lisa) → Dave & Lisa conflict
    ]},
    { date: 'Sun, Apr 6, 2025', time: '09:00 AM', games: [
      { home: 0, away: 4, venue: 0 }, // Thunder Hawks(Mike) vs Silver Sharks(Dave)
      { home: 2, away: 6, venue: 1 }, // Blue Strikers(Sarah) vs Storm Breakers(Lisa)
    ]},
    { date: 'Sun, Apr 6, 2025', time: '11:00 AM', games: [
      { home: 1, away: 5, venue: 2 }, // Red Wolves(Mike) vs Golden Eagles(Dave)
      { home: 3, away: 7, venue: 3 }, // Green Gators(Sarah) vs Iron Rhinos(Lisa)
    ]},
  ];

  conflictSlots.forEach((slot) => {
    slot.games.forEach((g) => {
      mockEvents.push({
        id: `mock-${idCounter++}`,
        date: slot.date,
        time: slot.time,
        timezone: 'America/New_York',
        type: 'game',
        name: `${teams[g.home]} vs ${teams[g.away]}`,
        team: `${teams[g.home]} vs ${teams[g.away]}`,
        status: idCounter % 3 === 0 ? 'published' : idCounter % 3 === 1 ? 'draft' : 'canceled',
        venue: venues[g.venue],
        subvenue: subvenues[g.venue],
        hasConflict: false,
        scheduleName: 'Spring 2025',
        coaches: [teamToCoach[teams[g.home]], teamToCoach[teams[g.away]]],
      });
    });
  });

  // Fill remaining days with non-conflicting single games
  const extraDates = [
    'Mon, Apr 7, 2025', 'Tue, Apr 8, 2025', 'Wed, Apr 9, 2025',
    'Thu, Apr 10, 2025', 'Fri, Apr 11, 2025', 'Sat, Apr 12, 2025'
  ];
  extraDates.forEach((date, dIdx) => {
    const home = (dIdx * 2) % teams.length;
    const away = (home + 4) % teams.length;
    mockEvents.push({
      id: `mock-${idCounter++}`,
      date,
      time: '01:00 PM',
      timezone: 'America/New_York',
      type: 'game',
      name: `${teams[home]} vs ${teams[away]}`,
      team: `${teams[home]} vs ${teams[away]}`,
      status: 'published',
      venue: venues[dIdx % venues.length],
      subvenue: subvenues[dIdx % venues.length],
      hasConflict: false,
      scheduleName: 'Spring 2025',
      coaches: [teamToCoach[teams[home]], teamToCoach[teams[away]]],
    });
  });

  // Pre-compute coach conflicts (4 guaranteed)
  const eventsBySlot: Record<string, typeof mockEvents> = {};
  mockEvents.forEach((e) => {
    const key = `${e.date}|${e.time}`;
    if (!eventsBySlot[key]) eventsBySlot[key] = [];
    eventsBySlot[key].push(e);
  });

  let conflictCount = 0;
  const maxConflicts = 4;
  mockEvents.forEach((e) => {
    e.coachConflicts = [];
    if (conflictCount >= maxConflicts) return;
    const key = `${e.date}|${e.time}`;
    const sameSlot = eventsBySlot[key] || [];
    const gameTeams = e.team.split(' vs ').map((t) => t.trim());
    sameSlot.forEach((other) => {
      if (other.id === e.id) return;
      const otherTeams = other.team.split(' vs ').map((t) => t.trim());
      const otherCoaches = otherTeams.map((t) => teamToCoach[t]);
      gameTeams.forEach((team) => {
        const coach = teamToCoach[team];
        if (coach && otherCoaches.includes(coach) && !e.coachConflicts?.includes(coach)) {
          e.coachConflicts?.push(coach);
        }
      });
    });
    if (e.coachConflicts && e.coachConflicts.length > 0) {
      conflictCount++;
    }
  });

  return mockEvents;
}

function processCoachConflicts(events: ScheduleEvent[]) {
  const teamCoaches: Record<string, string> = {};
  const coachNames = ['Coach Mike', 'Coach Sarah', 'Coach Dave', 'Coach Lisa', 'Coach Tom', 'Coach Amy', 'Coach John', 'Coach Emma'];
  let coachIdx = 0;

  events.forEach((e) => {
    const teams = e.team.split(' vs ').map((t: string) => t.trim()).filter(Boolean);
    teams.forEach((team: string) => {
      if (!teamCoaches[team]) {
        teamCoaches[team] = coachNames[coachIdx % coachNames.length];
        coachIdx++;
      }
    });
  });

  const eventsByDateTime: Record<string, ScheduleEvent[]> = {};
  events.forEach((e) => {
    const key = `${e.date}|${e.time}`;
    if (!eventsByDateTime[key]) eventsByDateTime[key] = [];
    eventsByDateTime[key].push(e);
  });

  let conflictedEventCount = 0;
  const maxCoachConflicts = 4;

  events.forEach((e) => {
    // Skip if already processed (e.g., mock data has pre-computed conflicts)
    if (e.coaches && e.coaches.length > 0) return;
    const teams = e.team.split(' vs ').map((t: string) => t.trim()).filter(Boolean);
    e.coaches = teams.map((t: string) => teamCoaches[t]);
    e.coachConflicts = [];
    if (conflictedEventCount >= maxCoachConflicts) return;
    const key = `${e.date}|${e.time}`;
    const sameSlot = eventsByDateTime[key] || [];
    sameSlot.forEach((other) => {
      if (other.id === e.id) return;
      const otherTeams = other.team.split(' vs ').map((t: string) => t.trim()).filter(Boolean);
      const otherCoaches = otherTeams.map((t: string) => teamCoaches[t]);
      teams.forEach((team: string) => {
        const coach = teamCoaches[team];
        if (coach && otherCoaches.includes(coach) && !e.coachConflicts?.includes(coach)) {
          e.coachConflicts?.push(coach);
        }
      });
    });
    if (e.coachConflicts && e.coachConflicts.length > 0) {
      conflictedEventCount++;
    }
  });
}

function loadGeneratedEvents(): ScheduleEvent[] {
  try {
    const raw = localStorage.getItem('auto-scheduler-c-events');
    let parsed: Array<{
      id: string;
      date: string;
      time: string;
      title: string;
      homeTeam: string;
      awayTeam: string;
      venueLabel: string;
      eventType: string;
      status: string;
      scheduleId: string;
    }> = [];

    if (raw) {
      parsed = JSON.parse(raw);
    }

    if (!parsed || parsed.length === 0) {
      const events = generateMockEvents();
      processCoachConflicts(events);
      return events;
    }

    const schedules = getCreatedSchedules();
    const events: ScheduleEvent[] = parsed.map((e) => {
      const sched = schedules.find((s) => s.id === e.scheduleId);
      return {
        id: e.id,
        date: new Date(e.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
        time: e.time,
        timezone: 'America/New_York',
        type: (e.eventType === 'game' ? 'game' : 'other') as 'game' | 'practice' | 'other',
        name: e.title,
        team: `${e.homeTeam} vs ${e.awayTeam}`,
        status: (e.status === 'draft' ? 'draft' : e.status === 'published' ? 'published' : 'canceled') as 'draft' | 'published' | 'canceled',
        venue: e.venueLabel,
        subvenue: '',
        hasConflict: false,
        scheduleName: sched?.name || e.scheduleId,
      };
    });

    processCoachConflicts(events);
    return events;
  } catch {
    const events = generateMockEvents();
    processCoachConflicts(events);
    return events;
  }
}

export function ScheduleTab({ events }: ScheduleTabProps) {
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState<Set<string>>(new Set());
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false);
  const [selectedConflictEvent, setSelectedConflictEvent] = useState<ScheduleEvent | undefined>();
  const [coachConflictDialogOpen, setCoachConflictDialogOpen] = useState(false);
  const [selectedCoachConflictEvent, setSelectedCoachConflictEvent] = useState<ScheduleEvent | undefined>();
  const [bulkEditDialogOpen, setBulkEditDialogOpen] = useState(false);
  const [scheduleWizardOpen, setScheduleWizardOpen] = useState(false);
  const [continueDraftId, setContinueDraftId] = useState<string | undefined>(undefined);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [selectedSchedules, setSelectedSchedules] = useState<string[]>([]);
  const [scheduleOptions, setScheduleOptions] = useState<{ value: string; label: string }[]>([]);
  const [generatedGames, setGeneratedGames] = useState<Game[]>([]);
  const [gamesPerTeam, setGamesPerTeam] = useState(8);
  const [allEvents, setAllEvents] = useState<ScheduleEvent[]>(events);
  const [cardItems, setCardItems] = useState<ScheduleCardItem[]>([]);
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  const [dataReportSheetOpen, setDataReportSheetOpen] = useState(false);

  const loadCardItems = () => {
    const drafts = getDrafts();
    const schedules = getCreatedSchedules();
    const storedEvents = getCreatedEvents();

    const items: ScheduleCardItem[] = [];

    drafts.forEach((d) => {
      items.push({
        type: 'in-progress',
        id: d.id,
        name: d.name,
        subtitle: `Last edited ${new Date(d.lastModified).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      });
    });

    schedules.forEach((s) => {
      if (s.status === 'published') return;
      const schedEvents = storedEvents.filter((e: any) => e.scheduleId === s.id);
      items.push({
        type: s.status,
        id: s.id,
        name: s.name,
        subtitle: `Created ${new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
        draftEventCount: schedEvents.length,
        draftEventIds: schedEvents.map((e: any) => e.id),
      });
    });

    setCardItems(items);
  };

  useEffect(() => {
    setIsClientLoaded(true);
    const combined = [...events, ...loadGeneratedEvents()];
    processCoachConflicts(combined);
    setAllEvents(combined);
    loadCardItems();

    const schedules = getCreatedSchedules();
    setScheduleOptions(schedules.map((s) => ({ value: s.name, label: s.name })));
  }, [events]);

  const handleWizardGenerated = (scheduleName: string, scheduleId: string, gpt: number) => {
    setScheduleWizardOpen(false);
    setGenerationProgress(0);
    setSelectedSchedules([]);
    setGamesPerTeam(gpt);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setGenerationProgress(100);
        setTimeout(() => {
          setGenerationProgress(0);
          setShowDraftModal(true);
          setSelectedSchedules([scheduleName]);
          setAllEvents([...events, ...loadGeneratedEvents()]);
          loadCardItems();

          // Build Game[] from localStorage for the modal
          try {
            const raw = localStorage.getItem('auto-scheduler-c-events');
            if (raw) {
              const parsed = JSON.parse(raw);
              const schedEvents = parsed.filter((e: any) => e.scheduleId === scheduleId);
              const games: Game[] = schedEvents.map((e: any, idx: number) => ({
                id: e.id || `game-${idx}`,
                week: Math.floor(idx / 3) + 1,
                homeTeamId: e.homeTeam || '',
                awayTeamId: e.awayTeam || '',
                date: e.date,
                time: '09:00',
                venueId: e.venueId || '',
                subVenueId: '',
                playingGroupId: 'pg-1',
              }));
              setGeneratedGames(games);
            }
          } catch {
            setGeneratedGames([]);
          }
        }, 400);
      } else {
        setGenerationProgress(Math.min(95, progress));
      }
    }, 180);
  };

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

  const handleCoachConflictBadgeClick = (event?: ScheduleEvent) => {
    setSelectedCoachConflictEvent(event);
    setCoachConflictDialogOpen(true);
  };

  const displayEvents =
    selectedSchedules.length > 0
      ? allEvents.filter((e) => e.scheduleName && selectedSchedules.includes(e.scheduleName))
      : allEvents;

  const coachConflictCount = displayEvents.filter((e) => e.coachConflicts && e.coachConflicts.length > 0).length;

  const groupedEvents = displayEvents.reduce((acc, event) => {
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
        {/* Schedule Cards — client-only to avoid hydration mismatch */}
        {isClientLoaded && (
          <ScheduleCards
            items={cardItems}
            onContinueSetup={(draftId) => {
              setContinueDraftId(draftId);
              setScheduleWizardOpen(true);
            }}
            onViewGames={(scheduleId) => {
              const sched = getCreatedSchedules().find((s) => s.id === scheduleId);
              if (sched) {
                setSelectedSchedules([sched.name]);
                setAllEvents([...events, ...loadGeneratedEvents()]);
              }
            }}
            onPublish={(scheduleId, eventIds) => {
              updateScheduleStatus(scheduleId, 'published');
              loadCardItems();
              setAllEvents([...events, ...loadGeneratedEvents()]);
            }}
            onDelete={(id) => {
              deleteDraft(id);
              loadCardItems();
            }}
          />
        )}

        <section className="sui-flex sui-flex-col sui-gap-3 sui-mb-2 sui-pt-4 lg:sui-flex-row lg:sui-gap-2 lg:sui-justify-between lg:sui-items-start">
          {/* Filters Section */}
          <div className="sui-flex sui-flex-col sui-gap-2 sui-flex-wrap sm:sui-flex-row">
            {/* Date Range Selector */}
            <fieldset className="sui-w-full sm:sui-w-fit">
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
            
            {/* Filter Buttons */}
            <div className="sui-flex sui-flex-wrap sui-gap-1">
              {isClientLoaded && (
                <Combobox
                  values={selectedSchedules}
                  onValuesChange={(vals) => setSelectedSchedules(vals)}
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
              )}
              <button className="sui-flex sui-cursor-pointer sui-items-center sui-rounded-full sui-border sui-border-dashed sui-border-neutral-border-medium hover:sui-border-admin-action-border sui-px-2 sui-py-[2px] sui-pl-1 sui-min-h-[32px] sui-gap-1 sui-whitespace-nowrap sui-min-w-[100px]">
                <div className="sui-flex sui-items-center sui-gap-[4px] !sui-font-semibold sui-text-label">
                  <SimpleIcon name="add" size="s" />
                  <span className="hidden sm:inline">Division/Teams</span>
                  <span className="sm:hidden">Teams</span>
                </div>
              </button>
              <button className="sui-flex sui-cursor-pointer sui-items-center sui-rounded-full sui-border sui-border-dashed sui-border-neutral-border-medium hover:sui-border-admin-action-border sui-px-2 sui-py-[2px] sui-pl-1 sui-min-h-[32px] sui-gap-1 sui-whitespace-nowrap sui-min-w-[80px]">
                <div className="sui-flex sui-items-center sui-gap-[4px] !sui-font-semibold sui-text-label">
                  <SimpleIcon name="add" size="s" />
                  Venues
                </div>
              </button>
              <button className="sui-flex sui-cursor-pointer sui-items-center sui-rounded-full sui-border sui-border-dashed sui-border-neutral-border-medium hover:sui-border-admin-action-border sui-px-2 sui-py-[2px] sui-pl-1 sui-min-h-[32px] sui-gap-1 sui-whitespace-nowrap sui-min-w-[80px]">
                <div className="sui-flex sui-items-center sui-gap-[4px] !sui-font-semibold sui-text-label">
                  <SimpleIcon name="add" size="s" />
                  <span className="hidden sm:inline">Event Type</span>
                  <span className="sm:hidden">Type</span>
                </div>
              </button>
              <button className="sui-flex sui-cursor-pointer sui-items-center sui-rounded-full sui-border sui-border-dashed sui-border-neutral-border-medium hover:sui-border-admin-action-border sui-px-2 sui-py-[2px] sui-pl-1 sui-min-h-[32px] sui-gap-1 sui-whitespace-nowrap sui-min-w-[80px]">
                <div className="sui-flex sui-items-center sui-gap-[4px] !sui-font-semibold sui-text-label">
                  <SimpleIcon name="add" size="s" />
                  <span className="hidden sm:inline">Event Status</span>
                  <span className="sm:hidden">Status</span>
                </div>
              </button>
              <SimpleLabelButton type="tertiary" size="small" label="Clear all" onClick={() => { setSelectedSchedules([]); }} />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="sui-flex sui-flex-col sui-gap-2 sm:sui-flex-row sm:sui-gap-1 sm:sui-flex-shrink-0">
            <div className="sui-flex sui-gap-1 sui-flex-wrap sm:sui-nowrap">
              <SimpleLabelButton type="secondary" size="small" iconLeft="download" label="" dataTestId="export-schedule-button" className="sui-flex-shrink-0 !sui-pl-3 !sui-pr-3 !sui-gap-0 !sui-justify-center" />
              <SimpleLabelButton
                type="secondary"
                size="small"
                iconLeft="bar_chart"
                label=""
                onClick={() => setDataReportSheetOpen(true)}
                className="sui-flex-shrink-0 !sui-pl-3 !sui-pr-3 !sui-gap-0 !sui-justify-center"
              />
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild data-testid="add-import-dropdown-trigger">
                  <LabelButton size="small" variantType="secondary" labelText="Add/Import" className="sui-flex-shrink-0" />
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
              <SimpleLabelButton 
                type="primary" 
                size="small" 
                label="Create Schedule" 
                className="sui-flex-shrink-0" 
                onClick={() => setScheduleWizardOpen(true)}
              />
            </div>
          </div>
        </section>

        {/* Loading Overlay */}
        {generationProgress > 0 && (
          <div className="sui-fixed sui-inset-0 sui-z-40 sui-flex sui-items-center sui-justify-center sui-bg-white/80">
            <div className="sui-flex sui-flex-col sui-items-center sui-gap-4 sui-w-80">
              <div className="sui-text-heading-sm sui-text-neutral-text">Creating schedule</div>
              <div className="sui-w-full sui-h-3 sui-bg-neutral-background sui-rounded-full sui-overflow-hidden">
                <div
                  className="sui-h-full sui-bg-admin-action-background sui-rounded-full sui-transition-all sui-duration-150 sui-ease-out"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
              <div className="sui-flex sui-items-center sui-justify-between sui-w-full">
                <span className="sui-text-caption sui-text-neutral-text-medium">Generating game matchups...</span>
                <span className="sui-text-caption sui-font-bold sui-text-neutral-text">{Math.round(generationProgress)}%</span>
              </div>
            </div>
          </div>
        )}

        <div className="sui-mb-4">
          <header className="sui-flex sui-border sui-border-neutral-border sui-items-center sui-flex-col md:sui-flex-row sui-pl-0 md:sui-pl-[20px] sui-rounded-t-lg sui-bg-white sui-gap-2">
            {selectedEvents.size > 0 && (
              <div className="sui-flex sui-flex-col sm:sui-flex-row sui-items-start sm:sui-items-center sui-gap-2 sui-p-2 sui-w-full sm:sui-w-auto">
                <p className="sui-font-bold sui-whitespace-nowrap">
                  {selectedEvents.size} selected
                </p>
                <div className="sui-w-px sui-h-6 sui-bg-neutral-border sui-hidden sm:block" />
                <div className="sui-flex sui-flex-wrap sui-gap-1 sui-w-full sm:sui-w-auto">
                  <SimpleLabelButton
                    type="secondary"
                    size="small"
                    label="Publish All"
                    onClick={() => {
                      // Mock publish functionality
                      console.log(`Publishing ${selectedEvents.size} events`);
                    }}
                    className="sui-flex-shrink-0"
                  />
                  <SimpleLabelButton
                    type="secondary"
                    size="small"
                    label="Bulk Edit"
                    onClick={() => setBulkEditDialogOpen(true)}
                    className="!sui-border-black !sui-text-black hover:!sui-bg-gray-50 sui-flex-shrink-0"
                  />
                  <SimpleLabelButton
                    type="secondary"
                    size="small"
                    label="Cancel All"
                    onClick={() => {
                      // Mock cancel functionality
                      console.log(`Cancelling ${selectedEvents.size} events`);
                    }}
                    className="!border-red-600 !text-red-600 hover:!bg-red-50 sui-flex-shrink-0"
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
                    className="!border-red-600 !text-red-600 hover:!bg-red-50 sui-flex-shrink-0"
                    style={{ borderColor: '#dc2626', color: '#dc2626' }}
                  />
                </div>
              </div>
            )}
            {selectedEvents.size === 0 && (
              <div className="sui-flex sui-flex-col sm:sui-flex-row sui-items-start sm:sui-items-center sui-gap-2 sui-p-2 sui-w-full">
                <div className="sui-flex sui-items-center sui-gap-2 sui-flex-wrap">
                  <SimpleLabelButton type="tertiary" size="small" label="ET - Eastern" className="sui-flex-shrink-0" />
                  <div className="sui-flex sui-gap-2 sui-items-center">
                    <p className="sui-flex sui-items-center sui-gap-1 sui-caption">
                      <span className={`sui-block sui-size-[12px] ${eventTypeColors.game} sui-rounded-full`} />
                      <span className="hidden sm:inline">Game</span>
                    </p>
                    <p className="sui-flex sui-items-center sui-gap-1 sui-caption">
                      <span className={`sui-block sui-size-[12px] ${eventTypeColors.practice} sui-rounded-full`} />
                      <span className="hidden sm:inline">Practice</span>
                    </p>
                    <p className="sui-flex sui-items-center sui-gap-1 sui-caption">
                      <span className={`sui-block sui-size-[12px] ${eventTypeColors.other} sui-rounded-full`} />
                      <span className="hidden sm:inline">Other event</span>
                    </p>
                  </div>
                </div>
                <div className="sui-flex sui-items-center sui-gap-2 sui-ml-auto sui-flex-wrap" data-testid="table-pagination">
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
              </div>
            )}
          </header>

          <div className="sui-overflow-x-auto sui-border-l sui-border-r sui-border-b sui-border-neutral-border sui-bg-white sui-rounded-b-lg">
            <table className="sui-w-full sui-border-spacing-0 sui-border-separate sui-text-body-dense sui-min-w-[600px] sm:sui-min-w-[700px]" data-testid="schedule-table">
            <thead className="[&_th]:sui-border-b [&_th]:sui-border-solid [&_th]:sui-border-neutral-border [&_th]:sui-bg-neutral-background-weak">
              <tr className="sui-group/row [&_td]:sui-border-b [&_td]:sui-border-solid [&_td]:sui-border-neutral-border hover:sui-bg-neutral-background-weak data-[state=selected]:sui-bg-admin-action-background-weak-hover data-[state=selected]:hover:sui-bg-admin-action-background-weak-hover">
                <th className="sui-p-2 sui-text-left sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold sui-w-[40px]">
                  <div className="sui-flex sui-items-center sui-gap-2">
                    <SimpleCheckbox
                      checked={displayEvents.length > 0 && selectedEvents.size === displayEvents.length}
                      onChange={(checked) => {
                        if (checked) {
                          // Select all
                          setSelectedEvents(new Set(displayEvents.map(event => event.id)));
                        } else {
                          // Deselect all
                          setSelectedEvents(new Set());
                        }
                      }}
                    />
                  </div>
                </th>
                <th className="sui-p-2 sui-text-left sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold sui-w-[120px] sm:sui-w-[20%]">
                  <div className="sui-flex sui-items-center sui-gap-2">
                  </div>
                </th>
                <th className="sui-p-2 sui-text-left sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold">
                  <div className="sui-flex sui-items-center sui-gap-2">
                    <span className="hidden sm:inline">Team(s)</span>
                    {coachConflictCount > 0 && (
                      <Badge
                        labelText={`${coachConflictCount} Coach Conflict${coachConflictCount > 1 ? 's' : ''}`}
                        variant="caution1"
                        className="sui-cursor-pointer sui-hover:opacity-80 sui-whitespace-nowrap"
                        onClick={() => handleCoachConflictBadgeClick()}
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
                    <Badge
                      labelText="2 Venue Conflicts"
                      variant="caution1"
                      className="sui-cursor-pointer sui-hover:opacity-80 sui-whitespace-nowrap"
                      onClick={() => handleConflictBadgeClick()}
                    />
                  </div>
                </th>
                <th className="sui-p-2 sui-text-left sui-align-middle [&:has([role=checkbox])]:sui-pr-0 sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold sui-w-[60px]">
                  <div className="sui-flex sui-items-center sui-gap-2">
                  </div>
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
                      <td className={`sui-p-2 [&:has([role=checkbox])]:sui-pr-0 sui-w-[120px] sm:sui-w-[20%] sui-align-top sui-pl-0 ${event.status === "canceled" ? "sui-line-through" : ""}`}>
                        <div className="sui-flex sui-flex-col sui-gap-1">
                          <p className="sui-text-neutral-text-medium sui-text-xs sm:text-sm sui-font-medium">
                            {event.time}
                          </p>
                          <p className="sui-text-neutral-text-medium sui-text-xs sm:text-xs">
                            {event.timezone}
                          </p>
                         
                        </div>
                      </td>
                      <td className={`sui-p-2 [&:has([role=checkbox])]:sui-pr-0 sui-align-top sui-py-0 ${event.status === "canceled" ? "sui-line-through" : ""}`}>
                        <div className="sui-flex sui-gap-2 sui-py-2 sui-h-[70px] sui-items-center">
                          <span className={`sui-block sui-size-[12px] sui-relative ${eventTypeColors[event.type]} sui-rounded-full sui-flex-shrink-0`} />
                          <div className="sui-h-full sui-flex sui-flex-col sui-justify-between sui-min-w-0">
                            <div className="sui-truncate sm:sui-truncate" title={event.name}>{event.name}</div>
                            <div className="sui-flex sui-items-center sui-gap-1">
                              <div className="sui-truncate sm:sui-truncate text-xs sm:text-sm sui-text-neutral-text-medium" title={event.team}>{event.team}</div>
                              {event.coachConflicts && event.coachConflicts.length > 0 && (
                                <Badge
                                  labelText="Coach Conflict"
                                  variant="caution1"
                                  className="sui-cursor-pointer sui-hover:opacity-80 sui-flex-shrink-0"
                                  onClick={() => handleCoachConflictBadgeClick(event)}
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
                                  onClick={() => handleConflictBadgeClick(event)}
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
        conflicts={allEvents}
        showAllConflicts={!selectedConflictEvent}
        onIgnoreConflict={handleIgnoreConflict}
        onResolveConflict={handleResolveConflict}
      />
      <CoachConflictDialog
        open={coachConflictDialogOpen}
        onClose={() => {
          setCoachConflictDialogOpen(false);
          setSelectedCoachConflictEvent(undefined);
        }}
        scheduleItem={selectedCoachConflictEvent}
        conflicts={allEvents}
        showAllConflicts={!selectedCoachConflictEvent}
        onIgnoreConflict={handleIgnoreConflict}
        onResolveConflict={(id, date, time, venueId) => {
          console.log('Moving game:', id, 'to', date, time, venueId);
          setCoachConflictDialogOpen(false);
          setSelectedCoachConflictEvent(undefined);
        }}
      />
      <BulkEditDialog
        open={bulkEditDialogOpen}
        onClose={() => setBulkEditDialogOpen(false)}
        selectedEventsCount={selectedEvents.size}
      />
      
      <ScheduleWizard
        isOpen={scheduleWizardOpen}
        onClose={() => {
          setScheduleWizardOpen(false);
          setContinueDraftId(undefined);
        }}
        onGenerated={(scheduleName, scheduleId, gpt) => {
          handleWizardGenerated(scheduleName, scheduleId, gpt);
        }}
        draftId={continueDraftId}
      />

      <DraftGamesReadyModal
        open={showDraftModal}
        onPublishNow={() => {
          setShowDraftModal(false);
        }}
        onViewGames={() => {
          setShowDraftModal(false);
        }}
        games={generatedGames}
        gamesPerTeam={gamesPerTeam}
      />

      <Sheet open={dataReportSheetOpen} onOpenChange={setDataReportSheetOpen}>
        <SheetContent side="right">
          <DataReport 
            events={displayEvents} 
            onClose={() => setDataReportSheetOpen(false)}
            initialScheduleFilter={selectedSchedules[0] || "all"}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
