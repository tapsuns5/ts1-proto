import React from "react";
import ReactSelect, {
  FormatOptionLabelMeta,
  GroupBase,
  StylesConfig,
} from "react-select";

/**
 * Props specific to the design system wrapper around react-select
 */
type DesignSystemSelectProps<IsMulti extends boolean = false> = {
  // InputWrapper integration
  label?: string;
  helpText?: string;
  showHelpIcon?: boolean;
  errors?: string[];
  /**
   * Optional text for the help icon tooltip
   */
  helpIconTooltipContent?: React.ReactNode;
  className?: string;

  // Required for our implementation
  name: string;
  id?: string;

  // Our custom simplified API (transforms option objects to string values)
  // Type changes based on isMulti - string[] for multi, string for single
  onChange?: (
    value: IsMulti extends true ? string[] | null : string | null,
  ) => void;
  onBlur?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  value?: IsMulti extends true ? string[] : string;

  // Our simplified options API
  options: OptionProperty;

  // Our size system (not in react-select)
  size?: "default" | "small" | "large" | "x-large";

  // Wrapper for isDisabled (more intuitive naming for forms)
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;

  // Conditional: only for creatable mode (maps to onCreateOption internally)
  onCreate?: (value: string) => any;

  // Creatable-specific prop (from react-select/creatable)
  formatCreateLabel?: (value: string) => string | React.ReactNode;

  // Design system specific menu props
  menuPortalTarget?: HTMLElement | null;
  menuPlacement?: "auto" | "top" | "bottom";
  menuPosition?: "absolute" | "fixed";
  styles?: StylesConfig<SelectOption, IsMulti, GroupBase<SelectOption>>;
  /**
   * Adds a search input inside the dropdown menu that filters options.
   */
  menuSearchable?: boolean;
  /**
   * Placeholder text for the menu search input.
   */
  menuSearchPlaceholder?: string;
  /**
   * When true, automatically scrolls to the selected option when the dropdown opens
   */
  scrollToSelected?: boolean;
};

/**
 * React-select passthrough props (removing conflicts with our custom API)
 * Uses SelectOption and IsMulti as generic type parameters to properly type react-select's functions
 */
type ReactSelectPassthroughProps<IsMulti extends boolean = false> = Omit<
  React.ComponentProps<
    typeof ReactSelect<SelectOption, IsMulti, GroupBase<SelectOption>>
  >,
  | "onChange" // We provide custom onChange signature
  | "onBlur" // We provide custom onBlur signature
  | "value" // We provide custom value (string/string[] instead of SelectOption)
  | "options" // We provide custom options (OptionProperty instead of readonly SelectOption[])
  | "name" // We require this (not optional)
  | "onCreateOption" // We map this to onCreate
  | "placeholder" // We provide this in DesignSystemSelectProps
  | "isDisabled" // We expose this as 'disabled' for form consistency
  | "className" // We handle className at the wrapper level
  | "menuPortalTarget" // We handle this in DesignSystemSelectProps
  | "menuPlacement" // We handle this in DesignSystemSelectProps
  | "menuPosition" // We handle this in DesignSystemSelectProps
  | "styles" // We handle this in DesignSystemSelectProps
>;

/**
 * Final Select component props: design system props + passthrough react-select props
 *
 * This allows all react-select props to be used without manually adding them to the type definition.
 * New props added to react-select will automatically be available in this component.
 *
 * Generic parameter IsMulti determines whether the select is single or multi-select:
 * - SelectProps (defaults to false) - Single select, value is string
 * - SelectProps<true> - Multi select, value is string[]
 */
export type SelectProps<IsMulti extends boolean = false> =
  DesignSystemSelectProps<IsMulti> & ReactSelectPassthroughProps<IsMulti>;

export type OptionProperty =
  | string[]
  | SelectOption[]
  | GroupOption[]
  | GroupOptionString[];

export type GroupOption = {
  label?: string;
  /**
   * When provided, the group heading becomes a selectable option.
   * Selecting it returns this value via onChange.
   */
  value?: string;
  options: readonly SelectOption[];
};

export type GroupOptionString = {
  label?: string;
  options: string[];
};

export type SelectOption = {
  label: string;
  value: string;
  isDisabled?: boolean;
};

// Re-export FormatOptionLabelMeta for consumer type safety
export type { FormatOptionLabelMeta };
