import React from "react";
import ActiveCheckbox from "../assets/Icons/ActiveCheckbox";
import DisabledCheckbox from "../assets/Icons/DisabledCheckbox";
import PartialCheckbox from "../assets/Icons/PartialCheckbox";
import UncheckedCheckbox from "../assets/Icons/UncheckedCheckbox";
import classes from "./Checkbox.module.scss";
import { CheckboxProps } from "./Checkbox.types";

/**
 * Secondary description on Storybook Docs. I can have multiple lines and
   bullets!
  - The primary component has:
    - CSS modules
    - Tailwind styles
    - CSS variables
  - To make sure all different CSS channels are working
  */

// NOTE: There is an issue here with the source of truth of the checked value, it looks like the main
// usage in TS apps is via input.props.checked but in the storybook examples we have a main checked prop
// that is not being taken into account to the local isChecked state. We should in some point refactor
// this to avoid confusion, also we need to remove the `[x: string]: any` from the types as its not
// catching prop errors right now

const Checkbox: React.FC<CheckboxProps> = ({
  children,
  label,
  name,
  value,
  disabled,
  className = "",
  extraProps = {},
  isPartial: isIndeterminate,
  errors,
  ...props
}) => {
  const [isChecked, setIsChecked] = React.useState(
    extraProps?.input?.checked || false,
  );
  const hasErrors = errors && errors.length > 0;

  React.useEffect(() => {
    setIsChecked(extraProps?.input?.checked || false);
  }, [extraProps?.input?.checked]);

  const labelProps = {
    htmlFor: value || String(extraProps?.input?.value),
    ...(extraProps.label || {}), // Allow overriding default label props
  };

  const inputProps = {
    type: "checkbox",
    disabled,
    name,
    value,
    id: value || String(extraProps?.input?.value),
    ...(extraProps.input || {}), // Allow overriding default input props
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    if (inputProps.onChange) {
      inputProps.onChange(e);
    }
  };

  let checkedParsed = isChecked ? "checked" : "unchecked";
  if (isIndeterminate && !isChecked) {
    checkedParsed = "partial";
  }

  return (
    <>
      <div
        data-testid="checkbox-component"
        className={[
          classes["checkbox"],
          disabled ? classes["disabled"] : "",
          hasErrors ? classes["input__field--error"] : "",
          checkedParsed === "partial" ? classes["isPartial"] : "",
          className,
        ].join(" ")}
        {...props}
      >
        <input {...inputProps} onChange={handleChange} />

        {checkedParsed === "checked" && (
          <>
            {/* 
              NOTE: When is checked we dont need the disabled checkbox svg as we want
              to show the checked state no matter what, on disabled is becoming gray anyways.
            */}
            <ActiveCheckbox aria-hidden="true" />
          </>
        )}
        {checkedParsed === "unchecked" && (
          <>
            {disabled ? (
              <DisabledCheckbox aria-hidden="true" />
            ) : (
              <UncheckedCheckbox aria-hidden="true" />
            )}
          </>
        )}
        {checkedParsed === "partial" && <PartialCheckbox />}

        <label {...labelProps}>{children || label}</label>
      </div>
      {hasErrors && (
        <div className={classes["input__errors"]}>
          {errors.map((error) => (
            <span
              key={`${name}-${error}`}
              className={`${classes["input__error"]}`}
            >
              {error}
            </span>
          ))}
        </div>
      )}
    </>
  );
};

export default Checkbox;
