"use client";

import { useState, useEffect } from "react";
import { getPublicSchedule } from "@/app/actions/schedule";

export default function Schedule() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{locked: boolean, courts: any[]}>({ locked: false, courts: [] });

  useEffect(() => {
    getPublicSchedule().then(res => {
      setData(res);
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
    <main className="min-h-screen pt-32 pb-16 px-6 max-w-5xl mx-auto">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h1 className="text-4xl md:text-5xl font-cinzel text-gold-accent text-center">
          Court Schedule
        </h1>
        <div className="w-16 h-px bg-gold-muted mx-auto" />

        {!data.locked ? (
          <div className="mt-12 text-center text-parchment/80 font-inter py-16">
            <p className="text-lg italic font-playfair mb-8">
              The official schedule will be presented here once the Court Registry locks the assignments.
            </p>
            <div className="border border-gold-muted/30 p-8 rounded-sm bg-court-charcoal/50 max-w-md mx-auto">
              <p className="tracking-widest uppercase text-sm text-gold-muted mb-2">Status</p>
              <p className="font-cinzel text-xl text-ivory animate-pulse">PENDING ALLOCATION</p>
            </div>
          </div>
        ) : (
          <div className="mt-12 md:mt-16 space-y-8 md:space-y-12">
            {data.courts.map((court, index) => (
              <div key={index} className="bg-court-charcoal/60 border border-gold-muted/30 p-5 md:p-8 relative overflow-hidden">
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 bg-gold-accent/10 border-l border-b border-gold-muted/30" />
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 border-b border-gold-muted/20 pb-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-cinzel text-gold-accent flex items-center gap-3">
                      Court Room {court.courtNumber}
                    </h2>
                    <p className="text-parchment/60 font-inter mt-1 text-sm md:text-base">Time: {court.time}</p>
                  </div>
                  <div className="mt-4 md:mt-0 text-left md:text-right pr-12 md:pr-0">
                    <p className="text-[10px] md:text-xs uppercase tracking-widest text-gold-muted">Case No. {court.caseData?.case_number}</p>
                    <p className="font-playfair text-ivory italic max-w-[200px] md:max-w-xs text-sm md:text-base">{court.caseData?.title}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 relative">
                  {/* VS Badge */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-court-dark border border-gold-muted flex items-center justify-center font-cinzel text-gold-accent z-10 text-xs md:text-base">
                    VS
                  </div>

                  {/* Plaintiff */}
                  <div className="bg-court-dark/50 p-4 md:p-6 border-l-2 border-blue-900/50 pb-8 md:pb-6">
                    <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Plaintiff Counsel</p>
                    {court.plaintiff ? (
                      <>
                        <h3 className="text-lg md:text-xl font-cinzel text-ivory">{court.plaintiff.college_name}</h3>
                        <p className="font-mono text-xs md:text-sm text-parchment/50 mt-1">CODE: {court.plaintiff.team_code}</p>
                      </>
                    ) : (
                      <p className="text-parchment/40 italic text-sm">TBD</p>
                    )}
                  </div>

                  {/* Defendant */}
                  <div className="bg-court-dark/50 p-4 md:p-6 border-l-2 md:border-l-0 md:border-r-2 border-red-900/50 md:text-right pt-8 md:pt-6">
                    <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-red-400 mb-2">Defense Counsel</p>
                    {court.defendant ? (
                      <>
                        <h3 className="text-lg md:text-xl font-cinzel text-ivory">{court.defendant.college_name}</h3>
                        <p className="font-mono text-xs md:text-sm text-parchment/50 mt-1">CODE: {court.defendant.team_code}</p>
                      </>
                    ) : (
                      <p className="text-parchment/40 italic text-sm">TBD</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {data.courts.length === 0 && (
              <p className="text-center text-parchment/50 italic">No allocations found.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
