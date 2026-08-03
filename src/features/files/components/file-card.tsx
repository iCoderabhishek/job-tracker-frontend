"use client";

import { FileItem } from "@/types";
import { useState, useEffect } from "react";
import { getDownloadUrl } from "@/features/files/api.files";
import { 
  DocumentValidationIcon, 
  Image01Icon, 
  Video01Icon, 
  MoreVerticalIcon, 
  File01Icon,
  Download01Icon,
  Delete01Icon,
  Globe02Icon,
  Link01Icon,
  ArrowRight01Icon,
  LockPasswordIcon,
  Download04Icon
} from "hugeicons-react";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { cn, formatBytes } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/client";

interface FileCardProps {
  file: FileItem;
  onClick: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
  onTogglePublic?: () => void;
  onMove?: () => void;
  onShare?: () => void;
  onExport?: () => void;
  isSelected?: boolean;
  onToggleSelect?: (selected: boolean) => void;
  selectionMode?: boolean;
}

export function FileCard({ 
  file, 
  onClick, 
  onDelete, 
  onDownload, 
  onTogglePublic, 
  onMove, 
  onShare, 
  onExport,
  isSelected = false,
  onToggleSelect,
  selectionMode = false
}: FileCardProps) {
  const getIcon = () => {
    if (file.mimetype.startsWith("image/")) {
      return <Image01Icon className="w-12 h-12 text-blue-500 fill-blue-500/20" />;
    }
    if (file.mimetype.startsWith("video/")) {
      return <Video01Icon className="w-12 h-12 text-purple-500 fill-purple-500/20" />;
    }
    if (file.mimetype === "application/pdf") {
      return <DocumentValidationIcon className="w-12 h-12 text-red-500 fill-red-500/20" />;
    }
    return <File01Icon className="w-12 h-12 text-gray-500 fill-gray-500/20" />;
  };

  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (file.thumbnailS3Key) {
      getDownloadUrl(file.workspaceId, file.id, "thumbnail")
        .then(({ url }) => {
          if (mounted) setThumbnailUrl(url);
        })
        .catch(console.error);
    }
    return () => {
      mounted = false;
    };
  }, [file.id, file.workspaceId, file.thumbnailS3Key]);

  return (
    <div
      onClick={(e) => {
        if (selectionMode && onToggleSelect) {
          e.preventDefault();
          e.stopPropagation();
          onToggleSelect(!isSelected);
        } else {
          onClick();
        }
      }}
      className={cn(
        "group relative flex flex-col p-3 md:p-4 bg-background border rounded-2xl cursor-pointer transition-all aspect-square md:h-[200px] md:aspect-auto",
        isSelected 
          ? "border-primary shadow-sm bg-primary/5" 
          : "border-black/5 dark:border-white/5 hover:shadow-lg hover:-translate-y-1"
      )}
    >
      {(selectionMode || onToggleSelect) && (
        <div 
          className={cn(
            "absolute top-3 left-3 z-20 transition-opacity",
            isSelected || selectionMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleSelect) onToggleSelect(!isSelected);
          }}
        >
          <div className={cn(
            "w-5 h-5 rounded-md border flex items-center justify-center transition-colors",
            isSelected 
              ? "bg-primary border-primary text-primary-foreground" 
              : "border-black/20 dark:border-white/20 bg-background/50 hover:border-primary"
          )}>
            {isSelected && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
          </div>
        </div>
      )}
      
      <div 
        className="absolute top-2 right-2 z-10"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <Menu as="div" className="relative">
          <MenuButton className="p-1.5 md:p-1.5 rounded-full text-foreground bg-background/80 hover:bg-background shadow-sm border border-black/10 dark:border-white/10 backdrop-blur-md opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all cursor-pointer">
            <MoreVerticalIcon className="w-5 h-5" />
          </MenuButton>
          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems className="absolute right-0 z-10 mt-1 w-44 origin-top-right rounded-xl bg-background shadow-lg ring-1 ring-black/5 focus:outline-none p-1">
              {onDownload && (
                <MenuItem>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDownload(); }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10 data-[focus]:bg-black/5 dark:data-[focus]:bg-white/10 cursor-pointer"
                  >
                    <Download01Icon className="w-4 h-4" /> Download
                  </button>
                </MenuItem>
              )}
              {onTogglePublic && (
                <MenuItem>
                  <button
                    onClick={(e) => { e.stopPropagation(); onTogglePublic(); }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10 data-[focus]:bg-black/5 dark:data-[focus]:bg-white/10 cursor-pointer"
                  >
                    {file.isPublic ? <LockPasswordIcon className="w-4 h-4" /> : <Globe02Icon className="w-4 h-4" />}
                    {file.isPublic ? "Make Private" : "Make Public"}
                  </button>
                </MenuItem>
              )}
              {onMove && (
                <MenuItem>
                  <button
                    onClick={(e) => { e.stopPropagation(); onMove(); }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10 data-[focus]:bg-black/5 dark:data-[focus]:bg-white/10 cursor-pointer"
                  >
                    <ArrowRight01Icon className="w-4 h-4" /> Move
                  </button>
                </MenuItem>
              )}
              {onShare && (
                <MenuItem>
                  <button
                    onClick={(e) => { e.stopPropagation(); onShare(); }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10 data-[focus]:bg-black/5 dark:data-[focus]:bg-white/10 cursor-pointer"
                  >
                    <Link01Icon className="w-4 h-4" /> Share
                  </button>
                </MenuItem>
              )}
              {onExport && (
                <MenuItem>
                  <button
                    onClick={(e) => { e.stopPropagation(); onExport(); }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10 data-[focus]:bg-black/5 dark:data-[focus]:bg-white/10 cursor-pointer"
                  >
                    <Download04Icon className="w-4 h-4" /> Export
                  </button>
                </MenuItem>
              )}
              {onDelete && (
                <MenuItem>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30 data-[focus]:bg-red-50 dark:data-[focus]:bg-red-950/30 cursor-pointer"
                  >
                    <Delete01Icon className="w-4 h-4" /> Delete
                  </button>
                </MenuItem>
              )}
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      <div className="flex-1 w-full bg-black/5 dark:bg-white/5 rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
        {file.thumbnailS3Key ? (
          <>
            {!thumbnailUrl && (
              <div className="absolute inset-0 flex items-center justify-center animate-pulse bg-black/5 dark:bg-white/5" />
            )}
            {thumbnailUrl && (
              <img 
                src={thumbnailUrl} 
                alt={file.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  if ((e.target as HTMLElement).nextElementSibling) {
                    ((e.target as HTMLElement).nextElementSibling as HTMLElement).style.display = 'flex';
                  }
                }}
              />
            )}
          </>
        ) : (
          getIcon()
        )}
        {file.thumbnailS3Key && <div className="hidden items-center justify-center w-full h-full">{getIcon()}</div>}
      </div>
      
      <div className="flex flex-col mt-auto w-full">
        <div className="flex items-center justify-between gap-2 mb-1 w-full">
          <span className="text-sm font-medium text-foreground truncate">{file.name}</span>
          {file.isPublic && (
            <span className="text-[10px] font-medium bg-primary/20 text-primary px-1.5 py-0.5 rounded shrink-0">
              Public
            </span>
          )}
        </div>
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-muted-foreground">
            {formatBytes(Number(file.size))}
          </span>
          {file.uploader?.avatarUrl && (
            <img 
              src={file.uploader.avatarUrl} 
              alt={file.uploader.name || "Uploader"} 
              className="w-5 h-5 rounded-full object-cover border border-black/10 dark:border-white/10"
              title={`Uploaded by ${file.uploader.name || file.uploader.email}`}
              referrerPolicy="no-referrer"
            />
          )}
        </div>
      </div>
    </div>
  );
}
