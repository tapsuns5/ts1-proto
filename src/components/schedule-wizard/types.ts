// Auto-scheduler-specific types for v2+ variants

export interface ScheduleEvent {
  id: string;
  date: Date;
  time: string;
  title: string;
  homeTeam: string;
  awayTeam?: string;
  divisionId: string;
  divisionLabel: string;
  venueId: string;
  venueLabel: string;
  eventType: string;
  status: string;
  scheduleId: string | null;
}

export interface Team {
  id: string;
  name: string;
  divisionId: string;
  short: string; // Abbreviation for display
}

export interface Division {
  id: string;
  name: string;
  teamCount: number;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  subVenues: SubVenue[];
}

export interface SubVenue {
  id: string;
  name: string;
  surface: string;
  maxConcurrent: number;
}

export interface TimeSlot {
  id: string;
  startTime: string; // HH:MM format
  endTime: string;
}

export interface DayAvailability {
  enabled: boolean;
  timeSlots: TimeSlot[];
}

export interface BlackoutDate {
  date: string;       // YYYY-MM-DD (start date, or single date)
  endDate?: string;   // YYYY-MM-DD (optional, for date ranges)
  label?: string;     // Optional label like "Memorial Day", "Fall Break"
}

export interface SubVenueAvailability {
  enabled: boolean;
  maxConcurrent: number;
  showAvailabilityEditor: boolean;
  weekAvailability: {
    [day: string]: DayAvailability;
  };
  blackoutDates: BlackoutDate[];
}

export interface VenueAvailability {
  [subVenueId: string]: SubVenueAvailability;
}

export interface WizardState {
  currentStep: 1 | 2 | 3;

  // Step 1 - Division Selection & Playing Groups
  scheduleName: string;
  selectedDivision: string;
  selectedDivisions: string[];
  playingGroupAssignments: Record<string, string>; // teamId -> playingGroupId

  // Step 2 - Availability
  scheduleRules: {
    gamesPerTeam: number;
    gamesPerDay: number;
    duration: number;
    allowByes: boolean;
    allowBackToBack: boolean;
  };
  timeWindow: {
    startDate: string;
    endDate: string;
    timezone: string;
  };
  venueAvailability: Record<string, VenueAvailability>;

  // Step 3 - Review
  generatedSchedule?: Schedule;
  unscheduledGames?: Game[];
}

export interface Game {
  id: string;
  week: number;
  homeTeamId: string;
  awayTeamId: string;
  date?: string;
  time?: string;
  venueId?: string;
  subVenueId?: string;
  playingGroupId: string;
}

export interface Schedule {
  games: Game[];
  weeks: Week[];
}

export interface Week {
  number: number;
  startDate: string;
  endDate: string;
  games: Game[];
}

export interface DraftSchedule {
  id: string;
  name: string;
  wizardState: WizardState;
  lastModified: string;
  currentStep: number;
}

export interface FairnessStats {
  teamId: string;
  totalGames: number;
  weekendGames: number;
  homeGames: number;
  awayGames: number;
}
