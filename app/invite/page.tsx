"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/api/auth";
import { useCurrentUser } from "@/features/auth/hooks";
import { Loading02Icon, ArrowRight01Icon, LockKeyIcon, Alert01Icon } from "hugeicons-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

export default function InvitePage() {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const queryClient = useQueryClient();

  const handleVerifyInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
        setError("You must be logged in to apply an invite code.");
        return;
    }

    setLoading(true);
    setError("");

    try {
      await authApi.updateUser(currentUser.id, { invite_code: inviteCode });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      // Successfully applied, redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Invalid invite code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Left Panel - Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col relative p-8 md:p-12 xl:p-20 z-10 bg-background">
        
        <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
          
          {/* Messy-Polish Logo */}
          <Link href="/" className="flex items-center gap-4 group w-max mb-12 relative z-20">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute w-7 h-7 bg-white rounded-[4px] rotate-[15deg] opacity-90 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-transform duration-500 group-hover:rotate-[45deg]" />
              <div className="absolute w-7 h-7 bg-zinc-600 rounded-[4px] -rotate-[10deg] mix-blend-difference border border-white/20 transition-transform duration-500 group-hover:-rotate-[30deg]" />
              <div className="absolute w-8 h-8 bg-transparent border-[2px] border-white/40 rounded-[6px] rotate-[35deg] backdrop-blur-[2px] transition-transform duration-500 group-hover:rotate-0" />
            </div>
            <span className="font-extrabold text-2xl tracking-tighter text-white">
              jtracker<span className="text-zinc-500 opacity-50 group-hover:opacity-100 transition-opacity">_</span>
            </span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest mb-6">
              <Alert01Icon className="w-3.5 h-3.5" /> 
              Access Restricted
            </div>
            
            <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-2">
              Invite Required.
            </h1>
            <p className="text-zinc-400 text-sm md:text-base mb-10">
              jTracker is currently in a closed beta. Please enter a valid invite code to unlock your account.
            </p>

            <div className="relative min-h-[180px]">
              {isUserLoading ? (
                  <div className="flex items-center gap-3 text-zinc-500 text-sm font-medium">
                      <Loading02Icon className="w-5 h-5 animate-spin" /> Verifying session...
                  </div>
              ) : (
                  <form onSubmit={handleVerifyInvite} className="flex flex-col gap-6">
                    <div>
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-3 block ml-1">Invite Code</label>
                      <div className="relative group">
                        <LockKeyIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                        <input 
                          type="text" 
                          required
                          value={inviteCode}
                          onChange={e => setInviteCode(e.target.value)}
                          placeholder="e.g. EARLY-BIRD-2026"
                          className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 hover:border-white/20 focus:border-white/30 focus:bg-white/10 rounded-2xl outline-none transition-all text-white placeholder:text-zinc-600 text-sm shadow-inner uppercase font-mono tracking-wider"
                        />
                      </div>
                    </div>
                    {error && <p className="text-sm text-red-500 font-medium ml-1">{error}</p>}
                    <button 
                      type="submit"
                      disabled={loading || !currentUser}
                      className="w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-70 mt-2 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]"
                    >
                      {loading ? <Loading02Icon className="w-5 h-5 animate-spin" /> : "Unlock Access"}
                      {!loading && <ArrowRight01Icon className="w-5 h-5" />}
                    </button>
                  </form>
              )}
            </div>
          </motion.div>
        </div>
        
      </div>

      {/* Right Panel - Branded Area */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-black flex-col p-12">
        {/* Abstract Art - Premium Perspective Grid & Data Streams (Red Tint for Restricted) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ perspective: '1000px' }}>
          <div 
            className="relative w-full max-w-[800px] h-[800px] opacity-40" 
            style={{ transform: 'rotateX(60deg) rotateZ(-45deg) translateY(10%)' }}
          >
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              maskImage: 'radial-gradient(circle at center, black 30%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 70%)'
            }} />
            
            <div className="absolute top-1/4 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent blur-[1px] opacity-70" />
            <div className="absolute top-1/2 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-rose-600 to-transparent blur-[2px] opacity-80" />
            
            <div className="absolute left-1/4 top-0 w-[2px] h-full bg-gradient-to-b from-transparent via-red-500 to-transparent blur-[1px] opacity-70" />
            <div className="absolute left-1/2 top-0 w-[4px] h-full bg-gradient-to-b from-transparent via-orange-500 to-transparent blur-[2px] opacity-80" />
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-900/30 blur-[100px] rounded-full" />
          </div>
        </div>

        <div className="relative z-10 flex justify-end">
          <div className="inline-flex items-center gap-4 bg-black/20 backdrop-blur-md border border-red-500/20 px-4 py-2 rounded-full">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-white/60 text-[10px] font-mono uppercase tracking-widest">System Locked</span>
            </div>
            <div className="h-3 w-[1px] bg-white/20"></div>
            <span className="text-white/90 text-[10px] font-mono uppercase tracking-widest">Invite Only</span>
          </div>
        </div>
        
        <div className="relative z-10 max-w-xl self-end text-right mt-auto">
          <h2 className="text-4xl xl:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-6">
            Closed Beta.<br/>
            <span 
              className="text-transparent bg-clip-text pb-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              style={{
                backgroundImage: 'linear-gradient(to bottom right, #ffffff 20%, #71717a 40%, #27272a 50%, #d4d4d8 55%, #ffffff 80%)'
              }}
            >
              Strictly Exclusive.
            </span>
          </h2>
          <p className="text-lg text-white/70 font-medium leading-relaxed max-w-md ml-auto">
            We are currently rolling out access in waves to ensure maximum performance for our dedicated autonomous agents.
          </p>
        </div>
      </div>
    </div>
  );
}
