"use client";

import { useEffect, useState } from "react";
import { useWorkspaceStore } from "@/features/workspaces/store";
import { getExports, getExportStatus, cancelExport } from "@/features/files/api.files";
import { ExportJob } from "@/types";
import { Download04Icon, PackageIcon, RefreshIcon, Alert01Icon, Tick01Icon } from "hugeicons-react";

export default function ExportsPage() {
  const { activeWorkspaceId } = useWorkspaceStore();
  const [exports, setExports] = useState<ExportJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExports = async () => {
    if (!activeWorkspaceId) return;
    try {
      const { exports } = await getExports(activeWorkspaceId);
      setExports(exports || []);
      setError(null);
    } catch (err: any) {
      console.error(err);
      // Ignore 404s if it just means no exports exist yet
      if (err?.response?.status === 404) {
        setExports([]);
      } else {
        setError("Failed to load exports");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExports();
    const interval = setInterval(() => {
      fetchExports();
    }, 5000);
    return () => clearInterval(interval);
  }, [activeWorkspaceId]);

  const handleDownload = async (jobId: string) => {
    if (!activeWorkspaceId) return;
    try {
      const res = await getExportStatus(activeWorkspaceId, jobId);
      if (res.status === "done" && res.downloadUrl) {
        window.location.href = res.downloadUrl;
      } else {
        setError("Export is not ready yet");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to get download URL");
    }
  };

  const handleCancel = async (jobId: string) => {
    if (!activeWorkspaceId) return;
    try {
      await cancelExport(activeWorkspaceId, jobId);
      fetchExports(); // Refresh the list
    } catch (err) {
      console.error(err);
      setError("Failed to cancel export");
    }
  };

  if (!activeWorkspaceId) {
    return <div className="p-8 text-muted-foreground">Select a workspace first</div>;
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FDFDFD] dark:bg-[#0A0A0A]">
      <div className="h-16 border-b border-black/5 dark:border-white/5 flex items-center justify-between px-4 md:px-8 bg-background sticky top-0 z-10 shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Exports</h1>
          <p className="text-sm text-muted-foreground">Manage and download your exported files.</p>
        </div>
      </div>

      {error && (
        <div className="mx-4 md:mx-8 mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-between border border-red-100 dark:border-red-900/30">
          <div className="flex items-center gap-3">
            <Alert01Icon className="w-5 h-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-600/80 hover:text-red-600 dark:text-red-400/80 dark:hover:text-red-400">
            <span className="text-xl leading-none">&times;</span>
          </button>
        </div>
      )}

      <div className="p-4 md:p-8 overflow-y-auto">
        {loading && exports.length === 0 ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshIcon className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading exports...</span>
          </div>
        ) : exports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
              <PackageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">No exports found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              You haven't exported any files yet. Export files from your dashboard to download them as a ZIP archive.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exports.map((job) => (
              <div
                key={job.id}
                className="p-5 bg-background border border-black/5 dark:border-white/5 rounded-2xl flex flex-col hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <PackageIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-foreground truncate max-w-[150px]" title={job.name || "Export Job"}>
                        {job.name || "Export Job"}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {job.fileIds.length} {job.fileIds.length === 1 ? 'file' : 'files'}
                      </p>
                    </div>
                  </div>
                  {job.status === "DONE" && (
                    <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-500/10 px-2 py-1 rounded-md">
                      <Tick01Icon className="w-3 h-3" /> Ready
                    </span>
                  )}
                  {(job.status === "PENDING" || job.status === "PROCESSING") && (
                    <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-500/10 px-2 py-1 rounded-md">
                      <RefreshIcon className="w-3 h-3 animate-spin" /> Processing
                    </span>
                  )}
                  {(job.status === "FAILED" || job.status === "CANCELLED") && (
                    <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-500/10 px-2 py-1 rounded-md">
                      <Alert01Icon className="w-3 h-3" /> Failed
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-5 mt-auto">
                  <span>{new Date(job.createdAt).toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2 w-full mt-4">
                  {job.status === "DONE" && (
                    <button
                      onClick={() => handleDownload(job.id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      <Download04Icon className="w-4 h-4" />
                      Download ZIP
                    </button>
                  )}
                  {(job.status === "PENDING" || job.status === "PROCESSING") && (
                    <button
                      onClick={() => handleCancel(job.id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      Cancel Export
                    </button>
                  )}
                  {(job.status === "FAILED" || job.status === "CANCELLED") && (
                    <button
                      disabled
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/5 text-muted-foreground rounded-xl text-sm font-medium opacity-50 cursor-not-allowed"
                    >
                      {job.status === "CANCELLED" ? "Cancelled" : "Failed"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
