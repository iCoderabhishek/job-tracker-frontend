"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsApi } from "@/api/jobs";
import {
  Folder01Icon,
  Search01Icon,
  Moon02Icon,
  Sun03Icon,
  Logout01Icon,
  Settings02Icon,
  Download04Icon,
  Loading02Icon,
  DashboardSquare01Icon,
  Globe02Icon,
  PinLocation01Icon
} from "hugeicons-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/features/auth/hooks";
import { LogoutModal } from "@/shared/logout-modal";
import { toast } from "sonner";

const mainNav = [
  { name: "Overview", href: "/dashboard", icon: DashboardSquare01Icon, exact: true },
  { name: "Global Jobs", href: "/dashboard/global", icon: Globe02Icon },
  { name: "Regional Jobs", href: "/dashboard/regional", icon: PinLocation01Icon },
  { name: "Resumes", href: "/dashboard/resumes", icon: Download04Icon },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [syncLimit, setSyncLimit] = useState<number | "all">(10);
  const queryClient = useQueryClient();

  const syncMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser?.id) throw new Error("Not authenticated");
      return jobsApi.syncJobs(currentUser.id, syncLimit);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["job-matches"] });
      queryClient.invalidateQueries({ queryKey: ["job-metrics"] });
      toast.success("Job sync started in the background! Please check back in a few minutes to see the latest matches.");
    },
    onError: (err: any) => {
      if (err.response?.status === 403 && err.response?.data?.detail) {
        toast.error(`Rate Limit: ${err.response.data.detail}`);
      } else {
        toast.error("Failed to sync new jobs. Please try again.");
      }
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  return (
    <div className="w-full h-screen bg-background border-r border-black/5 dark:border-white/5 flex flex-col flex-shrink-0">
      <div className="h-16 flex items-center px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
            <rect x="2" y="6" width="28" height="20" rx="4" fill="var(--color-primary)" className="transition-colors" />
            <path d="M10 16L16 22L22 16" stroke="var(--color-primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 10V22" stroke="var(--color-primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-bold text-lg text-foreground tracking-tight group-hover:opacity-80 transition-opacity">
            jtracker
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-8 px-4">
        {/* Main Nav */}
        <nav className="flex flex-col space-y-1">
          {mainNav.map((item) => {
            const isActive = item.exact ? pathname === item.href : (pathname === item.href || pathname?.startsWith(item.href + "/"));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => onNavigate?.()}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                  isActive
                    ? "bg-black/5 dark:bg-white/10 text-foreground"
                    : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="px-3 mb-6 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Fetch Global</span>
            <select
              value={syncLimit}
              onChange={(e) => setSyncLimit(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="text-xs bg-black/5 dark:bg-white/5 rounded px-2 py-0.5 outline-none text-foreground font-medium cursor-pointer border border-black/10 dark:border-white/10"
            >
              <option value={10} className="bg-background">10 Jobs</option>
              <option value={50} className="bg-background">50 Jobs</option>
              <option value={100} className="bg-background">100 Jobs</option>
              <option value={200} className="bg-background">200 Jobs</option>
              <option value={400} className="bg-background">400 Jobs</option>
              <option value={600} className="bg-background">600 Jobs</option>
              <option value={1000} className="bg-background">1000 Jobs</option>
              {currentUser?.is_admin && (
                <option value="all" className="bg-background">All Jobs</option>
              )}
            </select>
          </div>
          <button 
            onClick={() => syncMutation.mutate()}
            disabled={syncMutation.isPending || !currentUser?.id}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          >
            {syncMutation.isPending ? (
              <Loading02Icon className="h-4 w-4 animate-spin" />
            ) : (
              <Search01Icon className="h-4 w-4" />
            )}
            {syncMutation.isPending ? "Syncing..." : "Fetch New Jobs"}
          </button>
        </div>
      </div>

      {/* Footer controls */}
      <div className="p-4 border-t border-black/5 dark:border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                router.push('/dashboard/settings');
                onNavigate?.();
              }}
              className="p-2 rounded-lg text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground transition-colors"
              title="Settings"
            >
              <Settings02Icon className="w-5 h-5" />
            </button>
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground transition-colors"
                title="Toggle theme"
              >
                {theme === "dark" ? <Sun03Icon className="w-5 h-5" /> : <Moon02Icon className="w-5 h-5" />}
              </button>
            )}
          </div>
          <button
            onClick={handleLogoutClick}
            className="p-2 rounded-lg text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <Logout01Icon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
}
