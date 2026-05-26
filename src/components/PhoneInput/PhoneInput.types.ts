import React from "react";
import { CountryCode } from "libphonenumber-js";
import { InputSize } from "../Input/Input.types";

/**
 * NOTE: Update PhoneInput.test.tsx with all additions and changes!
 */
export type PhoneInputProps = {
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
    >,
  ) => void;
  onBlur?: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  value?: string;
  size?: InputSize;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  /**
   * used to show error border style without message
   */
  errorState?: boolean;
  /**
   * apply classes to the outer wrapper
   */
  className?: string;
  /**
   * Optional text for the help icon tooltip
   */
  helpIconTooltipContent?: React.ReactNode;
  /**
   * Optional value to set the default country code for phone number inputs
   */
  defaultCountryCode?: CountryCode;
  /**
   * All other props to pass along (comment this out when running tests to catch prop errors)
   */
  tooltipProps?: any;
};
