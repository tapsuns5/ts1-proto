import React from "react";
import { LabelProps } from "./Label.types";
import { cn } from "../../utils";
import Tooltip from "../Tooltip/Tooltip";
import Icon from "../Icon/Icon";

/**
 - The Label component is normally used to display a label for an input field.
 - It can also display a required indicator and a help icon that displays a plain tooltip.
 - Important: If you want to use te tooltip, you need to wrap your app in a TooltipProvider.
 */
const Label: React.FC<LabelProps> = ({
  children,
  required,
  srOnly,
  className,
  showHelpIcon,
  helpIconTooltipContent,
  ...props
}) => {
  return (
    <label
      data-testid="label-component"
      className={cn(
        "sui-rounded sui-label sui-inline-block sui-relative sui-mb-0.5",
        {
          "sui-sr-only": srOnly,
          "sui-flex sui-items-center sui-gap-0.5": showHelpIcon,
        },
        className
      )}
      {...props}>
      {children}
      {required && <span className="sui-text-negative-text">*</span>}
      {showHelpIcon && (
        <Tooltip content={helpIconTooltipContent}>
          <Icon className="sui-text-action-icon" name="info" size="s" />
        </Tooltip>
      )}
    </label>
  );
};

export default Label;
