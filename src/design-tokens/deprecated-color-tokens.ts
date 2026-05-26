import baseColors from "./deprecated-base-colors";
import themeColors from "./theme.colors";

type ThemeKeys = keyof typeof themeColors;

// NOTE: The old var names are being kept for backwards compatibility.
// we are just matching the old var names to the new ones.
const deprecatedColorTokens: Record<string, string> = {
  // --- Accent Variables ---
  "accent-background": themeColors["accent"]["background"],
  "accent-background-weak": themeColors["accent"]["background-weak"],
  "accent-border-weak": themeColors["accent"]["border-weak"],

  // --- Action Variables ---
  "action-background": themeColors["admin-action"]["background"],
  "action-background-hover": themeColors["admin-action"]["background-hover"],
  "action-background-pressed":
    themeColors["admin-action"]["background-pressed"],
  "action-background-weak": baseColors["blue-95"],
  "action-background-weak-hover":
    themeColors["admin-action"]["background-weak-hover"],
  "action-background-weak-pressed":
    themeColors["admin-action"]["background-weak-pressed"],
  "action-border": themeColors["admin-action"]["border"],
  "action-border-hover": themeColors["admin-action"]["border-hover"],
  "action-border-pressed": themeColors["admin-action"]["border-pressed"],
  "action-icon": themeColors["admin-action"]["icon"],
  "action-icon-hover": themeColors["admin-action"]["icon-hover"],
  "action-icon-pressed": themeColors["admin-action"]["icon-pressed"],
  "action-text": themeColors["admin-action"]["text"],
  "action-text-hover": themeColors["admin-action"]["text-hover"],
  "action-text-pressed": themeColors["admin-action"]["text-pressed"],

  // --- Brand Variables ---
  "brand-background": themeColors["brand"]["background"],

  // --- Info Variables ---
  "info-background": themeColors["info"]["background"],
  "info-icon": themeColors["info"]["icon"],
  "info-text": themeColors["info"]["text"],
  "info-border": themeColors["info"]["border"],

  // --- Negative Variables ---
  "negative-background": themeColors["negative"]["background"],
  "negative-background-disabled": baseColors["red-90"],
  "negative-background-hover": themeColors["negative"]["background-hover"],
  "negative-background-medium-hover": baseColors["red-40"],
  "negative-background-pressed": themeColors["negative"]["background-pressed"],
  "negative-background-strong": baseColors["red-40"],
  "negative-background-strong-hover": baseColors["red-30"],
  "negative-background-strong-pressed": baseColors["red-20"],
  "negative-border": themeColors["negative"]["border"],
  "negative-border-disabled": baseColors["red-80"],
  "negative-border-hover": themeColors["negative"]["border-hover"],
  "negative-border-pressed": themeColors["negative"]["border-pressed"],
  "negative-icon": themeColors["negative"]["icon"],
  "negative-icon-disabled": baseColors["red-80"],
  "negative-icon-hover": themeColors["negative"]["icon-hover"],
  "negative-icon-pressed": themeColors["negative"]["icon-pressed"],
  "negative-text": themeColors["negative"]["text"],
  "negative-text-disabled": baseColors["red-80"],
  "negative-text-hover": themeColors["negative"]["text-hover"],
  "negative-text-pressed": themeColors["negative"]["text-pressed"],

  // --- Neutral Variables ---
  "neutral-background": themeColors["neutral"]["background"],
  "neutral-background-disabled": themeColors["neutral"]["background-disabled"],
  "neutral-background-medium": themeColors["neutral"]["background-medium"],
  "neutral-background-strong": themeColors["neutral"]["background-strong"],
  "neutral-background-weak": themeColors["neutral"]["background-weak"],
  "neutral-background-weak-disabled":
    themeColors["neutral"]["background-weak-disabled"],
  "neutral-border": themeColors["neutral"]["border"],
  "neutral-border-medium": themeColors["neutral"]["border-medium"],
  "neutral-border-weak": baseColors["gray-60"],
  "neutral-border-disabled": themeColors["neutral"]["border-disabled"],
  "neutral-icon": themeColors["neutral"]["icon"],
  "neutral-icon-disabled": themeColors["neutral"]["icon-disabled"],
  "neutral-icon-inverse": themeColors["neutral"]["icon-inverse"],
  "neutral-icon-medium": themeColors["neutral"]["icon-medium"],
  "neutral-text": themeColors["neutral"]["text"],
  "neutral-text-disabled": themeColors["neutral"]["text-disabled"],
  "neutral-text-inverse": themeColors["neutral"]["text-inverse"],
  "neutral-text-medium": themeColors["neutral"]["text-medium"],
  "neutral-text-weak": themeColors["neutral"]["text-weak"],

  // --- Positive Variables ---
  "positive-background-disabled": baseColors["green-80"],
  "positive-background-hover": themeColors["positive"]["background-hover"],
  "positive-background-pressed": themeColors["positive"]["background-pressed"],
  "positive-background-strong": baseColors["green-30"],
  "positive-background-strong-hover": baseColors["green-40"],
  "positive-background-strong-pressed": baseColors["green-20"],
  "positive-background-strong-disabled": baseColors["green-80"],
  "positive-border": themeColors["positive"]["border"],
  "positive-border-disabled": baseColors["green-80"],
  "positive-border-hover": themeColors["positive"]["border-hover"],
  "positive-border-pressed": themeColors["positive"]["border-pressed"],
  "positive-icon": themeColors["positive"]["icon"],
  "positive-icon-disabled": baseColors["green-80"],
  "positive-icon-hover": themeColors["positive"]["icon-hover"],
  "positive-icon-pressed": themeColors["positive"]["icon-pressed"],
  "positive-text": themeColors["positive"]["text"],
  "positive-text-disabled": baseColors["green-80"],
  "positive-text-hover": themeColors["positive"]["text-hover"],
  "positive-text-pressed": themeColors["positive"]["text-pressed"],

  // --- Warning Variables ---
  "warning-background": baseColors["yellow-90"],
  "warning-icon": baseColors["yellow-30"],
  "warning-text": baseColors["yellow-30"],
  "warning-border": baseColors["yellow-70"],
} as const satisfies Record<string, string>;

export default deprecatedColorTokens;
