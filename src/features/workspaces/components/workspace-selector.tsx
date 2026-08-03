"use client";

import { useEffect, useState } from "react";
import { useWorkspaceStore } from "../store";
import { fetchWorkspaces } from "../api.workspaces";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { CheckmarkBadge01Icon, ArrowDown01Icon, PlusSignIcon } from "hugeicons-react";
import { cn } from "@/lib/utils";
import { normalizeError } from "@/lib/errors";
import { CreateWorkspaceModal } from "./create-workspace-modal";

export function WorkspaceSelector() {
  const { workspaces, activeWorkspaceId, setWorkspaces, setActiveWorkspaceId } = useWorkspaceStore();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  useEffect(() => setMounted(true), []);

  const loadWorkspaces = async () => {
    setLoading(true);
    try {
      const data = await fetchWorkspaces();
      setWorkspaces(data);
    } catch (err) {
      console.error("Failed to fetch workspaces:", normalizeError(err).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspaces();
  }, [setWorkspaces]);

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  if (!mounted) return <div className="h-10 w-full animate-pulse bg-black/5 rounded-lg"></div>;

  return (
    <Menu as="div" className="relative w-full">
      <MenuButton className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left bg-background border border-black/10 dark:border-white/10 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none">
        <div className="flex flex-col truncate">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Workspace</span>
          <span className="text-sm font-semibold text-foreground truncate">
            {loading ? "Loading..." : activeWorkspace?.workspaceName || "No Workspace"}
          </span>
        </div>
        <ArrowDown01Icon className="w-4 h-4 text-muted-foreground" />
      </MenuButton>
      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute left-0 z-10 mt-2 w-full origin-top-left rounded-xl bg-background shadow-lg ring-1 ring-black/5 focus:outline-none p-1">
          {workspaces.map((ws) => (
            <MenuItem key={ws.id}>
              {({ active }) => (
                <button
                  onClick={() => setActiveWorkspaceId(ws.id)}
                  className={cn(
                    "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors",
                    active ? "bg-black/5 dark:bg-white/10 text-foreground" : "text-foreground",
                    activeWorkspaceId === ws.id ? "font-semibold" : ""
                  )}
                >
                  <span className="truncate">{ws.workspaceName}</span>
                  {activeWorkspaceId === ws.id && <CheckmarkBadge01Icon className="w-4 h-4 text-primary" />}
                </button>
              )}
            </MenuItem>
          ))}
          
          <div className="p-1 mt-1 border-t border-black/5 dark:border-white/10">
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors",
                    active ? "bg-black/5 dark:bg-white/10 text-foreground" : "text-muted-foreground"
                  )}
                >
                  <PlusSignIcon className="w-4 h-4" />
                  <span>Create new workspace</span>
                </button>
              )}
            </MenuItem>
          </div>

          {workspaces.length === 0 && !loading && (
            <div className="px-3 py-2 text-sm text-muted-foreground">No workspaces found</div>
          )}
        </MenuItems>
      </Transition>

      <CreateWorkspaceModal 
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => {
          loadWorkspaces();
        }}
      />
    </Menu>
  );
}
