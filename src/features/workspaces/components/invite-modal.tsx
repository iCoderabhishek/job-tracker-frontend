"use client";

import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Cancel01Icon } from "hugeicons-react";
import { useInviteMember } from "@/features/workspaces/hooks";
import { normalizeError } from "@/lib/errors";
import { useWorkspaceStore } from "@/features/workspaces/store";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function InviteModal({ isOpen, onClose, onSuccess }: InviteModalProps) {
  const { activeWorkspaceId } = useWorkspaceStore();
  const [email, setEmail] = useState("");
  const inviteMutation = useInviteMember();
  const [error, setError] = useState<string | null>(null);

  const handleInvite = async () => {
    if (!email.trim() || !activeWorkspaceId) return;
    setError(null);
    try {
      await inviteMutation.mutateAsync({ workspaceId: activeWorkspaceId, email: email.trim() });
      onSuccess();
      setEmail("");
      onClose();
    } catch (err) {
      setError(normalizeError(err).message);
    }
  };

  const loading = inviteMutation.isPending;

  return (
    <Transition show={isOpen} appear>
      <Dialog as="div" className="relative z-50" onClose={() => !loading && onClose()}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm w-full bg-background rounded-2xl shadow-xl overflow-hidden border border-black/5 dark:border-white/5">
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 dark:border-white/5">
              <Dialog.Title className="text-lg font-semibold text-foreground">Invite Member</Dialog.Title>
              {!loading && (
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                  <Cancel01Icon className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="p-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="User's email address"
                className="w-full px-4 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleInvite();
                }}
              />
              <p className="text-[11px] text-muted-foreground mt-2">
                Note: The invite link is valid for 7 days. If they don't accept, you are vain!
              </p>
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  disabled={loading || !email.trim()}
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Invite"}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
