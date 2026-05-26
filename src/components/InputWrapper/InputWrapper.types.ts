import React from 'react';

/**
 * NOTE: Update InputWrapper.test.tsx with all additions and changes!
 */
export type InputWrapperProps = {
  label?: string;
  required?: boolean;
  name: string;
  helpText?: string;
  showHelpIcon?: boolean;
  errors?: string[];
  /**
   * apply classes to the outer wrapper
   */
  className?: string;
  /**
   * Children go between `<Component>children</Component>`
   */
  children: React.ReactNode;
  /**
   * Optional text for the help icon tooltip
   */
  helpIconTooltipContent?: React.ReactNode;
  /**
   * All other props to pass along (comment this out when running tests to catch prop errors)
   */
  [x: string]: any;
};
