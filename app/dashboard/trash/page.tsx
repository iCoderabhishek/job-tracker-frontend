"use client";

import { useState, useEffect } from "react";
import { useWorkspaceStore } from "@/features/workspaces/store";
import { FileItem } from "@/types";
import { getTrash, restoreFile, permanentlyDeleteFile } from "@/features/files/api.files";
import { TrashFileCard } from "@/features/files/components/trash-file-card";
import { normalizeError } from "@/lib/errors";
import { ConfirmModal } from "@/shared/confirm-modal";
import { Delete02Icon, RefreshIcon } from "hugeicons-react";

export default function TrashPage() {
  const { activeWorkspaceId } = useWorkspaceStore();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [isDeletingSingle, setIsDeletingSingle] = useState(false);
  
  const [isConfirmingEmptyTrash, setIsConfirmingEmptyTrash] = useState(false);
  const [isEmptyingTrash, setIsEmptyingTrash] = useState(false);
  const [isRestoringAll, setIsRestoringAll] = useState(false);

  useEffect(() => {
    if (!activeWorkspaceId) return;
    load();
  }, [activeWorkspaceId]);

  const load = async () => {
    if (!activeWorkspaceId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getTrash(activeWorkspaceId);
      setFiles(data.files || []);
    } catch (err) {
      setError(normalizeError(err).message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (fileId: string) => {
    if (!activeWorkspaceId) return;
    try {
      await restoreFile(activeWorkspaceId, fileId);
      load(); 
    } catch (err) {
      console.error(err);
    }
  };

  const confirmSingleDelete = async () => {
    if (!activeWorkspaceId || !fileToDelete) return;
    setIsDeletingSingle(true);
    try {
      await permanentlyDeleteFile(activeWorkspaceId, fileToDelete);
      load(); 
    } catch (err) {
      console.error(err);
      alert(normalizeError(err).message);
    } finally {
      setIsDeletingSingle(false);
      setFileToDelete(null);
    }
  };

  const confirmEmptyTrash = async () => {
    if (!activeWorkspaceId || files.length === 0) return;
    setIsEmptyingTrash(true);
    try {
      await Promise.all(
        files.map(file => permanentlyDeleteFile(activeWorkspaceId, file.id))
      );
      load();
    } catch (err) {
      console.error(err);
      alert(normalizeError(err).message);
    } finally {
      setIsEmptyingTrash(false);
      setIsConfirmingEmptyTrash(false);
    }
  };

  const handleRestoreAll = async () => {
    if (!activeWorkspaceId || files.length === 0) return;
    setIsRestoringAll(true);
    try {
      await Promise.all(
        files.map(file => restoreFile(activeWorkspaceId, file.id))
      );
      load();
    } catch (err) {
      console.error(err);
      alert(normalizeError(err).message);
    } finally {
      setIsRestoringAll(false);
    }
  };

  if (!activeWorkspaceId) return null;

  return (
    <div className="flex-1 overflow-y-auto bg-background flex flex-col">
      <div className="h-16 border-b border-black/5 dark:border-white/5 flex items-center justify-between px-4 md:px-8 bg-background sticky top-0 z-10">
        <h1 className="text-xl font-medium text-foreground tracking-tight">Trash Bin</h1>
        {files.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleRestoreAll}
              disabled={isRestoringAll || isEmptyingTrash}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary dark:text-primary hover:bg-primary/20 rounded-md transition-colors text-sm font-medium disabled:opacity-50"
            >
              <RefreshIcon className="w-4 h-4" />
              {isRestoringAll ? "Restoring..." : "Restore All"}
            </button>
            <button
              onClick={() => setIsConfirmingEmptyTrash(true)}
              disabled={isRestoringAll || isEmptyingTrash}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 rounded-md transition-colors text-sm font-medium disabled:opacity-50"
            >
              <Delete02Icon className="w-4 h-4" />
              Empty Trash
            </button>
          </div>
        )}
      </div>

      <div className="p-4 md:p-8">
        {loading ? (
          <div className="text-muted-foreground animate-pulse">Loading trash...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : files.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {files.map((file) => (
              <TrashFileCard
                key={file.id}
                file={file}
                onRestore={() => handleRestore(file.id)}
                onPermanentDelete={() => setFileToDelete(file.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-lg font-medium text-foreground mb-1">Trash is empty</h3>
            <p className="text-sm text-muted-foreground">Files you delete will appear here.</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!fileToDelete}
        title="Permanently Delete File?"
        description="Are you sure you want to permanently delete this file? This action cannot be undone."
        confirmText="Delete Permanently"
        onClose={() => setFileToDelete(null)}
        onConfirm={confirmSingleDelete}
        isLoading={isDeletingSingle}
      />

      <ConfirmModal
        isOpen={isConfirmingEmptyTrash}
        title="Empty Trash?"
        description={`Are you sure you want to permanently delete all ${files.length} files in the trash? This action cannot be undone.`}
        confirmText="Empty Trash"
        onClose={() => setIsConfirmingEmptyTrash(false)}
        onConfirm={confirmEmptyTrash}
        isLoading={isEmptyingTrash}
      />
    </div>
  );
}
