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
    ".text-caption": captionStyles as any,
    ".caption": captionStyles as any,
    // Labels
    ".text-label-sm": labelSmStyles as any,
    ".label-sm": labelSmStyles as any,
    ".text-label": labelStyles as any,
    ".label": labelStyles as any,
    ".text-label-lg": labelLgStyles as any,
    ".label-lg": labelLgStyles as any,
    // Body
    ".text-body": bodyStyles as any,
    ".body": bodyStyles as any,
    ".text-body-dense": bodyDenseStyles as any,
    ".body-dense": bodyDenseStyles as any,
    // Navigation
    ".text-navigation": navigationStyles as any,
    ".navigation": navigationStyles as any,
    // Headings
    ".text-heading-sm": headingSmStyles as any,
    ".heading-sm": headingSmStyles as any,
    ".text-heading-md": headingMdStyles as any,
    ".heading-md": headingMdStyles as any,
    ".text-heading-lg": headingLgStyles as any,
    ".heading-lg": headingLgStyles as any,
    // Display
    ".text-display-sm": displaySmStyles as any,
    ".display-sm": displaySmStyles as any,
    ".text-display-md": displayMdStyles as any,
    ".display-md": displayMdStyles as any,
    ".text-display-lg": displayLgStyles as any,
    ".display-lg": displayLgStyles as any,
    ".text-display-xl": displayXlStyles as any,
    ".display-xl": displayXlStyles as any,
  });
});
