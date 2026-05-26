import React from "react";
import Person from "../assets/Icons/Person";
import classes from "./Avatar.module.scss";
import { AvatarProps } from "./Avatar.types";

/**
 * Secondary description on Storybook Docs. I can have multiple lines and
   bullets!
  - The primary component has:
    - CSS modules
    - Tailwind styles
    - CSS variables
  - To make sure all different CSS channels are working
  */
const Avatar: React.FC<AvatarProps> = ({
  type,
  size = "default",
  initials = "",
  src = "",
  className = "",
  ...props
}) => {
  return (
    <div
      data-testid="avatar-component"
      className={[
        classes["avatar"],
        classes[type],
        classes[`size-${size}`],
        className,
      ].join(" ")}
      {...props}
    >
      {type === "picture" && (
        <img className={classes["avatar-image"]} src={src} alt="Avatar" />
      )}

      {type === "initials" && (
        <span className={classes["avatar-initials"]}>{initials}</span>
      )}
      {type === "placeholder" && (
        <Person className={classes["avatar-placeholder"]} />
      )}
    </div>
  );
};

export default Avatar;
