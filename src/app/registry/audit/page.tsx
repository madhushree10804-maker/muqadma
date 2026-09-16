import { getAdminAuditLogs } from "@/app/actions/admin-audit";
import { History } from "lucide-react";

export default async function AuditRegistry() {
  const logs = await getAdminAuditLogs();

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl md:text-4xl font-cinzel text-gold-accent flex items-center gap-4">
          <History size={32} />
          Audit Records
        </h1>
        <p className="text-parchment/60 font-inter mt-2 text-sm">
          A secure, immutable log of critical administrative actions.
        </p>
        <div className="w-16 h-px bg-gold-muted mt-4" />
      </div>

      <div className="bg-court-charcoal/50 border border-gold-muted/30 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gold-muted/30 bg-court-navy">
              <th className="p-4 text-xs font-inter uppercase tracking-widest text-gold-muted">Timestamp</th>
              <th className="p-4 text-xs font-inter uppercase tracking-widest text-gold-muted">Action</th>
              <th className="p-4 text-xs font-inter uppercase tracking-widest text-gold-muted">Metadata</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-muted/10">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-court-navy/50 transition-colors">
                <td className="p-4 text-sm font-inter text-parchment/80 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-gold-muted/10 text-gold-muted border border-gold-muted/30">
                    {log.action}
                  </span>
                </td>
                <td className="p-4 font-mono text-xs text-parchment/50">
                  {log.metadata ? JSON.stringify(log.metadata) : "N/A"}
                </td>
              </tr>
            ))}
            
            {logs.length === 0 && (
              <tr>
                <td colSpan={3} className="p-12 text-center text-parchment/50 font-inter text-sm">
                  <History size={32} className="mx-auto mb-4 text-gold-muted/30" />
                  No audit logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
