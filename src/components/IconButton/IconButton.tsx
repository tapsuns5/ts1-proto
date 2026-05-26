import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../../utils";
import Icon from "../Icon/Icon";
import { IconButtonProps } from "./IconButton.types";

/**
 * Main props for styles are:
 - `variant`: The visual style of the button (default, neutral, consumer, negative)
 - `size`: The size of the button (default, compact)
 - `withBorder`: Whether the button has a border and a white background included
 */
const IconButton = React.forwardRef<
  HTMLButtonElement,
  IconButtonProps & VariantProps<typeof iconButtonVariants>
>(
  (
    {
      icon,
      className,
      variant = "default",
      size = "default",
      withBorder,
      type = "button",
      ...props
    },
    ref,
  ) => {
    return (
      <button
        className={cn(
          iconButtonVariants({
            variant,
            size,
            withBorder,
            disabled: props.disabled,
          }),
          className,
        )}
        ref={ref}
        data-testid="icon-button-component"
        type={type}
        {...props}
      >
        <Icon name={icon} size="s" />
      </button>
    );
  },
);

const iconButtonVariants = cva(
  [
    "sui-grid sui-place-content-center",
    "sui-rounded-full sui-border sui-border-transparent",
    "active:sui-scale-95",
  ],
  {
    variants: {
      variant: {
        default: [
          "sui-text-admin-action-text",
          "hover:sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover",
          "active:sui-bg-admin-action-background-weak-pressed",
        ],
        neutral: [
          "sui-text-neutral-icon",
          "hover:sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover hover:sui-text-action-icon",
          "active:sui-bg-admin-action-background-weak-pressed",
        ],
        consumer: [
          "sui-text-consumer-action-text",
          "hover:sui-border-consumer-action-border hover:sui-bg-consumer-action-background-weak-hover",
          "active:sui-bg-consumer-action-background-weak-pressed",
        ],
        negative: [
          "sui-text-negative-icon",
          "hover:sui-border-negative-border hover:sui-bg-negative-background-weak-hover",
          "active:sui-bg-negative-background-weak-pressed",
        ],
      },
      size: {
        compact: "sui-h-[32px] sui-w-[32px] sui-min-w-[32px]",
        default: "sui-h-[48px] sui-w-[48px] sui-min-w-[48px]",
      },
      disabled: {
        true: [
          "sui-text-neutral-icon-disabled",
          "hover:sui-border-transparent hover:sui-bg-transparent hover:sui-text-neutral-icon-disabled",
          "active:sui-scale-100",
          "active:sui-bg-transparent",
        ],
      },
      withBorder: {
        true: [
          "sui-bg-white",
          "disabled:sui-border-neutral-border-disabled disabled:sui-bg-white",
        ],
      },
    },
    compoundVariants: [
      {
        variant: "default",
        withBorder: true,
        className: ["sui-border-admin-action-border"],
      },
      {
        variant: "neutral",
        withBorder: true,
        className: ["sui-border-neutral-icon"],
      },
      {
        variant: "consumer",
        withBorder: true,
        className: ["sui-border-consumer-action-border"],
      },
      {
        variant: "negative",
        withBorder: true,
        className: ["sui-border-negative-border"],
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      withBorder: false,
    },
  },
);

export default IconButton;
