import React, { ElementRef } from 'react';

/**
 * NOTE: Update Label.test.tsx with all additions and changes!
 */
export type LabelProps = {
  required?: boolean;
  showHelpIcon?: boolean;
  srOnly?: boolean;
  /**
   * should match the id of the input it is labelling
   */
  htmlFor: string;
  /**
   * Children go between <Component>children</Component>
   */
  children?: React.ReactNode;
  /**
   * Optional text for the help icon tooltip
   */
  helpIconTooltipContent?: React.ReactNode;
  /**
   * Any other props to pass along (comment this out when running tests to catch prop errors)
   */
  // [x: string]: any;
} & React.HTMLAttributes<HTMLLabelElement>;
