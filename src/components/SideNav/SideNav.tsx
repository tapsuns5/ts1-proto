import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils";
import Icon from "../Icon/Icon";

// ── CVA Variants ──

const sideNavVariants = cva(
  [
    "sui-bg-neutral-background-weak",
    "sui-border-solid sui-border-r sui-border-neutral-border",
    "sui-h-screen sui-transition-all sui-relative sui-group",
    "sui-flex sui-flex-col",
  ],
  {
    variants: {
      variant: {
        expanded: "sui-w-[250px]",
        collapsed: "sui-w-[88px]",
      },
    },
    defaultVariants: {
      variant: "expanded",
    },
  },
);

const sideNavMenuLinkVariants = cva(
  ["sui-block sui-text-neutral-text sui-group"],
  {
    variants: {
      variant: {
        expanded: [
          "sui-pr-3 sui-h-[56px] lg:sui-py-2",
          "sui-flex sui-items-center sui-gap-2",
          "sui-font-semibold",
        ],
        collapsed: ["sui-px-2 sui-py-2", "sui-grid sui-place-items-center"],
      },
      subItem: {
        true: "",
        false: "",
      },
      active: {
        true: "",
        false: [
          "hover:sui-bg-accent-background-weak",
          "focus:sui-bg-accent-background-weak",
        ],
      },
      variantType: {
        admin: "",
        consumer: "",
      },
    },
    compoundVariants: [
      {
        active: true,
        variantType: "admin",
        className: [
          "sui-bg-accent-background sui-text-white sui-fill-white",
          "hover:sui-bg-accent-background-hover focus:sui-bg-accent-background-hover",
        ],
      },
      {
        active: true,
        variantType: "consumer",
        className: [
          "sui-bg-consumer-action-background sui-text-white sui-fill-white",
          "hover:sui-bg-consumer-action-background-hover focus:sui-bg-consumer-action-background-hover",
        ],
      },
      {
        variant: "expanded",
        subItem: false,
        className: "sui-pl-3",
      },
      {
        variant: "expanded",
        subItem: false,
        className: "sui-pl-3",
      },
      {
        variant: "expanded",
        subItem: true,
        className: "sui-pl-8",
      },
      {
        variant: "collapsed",
        subItem: true,
        className: "sui-place-items-start sui-py-1",
      },
    ],
    defaultVariants: {
      variant: "expanded",
      subItem: false,
      active: false,
      variantType: "admin",
    },
  },
);

const sideNavMenuTriggerVariants = cva(
  [
    "sui-group sui-block sui-w-full sui-text-neutral-text sui-text-left",
    "hover:sui-bg-accent-background-weak",
    "focus:sui-bg-accent-background-weak",
  ],
  {
    variants: {
      variant: {
        expanded: [
          "sui-px-3 sui-py-2",
          "sui-font-semibold",
          "sui-flex sui-items-center sui-gap-2",
        ],
        collapsed: ["sui-px-3 sui-py-2", "sui-grid sui-place-items-center"],
      },
      active: {
        true: "",
        false: "",
      },
      variantType: {
        admin: "",
        consumer: "",
      },
    },
    compoundVariants: [
      {
        active: true,
        variantType: "admin",
        variant: "expanded",
        className: [
          "sui-bg-accent-background sui-text-white sui-fill-white",
          "hover:sui-bg-accent-background-hover focus:sui-bg-accent-background-hover",
          "data-[state=open]:sui-bg-transparent data-[state=open]:sui-text-[initial]",
        ],
      },
      {
        active: true,
        variantType: "admin",
        variant: "collapsed",
        className: [
          "sui-bg-accent-background sui-text-white sui-fill-white",
          "hover:sui-bg-accent-background-hover focus:sui-bg-accent-background-hover",
        ],
      },
      {
        active: true,
        variantType: "consumer",
        variant: "expanded",
        className: [
          "sui-bg-consumer-action-background sui-text-white sui-fill-white",
          "hover:sui-bg-consumer-action-background-hover focus:sui-bg-consumer-action-background-hover",
          "data-[state=open]:sui-bg-transparent data-[state=open]:sui-text-[initial]",
        ],
      },
      {
        active: true,
        variantType: "consumer",
        variant: "collapsed",
        className: [
          "sui-bg-consumer-action-background sui-text-white sui-fill-white",
          "hover:sui-bg-consumer-action-background-hover focus:sui-bg-consumer-action-background-hover",
        ],
      },
    ],
    defaultVariants: {
      variant: "expanded",
      active: false,
      variantType: "admin",
    },
  },
);

const sideNavMenuContentVariants = cva([], {
  variants: {
    variant: {
      expanded: "sui-grid sui-gap-1 sui-pt-1",
      collapsed: [
        "sui-absolute sui-top-0 sui-left-[100%]",
        "sui-bg-white sui-py-1 sui-rounded-lg sui-w-[170px]",
        "sui-shadow-1 sui-border sui-border-solid sui-border-neutral-border",
      ],
    },
  },
  defaultVariants: {
    variant: "expanded",
  },
});

// ── Components ──

const SideNav = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> &
    VariantProps<typeof sideNavVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="side-nav"
    className={cn(sideNavVariants({ variant }), className)}
    {...props}
  />
));
SideNav.displayName = "SideNav";

const SideNavHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="side-nav-header"
    className={className}
    {...props}
  />
));
SideNavHeader.displayName = "SideNavHeader";

const SideNavMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    data-slot="side-nav-menu"
    orientation="vertical"
    className={cn("sui-flex-1", className)}
    {...props}
  />
));
SideNavMenu.displayName = "SideNavMenu";

const SideNavMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    data-slot="side-nav-menu-list"
    className={cn("sui-grid", className)}
    {...props}
  />
));
SideNavMenuList.displayName = "SideNavMenuList";

const SideNavMenuItem = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Item
    ref={ref}
    data-slot="side-nav-menu-item"
    className={cn("sui-relative", className)}
    {...props}
  />
));
SideNavMenuItem.displayName = "SideNavMenuItem";

const SideNavMenuLink = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Link>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link> &
    VariantProps<typeof sideNavMenuLinkVariants>
>(({ className, variant, subItem, variantType, active, ...props }, ref) => (
  <NavigationMenuPrimitive.Link
    ref={ref}
    data-slot="side-nav-menu-link"
    active={active ?? undefined}
    className={cn(
      sideNavMenuLinkVariants({ variant, subItem, variantType, active }),
      className,
    )}
    {...props}
  />
));
SideNavMenuLink.displayName = "SideNavMenuLink";

const SideNavMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger> &
    VariantProps<typeof sideNavMenuTriggerVariants>
>(
  ({ className, variant, active, variantType, children, asChild, ...props }, ref) => (
    <NavigationMenuPrimitive.Trigger
      ref={ref}
      data-slot="side-nav-menu-trigger"
      asChild={asChild}
      className={cn(
        sideNavMenuTriggerVariants({ variant, active, variantType }),
        className,
      )}
      {...props}
    >
      {children}
      {!asChild && variant !== "collapsed" && (
        <Icon
          name="expand_less"
          className="sui-ml-auto group-data-[state=open]:sui-rotate-180"
        />
      )}
    </NavigationMenuPrimitive.Trigger>
));
SideNavMenuTrigger.displayName = "SideNavMenuTrigger";

const SideNavMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content> &
    VariantProps<typeof sideNavMenuContentVariants>
>(({ className, variant, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    data-slot="side-nav-menu-content"
    className={cn(sideNavMenuContentVariants({ variant }), className)}
    {...props}
  />
));
SideNavMenuContent.displayName = "SideNavMenuContent";

const SideNavBadge = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    data-slot="side-nav-badge"
    className={cn(
      [
        "sui-bg-accent-background sui-text-white sui-rounded-full sui-text-caption",
        "sui-h-3 sui-w-3 sui-font-bold sui-grid sui-place-items-center",
        "group-data-[active]:sui-bg-white group-data-[active]:sui-text-action-text",
      ],
      className,
    )}
    {...props}
  />
));
SideNavBadge.displayName = "SideNavBadge";

const SideNavFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="side-nav-footer"
    className={className}
    {...props}
  />
));
SideNavFooter.displayName = "SideNavFooter";

const SideNavToggle = React.forwardRef<
  HTMLButtonElement,
  Omit<React.ComponentPropsWithoutRef<"button">, "children" | "onClick"> & {
    expanded: boolean;
    onToggle: () => void;
    isTouchDevice?: boolean;
  }
>(({ className, expanded, onToggle, isTouchDevice = false, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    data-slot="side-nav-toggle"
    aria-expanded={expanded}
    aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
    className={cn(
      [
        "sui-rounded-full sui-border-solid sui-border sui-border-neutral-border sui-bg-white",
        "sui-h-3 sui-w-3 lg:sui-h-4 lg:sui-w-4 sui-place-items-center",
        "sui-absolute sui-top-[20px] sui-right-[-16px] sui-z-50",
        "sm:sui-grid sui-transition-all",
      ],
      {
        "sui-grid": !expanded || isTouchDevice,
        "sui-opacity-0 group-hover:sui-opacity-100 focus-visible:sui-opacity-100":
          expanded && !isTouchDevice,
      },
      className,
    )}
    {...props}
    onClick={onToggle}
  >
    <Icon
      name="chevron_left"
      size="s"
      className={cn("sui-text-base lg:sui-text-lg", {
        "sui-rotate-180": !expanded,
      })}
    />
  </button>
));
SideNavToggle.displayName = "SideNavToggle";

export {
  SideNav,
  SideNavHeader,
  SideNavMenu,
  SideNavMenuList,
  SideNavMenuItem,
  SideNavMenuLink,
  SideNavMenuTrigger,
  SideNavMenuContent,
  SideNavBadge,
  SideNavFooter,
  SideNavToggle,
  sideNavVariants,
  sideNavMenuLinkVariants,
  sideNavMenuTriggerVariants,
  sideNavMenuContentVariants,
};
