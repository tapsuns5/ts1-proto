import type { ScheduleEvent } from '../types';

export interface CreatedSchedule {
  id: string;
  name: string;
  createdAt: string;
  status: 'draft' | 'published';
  divisions?: string[];
}

const SCHEDULES_KEY = 'auto-scheduler-c-schedules';
const EVENTS_KEY = 'auto-scheduler-c-events';

const MOCK_SCHEDULES: CreatedSchedule[] = [
  { id: 'sched-spring', name: 'Spring 2025', createdAt: new Date().toISOString(), status: 'published', divisions: ['8U'] },
  { id: 'sched-summer', name: 'Summer 2025', createdAt: new Date().toISOString(), status: 'draft', divisions: ['11U'] },
  { id: 'sched-fall', name: 'Fall 2025', createdAt: new Date().toISOString(), status: 'draft', divisions: ['13U'] },
  { id: 'sched-tourney', name: 'Tournament 2025', createdAt: new Date().toISOString(), status: 'published', divisions: ['10U'] },
];

export function getCreatedSchedules(): CreatedSchedule[] {
  try {
    const raw = localStorage.getItem(SCHEDULES_KEY);
    if (!raw) return MOCK_SCHEDULES;
    const parsed = JSON.parse(raw) as CreatedSchedule[];
    if (parsed.length === 0) return MOCK_SCHEDULES;
    // Merge mock divisions into schedules missing them
    const mockById = new Map(MOCK_SCHEDULES.map((s) => [s.id, s]));
    return parsed.map((s) => {
      const mock = mockById.get(s.id);
      if (mock && (!s.divisions || s.divisions.length === 0)) {
        return { ...s, divisions: mock.divisions };
      }
      return s;
    });
  } catch {
    return MOCK_SCHEDULES;
  }
}

export function saveCreatedSchedule(schedule: CreatedSchedule): void {
  const schedules = getCreatedSchedules();
  const index = schedules.findIndex((s) => s.id === schedule.id);
  if (index >= 0) {
    schedules[index] = schedule;
  } else {
    schedules.push(schedule);
  }
  localStorage.setItem(SCHEDULES_KEY, JSON.stringify(schedules));
}

export function getCreatedEvents(): ScheduleEvent[] {
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<ScheduleEvent & { date: string }>;
    return parsed.map((e) => ({ ...e, date: new Date(e.date) }));
  } catch {
    return [];
  }
}

export function saveCreatedEvents(events: ScheduleEvent[]): void {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export function appendCreatedEvents(newEvents: ScheduleEvent[]): void {
  const existing = getCreatedEvents();
  const merged = [...existing, ...newEvents];
  localStorage.setItem(EVENTS_KEY, JSON.stringify(merged));
}

export function replaceEventsForSchedule(scheduleId: string, newEvents: ScheduleEvent[]): void {
  const existing = getCreatedEvents().filter((e) => e.scheduleId !== scheduleId);
  localStorage.setItem(EVENTS_KEY, JSON.stringify([...existing, ...newEvents]));
}

export function updateScheduleStatus(scheduleId: string, status: 'draft' | 'published'): void {
  const schedules = getCreatedSchedules();
  const schedule = schedules.find((s) => s.id === scheduleId);
  if (schedule) {
    schedule.status = status;
    localStorage.setItem(SCHEDULES_KEY, JSON.stringify(schedules));
  }
}
