"use client";

import { forwardRef } from "react";
import { getCodepoint } from "./codepoints";

interface SimpleLabelButtonProps {
  type?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  iconLeft?: string;
  iconRight?: string;
  dataTestId?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const SimpleLabelButton = forwardRef<HTMLButtonElement, SimpleLabelButtonProps>(
  ({
    type = "primary",
    size = "medium",
    label,
    onClick,
    disabled = false,
    iconLeft,
    iconRight,
    dataTestId,
    className,
    style,
  }, ref) => {
    const baseClasses = "sui-font-semibold sui-rounded-full sui-border sui-border-solid sui-cursor-pointer sui-transition-all sui-flex sui-items-center sui-gap-2 sui-flex-shrink-0";
    
    const typeClasses = {
      primary: "sui-bg-admin-action-background sui-text-white sui-border-admin-action-border hover:sui-bg-admin-action-background-hover active:sui-scale-95",
      secondary: "sui-bg-white sui-text-admin-action-text sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover active:sui-scale-95",
      tertiary: "sui-bg-transparent sui-text-admin-action-text sui-border-transparent hover:sui-bg-admin-action-background-weak-hover active:sui-scale-95",
    };

    const sizeClasses = {
      small: iconLeft 
        ? "sui-text-sm sui-h-[32px] sui-pl-[18px] sui-pr-3 sui-py-0" 
        : iconRight 
          ? "sui-text-sm sui-h-[32px] sui-pr-[18px] sui-pl-3 sui-py-0"
          : "sui-text-sm sui-px-3 sui-h-[32px] sui-py-0",
      medium: "sui-text-base sui-px-4 sui-py-2 sui-h-[48px]",
      large: "sui-text-lg sui-px-6 sui-py-3 sui-h-12",
    };

    const disabledClasses = disabled ? "sui-opacity-50 sui-cursor-not-allowed" : "";

    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${typeClasses[type]} ${sizeClasses[size]} ${disabledClasses} ${className || ""}`}
        data-testid={dataTestId}
        style={style}
      >
        {iconLeft && <span className="material-symbols-rounded sui-text-xl">{getCodepoint(iconLeft)}</span>}
        <span className="label-text">{label}</span>
        {iconRight && <span className="material-symbols-rounded sui-text-xl">{getCodepoint(iconRight)}</span>}
      </button>
    );
  }
);

SimpleLabelButton.displayName = "SimpleLabelButton";
