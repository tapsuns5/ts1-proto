import { format, isValid, parse } from 'date-fns';

export const isMobile = (): boolean => {
  if (typeof window === "undefined") return false;

  // Check for touch device and small screen
  const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth < 768;

  // Check user agent as fallback
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileUserAgent = mobileRegex.test(navigator.userAgent);

  return (hasTouchScreen && isSmallScreen) || isMobileUserAgent;
};

/**
 * Check if a date is valid using date-fns
 */
export const isValidDate = (date: Date | null | undefined): date is Date => {
  return date instanceof Date && isValid(date);
};

export const formatDateTime = (date: Date): string => {
  if (!isValidDate(date)) return '';
  return format(date, 'MMM d, yyyy h:mm a');
};

/**
 * Convert a Date object to masked input format (MM/DD/YYYY HH:MM AM/PM)
 */
export const dateToInputFormat = (date: Date): string => {
  if (!isValidDate(date)) return '';
  return format(date, 'MM/dd/yyyy hh:mm a');
};

/**
 * Convert a Date object to datetime-local input format (YYYY-MM-DDTHH:MM)
 */
export const dateToDateTimeLocal = (date: Date): string => {
  if (!isValidDate(date)) return '';
  return format(date, "yyyy-MM-dd'T'HH:mm");
};

/**
 * Convert datetime-local input format to Date object
 */
export const dateTimeLocalToDate = (dateTimeString: string): Date | null => {
  if (!dateTimeString) return null;
  const date = new Date(dateTimeString);
  return isValidDate(date) ? date : null;
};

/**
 * Get hours in 12-hour format from 24-hour format
 */
export const get12Hour = (hour24: number): number => {
  if (hour24 === 0) return 12;
  if (hour24 > 12) return hour24 - 12;
  return hour24;
};

/**
 * Get period (AM/PM) from 24-hour format
 */
export const getPeriod = (hour24: number): "AM" | "PM" => {
  return hour24 >= 12 ? "PM" : "AM";
};

/**
 * Convert 12-hour format to 24-hour format
 */
export const to24Hour = (hour12: number, period: "AM" | "PM"): number => {
  if (period === "AM") {
    return hour12 === 12 ? 0 : hour12;
  }
  return hour12 === 12 ? 12 : hour12 + 12;
};
