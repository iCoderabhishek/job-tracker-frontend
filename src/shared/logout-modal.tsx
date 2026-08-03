"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Logout01Icon } from "hugeicons-react";
import { useState } from "react";
import { logout } from "@/features/auth/api.auth";
import { useRouter } from "next/navigation";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/");
    } catch (err) {
      console.error(err);
      setIsLoggingOut(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          static
          open={isOpen}
          onClose={isLoggingOut ? () => {} : onClose}
          className="relative z-50"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <DialogPanel
                as={motion.div}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md transform overflow-hidden rounded-2xl bg-background border border-foreground/10 p-6 text-left align-middle shadow-2xl transition-all"
              >
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-foreground flex items-center gap-2"
                >
                  <Logout01Icon className="w-5 h-5 text-red-500" />
                  Sign Out
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">
                    Are you sure you want to sign out? You will need to log back in to access your workspaces and files.
                  </p>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-xl border border-transparent px-4 py-2 text-sm font-medium text-foreground bg-foreground/5 hover:bg-foreground/10 transition-colors"
                    onClick={onClose}
                    disabled={isLoggingOut}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center items-center gap-2 rounded-xl border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? "Signing out..." : "Sign Out"}
                  </button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
