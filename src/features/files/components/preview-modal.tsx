"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Cancel01Icon, Download01Icon } from "hugeicons-react";
import { FileItem } from "@/types";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: FileItem | null;
  url: string | null;
}

export function PreviewModal({ isOpen, onClose, file, url }: PreviewModalProps) {
  if (!file || !url) return null;

  const isImage = file.mimetype.startsWith("image/");
  const isVideo = file.mimetype.startsWith("video/");
  const isAudio = file.mimetype.startsWith("audio/");
  const isPdf = file.mimetype === "application/pdf";

  const renderContent = () => {
    if (isImage) {
      return (
        <img
          src={url}
          alt={file.name}
          className="max-w-full max-h-[85vh] object-contain select-none"
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />
      );
    }
    
    if (isVideo) {
      return (
        <video
          src={url}
          controls
          autoPlay
          controlsList="nodownload noremoteplayback noplaybackrate"
          disablePictureInPicture
          className="w-full max-h-[85vh] outline-none"
          onContextMenu={(e) => e.preventDefault()}
        />
      );
    }

    if (isAudio) {
      return (
        <div className="w-full max-w-md p-8 bg-black/5 dark:bg-white/5 rounded-2xl flex flex-col items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          </div>
          <p className="font-medium text-foreground text-center truncate w-full">{file.name}</p>
          <audio
            src={url}
            controls
            autoPlay
            controlsList="nodownload"
            className="w-full outline-none"
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      );
    }
    
    if (isPdf) {
      // For PDF, we use iframe but add #toolbar=0 to hide download options in most browsers
      return (
        <iframe
          src={`${url}#toolbar=0&navpanes=0`}
          className="w-full h-[85vh] bg-white rounded-lg border-0"
          onContextMenu={(e) => e.preventDefault()}
        />
      );
    }

    return (
      <div className="text-center text-white flex flex-col items-center justify-center p-12 bg-black/50 rounded-2xl backdrop-blur-md">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4 opacity-50">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"></path>
          <polyline points="13 2 13 9 20 9"></polyline>
        </svg>
        <h3 className="text-xl font-medium mb-2">No Preview Available</h3>
        <p className="text-white/70 mb-6 max-w-sm">
          This file type ({file.mimetype || "unknown"}) cannot be previewed directly in the browser.
        </p>
        <button 
          onClick={() => window.location.href = url}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-medium hover:bg-primary/90 transition-colors"
        >
          <Download01Icon className="w-5 h-5" />
          Download File
        </button>
      </div>
    );
  };

  return (
    <Transition show={isOpen} appear>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity" aria-hidden="true" />
        
        <div className="fixed inset-0 flex flex-col">
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
            <div className="flex flex-col">
              <Dialog.Title className="text-white font-medium truncate max-w-lg">
                {file.name}
              </Dialog.Title>
            </div>
            
            <button 
              onClick={onClose} 
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <Cancel01Icon className="w-6 h-6" />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
            {renderContent()}
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
