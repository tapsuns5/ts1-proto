import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "../../../utils";
import Calendar from "../../Calendar/Calendar";
import IconButton from "../../IconButton/IconButton";

type Props = {
  startDate: Date | null;
  endDate: Date | null;
  calendarProps?: [
    React.ComponentProps<typeof Calendar>,
    React.ComponentProps<typeof Calendar>,
  ];
  onChange?: (date: [Date | null, Date | null] | null) => void;
  setDateSelected?: (d: "start" | "end") => void;
  isVertical?: boolean;
};

// Get the first day of a month
const getMonthStart = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), 1);

// Check if two dates are in the same month
const isSameMonth = (a: Date | null, b: Date | null): boolean => {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
};

export function DateRangePicker({
  startDate,
  endDate,
  calendarProps,
  setDateSelected,
  onChange,
  isVertical,
}: Props) {
  // Determine initial month: prefer startDate, then endDate-1, then current month
  const getInitialMonth = useCallback((): Date => {
    if (startDate) return getMonthStart(startDate);
    if (endDate) return getMonthStart(new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1));
    return getMonthStart(new Date());
  }, [startDate, endDate]);

  const [displayedMonth, setDisplayedMonth] = useState<Date>(getInitialMonth);

  // Sync displayed month when startDate changes to a different month (e.g., preset selection)
  // Only sync if the new startDate is in a different month than currently displayed
  useEffect(() => {
    if (startDate) {
      setDisplayedMonth((prev) => {
        if (isSameMonth(startDate, prev)) return prev;
        return getMonthStart(startDate);
      });
    }
  }, [startDate?.getTime()]);

  // Calculate the next consecutive month for the right calendar
  const nextMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1, 1);

  // Navigation: shift both calendars by two months (since we show 2 months at a time)
  const goToPreviousMonth = () => {
    setDisplayedMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 2, 1));
  };

  const goToNextMonth = () => {
    setDisplayedMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 2, 1));
  };

  // Smart date selection:
  // - First click: sets start date
  // - Second click: sets end date (auto-swaps if before start)
  // - Subsequent clicks: resets to new start date
  const handleDateSelect = (date: Date | null) => {
    if (!date) return;

    if (!startDate) {
      // No start date yet - set it
      onChange?.([date, null]);
      setDateSelected?.("start");
    } else if (!endDate) {
      // Have start but no end - set end (swap if needed)
      const [start, end] = date < startDate ? [date, startDate] : [startDate, date];
      onChange?.([start, end]);
      setDateSelected?.("end");
    } else {
      // Both dates set - reset with new start
      onChange?.([date, null]);
      setDateSelected?.("start");
    }
  };

  return (
    <div className={cn(
      "sui-flex sui-gap-3 sui-relative",
      isVertical ? "sui-flex-col sui-items-center" : "sui-flex-row sui-items-start"
    )}>
      <Calendar
        {...calendarProps?.[0]}
        key={`left-${displayedMonth.getFullYear()}-${displayedMonth.getMonth()}`}
        openToDate={displayedMonth}
        hideNavigation={true}
        onChange={handleDateSelect}
        data-testid="snap-ui-calendar-range-start"
        renderDayContents={(day, date) =>
          renderDayContents(
            day,
            date,
            startDate ?? undefined,
            endDate ?? undefined,
            isVertical ? "top" : "left",
            displayedMonth,
          )
        }
      />

      <Calendar
        {...calendarProps?.[1]}
        key={`right-${nextMonth.getFullYear()}-${nextMonth.getMonth()}`}
        openToDate={nextMonth}
        hideNavigation={true}
        onChange={handleDateSelect}
        data-testid="snap-ui-calendar-range-end"
        renderDayContents={(day, date) =>
          renderDayContents(
            day,
            date,
            startDate ?? undefined,
            endDate ?? undefined,
            isVertical ? "bottom" : "right",
            nextMonth,
          )
        }
      />

      <IconButton
        icon="keyboard_arrow_left"
        variant="neutral"
        size="compact"
        onClick={goToPreviousMonth}
        data-testid="snap-ui-daterangepicker-prev-month-button"
        className="sui-absolute sui-top-0 sui-left-0"
      />

      <IconButton
        icon="keyboard_arrow_right"
        variant="neutral"
        size="compact"
        onClick={goToNextMonth}
        data-testid="snap-ui-daterangepicker-next-month-button"
        className="sui-absolute sui-top-0 sui-right-0"
      />
    </div>
  );
}

// Check if a date falls within the start-end range (inclusive)
const isInRange = (
  date: Date,
  start: Date | null | undefined,
  end: Date | null | undefined,
): boolean => {
  if (!start || !end) return false;
  // Normalize to start of day without mutating original dates
  const normalizeDate = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const dateTime = normalizeDate(date);
  return dateTime >= normalizeDate(start) && dateTime <= normalizeDate(end);
};

// Get the last day of a month
const getLastDayOfMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

/**
 * Behaviors:
 * - Highlight the start date and end date with a blue circle
 * - Highlight the range between the start date and end date with a light blue background
 * - Make sure that the start/end days continue the light blue background only until their centers
 */
const renderDayContents = (
  day: number,
  date: Date,
  startDate: Date | undefined,
  endDate: Date | undefined,
  calendarPosition: "left" | "right" | "top" | "bottom",
  displayedMonth: Date,
) => {
  const isStartDate = date.toDateString() === startDate?.toDateString();
  const isEndDate = date.toDateString() === endDate?.toDateString();
  const inRange = isInRange(date, startDate, endDate);

  // Check if range spans across calendars
  const lastDayOfMonth = getLastDayOfMonth(displayedMonth);
  const isLastDayOfMonth = day === lastDayOfMonth;
  const isFirstDayOfMonth = day === 1;

  // Determine if this is the first or second calendar (works for both horizontal and vertical)
  const isFirstCalendar = calendarPosition === "left" || calendarPosition === "top";
  const isSecondCalendar = calendarPosition === "right" || calendarPosition === "bottom";

  // Determine if we need gradient effects at calendar edges
  // First calendar (left/top): fade right on last day if range continues to next month
  const showRightGradient =
    isFirstCalendar &&
    isLastDayOfMonth &&
    inRange &&
    !isEndDate &&
    endDate &&
    (endDate.getMonth() > displayedMonth.getMonth() ||
      endDate.getFullYear() > displayedMonth.getFullYear());

  // Second calendar (right/bottom): fade left on first day if range started in previous month
  const showLeftGradient =
    isSecondCalendar &&
    isFirstDayOfMonth &&
    inRange &&
    !isStartDate &&
    startDate &&
    (startDate.getMonth() < displayedMonth.getMonth() ||
      startDate.getFullYear() < displayedMonth.getFullYear());

  // Styles for the background of the range
  const rangeBackgroundStyle = {
    ...(isStartDate && { right: "0" }),
    ...(isEndDate && { left: "0" }),
  };

  // Classnames for the range background
  const rangeBackgroundClass = cn(
    "sui-absolute sui-left-0 sui-top-0 sui-z-0 sui-h-full sui-w-full",
    "sui-bg-blue-2/50",
    {
      "sui-rounded-l-full": isStartDate,
      "sui-rounded-r-full": isEndDate,
    },
  );

  // Classnames for the day circle (start or end date) - both are blue
  const dayCircleClass = cn(
    "sui-z-10 sui-flex sui-h-[40px] sui-w-[40px] sui-items-center sui-justify-center sui-rounded-[50%]",
    (isStartDate || isEndDate) && "sui-bg-admin-action-background sui-text-white",
  );

  // Classnames for the selected day
  const defaultDayClass = "sui-z-10";

  return (
    <div
      className={
        "sui-relative sui-flex sui-h-[32px] sui-w-[40px] sui-items-center sui-justify-center"
      }
    >
      {inRange && (
        <div style={rangeBackgroundStyle} className={rangeBackgroundClass} />
      )}
      {showRightGradient && (
        <div
          className="sui-absolute sui-right-0 sui-top-0 sui-z-[1] sui-h-full sui-w-1/2 sui-bg-gradient-to-r sui-from-transparent sui-to-white"
        />
      )}
      {showLeftGradient && (
        <div
          className="sui-absolute sui-left-0 sui-top-0 sui-z-[1] sui-h-full sui-w-1/2 sui-bg-gradient-to-l sui-from-transparent sui-to-white"
        />
      )}
      {isStartDate || isEndDate ? (
        <div className={dayCircleClass}>{day}</div>
      ) : (
        <div className={defaultDayClass}>{day}</div>
      )}
    </div>
  );
};
