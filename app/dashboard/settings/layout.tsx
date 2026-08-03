"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowRight01Icon } from "hugeicons-react";

const navItems = [
  { name: "General", href: "/dashboard/settings/general" },
  { name: "Workspace", href: "/dashboard/settings/workspace" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex-1 overflow-y-auto bg-background flex flex-col">
      {/* Header with Breadcrumb */}
      <div className="min-h-[64px] py-4 border-b border-black/5 dark:border-white/5 flex items-center px-4 md:px-8 bg-background sticky top-0 z-10">
        <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-muted-foreground">
          <Link href="/dashboard" className="hover:text-foreground transition-colors whitespace-nowrap">Dashboard</Link>
          <ArrowRight01Icon className="w-4 h-4 flex-shrink-0" />
          <span className="text-foreground whitespace-nowrap">Settings</span>
          {pathname.includes("/general") && (
            <>
              <ArrowRight01Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-foreground capitalize whitespace-nowrap">General</span>
            </>
          )}
          {pathname.includes("/workspace") && (
            <>
              <ArrowRight01Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-foreground capitalize whitespace-nowrap">Workspace</span>
            </>
          )}
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8 tracking-tight">Settings</h1>
        
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          {/* Side Nav */}
          <nav className="w-full md:w-64 flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 flex-shrink-0 scrollbar-none">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-black/5 dark:bg-white/10 text-foreground"
                      : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
