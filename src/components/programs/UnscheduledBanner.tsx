"use client";

import { SimpleIcon } from "../SimpleIcon";
import LabelButton from "../LabelButton/LabelButton";

interface UnscheduledBannerProps {
  count: number;
  isShowingUnscheduled: boolean;
  onToggle: () => void;
}

export function UnscheduledBanner({
  count,
  isShowingUnscheduled,
  onToggle,
}: UnscheduledBannerProps) {
  const message = isShowingUnscheduled
    ? `Showing ${count} event${count === 1 ? "" : "s"} with no date assigned.`
    : `${count} event${count === 1 ? "" : "s"} have no date assigned and won't appear in this view.`;

  const buttonLabel = isShowingUnscheduled
    ? "Back to schedule"
    : "View unscheduled";

  return (
    <div className="sui-flex sui-items-center sui-justify-between sui-px-3 sui-py-2.5 sui-bg-[#dbeafe] sui-border sui-border-solid sui-border-[#bfdbfe] sui-rounded-lg sui-mb-3">
      <div className="sui-flex sui-items-center sui-gap-2 sui-text-sm sui-text-[#1447e6] sui-min-w-0">
        <SimpleIcon name="event_busy" size="s" className="sui-flex-shrink-0" />
        <span className="sui-truncate">{message}</span>
      </div>
      <LabelButton
        size="small"
        variantType="secondary"
        labelText={buttonLabel}
        onClick={onToggle}
        className="sui-flex-shrink-0 sui-ml-4 sui-whitespace-nowrap !sui-border-[#1447e6] !sui-text-[#1447e6] sui-bg-white"
      />
    </div>
  );
}
