"use client";

import { useCurrentUser } from "@/features/auth/hooks";
import { useStorageQuota } from "@/features/files/hooks";
import { CloudServerIcon, Folder01Icon } from "hugeicons-react";
import { formatBytes } from "@/lib/utils";

interface WelcomeBoardProps {
  workspaceId: string;
}

export function WelcomeBoard({ workspaceId }: WelcomeBoardProps) {
  const { data: user } = useCurrentUser();
  const { data: quota, isLoading } = useStorageQuota(workspaceId);

  const firstName = user?.name?.split(" ")[0] || "there";

  const usedBytes = quota ? parseInt(quota.used, 10) : 0;
  const limitBytes = quota ? parseInt(quota.limit, 10) : 524288000;
  
  const percentage = Math.min(100, Math.round((usedBytes / limitBytes) * 100)) || 0;

  return (
    <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
      <div className="flex flex-col">
        <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2 mb-1">
          Good to see you, {firstName} <span className="text-2xl">👋</span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Here's a quick overview of your workspace storage.
        </p>
      </div>

      <div className="flex items-center gap-4 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-4 w-full md:w-auto">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <CloudServerIcon className="w-5 h-5" />
        </div>
        <div className="flex flex-col w-full md:w-56 gap-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-foreground">Storage Usage</span>
            <span className="font-semibold text-primary">{percentage}%</span>
          </div>
          <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="text-[10px] text-muted-foreground font-medium text-right mt-0.5">
            {isLoading ? "Loading..." : `${formatBytes(usedBytes)} of ${formatBytes(limitBytes)} used`}
          </div>
        </div>
      </div>
    </div>
  );
}
