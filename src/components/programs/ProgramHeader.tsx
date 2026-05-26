"use client";

import { SimpleIcon } from "../SimpleIcon";
import { SimpleLabelButton } from "../SimpleLabelButton";
import Status from "../Status/Status";

interface ProgramHeaderProps {
  programName: string;
  status: "active" | "past" | "upcoming";
  startDate: string;
  endDate: string;
  onEdit?: () => void;
  onArchive?: () => void;
  onRostering?: () => void;
}

const statusStateMap: Record<string, "success" | "warning" | "negative" | "inactive" | "info"> = {
  active: "success",
  past: "inactive",
  upcoming: "info",
};

const statusLabelMap: Record<string, string> = {
  active: "Active",
  past: "Past",
  upcoming: "Upcoming",
};

export function ProgramHeader({
  programName,
  status,
  startDate,
  endDate,
  onEdit,
  onArchive,
  onRostering,
}: ProgramHeaderProps) {
  return (
    <header className="sui-mb-3 sui-flex sui-flex-col sui-gap-2 sui-justify-between md:sui-flex-row">
      <div>
        <h1 className="sui-heading-lg sui-mr-2 sui-font-medium sui-mb-2" data-testid="program-name-header">
          {programName}
        </h1>
        <div className="sui-flex sui-gap-2">
          <Status state={statusStateMap[status]} text={statusLabelMap[status]} data-testid="program-status" />
          <p className="sui-flex sui-items-center sui-label sui-gap-0.5 sui-text-neutral-text-medium">
            <SimpleIcon name="calendar_today" size="s" />
            {startDate} - {endDate}
          </p>
        </div>
      </div>
      <div className="sui-flex sui-gap-1 sui-items-center">
        <button
          onClick={onArchive}
          className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-h-[48px] sui-w-[48px] sui-min-w-[48px] sui-text-neutral-icon-disabled hover:sui-border-transparent hover:sui-bg-transparent hover:sui-text-neutral-icon-disabled active:sui-scale-100 active:sui-bg-transparent sui-bg-white disabled:sui-border-neutral-border-disabled disabled:sui-bg-white sui-border-admin-action-border"
          type="button"
          aria-label="Archive program"
          data-testid="icon-button-component"
          disabled
        >
          <SimpleIcon name="archive" size="s" />
        </button>
        <SimpleLabelButton
          type="secondary"
          onClick={onRostering}
          label="Rostering"
          dataTestId="label-button-component"
        />
        <SimpleLabelButton
          type="primary"
          onClick={onEdit}
          label="Edit program"
          dataTestId="edit-program-button"
        />
      </div>
    </header>
  );
}
