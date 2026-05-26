import { forwardRef } from "react";
import classes from "./Icon.module.scss";
import { IconProps } from "./Icon.types";
import { codepoints } from "./codepoints";
import { Division, StarEllipse } from "../assets/Icons";

/**
 * All icons we support are listed in the name dropdown. Choose a different one to see what each looks like.
 *
 * Figma for icons: https://www.figma.com/file/PVOAptZzuusZjr05qY0dJO/%F0%9F%92%BB-Web-App-%E2%80%94-Foundations?type=design&node-id=3%3A1014&mode=design&t=Jl3S9NBcxcb3yJ3P-1
 */

export const getCodepoint = (name: string) => {
  try {
    const codePoint = parseInt(codepoints[name as keyof typeof codepoints], 16);
    return String.fromCodePoint(codePoint);
  } catch (_e) {
    return name;
  }
};

const Icon = forwardRef<HTMLSpanElement, IconProps>(
  (
    { name, size = "default", filled = false, className = "", ...props },
    ref
  ) => {
    const sizeClass = `sz-${size}`;
    const dataTestId = "icon-component";

    switch (name) {
      case "star_ellipse":
        return (
          // @ts-expect-error StarEllipse should accept onClick
          <StarEllipse
            name={name}
            data-testid={dataTestId}
            className={[
              classes["Icon"],
              classes[sizeClass],
              classes[`Icon__icon-${name}`],
              className,
            ].join(" ")}
            {...props}
          />
        );
      case "division":
        return (
          // @ts-expect-error Division should accept onClick
          <Division
            data-testid={dataTestId}
            className={[
              classes["Icon"],
              classes[sizeClass],
              classes[`Icon__icon-${name}`],
              className,
            ].join(" ")}
            {...props}
          />
        );
      default:
        const iconCode = getCodepoint(name);
        return (
          <span
            ref={ref}
            data-testid={dataTestId}
            className={[
              classes["Icon"],
              "material-symbols-rounded",
              classes[sizeClass],
              filled ? classes["filled"] : null,
              classes[`Icon__icon-${name}`],
              className,
            ].join(" ")}
            {...props}>
            {iconCode}
          </span>
        );
    }
  }
);

export default Icon;
