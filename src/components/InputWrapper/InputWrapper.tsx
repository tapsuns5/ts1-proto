import React from "react";
import HelpText from "../HelpText/HelpText";
import Label from "../Label/Label";
import classes from "./InputWrapper.module.scss";
import { InputWrapperProps } from "./InputWrapper.types";

/**
 * Secondary description on Storybook Docs. I can have multiple lines and
   bullets!
  - The primary component has:
    - CSS modules
    - Tailwind styles
    - CSS variables
  - To make sure all different CSS channels are working
  */
const InputWrapper: React.FC<InputWrapperProps> = ({
  label,
  required,
  name,
  helpText,
  showHelpIcon = false,
  errors,
  children,
  className = "",
  helpIconTooltipContent,
}) => {
  const hasErrors = errors && errors.length > 0;

  return (
    <div
      data-testid={`${name}-input`}
      className={`${classes["input__container"]} ${className}`}
    >
      {label && (
        <Label
          htmlFor={name}
          {...{ required, showHelpIcon, helpIconTooltipContent }}
        >
          {label}
        </Label>
      )}
      {children}
      {(helpText || hasErrors) && (
        <div className={`${classes["input__field--footer"]}`}>
          <div>
            {helpText && !hasErrors && <HelpText>{helpText}</HelpText>}
            {hasErrors &&
              errors.map((error) => (
                <span
                  key={`${name}-${error}`}
                  className={`${classes["input__error"]}`}
                >
                  {error}
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InputWrapper;
