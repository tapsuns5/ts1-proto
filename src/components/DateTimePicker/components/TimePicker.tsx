import * as React from "react";
import { cn } from "../../../utils";
import { get12Hour, getPeriod, to24Hour } from "../utils";
import classes from "../DateTimePicker.module.scss";

type TimePickerProps = {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
  isVertical?: boolean;
};

const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
  ({ value, onChange, className, isVertical }, ref) => {
    const hours12 = get12Hour(value.getHours());
    const minutes = value.getMinutes();
    const period = getPeriod(value.getHours());

    const hourRef = React.useRef<HTMLDivElement>(null);
    const minuteRef = React.useRef<HTMLDivElement>(null);
    const periodRef = React.useRef<HTMLDivElement>(null);

    // Refs for individual option elements
    const hourRefs = React.useRef<(HTMLDivElement | null)[]>([]);
    const minuteRefs = React.useRef<(HTMLDivElement | null)[]>([]);
    const periodRefs = React.useRef<(HTMLDivElement | null)[]>([]);

    // Generate hour options (1-12)
    const hourOptions = Array.from({ length: 12 }, (_, i) => i + 1);

    // Generate minute options (0-59)
    const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

    const periodOptions: ("AM" | "PM")[] = ["AM", "PM"];

    const handleHourChange = (hour: number) => {
      const newDate = new Date(value);
      newDate.setHours(to24Hour(hour, period));
      onChange(newDate);
    };

    const handleMinuteChange = (minute: number) => {
      const newDate = new Date(value);
      newDate.setMinutes(minute);
      onChange(newDate);
    };

    const handlePeriodChange = (newPeriod: "AM" | "PM") => {
      const newDate = new Date(value);
      newDate.setHours(to24Hour(hours12, newPeriod));
      onChange(newDate);
    };

    // Scroll to selected items when values change
    React.useEffect(() => {
      // Scroll to selected hour
      const selectedHourIndex = hours12 - 1;
      if (hourRefs.current[selectedHourIndex]) {
        hourRefs.current[selectedHourIndex]?.scrollIntoView({
          behavior: "auto",
          block: "nearest",
        });
      }

      // Scroll to selected minute
      if (minuteRefs.current[minutes]) {
        minuteRefs.current[minutes]?.scrollIntoView({
          behavior: "auto",
          block: "nearest",
        });
      }

      // Scroll to selected period
      const selectedPeriodIndex = period === "AM" ? 0 : 1;
      if (periodRefs.current[selectedPeriodIndex]) {
        periodRefs.current[selectedPeriodIndex]?.scrollIntoView({
          behavior: "auto",
          block: "nearest",
        });
      }
    }, [hours12, minutes, period]);

    return (
      <div
        ref={ref}
        className={cn("sui-flex sui-gap-0.5", className)}
      >
        {/* Hours Column */}
        <TimeColumn
          ref={hourRef}
          options={hourOptions}
          selectedValue={hours12}
          onChange={handleHourChange}
          formatValue={(h) => String(h).padStart(2, "0")}
          ariaLabel="Select hour"
          isVertical={isVertical}
          optionRefs={hourRefs}
        />

        {/* Minutes Column */}
        <TimeColumn
          ref={minuteRef}
          options={minuteOptions}
          selectedValue={minutes}
          onChange={handleMinuteChange}
          formatValue={(m) => String(m).padStart(2, "0")}
          ariaLabel="Select minute"
          isVertical={isVertical}
          optionRefs={minuteRefs}
        />

        {/* Period Column */}
        <TimeColumn
          ref={periodRef}
          options={periodOptions}
          selectedValue={period}
          onChange={handlePeriodChange}
          formatValue={(p) => p}
          ariaLabel="Select period"
          isVertical={isVertical}
          optionRefs={periodRefs}
        />
      </div>
    );
  },
);

TimePicker.displayName = "TimePicker";

type TimeColumnProps<T> = {
  options: T[];
  selectedValue: T;
  onChange: (value: T) => void;
  formatValue: (value: T) => string;
  ariaLabel: string;
  isVertical?: boolean;
  optionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
};

const TimeColumn = React.forwardRef<HTMLDivElement, TimeColumnProps<any>>(
  ({ options, selectedValue, onChange, formatValue, ariaLabel, isVertical, optionRefs }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          classes["TimeColumn"],
          "sui-flex-1 sui-overflow-y-auto sui-rounded-lg sui-border sui-border-solid sui-border-neutral-border sui-bg-white",
        )}
        style={{ minWidth: isVertical ? "90px" : "60px", height: isVertical ? "120px"  : "280px" }}
        role="listbox"
        aria-label={ariaLabel}
      >
        {options.map((option, index) => {
          const isSelected = option === selectedValue;
          return (
            <div
              key={option}
              ref={(el) => { optionRefs.current[index] = el; }}
              role="option"
              aria-selected={isSelected}
              onClick={() => onChange(option)}
              className={cn(
                "sui-cursor-pointer sui-py-2.5 sui-text-center sui-text-desktop-5 sui-font-medium sui-transition-colors",
                "hover:sui-bg-neutral-background-weak",
                {
                  "sui-bg-admin-action-background sui-text-white hover:sui-bg-admin-action-background-hover sui-rounded-md sui-mx-1 sui-my-0.5":
                    isSelected,
                  "sui-text-neutral-text": !isSelected,
                },
              )}
            >
              {formatValue(option)}
            </div>
          );
        })}
      </div>
    );
  },
);

TimeColumn.displayName = "TimeColumn";

export default TimePicker;
