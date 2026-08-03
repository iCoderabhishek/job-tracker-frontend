"use client";

import { useState, useEffect } from "react";
import { useWorkspaceStore } from "@/features/workspaces/store";
import { FolderCard } from "@/features/files/components/folder-card";
import { FileCard } from "@/features/files/components/file-card";
import { Search01Icon, ArrowLeft01Icon, Download04Icon } from "hugeicons-react";
import { useFolderContents } from "@/features/folders/hooks";
import { useRouter } from "next/navigation";
import { getDownloadUrl, createExport } from "@/features/files/api.files";
import { PreviewModal } from "@/features/files/components/preview-modal";
import { FileItem, Folder } from "@/types";
import { normalizeError } from "@/lib/errors";

export default function SearchPage() {
  const router = useRouter();
  const { activeWorkspaceId } = useWorkspaceStore();
  
  const [searchInput, setSearchInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [previewFile, setPreviewFile] = useState<{ file: FileItem, url: string } | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading } = useFolderContents(activeWorkspaceId || "", null, debouncedQuery);
  const folders = data?.folders || [];
  const files = data?.files || [];

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

  if (!activeWorkspaceId) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <p className="text-muted-foreground text-sm">Please select a workspace first.</p>
      </div>
    );
  }

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
      <div className="h-16 border-b border-black/5 dark:border-white/5 flex items-center px-8 bg-background sticky top-0 z-10 gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors -ml-2">
          <ArrowLeft01Icon className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex-1 max-w-2xl relative">
          <Search01Icon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for files or folders in this workspace..."
            className="w-full pl-12 pr-4 py-3 bg-black/5 dark:bg-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-black/5 dark:border-white/5"
            autoFocus
          />
        </div>
      </div>

      <div className="p-8 flex flex-col gap-10">
        {isLoading && debouncedQuery.trim().length > 0 ? (
          <div className="text-muted-foreground animate-pulse">Searching...</div>
        ) : debouncedQuery.trim().length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
            <Search01Icon className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">Search Workspace</h3>
            <p className="text-sm text-muted-foreground">Type to find files and folders across your entire workspace.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground -mb-6">
              Found {folders.length + files.length} result(s) for "{debouncedQuery}"
            </p>

            {folders.length > 0 && (
              <section>
                <div className="flex items-center mb-4">
                  <span className="text-[10px] font-semibold bg-black/5 dark:bg-white/5 px-2 py-1 rounded-sm text-muted-foreground uppercase tracking-widest">
                    Folders
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {folders.map(folder => (
                    <FolderCard
                      key={folder.id}
                      folder={folder as Folder}
                      onClick={() => router.push(`/dashboard?folderId=${folder.id}`)}
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
                      file={file as FileItem}
                      onClick={() => handlePreview(file as FileItem)}
                      onDownload={() => handleDownload(file as FileItem)}
                      onExport={() => handleExport(file as FileItem)}
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
                <p className="text-muted-foreground">No results found for "{debouncedQuery}".</p>
              </div>
            )}
          </>
        )}
      </div>

      <PreviewModal
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        file={previewFile?.file || null}
        url={previewFile?.url || null}
      />
    </div>
  );
}
