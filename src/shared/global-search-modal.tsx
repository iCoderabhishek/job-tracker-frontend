"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Search01Icon, Folder01Icon, File01Icon } from "hugeicons-react";
import { FileItem } from "@/types";
import { useRouter } from "next/navigation";

export function GlobalSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        // Mock search or remove if unused
        setResults([]); 
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (item: FileItem) => {
    setIsOpen(false);
    if (item.folderId) {
      router.push(`/dashboard/folders/${item.folderId}`);
    } else {
      router.push(`/dashboard`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          static
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-start justify-center p-4 pt-[10vh] text-center">
              <DialogPanel
                as={motion.div}
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-background border border-foreground/10 text-left align-middle shadow-2xl transition-all"
              >
                <div className="flex items-center border-b border-foreground/10 px-4">
                  <Search01Icon className="h-5 w-5 text-muted-foreground shrink-0" />
                  <input
                    autoFocus
                    className="w-full bg-transparent border-0 px-4 py-4 text-foreground caret-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 text-lg"
                    placeholder="Search files, folders, and more..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <div className="shrink-0 text-xs text-muted-foreground bg-foreground/5 px-2 py-1 rounded-md font-mono">
                    ESC
                  </div>
                </div>

                {loading && (
                  <div className="p-4 text-sm text-center text-muted-foreground">
                    Searching...
                  </div>
                )}

                {!loading && query && results.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    <p>No results found for &quot;{query}&quot;</p>
                  </div>
                )}

                {!loading && results.length > 0 && (
                  <div className="max-h-[60vh] overflow-y-auto p-2">
                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                      Results
                    </div>
                    {results.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        className="w-full flex items-center gap-3 px-3 py-3 hover:bg-foreground/5 rounded-xl transition-colors text-left"
                      >
                        <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-foreground/5">
                          <File01Icon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">
                            {item.name}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            File
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {!query && (
                  <div className="px-4 py-3 border-t border-foreground/10 bg-foreground/5 flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <kbd className="bg-foreground/10 px-1.5 py-0.5 rounded">↑</kbd>
                      <kbd className="bg-foreground/10 px-1.5 py-0.5 rounded">↓</kbd>
                      <span>to navigate</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="bg-foreground/10 px-1.5 py-0.5 rounded">↵</kbd>
                      <span>to select</span>
                    </div>
                  </div>
                )}
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
