"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "../AlertDialog/AlertDialog";
import { SimpleLabelButton } from "../SimpleLabelButton";

interface BulkEditDialogProps {
  open: boolean;
  onClose: () => void;
  selectedEventsCount: number;
}

export default function BulkEditDialog({ open, onClose, selectedEventsCount }: BulkEditDialogProps) {
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [status, setStatus] = useState("");

  const handleApply = () => {
    // In a real implementation, this would call an API to update the events
    console.log("Bulk edit applied:", {
      date,
      venue,
      status,
      selectedCount: selectedEventsCount,
    });

    // Reset form and close
    setDate("");
    setVenue("");
    setStatus("");
    onClose();
  };

  return (
    <AlertDialog open={open} onOpenChange={(val) => !val && onClose()}>
      <AlertDialogContent showCloseButton={true} className="sui-max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Bulk Edit {selectedEventsCount} Events
          </AlertDialogTitle>
          <AlertDialogDescription>
            Leave a field blank to keep the existing value for that field.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="sui-flex sui-flex-col sui-gap-4 sui-py-4">
          {/* Date */}
          <div className="sui-flex sui-flex-col sui-gap-2">
            <label className="sui-text-label sui-font-semibold">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="sui-w-full sui-px-3 sui-py-2 sui-border sui-border-neutral-border sui-rounded-full sui-text-body focus:outline-none focus:ring-2 focus:ring-admin-action-border focus:border-transparent"
            />
          </div>

          {/* Venue */}
          <div className="sui-flex sui-flex-col sui-gap-2">
            <label className="sui-text-label sui-font-semibold">Venue</label>
            <select
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="sui-w-full sui-px-3 sui-py-2 sui-border sui-border-neutral-border sui-rounded-full sui-text-body focus:outline-none focus:ring-2 focus:ring-admin-action-border focus:border-transparent"
            >
              <option value="">-- Keep existing --</option>
              <option value="main-stadium">Main Stadium</option>
              <option value="field-a">Field A</option>
              <option value="field-b">Field B</option>
              <option value="field-c">Field C</option>
              <option value="gym">Gymnasium</option>
              <option value="practice-field">Practice Field</option>
              <option value="community-center">Community Center</option>
            </select>
          </div>

          {/* Status */}
          <div className="sui-flex sui-flex-col sui-gap-2">
            <label className="sui-text-label sui-font-semibold">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="sui-w-full sui-px-3 sui-py-2 sui-border sui-border-neutral-border sui-rounded-full sui-text-body focus:outline-none focus:ring-2 focus:ring-admin-action-border focus:border-transparent"
            >
              <option value="">-- Keep existing --</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="canceled">Cancelled</option>
            </select>
          </div>
        </div>

        <AlertDialogFooter>
          <SimpleLabelButton
            type="secondary"
            label="Cancel"
            onClick={onClose}
          />
          <SimpleLabelButton
            type="primary"
            label="Apply Changes"
            onClick={handleApply}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
