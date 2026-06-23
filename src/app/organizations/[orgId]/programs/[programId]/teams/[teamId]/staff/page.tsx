"use client";

import { Suspense } from "react";
import { TeamStaffPage } from "@/components/team-staff";

export default function StaffPage() {
  return (
    <Suspense
      fallback={
        <div className="sui-flex sui-items-center sui-justify-center sui-min-h-screen sui-p-4">
          <div className="sui-flex sui-flex-col sui-items-center sui-gap-2">
            <span className="material-symbols-rounded sui-text-2xl sui-animate-spin sui-text-admin-action-text">
              progress_activity
            </span>
            <p className="sui-text-body sui-font-medium">Loading staff page</p>
          </div>
        </div>
      }
    >
      <TeamStaffPage />
    </Suspense>
  );
}
