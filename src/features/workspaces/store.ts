import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchWorkspaces } from "./api.workspaces";
import { Workspace } from "@/types";

interface WorkspaceState {
  activeWorkspaceId: string | null;
  workspaces: Workspace[];
  setActiveWorkspaceId: (id: string | null) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      activeWorkspaceId: null,
      workspaces: [],
      setActiveWorkspaceId: (id) => set({ activeWorkspaceId: id }),
      setWorkspaces: (workspaces) =>
        set((state) => {
          // If no active workspace is set, but we have workspaces, auto-select the first one
          if (!state.activeWorkspaceId && workspaces.length > 0) {
            return { workspaces, activeWorkspaceId: workspaces[0].id };
          }
          return { workspaces };
        }),
    }),
    {
      name: "dropdesk-workspace-storage",
    }
  )
);
