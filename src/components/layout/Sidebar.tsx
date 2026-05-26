"use client";

import { useState } from "react";
import { SimpleIcon } from "../SimpleIcon";
import { NavItem } from "./types";

interface SidebarProps {
  orgName: string;
  orgLogo?: string;
  navItems: NavItem[];
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function Sidebar({
  orgName,
  orgLogo,
  navItems,
  isExpanded = true,
  onToggle,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    onToggle?.();
  };

  return (
    <div
      className={`sui-bg-neutral-background-weak sui-border-solid sui-border-r sui-border-neutral-border sui-h-screen sui-transition-all sui-relative sui-group sui-flex sui-flex-col ${
        isCollapsed ? "sui-w-[60px]" : "sui-w-[250px]"
      }`}
    >
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={!isCollapsed}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="sui-rounded-full sui-border-solid sui-border sui-border-neutral-border sui-bg-white sui-h-3 sui-w-3 lg:sui-h-4 lg:sui-w-4 sui-place-items-center sui-absolute sui-top-[20px] sui-right-[-16px] sui-z-50 sm:sui-grid sui-transition-all sui-opacity-0 group-hover:sui-opacity-100 focus-visible:sui-opacity-100"
      >
        <SimpleIcon name={isCollapsed ? "add" : "remove"} size="s" />
      </button>

      <div className="sui-flex sui-flex-col sui-h-screen">
        <div className="sui-px-1 sui-pt-5 md:sui-pt-2 sui-mb-1">
          <button
            type="button"
            className="sui-py-2 sui-px-1 sui-rounded-lg sui-border-solid sui-border sui-border-transparent hover:sui-bg-neutral-background-medium hover:sui-border-neutral-border sui-flex sui-gap-2 sui-items-center md:sui-mx-auto sui-w-full"
          >
            <figure className="sui-rounded-full sui-overflow-hidden sui-h-[56px] sui-min-w-[56px] sui-w-[56px] sui-grid sui-place-items-center sui-bg-neutral-background-weak sui-border sui-border-solid sui-border-neutral-border-medium">
              {orgLogo ? (
                <img className="sui-w-full" alt={`${orgName} logo`} src={orgLogo} />
              ) : (
                <span className="sui-text-display-sm sui-font-semibold">
                  {orgName.slice(0, 2).toUpperCase()}
                </span>
              )}
            </figure>
            {!isCollapsed && (
              <p className="sui-text-display-sm sui-flex-1 sui-text-left">
                {orgName}
              </p>
            )}
          </button>
        </div>

        <nav aria-label="Main" className="sui-flex-1 sui-px-1 sui-overflow-hidden">
          <ul className="sui-grid sui-gap-1">
            {navItems.map((item) => (
              <li key={item.href} className="sui-relative sui-w-full">
                {item.hasSubmenu ? (
                  <button
                    className={`sui-group sui-w-full sui-text-left hover:sui-bg-accent-background-weak focus:sui-bg-accent-background-weak sui-px-3 sui-py-2 sui-font-semibold sui-flex sui-items-center sui-gap-2 ${
                      item.active
                        ? "sui-bg-accent-background sui-text-white sui-fill-white"
                        : "sui-text-neutral-text"
                    }`}
                  >
                    <SimpleIcon name={item.icon} />
                    {!isCollapsed && <span>{item.label}</span>}
                    {!isCollapsed && <SimpleIcon name="expand_more" className="sui-ml-auto" />}
                  </button>
                ) : (
                  <a
                    href={item.href}
                    className={`sui-group sui-pr-3 sui-h-[56px] lg:sui-py-2 sui-flex sui-items-center sui-gap-2 sui-font-semibold sui-pl-3 ${
                      item.active
                        ? "sui-bg-accent-background sui-text-white sui-fill-white hover:sui-bg-accent-background-hover focus:sui-bg-accent-background-hover"
                        : "sui-text-neutral-text hover:sui-bg-accent-background-weak focus:sui-bg-accent-background-weak"
                    }`}
                  >
                    <SimpleIcon name={item.icon} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="sui-p-2 md:sui-p-4">
          <figure className="sui-w-[160px] sui-mx-auto">
            <img src="/images/ts-one-logo.svg" alt="TeamSnap One logo" className="sui-w-full" />
          </figure>
        </div>
      </div>
    </div>
  );
}
