import parsePhoneNumber, { AsYouType, CountryCode } from "libphonenumber-js";

export const isValidPhoneNumber = (
  value: string,
  defaultCountryCode: CountryCode = "US",
): boolean => {
  const phoneNumber = parsePhoneNumber(value, defaultCountryCode);
  if (!phoneNumber) {
    return false;
  }
  return phoneNumber.isValid();
};

export const phoneNumberToE164 = (
  value: string,
  defaultCountryCode: CountryCode = "US",
): string | undefined => {
  const phoneNumber = parsePhoneNumber(value, defaultCountryCode);
  if (phoneNumber) {
    return phoneNumber.format("E.164");
  }
};

export function formatPhoneNumber(
  value: string,
  defaultCountryCode?: CountryCode,
): string {
  return new AsYouType(defaultCountryCode).input(value);
}

export function calculateCursorPosition(
  originalValue: string,
  formattedValue: string,
  originalCursorPos: number
): number {
  // Count digits up to the cursor position in the original value
  let digitCount = 0;
  for (let i = 0; i < Math.min(originalCursorPos, originalValue.length); i++) {
    if (/\d/.test(originalValue[i])) {
      digitCount++;
    }
  }

  // Find the position after the nth digit in the formatted value
  let currentDigitCount = 0;
  for (let i = 0; i < formattedValue.length; i++) {
    if (/\d/.test(formattedValue[i])) {
      currentDigitCount++;
      if (currentDigitCount === digitCount) {
        return i + 1;
      }
    }
  }
  
  return formattedValue.length;
};
