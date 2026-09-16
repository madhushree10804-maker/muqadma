"use client";

import { useState, useEffect } from "react";
import { verifyTeam, getReleaseStatus } from "@/app/actions/verification";
import { motion, AnimatePresence } from "framer-motion";
import CaseReveal from "@/components/CaseReveal";

// List of colleges for dropdown
const COLLEGES = [
  "SCHOOL OF SOCIAL WORK, ROSHNI NILAYA",
  "INSTITUTE OF AVIATION STUDIES, SRINIVAS UNIVERSITY",
  "YENEPOYA SCHOOL OF ALLIED HEALTH SCIENCES, YENEPOYA UNIVERSITY, MANGALORE.",
  "YENEPOYA INSTITUTE OF ARTS, SCIENCE, COMMERCE AND MANAGEMENT",
  "CARMEL COLLEGE OF ARTS, SCIENCE AND COMMERCE FOR WOMEN, NUVEM GOA",
  "SDM LAW COLLEGE",
  "SDM COLLEGE OF BUSINESS MANAGEMENT",
  "ST ALOYSIUS (DEEMED TO BE UNIVERSITY)",
  "CANARA COLLEGE AUTONOMOUS MANGALORE",
  "NITTE INSTITUTE OF COMMUNICATION",
  "BESANT WOMEN'S COLLEGE"
];

export default function KnowYourCase() {
  const [college, setCollege] = useState("");
  const [phone, setPhone] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [verified, setVerified] = useState(false);
  const [verificationToken, setVerificationToken] = useState("");
  const [releaseState, setReleaseState] = useState(0); // 0: Finding Record, 1: Sealed, 2: Countdown/Release

  // Countdown state
  const [releaseTime, setReleaseTime] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<{h: number, m: number, s: number} | null>(null);
  const [isReleased, setIsReleased] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await verifyTeam(college, phone, accessCode);
    if (!res.success) {
      setError(res.message || "An error occurred.");
      setLoading(false);
    } else {
      setVerificationToken(res.token || "");
      setVerified(true);
      // Start Phase 8 sequence
      runSequence();
    }
  };

  const runSequence = async () => {
    // 1. COURT RECORD LOCATED
    setReleaseState(0);
    await new Promise(r => setTimeout(r, 2000));
    
    // 2. CASE SEALED
    setReleaseState(1);
    await new Promise(r => setTimeout(r, 2000));

    // 3. Get server time and switch to Countdown
    const status = await getReleaseStatus();
    setReleaseTime(new Date(status.releaseTime));
    
    const rt = new Date(status.releaseTime).getTime();
    const st = new Date(status.serverTime).getTime();
    
    if (st >= rt) {
      setIsReleased(true);
    } else {
      updateCountdown(rt, st);
    }
    setReleaseState(2);
    setLoading(false);
  };

  const updateCountdown = (release: number, currentServer: number) => {
    const diff = release - currentServer;
    if (diff <= 0) {
      setIsReleased(true);
      return;
    }
    
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);
    setTimeLeft({ h, m, s });
  };

  useEffect(() => {
    if (releaseState === 2 && releaseTime && !isReleased) {
      const interval = setInterval(() => {
        // We use client timer for local smooth ticking, but rely on server for authority when they click reveal.
        updateCountdown(releaseTime.getTime(), Date.now());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [releaseState, releaseTime, isReleased]);

  if (verified) {
    return (
      <main className="min-h-[calc(100vh-80px)] mt-20 bg-court-dark flex flex-col items-center justify-center p-6 text-center w-full">
        <AnimatePresence mode="wait">
          {releaseState === 0 && (
            <motion.div key="state0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-cinzel text-gold-accent uppercase tracking-widest">
                Court Record Located
              </h1>
            </motion.div>
          )}

          {releaseState === 1 && (
            <motion.div key="state1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-cinzel text-gold-accent uppercase tracking-widest">
                Case Sealed
              </h1>
            </motion.div>
          )}

          {releaseState === 2 && (
            <motion.div key="state2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-lg mx-auto border border-gold-muted/30 p-12 bg-court-charcoal/80 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gold-accent/50" />
              
              <h2 className="text-sm tracking-[0.3em] uppercase text-gold-muted font-inter">
                Official Court Record
              </h2>
              
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-parchment/50">Status</p>
                <h1 className={`text-3xl font-cinzel tracking-widest ${isReleased ? 'text-green-500/90' : 'text-red-500/90'}`}>
                  {isReleased ? 'RELEASED' : 'SEALED'}
                </h1>
              </div>

              {isReleased ? (
                <div className="space-y-8 pt-8">
                  {!isRevealing ? (
                    <>
                      <p className="text-parchment font-playfair italic text-lg">
                        The Court Record may now be opened.
                      </p>
                      <button 
                        onClick={() => setIsRevealing(true)}
                        className="w-full py-4 bg-gold-muted hover:bg-gold-accent text-court-dark font-semibold tracking-widest uppercase transition-colors"
                      >
                        REVEAL MY CASE
                      </button>
                    </>
                  ) : (
                     <CaseReveal token={verificationToken} />
                  )}
                </div>
              ) : (
                <div className="space-y-8 pt-8">
                  <p className="text-parchment font-playfair text-lg">
                    THE CASE REMAINS SEALED
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-widest text-gold-muted">Case Reveal In</p>
                    <div className="text-4xl font-cinzel text-parchment tracking-widest">
                      {String(timeLeft?.h || 0).padStart(2, '0')} : {String(timeLeft?.m || 0).padStart(2, '0')} : {String(timeLeft?.s || 0).padStart(2, '0')}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-16 px-6 max-w-md mx-auto relative z-10">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-cinzel text-gold-accent">
            Verify Your Team
          </h1>
          <div className="w-16 h-px bg-gold-muted mx-auto" />
          <p className="text-parchment/70 font-inter text-sm">
            Before the Court Record can be opened, identify your team.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6 mt-12 bg-court-charcoal/50 p-8 border border-gold-muted/20 shadow-2xl backdrop-blur-sm">
          {error && (
            <div className="p-4 bg-red-900/30 border border-red-500/30 text-red-200 text-sm font-inter text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-gold-muted font-semibold">College / Institution</label>
            <select 
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              required
              className="w-full bg-court-dark border border-gold-muted/30 text-parchment p-3 focus:outline-none focus:border-gold-accent"
            >
              <option value="" disabled>Select your institution...</option>
              {COLLEGES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-gold-muted font-semibold">Registered Phone Number</label>
            <input 
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              minLength={13}
              maxLength={13}
              pattern="^\+[0-9]{12}$"
              title="Must include country code (e.g. +91XXXXXXXXXX) and be exactly 13 characters."
              placeholder="+91XXXXXXXXXX"
              className="w-full bg-court-dark border border-gold-muted/30 text-parchment p-3 text-sm md:text-base focus:outline-none focus:border-gold-accent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-gold-muted font-semibold">Access Code</label>
            <input 
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              required
              placeholder="Enter access code"
              className="w-full bg-court-dark border border-gold-muted/30 text-parchment p-3 text-sm md:text-base focus:outline-none focus:border-gold-accent"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 mt-4 bg-gold-muted hover:bg-gold-accent text-court-dark font-bold tracking-widest uppercase text-sm transition-all shadow-[0_0_15px_rgba(197,169,106,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify & Enter The Court"}
          </button>
        </form>
      </div>
    </main>
  );
}
