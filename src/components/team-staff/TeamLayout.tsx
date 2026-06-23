"use client";

import { ReactNode } from "react";
import { SimpleIcon } from "@/components/SimpleIcon";

interface TeamNavItem {
  label: string;
  icon: string;
  href: string;
  active?: boolean;
}

interface TeamLayoutProps {
  teamName: string;
  teamLogo?: string;
  userName?: string;
  userInitials?: string;
  backHref?: string;
  navItems: TeamNavItem[];
  children: ReactNode;
}

export function TeamLayout({
  teamName,
  teamLogo,
  userName,
  userInitials,
  backHref,
  navItems,
  children,
}: TeamLayoutProps) {
  return (
    <div className="sui-flex sui-min-h-screen sui-bg-neutral-background-medium">
      <aside className="sui-sticky sui-top-0 sui-z-50 sui-flex sui-h-screen sui-w-[72px] sui-flex-col sui-items-center sui-bg-brand-background-strong sui-py-4 sui-gap-4 sui-flex-shrink-0">
        <div className="sui-h-12 sui-w-12 sui-rounded-full sui-overflow-hidden sui-bg-white/10 sui-grid sui-place-items-center sui-flex-shrink-0">
          {teamLogo ? (
            <img src={teamLogo} alt={`${teamName} logo`} className="sui-w-full sui-h-full sui-object-cover" />
          ) : (
            <span className="sui-text-white sui-font-bold sui-text-label">
              {teamName.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <nav className="sui-flex-1 sui-flex sui-flex-col sui-gap-2 sui-w-full sui-items-center">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              title={item.label}
              className={`sui-grid sui-place-content-center sui-h-12 sui-w-12 sui-rounded-full sui-transition-colors sui-duration-200 ${
                item.active
                  ? "sui-bg-consumer-action-background sui-text-white"
                  : "sui-text-white/70 hover:sui-bg-white/10 hover:sui-text-white"
              }`}
            >
              <SimpleIcon name={item.icon} size="l" />
            </a>
          ))}
        </nav>
      </aside>

      <div className="sui-flex sui-flex-1 sui-flex-col sui-min-w-0">
        <header className="sui-sticky sui-top-0 sui-z-40 sui-flex sui-items-center sui-justify-between sui-px-4 sui-h-[64px] sui-bg-white sui-border-b sui-border-solid sui-border-neutral-border">
          <div className="sui-flex sui-items-center sui-gap-2">
            {backHref && (
              <a
                href={backHref}
                className="sui-flex sui-items-center sui-gap-1 sui-text-body sui-text-neutral-text-medium hover:sui-text-admin-action-text sui-transition-colors"
              >
                <SimpleIcon name="arrow_back" size="s" />
                <span>Back</span>
              </a>
            )}
            <span className="sui-text-body sui-font-semibold sui-text-neutral-text">
              {teamName}
            </span>
          </div>
          <div className="sui-flex sui-items-center sui-gap-3">
            <button
              type="button"
              className="sui-grid sui-place-content-center sui-h-[40px] sui-w-[40px] sui-rounded-full sui-border sui-border-solid sui-border-neutral-border sui-text-neutral-icon hover:sui-text-consumer-action-text hover:sui-border-consumer-action-border sui-transition-colors"
              aria-label="Help"
            >
              <SimpleIcon name="help" size="default" />
            </button>
            {userInitials && (
              <div
                className="sui-grid sui-place-content-center sui-h-[40px] sui-w-[40px] sui-rounded-full sui-bg-consumer-action-background sui-text-white sui-font-semibold sui-text-label"
                title={userName}
              >
                {userInitials}
              </div>
            )}
          </div>
        </header>

        <main className="sui-flex-1 sui-p-4 sui-overflow-visible">
          {children}
        </main>
      </div>
    </div>
  );
}
