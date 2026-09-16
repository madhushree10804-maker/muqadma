"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  targetDate: string; // ISO string like '2026-09-16T22:30:00+05:30'
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMounted, setIsMounted] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const target = new Date(targetDate).getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24) + Math.floor(difference / (1000 * 60 * 60 * 24)) * 24, // Total hours including days
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isMounted) return null;

  if (isExpired) {
    return (
      <div className="text-gold-accent font-cinzel tracking-widest text-lg animate-pulse border border-gold-accent/50 p-4 bg-court-dark/80 rounded-sm">
        THE EVENT HAS COMMENCED
      </div>
    );
  }

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="text-3xl md:text-5xl font-playfair text-ivory drop-shadow-lg">
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-gold-muted mt-1">
        {label}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1 }}
      className="flex items-center gap-4 md:gap-8 bg-black/40 backdrop-blur-md border border-gold-muted/30 p-4 md:p-6 rounded-sm shadow-[0_0_15px_rgba(0,0,0,0.5)]"
    >
      <TimeBlock value={timeLeft.hours} label="Hours" />
      <div className="text-2xl md:text-4xl text-gold-accent/50 font-playfair -mt-4">:</div>
      <TimeBlock value={timeLeft.minutes} label="Mins" />
      <div className="text-2xl md:text-4xl text-gold-accent/50 font-playfair -mt-4">:</div>
      <TimeBlock value={timeLeft.seconds} label="Secs" />
    </motion.div>
  );
}
