import { IconProps } from "../Icon/Icon.types";

/**
 * NOTE: Update ActionMenu.test.tsx with all additions and changes!
 */
export type ActionMenuProps = {
  actions: ActionType[];
  isOpen?: boolean;
  onClose?: () => void;
  align?: "left" | "right" | "center";
  trigger?: React.ReactNode;

  /**
   * Any other props to pass along (comment this out when running tests to catch prop errors)
   */
  [x: string]: any;
};

export type ActionType = {
  icon?: IconProps["name"];
  label?: string;
  sentiment?: "default" | "negative";
  onClick: (e?: React.MouseEvent) => void;
  disabled?: boolean;
};
