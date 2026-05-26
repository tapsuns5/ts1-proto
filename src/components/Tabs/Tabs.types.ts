import React from "react";

/**
 * NOTE: Update Tabs.test.tsx with all additions and changes!
 */
export type TabsProps = {
  tabs: {
    label: string;
    content: React.ReactNode;
    value: string;
  }[];
  /**
   * Callback when tab is changed. Returns the index of newly selected tab
   */
  onChange?: (currentTab: string) => void;
  /**
   * Currently selected tab value
   */
  defaultValue?: string;
  /**
   * Currently selected tab value
   */
  value?: string;
  /**
   * Aria label for tab list
   */
  ariaLabel?: string;
  /**
   * Additional class names for the tab list
   */
  className?: string;
  /**
   * Additional class names for the edges scroll gradient
   */
  edgeGradientClassName?: string;
  /**
   * Defines behavior when a tab trigger is clicked
   */
  onTabClick?: (tabValue: string) => void;
  /**
   * VariantType corresponds to the "type" attribute in the Figma file.
   * Default is 'admin'
   */
  variantType?: "admin" | "consumer";
};
