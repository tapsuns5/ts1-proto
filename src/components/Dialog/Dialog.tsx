import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../../utils";
import IconButton from "../IconButton/IconButton";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
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
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  VariantProps<typeof dialogContentVariants> &
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
      showCloseIconButton?: boolean;
      scrollable?: boolean;
    }
>(
  (
    {
      className,
      size,
      children,
      showCloseIconButton = true,
      scrollable = true,
      ...props
    },
    ref,
  ) => {
    const content = (
      <DialogPrimitive.Content
        ref={ref}
        className={cn(dialogContentVariants({ size }), className)}
        {...props}
      >
        {showCloseIconButton && (
          <DialogClose asChild>
            <IconButton
              icon="close"
              className="sui-absolute sui-right-2 sui-top-[23px]"
              variant="neutral"
              aria-label="Close dialog"
              size="compact"
            />
          </DialogClose>
        )}
        {children}
      </DialogPrimitive.Content>
    );

    return (
      <DialogPortal>
        {scrollable ? (
          <DialogOverlay>{content}</DialogOverlay>
        ) : (
          <>
            <DialogOverlay />
            {content}
          </>
        )}
      </DialogPortal>
    );
  },
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <header ref={ref} className={cn("sui-p-3", className)} {...props} />
));
DialogHeader.displayName = "DialogHeader";

const DialogFooter = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <footer
    ref={ref}
    className={cn(
      "sui-flex sui-justify-end sui-gap-1 sui-bg-white sui-p-3",
      className,
    )}
    {...props}
  />
));
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("sui-heading-sm", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

const DialogBody = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("sui-px-3", className)} {...props} />
));
DialogBody.displayName = "DialogBody";

const dialogContentVariants = cva(
  [
    "sui-shadow-lg sui-rounded-none sui-bg-white md:sui-rounded",
    "sui-max-h-[calc(100vh_-_2rem)] sui-w-full sui-max-w-full",
    "sui-fixed sui-left-[50%] sui-top-[50%] sui-z-[999] sui-translate-x-[-50%] sui-translate-y-[-50%] sui-overflow-auto",
  ],
  {
    variants: {
      size: {
        sm: "md:!sui-max-w-[350px]",
        md: "md:!sui-max-w-[500px]",
        lg: "md:!sui-max-w-[768px]",
        full: "sui-max-w-screen sui-h-screen sui-max-h-screen sui-rounded-none sui-pb-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DialogBody,
};
