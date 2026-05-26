// Note: This component is in development:
// https://www.figma.com/design/iNstL3nTw7jLPyL7uH4jLK/%F0%9F%92%BB-%F0%9F%9F%A3-Web-App-%E2%80%94-Base-Components-%E2%80%94-TS1?node-id=3-10370&t=uPpJTUHU1K7O1qsT-4
// So this Badge component is not meant to fully encapsulate component behavior, just enough for its intended purposes
// We can update as needed or when the Figma component is finished!

import { cva } from "class-variance-authority";
import { cn } from "../../utils";
import { BadgeProps } from "./Badge.types";

const Badge: React.FC<BadgeProps> = ({
  labelText,
  variant,
  className = "",
  ...props
}) => {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      <span className="sui-font-medium">{labelText}</span>
    </span>
  );
};

const badgeVariants = cva(
  [
    "sui-text-label-sm",
    "sui-flex sui-h-[24px] sui-w-fit sui-items-center sui-rounded-[24px]",
    "sui-px-1 sui-py-1",
  ],
  {
    variants: {
      variant: {
        positive: "sui-bg-positive-background",
        caution1: "sui-bg-caution-background",
        negative: "sui-bg-negative-background-weak",
        neutral: "sui-bg-neutral-background-strong",
        accent: "sui-bg-accent-background !sui-text-white sui-text-label-sm",
        caution2: "sui-bg-accent-background-medium",
        live: "sui-bg-live-background !sui-text-white sui-text-label-sm",
        white:
          "sui-border sui-border-solid sui-border-neutral-border sui-bg-neutral-background",
      },
    },
  },
);

export default Badge;
