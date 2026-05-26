import React from "react";
import classes from "./Toggle.module.scss";
import { ToggleProps } from "./Toggle.types";

/**
 * Atomic component for toggling a boolean value.
  - The primary component has:
    - CSS modules
    - Tailwind styles
    - CSS variables
  - To make sure all different CSS channels are working
  - use 'onChange' to get the value of the toggle, or onClick to set the value of the toggle as a controlled input
  */
const Toggle: React.FC<
  ToggleProps & React.InputHTMLAttributes<HTMLInputElement>
> = ({ on, onClick, name, className = "", ...props }) => {
  const inputProps = onClick
    ? {
        onClick,
        checked: on,
        readOnly: true,
        ...props,
      }
    : {
        defaultChecked: on,
        ...props,
      };

  return (
    <input
      data-testid="toggle-component"
      className={[classes["toggle"], className].join(" ")}
      type="checkbox"
      name={name}
      id={name}
      {...inputProps}
    />
  );
};

export default Toggle;
