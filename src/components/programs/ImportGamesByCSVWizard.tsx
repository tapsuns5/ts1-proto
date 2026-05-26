"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "../Dialog/Dialog";
import { DropdownMenuItem } from "../DropdownMenu/DropdownMenu";
import { SimpleLabelButton } from "../SimpleLabelButton";
import { SimpleIcon } from "../SimpleIcon";

export default function ImportGamesByCSVWizard() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOnOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(event) => event.preventDefault()}
          data-testid="import-games-csv-button"
        >
          <SimpleIcon name="upload" size="s" />
          Import games by CSV
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Import Games by CSV</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="sui-body sui-mb-4">
            Upload a CSV file to import games in bulk.
          </p>
          <div className="sui-flex sui-flex-col sui-gap-4">
            <div className="sui-border-2 sui-border-dashed sui-border-neutral-border sui-rounded-lg sui-p-8 sui-text-center">
              <SimpleIcon name="upload" size="l" className="sui-text-neutral-icon-medium sui-mb-2" />
              <p className="sui-body sui-mb-2">Drag and drop your CSV file here</p>
              <p className="sui-caption sui-text-neutral-text-weak sui-mb-4">or</p>
              <button className="sui-px-4 sui-py-2 sui-bg-white sui-border sui-border-neutral-border sui-rounded hover:sui-border-action-border-hover sui-cursor-pointer">
                Browse files
              </button>
            </div>
            <div className="sui-bg-neutral-background-weak sui-rounded sui-p-3">
              <p className="sui-label sui-mb-2">CSV format requirements:</p>
              <ul className="sui-body sui-list-disc sui-pl-4 sui-space-y-1">
                <li>Include columns: Date, Time, Team 1, Team 2, Venue</li>
                <li>Date format: MM/DD/YYYY</li>
                <li>Time format: HH:MM AM/PM</li>
              </ul>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <SimpleLabelButton type="secondary" label="Cancel" />
          </DialogClose>
          <SimpleLabelButton type="primary" label="Import" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
