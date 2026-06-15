"use client";

import { SimpleIcon } from "../SimpleIcon";
import { SimpleCheckbox } from "../SimpleCheckbox";
import type { ScheduleEvent } from "./ScheduleTab";

const eventTypeColors = {
  game: "sui-bg-green-50",
  practice: "sui-bg-orange-60",
  other: "sui-bg-skyblue-60",
};

interface UnscheduledTableProps {
  events: ScheduleEvent[];
  selectedEvents: Set<string>;
  onToggleSelection: (eventId: string) => void;
  onToggleSelectAll?: (checked: boolean) => void;
}

export function UnscheduledTable({
  events,
  selectedEvents,
  onToggleSelection,
  onToggleSelectAll,
}: UnscheduledTableProps) {
  const allSelected = events.length > 0 && selectedEvents.size === events.length;

  return (
    <div className="sui-relative sui-overflow-x-auto sui-border-l sui-border-r sui-border-b sui-border-neutral-border sui-bg-white sui-rounded-b-lg">
      <table className="sui-w-full sui-border-spacing-0 sui-border-separate sui-text-body-dense sui-min-w-[600px] sm:sui-min-w-[700px]" data-testid="unscheduled-table">
        <thead className="[&_th]:sui-border-b [&_th]:sui-border-solid [&_th]:sui-border-neutral-border [&_th]:sui-bg-neutral-background-weak">
          <tr className="sui-group/row">
            <th className="sui-p-2 sui-text-left sui-align-middle sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold sui-w-[40px]">
              <SimpleCheckbox
                checked={allSelected}
                onChange={(checked) => onToggleSelectAll?.(checked)}
              />
            </th>
            <th className="sui-p-2 sui-text-left sui-align-middle sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold sui-w-[120px] sm:sui-w-[20%]">
              <span className="hidden sm:inline">Date</span>
            </th>
            <th className="sui-p-2 sui-text-left sui-align-middle sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold">
              Team(s)
            </th>
            <th className="sui-p-2 sui-text-left sui-align-middle sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold sui-w-[60px] sm:sui-w-auto">
              Score
            </th>
            <th className="sui-p-2 sui-text-left sui-align-middle sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold sui-w-[70px] sm:sui-w-auto">
              Status
            </th>
            <th className="sui-p-2 sui-text-left sui-align-middle sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold">
              Venue
            </th>
            <th className="sui-p-2 sui-text-left sui-align-middle sui-text-label !sui-font-semibold sui-min-h-[44px] sui-font-bold sui-w-[60px]">
            </th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:sui-border-0 sui-body-dense">
          {events.map((event) => (
            <tr
              key={event.id}
              className="sui-group/row [&_td]:sui-border-b [&_td]:sui-border-solid [&_td]:sui-border-neutral-border hover:sui-bg-neutral-background-weak"
              data-testid={event.id}
            >
              <td className="sui-p-2 sui-w-[40px] sui-pr-0 sui-align-top">
                <SimpleCheckbox
                  checked={selectedEvents.has(event.id)}
                  onChange={() => onToggleSelection(event.id)}
                />
              </td>
              <td className="sui-p-2 sui-w-[120px] sm:sui-w-[20%] sui-align-top sui-pl-0">
                <span className="sui-text-xs sm:sui-text-sm sui-text-neutral-text-medium sui-italic">
                  No date
                </span>
              </td>
              <td className="sui-p-2 sui-align-top sui-py-0">
                <div className="sui-flex sui-gap-2 sui-py-2 sui-h-[70px] sui-items-center">
                  <span className={`sui-block sui-size-[12px] ${eventTypeColors[event.type]} sui-rounded-full sui-flex-shrink-0`} />
                  <div className="sui-h-full sui-flex sui-flex-col sui-justify-between sui-min-w-0">
                    <div className="sui-truncate sm:sui-truncate" title={event.name}>{event.name}</div>
                    <div className="sui-truncate sm:sui-truncate text-xs sm:text-sm sui-text-neutral-text-medium" title={event.team}>{event.team}</div>
                  </div>
                </div>
              </td>
              <td className="sui-p-2 sui-align-top sui-py-0 sui-w-[60px] sm:sui-w-auto">
                <div className="sui-flex sui-h-[70px] sui-py-2 sui-items-center sui-text-xs sm:sui-text-sm sui-text-neutral-text-medium">
                  —
                </div>
              </td>
              <td className="sui-p-2 sui-align-middle sui-w-[70px] sm:sui-w-auto">
                <span className="sui-text-xs sm:sui-text-sm sui-text-neutral-text-medium sui-italic">Unscheduled</span>
              </td>
              <td className="sui-p-2 sui-align-middle">
                <div className="sui-flex sui-items-center sui-gap-2 sui-min-w-0">
                  {!event.venue || event.venue === "TBD"
                    ? <span className="sui-text-xs sm:sui-text-sm sui-text-neutral-text-medium">TBD</span>
                    : <span className="sui-truncate text-xs sm:text-sm" title={event.venue}>{event.venue}</span>
                  }
                </div>
              </td>
              <td className="sui-p-2 sui-align-middle sui-pr-4 sui-w-[60px]">
                <div className="sui-flex sui-gap-1 sm:sui-gap-2 sui-items-center sui-justify-end">
                  <button className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent active:sui-scale-95 sui-text-admin-action-text hover:sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover active:sui-bg-admin-action-background-weak-pressed sui-h-[28px] sui-w-[28px] sm:sui-h-[32px] sm:sui-w-[32px] sui-min-w-[28px] sm:sui-min-w-[32px]" type="button">
                    <SimpleIcon name="edit" size="s" />
                  </button>
                  <button className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent active:sui-scale-95 sui-text-admin-action-text hover:sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover active:sui-bg-admin-action-background-weak-pressed sui-h-[28px] sui-w-[28px] sm:sui-h-[32px] sm:sui-w-[32px] sui-min-w-[28px] sm:sui-min-w-[32px]" type="button">
                    <SimpleIcon name="chevron_right" size="s" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {events.length === 0 && (
            <tr>
              <td colSpan={7} className="sui-p-4 sui-text-center sui-text-neutral-text-medium">
                No unscheduled events found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
