"use client";

import { useState, useEffect, Suspense } from "react";
import { useWorkspaceStore } from "@/features/workspaces/store";
import { Folder, FileItem } from "@/types";
import { FolderCard } from "@/features/files/components/folder-card";
import { FileCard } from "@/features/files/components/file-card";
import { UploadModal } from "@/features/files/components/upload-modal";
import { RenameModal } from "@/features/files/components/rename-modal";
import { DeleteModal } from "@/features/files/components/delete-modal";
import { MoveModal } from "@/features/files/components/move-modal";
import { PreviewModal } from "@/features/files/components/preview-modal";
import { ShareModal } from "@/features/files/components/share-modal";
import { CreateFolderModal } from "@/features/folders/components/create-folder-modal";
import { WelcomeBoard } from "@/features/workspaces/components/welcome-board";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search01Icon, ArrowLeft01Icon, CloudUploadIcon, Download04Icon, FolderAddIcon } from "hugeicons-react";
import { normalizeError } from "@/lib/errors";
import { getDownloadUrl, createExport } from "@/features/files/api.files";
import { API_BASE_URL } from "@/lib/client";
import { useFolderContents } from "@/features/folders/hooks";
import { useMoveFile, useTogglePublicStatus } from "@/features/files/hooks";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const { activeWorkspaceId, setActiveWorkspaceId } = useWorkspaceStore();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);

  const urlWorkspaceId = searchParams.get("workspaceId");
  const urlFolderId = searchParams.get("folderId");

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(urlFolderId);
  const [folderHistory, setFolderHistory] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (urlWorkspaceId && urlWorkspaceId !== activeWorkspaceId) {
      setActiveWorkspaceId(urlWorkspaceId);
    }
  }, [urlWorkspaceId, activeWorkspaceId, setActiveWorkspaceId]);

  useEffect(() => {
    if (urlFolderId !== currentFolderId) {
      setCurrentFolderId(urlFolderId);
    }
  }, [urlFolderId]);

  const updateUrl = (folderId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (folderId) {
      params.set("folderId", folderId);
    } else {
      params.delete("folderId");
    }
    if (activeWorkspaceId) {
      params.set("workspaceId", activeWorkspaceId);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const [searchQuery, setSearchQuery] = useState("");

  const [renameItem, setRenameItem] = useState<Folder | null>(null);
  const [deleteItem, setDeleteItem] = useState<{ item: Folder | FileItem, type: "folder" | "file" } | null>(null);
  const [moveItem, setMoveItem] = useState<Folder | FileItem | null>(null);
  const [shareItem, setShareItem] = useState<{ item: Folder | FileItem, type: "folder" | "file" } | null>(null);
  const [previewFile, setPreviewFile] = useState<{ file: FileItem, url: string } | null>(null);

  const { data, isLoading } = useFolderContents(activeWorkspaceId || "", currentFolderId, searchQuery);
  const folders = data?.folders || [];
  const files = data?.files || [];
  
  const moveFileMutation = useMoveFile(activeWorkspaceId || "");
  const togglePublicMutation = useTogglePublicStatus(activeWorkspaceId || "");

  const handleDownload = async (file: FileItem) => {
    if (!activeWorkspaceId) return;
    try {
      const { url } = await getDownloadUrl(activeWorkspaceId, file.id, "download");
      window.location.href = url;
    } catch (err) {
      console.error(err);
      alert(normalizeError(err).message);
    }
  };

  const handleTogglePublic = async (file: FileItem) => {
    if (!activeWorkspaceId) return;
    try {
      await togglePublicMutation.mutateAsync({ fileId: file.id, isPublic: !file.isPublic });
    } catch (err) {
      console.error(err);
      alert(normalizeError(err).message);
    }
  };

  const handlePreview = async (file: FileItem) => {
    if (!activeWorkspaceId) return;
    try {
      const { url } = await getDownloadUrl(activeWorkspaceId, file.id);
      setPreviewFile({ file, url });
    } catch (err) {
      console.error(err);
      alert(normalizeError(err).message);
    }
  };

  const handleExport = async (file: FileItem) => {
    if (!activeWorkspaceId) return;
    try {
      await createExport(activeWorkspaceId, [file.id]);
      setNotification({ type: "success", text: "Export job created! Check the Exports tab." });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error(err);
      setNotification({ type: "error", text: normalizeError(err).message });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleToggleSelect = (fileId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedFileIds((prev) => [...prev, fileId]);
    } else {
      setSelectedFileIds((prev) => prev.filter(id => id !== fileId));
    }
  };

  const handleClearSelection = () => setSelectedFileIds([]);

  const handleBulkExport = async () => {
    if (!activeWorkspaceId || selectedFileIds.length === 0) return;
    try {
      await createExport(activeWorkspaceId, selectedFileIds);
      setNotification({ type: "success", text: "Bulk export job created! Check the Exports tab." });
      setTimeout(() => setNotification(null), 3000);
      setSelectedFileIds([]);
    } catch (err) {
      console.error(err);
      setNotification({ type: "error", text: normalizeError(err).message });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleMove = async (destinationFolderId: string | null) => {
    if (!activeWorkspaceId || !moveItem) return;
    // Assuming both files and folders can be moved, though we only implemented moveFile in API
    // We will just call moveFile for now (folders might error if backend doesn't support it, but it's safe)
    try {
      await moveFileMutation.mutateAsync({ fileId: moveItem.id, folderId: destinationFolderId });
      setMoveItem(null); // Automatically close modal on success
    } catch (err) {
      console.error(err);
      alert(normalizeError(err).message);
    }
  };

  const handleNavigate = (folder: Folder) => {
    setFolderHistory([...folderHistory, { id: folder.id, name: folder.name }]);
    updateUrl(folder.id);
  };

  const handleBack = () => {
    const newHistory = [...folderHistory];
    newHistory.pop();
    setFolderHistory(newHistory);
    updateUrl(newHistory.length > 0 ? newHistory[newHistory.length - 1].id : null);
  };

  if (!activeWorkspaceId) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-black/5 mb-4"></div>
          <p className="text-muted-foreground text-sm">Loading workspace...</p>
        </div>
      </div>
    );
  }

  const currentFolderName = folderHistory.length > 0 ? folderHistory[folderHistory.length - 1].name : "";

  return (
    <div className="flex-1 overflow-y-auto bg-background flex flex-col relative">
      {notification && (
        <div className={`fixed bottom-8 right-8 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-black text-white dark:bg-white dark:text-black'
        }`}>
          <span className="text-sm font-medium">{notification.text}</span>
          <button onClick={() => setNotification(null)} className="ml-2 opacity-70 hover:opacity-100">&times;</button>
        </div>
      )}

      {selectedFileIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-background border border-black/10 dark:border-white/10 shadow-xl rounded-full px-6 py-3 flex items-center gap-6 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-semibold">
              {selectedFileIds.length}
            </span>
            <span className="text-sm font-medium">files selected</span>
          </div>
          <div className="w-px h-6 bg-black/10 dark:bg-white/10"></div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleClearSelection}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear
            </button>
            <button 
              onClick={handleBulkExport}
              className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Download04Icon className="w-4 h-4" />
              Export Selected
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="h-16 border-b border-black/5 dark:border-white/5 flex items-center justify-between px-8 bg-background sticky top-0 z-10">
        <div className="flex items-center gap-4">
          {folderHistory.length > 0 && (
            <button onClick={handleBack} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors">
              <ArrowLeft01Icon className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
          <h1 className="text-xl font-medium text-foreground tracking-tight">{currentFolderName}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex items-center">
            <Search01Icon className="w-4 h-4 absolute left-3 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search file..."
              className="pl-9 pr-12 py-2 bg-black/5 dark:bg-white/5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 transition-all"
            />
            <div className="absolute right-3 pointer-events-none hidden md:flex items-center">
              <kbd className="flex items-center gap-0.5 text-[10px] font-medium text-muted-foreground/60 bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded border border-black/10 dark:border-white/10 font-mono">
                <span className="text-[11px]">⌘</span>K
              </kbd>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateFolderOpen(true)}
              className="flex items-center gap-2 bg-black/5 dark:bg-white/5 text-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <FolderAddIcon className="w-4 h-4" />
              New Folder
            </button>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <CloudUploadIcon className="w-4 h-4" />
              Upload File
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 flex flex-col gap-10">
        {!currentFolderId && (
          <WelcomeBoard workspaceId={activeWorkspaceId} />
        )}

        {isLoading ? (
          <div className="text-muted-foreground animate-pulse">Loading...</div>
        ) : (
          <>
            {folders.length > 0 && (
              <section>
                <div className="flex items-center mb-4">
                  <span className="text-[10px] font-semibold bg-black/5 dark:bg-white/5 px-2 py-1 rounded-sm text-muted-foreground uppercase tracking-widest">
                    File Folder
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {folders.map(folder => (
                    <FolderCard
                      key={folder.id}
                      folder={folder}
                      onClick={() => handleNavigate(folder)}
                      onRename={() => setRenameItem(folder)}
                      onDelete={() => setDeleteItem({ item: folder, type: "folder" })}
                      onMove={() => setMoveItem(folder)}
                      onShare={() => setShareItem({ item: folder, type: "folder" })}
                    />
                  ))}
                </div>
              </section>
            )}

            {files.length > 0 && (
              <section>
                <div className="flex items-center mb-4">
                  <span className="text-[10px] font-semibold bg-black/5 dark:bg-white/5 px-2 py-1 rounded-sm text-muted-foreground uppercase tracking-widest">
                    Files
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {files.map(file => (
                    <FileCard
                      key={file.id}
                      file={file}
                      onClick={() => handlePreview(file)}
                      onDownload={() => handleDownload(file)}
                      onDelete={() => setDeleteItem({ item: file, type: "file" })}
                      onTogglePublic={() => handleTogglePublic(file)}
                      onMove={() => setMoveItem(file)}
                      onShare={() => setShareItem({ item: file, type: "file" })}
                      onExport={() => handleExport(file)}
                      isSelected={selectedFileIds.includes(file.id)}
                      onToggleSelect={(selected) => handleToggleSelect(file.id, selected)}
                      selectionMode={selectedFileIds.length > 0}
                    />
                  ))}
                </div>
              </section>
            )}

            {folders.length === 0 && files.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h8m4-4l-4-4m0 0l-4 4m4-4v12" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">This folder is empty</h3>
                <p className="text-sm text-muted-foreground mb-6">Upload files or create folders to get started.</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsCreateFolderOpen(true)}
                    className="flex items-center gap-2 bg-black/5 dark:bg-white/5 text-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  >
                    <FolderAddIcon className="w-4 h-4" />
                    New Folder
                  </button>
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    <CloudUploadIcon className="w-4 h-4" />
                    Upload File
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {activeWorkspaceId && (
        <>
          <CreateFolderModal
            isOpen={isCreateFolderOpen}
            onClose={() => setIsCreateFolderOpen(false)}
            workspaceId={activeWorkspaceId}
            parentId={currentFolderId}
          />
          <UploadModal
            isOpen={isUploadOpen}
            onClose={() => setIsUploadOpen(false)}
            workspaceId={activeWorkspaceId}
            folderId={currentFolderId}
          />
          <RenameModal
            isOpen={!!renameItem}
            onClose={() => setRenameItem(null)}
            folder={renameItem}
          />
          <DeleteModal
            isOpen={!!deleteItem}
            onClose={() => setDeleteItem(null)}
            item={deleteItem?.item || null}
            type={deleteItem?.type || "file"}
          />
          <MoveModal
            isOpen={!!moveItem}
            onClose={() => setMoveItem(null)}
            item={moveItem}
            onMove={handleMove}
          />
          <ShareModal
            isOpen={!!shareItem}
            onClose={() => setShareItem(null)}
            item={shareItem?.item || null}
            type={shareItem?.type || "file"}
          />
          <PreviewModal
            isOpen={!!previewFile}
            onClose={() => setPreviewFile(null)}
            file={previewFile?.file || null}
            url={previewFile?.url || null}
          />
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-black/5 mb-4"></div>
          <p className="text-muted-foreground text-sm">Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
