import type { ScheduleEvent } from '../types';

export interface CreatedSchedule {
  id: string;
  name: string;
  createdAt: string;
  status: 'draft' | 'published';
}

const SCHEDULES_KEY = 'auto-scheduler-c-schedules';
const EVENTS_KEY = 'auto-scheduler-c-events';

export function getCreatedSchedules(): CreatedSchedule[] {
  try {
    const raw = localStorage.getItem(SCHEDULES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CreatedSchedule[];
  } catch {
    return [];
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
