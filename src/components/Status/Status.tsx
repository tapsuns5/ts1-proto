import React from "react";
import classes from "./Status.module.scss";
import { StatusProps } from "./Status.types";
import { cn } from "../../utils";

/**
 * Secondary description on Storybook Docs. I can have multiple lines and
   bullets!
  - The primary component has:
    - CSS modules
    - Tailwind styles
    - CSS variables
  - To make sure all different CSS channels are working
  */
const Status: React.FC<StatusProps> = ({
  testId,
  state, // Set a default
  text,
  dot,
  children,
  className = "",
  ...props
}) => {
  if (dot) {
    return (
      <div data-testid={testId} className={classes["status-dot"]}>
        <div className={classes["status-dot-circle"]}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none">
            <circle
              className={classes[`status--${state}`]}
              cx="4"
              cy="4"
              r="4"
            />
          </svg>
        </div>
        {children || text}
      </div>
    );
  }
  return (
    <div
      data-testid={testId}
      className={cn(classes["status"], classes[`status--${state}`], className)}
      {...props}>
      {children || text}
    </div>
  );
};

export default Status;
