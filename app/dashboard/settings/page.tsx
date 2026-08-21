"use client";

import { useState, useEffect } from "react";
import { useCurrentUser } from "@/features/auth/hooks";
import { authApi } from "@/api/auth";
import { Loading02Icon, CheckmarkCircle02Icon } from "hugeicons-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminInviteCodesPanel } from "@/features/admin/AdminInviteCodesPanel";

export default function SettingsPage() {
  const { data: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [resumes, setResumes] = useState("");
  
  // Background Auto-Sync Settings
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [syncFrequency, setSyncFrequency] = useState("daily");
  const [syncRegion, setSyncRegion] = useState("global");
  const [syncLimit, setSyncLimit] = useState(100);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setGoal(currentUser.goal || "");
      setResumes(currentUser.resumes || "");
      setSyncEnabled(currentUser.sync_enabled ?? false);
      setSyncFrequency(currentUser.sync_frequency || "daily");
      setSyncRegion(currentUser.sync_region || "global");
      setSyncLimit(currentUser.sync_limit ?? 100);
    }
  }, [currentUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      await authApi.updateUser(currentUser.id, {
        name,
        goal,
        resumes,
        sync_enabled: syncEnabled,
        sync_frequency: syncFrequency,
        sync_region: syncRegion,
        sync_limit: syncLimit
      });
      // Invalidate query to refresh user data
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      toast.error("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="flex-1 overflow-y-auto bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 border-b border-black/5 dark:border-white/5 pb-4">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your profile and background worker preferences.</p>
        </div>
        
        <form onSubmit={handleSave} className="space-y-8">
          {/* Profile Section */}
          <div className="bg-card border border-black/10 dark:border-white/10 rounded-xl p-6 shadow-sm flex flex-col gap-6">
            <h2 className="text-lg font-bold text-foreground">Profile Information</h2>
            
            {/* Email (Read Only) */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
              <input 
                type="text"
                disabled
                value={currentUser.email}
                className="w-full px-4 py-2 bg-black/5 dark:bg-white/5 text-muted-foreground rounded-lg border-none cursor-not-allowed"
              />
            </div>
            
            {/* Name */}
            <div>
              <label className="flex items-center text-sm font-semibold text-foreground mb-2 gap-2">
                Full Name
                {currentUser.is_admin && <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs">Admin</span>}
              </label>
              <input 
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2 bg-background border border-black/10 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            
            {/* Goal */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Job Search Goal</label>
              <textarea 
                value={goal}
                onChange={e => setGoal(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer, Remote, $150k+"
                rows={3}
                className="w-full px-4 py-2 bg-background border border-black/10 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* Background Auto-Sync Settings */}
          <div className="bg-card border border-black/10 dark:border-white/10 rounded-xl p-6 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">Background Auto-Sync</h2>
                <p className="text-sm text-muted-foreground mt-1">Configure your dedicated scraper worker.</p>
              </div>
              
              {/* Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={syncEnabled}
                  onChange={(e) => setSyncEnabled(e.target.checked)}
                />
                <div className="w-11 h-6 bg-black/10 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className={`transition-opacity ${syncEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'} flex flex-col gap-6 mt-2`}>
              {/* Frequency */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Sync Frequency</label>
                <select 
                  value={syncFrequency}
                  onChange={(e) => setSyncFrequency(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-black/10 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-foreground"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="twice_a_week">Twice a week</option>
                  <option value="thrice_a_week">Thrice a week</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {/* Target Region */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Target Region</label>
                <div className="flex gap-4">
                  {["global", "local", "both"].map((region) => (
                    <label key={region} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="sync_region" 
                        value={region} 
                        checked={syncRegion === region}
                        onChange={(e) => setSyncRegion(e.target.value)}
                        className="text-primary focus:ring-primary h-4 w-4"
                      />
                      <span className="text-sm font-medium capitalize">{region}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Max Jobs Limit */}
              <div>
                <label className="flex items-center justify-between text-sm font-semibold text-foreground mb-2">
                  <span>Max Jobs per Sync</span>
                  <span className="text-muted-foreground">{syncLimit} jobs</span>
                </label>
                <input 
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={syncLimit}
                  onChange={(e) => setSyncLimit(parseInt(e.target.value))}
                  className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-black/5 dark:border-white/5">
            {saveSuccess && (
              <span className="flex items-center gap-1.5 text-sm text-green-600 font-bold animate-in fade-in">
                <CheckmarkCircle02Icon className="w-5 h-5" /> Saved successfully
              </span>
            )}
            <button 
              type="submit"
              disabled={isSaving}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center gap-2 shadow-sm"
            >
              {isSaving && <Loading02Icon className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>

        {/* Admin Panel */}
        {currentUser.is_admin && <AdminInviteCodesPanel />}
      </div>
    </div>
  );
}
