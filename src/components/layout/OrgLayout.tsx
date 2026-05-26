"use client";

import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { NavItem, BreadcrumbItem } from "./types";

interface OrgLayoutProps {
  children: ReactNode;
  orgName: string;
  orgLogo?: string;
  navItems: NavItem[];
  breadcrumbs: BreadcrumbItem[];
  userName?: string;
  userInitials?: string;
  onHelpClick?: () => void;
}

export function OrgLayout({
  children,
  orgName,
  orgLogo,
  navItems,
  breadcrumbs,
  userName,
  userInitials,
  onHelpClick,
}: OrgLayoutProps) {
  return (
    <div className="sui-flex sui-items-start sui-min-h-screen sui-bg-neutral-background-medium">
      <div className="sui-sticky sui-top-0 sui-z-50">
        <Sidebar
          orgName={orgName}
          orgLogo={orgLogo}
          navItems={navItems}
        />
      </div>
      <div className="sui-flex-1 sui-min-w-0 sui-overflow-visible">
        <Header
          breadcrumbs={breadcrumbs}
          userName={userName}
          userInitials={userInitials}
          onHelpClick={onHelpClick}
        />
        <main className="sui-px-2 md:sui-px-3 lg:sui-px-4 sui-mx-auto sui-mb-2 sui-pt-4 sui-overflow-visible">
          {children}
        </main>
      </div>
    </div>
  );
}
