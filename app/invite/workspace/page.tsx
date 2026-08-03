"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { acceptInvite } from "@/features/workspaces/api.workspaces";
import { normalizeError } from "@/lib/errors";
import { useWorkspaceStore } from "@/features/workspaces/store";

function InviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setActiveWorkspaceId } = useWorkspaceStore();
  
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMsg("No invite token found in the URL.");
      return;
    }

    const processInvite = async () => {
      try {
        const data = await acceptInvite(token);
        setActiveWorkspaceId(data.workspaceId);
        setStatus("success");
        setTimeout(() => {
          router.push(`/dashboard?workspaceId=${data.workspaceId}`);
        }, 1500);
      } catch (err) {
        setStatus("error");
        setErrorMsg(normalizeError(err).message);
      }
    };

    processInvite();
  }, [token, router, setActiveWorkspaceId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="max-w-md w-full bg-black/5 dark:bg-white/5 rounded-2xl p-8 border border-black/5 dark:border-white/5 text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-semibold text-foreground">Accepting Invite...</h2>
            <p className="text-sm text-muted-foreground mt-2">Please wait while we add you to the workspace.</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-foreground">Invite Accepted!</h2>
            <p className="text-sm text-muted-foreground mt-2">Redirecting you to your new workspace...</p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M15 9l-6 6" />
                <path d="M9 9l6 6" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-foreground">Invite Failed</h2>
            <p className="text-sm text-red-500 mt-2">{errorMsg}</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InviteWorkspacePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <InviteContent />
    </Suspense>
  );
}
