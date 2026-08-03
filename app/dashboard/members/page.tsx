"use client";

import { useState, useEffect } from "react";
import { useWorkspaceStore } from "@/features/workspaces/store";
import { useWorkspaceMembers } from "@/features/workspaces/hooks";
import { normalizeError } from "@/lib/errors";
import { UserAdd01Icon } from "hugeicons-react";
import { InviteModal } from "@/features/workspaces/components/invite-modal";

interface Member {
  id: string;
  role: string;
  user: {
    email: string;
    name: string;
  };
}

import { useCurrentUser } from "@/features/auth/hooks";

export default function MembersPage() {
  const { activeWorkspaceId, workspaces } = useWorkspaceStore();
  const { data: currentUser } = useCurrentUser();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const { data, isLoading, error } = useWorkspaceMembers(activeWorkspaceId);
  const members = data?.members || [];

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const isOwner = currentUser?.userId && activeWorkspace?.ownerId === currentUser.userId;

  if (!activeWorkspaceId) return null;

  return (
    <div className="flex-1 overflow-y-auto bg-background flex flex-col">
      <div className="h-16 border-b border-black/5 dark:border-white/5 flex items-center justify-between px-8 bg-background sticky top-0 z-10">
        <h1 className="text-xl font-medium text-foreground tracking-tight">Members</h1>
        {isOwner && (
          <button
            onClick={() => setIsInviteOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <UserAdd01Icon className="w-4 h-4" />
            Invite Member
          </button>
        )}
      </div>

      <div className="p-8">
        {isLoading ? (
          <div className="text-muted-foreground">Loading members...</div>
        ) : error ? (
          <div className="text-red-500">{error.message}</div>
        ) : (
          <div className="bg-background border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/5 dark:bg-white/5 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-foreground">{member.user?.name || "Unknown"}</td>
                    <td className="px-6 py-4 text-muted-foreground">{member.user?.email || "No email"}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-black/5 dark:bg-white/10 rounded-md text-xs font-medium text-foreground">
                        {member.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onSuccess={() => setIsInviteOpen(false)}
      />
    </div>
  );
}
