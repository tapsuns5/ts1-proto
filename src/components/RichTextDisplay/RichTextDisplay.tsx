import * as React from "react";
import DOMPurify from "dompurify";
import { cn } from "../../utils";

type RichTextDisplayProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children" | "dangerouslySetInnerHTML"
> & {
  /** The raw HTML string to render. */
  html: string;
  /** Whether to sanitize the HTML with DOMPurify. Defaults to `true`. */
  sanitize?: boolean;
};

const RichTextDisplay = React.forwardRef<HTMLDivElement, RichTextDisplayProps>(
  ({ className, html, sanitize = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("ts-rich-text-display", className)}
      dangerouslySetInnerHTML={{
        __html: sanitize ? DOMPurify.sanitize(html, { ADD_ATTR: ['target'] }) : html,
      }}
      {...props}
    />
  ),
);
RichTextDisplay.displayName = "RichTextDisplay";

export { RichTextDisplay };
export type { RichTextDisplayProps };
