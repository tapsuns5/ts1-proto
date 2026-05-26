import React, { createContext, forwardRef, useContext, useState } from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { cn } from "../../utils";
import Icon from "../Icon/Icon";

type CollapsibleCardProps = React.ComponentPropsWithoutRef<
  typeof CollapsiblePrimitive.Root
> & {
  className?: string;
};

type CollapsibleCardHeaderProps = {
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  showTriggerIcon?: boolean;
  triggerIconPosition?: "left" | "right";
};

const CollapsibleCardContext = createContext<{ isOpen: boolean }>({
  isOpen: false,
});

const CollapsibleCard = forwardRef<HTMLDivElement, CollapsibleCardProps>(
  (
    { className, children, defaultOpen = false, open, onOpenChange, ...props },
    ref,
  ) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;

    const handleOpenChange = (value: boolean) => {
      if (!isControlled) {
        setInternalOpen(value);
      }
      onOpenChange?.(value);
    };

    return (
      <CollapsibleCardContext.Provider value={{ isOpen }}>
        <CollapsiblePrimitive.Root
          ref={ref}
          open={isOpen}
          onOpenChange={handleOpenChange}
          className={cn(
            "sui-rounded-[16px] sui-border sui-border-solid sui-border-neutral-border sui-bg-neutral-background sui-px-3 sui-py-2",
            className,
          )}
          data-testid="collapsible-card-root"
          {...props}
        >
          {children}
        </CollapsiblePrimitive.Root>
      </CollapsibleCardContext.Provider>
    );
  },
);
CollapsibleCard.displayName = "CollapsibleCard";

const CollapsibleCardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CollapsibleCardHeaderProps
>(
  (
    {
      title,
      children,
      className,
      showTriggerIcon = true,
      triggerIconPosition = "right",
      ...props
    },
    ref,
  ) => {
    const { isOpen } = useContext(CollapsibleCardContext);

    const icon = showTriggerIcon ? (
      <Icon
        name="keyboard_arrow_down"
        className={cn(
          "sui-select-none sui-transition-transform sui-duration-300 sui-ease-in-out",
          triggerIconPosition === "left" ? "sui-mr-1" : "sui-ml-1",
          isOpen ? "sui-rotate-180" : "sui-rotate-0",
        )}
        filled={false}
      />
    ) : null;

    return (
      <CollapsiblePrimitive.Trigger asChild>
        <div
          ref={ref}
          className={cn("sui-cursor-pointer", className)}
          data-testid="collapsible-card-header"
          {...props}
        >
          <div className="sui-flex sui-flex-row sui-items-center sui-justify-between">
            {triggerIconPosition === "left" && icon}
            <div className="sui-flex-1">
              {children
                ? children
                : title && (
                    <div className="sui-text-neutral-text sui-text-heading-sm">
                      {title}
                    </div>
                  )}
            </div>
            {triggerIconPosition === "right" && icon}
          </div>
        </div>
      </CollapsiblePrimitive.Trigger>
    );
  },
);
CollapsibleCardHeader.displayName = "CollapsibleCardHeader";

const CollapsibleCardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isOpen } = useContext(CollapsibleCardContext);

  return (
    <div
      ref={ref}
      style={{
        display: "grid",
        gridTemplateRows: isOpen ? "1fr" : "0fr",
        transition: "grid-template-rows 260ms ease",
      }}
      className={cn(className)}
      data-testid="collapsible-card-content"
      {...props}
    >
      <div style={{ overflow: "hidden" }}>{children}</div>
    </div>
  );
});
CollapsibleCardContent.displayName = "CollapsibleCardContent";

export { CollapsibleCard, CollapsibleCardHeader, CollapsibleCardContent };
export type { CollapsibleCardProps, CollapsibleCardHeaderProps };
