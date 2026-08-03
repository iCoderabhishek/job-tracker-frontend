"use client";

import { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Cancel01Icon, Folder01Icon, ArrowRight01Icon, Home01Icon } from "hugeicons-react";
import { Folder, FileItem } from "@/types";
import { useWorkspaceStore } from "@/features/workspaces/store";
import { useFolderContents } from "@/features/folders/hooks";

interface MoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Folder | FileItem | null;
  onMove: (destinationFolderId: string | null) => Promise<void>;
}

export function MoveModal({ isOpen, onClose, item, onMove }: MoveModalProps) {
  const { activeWorkspaceId } = useWorkspaceStore();
  const [loading, setLoading] = useState(false);
  
  // Navigation state within the modal
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderHistory, setFolderHistory] = useState<{ id: string; name: string }[]>([]);

  // Load folders for current view using React Query
  const { data, isLoading: fetching } = useFolderContents(activeWorkspaceId || "", currentFolderId, "");
  const folders = (data?.folders || []).filter(f => f.id !== item?.id);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentFolderId(null);
      setFolderHistory([]);
    }
  }, [isOpen]);

  const handleNavigate = (folder: Folder) => {
    setFolderHistory([...folderHistory, { id: folder.id, name: folder.name }]);
    setCurrentFolderId(folder.id);
  };

  const handleBack = () => {
    const newHistory = [...folderHistory];
    newHistory.pop();
    setFolderHistory(newHistory);
    setCurrentFolderId(newHistory.length > 0 ? newHistory[newHistory.length - 1].id : null);
  };

  const handleGoHome = () => {
    setFolderHistory([]);
    setCurrentFolderId(null);
  };

  const handleMove = async () => {
    setLoading(true);
    try {
      await onMove(currentFolderId);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;

  return (
    <Transition show={isOpen} appear>
      <Dialog as="div" className="relative z-50" onClose={() => !loading && onClose()}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md w-full bg-background rounded-2xl shadow-xl overflow-hidden border border-black/5 dark:border-white/5 flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 dark:border-white/5 shrink-0">
              <Dialog.Title className="text-lg font-semibold text-foreground truncate pr-4">
                Move "{item.name}"
              </Dialog.Title>
              {!loading && (
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                  <Cancel01Icon className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="p-4 border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 shrink-0 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button 
                onClick={handleGoHome}
                className={`p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${currentFolderId === null ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
              >
                <Home01Icon className="w-4 h-4" />
              </button>
              
              {folderHistory.map((hist, index) => (
                <div key={hist.id} className="flex items-center gap-2 shrink-0">
                  <ArrowRight01Icon className="w-3 h-3 text-muted-foreground" />
                  <button
                    onClick={() => {
                      const newHistory = folderHistory.slice(0, index + 1);
                      setFolderHistory(newHistory);
                      setCurrentFolderId(newHistory[newHistory.length - 1].id);
                    }}
                    className={`text-sm px-2 py-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${index === folderHistory.length - 1 ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                  >
                    {hist.name}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-2 min-h-[250px]">
              {fetching ? (
                <div className="flex items-center justify-center h-full text-muted-foreground animate-pulse">
                  Loading folders...
                </div>
              ) : folders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
                  <Folder01Icon className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">No folders here</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {currentFolderId && (
                    <button 
                      onClick={handleBack}
                      className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-muted-foreground shrink-0">
                        <ArrowRight01Icon className="w-4 h-4 rotate-180" />
                      </div>
                      <span className="text-sm font-medium text-foreground">...</span>
                    </button>
                  )}
                  {folders.map((folder) => (
                    <button 
                      key={folder.id}
                      onClick={() => handleNavigate(folder)}
                      className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left group"
                    >
                      <Folder01Icon className="w-8 h-8 text-amber-400 fill-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-foreground truncate">{folder.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-black/5 dark:border-white/5 flex justify-end gap-3 shrink-0">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleMove}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Moving..." : "Move Here"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
