import React from "react";

export type BannerAction = {
  label?: string | React.ReactNode;
  onClick(): void;
};

/**
 * NOTE: Update Banner.test.tsx with all additions and changes!
 */
type BannerBaseProps = {
  /**
   * Add comments above each prop to see them on storybook. Props with finite
   * options show radio buttons of each option on storybook
   */
  sentiment?:
    | "default"
    | "info"
    | "negative"
    | "neutral"
    | "success"
    | "warning";
  title?: string;
  caption?: string | React.ReactNode;
  action?: BannerAction;
  closeFn?(): void;
  className?: string;
  testId?: string;
};

type BannerWithTimer = BannerBaseProps & {
  /**
   * Countdown timer duration in milliseconds. When provided, displays a countdown timer
   * instead of the sentiment icon. Timer starts immediately and counts down to 0.
   */
  timer: number;
  hideIcon?: never;
};

type BannerWithoutTimer = BannerBaseProps & {
  timer?: never;
  hideIcon?: boolean;
};

export type BannerProps = BannerWithTimer | BannerWithoutTimer;
