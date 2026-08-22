"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight01Icon, PlayIcon } from "hugeicons-react";
import { DEMO_URL } from "@/lib/env";

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
            Your AI-Powered Job Hunt on Autopilot.
          </h1>
          <p className="mt-8 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto text-balance">
            Stop manually tracking jobs and tailoring resumes. Our AI agent scrapes the web, matches your skills, and tracks your applications—so you can focus on interviewing.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/dashboard"
              className="rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all active:scale-95 flex items-center gap-2 group"
            >
              Go to Dashboard
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
              <div className="flex-1 bg-gray-50/20 relative overflow-hidden flex flex-col p-6 gap-4 min-h-[400px]">
                <div className="w-full flex justify-between items-center pb-4 border-b border-black/5">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-32 bg-gray-200 rounded-md"></div>
                    <div className="h-5 w-8 bg-gray-100 rounded-full"></div>
                  </div>
                  <div className="h-8 w-28 bg-primary/20 rounded-md"></div>
                </div>
                {/* Header Row */}
                <div className="flex gap-4 items-center px-4 py-2 text-xs font-semibold text-muted-foreground">
                  <div className="w-10">Match</div>
                  <div className="flex-1">Role / Company</div>
                  <div className="w-32 hidden sm:block">Status</div>
                  <div className="w-24 hidden md:block">Action</div>
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-black/5 hover:border-black/10 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <span className="text-green-700 font-bold text-xs">{98 - i * 5}%</span>
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                      <div className="h-4 w-48 bg-gray-800 rounded-sm"></div>
                      <div className="h-3 w-32 bg-gray-400 rounded-sm"></div>
                    </div>
                    <div className="w-32 hidden sm:block shrink-0">
                      <div className="h-6 w-20 bg-blue-100 rounded-full"></div>
                    </div>
                    <div className="w-24 hidden md:block shrink-0">
                      <div className="h-8 w-full bg-gray-100 rounded-md"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
