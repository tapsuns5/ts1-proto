import plugin from "tailwindcss/plugin";
import textBaseUtilities from "./text-base-utilities";

export default plugin(function ({ addUtilities, theme }) {
  const captionStyles = {
    ...textBaseUtilities[".text-base-02"],
    fontFamily: theme("fontFamily.urbanist"),
    fontWeight: theme("fontWeight.regular"),
    lineHeight: "125%",
  };

  const labelSmStyles = {
    ...textBaseUtilities[".text-base-02"],
    fontFamily: theme("fontFamily.urbanist"),
    fontWeight: theme("fontWeight.semibold"),
    lineHeight: "125%",
  };

  const labelStyles = {
    ...textBaseUtilities[".text-base-04"],
    fontFamily: theme("fontFamily.urbanist"),
    fontWeight: theme("fontWeight.semibold"),
    letterSpacing: theme("letterSpacing.wide-3p"),
    lineHeight: "125%",
  };

  const labelLgStyles = {
    ...textBaseUtilities[".text-base-05"],
    fontFamily: theme("fontFamily.urbanist"),
    fontWeight: theme("fontWeight.semibold"),
    lineHeight: "125%",
  };

  const bodyStyles = {
    ...textBaseUtilities[".text-base-05"],
    fontFamily: theme("fontFamily.urbanist"),
    fontWeight: theme("fontWeight.regular"),
    lineHeight: "125%",
  };

  const bodyDenseStyles = {
    ...textBaseUtilities[".text-base-04"],
    fontFamily: theme("fontFamily.urbanist"),
    fontWeight: theme("fontWeight.regular"),
    lineHeight: "125%",
  };

  const navigationStyles = {
    ...textBaseUtilities[".text-base-04"],
    fontFamily: theme("fontFamily.urbanist"),
    fontWeight: theme("fontWeight.regular"),
    letterSpacing: theme("letterSpacing.wide-3p"),
    lineHeight: "125%",
  };

  const headingSmStyles = {
    ...textBaseUtilities[".text-base-06"],
    fontFamily: theme("fontFamily.urbanist"),
    fontWeight: theme("fontWeight.bold"),
    lineHeight: "125%",
  };

  const headingMdStyles = {
    ...textBaseUtilities[".text-base-08"],
    fontFamily: theme("fontFamily.urbanist"),
    fontWeight: theme("fontWeight.bold"),
    lineHeight: "125%",
  };

  const headingLgStyles = {
    ...textBaseUtilities[".text-base-10"],
    fontFamily: theme("fontFamily.urbanist"),
    fontWeight: theme("fontWeight.bold"),
    lineHeight: "125%",
  };

  const displaySmStyles = {
    ...textBaseUtilities[".text-base-08"],
    fontFamily: theme("fontFamily.magno"),
    fontWeight: theme("fontWeight.extrabold"),
    lineHeight: "100%",
  };

  const displayMdStyles = {
    ...textBaseUtilities[".text-base-12"],
    fontFamily: theme("fontFamily.magno"),
    fontWeight: theme("fontWeight.extrabold"),
    letterSpacing: theme("letterSpacing.wide-1p"),
    lineHeight: "100%",
  };

  const displayLgStyles = {
    ...textBaseUtilities[".text-base-13"],
    fontFamily: theme("fontFamily.magno"),
    fontWeight: theme("fontWeight.extrabold"),
    letterSpacing: theme("letterSpacing.wide-1p"),
    lineHeight: "100%",
  };

  const displayXlStyles = {
    ...textBaseUtilities[".text-base-14"],
    fontFamily: theme("fontFamily.magno"),
    fontWeight: theme("fontWeight.extrabold"),
    letterSpacing: theme("letterSpacing.wide-1p"),
    lineHeight: "100%",
  };

  addUtilities({
    // Caption — .text-caption (→ sui-text-caption) and .caption (→ sui-caption)
    ".text-caption": captionStyles,
    ".caption": captionStyles,
    // Labels
    ".text-label-sm": labelSmStyles,
    ".label-sm": labelSmStyles,
    ".text-label": labelStyles,
    ".label": labelStyles,
    ".text-label-lg": labelLgStyles,
    ".label-lg": labelLgStyles,
    // Body
    ".text-body": bodyStyles,
    ".body": bodyStyles,
    ".text-body-dense": bodyDenseStyles,
    ".body-dense": bodyDenseStyles,
    // Navigation
    ".text-navigation": navigationStyles,
    ".navigation": navigationStyles,
    // Headings
    ".text-heading-sm": headingSmStyles,
    ".heading-sm": headingSmStyles,
    ".text-heading-md": headingMdStyles,
    ".heading-md": headingMdStyles,
    ".text-heading-lg": headingLgStyles,
    ".heading-lg": headingLgStyles,
    // Display
    ".text-display-sm": displaySmStyles,
    ".display-sm": displaySmStyles,
    ".text-display-md": displayMdStyles,
    ".display-md": displayMdStyles,
    ".text-display-lg": displayLgStyles,
    ".display-lg": displayLgStyles,
    ".text-display-xl": displayXlStyles,
    ".display-xl": displayXlStyles,
  });
});
