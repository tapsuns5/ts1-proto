"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "../../utils";
import IconButton from "../IconButton/IconButton";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetPortal = DialogPrimitive.Portal;
const SheetClose = DialogPrimitive.Close;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "sui-pointer-events-none sui-fixed sui-inset-0 sui-z-[998] sui-bg-black/25",
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    side?: "right" | "left" | "top" | "bottom";
    showCloseIconButton?: boolean;
  }
>(
  (
    {
      className,
      children,
      side = "right",
      showCloseIconButton = true,
      ...props
    },
    ref,
  ) => {
    const sideClasses = {
      right: "sui-right-0 sui-h-full sui-w-full sui-translate-x-0 sui-translate-y-0 sui-top-0 sui-bottom-0 sui-left-auto",
      left: "sui-left-0 sui-h-full sui-w-full sui-translate-x-0 sui-translate-y-0 sui-top-0 sui-bottom-0 sui-right-auto",
      top: "sui-top-0 sui-w-full sui-h-1/2 sui-translate-x-0 sui-translate-y-0 sui-left-0 sui-right-0 sui-bottom-auto",
      bottom: "sui-bottom-0 sui-w-full sui-h-1/2 sui-translate-x-0 sui-translate-y-0 sui-left-0 sui-right-0 sui-top-auto",
    };

    return (
      <SheetPortal>
        <SheetOverlay />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "sui-fixed sui-z-[999] sui-bg-white sui-shadow-lg",
            sideClasses[side],
            className,
          )}
          {...props}
        >
          <VisuallyHidden>
            <DialogPrimitive.Title>Sheet</DialogPrimitive.Title>
          </VisuallyHidden>
          {showCloseIconButton && (
            <SheetClose asChild>
              <IconButton
                icon="close"
                className="sui-absolute sui-right-4 sui-top-4"
                variant="neutral"
                aria-label="Close sheet"
                size="compact"
              />
            </SheetClose>
          )}
          {children}
        </DialogPrimitive.Content>
      </SheetPortal>
    );
  },
);
SheetContent.displayName = DialogPrimitive.Content.displayName;

const SheetHeader = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <header ref={ref} className={cn("sui-p-6 sui-border-b sui-border-neutral-border", className)} {...props} />
));
SheetHeader.displayName = "SheetHeader";

const SheetBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("sui-flex-1 sui-overflow-auto sui-p-6", className)} {...props} />
));
SheetBody.displayName = "SheetBody";

const SheetFooter = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <footer
    ref={ref}
    className={cn(
      "sui-flex sui-justify-end sui-gap-2 sui-bg-white sui-p-6 sui-border-t sui-border-neutral-border",
      className,
    )}
    {...props}
  />
));
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("sui-heading-lg sui-font-semibold", className)}
    {...props}
  />
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("sui-text-sm sui-text-neutral-text-medium", className)}
    {...props}
  />
));
SheetDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
  SheetBody,
};
