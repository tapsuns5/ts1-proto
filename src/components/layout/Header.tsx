"use client";

import { SimpleIcon } from "../SimpleIcon";
import Avatar from "../Avatar/Avatar";
import { BreadcrumbItem } from "./types";

interface HeaderProps {
  breadcrumbs: BreadcrumbItem[];
  userName?: string;
  userInitials?: string;
  onHelpClick?: () => void;
}

export function Header({
  breadcrumbs,
  userName = "User",
  userInitials,
  onHelpClick,
}: HeaderProps) {
  return (
    <div className="sui-gap-1 sui-shadow-1 sui-bg-neutral-background-weak sui-border-solid sui-border-b sui-border-neutral-border sui-sticky sui-top-[0px] sui-z-50 sui-px-2 md:sui-px-3 lg:sui-px-4 sui-py-[8px] lg:sui-py-[12px] sui-items-center lg:sui-justify-space-between sui-flex">
      <div>
        <nav aria-label="breadcrumb" className="sui-px-1">
          <ol className="sui-gap-1.5 sui-text-sm sm:sui-gap-2.5 sui-flex sui-items-center sui-break-words">
            {breadcrumbs.map((item, index) => (
              <li key={index} className="sui-gap-1.5 sui-inline-flex sui-items-center sui-label">
                {item.href ? (
                  <a
                    href={item.href}
                    className={`hover:sui-underline ${item.active ? "active" : ""}`}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className={item.active ? "active" : ""}>{item.label}</span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <span className="sui-text-neutral-text-weak sui-relative sui-top-[4px]">
                    <SimpleIcon name="chevron_right" size="s" />
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
      <div className="sui-ml-auto">
        <div className="sui-flex sui-gap-2 sui-items-center">
          <button
            onClick={onHelpClick}
            className="sui-place-content-center active:sui-scale-95 sui-text-admin-action-text hover:sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover active:sui-bg-admin-action-background-weak-pressed sui-min-w-[32px] sui-w-[48px] sui-h-[48px] sui-rounded-full sui-border sui-border-neutral-border sui-grid"
            type="button"
            data-testid="open-help-button"
            aria-label="Help"
          >
            <SimpleIcon name="help" size="s" />
          </button>
          <div className="Avatar-module__avatar sui-pointer-cursor sui-w-[32px] sui-h-[32px] sm:sui-w-[48px] sm:sui-h-[48px] sui-flex hover:sui-bg-admin-action-background hover:sui-text-neutral-text-inverse sui-rounded-full sui-grid sui-place-items-center sui-bg-admin-action-background sui-text-white">
            {userInitials || userName.slice(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
}
