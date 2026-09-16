import { getDashboardStats } from "@/app/actions/admin";

export const dynamic = 'force-dynamic';

export default async function RegistryDashboard() {
  const stats = await getDashboardStats();

  const StatBox = ({ label, value, highlight = false }: { label: string, value: string | number, highlight?: boolean }) => (
    <div className={`border p-8 rounded-sm ${highlight ? 'border-gold-accent bg-court-navy' : 'border-gold-muted/30 bg-court-charcoal/50'}`}>
      <p className="text-xs uppercase tracking-widest text-parchment/60 mb-3">{label}</p>
      <p className={`text-3xl font-cinzel tracking-widest ${highlight ? 'text-gold-accent' : 'text-ivory'}`}>{value}</p>
    </div>
  );

  return (
    <div className="space-y-12 max-w-6xl animate-in fade-in duration-1000">
      <div>
        <h1 className="text-3xl md:text-4xl font-cinzel text-gold-accent">
          Court Registry Dashboard
        </h1>
        <div className="w-16 h-px bg-gold-muted mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox label="Total Teams" value={stats.totalTeams} />
        <StatBox label="Active Cases" value={stats.activeCases} />
        <StatBox label="Allocated Teams" value={stats.allocatedTeams} />
        <StatBox label="Revealed Teams" value={stats.revealedTeams} highlight={stats.revealedTeams > 0} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-gold-muted/30 p-8 rounded-sm bg-court-charcoal/50">
          <p className="text-xs uppercase tracking-widest text-parchment/60 mb-3">Draw Status</p>
          <p className={`text-xl font-cinzel tracking-widest ${stats.drawLocked ? 'text-green-500' : 'text-red-500'}`}>
            {stats.drawLocked ? "LOCKED" : "PENDING"}
          </p>
        </div>
        
        <div className="border border-gold-muted/30 p-8 rounded-sm bg-court-charcoal/50">
          <p className="text-xs uppercase tracking-widest text-parchment/60 mb-3">Case Release</p>
          <p className={`text-xl font-cinzel tracking-widest ${stats.caseRelease === 'RELEASED' ? 'text-green-500' : 'text-red-500'}`}>
            {stats.caseRelease}
          </p>
        </div>

        <div className="border border-gold-muted/30 p-8 rounded-sm bg-court-charcoal/50">
          <p className="text-xs uppercase tracking-widest text-parchment/60 mb-3">Unrevealed Teams</p>
          <p className="text-xl font-cinzel tracking-widest text-ivory">
            {stats.unrevealedTeams}
          </p>
        </div>
      </div>

      <div className="border border-gold-muted/30 p-8 rounded-sm bg-court-charcoal/50">
        <p className="text-xs uppercase tracking-widest text-parchment/60 mb-3">Bye Team (Internal Only)</p>
        <p className="text-xl font-cinzel tracking-widest text-gold-muted">
          {stats.byeTeam}
        </p>
      </div>
    </div>
  );
}
