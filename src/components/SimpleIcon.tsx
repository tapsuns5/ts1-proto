"use client";

interface SimpleIconProps {
  name: string;
  size?: "s" | "default" | "l";
  className?: string;
}

const iconSizeMap = {
  s: "sui-text-lg",
  default: "sui-text-xl",
  l: "sui-text-2xl",
};

export function SimpleIcon({ name, size = "default", className = "" }: SimpleIconProps) {
  const sizeClass = iconSizeMap[size];
  
  return (
    <span className={`material-symbols-rounded ${sizeClass} ${className}`}>
      {name}
    </span>
  );
}
