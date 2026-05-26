import React from "react";
import { cn } from "../../utils";
import classes from "./Radio.module.scss";
import { RadioProps } from "./Radio.types";

/**
 * Pass in the "name" prop to group radios together. Then each radio needs a unique "value" prop. 
  - use the `extraProps` object to pass props to the label or input elements such as onChange, onBlur, etc.
  - The primary component has:
    - CSS modules
    - Tailwind styles
    - CSS variables
  - To make sure all different CSS channels are working
  */
const Radio: React.FC<RadioProps> = ({
  children,
  label,
  caption,
  name,
  value,
  disabled,
  className = "",
  extraProps = {},
  ...props
}) => {
  const labelProps = {
    htmlFor: value,
    ...(extraProps.label || {}), // Allow overriding default label props
  };
  const inputProps = {
    type: "radio",
    disabled,
    name,
    value,
    id: value,
    ...(extraProps.input || {}), // Allow overriding default input props
  };

  return (
    <div
      data-testid="radio-component"
      className={cn(classes["radio"], className)}
      {...props}
    >
      <input {...inputProps} />
      <label {...labelProps}>
        {!!children ? (
          children
        ) : (
          <div className="sui-flex sui-flex-col">
            {label && <span>{label}</span>}
            {caption && (
              <span className="sui-text-neutral-text-medium sui-caption">
                {caption}
              </span>
            )}
          </div>
        )}
      </label>
    </div>
  );
};

export default Radio;
