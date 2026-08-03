import { FileItem } from "@/types";
import { DocumentValidationIcon, Image01Icon, Video01Icon, MoreVerticalIcon, File01Icon, RefreshIcon, Delete01Icon } from "hugeicons-react";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { cn, formatBytes } from "@/lib/utils";

interface TrashFileCardProps {
  file: FileItem;
  onRestore: () => void;
  onPermanentDelete: () => void;
}

export function TrashFileCard({ file, onRestore, onPermanentDelete }: TrashFileCardProps) {
  const getIcon = () => {
    if (file.mimetype.startsWith("image/")) {
      return <Image01Icon className="w-16 h-16 text-blue-500 mb-4 fill-blue-500/20" />;
    }
    if (file.mimetype.startsWith("video/")) {
      return <Video01Icon className="w-16 h-16 text-purple-500 mb-4 fill-purple-500/20" />;
    }
    if (file.mimetype === "application/pdf") {
      return <DocumentValidationIcon className="w-16 h-16 text-red-500 mb-4 fill-red-500/20" />;
    }
    return <File01Icon className="w-16 h-16 text-gray-500 mb-4 fill-gray-500/20" />;
  };

  return (
    <div className="group relative flex flex-col items-center justify-center p-6 bg-background border border-black/5 dark:border-white/5 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all opacity-75 hover:opacity-100">
      <div className="absolute top-2 right-2">
        <Menu as="div" className="relative">
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
            <MenuItems className="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-xl bg-background shadow-lg ring-1 ring-black/5 focus:outline-none p-1">
              <MenuItem>
                  <button
                    onClick={onRestore}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10 data-[focus]:bg-black/5 dark:data-[focus]:bg-white/10 cursor-pointer"
                  >
                    <RefreshIcon className="w-4 h-4" />
                    Restore File
                  </button>
              </MenuItem>
              <MenuItem>
                  <button
                    onClick={onPermanentDelete}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 data-[focus]:bg-red-50 dark:data-[focus]:bg-red-950/30 cursor-pointer"
                  >
                    <Delete01Icon className="w-4 h-4" />
                    Delete Permanently
                  </button>
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      {getIcon()}
      <span className="text-sm font-medium text-foreground truncate w-full text-center line-through">
        {file.name}
      </span>
      <span className="text-xs text-muted-foreground mt-1">
        {formatBytes(file.size)}
      </span>
    </div>
  );
}
