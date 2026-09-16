import { getAdminRevealLogs } from "@/app/actions/admin-monitor";
import { Eye, Clock } from "lucide-react";

export const dynamic = 'force-dynamic';
export default async function MonitorRegistry() {
  const logs = await getAdminRevealLogs();

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl md:text-4xl font-cinzel text-gold-accent flex items-center gap-4">
          <Eye className="text-gold-accent" size={32} />
          Live Reveal Monitor
        </h1>
        <p className="text-parchment/60 font-inter mt-2 text-sm">
          Track in real-time which teams have accessed their case files.
        </p>
        <div className="w-16 h-px bg-gold-muted mt-4" />
      </div>

      <div className="bg-court-charcoal/50 border border-gold-muted/30 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gold-muted/30 bg-court-navy">
              <th className="p-4 text-xs font-inter uppercase tracking-widest text-gold-muted">Team Institution</th>
              <th className="p-4 text-xs font-inter uppercase tracking-widest text-gold-muted">Status</th>
              <th className="p-4 text-xs font-inter uppercase tracking-widest text-gold-muted">Reveal Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-muted/10">
            {logs.map((log: any) => (
              <tr key={log.id} className="hover:bg-court-navy/50 transition-colors">
                <td className="p-4">
                  <p className="font-playfair text-parchment text-lg">{log.teams?.college_name || "Unknown Team"}</p>
                  <p className="text-xs font-inter text-parchment/50 mt-1">{log.teams?.phone_number}</p>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-green-900/30 text-green-400 border border-green-500/30">
                    <Eye size={14} /> Revealed
                  </span>
                </td>
                <td className="p-4 text-parchment/80 font-inter text-sm flex items-center gap-2">
                  <Clock size={14} className="text-gold-muted" />
                  {new Date(log.revealed_at).toLocaleString()}
                </td>
              </tr>
            ))}
            
            {logs.length === 0 && (
              <tr>
                <td colSpan={3} className="p-12 text-center text-parchment/50 font-inter text-sm">
                  <Eye size={32} className="mx-auto mb-4 text-gold-muted/30" />
                  No teams have revealed their cases yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
