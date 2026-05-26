import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils";
import Icon from "../Icon/Icon";
import { type TextLinkProps } from "./TextLink.types";

const TextLink = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  TextLinkProps
>(
  (
    {
      variantType = "primary",
      sentiment = "default",
      disabled = false,
      icon,
      iconPosition = "left",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const iconElement = icon ? (
      <Icon name={icon} size="s" className="sui-leading-none" />
    ) : null;

    const content = (
      <>
        {iconPosition === "left" && iconElement}
        <span className="sui-text-label">{children}</span>
        {iconPosition === "right" && iconElement}
      </>
    );

    const classes = cn(
      textLinkVariants({ variantType, sentiment, disabled: !!disabled }),
      className,
    );

    if ("href" in props && props.href != null) {
      const {
        href,
        onClick,
        onMouseDown,
        onKeyDown,
        onKeyUp,
        tabIndex,
        ...anchorProps
      } = props;
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
          {...(disabled
            ? anchorProps
            : {
                href,
                onClick,
                onMouseDown,
                onKeyDown,
                onKeyUp,
                tabIndex,
                ...anchorProps,
              })}
          aria-disabled={disabled ? true : undefined}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        className={classes}
        disabled={!!disabled}
        {...props}
      >
        {content}
      </button>
    );
  },
);

TextLink.displayName = "TextLink";

export { TextLink };

export const textLinkVariants = cva(
  [
    "sui-no-underline",
    "sui-bg-transparent",
    "sui-p-0",
    "sui-cursor-pointer",
    "sui-inline-flex",
    "sui-items-center",
    "sui-align-middle",
    "sui-w-fit",
    "sui-gap-0.5",
    "sui-border-b sui-border-solid sui-border-transparent sui-pb-px",
  ],
  {
    variants: {
      variantType: {
        primary: [
          "sui-text-admin-action-text",
          "hover:sui-text-admin-action-text-hover",
          "hover:[border-color:currentColor]",
          "focus:sui-text-admin-action-text-pressed",
          "focus:[border-color:currentColor]",
          "active:sui-text-admin-action-text-pressed",
          "active:[border-color:currentColor]",
          "visited:sui-text-admin-action-text-pressed",
        ],
        secondary: [
          "sui-text-neutral-text",
          "hover:sui-text-admin-action-text-hover",
          "hover:[border-color:currentColor]",
          "focus:sui-text-admin-action-text-pressed",
          "focus:[border-color:currentColor]",
          "active:sui-text-admin-action-text-pressed",
          "active:[border-color:currentColor]",
          "visited:sui-text-admin-action-text-pressed",
        ],
      },
      sentiment: {
        default: "",
        info: "",
        neutral: "",
        warning: "",
        negative: "",
        success: "",
      },
      disabled: {
        true: [
          "sui-text-neutral-text-disabled",
          "sui-cursor-default",
          "sui-pointer-events-none",
          "hover:sui-text-neutral-text-disabled",
          "hover:sui-border-transparent",
          "focus:sui-text-neutral-text-disabled",
          "focus:sui-border-transparent",
          "active:sui-text-neutral-text-disabled",
          "active:sui-border-transparent",
        ],
        false: "",
      },
    },
    compoundVariants: [
      {
        variantType: "primary",
        sentiment: "negative",
        disabled: false,
        className: [
          "sui-text-negative-text",
          "hover:sui-text-negative-text-hover",
          "hover:[border-color:currentColor]",
          "focus:sui-text-negative-text-pressed",
          "focus:[border-color:currentColor]",
          "active:sui-text-negative-text-pressed",
          "active:[border-color:currentColor]",
          "visited:sui-text-negative-text-pressed",
        ],
      },
      {
        variantType: "primary",
        sentiment: "success",
        disabled: false,
        className: [
          "sui-text-positive-text",
          "hover:sui-text-positive-text-hover",
          "hover:[border-color:currentColor]",
          "focus:sui-text-positive-text-pressed",
          "focus:[border-color:currentColor]",
          "active:sui-text-positive-text-pressed",
          "active:[border-color:currentColor]",
          "visited:sui-text-positive-text-pressed",
        ],
      },
    ],
    defaultVariants: {
      variantType: "primary",
      sentiment: "default",
      disabled: false,
    },
  },
);
