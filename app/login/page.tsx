"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight01Icon, Mail01Icon, Loading02Icon, SparklesIcon, Ticket01Icon } from "hugeicons-react";
import { authApi } from "@/api/auth";
import { useQueryClient } from "@tanstack/react-query";
import { setStoredUserId } from "@/features/auth/hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("An email is required to sign in.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await authApi.loginOrSignup({ 
        email, 
        name: email.split('@')[0],
        invite_code: inviteCode.trim()
      });
      setStep("otp");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    setLoading(true);
    setError(null);
    try {
      const user = await authApi.verifyOtp(email, otp);
      setStoredUserId(user.id);
      queryClient.setQueryData(["current-user"], user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Invalid OTP. Try again.");
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
            <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-2">
              Welcome back.
            </h1>
            <p className="text-zinc-400 text-sm md:text-base mb-10">
              {step === "email" ? "Enter your email to sign in or create an account." : "We sent a 6-digit code to your email."}
            </p>

            <div className="relative min-h-[220px]">
              <AnimatePresence mode="wait">
                {step === "email" ? (
                  <motion.form 
                    key="email-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSendOtp}
                    className="flex flex-col gap-6"
                  >
                    <div className="space-y-5">
                      <div>
                        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-3 block ml-1">Email Address</label>
                        <div className="relative group">
                          <Mail01Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                          <input 
                            type="email" 
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 hover:border-white/20 focus:border-white/30 focus:bg-white/10 rounded-2xl outline-none transition-all text-white placeholder:text-zinc-600 text-sm shadow-inner"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center ml-1">
                          Invite Code
                        </label>
                        <div className="relative group">
                          <Ticket01Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                          <input 
                            type="text" 
                            value={inviteCode}
                            onChange={e => setInviteCode(e.target.value)}
                            placeholder="e.g. ALPHA-2026"
                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 hover:border-white/20 focus:border-white/30 focus:bg-white/10 rounded-2xl outline-none transition-all text-white placeholder:text-zinc-600 text-sm shadow-inner"
                          />
                        </div>
                      </div>
                    </div>
                    {error && <p className="text-sm text-red-500 font-medium ml-1">{error}</p>}
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-70 mt-2 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]"
                    >
                      {loading ? <Loading02Icon className="w-5 h-5 animate-spin" /> : "Continue with Email"}
                      {!loading && <ArrowRight01Icon className="w-5 h-5" />}
                    </button>
                  </motion.form>
                ) : (
                  <motion.form 
                    key="otp-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleVerifyOtp}
                    className="flex flex-col gap-6"
                  >
                    <div>
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex justify-between items-center ml-1">
                        <span>One-Time Password</span>
                        <button type="button" onClick={() => setStep("email")} className="text-white/60 hover:text-white transition-colors hover:underline normal-case tracking-normal">Change email</button>
                      </label>
                      <div className="relative group">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <input 
                          type="text" 
                          required
                          value={otp}
                          onChange={e => setOtp(e.target.value)}
                          placeholder="123456"
                          className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 hover:border-white/20 focus:border-white/30 focus:bg-white/10 rounded-2xl outline-none transition-all tracking-[0.5em] font-mono text-center text-white placeholder:text-zinc-600 text-lg shadow-inner"
                          maxLength={6}
                        />
                      </div>
                    </div>
                    {error && <p className="text-sm text-red-500 font-medium ml-1">{error}</p>}
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-70 mt-2 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]"
                    >
                      {loading ? <Loading02Icon className="w-5 h-5 animate-spin" /> : "Verify Code"}
                      {!loading && <ArrowRight01Icon className="w-5 h-5" />}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
        
        {/* Footer info */}
        <div className="text-center md:text-left text-xs text-zinc-600 mt-8 font-medium">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
      
      {/* Right Panel - Branded Graphic Area */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-950 p-12 xl:p-20 relative flex-col justify-between overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 opacity-70 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 opacity-50 pointer-events-none" />
        
        {/* Minimal Grid Pattern for texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />

        {/* Abstract Art - Premium Perspective Grid & Data Streams */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ perspective: '1000px' }}>
          <div 
            className="relative w-full max-w-[800px] h-[800px] opacity-50" 
            style={{ transform: 'rotateX(60deg) rotateZ(45deg) translateY(-10%)' }}
          >
            {/* Radial mask so the grid fades out at the edges */}
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              maskImage: 'radial-gradient(circle at center, black 30%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 70%)'
            }} />
            
            {/* Intersecting Glowing Data Streams */}
            <div className="absolute top-1/4 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent blur-[1px] opacity-70" />
            <div className="absolute top-1/2 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-[2px] opacity-80" />
            <div className="absolute top-3/4 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent blur-[1px] opacity-60" />
            
            <div className="absolute left-1/4 top-0 w-[2px] h-full bg-gradient-to-b from-transparent via-primary to-transparent blur-[1px] opacity-70" />
            <div className="absolute left-1/2 top-0 w-[4px] h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent blur-[2px] opacity-80" />
            <div className="absolute left-3/4 top-0 w-[2px] h-full bg-gradient-to-b from-transparent via-indigo-500 to-transparent blur-[1px] opacity-60" />
            
            {/* Intersection Nodes */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-[2px] shadow-[0_0_20px_10px_rgba(59,130,246,0.5)]" />
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full blur-[1px] shadow-[0_0_10px_5px_rgba(255,255,255,0.3)]" />
            
            {/* Center glowing core */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 blur-[100px] rounded-full" />
          </div>
        </div>

        <div className="relative z-10 flex justify-end">
          <div className="inline-flex items-center gap-4 bg-black/20 backdrop-blur-md border border-white/5 px-4 py-2 rounded-full">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-white/60 text-[10px] font-mono uppercase tracking-widest">System Online</span>
            </div>
            <div className="h-3 w-[1px] bg-white/20"></div>
            <span className="text-white/90 text-[10px] font-mono uppercase tracking-widest">Autonomous AI Sourcing</span>
          </div>
        </div>
        
        <div className="relative z-10 max-w-xl self-end text-right mt-auto">
          <h2 className="text-4xl xl:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-6">
            The job search.<br/>
            <span 
              className="text-transparent bg-clip-text pb-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              style={{
                backgroundImage: 'linear-gradient(to bottom right, #ffffff 20%, #71717a 40%, #27272a 50%, #d4d4d8 55%, #ffffff 80%)'
              }}
            >
              Supercharged by AI.
            </span>
          </h2>
          <p className="text-lg text-white/70 font-medium leading-relaxed max-w-md ml-auto">
            Deploy dedicated AI agents to continuously discover and track high-quality roles tailored specifically to your career goals.
          </p>
        </div>
      </div>
    </div>
  );
}
