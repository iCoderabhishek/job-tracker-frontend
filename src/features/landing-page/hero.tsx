"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight01Icon, PlayIcon } from "hugeicons-react";
import { DEMO_URL, SIGNUP_URL } from "@/lib/env";

export function Hero() {
  return (
    <div className="relative isolate pt-32 pb-20 sm:pt-40 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Minimal background element, no sloppy gradients */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-black/5 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-4xl"
        >
          <h1 className="font-serif text-5xl tracking-tight text-foreground sm:text-7xl lg:text-8xl text-balance leading-[1.1]">
            Share media with your team seamlessly.
          </h1>
          <p className="mt-8 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto text-balance">
            Like Google Drive or Dropbox, but crafted exclusively for high-velocity workspaces. Organize, share, and collaborate without the friction.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href={SIGNUP_URL}
              className="rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all active:scale-95 flex items-center gap-2 group"
            >
              Start for free
              <ArrowRight01Icon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold leading-6 text-foreground hover:text-foreground/70 transition-colors flex items-center gap-2"
            >
              <PlayIcon className="w-5 h-5" />
              Watch demo
            </Link>
          </div>
        </motion.div>

        {/* Abstract UI representation instead of a basic image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="mt-20 sm:mt-24"
        >
          <div className="relative rounded-2xl bg-black/5 p-2 ring-1 ring-inset ring-black/10 lg:rounded-3xl lg:p-4 mx-auto max-w-5xl shadow-2xl">
            <div className="rounded-xl bg-white ring-1 ring-black/5 overflow-hidden flex flex-col shadow-sm">
              <div className="h-12 border-b border-black/5 flex items-center px-4 gap-2 bg-gray-50/50 shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-gray-50/20 relative overflow-hidden">
                {/* Internal UI Mockup - Dashboard Screenshot */}
                <img
                  src="/assets/dashboard_screenshot.png"
                  alt="Dropdesk Dashboard"
                  className="w-full h-auto object-contain object-top block pointer-events-none"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
