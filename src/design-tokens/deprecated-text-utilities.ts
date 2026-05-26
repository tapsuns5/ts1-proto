import deprecatedFontSizes from "./deprecated-font-sizes";

export default function deprecatedTextUtilities(
  lineHeights: Record<string, string>,
) {
  return {
    ".font-size-1": {
      fontSize: deprecatedFontSizes["mobile-1"],
      lineHeight: lineHeights["16"],
      "@screen t": {
        fontSize: deprecatedFontSizes["desktop-1"],
      },
    },
    ".font-size-2": {
      fontSize: deprecatedFontSizes["mobile-2"],
      lineHeight: lineHeights["16"],
      "@screen t": {
        fontSize: deprecatedFontSizes["desktop-2"],
      },
    },
    ".font-size-3": {
      fontSize: deprecatedFontSizes["mobile-3"],
      lineHeight: lineHeights["16"],
      "@screen t": {
        fontSize: deprecatedFontSizes["desktop-3"],
      },
    },
    ".font-size-4": {
      fontSize: deprecatedFontSizes["mobile-4"],
      lineHeight: lineHeights["16"],
      "@screen t": {
        fontSize: deprecatedFontSizes["desktop-4"],
      },
    },
    ".font-size-5": {
      fontSize: deprecatedFontSizes["mobile-5"],
      lineHeight: lineHeights["24"],
      "@screen t": {
        fontSize: deprecatedFontSizes["desktop-5"],
      },
    },
    ".font-size-6": {
      fontSize: deprecatedFontSizes["mobile-6"],
      lineHeight: lineHeights["24"],
      "@screen t": {
        fontSize: deprecatedFontSizes["desktop-6"],
      },
    },
    ".font-size-7": {
      fontSize: deprecatedFontSizes["mobile-7"],
      lineHeight: lineHeights["24"],
      "@screen t": {
        fontSize: deprecatedFontSizes["desktop-7"],
      },
    },
    ".font-size-8": {
      fontSize: deprecatedFontSizes["mobile-8"],
      lineHeight: lineHeights["24"],
      "@screen t": {
        fontSize: deprecatedFontSizes["desktop-8"],
        lineHeight: lineHeights["32"],
      },
    },
    ".font-size-9": {
      fontSize: deprecatedFontSizes["mobile-9"],
      lineHeight: lineHeights["24"],
      "@screen t": {
        fontSize: deprecatedFontSizes["desktop-9"],
        lineHeight: lineHeights["32"],
      },
    },
    ".font-size-10": {
      fontSize: deprecatedFontSizes["mobile-10"],
      lineHeight: lineHeights["24"],
      "@screen t": {
        fontSize: deprecatedFontSizes["desktop-10"],
        lineHeight: lineHeights["32"],
      },
    },
    ".font-size-11": {
      fontSize: deprecatedFontSizes["mobile-11"],
      lineHeight: lineHeights["32"],
      "@screen t": {
        fontSize: deprecatedFontSizes["desktop-11"],
        lineHeight: lineHeights["48"],
      },
    },
    ".font-size-12": {
      fontSize: deprecatedFontSizes["mobile-12"],
      lineHeight: lineHeights["32"],
      "@screen t": {
        fontSize: deprecatedFontSizes["desktop-12"],
        lineHeight: lineHeights["48"],
      },
    },
    ".heading-lg": {
      fontSize: deprecatedFontSizes["mobile-10"],
      fontWeight: "700",
      lineHeight: lineHeights["24"],
      "@screen t": {
        fontSize: deprecatedFontSizes["desktop-10"],
        lineHeight: lineHeights["32"],
      },
    },
    ".heading-md": {
      fontSize: deprecatedFontSizes["mobile-8"],
      fontWeight: "700",
      lineHeight: lineHeights["24"],
      "@screen t": {
        fontSize: deprecatedFontSizes["desktop-8"],
        lineHeight: lineHeights["32"],
      },
    },
    ".heading-sm": {
      fontSize: deprecatedFontSizes["mobile-6"],
      fontWeight: "700",
      lineHeight: lineHeights["24"],
      "@screen t": {
        fontSize: deprecatedFontSizes["desktop-6"],
        lineHeight: lineHeights["32"],
      },
    },
    ".body": {
      fontSize: deprecatedFontSizes["mobile-5"],
      lineHeight: lineHeights["24"],
      "@screen t": {
        fontSize: deprecatedFontSizes["desktop-5"],
      },
    },
    ".body-dense": {
      fontSize: deprecatedFontSizes["mobile-4"],
      lineHeight: lineHeights["16"],
      "@screen t": {
        fontSize: deprecatedFontSizes["desktop-4"],
      },
    },
    ".label": {
      fontSize: deprecatedFontSizes["mobile-4"],
      lineHeight: lineHeights["16"],
      fontWeight: "600",
      letterSpacing: "0.03em",
      "@screen t": {
        fontSize: deprecatedFontSizes["desktop-4"],
        lineHeight: lineHeights["24"],
      },
    },
    ".navigation": {
      fontSize: deprecatedFontSizes["mobile-4"],
      lineHeight: lineHeights["16"],
      fontWeight: "600",
      letterSpacing: "0.03em",
      "@screen t": {
        fontSize: deprecatedFontSizes["desktop-4"],
        lineHeight: lineHeights["24"],
      },
    },
    ".caption": {
      fontSize: deprecatedFontSizes["mobile-2"],
      lineHeight: lineHeights["16"],
      "@screen t": {
        fontSize: deprecatedFontSizes["desktop-2"],
      },
    },
  };
}
