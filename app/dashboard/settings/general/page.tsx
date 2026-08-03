"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ComputerIcon, Moon02Icon, Sun03Icon, Logout01Icon } from "hugeicons-react";
import { LogoutModal } from "@/shared/logout-modal";

export default function GeneralSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Appearance</h2>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <button
            onClick={() => setTheme("light")}
            className={`flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-xl border-2 transition-all ${
              theme === "light" 
                ? "border-primary bg-primary/5 text-primary" 
                : "border-black/10 dark:border-white/10 bg-background text-muted-foreground hover:border-black/20 dark:hover:border-white/20"
            }`}
          >
            <Sun03Icon className="w-6 h-6 sm:w-8 sm:h-8" />
            <span className="font-medium text-sm sm:text-base">Light</span>
          </button>
          
          <button
            onClick={() => setTheme("dark")}
            className={`flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-xl border-2 transition-all ${
              theme === "dark" 
                ? "border-primary bg-primary/5 text-primary" 
                : "border-black/10 dark:border-white/10 bg-background text-muted-foreground hover:border-black/20 dark:hover:border-white/20"
            }`}
          >
            <Moon02Icon className="w-6 h-6 sm:w-8 sm:h-8" />
            <span className="font-medium text-sm sm:text-base">Dark</span>
          </button>

          <button
            onClick={() => setTheme("system")}
            className={`flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-xl border-2 transition-all ${
              theme === "system" 
                ? "border-primary bg-primary/5 text-primary" 
                : "border-black/10 dark:border-white/10 bg-background text-muted-foreground hover:border-black/20 dark:hover:border-white/20"
            }`}
          >
            <ComputerIcon className="w-6 h-6 sm:w-8 sm:h-8" />
            <span className="font-medium text-sm sm:text-base">System</span>
          </button>
        </div>
      </div>

      <div className="pt-8 border-t border-black/5 dark:border-white/5">
        <h2 className="text-xl font-semibold text-foreground mb-4">Account</h2>
        <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-medium text-foreground">Sign Out</h3>
            <p className="text-sm text-muted-foreground mt-1">Log out of your current account</p>
          </div>
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-colors whitespace-nowrap w-full sm:w-auto justify-center sm:justify-start"
          >
            <Logout01Icon className="w-4 h-4" />
            Log out
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
