import * as PopoverPrimitive from "@radix-ui/react-popover";
import { VariantProps } from "class-variance-authority";
import { dateTimePickerVariants } from "./DateTimePicker";
import Calendar from "../Calendar/Calendar";

export type DateTimePickerProps = VariantProps<typeof dateTimePickerVariants> & {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  calendarAlign?: PopoverPrimitive.PopoverContentProps["align"];
  /**
   * Props to pass to the Calendar component
   * - Use `minDate` to prevent selecting dates before a certain date (e.g., prevent past dates)
   * - Use `maxDate` to prevent selecting dates after a certain date
   */
  calendarProps?: React.ComponentProps<typeof Calendar>;
  /**
   * Default date to show when picker opens and no value is selected
   * Useful for pre-populating the picker with today's date or a specific time
   */
  defaultDate?: Date;
  className?: string;
  label?: string;
  required?: boolean;
  name?: string;
  helpText?: string;
  showHelpIcon?: boolean;
  errors?: string[];
  helpIconTooltipContent?: React.ReactNode;
  disabled?: boolean;
  /**
   * Show footer with Apply/Cancel buttons
   * @default false
   */
  withFooter?: boolean;
  /**
   * Optional functionality to allow the user to clear the selected date
   */
  allowClear?: boolean;
  popoverModalMode?: boolean;
  useNativeOnMobile?: boolean;
  /**
   * Callback when user clicks Apply or Cancel buttons
   */
  onCaptureAction?: (action: "apply" | "cancel") => void;
  id?: string;
  [x: string]: any;
};
