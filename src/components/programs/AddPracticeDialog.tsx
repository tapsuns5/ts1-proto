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
import Label from "../Label/Label";
import Input from "../Input/Input";
import Select from "../Select/Select";

export default function AddPracticeDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOnOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
      <DialogTrigger asChild data-testid="add-practice-button">
        <DropdownMenuItem
          onSelect={(event) => event.preventDefault()}
          data-testid="add-practice-button"
        >
          Add practice
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Add Practice</DialogTitle>
        </DialogHeader>
        <DialogBody className="sui-grid sui-gap-1">
          <fieldset>
            <Label htmlFor="add-practice-team" required>
              Team
            </Label>
            <Select
              id="add-practice-team"
              name="team"
              placeholder="Select team..."
              options={[
                { value: 'eagles', label: 'Eagles' },
                { value: 'tigers', label: 'Tigers' },
                { value: 'lions', label: 'Lions' },
              ]}
              size="small"
            />
          </fieldset>
          <fieldset>
            <Label htmlFor="add-practice-date" required>
              Date
            </Label>
            <Input
              id="add-practice-date"
              name="date"
              type="date"
              placeholder="mm/dd/yyyy"
              size="small"
            />
          </fieldset>
          <fieldset>
            <Label htmlFor="add-practice-time" required>
              Time
            </Label>
            <Select
              id="add-practice-time"
              name="time"
              placeholder="Select time..."
              options={[
                { value: '8:00 AM', label: '8:00 AM' },
                { value: '9:00 AM', label: '9:00 AM' },
                { value: '10:00 AM', label: '10:00 AM' },
                { value: '11:00 AM', label: '11:00 AM' },
                { value: '12:00 PM', label: '12:00 PM' },
                { value: '1:00 PM', label: '1:00 PM' },
                { value: '2:00 PM', label: '2:00 PM' },
                { value: '3:00 PM', label: '3:00 PM' },
                { value: '4:00 PM', label: '4:00 PM' },
                { value: '5:00 PM', label: '5:00 PM' },
                { value: '6:00 PM', label: '6:00 PM' },
                { value: '7:00 PM', label: '7:00 PM' },
                { value: '8:00 PM', label: '8:00 PM' },
              ]}
              size="small"
            />
          </fieldset>
          <fieldset>
            <Label htmlFor="add-practice-venue" required>
              Venue
            </Label>
            <Select
              id="add-practice-venue"
              name="venue"
              placeholder="Select venue..."
              options={[
                { value: 'main-stadium', label: 'Main Stadium' },
                { value: 'field-a', label: 'Field A' },
                { value: 'field-b', label: 'Field B' },
              ]}
              size="small"
            />
          </fieldset>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <SimpleLabelButton type="secondary" label="Cancel" />
          </DialogClose>
          <SimpleLabelButton type="primary" label="Add" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
