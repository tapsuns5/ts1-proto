import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "../../utils";
import Icon from "../Icon/Icon";
import classes from "./Popover.module.scss";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverClose = PopoverPrimitive.Close;
type PopoverProps = PopoverPrimitive.PopoverProps;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    portal?: boolean;
    arrow?: boolean;
  }
>(
  (
    {
      className,
      align = "start",
      side = "bottom",
      sideOffset = 4,
      portal = true,
      arrow = true,
      children,
      ...props
    },
    ref,
  ) => {
    const MaybePortal = portal ? PopoverPrimitive.Portal : React.Fragment;
    return (
      <MaybePortal>
        <PopoverPrimitive.Content
          data-testid="Popover-content"
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          side={side}
          className={cn(
            classes["Content"],
            "sui-z-50 sui-w-fit sui-rounded sui-border sui-border-solid sui-border-neutral-border sui-bg-white sui-p-2",
            className,
          )}
          {...props}
        >
          {children}
          {arrow && (
            <PopoverPrimitive.Arrow
              className={cn(
                "sui-shadow-lg sui-border-neutral-border [fill:var(--color-neutral-background)]",
              )}
            />
          )}
        </PopoverPrimitive.Content>
      </MaybePortal>
    );
  },
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

const PopoverCloseIcon = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.PopoverClose>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.PopoverClose>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Close
    ref={ref}
    className={cn(
      classes["PopoverCloseIcon"],
      "sui-cursor-pointer sui-p-1 sui-text-neutral-text-weak",
    )}
    aria-label="Close"
    {...props}
  >
    <Icon size="s" name="close" />
  </PopoverPrimitive.Close>
));

export {
  Popover,
  PopoverTrigger,
  PopoverClose,
  PopoverContent,
  PopoverCloseIcon,
  type PopoverProps,
};
