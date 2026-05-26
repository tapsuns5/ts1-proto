import React from "react";
import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

export const sanitizeDecimalInput = (value: string, limit: number): string => {
  const parts = value.split(".");
  if (parts.length > 1 && parts[1].length > limit) {
    return `${parts[0]}.${parts[1].slice(0, limit)}`;
  }
  return value;
};

export const localStringToNumber = (s: string): number => {
  const numberRegEx = /[^0-9.-]+/g;
  const commasRegEx = /,/g;
  const cleaned = s.replace(numberRegEx, "").replace(commasRegEx, "");
  return Number(cleaned);
};

export const useOnClickOutside = (
  ref: React.RefObject<HTMLElement>,
  handler: (event: Event) => void,
) => {
  const listener = (event: Event) => {
    if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
      handler(event);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mouseup", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mouseup", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const id = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      window.clearTimeout(id);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useBodyScrollLock = (
  isInitiallyLocked: boolean = false,
  scrollLockClass: string = "scroll-lock",
) => {
  const [isBodyScrollLocked, setIsBodyScrollLocked] =
    React.useState(isInitiallyLocked);

  document.body.classList.toggle(scrollLockClass, isBodyScrollLocked);

  return { isBodyScrollLocked, setIsBodyScrollLocked };
};

/**
 * @name getClassName
 *
 * @description
 *  Takes a base className and calls stringifyArray to merge 'truthy' options into a single string it returns
 *
 * @example
 *  import { getClassName } from 'utils/helpers
 *
 *  getClassName(
 *    'BaseClassName',
 *    isInline && 'InlineModifier',
 *    isActive ? 'ActiveModifier' : 'InactiveModifier'
 *    'some-utility-modifier'
 * )
 *
 */
export const getClassName = (
  className: any,
  ...classModifiers: (string | undefined)[]
) => {
  return [className, ...classModifiers].filter(Boolean).join(" ");
};

export const isSafari = () => {
  return (
    /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
  );
};

export const isFirefox = () => {
  return /Firefox/.test(navigator.userAgent);
};

const twMerge = extendTailwindMerge({
  prefix: "sui-",
  extend: {
    classGroups: {
      "font-size": [
        "text-caption",
        "text-label-sm",
        "text-label",
        "text-label-lg",
        "text-body",
        "text-body-dense",
        "text-navigation",
        "text-heading-sm",
        "text-heading-md",
        "text-heading-lg",
        "text-display-sm",
        "text-display-md",
        "text-display-lg",
        "text-display-xl",
      ],
    },
  },
});
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
