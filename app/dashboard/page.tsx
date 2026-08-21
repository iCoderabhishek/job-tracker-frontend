"use client";

import { MetricsOverview } from "@/features/jobs/MetricsOverview";
import { useQuery } from "@tanstack/react-query";
import { jobsApi } from "@/api/jobs";
import { useCurrentUser } from "@/features/auth/hooks";
import { DashboardSquare01Icon, StarIcon } from "hugeicons-react";

export default function DashboardOverviewPage() {
  const { data: currentUser } = useCurrentUser();
  const userId = currentUser?.id;

  const { data: topMatches, isLoading } = useQuery({
    queryKey: ["job-matches", 5, userId],
    queryFn: () => jobsApi.getMatches(userId!, 5),
    enabled: !!userId,
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto">
      {/* Header */}
      <div className="h-14 border-b border-black/5 dark:border-white/5 flex items-center px-4 md:px-8 bg-background sticky top-0 z-10 shrink-0">
        <h1 className="text-lg font-semibold text-foreground tracking-tight flex items-center gap-2">
          <DashboardSquare01Icon className="w-5 h-5" />
          Dashboard Overview
        </h1>
      </div>
      
      {/* Metrics Bar */}
      <div className="shrink-0">
        <MetricsOverview />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full flex flex-col gap-8">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <StarIcon className="w-5 h-5 text-amber-500" />
            Top Scored Matches
          </h2>
          
          <div className="bg-card border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading top matches...</div>
            ) : !topMatches || topMatches.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No matches found. Run a sync to get started.</div>
            ) : (
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {topMatches.map((match) => (
                  <div key={match.id} className="p-4 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <div>
                      <h4 className="font-semibold text-foreground">{match.job.company}</h4>
                      <p className="text-sm text-muted-foreground">{match.job.title} &bull; {match.job.location || 'Remote'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        match.match_score >= 80 ? 'bg-green-500/10 text-green-600' : 
                        match.match_score >= 50 ? 'bg-amber-500/10 text-amber-600' : 'bg-red-500/10 text-red-600'
                      }`}>
                        {Math.round(match.match_score)}% Match
                      </div>
                      <a 
                        href={match.job.apply_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Apply
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
