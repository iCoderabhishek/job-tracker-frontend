"use client";

import { useQuery } from "@tanstack/react-query";
import { jobsApi } from "@/api/jobs";
import { Loading02Icon, ChartEvaluationIcon, CheckmarkCircle01Icon, Task01Icon, SentIcon } from "hugeicons-react";
import { useCurrentUser } from "@/features/auth/hooks";

export function MetricsOverview() {
  const { data: user } = useCurrentUser();
  const userId = user?.id;

  const { data: metrics, isLoading } = useQuery({
    queryKey: ["job-metrics", "today", userId],
    queryFn: () => jobsApi.getMetrics(userId!, "today"),
    enabled: !!userId,
    retry: false
  });

  if (isLoading) {
    return (
      <div className="flex gap-4 p-4 md:px-8 border-b border-black/5 dark:border-white/5 animate-pulse bg-background">
        <div className="h-16 w-48 bg-black/5 dark:bg-white/5 rounded-lg"></div>
        <div className="h-16 w-48 bg-black/5 dark:bg-white/5 rounded-lg"></div>
        <div className="h-16 w-48 bg-black/5 dark:bg-white/5 rounded-lg"></div>
      </div>
    );
  }

  // If metrics failed to load, show placeholders so the UI isn't empty while the user sets up the backend
  const statCards = metrics ? [
    { label: "Applied Today", value: metrics.total_applied, icon: <SentIcon className="w-5 h-5 text-blue-500" /> },
    { label: "Shortlisted / Interview", value: metrics.total_shortlisted + metrics.total_interviewing, icon: <CheckmarkCircle01Icon className="w-5 h-5 text-green-500" /> },
    { label: "Ghosted / Rejected", value: metrics.total_ghosted + metrics.total_rejected, icon: <Task01Icon className="w-5 h-5 text-red-500" /> },
    { label: "Trending Skill", value: metrics.trending_skills?.[0] || "None", icon: <ChartEvaluationIcon className="w-5 h-5 text-purple-500" /> },
  ] : [
    { label: "Applied Today", value: "--", icon: <SentIcon className="w-5 h-5 text-blue-500" /> },
    { label: "Shortlisted / Interview", value: "--", icon: <CheckmarkCircle01Icon className="w-5 h-5 text-green-500" /> },
    { label: "Ghosted / Rejected", value: "--", icon: <Task01Icon className="w-5 h-5 text-red-500" /> },
    { label: "Trending Skill", value: "--", icon: <ChartEvaluationIcon className="w-5 h-5 text-purple-500" /> },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 md:px-8 border-b border-black/5 dark:border-white/5 bg-muted/30">
      {statCards.map((stat, idx) => (
        <div key={idx} className="bg-card border border-black/5 dark:border-white/5 rounded-lg p-3 flex items-center gap-3 shadow-sm">
          <div className="bg-black/5 dark:bg-white/5 p-2 rounded-md">
            {stat.icon}
          </div>
          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
