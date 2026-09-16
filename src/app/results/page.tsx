"use client";

import { useState, useEffect } from "react";
import { Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getVerdict } from "@/app/actions/verdict";

export default function Results() {
  const [loading, setLoading] = useState(true);
  const [verdict, setVerdict] = useState<any>(null);

  useEffect(() => {
    getVerdict().then((data) => {
      setVerdict(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen pt-32 px-6 flex items-center justify-center">
         <div className="w-16 h-16 border-t-2 border-r-2 border-gold-accent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-16 px-6 max-w-4xl mx-auto text-center relative z-10">
      <AnimatePresence mode="wait">
        {!verdict?.published ? (
          <motion.div 
            key="pending"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 py-32"
          >
            <h1 className="text-4xl md:text-6xl font-cinzel text-gold-muted/50 tracking-widest uppercase">
              The Court is Deliberating
            </h1>
            <p className="text-parchment/60 font-playfair italic text-xl">
              The final verdict has not been released yet.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="verdict"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="space-y-16"
          >
            <div className="space-y-4">
              <p className="text-xs tracking-[0.4em] text-red-500 uppercase font-inter animate-pulse">Official Court Ruling</p>
              <h1 className="text-5xl md:text-7xl font-cinzel text-gold-accent uppercase tracking-widest drop-shadow-[0_0_30px_rgba(197,169,106,0.3)]">
                The Final Verdict
              </h1>
              <div className="mt-12 md:mt-24 space-y-12 md:space-y-16">
          
          {/* Best Plaintiff */}
          <div className="relative p-6 md:p-12 border border-gold-muted/30 bg-court-charcoal/80 overflow-hidden group hover:border-gold-accent transition-colors">
            <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-gold-accent/5 rounded-bl-full" />
            <Trophy className="absolute top-4 md:top-8 right-4 md:right-8 text-gold-muted/20" size={64} />
            
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-blue-400 font-bold mb-4">
              Best Plaintiff Counsel
            </p>
            {verdict.plaintiff ? (
              <div className="space-y-2">
                <h2 className="text-3xl md:text-5xl font-cinzel text-gold-accent">{verdict.plaintiff.college_name}</h2>
                <p className="font-mono text-parchment/50">TEAM CODE: {verdict.plaintiff.team_code}</p>
              </div>
            ) : (
              <h2 className="text-2xl md:text-4xl font-cinzel text-parchment/40 italic">Pending</h2>
            )}
          </div>

          {/* Best Defendant */}
          <div className="relative p-6 md:p-12 border border-gold-muted/30 bg-court-charcoal/80 overflow-hidden group hover:border-gold-accent transition-colors">
            <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-gold-accent/5 rounded-bl-full" />
            <Trophy className="absolute top-4 md:top-8 right-4 md:right-8 text-gold-muted/20" size={64} />
            
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-red-400 font-bold mb-4">
              Best Defense Counsel
            </p>
            {verdict.defendant ? (
              <div className="space-y-2">
                <h2 className="text-3xl md:text-5xl font-cinzel text-gold-accent">{verdict.defendant.college_name}</h2>
                <p className="font-mono text-parchment/50">TEAM CODE: {verdict.defendant.team_code}</p>
              </div>
            ) : (
              <h2 className="text-2xl md:text-4xl font-cinzel text-parchment/40 italic">Pending</h2>
            )}
          </div>

        </div>
            </div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3, duration: 2 }}
              className="text-parchment/40 font-cinzel tracking-widest text-sm pt-12"
            >
              COURT IS ADJOURNED
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
