import React from "react";

// Constants
export const dateTypeOptions = [
  { value: "is", label: "Is (exact date match)"},
  { value: "is_before", label: "Is before" },
  { value: "is_after", label: "Is after" },
  { value: "is_between", label: "Is between (2 dates)"},
];

export const stringTypeOptions = [
  { value: "empty", label: "Empty" },
  { value: "not_empty", label: "Not empty" },
  { value: "contains", label: "Contains" },
  { value: "does_not_contain", label: "Does not contain" },
];

export const DATE_VALUE_DELIMITER = "|";
export const STRING_VALUE_DELIMITER = "|";

// Types
export type ComboboxItemInfo = {
  value: string;
  label: string;
  keywords?: string[];
};

// Date Filter Utilities

/**
 * Parses a date filter value string into its components
 * @param value - The date filter value string (e.g., "is_before|2023-12-01")
 * @returns Object containing dateType, startDate, and optional endDate
 */
export function parseDateValue(value: string): { dateType: string; startDate: string; endDate?: string } {
  const parts = value.split(DATE_VALUE_DELIMITER);
  if (parts.length === 3) {
    // is_between case: dateType|startDate|endDate
    return {
      dateType: parts[0],
      startDate: parts[1],
      endDate: parts[2],
    };
  }
  if (parts.length === 2) {
    // single date case: dateType|date
    return {
      dateType: parts[0],
      startDate: parts[1],
    };
  }
  // fallback for invalid format
  return {
    dateType: "is",
    startDate: "",
  };
}

/**
 * Creates a date filter value string from components
 * @param dateType - The type of date filter (is, is_before, is_after, is_between)
 * @param startDate - The start date (or only date for single date filters)
 * @param endDate - The end date (only for is_between filters)
 * @returns Formatted date filter value string
 */
export function createDateValue(dateType: string, startDate: string, endDate?: string): string {
  if (dateType === "is_between" && endDate) {
    return `${dateType}${DATE_VALUE_DELIMITER}${startDate}${DATE_VALUE_DELIMITER}${endDate}`;
  }
  return `${dateType}${DATE_VALUE_DELIMITER}${startDate}`;
}

/**
 * Formats a date filter for display in the UI
 * @param dateType - The type of date filter
 * @param startDate - The start date
 * @param endDate - The end date (optional)
 * @returns Human-readable label for the date filter
 */
export function formatDateLabel(dateType: string, startDate: string, endDate?: string): string {
  const typeLabel = dateTypeOptions.find(opt => opt.value === dateType)?.label || dateType;
  
  if (dateType === "is_between" && startDate && endDate) {
    return `${typeLabel} ${startDate} and ${endDate}`;
  }
  if (startDate) {
    return `${typeLabel} ${startDate}`;
  }
  return typeLabel;
}

/**
 * Checks if a value is a date filter value
 * @param value - The value to check
 * @returns True if the value is a date filter value
 */
export function isDateFilterValue(value: string): boolean {
  return value.includes(DATE_VALUE_DELIMITER) && 
         dateTypeOptions.some(option => value.startsWith(option.value + DATE_VALUE_DELIMITER));
}

// String Filter Utilities

/**
 * Parses a string filter value string into its components
 * @param value - The string filter value string (e.g., "contains|search text")
 * @returns Object containing stringType and textValue
 */
export function parseStringValue(value: string): { stringType: string; textValue: string } {
  const parts = value.split(STRING_VALUE_DELIMITER);
  if (parts.length >= 2) {
    return {
      stringType: parts[0],
      textValue: parts.slice(1).join(STRING_VALUE_DELIMITER), // Handle text that might contain delimiters
    };
  }
  // fallback for invalid format
  return {
    stringType: "contains",
    textValue: "",
  };
}

/**
 * Creates a string filter value string from components
 * @param stringType - The type of string filter (empty, not_empty, contains, does_not_contain)
 * @param textValue - The text value to filter by (optional)
 * @returns Formatted string filter value string
 */
export function createStringValue(stringType: string, textValue?: string): string {
  return `${stringType}${STRING_VALUE_DELIMITER}${textValue || ""}`;
}

/**
 * Formats a string filter for display in the UI
 * @param stringType - The type of string filter
 * @param textValue - The text value (optional)
 * @returns Human-readable label for the string filter
 */
export function formatStringLabel(stringType: string, textValue?: string): string {
  const typeLabel = stringTypeOptions.find(opt => opt.value === stringType)?.label || stringType;
  
  if ((stringType === "contains" || stringType === "does_not_contain") && textValue) {
    return `${typeLabel} "${textValue}"`;
  }
  return typeLabel;
}

/**
 * Checks if a value is a string filter value
 * @param value - The value to check
 * @returns True if the value is a string filter value
 */
export function isStringFilterValue(value: string): boolean {
  return value.includes(STRING_VALUE_DELIMITER) && 
         stringTypeOptions.some(option => value.startsWith(option.value + STRING_VALUE_DELIMITER));
}

// General Utilities

/**
 * Checks if an item matches the search text
 * @param item - The item to check (with value, label, and optional keywords)
 * @param searchText - The search text to match against
 * @returns True if the item matches the search text
 */
export function getIsItemAMatchWithSearchText(
  item: { value: string; label: string; keywords?: string[] },
  searchText: string,
): boolean {
  const lowerCaseSearch = searchText.toLowerCase();
  return (
    item.label.toLowerCase().includes(lowerCaseSearch) ||
    !!(
      item.keywords?.some((keyword) =>
        keyword.toLowerCase().includes(lowerCaseSearch),
      )
    )
  );
}

/**
 * Recursively finds all ComboboxItem components in a React children tree
 * @param children - The React children to search through
 * @param ComboboxItemComponent - The ComboboxItem component reference for type checking
 * @returns Array of ComboboxItemInfo objects found in the children
 */
export function findComboboxItemsRecursively(
  children: React.ReactNode,
  ComboboxItemComponent?: React.ElementType
): ComboboxItemInfo[] {
  let items: ComboboxItemInfo[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }
    // Check the basic type of the child to see if it's a ComboboxItem.
    if (ComboboxItemComponent && child.type === ComboboxItemComponent) {
      const props = child.props as { value: string; label: string; keywords?: string | string[] };
      items.push({
        value: props.value,
        label: props.label,
        keywords: typeof props.keywords === 'string' ? [props.keywords] : props.keywords,
      });
    }
    // Find items recursively so we can handle nested ComboboxItem components.
    if ((child.props as any).children) {
      items = items.concat(findComboboxItemsRecursively((child.props as any).children, ComboboxItemComponent));
    }
  });
  return items;
}
