export type BadgeVariant =
  | "positive"
  | "caution1"
  | "negative"
  | "neutral"
  | "accent"
  | "caution2"
  | "live"
  | "white";

export interface BadgeProps {
  labelText: string;
  variant: BadgeVariant;
  className?: string;
  [x: string]: any;
}
