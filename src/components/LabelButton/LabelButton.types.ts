import { ListOptions } from "../Icon/Icon.types";

/**
 * NOTE: Update Button.test.tsx with all additions and changes!
 */
export type LabelButtonProps = {
  /**
   * The variantType corresponds to the "type" attribute in the Figma file.
   * * "type" is reserved for the button element, so we use "variantType" instead.
   */
  variantType?: "primary" | "secondary" | "tertiary" | "outlined";
  size?: "default" | "large" | "small";
  sentiment?: "default" | "negative" | "success" | "consumer";
  iconPosition?: "left" | "right";
  /**
   * Choose an icon name from the list of available icons. Or leave undefined for no icon.
   */
  icon?: ListOptions;
  /**
   * Label text is the text that appears on the button.
   * Screen reader attributes like "title" and "aria-label" should be passed as additional props.
   */
  labelText?: string;
  disabled?: boolean;
  loading?: boolean;
  /**
   * Children will override the labelText and icon if both are provided.
   */
  children?: React.ReactNode;
  /**
   * All other props to pass along (comment this out when running tests to catch prop errors)
   */
  [x: string]: any;
};
