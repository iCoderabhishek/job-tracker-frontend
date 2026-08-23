"use client";

import { JobTrackerTable } from "@/features/jobs/JobTrackerTable";
import { Suspense } from "react";
import { Loading02Icon } from "hugeicons-react";

function GlobalJobsContent() {
  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden relative">
      {/* Header */}
      <div className="h-14 border-b border-black/5 dark:border-white/5 flex items-center px-4 md:px-8 bg-background sticky top-0 z-10 shrink-0">
        <h1 className="text-lg font-semibold text-foreground tracking-tight">Global Jobs</h1>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <JobTrackerTable />
      </div>
    </div>
  );
}

export default function GlobalJobsPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center h-full"><Loading02Icon className="h-8 w-8 animate-spin text-muted-foreground" /></div>}>
      <GlobalJobsContent />
    </Suspense>
  );
}
