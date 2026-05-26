import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Icon } from "../../index";
import { cn } from "../../utils";

const Breadcrumb = React.forwardRef<
  React.ElementRef<"nav">,
  React.ComponentProps<"nav">
>(({ className, ...props }, ref) => {
  return (
    <nav
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      ref={ref}
      className={className}
      {...props}
    />
  );
});
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentProps<"ol">
>(({ className, ...props }, ref) => {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "sui-gap-1.5 sui-text-sm sm:sui-gap-2.5 sui-flex sui-items-center sui-break-words",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn(
        "sui-gap-1.5 sui-inline-flex sui-items-center sui-label",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & { asChild?: boolean }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={className}
      ref={ref}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("sui-font-normal", className)}
      ref={ref}
      {...props}
    />
  );
});
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li"> & { children?: React.ReactNode }
>(({ children, className, ...props }, ref) => {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("sui-text-neutral-text-weak", className)}
      ref={ref}
      {...props}
    >
      {children ?? (
        <Icon name="chevron_right" className="sui-relative sui-top-[4px]" />
      )}
    </li>
  );
});
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "sui-size-9 sui-flex sui-items-center sui-justify-center",
        className,
      )}
      ref={ref}
      {...props}
    >
      <Icon name="more_horiz" />
      <span className="sui-sr-only">More</span>
    </span>
  );
});
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
