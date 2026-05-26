import React, {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  useMemo,
} from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils";
import Icon from "../../Icon/Icon";
import {
  parseDateValue,
  formatDateLabel,
  isDateFilterValue,
  parseStringValue,
  formatStringLabel,
  isStringFilterValue,
} from "../ComboboxUtils";
import { useComboboxProvider } from "../Combobox";

const comboboxTriggerVariants = cva(
  ["sui-flex sui-cursor-pointer sui-items-center"],
  {
    variants: {
      variant: {
        filter: [
          "sui-rounded-full sui-border sui-border-dashed sui-border-neutral-border-medium",
          "hover:sui-border-admin-action-border",
          "sui-px-2 sui-py-[2px] sui-pl-1",
          "sui-min-h-[32px] sui-gap-1 sui-whitespace-nowrap",
          "data-[state=open]:sui-border-admin-action-border data-[state=open]:sui-bg-admin-action-background-weak-pressed",
        ],
        input: [
          "sui-group sui-justify-between sui-h-[30px] sui-rounded-full sui-border sui-border-solid sui-border-neutral-border sui-bg-white sui-px-2",
          "sui-text-body sui-text-left",
          "placeholder:sui-text-neutral-text-weak",
          "hover:sui-border-action-border-hover",
          "focus-visible:sui-outline-none focus-visible:sui-ring-1 focus-visible:sui-ring-action-border",
          "disabled:sui-cursor-not-allowed disabled:sui-opacity-50",
        ],
      },
      status: {
        error: "",
        success: "",
      },
    },
    compoundVariants: [
      {
        variant: "input",
        status: "error",
        className: "sui-border-negative-border",
      },
      {
        variant: "input",
        status: "success",
        className: "sui-border-positive-border",
      },
    ],
    defaultVariants: {
      variant: "filter",
    },
  },
);

const ComboboxTrigger = forwardRef<
  ElementRef<typeof PopoverPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger> &
    VariantProps<typeof comboboxTriggerVariants> & {
      maxVisibleTags?: number;
      label?: string;
      onClear?: () => void;
    }
>(
  (
    {
      className,
      children,
      maxVisibleTags = 2,
      label = "Select",
      onClear,
      asChild,
      variant = "filter",
      status,
      ...props
    },
    ref,
  ) => {
    const { values, allValuesAndLabels } = useComboboxProvider();

    const valuesToDisplay = useMemo(() => {
      if (!maxVisibleTags) return values;
      return values.length >= maxVisibleTags
        ? values.slice(0, maxVisibleTags - 1)
        : values.slice(0, maxVisibleTags);
    }, [values, maxVisibleTags]);

    const isAllSelected = useMemo(() => {
      return (
        allValuesAndLabels.length > 0 &&
        values.length === allValuesAndLabels.length
      );
    }, [values, allValuesAndLabels.length]);

    if (asChild) {
      return (
        <PopoverPrimitive.Trigger
          className={cn(className)}
          ref={ref}
          asChild
          {...props}
        >
          {children}
        </PopoverPrimitive.Trigger>
      );
    }

    if (variant === "input") {
      return (
        <PopoverPrimitive.Trigger
          className={cn(
            comboboxTriggerVariants({ variant, status }),
            className,
          )}
          ref={ref}
          {...props}
        >
          <span className="sui-line-clamp-1 sui-pr-1">{children}</span>
          <Icon name="arrow_drop_down" size="s" className="sui-text-neutral-icon" />
        </PopoverPrimitive.Trigger>
      );
    }

    return (
        <PopoverPrimitive.Trigger
          className={cn(
            comboboxTriggerVariants({ variant }),
            {
              "sui-border-solid sui-border-neutral-border sui-bg-white sui-pl-2 sui-pr-1":
                values.length > 0,
            },
            className,
          )}
          ref={ref}
          {...props}
        >
          <div className="sui-flex sui-items-center sui-gap-[4px] !sui-font-semibold sui-text-label">
            {values.length === 0 && <Icon name="add" size="s" />} {label}
          </div>
          {values.length > 0 && (
            <>
              <span className="sui-block sui-h-2 sui-w-[1px] sui-bg-neutral-border" />
              {!isAllSelected && (
                <p className="sui-truncate !sui-font-semibold sui-text-admin-action-text sui-text-label">
                  {valuesToDisplay.map((value, index) => {
                    let displayLabel;

                    if (isDateFilterValue(value)) {
                      const { dateType, startDate, endDate } = parseDateValue(value);
                      displayLabel = formatDateLabel(dateType, startDate, endDate);
                    } else if (isStringFilterValue(value)) {
                      const { stringType, textValue } = parseStringValue(value);
                      displayLabel = formatStringLabel(stringType, textValue);
                    } else {
                      displayLabel = allValuesAndLabels?.find(
                        (option) => option.value === value,
                      )?.label;
                    }

                    return (
                      <span key={`trigger-tag-${value}`} className="sui-truncate">
                        {displayLabel}
                        {index < valuesToDisplay.length - 1 && ", "}
                      </span>
                    );
                  })}
                </p>
              )}
              {!isAllSelected && maxVisibleTags === 1 && values.length > 0 && (
                <p className="!sui-font-semibold sui-text-admin-action-text sui-text-label">
                  {`${values.length === 1 ? "1 item selected" : `${values.length} items selected`}`}
                </p>
              )}
              {!isAllSelected &&
                maxVisibleTags > 1 &&
                values.length >= maxVisibleTags && (
                  <p className="!sui-font-semibold sui-text-admin-action-text sui-text-label">
                    {`& ${values.length - valuesToDisplay.length} more`}
                  </p>
                )}
              {isAllSelected && (
                <p className="!sui-font-semibold sui-text-admin-action-text sui-text-label">
                  All
                </p>
              )}
              <span className="sui-flex">
                {!!onClear && (
                  <span
                    className="sui-ml-1 sui-flex sui-justify-center sui-items-center"
                    aria-label="Clear selection"
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onClear();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        onClear();
                      }
                    }}
                  >
                    <Icon name="close" size="s" className="sui-text-neutral-icon" />
                  </span>
                )}
                <Icon name="arrow_drop_down" />
              </span>
            </>
          )}
        </PopoverPrimitive.Trigger>
    );
  },
);
ComboboxTrigger.displayName = "ComboboxTrigger";

export { ComboboxTrigger };
