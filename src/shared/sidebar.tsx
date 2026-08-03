"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Folder01Icon,
  Search01Icon,
  UserGroupIcon,
  Moon02Icon,
  Sun03Icon,
  Delete02Icon,
  Logout01Icon,
  Settings02Icon,
  UserAdd01Icon,
  Download04Icon,
} from "hugeicons-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { WorkspaceSelector } from "@/features/workspaces/components/workspace-selector";
import { logout } from "@/features/auth/api.auth";
import { useRouter } from "next/navigation";
import { InviteModal } from "@/features/workspaces/components/invite-modal";
import { useWorkspaceStore } from "@/features/workspaces/store";
import { useCurrentUser } from "@/features/auth/hooks";
import { LogoutModal } from "@/shared/logout-modal";

const mainNav = [
  { name: "File Manager", href: "/dashboard", icon: Folder01Icon },
  { name: "Members", href: "/dashboard/members", icon: UserGroupIcon },
  { name: "Search", href: "/dashboard/search", icon: Search01Icon },
  { name: "Exports", href: "/dashboard/exports", icon: Download04Icon },
  { name: "Trash", href: "/dashboard/trash", icon: Delete02Icon },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { activeWorkspaceId, workspaces } = useWorkspaceStore();
  const { data: currentUser } = useCurrentUser();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const isOwner = currentUser?.userId && activeWorkspace?.ownerId === currentUser.userId;

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  return (
    <div className="w-64 h-screen bg-background border-r border-black/5 dark:border-white/5 flex flex-col flex-shrink-0">
      <div className="h-16 flex items-center px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
            <rect x="2" y="6" width="28" height="20" rx="4" fill="var(--color-primary)" className="transition-colors" />
            <path d="M10 16L16 22L22 16" stroke="var(--color-primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 10V22" stroke="var(--color-primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-bold text-lg text-foreground tracking-tight group-hover:opacity-80 transition-opacity">
            dropdesk
          </span>
        </Link>
      </div>

      <div className="px-4 pb-4 border-b border-black/5 dark:border-white/5">
        <WorkspaceSelector />
      </div>

      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-8 px-4">
        {/* Main Nav */}
        <nav className="flex flex-col space-y-1">
          {mainNav.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
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
                {item.name === "Search" && (
                  <kbd className="hidden md:inline-flex items-center gap-1 shrink-0 text-[10px] text-muted-foreground/60 group-hover:text-muted-foreground bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded border border-black/10 dark:border-white/10 font-mono transition-colors">
                    <span className="text-[11px]">⌘</span>K
                  </kbd>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Button */}
        {isOwner && (
          <div className="px-3 mb-6">
            <button 
              onClick={() => setIsInviteOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-foreground px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-black/5 dark:border-white/5"
            >
              <UserAdd01Icon className="h-4 w-4" />
              Invite Members
            </button>
          </div>
        )}
      </div>

      {/* Footer controls */}
      <div className="p-4 border-t border-black/5 dark:border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Link
              href="/dashboard/settings"
              className="p-2 rounded-lg text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground transition-colors"
              title="Settings"
            >
              <Settings02Icon className="w-5 h-5" />
            </Link>
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

      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onSuccess={() => setIsInviteOpen(false)}
      />

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
}
