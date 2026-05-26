import React from "react";
import { useBodyScrollLock } from "../../utils";
import IconButton from "../IconButton/IconButton";
import classes from "./ModalContainer.module.scss";
import { ModalContainerProps } from "./ModalContainer.types";

/**
 * Secondary description on Storybook Docs. I can have multiple lines and
   bullets!
  - The primary component has:
    - CSS modules
    - Tailwind styles
    - CSS variables
  - To make sure all different CSS channels are working
  */
const ModalContainer: React.FC<ModalContainerProps> = ({
  size = "md", // Set a default
  isOpen = false,
  onClose = () => {},
  children,
  closeButton = true,
  className = "",
  disableOverlayClose = false,
  ...props
}) => {
  const [_isOpen, _setIsOpen] = React.useState(isOpen);
  const [_animatingOut, _setAnimatingOut] = React.useState(false);

  const { setIsBodyScrollLocked } = useBodyScrollLock();

  React.useEffect(() => {
    if (isOpen) {
      _setIsOpen(true);
      setIsBodyScrollLocked(true);
    } else if (!isOpen && _isOpen && !_animatingOut) {
      _setAnimatingOut(true);
    }
    return () => {
      /*
        NOTE: setIsBodyScrollLocked is not working as expected on cleanup
        we need to natively remove the "scroll-lock" class from the body.
      */
      document.body.classList.remove("scroll-lock");
    };
  }, [isOpen, _isOpen, _animatingOut]);

  return _isOpen ? (
    <div
      className={`${classes[`modal`]} ${!_animatingOut ? classes[`modal-fade-in`] : classes[`modal-fade-out`]}`}
      onAnimationEnd={() => {
        if (_animatingOut) {
          onClose();
          _setIsOpen(false);
          _setAnimatingOut(false);
          setIsBodyScrollLocked(false);
        }
      }}
    >
      <div
        data-testid="modal-container-component"
        className={[
          classes["ModalContainer"],
          classes[`ModalContainer--size-${size}`],
          className,
        ].join(" ")}
        {...props}
      >
        {closeButton && (
          <IconButton
            className={classes["ModalContainer__close-button"]}
            icon="close"
            variant="neutral"
            onClick={onClose}
          />
        )}
        <div className={classes["modal-content"]}>{children}</div>
      </div>
      <div
        className={classes["modal-screen-overlay"]}
        onClick={!disableOverlayClose ? onClose : undefined}
      />
    </div>
  ) : null;
};

export default ModalContainer;
