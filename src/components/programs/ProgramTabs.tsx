"use client";

import { useState } from "react";
import { ScheduleTab } from "./ScheduleTab";

interface TabConfig {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface ProgramTabsProps {
  tabs: TabConfig[];
  defaultTab?: string;
}

export function ProgramTabs({ tabs, defaultTab }: ProgramTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div>
      <div role="tablist" className="sui-relative sui-outline-none">
        <div className="sui-hide-scrollbar sui-flex sui-snap-x sui-flex-nowrap sui-overflow-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              data-state={activeTab === tab.id ? "active" : "inactive"}
              onClick={() => setActiveTab(tab.id)}
              className={`sui-z-10 sui-snap-start sui-whitespace-nowrap sui-text-label sui-min-h-[48px] sui-border-b-4 sui-border-b-transparent sui-transition-colors sui-duration-250 sui-text-neutral-text data-[state=active]:sui-border-admin-action-border data-[state=active]:sui-text-admin-action-text sui-scroll-ml-2 ${
                activeTab === tab.id ? "" : "sui-border-b-transparent"
              }`}
            >
              <span className="sui-px-3 sui-py-1 hover:sui-rounded-[16px] sui-transition-all sui-duration-[180ms] hover:sui-bg-admin-action-background-weak-hover hover:sui-text-admin-action-text-hover">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
        <span className="sui-relative sui-bottom-[1px] sui-right-0 sui-block sui-h-[1px] sui-w-full sui-border-b sui-border-neutral-border" />
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          data-state={activeTab === tab.id ? "active" : "inactive"}
          hidden={activeTab !== tab.id}
          id={`tabpanel-${tab.id}`}
          className={activeTab === tab.id ? "" : "hidden"}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
