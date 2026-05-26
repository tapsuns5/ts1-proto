/**
 * NOTE: Update ModalContainer.test.tsx with all additions and changes!
 */
export type ModalContainerProps = {
  /**
   * Add comments above each prop to see them on storybook. Props with finite
   * options show radio buttons of each option on storybook
   */
  size?: "default" | "large";
  /**
   * Booleans turn into a toggle
   */
  isOpen?: boolean;
  onClose?: () => void;
  closeButton?: boolean;
  disableOverlayClose?: boolean;
  /**
   * Children go between <Component>children</Component>
   */
  children: React.ReactNode;
  /**
   * Any other props to pass along (comment this out when running tests to catch prop errors)
   */
  [x: string]: any;
};
