import React, {
  ComponentPropsWithoutRef,
  forwardRef,
  useMemo,
  useState,
} from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "../../../utils";
import Input from "../../Input/Input";
import LabelButton from "../../LabelButton/LabelButton";
import {
  dateTypeOptions,
  parseDateValue,
  createDateValue,
  isDateFilterValue,
} from "../ComboboxUtils";
import { useComboboxProvider } from "../Combobox";

type ComboboxDateFilterProps = Omit<ComponentPropsWithoutRef<"div">, "onChange"> & {
  label?: string;
  keywords?: string[];
  defaultMatchType?: "is" | "is_before" | "is_after" | "is_between";
};

const ComboboxDateFilter = forwardRef<HTMLDivElement, ComboboxDateFilterProps>(
  ({ className, label, keywords, defaultMatchType = "is", ...props }, ref) => {
    const { tempValues, setTempValues, search, resetInput, handleOnSave } = useComboboxProvider();

    const [dateType, setDateType] = useState<string>(defaultMatchType);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const existingDateValue = useMemo(() => {
      const existingValue = tempValues.find(val => isDateFilterValue(val));
      if (existingValue) {
        return parseDateValue(existingValue);
      }
      return null;
    }, [tempValues]);

    React.useEffect(() => {
      if (existingDateValue) {
        setDateType(existingDateValue.dateType);
        setStartDate(existingDateValue.startDate);
        setEndDate(existingDateValue.endDate || "");
      } else {
        setDateType(defaultMatchType);
        setStartDate("");
        setEndDate("");
      }
    }, [existingDateValue, defaultMatchType]);

    const handleDateTypeChange = (newDateType: string) => {
      setDateType(newDateType);
      if (newDateType !== "is_between") {
        setEndDate("");
      }
      updateDateValue(newDateType, startDate, newDateType === "is_between" ? endDate : undefined);
    };

    const handleStartDateChange = (newStartDate: string) => {
      setStartDate(newStartDate);
      updateDateValue(dateType, newStartDate, dateType === "is_between" ? endDate : undefined);
    };

    const handleEndDateChange = (newEndDate: string) => {
      setEndDate(newEndDate);
      updateDateValue(dateType, startDate, newEndDate);
    };

    const updateDateValue = (type: string, start: string, end?: string) => {
      const filteredValues = tempValues.filter(val => !isDateFilterValue(val));

      if (start) {
        const newValue = createDateValue(type, start, end);
        const newValues = [...filteredValues, newValue];
        setTempValues(newValues);
      } else {
        setTempValues(filteredValues);
      }
      resetInput();
    };

    const dateRangeErrors = useMemo(() => {
      if (dateType === "is_between" && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
          return {
            startDateErrors: ["Start date cannot be after end date"],
            endDateErrors: ["End date cannot be before start date"],
            hasErrors: true
          };
        }
      }

      return {
        startDateErrors: undefined,
        endDateErrors: undefined,
        hasErrors: false
      };
    }, [dateType, startDate, endDate]);

    const hasAllFieldsFilled = useMemo(() => {
      if (dateType === "is_between") {
        return startDate !== "" && endDate !== "";
      }
      return startDate !== "";
    }, [dateType, startDate, endDate]);

    return (
      <div
        className={cn(
          "sui-py-0.5",
          className,
        )}
        ref={ref}
        {...props}
      >
        {!!label && (
          <div className="sui-mb-2">
            <span className="sui-text-label-sm sui-font-medium sui-text-neutral-text">
              {label}
            </span>
          </div>
        )}
        <div className="sui-flex sui-gap-2 sui-flex-col md:sui-flex-row">
          <Input
            type="select"
            name="date-type-select"
            options={dateTypeOptions}
            className="sui-min-w-[200px]"
            value={dateType}
            onChange={(e: { target: { value: string } }) => handleDateTypeChange(e.target.value)}
          />
          <Input
            type="date"
            className="sui-min-w-[160px]"
            value={startDate}
            name="start-date-input"
            onChange={(e: { target: { value: string } }) => handleStartDateChange(e.target.value)}
            placeholder={dateType === "is_between" ? "Start date" : "Date"}
            inputProps={dateType === "is_between" && endDate ? { max: endDate } : undefined}
            errors={dateRangeErrors.startDateErrors}
          />
          {dateType === "is_between" && (
            <Input
              type="date"
              name="end-date-input"
              className="sui-min-w-[160px]"
              value={endDate}
              onChange={(e: { target: { value: string } }) => handleEndDateChange(e.target.value)}
              placeholder="End date"
              inputProps={startDate ? { min: startDate } : undefined}
              errors={dateRangeErrors.endDateErrors}
            />
          )}
        </div>
        <footer className="sui-sticky sui-flex sui-justify-end sui-gap-1 sui-border-t sui-border-solid sui-border-neutral-border sui-bg-white sui-py-2 sui-mt-4 [bottom:0px]">
          <PopoverPrimitive.Close asChild>
            <LabelButton variantType="tertiary">Cancel</LabelButton>
          </PopoverPrimitive.Close>
          <LabelButton
            onClick={handleOnSave}
            disabled={dateRangeErrors.hasErrors || !hasAllFieldsFilled}
          >
            Apply
          </LabelButton>
        </footer>
      </div>
    );
  },
);
ComboboxDateFilter.displayName = "ComboboxDateFilter";

export { ComboboxDateFilter };
