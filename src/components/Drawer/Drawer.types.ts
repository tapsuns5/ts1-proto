import React from 'react';

/**
 * NOTE: Update Drawer.test.tsx with all additions and changes!
 */
export type DrawerProps = {
  title: React.ReactNode;
  placement?: 'right' | 'left';
  showOverlay?: boolean;
  allowOverlayClose?: boolean;
  allowBodyScroll?: boolean;
  allowEscapeKey?: boolean;
  size?: 'small' | 'medium' | 'large';
  open: boolean;
  onCloseClick?: () => any;
  onClickOutside?: () => any;
  testId: string;
  className?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  extraProps?: {
    drawer?: {
      [x: string]: any;
    } & React.HTMLAttributes<HTMLDivElement>;
    overlay?: {
      [x: string]: any;
    } & React.HTMLAttributes<HTMLDivElement>;
  };
};
