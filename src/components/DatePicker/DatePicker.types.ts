import * as PopoverPrimitive from "@radix-ui/react-popover";
import { VariantProps } from "class-variance-authority";
import Calendar from "../Calendar/Calendar";
import { datePickerVariants } from "./DatePicker";
import { ACTION, ACTION_ID } from "./utils";

export type DateRangePreset = {
  label: string;
  startDate: Date;
  endDate: Date;
};

export type DatePickerProps = VariantProps<typeof datePickerVariants> & {
  placeholder?: string;
  calendarAlign?: PopoverPrimitive.PopoverContentProps["align"];
  className?: string;
  errors?: string[];
  popoverModalMode?: boolean;
  // If provided, will only close the popover when the user clicks "Apply"
  showApplyButton?: boolean;
  id?: string;
  disabled?: boolean;
  clearable?: boolean;
} & (
    | {
        range: true;
        calendarProps?: [
          React.ComponentProps<typeof Calendar>,
          React.ComponentProps<typeof Calendar>?,
        ];
        value?: [Date | undefined, Date | undefined] | undefined | null;
        onChange?: (
          date: [Date | undefined, Date | undefined] | undefined | null | null,
        ) => void;
        fixedDatesShortcut?: true;
        // This is a custom list of fixed dates that will be shown in the left side of the calendar
        // If nothing is provided, then use the default list of fixed dates
        fixedDatesList?: DateRangePreset[];
        onCaptureAction?: (
          action: ACTION,
          id: ACTION_ID,
          date?: [Date, Date] | null,
        ) => void;
      }
    | {
        range?: false;
        calendarProps?: React.ComponentProps<typeof Calendar>;
        fixedDatesShortcut?: false;
        fixedDatesList?: DateRangePreset[];
        value?: Date | undefined | null;
        onChange?: (date: Date | null) => void;
        onCaptureAction?: (action: ACTION, id: ACTION_ID, date?: Date) => void;
      }
  );
