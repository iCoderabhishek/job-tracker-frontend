"use client";

import { useState } from "react";
import { Sidebar } from "@/shared/sidebar";
import { Menu01Icon, Cancel01Icon } from "hugeicons-react";
import { GlobalSearchModal } from "@/shared/global-search-modal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - hidden on mobile unless toggled */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar />
        
        {/* Mobile close button inside sidebar area */}
        <button 
          className="absolute top-4 right-4 md:hidden p-2 bg-black/5 dark:bg-white/10 rounded-full text-foreground"
          onClick={() => setIsSidebarOpen(false)}
        >
          <Cancel01Icon className="w-5 h-5" />
        </button>
      </div>

      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        {/* Mobile Header (Hamburger) */}
        <div className="md:hidden flex items-center p-4 border-b border-black/5 dark:border-white/5 bg-background sticky top-0 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-foreground hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu01Icon className="w-6 h-6" />
          </button>
          <span className="ml-4 font-bold text-lg text-foreground tracking-tight">dropdesk</span>
        </div>
        
        {children}
      </main>
      <GlobalSearchModal />
    </div>
  );
}
