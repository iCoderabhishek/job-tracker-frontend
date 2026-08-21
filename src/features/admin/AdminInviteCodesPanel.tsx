"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin";
import { toast } from "sonner";
import { Loading02Icon, PlusSignIcon, Delete02Icon, Cancel01Icon } from "hugeicons-react";

export function AdminInviteCodesPanel() {
  const queryClient = useQueryClient();
  const [newCode, setNewCode] = useState("");
  const [newTier, setNewTier] = useState("plus");
  const [newMaxUses, setNewMaxUses] = useState<number | "">(10);

  const { data: inviteCodes, isLoading } = useQuery({
    queryKey: ["admin-invite-codes"],
    queryFn: adminApi.getInviteCodes,
  });

  const createMutation = useMutation({
    mutationFn: adminApi.createInviteCode,
    onSuccess: () => {
      toast.success("Invite code created successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin-invite-codes"] });
      setNewCode("");
      setNewMaxUses(10);
      setNewTier("plus");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.detail || "Failed to create invite code.");
    }
  });

  const revokeMutation = useMutation({
    mutationFn: adminApi.revokeInviteCode,
    onSuccess: () => {
      toast.success("Invite code revoked.");
      queryClient.invalidateQueries({ queryKey: ["admin-invite-codes"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.detail || "Failed to revoke invite code.");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteInviteCode,
    onSuccess: () => {
      toast.success("Invite code permanently deleted.");
      queryClient.invalidateQueries({ queryKey: ["admin-invite-codes"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.detail || "Failed to delete invite code.");
    }
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) {
      toast.error("Please enter an invite code.");
      return;
    }
    createMutation.mutate({ code: newCode.trim(), tier: newTier, max_uses: newMaxUses === "" ? undefined : newMaxUses });
  };

  return (
    <div className="bg-card border border-black/10 dark:border-white/10 rounded-xl p-6 shadow-sm flex flex-col gap-6 mt-8">
      <div>
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          Admin Panel <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs">Ultimate Access</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Manage invite codes and subscriptions for all users.</p>
      </div>

      {/* Create New Code */}
      <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-4 items-end bg-black/5 dark:bg-white/5 p-4 rounded-lg border border-black/10 dark:border-white/10">
        <div className="flex-1 w-full">
          <label className="block text-xs font-semibold text-foreground mb-1">Invite Code String</label>
          <input 
            type="text"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            placeholder="e.g. EARLYBIRD2026"
            className="w-full px-3 py-2 bg-background border border-black/10 dark:border-white/10 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>
        <div className="w-full md:w-32">
          <label className="block text-xs font-semibold text-foreground mb-1">Tier</label>
          <select 
            value={newTier}
            onChange={(e) => setNewTier(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-black/10 dark:border-white/10 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          >
            <option value="plus">Plus</option>
            <option value="premium">Premium</option>
            <option value="ultimate">Ultimate</option>
          </select>
        </div>
        <div className="w-full md:w-24">
          <label className="block text-xs font-semibold text-foreground mb-1">Max Uses</label>
          <input 
            type="number"
            min="1"
            value={newMaxUses}
            onChange={(e) => setNewMaxUses(e.target.value === "" ? "" : parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-background border border-black/10 dark:border-white/10 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>
        <button 
          type="submit"
          disabled={createMutation.isPending}
          className="w-full md:w-auto px-4 py-2 bg-foreground text-background font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 h-[38px]"
        >
          {createMutation.isPending ? <Loading02Icon className="w-4 h-4 animate-spin" /> : <PlusSignIcon className="w-4 h-4" />}
          Create Code
        </button>
      </form>

      {/* Codes Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b border-black/10 dark:border-white/10">
              <th className="pb-3 font-semibold text-muted-foreground">Code</th>
              <th className="pb-3 font-semibold text-muted-foreground">Tier</th>
              <th className="pb-3 font-semibold text-muted-foreground">Uses</th>
              <th className="pb-3 font-semibold text-muted-foreground">Status</th>
              <th className="pb-3 font-semibold text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                  <Loading02Icon className="w-5 h-5 animate-spin mx-auto" />
                </td>
              </tr>
            ) : inviteCodes?.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">No invite codes found.</td>
              </tr>
            ) : (
              inviteCodes?.map((ic) => (
                <tr key={ic.id} className="group">
                  <td className="py-3 font-mono font-medium">{ic.code}</td>
                  <td className="py-3 capitalize">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      ic.tier === 'ultimate' ? 'bg-purple-500/10 text-purple-600' :
                      ic.tier === 'premium' ? 'bg-amber-500/10 text-amber-600' :
                      'bg-blue-500/10 text-blue-600'
                    }`}>
                      {ic.tier}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {ic.used_count} / {ic.max_uses || "∞"}
                  </td>
                  <td className="py-3">
                    {ic.is_active ? (
                      <span className="text-green-600 font-medium text-xs bg-green-500/10 px-2 py-0.5 rounded">Active</span>
                    ) : (
                      <span className="text-red-500 font-medium text-xs bg-red-500/10 px-2 py-0.5 rounded">Revoked</span>
                    )}
                  </td>
                  <td className="py-3 text-right flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    {ic.is_active && (
                      <button 
                        onClick={() => revokeMutation.mutate(ic.code)}
                        disabled={revokeMutation.isPending}
                        className="p-1.5 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-amber-500 rounded-md transition-colors"
                        title="Revoke Code"
                      >
                        <Cancel01Icon className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteMutation.mutate(ic.code)}
                      disabled={deleteMutation.isPending}
                      className="p-1.5 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-red-500 rounded-md transition-colors"
                      title="Permanently Delete"
                    >
                      <Delete02Icon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
