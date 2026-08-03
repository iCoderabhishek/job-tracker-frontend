"use client";

import { useState, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Cancel01Icon, CloudUploadIcon, CheckmarkCircle01Icon, Alert01Icon } from "hugeicons-react";
import { normalizeError } from "@/lib/errors";
import { useUploadFile } from "@/features/files/hooks";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  folderId?: string | null;
}

type UploadItem = {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
};

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "video/mp4",
];
const MAX_FILE_BYTES = 100 * 1024 * 1024; // 100MB

export function UploadModal({ isOpen, onClose, workspaceId, folderId }: UploadModalProps) {
  const uploadMutation = useUploadFile(workspaceId);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isUploadingGlobal, setIsUploadingGlobal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const addFiles = (filesList: FileList | File[]) => {
    const newFiles = Array.from(filesList).map((file) => {
      let error: string | undefined;
      
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        error = "File type not supported";
      } else if (file.size > MAX_FILE_BYTES) {
        error = "File exceeds 100MB limit";
      }

      return {
        id: Math.random().toString(36).substring(7),
        file,
        progress: 0,
        status: error ? "error" : "pending",
        error,
      } as UploadItem;
    });

    setItems((prev) => [...prev, ...newFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const startUpload = async () => {
    const pendingItems = items.filter((item) => item.status === "pending");
    if (pendingItems.length === 0) return;

    setIsUploadingGlobal(true);

    for (const item of pendingItems) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "uploading" } : i)));

      try {
        await uploadMutation.mutateAsync({
          file: item.file,
          folderId: folderId || null,
          onProgress: (progress) => {
            setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, progress } : i)));
          }
        });

        setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "success", progress: 100 } : i)));
      } catch (err) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: "error", error: normalizeError(err).message } : i))
        );
      }
    }

    setIsUploadingGlobal(false);
  };

  const removeFinished = () => {
    setItems((prev) => prev.filter((i) => i.status !== "success"));
  };

  const handleClose = () => {
    if (isUploadingGlobal) {
      const confirmClose = window.confirm("Uploads are in progress. Are you sure you want to cancel and close?");
      if (!confirmClose) return;
    }
    setItems([]);
    onClose();
  };

  return (
    <Transition show={isOpen} appear>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-lg w-full bg-background rounded-2xl shadow-xl overflow-hidden border border-black/5 dark:border-white/5 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 dark:border-white/5 shrink-0">
              <Dialog.Title className="text-lg font-semibold text-foreground">Upload Files</Dialog.Title>
              <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <Cancel01Icon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-6 overflow-y-auto no-scrollbar">
              <div 
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl transition-colors relative overflow-hidden ${isDragging ? 'border-primary bg-primary/5' : 'border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'}`}
              >
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  multiple
                  onChange={handleFileSelect}
                  accept={ALLOWED_MIME_TYPES.join(",")}
                  title=""
                />
                <CloudUploadIcon className={`w-10 h-10 mb-3 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                <p className="text-sm text-foreground font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground text-center px-4">
                  PNG, JPG, WEBP, PDF, MP4 (Max 100MB)
                </p>
              </div>

              {items.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-foreground">Upload Queue</h4>
                    <button 
                      onClick={removeFinished}
                      disabled={!items.some(i => i.status === "success")}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    >
                      Clear Completed
                    </button>
                  </div>
                  
                  {items.map((item) => (
                    <div key={item.id} className="p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col overflow-hidden pr-4">
                          <span className="text-sm font-medium text-foreground truncate">{item.file.name}</span>
                          <span className="text-xs text-muted-foreground">{formatBytes(item.file.size)}</span>
                        </div>
                        <div className="shrink-0 flex items-center">
                          {item.status === "pending" && <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Waiting</span>}
                          {item.status === "uploading" && <span className="text-xs font-medium text-primary">{item.progress}%</span>}
                          {item.status === "success" && <CheckmarkCircle01Icon className="w-5 h-5 text-green-500" />}
                          {item.status === "error" && <Alert01Icon className="w-5 h-5 text-red-500" />}
                        </div>
                      </div>
                      
                      {(item.status === "uploading" || item.status === "pending") && (
                        <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-out" 
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      )}
                      
                      {item.status === "error" && (
                        <p className="text-xs text-red-500 font-medium">{item.error}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-black/5 dark:border-white/5 flex justify-end gap-3 shrink-0">
              <button
                onClick={handleClose}
                disabled={isUploadingGlobal}
                className="px-4 py-2 text-sm font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors disabled:opacity-50"
              >
                Close
              </button>
              <button
                onClick={startUpload}
                disabled={!items.some((i) => i.status === "pending") || isUploadingGlobal}
                className="px-6 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isUploadingGlobal ? "Uploading..." : "Start Upload"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
