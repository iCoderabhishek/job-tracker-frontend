"use client";

import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Cancel01Icon } from "hugeicons-react";
import { Folder, FileItem } from "@/types";
import { useDeleteFolder } from "@/features/folders/hooks";
import { useDeleteFile } from "@/features/files/hooks";
import { normalizeError } from "@/lib/errors";
import { useWorkspaceStore } from "@/features/workspaces/store";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Folder | FileItem | null;
  type: "folder" | "file";
}

export function DeleteModal({ isOpen, onClose, item, type }: DeleteModalProps) {
  const { activeWorkspaceId } = useWorkspaceStore();
  const deleteFolderMutation = useDeleteFolder(activeWorkspaceId || "");
  const deleteFileMutation = useDeleteFile(activeWorkspaceId || "");
  const [error, setError] = useState<string | null>(null);

  const isPending = deleteFolderMutation.isPending || deleteFileMutation.isPending;

  const handleDelete = async () => {
    if (!item || !activeWorkspaceId) return;
    setError(null);
    try {
      if (type === "folder") {
        await deleteFolderMutation.mutateAsync(item.id);
      } else {
        await deleteFileMutation.mutateAsync(item.id);
      }
      onClose();
    } catch (err) {
      setError(normalizeError(err).message);
    }
  };

  if (!item) return null;

  return (
    <Transition show={isOpen} appear>
      <Dialog as="div" className="relative z-50" onClose={() => !isPending && onClose()}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm w-full bg-background rounded-2xl shadow-xl overflow-hidden border border-black/5 dark:border-white/5">
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 dark:border-white/5">
              <Dialog.Title className="text-lg font-semibold text-foreground">Delete {type}</Dialog.Title>
              {!isPending && (
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                  <Cancel01Icon className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="p-6">
              <p className="text-sm text-foreground">
                Are you sure you want to delete <span className="font-semibold">{item.name}</span>?
                {type === "folder" ? " This will also delete all contained files." : " This will move the file to the trash bin."}
              </p>
              
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={onClose}
                  disabled={isPending}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isPending}
                  className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
