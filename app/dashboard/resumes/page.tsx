"use client";

import { useState, useEffect } from "react";
import { useCurrentUser } from "@/features/auth/hooks";
import { authApi } from "@/api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loading02Icon, CheckmarkCircle01Icon, DocumentCodeIcon } from "hugeicons-react";

export default function ResumesPage() {
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const queryClient = useQueryClient();
  const [resumeText, setResumeText] = useState("");

  useEffect(() => {
    if (currentUser?.resumes) {
      setResumeText(currentUser.resumes);
    }
  }, [currentUser]);

  const updateResumeMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!currentUser?.id) throw new Error("Not logged in");
      return authApi.updateUser(currentUser.id, { resumes: text });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["current-user"], data);
    }
  });

  const handleSave = () => {
    updateResumeMutation.mutate(resumeText);
  };

  if (userLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <Loading02Icon className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden relative">
      {/* Header */}
      <div className="h-14 border-b border-black/10 dark:border-white/10 flex items-center justify-between px-4 md:px-8 bg-background sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-2">
          <DocumentCodeIcon className="w-5 h-5 text-foreground" />
          <h1 className="text-lg font-semibold text-foreground tracking-tight">Master Resume</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={updateResumeMutation.isPending || resumeText === currentUser?.resumes}
          className="flex items-center gap-2 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
        >
          {updateResumeMutation.isPending ? (
            <Loading02Icon className="w-4 h-4 animate-spin" />
          ) : updateResumeMutation.isSuccess ? (
            <>
              <CheckmarkCircle01Icon className="w-4 h-4" />
              Saved
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col p-4 md:p-8 overflow-hidden bg-muted/30">
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full bg-card border border-black/10 dark:border-white/10 shadow-sm rounded-xl overflow-hidden">
          <div className="p-4 border-b border-black/5 dark:border-white/5 bg-muted/50">
            <h2 className="text-sm font-semibold text-foreground">Raw Resume Text</h2>
            <p className="text-xs text-muted-foreground mt-1">Paste your entire master resume text here. The AI will use this as a base for optimization.</p>
          </div>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="flex-1 w-full p-6 text-[13px] text-foreground bg-transparent font-mono leading-relaxed resize-none outline-none custom-scrollbar"
            placeholder="Paste your master resume here..."
          />
        </div>
      </div>
    </div>
  );
}
