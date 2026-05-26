import React, { forwardRef } from "react";
import * as Slot from "@radix-ui/react-slot";
import classes from "./LabelButton.module.scss";
import { LabelButtonProps } from "./LabelButton.types";
import { cn } from "../../utils";
import Icon from "../Icon/Icon";

/**
 * Set the useType, size, and sentiment to adjust the look of the button, the default look is selected in each case if not specified. 
  - The icon is optional.
  - Set the 'icon' prop to the name of the icon you want to use.
  - Use 'labelText for the button text.
  - If you want to use a custom component instead of icon/text, use the 'children' prop. this will override the icon and labelText props.
  - The button comes with different types, sizes, and sentiments to adjust its look.
  - Add additional props which will be passed to the button element. Such as 'onClick', 'type', 'disabled', etc.
  - Radix slot is used to add the ability to use LabelButton "asChild". This allows for more flexibility. https://www.radix-ui.com/primitives/docs/utilities/slot.

  TODO: Need to add ability to use icons with radix slot.

  */

const LabelButton = forwardRef(
  (
    {
      variantType = "primary",
      size = "default",
      sentiment = "default",
      iconPosition = "left",
      icon,
      labelText,
      disabled,
      loading,
      children,
      className = "",
      asChild = false,
      ...props
    }: LabelButtonProps,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    const loadingState = loading && !disabled ? true : false;
    const typeClass = `type-${variantType}`;
    const sizeClass = `size-${size}`;
    const iconPositionClass = icon ? `icon-${iconPosition}` : "";
    const sentimentClass = `sentiment-${sentiment}`;
    const loadingClass = loadingState ? "is-loading" : "";

    const Comp = asChild ? Slot.Root : "button";

    const buttonContent = (
      <>
        {loadingState && (
          <span className={classes["label-button-loading-wrapper"]}>
            <Icon
              name="progress_activity"
              className={classes["label-button-loading"]}
              size="s"
            />
          </span>
        )}
        {children || (
          <>
            {icon && (
              <Icon
                name={icon}
                className={classes["label-button-icon"]}
                size={size === "small" ? "s" : "default"}
              />
            )}
            {labelText && (
              <span className={classes["label-text"]}>{labelText}</span>
            )}
          </>
        )}
      </>
    );

    return (
      <Comp
        type={asChild ? undefined : "button"}
        data-testid="label-button-component"
        className={cn(
          classes["LabelButton"],
          classes[typeClass],
          classes[sizeClass],
          classes[iconPositionClass],
          classes[sentimentClass],
          classes[loadingClass],
          className
        )}
        disabled={disabled || loadingState}
        ref={ref}
        {...props}>
        {asChild ? children : buttonContent}
      </Comp>
    );
  }
);

export default LabelButton;
