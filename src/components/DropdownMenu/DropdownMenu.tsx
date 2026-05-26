import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils";
import Icon from "../Icon/Icon";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, align = "start", ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      align={align}
      className={cn(
        "sui-z-50 sui-overflow-hidden sui-rounded-xl sui-bg-white sui-py-0.5 sui-shadow-1",
        className,
      )}
      {...props}
    />
  );
});
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  VariantProps<typeof dropdownMenuItemVariants> &
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, variant, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(dropdownMenuItemVariants({ variant }), className)}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    {...props}
    className={cn(
      "sui-px-2 sui-py-1 sui-text-neutral-text-weak sui-text-label-sm",
      className,
    )}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    {...props}
    className={cn("sui-h-px sui-bg-neutral-border", className)}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    {...props}
    className={cn(
      "sui-flex sui-cursor-default sui-select-none sui-items-center sui-gap-1 sui-py-1 sui-pl-2 sui-pr-6 sui-font-semibold sui-outline-none sui-text-label focus:sui-bg-action-background-weak focus:sui-text-action-text",
      className,
    )}
  >
    <span
      className="sui-pointer-events-none sui-absolute sui-right-2 sui-flex sui-items-center sui-justify-center"
      data-slot="dropdown-menu-checkbox-item-indicator"
    >
      <DropdownMenuPrimitive.ItemIndicator>
        <Icon name="check" size="s" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    {...props}
    className={cn(
      "sui-flex sui-cursor-default sui-select-none sui-items-center sui-gap-1 sui-py-1 sui-pl-2 sui-pr-6 sui-font-semibold sui-outline-none sui-text-label focus:sui-bg-action-background-weak focus:sui-text-action-text",
      className,
    )}
  >
    <span
      className="sui-pointer-events-none sui-absolute sui-right-2 sui-flex sui-items-center sui-justify-center"
      data-slot="dropdown-menu-radio-item-indicator"
    >
      <DropdownMenuPrimitive.ItemIndicator>
        <Icon name="check" size="s" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    {...props}
    className={cn(
      "sui-flex sui-cursor-default sui-select-none sui-items-center sui-justify-between sui-gap-1 sui-py-1 sui-pl-2 sui-pr-4 sui-font-semibold sui-outline-none sui-text-label focus:sui-bg-action-background-weak focus:sui-text-action-text",
      className,
    )}
  >
    {children}
    <Icon name="chevron_right" size="xs" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, sideOffset = 4, alignOffset = -5, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    sideOffset={sideOffset}
    alignOffset={alignOffset}
    className={cn(
      "sui-z-50 sui-overflow-hidden sui-rounded-xl sui-bg-white sui-py-0.5 sui-shadow-1",
      className,
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const dropdownMenuItemVariants = cva(
  [
    "sui-relative sui-cursor-default sui-select-none sui-py-1 sui-pl-2 sui-pr-4 sui-tracking-wide sui-outline-none sui-text-label",
    "sui-flex sui-items-center sui-gap-1",
    "data-[disabled]:sui-pointer-events-none data-[disabled]:sui-opacity-50",
  ],
  {
    variants: {
      variant: {
        default: [
          "sui-font-semibold focus:sui-bg-action-background-weak focus:sui-text-action-text",
        ],
        negative: [
          "sui-text-negative-text",
          "focus:sui-bg-negative-background-weak",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
