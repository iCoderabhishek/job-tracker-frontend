"use client";

import { motion } from "framer-motion";
import { CloudUploadIcon, LinkSquare01Icon, LockKeyIcon, UserGroupIcon } from "hugeicons-react";

const features = [
  {
    name: "Lightning Fast Uploads",
    description: "Drop your files and watch them sync instantly across your entire workspace.",
    icon: CloudUploadIcon,
  },
  {
    name: "Secure by Default",
    description: "Enterprise-grade encryption ensures your intellectual property remains yours alone.",
    icon: LockKeyIcon,
  },
  {
    name: "Seamless Collaboration",
    description: "Invite team members with role-based access. Keep everyone on the same page.",
    icon: UserGroupIcon,
  },
  {
    name: "Instant Sharing",
    description: "Generate public or private links in a click. Control expiration and passwords.",
    icon: LinkSquare01Icon,
  },
];

export function Features() {
  return (
    <div id="features" className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary/70 uppercase tracking-widest">Built for teams</h2>
          <p className="mt-2 text-4xl font-serif tracking-tight text-foreground sm:text-6xl text-balance">
            Everything you need, nothing you don't.
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            We removed the clutter and focused on what matters most: speed, security, and simplicity.
          </p>
        </div>

        {/* Custom Layout instead of basic 4-card grid */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="flex flex-col gap-24">
            
            {/* Feature Block 1 - Text Left, Image Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center">
                     <CloudUploadIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-3xl font-serif font-medium text-foreground">Effortless Synchronization</h3>
                </div>
                <p className="text-lg text-muted-foreground mb-8">
                  Your files are available everywhere, instantly. No more waiting for clunky desktop clients to catch up. Dropdesk syncs your entire workspace at the speed of thought.
                </p>
                <ul className="space-y-4 text-foreground/80 font-medium">
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Unlimited file size
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Block-level sync for speed
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Version history
                  </li>
                </ul>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative aspect-square rounded-[2rem] bg-gray-50 flex items-center justify-center overflow-hidden border border-black/5"
              >
                {/* Custom Rich SVG Illustration for Sync */}
                <img src="/assets/sync-illustration.svg" alt="Sync Illustration" width={400} height={400} />
              </motion.div>
            </div>

            {/* Feature Block 2 - Image Left, Text Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative aspect-square rounded-[2rem] bg-gray-50 flex items-center justify-center overflow-hidden border border-black/5 lg:order-1 order-2"
              >
                {/* Custom Rich SVG Illustration for Team */}
                <img src="/assets/team-illustration.svg" alt="Team Illustration" width={400} height={400} />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:order-2 order-1"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center">
                     <UserGroupIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-3xl font-serif font-medium text-foreground">Team Workspaces</h3>
                </div>
                <p className="text-lg text-muted-foreground mb-8">
                  Create isolated spaces for different departments, projects, or clients. Granular permissions mean people only see what they need to see.
                </p>
                <ul className="space-y-4 text-foreground/80 font-medium">
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Shared team folders
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Activity tracking
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Commenting & approvals
                  </li>
                </ul>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
