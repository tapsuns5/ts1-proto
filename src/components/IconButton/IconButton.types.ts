import { type ButtonHTMLAttributes } from "react";

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  // Use a plain string because icon sets vary across projects.
  // We should decide on a better way to handle icon names in the future.
  /**
   * Icon is the name of the icon to use in the button
   */
  icon: string;
};
