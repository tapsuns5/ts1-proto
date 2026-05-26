import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "../../utils";
import LabelButton from "../LabelButton/LabelButton";

const AlertDialog = DialogPrimitive.Root;

const AlertDialogTrigger = DialogPrimitive.Trigger;

const AlertDialogPortal = DialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    className={cn(
      "sui-fixed sui-inset-0 sui-z-50 sui-bg-black/80 sui-data-[state=open]:sui-animate-in sui-data-[state=closed]:sui-animate-out sui-data-[state=closed]:sui-fade-out-0 sui-data-[state=open]:sui-fade-in-0",
      className,
    )}
    {...props}
    ref={ref}
  />
));
AlertDialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean;
  }
>(({ className, showCloseButton = true, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <AlertDialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "sui-fixed sui-left-[50%] sui-top-[50%] sui-z-50 sui-grid sui-w-full sui-max-w-lg sui-translate-x-[-50%] sui-translate-y-[-50%] sui-gap-4 sui-border sui-bg-white sui-p-6 sui-shadow-lg sui-duration-200 sui-data-[state=open]:sui-animate-in sui-data-[state=closed]:sui-animate-out sui-data-[state=closed]:sui-fade-out-0 sui-data-[state=open]:sui-fade-in-0 sui-data-[state=closed]:sui-zoom-out-95 sui-data-[state=open]:sui-zoom-in-95 sui-rounded-lg",
        className,
      )}
      {...props}
    >
      {showCloseButton && (
        <DialogPrimitive.Close className="sui-absolute sui-right-4 sui-top-4 sui-rounded-sm sui-opacity-70 hover:sui-opacity-100 focus:sui-outline-none focus:sui-ring-2 focus:sui-ring-ring focus:sui-ring-offset-2 disabled:sui-pointer-events-none">
          <svg className="sui-h-4 sui-w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="sui-sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
AlertDialogContent.displayName = DialogPrimitive.Content.displayName;

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "sui-flex sui-flex-col sui-space-y-2 sui-text-center sm:sui-text-left",
      className,
    )}
    {...props}
  />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "sui-flex sui-flex-col-reverse sm:sui-flex-row sm:sui-justify-end sm:sui-gap-2",
      className,
    )}
    {...props}
  />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("sui-text-lg sui-font-semibold", className)}
    {...props}
  />
));
AlertDialogTitle.displayName = DialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("sui-text-sm sui-text-muted-foreground", className)}
    {...props}
  />
));
AlertDialogDescription.displayName = DialogPrimitive.Description.displayName;

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={cn(className)}
    asChild
    {...props}
  >
    <LabelButton variantType="primary" labelText={children} />
  </DialogPrimitive.Close>
));
AlertDialogAction.displayName = DialogPrimitive.Close.displayName;

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={cn(className)}
    asChild
    {...props}
  >
    <LabelButton variantType="tertiary" labelText={children} />
  </DialogPrimitive.Close>
));
AlertDialogCancel.displayName = DialogPrimitive.Close.displayName;

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
