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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => setTheme("light")}
            className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all ${
              theme === "light" 
                ? "border-primary bg-primary/5 text-primary" 
                : "border-black/5 dark:border-white/5 bg-background text-muted-foreground hover:border-black/10 dark:hover:border-white/10"
            }`}
          >
            <Sun03Icon className="w-8 h-8" />
            <span className="font-medium">Light</span>
          </button>
          
          <button
            onClick={() => setTheme("dark")}
            className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all ${
              theme === "dark" 
                ? "border-primary bg-primary/5 text-primary" 
                : "border-black/5 dark:border-white/5 bg-background text-muted-foreground hover:border-black/10 dark:hover:border-white/10"
            }`}
          >
            <Moon02Icon className="w-8 h-8" />
            <span className="font-medium">Dark</span>
          </button>

          <button
            onClick={() => setTheme("system")}
            className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all ${
              theme === "system" 
                ? "border-primary bg-primary/5 text-primary" 
                : "border-black/5 dark:border-white/5 bg-background text-muted-foreground hover:border-black/10 dark:hover:border-white/10"
            }`}
          >
            <ComputerIcon className="w-8 h-8" />
            <span className="font-medium">System</span>
          </button>
        </div>
      </div>

      <div className="pt-8 border-t border-black/5 dark:border-white/5">
        <h2 className="text-xl font-semibold text-foreground mb-4">Account</h2>
        <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl p-6 flex items-center justify-between">
          <div>
            <h3 className="font-medium text-foreground">Sign Out</h3>
            <p className="text-sm text-muted-foreground mt-1">Log out of your current account</p>
          </div>
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-colors"
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
