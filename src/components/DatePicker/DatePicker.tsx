import * as React from "react";
import { useEffect, useState } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cva } from "class-variance-authority";
import { cn } from "../../utils";
import { useTwBreakpoint } from "../../hooks/useTwBreakpoint";
import Icon from "../Icon/Icon";
import { DatePickerPopoverContent } from "./components/DatePickerPopoverContent";
import { DateRangeString } from "./components/DateRangeString";
import type { DatePickerProps } from "./DatePicker.types";
import { createDateString } from "./utils";

type RangeValue = [Date | undefined, Date | undefined] | null;
type SingleValue = Date | null;

const DatePicker = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  DatePickerProps
>(
  (
    {
      value,
      placeholder = "Select a date range",
      onChange,
      calendarProps,
      calendarAlign = "start",
      range = false,
      fixedDatesShortcut,
      fixedDatesList,
      className,
      size,
      onCaptureAction,
      errors,
      popoverModalMode = false,
      showApplyButton = false,
      clearable = false,
      disabled,
      ...props
    },
    ref,
  ): React.ReactElement => {
    const [openPopover, setOpenPopover] = React.useState(false);
    // Used to store the date value locally until "Apply" is clicked
    const [tempDateValue, setTempDateValue] = useState<
      DatePickerProps["value"]
    >(value ?? null);
    // In a range, there are two calendars, start and end. - this defines which one is selected.
    const [selectedCalendarRange, setSelectedCalendarRange] = React.useState<
      "start" | "end" | undefined
    >(undefined);

    const hasErrors = Boolean(errors?.length);
    const { isMd } = useTwBreakpoint("md");
    const isSmallScreen = !isMd;

    const hasValue = range
      ? Array.isArray(value) && (value[0] !== undefined || value[1] !== undefined)
      : value !== undefined && value !== null;
    const showClear = clearable && hasValue && !disabled;

    useEffect(() => {
      if (disabled) {
        setOpenPopover(false);
      }
    }, [disabled]);

    useEffect(() => {
      setTempDateValue(value);
    }, [value, openPopover]);

    const onOpenChange = (isOpen: boolean) => {
      if (isOpen && disabled) return;
      setOpenPopover(isOpen);
      // If the popover is closed and showApplyButton is false, then set the date value
      // whenever the popover is closed.
      if (!isOpen && !showApplyButton) {
        onChange && onChange(tempDateValue as any);
      }
      // If the popover is closed and showApplyButton is true, then we don't want to set the date value.
    };

    const handleClear = (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      if (range) {
        const cleared: RangeValue = [undefined, undefined];
        (onChange as (d: RangeValue) => void)?.(cleared);
        setTempDateValue(cleared);
      } else {
        (onChange as (d: SingleValue) => void)?.(null);
        setTempDateValue(null);
      }
    };

    return (
      <PopoverPrimitive.Root
        open={openPopover}
        onOpenChange={onOpenChange}
        modal={popoverModalMode}
      >
        <fieldset className={cn("sui-w-fit", className)}>
          <PopoverPrimitive.Trigger
            className={cn(
              datePickerVariants({ size, error: hasErrors }),
              !disabled && "sui-cursor-pointer",
            )}
            ref={ref}
            disabled={disabled}
            {...props}
          >
            <DatePickerTriggerContent
              range={range}
              value={value}
              openPopover={openPopover}
              dateSelected={selectedCalendarRange}
              placeholder={placeholder}
              disabled={disabled}
            />
            {showClear && (
              <span
                role="button"
                tabIndex={0}
                aria-label="Clear date selection"
                className="sui-flex sui-items-center sui-justify-center sui-cursor-pointer"
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClear(e);
                  }
                }}
                data-testid="datepicker-clear-button"
              >
                <Icon
                  name="close"
                  size="s"
                  className="sui-text-neutral-icon-medium hover:sui-text-neutral-text"
                />
              </span>
            )}
          </PopoverPrimitive.Trigger>
          {hasErrors &&
            errors?.map((error) => (
              <div className="sui-mt-0.5 sui-block sui-text-negative-text sui-caption">
                {error}
              </div>
            ))}
        </fieldset>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            className="sui-z-[99999] sui-rounded sui-border sui-border-solid sui-border-gray-90 sui-bg-white sui-shadow-up"
            sideOffset={8}
            align={isSmallScreen ? "center" : calendarAlign}
            side={isSmallScreen ? "bottom" : undefined}
            collisionPadding={isSmallScreen ? 16 : 8}
            data-testid="snap-ui-calendar-popover-content"
            sticky="always"
          >
            <DatePickerPopoverContent
              range={range}
              dateValue={tempDateValue}
              setDateValue={setTempDateValue}
              setDateSelected={setSelectedCalendarRange}
              calendarProps={calendarProps ?? ({} as any)}
              onCaptureAction={onCaptureAction}
              setOpenPopover={setOpenPopover}
              showFooter={showApplyButton}
              fixedDatesShortcut={fixedDatesShortcut}
              fixedDatesList={fixedDatesList}
              isVertical={isSmallScreen}
              onChange={
                (onChange as (date: Date | [Date, Date]) => void) ?? (() => {})
              }
            />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    );
  },
);

function DatePickerTriggerContent({
  range,
  value,
  openPopover,
  dateSelected,
  placeholder,
  disabled,
}: {
  range: boolean;
  value: DatePickerProps["value"];
  openPopover: boolean;
  dateSelected: "start" | "end" | undefined;
  placeholder: string;
  disabled?: boolean;
}) {
  const iconClass = disabled
    ? "sui-text-neutral-text-disabled"
    : "sui-text-neutral-icon-medium";

  if (!value || (range && Array.isArray(value) && !value[0] && !value[1])) {
    return (
      <>
        <span className="sui-text-neutral-text-weak">
          {placeholder}
        </span>
        <Icon name="calendar_month" className={iconClass} />
      </>
    );
  }
  if (range) {
    return (
      <DateRangeString
        isPopoverOpen={openPopover}
        dateValues={value as [Date, Date]}
        dateJustSelected={dateSelected}
      />
    );
  }
  return (
    <>
      <span>{createDateString(value as Date)}</span>
      <Icon name="calendar_month" className={iconClass} />
    </>
  );
}

export const datePickerVariants = cva(
  [
    "sui-flex sui-w-full sui-items-center sui-justify-between sui-gap-1 sui-rounded-full sui-border sui-border-solid sui-border-neutral-border sui-bg-white sui-px-2 sui-text-desktop-5",
    "hover:sui-border-action-border-hover",
    "data-[state=open]:sui-border-action-background",
    "disabled:sui-cursor-default disabled:sui-bg-neutral-background-weak-disabled disabled:sui-text-neutral-text-disabled disabled:hover:sui-border-neutral-border",
  ],
  {
    variants: {
      size: {
        small: "sui-h-[32px]",
        default: "sui-h-[48px]",
        large: "sui-h-[56px]",
      },
      error: {
        true: "sui-border-negative-border-hover",
      },
    },
    defaultVariants: { size: "default" },
  },
);

export default DatePicker;
