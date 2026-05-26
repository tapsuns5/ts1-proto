import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva } from "class-variance-authority";
import { cn } from "../../utils";
import { TabsProps } from "./Tabs.types";

const Tabs: React.FC<TabsProps> = ({
  tabs,
  onChange,
  defaultValue,
  ariaLabel,
  value,
  className,
  edgeGradientClassName,
  onTabClick,
  variantType = "admin",
  ...props
}) => {
  const [showFade, setShowFade] = React.useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // NOTE: This effect handles the initial check, resizing, and scrolling.
  // to control the visibility of the fade effect (showFade).
  React.useEffect(() => {
    const scrollElement = scrollContainerRef.current;

    const updateFadeVisibility = () => {
      if (!scrollElement) {
        return;
      }
      // Is there more content than the visible area?
      const hasOverflow = scrollElement.scrollWidth > scrollElement.clientWidth;
      // Is the scroll position at the very end?
      const isScrolledToEnd =
        scrollElement.scrollLeft + scrollElement.clientWidth >=
        scrollElement.scrollWidth - 2; // 2px tolerance
      setShowFade(hasOverflow && !isScrolledToEnd);
    };

    if (!scrollElement) {
      return;
    }

    updateFadeVisibility();

    scrollElement.addEventListener("scroll", updateFadeVisibility);
    window.addEventListener("resize", updateFadeVisibility);

    return () => {
      scrollElement.removeEventListener("scroll", updateFadeVisibility);
      window.removeEventListener("resize", updateFadeVisibility);
    };
  }, [tabs]);

  return (
    <TabsPrimitive.Root
      data-testid="tabs-component"
      defaultValue={defaultValue}
      onValueChange={onChange}
      value={value}
      className={className}
      {...props}
    >
      <TabsPrimitive.List
        data-testid="tabs-component__tab-list"
        aria-label={ariaLabel}
        className="sui-relative"
      >
        <div
          ref={scrollContainerRef}
          className="sui-hide-scrollbar sui-flex sui-snap-x sui-flex-nowrap sui-overflow-auto"
        >
          {tabs.map((item, index) => {
            return (
              <TabsPrimitive.Trigger
                data-testid={`tabs-component__tab-trigger-${item.value}`}
                className={cn(tabsVariants({ variant: variantType }), {
                  "sui-scroll-ml-2": index === 0,
                })}
                value={`${item.value}`}
                onClick={onTabClick ? () => onTabClick(item.value) : undefined}
                key={`${item.value}-trigger`}
              >
                <span
                  className={cn(
                    "sui-px-3 sui-py-1",
                    tabHoverVariants({ variant: variantType }),
                  )}
                >
                  {item.label}
                </span>
              </TabsPrimitive.Trigger>
            );
          })}
        </div>

        {showFade && (
          <span
            className={cn(
              "sui-absolute sui-bottom-[2px] sui-right-0 sui-top-0 sui-z-10 sui-w-[48px] sui-bg-gradient-to-l sui-from-white sui-to-transparent",
              edgeGradientClassName,
            )}
          />
        )}

        <span className="sui-relative sui-bottom-[1px] sui-right-0 sui-block sui-h-[1px] sui-w-full sui-border-b sui-border-neutral-border" />
      </TabsPrimitive.List>
      {tabs.map((item) => (
        <TabsPrimitive.Content
          data-testid={`tabs-component__tab-content-${item.value}`}
          value={`${item.value}`}
          key={`${item.value}-content`}
        >
          {item.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
};

const tabHoverVariants = cva(
  ["hover:sui-rounded-[16px]", "sui-transition-all sui-duration-[180ms]"],
  {
    variants: {
      variant: {
        admin: [
          "hover:sui-bg-admin-action-background-weak-hover hover:sui-text-admin-action-text-hover",
        ],
        consumer: [
          "hover:sui-bg-consumer-action-background-weak-hover hover:sui-text-neutral-text",
          "data-[state=active]:hover:sui-rounded-[0px] data-[state=active]:hover:sui-bg-transparent",
        ],
      },
    },
    defaultVariants: {
      variant: "admin",
    },
  },
);

const tabsVariants = cva(
  [
    "sui-z-10 sui-snap-start",
    "sui-whitespace-nowrap sui-text-label",
    "sui-min-h-[48px]",
    "sui-border-b-4 sui-border-b-transparent",
    "sui-transition-colors sui-duration-250",
  ],
  {
    variants: {
      variant: {
        admin: [
          "sui-text-neutral-text",
          "data-[state=active]:sui-border-admin-action-border data-[state=active]:sui-text-admin-action-text",
        ],
        consumer: [
          "sui-text-neutral-text-medium",
          "data-[state=active]:sui-border-consumer-action-border data-[state=active]:sui-text-neutral-text",
        ],
      },
    },
    defaultVariants: {
      variant: "admin",
    },
  },
);

export default Tabs;
