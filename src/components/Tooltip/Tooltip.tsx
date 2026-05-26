import React, {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  ReactNode,
} from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "../../utils";
import LabelButton from "../LabelButton/LabelButton";
import { LabelButtonProps } from "../LabelButton/LabelButton.types";

const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipPortal = TooltipPrimitive.Portal;

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = ({
  children,
  content,
  align = "center",
  side = "top",
  delayDuration = 100,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> & {
  content?: ReactNode;
  align?: TooltipPrimitive.TooltipContentProps["align"];
  side?: TooltipPrimitive.TooltipContentProps["side"];
}) => {
  return (
    <TooltipPrimitive.Root delayDuration={delayDuration} {...props}>
      {!content && children}
      {content && (
        <>
          <TooltipPrimitive.Trigger asChild>
            {children}
          </TooltipPrimitive.Trigger>
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              className="TooltipContent sui-z-[99999] sui-max-w-[220px] sui-rounded-[10px] sui-bg-gray-30 sui-p-2 sui-text-white sui-shadow-3 sui-caption"
              sideOffset={6}
              collisionPadding={16}
              align={align}
              side={side}
            >
              {content}
              <TooltipPrimitive.Arrow className="w-[16px] h-[8px] sui-shadow-up [fill:var(--sui-colors-gray-30)]" />
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        </>
      )}
    </TooltipPrimitive.Root>
  );
};
Tooltip.displayName = TooltipPrimitive.Root.displayName;

const TooltipContent = forwardRef<
  ElementRef<typeof TooltipPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(
  (
    { className, sideOffset = 6, collisionPadding = 16, children, ...props },
    ref,
  ) => {
    return (
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          className={cn(
            "TooltipContent sui-z-[99999] sui-max-w-[440px] sui-rounded-[10px] sui-bg-neutral-background-medium sui-p-2 sui-text-neutral-text sui-shadow-3 sui-caption",
            className,
          )}
          ref={ref}
          sideOffset={sideOffset}
          collisionPadding={collisionPadding}
          {...props}
        >
          {children}
          <TooltipPrimitive.Arrow className="w-[16px] h-[8px] [fill:var(--color-neutral-background-medium)]" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    );
  },
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const TooltipAction = forwardRef<
  HTMLButtonElement,
  LabelButtonProps & React.ComponentPropsWithoutRef<"button">
>(({ children, variantType = "tertiary", size = "small", ...props }, ref) => {
  return (
    <LabelButton
      className="sui-ml-auto sui-mr-2 sui-mt-2 sui-block"
      ref={ref}
      variantType={variantType}
      size={size}
      {...props}
    >
      {children}
    </LabelButton>
  );
});

export default Tooltip;
export {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  TooltipAction,
  TooltipPortal,
};
