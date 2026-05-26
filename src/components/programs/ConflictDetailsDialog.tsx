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

interface ConflictDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  scheduleItem?: ScheduleEvent;
  showAllConflicts?: boolean;
  conflicts?: ScheduleEvent[];
  onIgnoreConflict?: (scheduleId: string) => void;
  onResolveConflict?: (scheduleId: string, newVenueId?: string, newTime?: string) => void;
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
  hasConflict?: boolean;
}

export default function ConflictDetailsDialog({
  open,
  onClose,
  scheduleItem,
  showAllConflicts = false,
  conflicts = [],
  onIgnoreConflict,
  onResolveConflict,
}: ConflictDetailsDialogProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<{ venueId?: string; time?: string } | null>(null);

  // Reset selection when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedSuggestion(null);
    }
  }, [open]);

  const conflictsToShow = showAllConflicts 
    ? conflicts.filter(c => c.hasConflict)
    : scheduleItem?.hasConflict 
    ? [scheduleItem]
    : [];

  if (conflictsToShow.length === 0) return null;

  // Generate alternative suggestions (venue + time combinations)
  const generateSuggestions = (currentSchedule: ScheduleEvent) => {
    const suggestions: { venue: string; time: string; venueId?: string }[] = [];
    const allVenues = [
      { name: "Main Stadium", subvenue: "Field 1", venueId: "venue-1" },
      { name: "Field A", subvenue: "Primary", venueId: "venue-2" },
      { name: "Field B", subvenue: "Secondary", venueId: "venue-3" },
      { name: "Community Center", subvenue: "Gym", venueId: "venue-4" },
    ];

    // Generate 3 suggestions by adding hours to current time
    const baseTime = new Date();
    baseTime.setHours(parseInt(currentSchedule.time.split(':')[0]));
    baseTime.setMinutes(parseInt(currentSchedule.time.split(':')[1].split(' ')[0]));

    for (let i = 1; i <= 3; i++) {
      const newTime = new Date(baseTime);
      newTime.setHours(baseTime.getHours() + i);
      const timeStr = newTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      const venue = allVenues[i % allVenues.length];
      suggestions.push({
        venue: `${venue.name} - ${venue.subvenue}`,
        time: timeStr,
        venueId: venue.venueId,
      });
    }
    return suggestions;
  };

  return (
    <AlertDialog open={open} onOpenChange={(val) => !val && onClose()}>
      <AlertDialogContent showCloseButton={true} className="sui-max-w-lg sui-max-h-[85vh] sui-overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {showAllConflicts
              ? `Schedule Conflicts (${conflictsToShow.length})`
              : 'Schedule Conflict'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Review and resolve scheduling conflicts with suggested alternatives.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="sui-space-y-4 sui-py-4">
          {conflictsToShow.map((schedule) => {
            const suggestions = generateSuggestions(schedule);
            const conflictingSchedules = conflicts.filter(
              c => c.id !== schedule.id && 
              c.date === schedule.date && 
              c.venue === schedule.venue
            );

            return (
              <div key={schedule.id} className="sui-space-y-3">
                <div>
                  <p className="sui-font-semibold">{schedule.name}</p>
                  <p className="sui-text-sm sui-text-neutral-text-medium">
                    {schedule.time} - {schedule.timezone}
                  </p>
                  <p className="sui-text-sm sui-text-neutral-text-medium">
                    {schedule.venue} {schedule.subvenue && `- ${schedule.subvenue}`}
                  </p>
                </div>

                {conflictingSchedules.length > 0 && (
                  <div className="sui-border sui-border-neutral-border sui-rounded sui-p-3 sui-space-y-2">
                    <p className="sui-font-medium sui-text-sm">Conflicts with:</p>
                    {conflictingSchedules.map((conflictSchedule) => (
                      <div key={conflictSchedule.id} className="sui-text-sm sui-text-neutral-text-medium sui-ml-2">
                        <p>• {conflictSchedule.name}</p>
                        <p className="sui-ml-2">
                          {conflictSchedule.time} - {conflictSchedule.timezone}
                        </p>
                        <p className="sui-ml-2">
                          {conflictSchedule.venue} {conflictSchedule.subvenue && `- ${conflictSchedule.subvenue}`}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="sui-space-y-2">
                  <p className="sui-font-medium sui-text-sm">Suggested alternatives:</p>
                  <div className="sui-space-y-2">
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedSuggestion({ venueId: suggestion.venueId, time: suggestion.time });
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
                    onResolveConflict?.(scheduleItem.id, selectedSuggestion.venueId, selectedSuggestion.time);
                    onClose();
                  }
                }}
              >
                Save
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
