import { getAdminScheduleFull } from "@/app/actions/admin-schedule";
import { Gavel, Shield } from "lucide-react";
import DownloadScheduleButton from "@/components/DownloadScheduleButton";

export const dynamic = 'force-dynamic';

export default async function ScheduleRegistry() {
  const schedule = await getAdminScheduleFull();

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-cinzel text-gold-accent text-red-500 flex items-center gap-4">
              <Gavel size={32} />
              Classified Court Pairings
            </h1>
            <p className="text-red-400/80 font-inter mt-2 text-sm max-w-2xl">
              WARNING: This is the only place where full pairings are visible. DO NOT project this screen or share this information with participants. Doing so compromises the Moot Court integrity.
            </p>
            <div className="w-16 h-px bg-red-900 mt-4" />
          </div>
          <DownloadScheduleButton schedule={schedule} />
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schedule.map((match: any) => (
          <div key={match.matchId} className="bg-court-charcoal/80 border border-gold-muted/30 relative overflow-hidden group hover:border-gold-accent transition-colors">
            
            {/* Header */}
            <div className="bg-court-navy p-4 border-b border-gold-muted/30 flex justify-between items-center">
               <span className="font-cinzel text-gold-accent tracking-widest text-lg font-bold">
                 COURT {String(match.courtNumber).padStart(2, '0')}
               </span>
               <span className="text-xs uppercase tracking-widest text-parchment/50 font-inter">
                 Case {String(match.caseNumber).padStart(2, '0')}
               </span>
            </div>

            {/* Case Title */}
            <div className="p-4 bg-black/20 border-b border-gold-muted/10">
              <p className="font-playfair italic text-parchment/80 text-sm line-clamp-1" title={match.caseTitle}>
                {match.caseTitle}
              </p>
            </div>

            {/* Plaintiff vs Defendant */}
            <div className="p-6 space-y-6">
              
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold flex items-center gap-2">
                  <Shield size={12} /> Plaintiff
                </span>
                <p className="font-inter text-sm text-ivory min-h-[40px]">
                  {match.plaintiff || <span className="text-red-500/50 italic">Unassigned</span>}
                </p>
              </div>

              <div className="flex items-center justify-center">
                <div className="h-px bg-gold-muted/20 flex-1" />
                <span className="px-4 font-cinzel text-gold-muted/50 text-xs tracking-widest italic">VS</span>
                <div className="h-px bg-gold-muted/20 flex-1" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-red-400 font-bold flex items-center gap-2">
                  <Shield size={12} /> Defendant
                </span>
                <p className="font-inter text-sm text-ivory min-h-[40px]">
                  {match.defendant || <span className="text-red-500/50 italic">Unassigned</span>}
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>

      {schedule.length === 0 && (
        <div className="p-12 text-center text-parchment/50 font-inter text-sm border border-gold-muted/30 bg-court-charcoal/50">
          <Gavel size={32} className="mx-auto mb-4 text-gold-muted/30" />
          The draw has not been conducted yet. Pairings are unavailable.
        </div>
      )}
    </div>
  );
}
