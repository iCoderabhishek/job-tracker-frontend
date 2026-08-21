"use client";

import { JobTrackerTable } from "@/features/jobs/JobTrackerTable";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsApi } from "@/api/jobs";
import { useCurrentUser } from "@/features/auth/hooks";
import { Search01Icon, Loading02Icon, Location01Icon } from "hugeicons-react";
import { toast } from "sonner";

export default function RegionalJobsPage() {
  const [regionInput, setRegionInput] = useState("");
  const [activeRegion, setActiveRegion] = useState("");
  const { data: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();

  const syncMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser?.id) throw new Error("Not authenticated");
      if (!regionInput) throw new Error("Please enter a region");
      return jobsApi.syncJobs(currentUser.id, "all", regionInput);
    },
    onSuccess: () => {
      setActiveRegion(regionInput);
      queryClient.invalidateQueries({ queryKey: ["job-matches"] });
      queryClient.invalidateQueries({ queryKey: ["job-metrics"] });
    },
    onError: (err: any) => {
      if (err.response?.status === 403 && err.response?.data?.detail) {
        toast.error(`Rate Limit: ${err.response.data.detail}`);
      } else {
        toast.error(err.message || "Failed to sync regional jobs. Please try again.");
      }
    }
  });

  const handleGetMatches = () => {
    if (regionInput) {
      setActiveRegion(regionInput);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden relative">
      {/* Header */}
      <div className="h-auto border-b border-black/5 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between px-4 md:px-8 py-4 bg-background sticky top-0 z-10 shrink-0 gap-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground tracking-tight">Regional Jobs</h1>
          <p className="text-sm text-muted-foreground">Find and sync jobs for a specific region.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Location01Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              value={regionInput}
              onChange={(e) => setRegionInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleGetMatches(); }}
              placeholder="e.g. london, india, remote"
              className="block w-full pl-9 pr-3 py-2 border border-black/10 dark:border-white/10 rounded-xl leading-5 bg-black/5 dark:bg-white/5 placeholder-muted-foreground focus:outline-none focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
            />
          </div>
          
          <button
            onClick={handleGetMatches}
            className="px-4 py-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-foreground text-sm font-medium rounded-xl transition-colors shrink-0"
          >
            Get Matches
          </button>
          
          <button
            onClick={() => syncMutation.mutate()}
            disabled={syncMutation.isPending || !regionInput}
            className="px-4 py-2 flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium rounded-xl transition-colors disabled:opacity-50 shrink-0"
          >
            {syncMutation.isPending ? (
              <Loading02Icon className="h-4 w-4 animate-spin" />
            ) : (
              <Search01Icon className="h-4 w-4" />
            )}
            <span className="hidden md:inline">{syncMutation.isPending ? "Syncing..." : "Sync & Fetch New"}</span>
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {!activeRegion ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <Location01Icon className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Enter a Region</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              Type a location in the search bar above and click &quot;Get Matches&quot; to view existing jobs, or &quot;Sync &amp; Fetch New&quot; to trigger a new scrape for that region.
            </p>
          </div>
        ) : (
          <JobTrackerTable region={activeRegion} />
        )}
      </div>
    </div>
  );
}
