import type { DraftSchedule } from '../types';

const STORAGE_KEY = 'auto-scheduler-b-drafts';

export function getDrafts(): DraftSchedule[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as DraftSchedule[];
  } catch {
    return [];
  }
}

export function saveDraft(draft: DraftSchedule): void {
  const drafts = getDrafts();
  const index = drafts.findIndex((d) => d.id === draft.id);
  if (index >= 0) {
    drafts[index] = draft;
  } else {
    drafts.push(draft);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

export function deleteDraft(id: string): void {
  const drafts = getDrafts().filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

export function getDraftById(id: string): DraftSchedule | undefined {
  return getDrafts().find((d) => d.id === id);
}
