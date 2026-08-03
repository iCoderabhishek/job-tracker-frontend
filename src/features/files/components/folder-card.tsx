import { Folder } from "@/types";
import { Folder01Icon, MoreVerticalIcon } from "hugeicons-react";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { cn } from "@/lib/utils";

interface FolderCardProps {
  folder: Folder;
  onClick: () => void;
  onRename?: () => void;
  onDelete?: () => void;
  onMove?: () => void;
  onShare?: () => void;
}

export function FolderCard({ folder, onClick, onRename, onDelete, onMove, onShare }: FolderCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col items-center justify-center p-6 bg-background border border-black/5 dark:border-white/5 rounded-2xl cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all"
    >
      <div className="absolute top-2 right-2">
        <Menu as="div" className="relative" onClick={(e) => e.stopPropagation()}>
          <MenuButton className="p-1.5 rounded-md text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
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
            <MenuItems className="absolute right-0 z-10 mt-1 w-32 origin-top-right rounded-xl bg-background shadow-lg ring-1 ring-black/5 focus:outline-none p-1">
              {onRename && (
                <MenuItem>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRename();
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10 data-[focus]:bg-black/5 dark:data-[focus]:bg-white/10 cursor-pointer"
                  >
                    Rename
                  </button>
                </MenuItem>
              )}
              {onShare && (
                <MenuItem>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onShare();
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10 data-[focus]:bg-black/5 dark:data-[focus]:bg-white/10 cursor-pointer"
                  >
                    Share
                  </button>
                </MenuItem>
              )}
              {onMove && (
                <MenuItem>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMove();
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10 data-[focus]:bg-black/5 dark:data-[focus]:bg-white/10 cursor-pointer"
                  >
                    Move
                  </button>
                </MenuItem>
              )}
              {onDelete && (
                <MenuItem>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-sm text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30 data-[focus]:bg-red-50 dark:data-[focus]:bg-red-950/30 cursor-pointer"
                  >
                    Delete
                  </button>
                </MenuItem>
              )}
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      <Folder01Icon className="w-16 h-16 text-amber-400 mb-4 fill-amber-400" />
      <span className="text-sm font-medium text-foreground truncate w-full text-center">
        {folder.name}
      </span>
    </div>
  );
}
