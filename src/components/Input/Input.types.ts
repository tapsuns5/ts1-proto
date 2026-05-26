import React from "react";

/**
 * NOTE: Update Input.test.tsx with all additions and changes!
 */
export type InputProps = {
  type:
    | "text"
    | "email"
    | "date"
    | "datetime"
    | "number"
    | "phone"
    | "financial"
    | "textarea"
    | "select"
    | "password";
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helpText?: string;
  showHelpIcon?: boolean;
  errors?: string[];
  onChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onBlur?: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  value?: string;
  rows?: number;
  maxChars?: number;
  size?: InputSize;
  currency?: "USD" | "CAD";
  inputProps?:
    | React.InputHTMLAttributes<HTMLInputElement>
    | React.TextareaHTMLAttributes<HTMLTextAreaElement>
    | React.TextareaHTMLAttributes<HTMLSelectElement>;
  options?: NativeSelectOption[];
  /**
   * used to show error border style without message
   */
  errorState?: boolean;
  /**
   * apply classes to the outer wrapper
   */
  className?: string;
  /**
   * allowDecimals for number and financial types
   * @default true
   */
  allowDecimals?: boolean;
  /**
   * Limit the number of decimal places allowed for number and financial types.
   * Only applied when allowDecimals is true.
   */
  decimalLimit?: number;
  /**
   * Optional text for the help icon tooltip
   */
  helpIconTooltipContent?: React.ReactNode;
  /**
   * Optional flag to allow country code input for phone type
   */
  allowCountryCode?: boolean;
  /**
   * All other props to pass along (comment this out when running tests to catch prop errors)
   */
  // tooltipProps?: TooltipProps;
  /**
   * Optional icon to display on the left side of the input. Takes the name of the material icon.
   */
  leftIcon?: string;
  /**
   * Optional functionality to allow the user to clear the text or email input
   */
  allowClear?: boolean;
  /**
   * All other props to pass along (comment this out when running tests to catch prop errors)
   */
  [x: string]: any;
};

export type InputSize = "default" | "small" | "large";

export type NativeSelectOption = {
  value: string;
  label: string;
};
