import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { cn } from "../../../utils";
import Calendar from "../../Calendar/Calendar";
import LabelButton from "../../LabelButton/LabelButton";
import TimePicker from "./TimePicker";

interface Props {
  dateValue: Date | null;
  showFooter: boolean;
  onChange: (date: Date | null) => void;
  onCaptureAction?: (action: "apply" | "cancel") => void;
  setOpenPopover: (open: boolean) => void;
  setDateValue: (date: Date | null) => void;
  calendarProps?: React.ComponentProps<typeof Calendar>;
  defaultDate?: Date;
  isVertical?: boolean;
}

type ViewMode = "calendar" | "months" | "years";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function DateTimePickerPopoverContent({
  dateValue,
  showFooter,
  onChange,
  onCaptureAction,
  setOpenPopover,
  setDateValue,
  calendarProps,
  defaultDate,
  isVertical,
}: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [viewDate, setViewDate] = useState<Date>(dateValue || defaultDate || new Date());

  // Refs for month and year pickers
  const monthRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const yearRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const yearContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to selected month when month picker opens
  // Scroll to selected year when year picker opens
  useEffect(() => {
    if (viewMode === "months") {
      const selectedMonth = viewDate.getMonth();
      if (monthRefs.current[selectedMonth]) {
        monthRefs.current[selectedMonth]?.scrollIntoView({
          behavior: "auto",
          block: "nearest",
        });
      }
    } else if (viewMode === "years") {
      const currentYear = viewDate.getFullYear();
      const startYear = currentYear - 50;
      const selectedYearIndex = currentYear - startYear;
      if (yearRefs.current[selectedYearIndex]) {
        yearRefs.current[selectedYearIndex]?.scrollIntoView({
          behavior: "auto",
          block: "nearest",
        });
      }
    }
  }, [viewMode, viewDate]);

  function onApplyChanges(date?: Date | null) {
    setOpenPopover(false);
    if (onChange) {
      onChange(date ?? dateValue);
      onCaptureAction?.("apply");
    }
  }

  function onCancel() {
    setOpenPopover(false);
    onCaptureAction?.("cancel");
  }

  const handleDateChange = (selectedDate: Date | null) => {
    if (!selectedDate) {
      setDateValue(selectedDate);
      if (showFooter) return;
      onChange?.(selectedDate);
      return;
    }

    // If we have an existing dateValue, preserve the time
    if (dateValue) {
      const newDate = new Date(selectedDate);
      newDate.setHours(dateValue.getHours());
      newDate.setMinutes(dateValue.getMinutes());
      newDate.setSeconds(dateValue.getSeconds());
      setDateValue(newDate);
      if (showFooter) return;
      onChange?.(newDate);
    } else {
      // If no existing value, set to current time
      const now = new Date();
      selectedDate.setHours(now.getHours());
      selectedDate.setMinutes(now.getMinutes());
      selectedDate.setSeconds(now.getSeconds());
      setDateValue(selectedDate);
      if (showFooter) return;
      onChange?.(selectedDate);
    }
  };

  const handleTimeChange = (updatedDate: Date) => {
    // If no date selected yet, use today's date with the selected time
    if (!dateValue) {
      const today = new Date();
      today.setHours(updatedDate.getHours());
      today.setMinutes(updatedDate.getMinutes());
      today.setSeconds(updatedDate.getSeconds());
      setDateValue(today);
      if (showFooter) return;
      onChange?.(today);
    } else {
      setDateValue(updatedDate);
      if (showFooter) return;
      onChange?.(updatedDate);
    }
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(monthIndex);
    setViewDate(newDate);
    setViewMode("calendar");
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(viewDate);
    newDate.setFullYear(year);
    setViewDate(newDate);
    setViewMode("calendar");
  };

  const renderMonthPicker = () => {
    const selectedMonth = viewDate.getMonth();

    return (
      <div className="sui-p-4">
        <div className={cn("sui-grid sui-gap-2", isVertical ? "sui-grid-cols-2" : "sui-grid-cols-3")}>
          {months.map((month, index) => {
            const isSelected = index === selectedMonth;
            return (
              <button
                key={month}
                ref={(el) => { monthRefs.current[index] = el; }}
                onClick={() => handleMonthSelect(index)}
                className={cn(
                  "sui-rounded sui-px-4 sui-py-2 hover:sui-bg-neutral-background",
                  isSelected && "sui-bg-action-background sui-text-white hover:sui-bg-action-background-hover"
                )}
              >
                {month}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderYearPicker = () => {
    const currentYear = viewDate.getFullYear();
    const startYear = currentYear - 50;
    const years = Array.from({ length: 100 }, (_, i) => startYear + i);

    return (
      <div ref={yearContainerRef} className="sui-p-4 sui-max-h-[300px] sui-overflow-y-auto">
        <div className={cn("sui-grid sui-gap-2, ", isVertical ? "sui-grid-cols-2" : "sui-grid-cols-4")}>
          {years.map((year, index) => {
            const isSelected = year === currentYear;
            return (
              <button
                key={year}
                ref={(el) => { yearRefs.current[index] = el; }}
                onClick={() => handleYearSelect(year)}
                className={cn(
                  "sui-rounded sui-px-4 sui-py-2 hover:sui-bg-neutral-background",
                  isSelected && "sui-bg-action-background sui-text-white hover:sui-bg-action-background-hover"
                )}
              >
                {year}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (viewMode) {
      case "months":
        return renderMonthPicker();
      case "years":
        return renderYearPicker();
      case "calendar":
      default:
        return (
          <div className={cn("sui-flex sui-gap-3 sui-items-center sui-p-2", isVertical && "sui-flex-col")}>
            <Calendar
              selected={dateValue ?? undefined}
              onChange={handleDateChange}
              onMonthClick={() => setViewMode("months")}
              onYearClick={() => setViewMode("years")}
              openToDate={viewDate}
              {...calendarProps}
            />
            <div className="sui-flex sui-flex-col sui-justify-start">
              <TimePicker
                value={dateValue || defaultDate || new Date()}
                onChange={handleTimeChange}
                className="sui-w-full"
                isVertical={isVertical}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="sui-flex sui-w-full sui-flex-col">
      {renderContent()}
      {showFooter && (
        <div className="sui-flex sui-w-full sui-justify-end sui-gap-1 sui-border-t sui-border-solid sui-border-neutral-border sui-py-2 sui-px-3">
          <LabelButton variantType="secondary" onClick={onCancel}>
            Cancel
          </LabelButton>
          <LabelButton variantType="primary" onClick={() => onApplyChanges()}>
            Apply
          </LabelButton>
        </div>
      )}
    </div>
  );
}
