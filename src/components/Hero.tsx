"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-court-dark">
      {/* Background Visuals - Courtroom atmosphere */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/courtroom_bg.jpg" 
          alt="Courtroom Setup" 
          fill 
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-court-dark via-court-dark/50 to-court-dark/30" />
        
        {/* Spotlight Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 3, delay: 1 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[80vh] bg-gold-accent blur-[120px] rounded-full pointer-events-none"
        />

        {/* Subtle Dust Particles (CSS simulated or very simple framer-motion approach) */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-6"
        >
          <h2 className="text-gold-muted tracking-[0.3em] uppercase text-[10px] md:text-base font-inter">
            St. Agnes College & AIKYAM 2026
          </h2>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-cinzel text-parchment drop-shadow-2xl">
            MUQADMA
          </h1>
          
          <h3 className="text-lg sm:text-xl md:text-2xl text-ivory/80 font-playfair italic">
            Moot Court Competition
          </h3>
          
          <div className="w-16 md:w-24 h-px bg-gold-accent/50 mx-auto my-6 md:my-8" />
          
          <p className="text-base md:text-xl text-gold-accent font-cinzel tracking-widest mt-6 md:mt-8">
            THE CASE IS BEFORE THE COURT.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full sm:w-auto"
        >
          <Link
            href="/know-your-case"
            className="w-full sm:w-auto text-center px-6 md:px-8 py-3 md:py-4 bg-gold-muted hover:bg-gold-accent text-court-dark font-semibold tracking-widest uppercase text-xs md:text-sm transition-all shadow-[0_0_20px_rgba(197,169,106,0.3)] hover:shadow-[0_0_30px_rgba(197,169,106,0.5)] border border-gold-accent/50 rounded-sm"
          >
            Know Your Case
          </Link>
          <Link
            href="/the-court"
            className="w-full sm:w-auto text-center px-6 md:px-8 py-3 md:py-4 bg-transparent hover:bg-court-charcoal text-parchment border border-gold-muted/50 font-semibold tracking-widest uppercase text-xs md:text-sm transition-all rounded-sm"
          >
            Enter The Court
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
