"use client";

import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Cancel01Icon } from "hugeicons-react";
import { Folder } from "@/types";
import { useRenameFolder } from "@/features/folders/hooks";
import { normalizeError } from "@/lib/errors";
import { useWorkspaceStore } from "@/features/workspaces/store";

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: Folder | null;
}

export function RenameModal({ isOpen, onClose, folder }: RenameModalProps) {
  const { activeWorkspaceId } = useWorkspaceStore();
  const renameMutation = useRenameFolder(activeWorkspaceId || "");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  // When modal opens, set the current name
  if (folder && name === "" && !renameMutation.isPending) {
    setName(folder.name);
  }

  const handleRename = async () => {
    if (!folder || !activeWorkspaceId || !name.trim()) return;
    setError(null);
    try {
      await renameMutation.mutateAsync({ folderId: folder.id, name: name.trim() });
      onClose();
    } catch (err) {
      setError(normalizeError(err).message);
    }
  };

  return (
    <Transition show={isOpen} appear>
      <Dialog as="div" className="relative z-50" onClose={() => !renameMutation.isPending && onClose()}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm w-full bg-background rounded-2xl shadow-xl overflow-hidden border border-black/5 dark:border-white/5">
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 dark:border-white/5">
              <Dialog.Title className="text-lg font-semibold text-foreground">Rename Folder</Dialog.Title>
              {!renameMutation.isPending && (
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                  <Cancel01Icon className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="p-6">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Folder name"
                className="w-full px-4 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename();
                }}
              />
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={onClose}
                  disabled={renameMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRename}
                  disabled={renameMutation.isPending || !name.trim()}
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {renameMutation.isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
