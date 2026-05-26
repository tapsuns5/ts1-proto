import { type VariantProps } from "class-variance-authority";
import { type textLinkVariants } from "./TextLink";

export type TextLinkBaseProps = {
  icon?: string;
  iconPosition?: "left" | "right";
} & VariantProps<typeof textLinkVariants>;

export type TextLinkAsAnchor = TextLinkBaseProps &
  Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof TextLinkBaseProps
  > & {
    href: string;
  };

export type TextLinkAsButton = TextLinkBaseProps &
  Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    keyof TextLinkBaseProps
  > & {
    href?: undefined;
  };

export type TextLinkProps = TextLinkAsAnchor | TextLinkAsButton;
