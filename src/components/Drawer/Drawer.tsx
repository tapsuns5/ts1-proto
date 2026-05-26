import React, { ReactNode } from "react";
import {
  cn,
  getClassName,
  useBodyScrollLock,
  useOnClickOutside,
} from "../../utils";
import IconButton from "../IconButton/IconButton";
import classes from "./Drawer.module.scss";
import { type DrawerProps } from "./Drawer.types";

/**
 * Secondary description on Storybook Docs. I can have multiple lines and
 bullets!
 - The primary component has:
 - CSS modules
 - Tailwind styles
 - CSS variables
 - To make sure all different CSS channels are working
 */
const Drawer: React.FC<DrawerProps> & {
  Header: React.FC<DrawerSectionProps & React.HTMLAttributes<HTMLDivElement>>;
  Content: React.FC<DrawerSectionProps & React.HTMLAttributes<HTMLDivElement>>;
  Footer: React.FC<DrawerSectionProps & React.HTMLAttributes<HTMLDivElement>>;
} = ({
  title,
  placement = "right",
  children,
  open,
  size = "small",
  onCloseClick,
  onClickOutside,
  showOverlay = true,
  allowOverlayClose = true,
  allowEscapeKey = false,
  allowBodyScroll = true,
  testId,
  extraProps,
  className,
  footer,
}) => {
  const [_isOpen, _setIsOpen] = React.useState(open);
  const [_animatingOut, _setAnimatingOut] = React.useState(false);

  const hasDrawerHeader = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === DrawerHeader,
  );

  const hasDrawerContent = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === DrawerHeader,
  );

  const hasDrawerFooter = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === DrawerHeader,
  );

  React.useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (allowEscapeKey && e.key === "Escape") {
        onCloseClick?.();
      }
    };

    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [allowEscapeKey, onCloseClick]);

  React.useEffect(() => {
    if (open) {
      _setIsOpen(true);
    } else if (!open && _isOpen && !_animatingOut) {
      _setAnimatingOut(true);
    }
  }, [open, _isOpen, _animatingOut]);

  const drawerClasses = getClassName(
    classes["drawer"],
    classes[`drawer--placement-${placement}`],
    classes[`drawer--${size}`],
    !_animatingOut
      ? classes[`drawer--slide-in-${placement}`]
      : classes[`drawer--slide-out-${placement}`],
    hasDrawerHeader ? "sui-overflow-hidden" : "",
    className,
  );

  const overlayClasses = getClassName(
    classes["drawer-overlay"],
    onClickOutside ? classes[`drawer-overlay--clickable`] : "",
    !_animatingOut
      ? classes[`drawer-overlay--fade-in`]
      : classes[`drawer-overlay--fade-out`],
  );

  const ref = React.useRef<HTMLDivElement>(null);

  const { setIsBodyScrollLocked } = useBodyScrollLock();

  const handleClickOutside = React.useCallback(() => {
    if (allowOverlayClose && onClickOutside && open) {
      setIsBodyScrollLocked(false);
      onClickOutside();
    }
  }, [allowOverlayClose, onClickOutside, open]);

  useOnClickOutside(ref as React.RefObject<HTMLElement>, handleClickOutside);

  React.useEffect(() => {
    setIsBodyScrollLocked(!allowBodyScroll && open);
    return () => setIsBodyScrollLocked(false);
  }, [open, allowBodyScroll]);

  return _isOpen ? (
    <>
      <div
        {...extraProps?.drawer}
        ref={ref}
        className={drawerClasses}
        data-testid={testId}
        onAnimationEnd={() => {
          if (_animatingOut) {
            onCloseClick?.();
            _setIsOpen(false);
            _setAnimatingOut(false);
          }
        }}
      >
        {!hasDrawerHeader && (
          <div className={classes["drawer--header"]}>
            {title}
            {onCloseClick && (
              <IconButton
                icon="close"
                onClick={onCloseClick}
                className="sui-ml-auto sui-text-gray-7"
                size="compact"
              />
            )}
          </div>
        )}

        {!hasDrawerContent && (
          <div className={classes["drawer--content"]}>{children}</div>
        )}
        {!hasDrawerFooter && (
          <>
            {footer && (
              <div className={classes["drawer--footer"]}>{footer}</div>
            )}
          </>
        )}

        {(hasDrawerHeader || hasDrawerContent || hasDrawerFooter) && (
          <>{children}</>
        )}
      </div>
      {showOverlay && (
        <div {...extraProps?.overlay} className={overlayClasses} />
      )}
    </>
  ) : (
    <></>
  );
};

export default Drawer;

interface DrawerSectionProps {
  children: ReactNode;
}

const DrawerHeader: React.FC<
  DrawerSectionProps & React.HTMLAttributes<HTMLDivElement>
> = ({ children, ...props }) => {
  const { className } = props;
  return (
    <div
      {...props}
      className={cn(
        classes["drawer--header"],
        classes["drawer--header-component"],
        className,
      )}
    >
      {children}
    </div>
  );
};

const DrawerContent: React.FC<
  DrawerSectionProps & React.HTMLAttributes<HTMLDivElement>
> = ({ children, ...props }) => {
  const { className } = props;
  return (
    <div
      {...props}
      className={cn(
        "sui-flex-1 sui-overflow-y-auto",
        classes["drawer--content"],
        classes["drawer--content-component"],
        className,
      )}
    >
      {children}
    </div>
  );
};

const DrawerFooter: React.FC<
  DrawerSectionProps & React.HTMLAttributes<HTMLDivElement>
> = ({ children, ...props }) => {
  const { className } = props;
  return (
    <div
      {...props}
      className={cn(
        classes["drawer--footer"],
        classes["drawer--footer-component"],
        className,
      )}
    >
      {children}
    </div>
  );
};

Drawer.Header = DrawerHeader;
Drawer.Content = DrawerContent;
Drawer.Footer = DrawerFooter;
