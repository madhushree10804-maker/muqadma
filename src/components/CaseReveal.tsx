"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchTeamAllocation } from "@/app/actions/reveal";

export default function CaseReveal({ token }: { token: string }) {
  const [step, setStep] = useState(0); // 0: initial, 1: File opening, 2: Spinner, 3: Result
  const [allocation, setAllocation] = useState<any>(null);
  const [error, setError] = useState("");

  const [lotteryCase, setLotteryCase] = useState("00");
  const [lotteryCourt, setLotteryCourt] = useState("00");
  const [lotterySide, setLotterySide] = useState("PLAINTIFF");

  useEffect(() => {
    if (step === 2) {
      const interval = setInterval(() => {
        setLotteryCase(String(Math.floor(Math.random() * 20) + 1).padStart(2, '0'));
        setLotteryCourt(String(Math.floor(Math.random() * 10) + 1).padStart(2, '0'));
        setLotterySide(Math.random() > 0.5 ? "PLAINTIFF" : "DEFENDANT");
      }, 70);
      return () => clearInterval(interval);
    }
  }, [step]);

  useEffect(() => {
    // Start sequence
    async function runReveal() {
      // Fetch allocation in background
      const res = await fetchTeamAllocation(token);
      if (!res.success) {
        setError(res.message || "An unknown error occurred.");
        return;
      }
      setAllocation(res.allocation);

      // Phase 10: File opening animation duration
      setStep(1);
      await new Promise(r => setTimeout(r, 4000));
      
      // Phase 11: Roulette spinner duration (lottery effect)
      setStep(2);
      await new Promise(r => setTimeout(r, 4500));

      // Show result
      setStep(3);
    }
    runReveal();
  }, [token]);

  if (error) {
    return (
      <div className="text-center text-red-500 font-inter p-8 border border-red-500/50 bg-red-900/20">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] relative">
      <AnimatePresence mode="wait">
        
        {/* Phase 10: File Opening Cinematic */}
        {step === 1 && (
          <motion.div 
            key="file-opening"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 1.5 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-64 h-80 bg-gradient-to-br from-[#3b2a1a] to-[#1e140c] rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-gold-muted/30 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-leather.png')] opacity-30 mix-blend-overlay" />
              
              <motion.div 
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute z-10 flex flex-col items-center gap-4"
              >
                {/* Wax Seal */}
                <div className="w-16 h-16 bg-red-900 rounded-full shadow-inner flex items-center justify-center border-2 border-red-800">
                  <span className="text-red-300 font-cinzel text-xs">SEAL</span>
                </div>
                <p className="font-cinzel text-gold-muted tracking-widest text-xs uppercase">Highly Confidential</p>
              </motion.div>

              {/* Document sliding out */}
              <motion.div
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2.5, duration: 1.5, type: "spring" }}
                className="w-[90%] h-[95%] bg-parchment shadow-md flex items-start justify-center p-4"
              >
                 <div className="w-full h-full border border-gold-muted/20 opacity-30" />
              </motion.div>
            </div>
            <p className="mt-8 text-gold-muted tracking-widest font-cinzel animate-pulse">BREAKING SEAL...</p>
          </motion.div>
        )}

        {/* Phase 11: Roulette Spinner (Lottery Illusion) */}
        {step === 2 && (
          <motion.div 
            key="spinner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-8 text-center w-full"
          >
            <div className="space-y-4">
              <h2 className="text-gold-muted tracking-[0.3em] text-sm uppercase font-inter animate-pulse">
                System Generating Random Allocation...
              </h2>
              <div className="w-16 h-px bg-gold-muted/50 mx-auto" />
            </div>

            <div className="text-4xl md:text-6xl font-cinzel text-parchment drop-shadow-lg tabular-nums">
              CASE {lotteryCase} · COURT {lotteryCourt}
            </div>
            
            <div className="p-8 border border-gold-muted/30 bg-court-charcoal/50 max-w-md mx-auto w-full space-y-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-parchment/50 mb-2">Assigning Side</p>
                <h3 className="text-3xl font-cinzel text-ivory tracking-widest opacity-80">{lotterySide}</h3>
              </div>
            </div>
          </motion.div>
        )}

        {/* Final Allocation Result */}
        {step === 3 && allocation && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-full space-y-12 text-center"
          >
            <div className="space-y-4">
              <h2 className="text-gold-muted tracking-[0.3em] text-sm uppercase font-inter">Official Court Record</h2>
              <div className="w-16 h-px bg-gold-muted/50 mx-auto" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-cinzel text-parchment drop-shadow-lg">
                CASE {String(allocation.caseNumber).padStart(2, '0')} · COURT {String(allocation.courtNumber).padStart(2, '0')}
              </h1>
              <h2 className="text-xl md:text-2xl text-gold-accent font-playfair italic pt-4">
                {allocation.caseTitle}
              </h2>
            </div>

            <div className="p-8 border border-gold-muted/30 bg-court-charcoal/50 max-w-md mx-auto space-y-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-parchment/50 mb-2">Your Side</p>
                <h3 className="text-3xl font-cinzel text-ivory tracking-widest">{allocation.side}</h3>
              </div>
              
              <div className="w-24 h-px bg-gold-muted/20 mx-auto" />

              <div>
                <p className="text-xs uppercase tracking-widest text-parchment/50 mb-2">Allotted Time</p>
                <h3 className="text-xl font-cinzel text-gold-muted">{allocation.allottedTime}</h3>
              </div>
            </div>

            <div className="pt-8">
              <a 
                href={`/the-case/${allocation.caseNumber}?token=${token}`} 
                target="_blank"
                className={`inline-block px-8 py-4 bg-gold-muted hover:bg-gold-accent text-court-dark font-semibold tracking-widest uppercase text-sm transition-all shadow-[0_0_20px_rgba(197,169,106,0.3)]`}
              >
                View Official Case File
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
