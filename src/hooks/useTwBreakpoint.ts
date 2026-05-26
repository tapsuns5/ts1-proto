"use client";

import { useMediaQuery } from "react-responsive";

const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

type BreakpointKey = keyof typeof breakpoints;

/**
 * Hook to check if the viewport matches a Tailwind CSS breakpoint.
 * Returns true if viewport width is >= the specified breakpoint.
 *
 * @example
 * const { isMd } = useTwBreakpoint('md');
 * if (isMd) {
 *   // Do something for medium screens and up (>= 768px)
 * }
 */
export function useTwBreakpoint<K extends BreakpointKey>(
  breakpointKey: K,
): Record<`is${Capitalize<K>}`, boolean> {
  const bool = useMediaQuery({
    query: `(min-width: ${breakpoints[breakpointKey]})`,
  });
  const capitalizedKey =
    breakpointKey[0].toUpperCase() + breakpointKey.substring(1);
  type Key = `is${Capitalize<K>}`;
  return {
    [`is${capitalizedKey}`]: bool,
  } as Record<Key, boolean>;
}

/**
 * Hook to detect if the current device is a touch device.
 *
 * @example
 * const isTouchDevice = useIsTouchDevice();
 */
export function useIsTouchDevice(): boolean {
  const canHover = useMediaQuery({
    query: "(hover: hover) and (pointer: fine)",
  });

  return !canHover;
}
