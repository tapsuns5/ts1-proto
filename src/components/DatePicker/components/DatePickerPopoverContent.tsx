import * as React from "react";
import { cn } from "../../../utils";
import Calendar from "../../Calendar/Calendar";
import LabelButton from "../../LabelButton/LabelButton";
import type { DatePickerProps, DateRangePreset } from "../DatePicker.types";
import { ACTION, ACTION_ID, createDateString, getDateRange } from "../utils";
import { DateRangeFixedPresets } from "./DateRangeFixedPresets";
import { DateRangeHorizontalPresets } from "./DateRangeHorizontalPresets";
import { DateRangePicker } from "./DateRangePicker";

interface Props {
  range: boolean;
  calendarProps:
    | [
        React.ComponentProps<typeof Calendar>,
        React.ComponentProps<typeof Calendar>?,
      ]
    | React.ComponentProps<typeof Calendar>;
  showFooter: boolean;
  fixedDatesShortcut?: boolean;
  fixedDatesList?: DateRangePreset[];
  dateValue: DatePickerProps["value"];
  onChange: (date: Date | [Date, Date]) => void;
  onCaptureAction?: (...args: any[]) => void;
  setOpenPopover: (open: boolean) => void;
  setDateValue: (date: DatePickerProps["value"]) => void;
  setDateSelected: (val: "start" | "end" | undefined) => void;
  isVertical?: boolean;
}

export function DatePickerPopoverContent({
  range,
  calendarProps,
  showFooter,
  fixedDatesShortcut,
  fixedDatesList,
  dateValue,
  onChange,
  onCaptureAction,
  setOpenPopover,
  setDateValue,
  setDateSelected,
  isVertical,
}: Props) {
  const rangeStart = Array.isArray(dateValue) ? dateValue[0] : undefined;
  const rangeEnd = Array.isArray(dateValue) ? dateValue[1] : undefined;

  function onApplyChanges(date?: Date | [Date, Date]) {
    setOpenPopover(false);
    if (onChange) {
      const newValue = date || (dateValue as any);
      if (range && !newValue[0] && newValue[1]) {
        return;
      }
      onChange(newValue);
      onCaptureAction?.(ACTION.CLICK, ACTION_ID.CUSTOM_RANGE, dateValue as any);
    }
  }

  function onSelectFixedDate(
    date: Exclude<ACTION_ID, ACTION_ID.CUSTOM_RANGE | ACTION_ID.SINGLE>,
  ) {
    if (!range) return;
    setOpenPopover(false);
    const valueToSet = getDateRange(date);
    showFooter ? setDateValue(valueToSet) : onApplyChanges(valueToSet);
    onCaptureAction?.(ACTION.CLICK, date, valueToSet);
  }

  function onSelectCustomPresetDate(label: string) {
    const datePreset = fixedDatesList?.find((d) => d.label === label);
    if (datePreset) {
      const dateRange: [Date, Date] = [
        new Date(datePreset.startDate),
        new Date(datePreset.endDate),
      ];
      range &&
        (showFooter ? setDateValue(dateRange) : onApplyChanges(dateRange));
      range &&
        onCaptureAction?.(ACTION.CLICK, ACTION_ID.CUSTOM_RANGE, dateRange);
    }
  }
  return (
    <div className={cn(
      "sui-flex sui-flex-col",
      isVertical && "sui-w-[320px] sui-items-center"
    )}>
      {fixedDatesShortcut && isVertical && (
        <DateRangeHorizontalPresets
          customPresets={fixedDatesList}
          onSelectFixedDate={onSelectFixedDate}
          onSelectCustomDate={onSelectCustomPresetDate}
        />
      )}
      <div className="sui-flex sui-flex-row">
        {fixedDatesShortcut && !isVertical && (
          <DateRangeFixedPresets
            customPresets={fixedDatesList}
            onSelectFixedDate={onSelectFixedDate}
            onSelectCustomDate={onSelectCustomPresetDate}
          />
        )}
        <div className={cn(
          "sui-flex sui-flex-col sui-gap-2 sui-p-1",
          isVertical && "sui-items-center"
        )}>
          {!range && (
            <Calendar
              selected={dateValue as Date}
              onChange={(date) => {
                setDateValue?.(date);
                (
                  onCaptureAction as (
                    action: ACTION,
                    name: ACTION_ID,
                    date?: Date,
                  ) => void
                )?.(ACTION.CLICK, ACTION_ID.SINGLE, date ?? undefined);
                !showFooter && onApplyChanges(date ?? undefined);
              }}
              {...calendarProps}
            />
          )}
          {range && (
            <DateRangePicker
              // TODO: Check if can remove the `as Date` cast
              startDate={rangeStart as Date}
              endDate={rangeEnd as Date}
              setDateSelected={setDateSelected}
              isVertical={isVertical}
              calendarProps={
                calendarProps as [
                  React.ComponentProps<typeof Calendar>,
                  React.ComponentProps<typeof Calendar>,
                ]
              }
              onChange={(dates) => {
                const safeDates = Array.isArray(dates)
                  ? [dates[0] ?? undefined, dates[1] ?? undefined]
                  : dates;
                setDateValue(safeDates as [Date | undefined, Date | undefined]);
                onCaptureAction?.(
                  ACTION.CLICK,
                  ACTION_ID.CUSTOM_RANGE,
                  safeDates,
                );
                !showFooter &&
                  Array.isArray(safeDates) &&
                  safeDates?.[0] &&
                  safeDates?.[1] &&
                  onApplyChanges(safeDates as [Date, Date]);
              }}
            />
          )}
          {showFooter && (
            <div className={cn(
              "sui-flex sui-w-full sui-border-t sui-border-solid sui-border-gray-90 sui-pt-1",
              isVertical ? "sui-flex-col sui-gap-2" : "sui-flex-row sui-justify-between"
            )}>
              <span
                className={cn(
                  "sui-content-center sui-text-desktop-3 sui-text-gray-40/100",
                  !range && "sui-invisible",
                )}
              >
                {`Range: ${rangeStart ? createDateString(rangeStart) : "--"} - ${rangeEnd ? createDateString(rangeEnd) : "--"}`}
              </span>
              <div className={cn(
                "sui-flex sui-gap-1",
                isVertical && "sui-w-full"
              )}>
                <LabelButton
                  variantType="secondary"
                  className={isVertical ? "sui-flex-1" : undefined}
                  onClick={() => {
                    setOpenPopover(false);
                    onCaptureAction?.(ACTION.CLICK, ACTION_ID.CANCEL);
                  }}
                >
                  Cancel
                </LabelButton>
                <LabelButton
                  variantType="primary"
                  className={isVertical ? "sui-flex-1" : undefined}
                  onClick={() => onApplyChanges()}
                >
                  Apply
                </LabelButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
