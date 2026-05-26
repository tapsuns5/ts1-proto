import type { Config } from "tailwindcss";
import deprecatedBaseColors from "./src/design-tokens/deprecated-base-colors";
import deprecatedColorTokens from "./src/design-tokens/deprecated-color-tokens";
import deprecatedFontSizes from "./src/design-tokens/deprecated-font-sizes";
import deprecatedTextUtilities from "./src/design-tokens/deprecated-text-utilities";
import spacing from "./src/design-tokens/spacing";
import textBaseUtilities from "./src/design-tokens/text-base-utilities";
import textSemanticsComponentsPlugin from "./src/design-tokens/text-semantics-components-plugin";
import themeColors from "./src/design-tokens/theme.colors";
import themeTypography from "./src/design-tokens/theme.typography";

const config: Config = {
  prefix: "sui-",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      // Deprecated breakpoints for legacy support
      t: "500px",
      d: "1024px",
    },
    colors: {
      ...deprecatedBaseColors,
      ...deprecatedColorTokens,
      ...themeColors,
      transparent: "transparent",
    },
    spacing: {
      ...spacing,
    },
    gap: {
      ...spacing,
    },
    borderSpacing: {
      ...spacing,
    },
    borderWidth: {
      DEFAULT: "1px",
      0: "0px",
      2: "2px",
      4: "4px",
      8: "8px",
    },
    boxShadow: {
      up: "0px -10px 30px rgba(0, 0, 0, 0.03)",
      none: "none",
      1: "0.267px 1.982px 7px 0px rgba(0, 0, 0, 0.14), 0.135px 1.003px 3.052px 0px rgba(0, 0, 0, 0.04), 0.053px 0.396px 1.138px 0px rgba(0, 0, 0, 0.05), 0.012px 0px 0.405px 0px rgba(0, 0, 0, 0.02)",
      2: " 1.201px 6px 16px 0px rgba(0, 0, 0, 0.12), 0.608px 2px 6.975px 0px rgba(0, 0, 0, 0.05), 0.24px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 0px 0.05px 0px rgba(0, 0, 0, 0.04)",
      3: "3.335px 12px 31px 0px rgba(0, 0, 0, 0.10), 1.688px 6px 13.514px 0px rgba(0, 0, 0, 0.05), 0.667px 2px 5.037px 0px rgba(0, 0, 0, 0.04), 0.146px 0px 1.792px 0px rgba(0, 0, 0, 0.02)",
      4: "6.803px 25px 51px 0px rgba(0, 0, 0, 0.07), 3.444px 10px 22.233px 0px rgba(0, 0, 0, 0.05), 1.361px 5px 8.288px 0px rgba(0, 0, 0, 0.04), 0.298px 0px 2.948px 0px rgba(0, 0, 0, 0.02)",
      5: "10.138px 50px 76px 0px rgba(0, 0, 0, 0.07), 5.133px 20px 33.131px 0px rgba(0, 0, 0, 0.05), 2.028px 5px 12.35px 0px rgba(0, 0, 0, 0.04), 0.444px 0px 4.394px 0px rgba(0, 0, 0, 0.02)",
    },
    fontFamily: {
      ...(themeTypography.fontFamily as any),
      sans: [
        "'Open sans'",
        "'HelveticaNeue-Light'",
        "'Helvetica Neue Light'",
        "'Helvetica Neue'",
        "Helvetica",
        "Arial",
        "'Lucida Grande'",
        "sans-serif",
      ],
    },
    fontSize: {
      ...deprecatedFontSizes,
    },
    fontWeight: {
      thin: "100",
      extralight: "200",
      light: "300",
      normal: "400",
      black: "900",
      ...themeTypography.fontWeight,
    },
    lineHeight: {
      none: "1",
      16: "1rem",
      24: "1.5rem",
      32: "2rem",
      40: "2.5rem",
      48: "3rem",
    },
    letterSpacing: {
      tight: "-0.03em",
      normal: "0em",
      wide: "0.03em",
      ...themeTypography.letterSpacing,
    },
    listStyleType: {
      none: "none",
      disc: "disc",
      decimal: "decimal",
    },
    margin: {
      auto: "auto",
      ...spacing,
    },
    extend: {
      transitionDuration: {
        "250": "250ms",
      },
    },
  },
  plugins: [
    function ({ addBase, addUtilities, config }: any) {
      // Create an object to hold our CSS variables
      const newBase: { [key: string]: { [key: string]: string } } = {
        ":root": {},
      };

      const deprecatedSpacingUsage = config("theme.spacing");
      for (const [key, value] of Object.entries(deprecatedSpacingUsage)) {
        const sanitizedKey = key.replace(/\./g, "-"); // Replace invalid characters
        newBase[":root"][`--sui-spacing-${sanitizedKey}`] = String(value);
      }

      // Add the :root object to the base styles
      addBase(newBase);

      const lineHeights = config("theme.lineHeight");
      addUtilities({
        ...deprecatedTextUtilities(lineHeights),
        ...textBaseUtilities,
      });
    },
    textSemanticsComponentsPlugin,
  ],
};

export default config;
