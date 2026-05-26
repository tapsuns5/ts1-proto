import React, { useEffect, useState } from "react";
import { cn } from "../../utils";
import Icon from "../Icon/Icon";
import { ListOptions } from "../Icon/Icon.types";
import IconButton from "../IconButton/IconButton";
import { TextLink } from "../TextLink/TextLink";
import { BannerProps } from "./Banner.types";

/**
 * Banner component for displaying important messages with optional actions.
 * Uses Tailwind classes and the `cn` utility for conditional styling.
 */
const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      sentiment = "info",
      title,
      caption,
      className = "",
      action,
      closeFn,
      hideIcon = false,
      testId,
      ...props
    },
    ref,
  ) => {
    // Access timer from props using type guard to narrow discriminated union
    const timer = "timer" in props ? props.timer : undefined;
    const { timer: _timer, ...restProps } =
      props as Record<string, unknown>;

    // Timer state - convert milliseconds to seconds for display
    const [remainingTime, setRemainingTime] = useState<number>(
      timer ? Math.ceil(timer / 1000) : 0,
    );

    // Reset remainingTime when timer prop changes
    useEffect(() => {
      setRemainingTime(timer ? Math.ceil(timer / 1000) : 0);
    }, [timer]);

    // Timer countdown logic
    useEffect(() => {
      if (!timer) return;

      const intervalId = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(intervalId);
    }, [timer]);

    // Format timer display
    const formatTimer = (seconds: number): string => {
      if (seconds <= 0) return "0s";

      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;

      if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
      }
      return `${remainingSeconds}s`;
    };

    return (
      <div
        ref={ref}
        {...(testId ? { "data-testid": testId } : {})}
        className={cn(
          "sui-flex sui-items-center sui-rounded-xl sui-bg-info-background-weak sui-px-2 sui-py-[12px]",
          {
            "sui-bg-caution-background": sentiment === "warning",
            "sui-bg-info-background-weak": sentiment === "info",
            "sui-bg-negative-background-weak": sentiment === "negative",
            "sui-bg-positive-background": sentiment === "success",
            "sui-bg-neutral-background-weak": sentiment === "neutral",
          },
          className,
        )}
        {...restProps}
      >
        {timer ? (
          <div
            {...(testId ? { "data-testid": `${testId}--timer-container` } : {})}
            className="sui-mr-1 sui-grid sui-place-items-center sui-rounded-full sui-bg-neutral-icon sui-p-1"
          >
            <div
              {...(testId ? { "data-testid": `${testId}--timer` } : {})}
              className="!sui-font-bold sui-text-neutral-text-inverse sui-text-body-dense"
            >
              {formatTimer(remainingTime)}
            </div>
          </div>
        ) : (
          !hideIcon && (
            <div
              {...(testId ? { "data-testid": `${testId}--icon-container` } : {})}
              className="sui-mr-1 sui-grid sui-place-items-center"
            >
              <Icon
                name={ICON_PER_SENTIMENT[sentiment]}
                size={title && caption ? "l" : "default"}
              />
            </div>
          )
        )}

        <div
          {...(testId ? { "data-testid": `${testId}--content` } : {})}
          className={cn("sui-flex-1", {
            "sui-pr-2": action || closeFn,
          })}
        >
          {title && (
            <div
              {...(testId ? { "data-testid": `${testId}--content-title` } : {})}
              className={cn("!sui-font-bold sui-text-body", {
                "sui-mb-1": caption,
              })}
            >
              {title}
            </div>
          )}
          <div
            {...(testId ? { "data-testid": `${testId}--content-caption` } : {})}
            className="sui-text-caption"
          >
            {caption}
          </div>
        </div>

        {action ? (
          <div
            {...(testId ? { "data-testid": `${testId}--content-actions` } : {})}
            className="sui-text-caption md:sui-ml-1"
          >
            {action.label ? (
              <>
                <div className="sui-hidden md:!sui-flex">
                  <TextLink
                    onClick={action.onClick}
                    variantType="secondary"
                  >
                    {action.label}
                  </TextLink>
                </div>
                <div className="sui-flex md:!sui-hidden">
                  <IconButton
                    icon="chevron_right"
                    onClick={() => action.onClick()}
                    variant="neutral"
                    size="compact"
                  />
                </div>
              </>
            ) : (
              <IconButton
                icon="chevron_right"
                onClick={() =>
                  action.onClick ? action.onClick() : closeFn?.()
                }
                variant="neutral"
                size="compact"
              />
            )}
          </div>
        ) : null}

        {closeFn ? (
          <div
            {...(testId ? { "data-testid": `${testId}--close-action` } : {})}
            className="sui-text-caption md:sui-ml-1"
          >
            <IconButton
              icon="close"
              onClick={() => closeFn()}
              variant="neutral"
              size="compact"
            />
          </div>
        ) : null}
      </div>
    );
  },
);

Banner.displayName = "Banner";

export { Banner };

const ICON_PER_SENTIMENT: Record<
  NonNullable<BannerProps["sentiment"]>,
  ListOptions
> = {
  default: "info",
  info: "info",
  negative: "report",
  neutral: "info",
  success: "check_circle",
  warning: "warning",
};
