/**
 * NOTE: Update CopiedTooltip.test.tsx with all additions and changes!
 */
export type CopiedTooltipProps = {
  /**
   * disable the button
   */
  disabled?: boolean;
  /**
   * Label for the "Copy" tooltip
   */
  copyLabel?: string;
  /**
   * The text to copy to clipboard
   */
  textToCopy: string;
  /**
   * Children will override the icon button if both are provided.
   */
  children?: React.ReactNode;
};
