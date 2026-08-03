"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Cancel01Icon, Link01Icon, CheckmarkCircle01Icon, LockedIcon, Globe02Icon } from "hugeicons-react";
import { Folder, FileItem } from "@/types";
import { useState, useEffect } from "react";
import { useTogglePublicStatus } from "@/features/files/hooks";
import { useWorkspaceStore } from "@/features/workspaces/store";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Folder | FileItem | null;
  type: "folder" | "file";
}

export function ShareModal({ isOpen, onClose, item, type }: ShareModalProps) {
  const { activeWorkspaceId } = useWorkspaceStore();
  const [copied, setCopied] = useState(false);
  const togglePublicMutation = useTogglePublicStatus(activeWorkspaceId || "");

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  if (!item) return null;

  const isFile = type === "file";
  const fileItem = isFile ? (item as FileItem) : null;
  const isPublic = fileItem?.isPublic || false;

  const getShareLink = () => {
    if (typeof window === "undefined") return "";
    const origin = window.location.origin;
    if (type === "folder") {
      return `${origin}/dashboard?folderId=${item.id}`;
    } else {
      if (isPublic) {
        return `${origin}/share/${item.id}`;
      } else {
        return `${origin}/dashboard?fileId=${item.id}`;
      }
    }
  };

  const shareLink = getShareLink();

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
  };

  const handleTogglePublic = async () => {
    if (!fileItem || !activeWorkspaceId) return;
    try {
      await togglePublicMutation.mutateAsync({
        fileId: fileItem.id,
        isPublic: !fileItem.isPublic,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Transition show={isOpen} appear>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md w-full bg-background rounded-2xl shadow-xl overflow-hidden border border-black/5 dark:border-white/5">
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 dark:border-white/5">
              <Dialog.Title className="text-lg font-semibold text-foreground">
                Share {type === "folder" ? "Folder" : "File"}
              </Dialog.Title>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <Cancel01Icon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-medium text-foreground">Who has access?</h3>
                {type === "folder" || !isPublic ? (
                  <div className="flex items-center gap-3 p-3 bg-black/5 dark:bg-white/5 rounded-xl">
                    <LockedIcon className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Workspace Members Only</p>
                      <p className="text-xs text-muted-foreground">Only people with access to this workspace can view this.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-xl">
                    <Globe02Icon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-primary">Anyone with the link</p>
                      <p className="text-xs text-primary/80">Anyone on the internet can view this media.</p>
                    </div>
                  </div>
                )}
              </div>

              {isFile && (
                <div className="flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground">Public Access</span>
                    <span className="text-xs text-muted-foreground">Allow anyone with the link to view this file</span>
                  </div>
                  <button
                    onClick={handleTogglePublic}
                    disabled={togglePublicMutation.isPending}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${isPublic ? 'bg-primary' : 'bg-black/20 dark:bg-white/20'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-medium text-foreground">Share Link</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareLink}
                    className="flex-1 px-3 py-2 bg-black/5 dark:bg-white/5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-muted-foreground"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <CheckmarkCircle01Icon className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Link01Icon className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
