"use client";

import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "../AlertDialog/AlertDialog";

interface CoachConflictDialogProps {
  open: boolean;
  onClose: () => void;
  scheduleItem?: ScheduleEvent;
  showAllConflicts?: boolean;
  conflicts?: ScheduleEvent[];
  onIgnoreConflict?: (scheduleId: string) => void;
  onResolveConflict?: (scheduleId: string, newDate?: string, newTime?: string, newVenueId?: string) => void;
}

interface ScheduleEvent {
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
  coaches?: string[];
  coachConflicts?: string[];
}

const allVenues = [
  { name: "Main Stadium", subvenue: "Field 1", venueId: "venue-1" },
  { name: "Field A", subvenue: "Primary", venueId: "venue-2" },
  { name: "Field B", subvenue: "Secondary", venueId: "venue-3" },
  { name: "Community Center", subvenue: "Gym", venueId: "venue-4" },
];

function generateSuggestions(currentSchedule: ScheduleEvent) {
  const suggestions: { venue: string; time: string; date: string; venueId: string }[] = [];

  const baseTime = new Date();
  const [hourStr, minuteStr] = currentSchedule.time.split(':');
  baseTime.setHours(parseInt(hourStr));
  baseTime.setMinutes(parseInt(minuteStr.split(' ')[0]));

  for (let i = 1; i <= 3; i++) {
    const newTime = new Date(baseTime);
    newTime.setHours(baseTime.getHours() + i);
    const timeStr = newTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const venue = allVenues[i % allVenues.length];
    suggestions.push({
      venue: `${venue.name} - ${venue.subvenue}`,
      time: timeStr,
      date: currentSchedule.date,
      venueId: venue.venueId,
    });
  }
  return suggestions;
}

export default function CoachConflictDialog({
  open,
  onClose,
  scheduleItem,
  showAllConflicts = false,
  conflicts = [],
  onIgnoreConflict,
  onResolveConflict,
}: CoachConflictDialogProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<{ date?: string; time?: string; venueId?: string } | null>(null);

  useEffect(() => {
    if (open) {
      setSelectedSuggestion(null);
    }
  }, [open]);

  const conflictsToShow = showAllConflicts
    ? conflicts.filter((c) => c.coachConflicts && c.coachConflicts.length > 0)
    : scheduleItem?.coachConflicts && scheduleItem.coachConflicts.length > 0
    ? [scheduleItem]
    : [];

  if (conflictsToShow.length === 0) return null;

  return (
    <AlertDialog open={open} onOpenChange={(val) => !val && onClose()}>
      <AlertDialogContent showCloseButton={true} className="sui-max-w-lg sui-max-h-[85vh] sui-overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {showAllConflicts
              ? `Coach Conflicts (${conflictsToShow.length})`
              : 'Coach Conflict'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            The following coaches are double-booked. Select a suggested alternative to move the game.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="sui-space-y-4 sui-py-4">
          {conflictsToShow.map((schedule) => {
            const suggestions = generateSuggestions(schedule);
            const coachNames = schedule.coachConflicts || [];
            const teamCoaches = schedule.coaches || [];

            return (
              <div key={schedule.id} className="sui-space-y-3">
                <div>
                  <p className="sui-font-semibold">{schedule.name}</p>
                  <p className="sui-text-sm sui-text-neutral-text-medium">
                    {schedule.team}
                  </p>
                  <p className="sui-text-sm sui-text-neutral-text-medium">
                    {schedule.time} - {schedule.timezone}
                  </p>
                  <p className="sui-text-sm sui-text-neutral-text-medium">
                    {schedule.venue} {schedule.subvenue && `- ${schedule.subvenue}`}
                  </p>
                </div>

                {coachNames.length > 0 && (
                  <div className="sui-border sui-border-neutral-border sui-rounded sui-p-3 sui-space-y-2">
                    <p className="sui-font-medium sui-text-sm">Conflicting coaches:</p>
                    <div className="sui-space-y-1">
                      {coachNames.map((coach) => (
                        <div key={coach} className="sui-text-sm sui-text-neutral-text-medium sui-ml-2">
                          <p className="sui-font-semibold">{coach}</p>
                          <p className="sui-ml-2 sui-text-xs">
                            Assigned to {schedule.team.split(' vs ').map((t) => t.trim()).filter(Boolean).map((team, idx, arr) => {
                              const isLast = idx === arr.length - 1;
                              const teamCoach = teamCoaches.find((c) => schedule.team.includes(team));
                              return teamCoach === coach ? `${isLast && arr.length > 1 ? ' and ' : ''}${team}` : '';
                            }).filter(Boolean).join('')} at this time slot.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="sui-space-y-2">
                  <p className="sui-font-medium sui-text-sm">Suggested alternatives:</p>
                  <div className="sui-space-y-2">
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedSuggestion({ date: suggestion.date, time: suggestion.time, venueId: suggestion.venueId });
                        }}
                        className={`sui-w-full sui-px-4 sui-py-2 sui-border sui-border-blue-300 sui-rounded-full sui-text-sm sui-font-medium sui-text-left sui-transition-colors ${
                          selectedSuggestion?.venueId === suggestion.venueId &&
                          selectedSuggestion?.time === suggestion.time
                            ? 'sui-bg-blue-50 sui-border-blue-500'
                            : 'sui-bg-white sui-hover:bg-blue-50'
                        }`}
                      >
                        {suggestion.venue} at {suggestion.time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <AlertDialogFooter className="sui-flex-col sui-gap-2">
          {selectedSuggestion ? (
            <>
              <AlertDialogCancel onClick={() => setSelectedSuggestion(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (selectedSuggestion && scheduleItem) {
                    onResolveConflict?.(scheduleItem.id, selectedSuggestion.date, selectedSuggestion.time, selectedSuggestion.venueId);
                    onClose();
                  }
                }}
              >
                Move Game
              </AlertDialogAction>
            </>
          ) : (
            <>
              <AlertDialogAction
                onClick={() => {
                  conflictsToShow.forEach((conflict) => {
                    onIgnoreConflict?.(conflict.id);
                  });
                  onClose();
                }}
              >
                Ignore Conflict
              </AlertDialogAction>
              <AlertDialogCancel onClick={onClose}>Close</AlertDialogCancel>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
