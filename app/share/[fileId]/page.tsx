import { ArrowRight01Icon, Folder01Icon } from "hugeicons-react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/client";

export const dynamic = "force-dynamic";

export default async function PublicSharePage({ params }: { params: Promise<{ fileId: string }> }) {
  const { fileId } = await params;

  let contentType = "application/octet-stream";
  let isValid = false;

  const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
  let streamUrl = `${backendUrl}/api/v1/files/public/${fileId}/stream`;
  let serverFetchUrl = streamUrl;

  // Node.js 18+ fetch prefers IPv6 ::1, which can fail if backend binds to 127.0.0.1 (IPv4).
  if (serverFetchUrl.includes("localhost")) {
    serverFetchUrl = serverFetchUrl.replace("localhost", "127.0.0.1");
  }

  try {
    // Some backends don't support HEAD requests on GET routes. We use GET with a Range header to fetch minimally.
    const res = await fetch(serverFetchUrl, { method: "GET", headers: { Range: "bytes=0-0" }, cache: "no-store" });
    if (res.ok || res.status === 206) {
      isValid = true;
      contentType = res.headers.get("content-type") || "application/octet-stream";
    }
  } catch (error) {
    console.error("Failed to fetch public file metadata", error);
  }

  if (!isValid) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
          <Folder01Icon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">File not found</h1>
        <p className="text-muted-foreground mb-8 max-w-sm text-center">
          This file might have been deleted, or it is not set to public access. If you believe this is an error, please ask the owner to check the sharing settings.
        </p>
        <Link href="/" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors">
          Go to DropDesk
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0A0A0A] flex flex-col">
      {/* Top Navigation / Brand Promotion */}
      <header className="h-16 border-b border-black/5 dark:border-white/5 flex items-center justify-between px-6 bg-white dark:bg-black sticky top-0 z-10">
        <div className="flex items-center gap-2 group">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
            <rect x="2" y="6" width="28" height="20" rx="4" fill="var(--color-primary)" className="transition-colors" />
            <path d="M10 16L16 22L22 16" stroke="var(--color-primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 10V22" stroke="var(--color-primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-bold text-lg text-foreground tracking-tight group-hover:opacity-80 transition-opacity">
            dropdesk
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground hidden sm:block">Like what you see? Create your own workspace.</span>
          <Link href="/" className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
            Sign Up Free
            <ArrowRight01Icon className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Media Viewer Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 bg-black/5 dark:bg-white/5">
        <div className="w-full max-w-5xl aspect-video bg-black rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center border border-white/10 relative">

          {contentType.startsWith("image/") ? (
            <img src={`/api/proxy/files/public/${fileId}/stream`} alt="Shared Image" className="w-full h-full object-contain" />
          ) : contentType.startsWith("video/") ? (
            <video src={`/api/proxy/files/public/${fileId}/stream`} controls autoPlay className="w-full h-full object-contain" />
          ) : contentType === "application/pdf" ? (
            <iframe src={`/api/proxy/files/public/${fileId}/stream`} className="w-full h-full bg-white" title="Shared PDF" />
          ) : (
            <div className="flex flex-col items-center text-center p-8">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/60">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Unsupported Preview</h3>
              <p className="text-white/60 max-w-sm mb-6">
                This file type cannot be previewed in the browser. You can download it to view its contents.
              </p>
              <a href={`/api/proxy/files/public/${fileId}/stream?action=download`} download className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-white/90 transition-colors">
                Download File
              </a>
            </div>
          )}

        </div>

      </main>
      <div className="mt-5 flex flex-col items-center gap-2">
        <p className="text-center text-sm leading-5 text-muted-foreground">
          &copy; {new Date().getFullYear()} Dropdesk Inc. All rights reserved.
        </p>
        <p className="text-center text-xs leading-5 text-muted-foreground">
          built with ♡ྀི ₊ by <a href="https://0bhishek.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors underline underline-offset-4">Abhishek</a> ✌︎㋡
        </p>
      </div>
    </div>
  );
}
