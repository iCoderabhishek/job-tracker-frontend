"use client";

import { useState } from "react";
import { useWorkspaceStore } from "@/features/workspaces/store";
import { updateWorkspace, deleteWorkspace, fetchWorkspaces } from "@/features/workspaces/api.workspaces";
import { useCurrentUser } from "@/features/auth/hooks";
import { normalizeError } from "@/lib/errors";
import { useRouter } from "next/navigation";
import { Delete02Icon, Edit01Icon } from "hugeicons-react";

export default function WorkspaceSettings() {
  const { activeWorkspaceId, setActiveWorkspaceId, setWorkspaces, workspaces } = useWorkspaceStore();
  const { data: currentUser } = useCurrentUser();
  const router = useRouter();

  const [newName, setNewName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameError, setRenameError] = useState<string | null>(null);
  const [renameSuccess, setRenameSuccess] = useState(false);

  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleRename = async () => {
    if (!activeWorkspaceId || !newName.trim()) return;
    setIsRenaming(true);
    setRenameError(null);
    setRenameSuccess(false);
    try {
      await updateWorkspace(activeWorkspaceId, newName.trim());
      const updatedWorkspaces = await fetchWorkspaces();
      setWorkspaces(updatedWorkspaces);
      setRenameSuccess(true);
      setNewName("");
    } catch (err) {
      setRenameError(normalizeError(err).message);
    } finally {
      setIsRenaming(false);
    }
  };

  const handleDelete = async () => {
    if (!activeWorkspaceId) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteWorkspace(activeWorkspaceId);
      const updatedWorkspaces = await fetchWorkspaces();
      setWorkspaces(updatedWorkspaces);
      setActiveWorkspaceId(updatedWorkspaces.length > 0 ? updatedWorkspaces[0].id : null);
      router.push("/dashboard");
    } catch (err) {
      setDeleteError(normalizeError(err).message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!activeWorkspaceId) {
    return (
      <div className="text-muted-foreground text-sm">
        No active workspace selected.
      </div>
    );
  }

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const isOwner = currentUser?.userId && activeWorkspace?.ownerId === currentUser.userId;

  if (!isOwner) {
    return (
      <div className="text-muted-foreground text-sm p-6 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
        <h3 className="font-semibold text-foreground mb-1">Restricted Access</h3>
        <p>Only the workspace owner can modify or delete this workspace.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Rename Workspace</h2>
        <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-4">
            Change the name of your current active workspace.
          </p>
          <div className="flex items-center gap-3 max-w-md">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New workspace name"
              className="flex-1 px-4 py-2 bg-background border border-black/10 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              onClick={handleRename}
              disabled={isRenaming || !newName.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Edit01Icon className="w-4 h-4" />
              {isRenaming ? "Saving..." : "Rename"}
            </button>
          </div>
          {renameError && <p className="text-red-500 text-xs mt-2">{renameError}</p>}
          {renameSuccess && <p className="text-green-500 text-xs mt-2">Workspace renamed successfully.</p>}
        </div>
      </div>

      <div className="pt-8 border-t border-black/5 dark:border-white/5">
        <h2 className="text-xl font-semibold text-foreground mb-4">Danger Zone</h2>
        <div className="border border-red-500/20 rounded-xl p-6 bg-red-500/5">
          <h3 className="font-medium text-red-500 mb-2">Delete Workspace</h3>
          <p className="text-sm text-red-500/80 mb-6">
            Once you delete a workspace, there is no going back. This will permanently delete all files, folders, and memberships associated with it.
          </p>
          
          <div className="max-w-md space-y-3">
            <label className="text-xs text-red-500/80 font-medium uppercase tracking-wider block">
              Type "DELETE" to confirm
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={deleteConfirmName}
                onChange={(e) => setDeleteConfirmName(e.target.value)}
                placeholder="DELETE"
                className="flex-1 px-4 py-2 bg-background border border-red-500/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 text-red-500"
              />
              <button
                onClick={handleDelete}
                disabled={isDeleting || deleteConfirmName !== "DELETE"}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                <Delete02Icon className="w-4 h-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
            {deleteError && <p className="text-red-500 text-xs mt-2">{deleteError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
