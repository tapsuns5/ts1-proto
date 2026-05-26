import React from 'react';

/**
 * NOTE: Update Status.test.tsx with all additions and changes!
 */
export type StatusProps = {
  testId?: string;
  state: 'success' | 'warning' | 'negative' | 'inactive' | 'info';
  text?: React.ReactNode;
  dot?: boolean;
  /**
   * Children go between <Component>children</Component>
   */
  children?: React.ReactNode;
  /**
   * Any other props to pass along (comment this out when running tests to catch prop errors)
   */
  [x: string]: any;
};
