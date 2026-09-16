"use client";

import { useState, useEffect } from "react";
import { getTeamsWithScores, saveTeamScores } from "@/app/actions/admin-scoring";
import { Save, Calculator } from "lucide-react";

export default function ScoresheetRegistry() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    const data = await getTeamsWithScores();
    setTeams(data);
    
    const initialScores: Record<string, number> = {};
    data.forEach(t => {
      initialScores[t.id] = t.total_score || 0;
    });
    setScores(initialScores);
    
    setLoading(false);
  };

  const handleScoreChange = (id: string, value: string) => {
    setScores(prev => ({ ...prev, [id]: parseFloat(value) || 0 }));
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = Object.entries(scores).map(([id, score]) => ({ id, score }));
    const res = await saveTeamScores(payload);
    if (res.success) {
      alert("Scores saved successfully!");
      fetchTeams();
    } else {
      alert("Failed to save scores.");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-parchment">Loading...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl md:text-4xl font-cinzel text-gold-accent flex items-center gap-4">
            <Calculator size={32} />
            Master Scoresheet
          </h1>
          <p className="text-parchment/60 font-inter mt-2 text-sm">
            Enter final scores for all teams. These scores will automatically determine the winners on the Results page.
          </p>
          <div className="w-16 h-px bg-gold-muted mt-4" />
        </div>
        
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-gold-muted/20 border border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-court-dark uppercase tracking-widest text-xs transition-colors font-bold disabled:opacity-50 flex items-center gap-2"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save All Scores"}
        </button>
      </div>

      <div className="bg-court-charcoal/50 border border-gold-muted/30 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gold-muted/30 bg-court-navy">
              <th className="p-4 text-xs font-inter uppercase tracking-widest text-gold-muted w-1/4">Institution</th>
              <th className="p-4 text-xs font-inter uppercase tracking-widest text-gold-muted w-1/6">Team Code</th>
              <th className="p-4 text-xs font-inter uppercase tracking-widest text-gold-muted w-1/6">Side</th>
              <th className="p-4 text-xs font-inter uppercase tracking-widest text-gold-muted text-right">Final Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-muted/10">
            {teams.map((team) => (
              <tr key={team.id} className="hover:bg-court-navy/50 transition-colors">
                <td className="p-4">
                  <p className="font-playfair text-parchment text-lg">{team.college_name}</p>
                </td>
                <td className="p-4 font-mono text-sm text-parchment/80">{team.team_code}</td>
                <td className="p-4 font-inter text-sm text-parchment/80">
                  <span className={`px-2 py-1 text-xs font-bold tracking-widest uppercase ${
                    team.side === 'PLAINTIFF' ? 'text-blue-400 bg-blue-900/30' : 
                    team.side === 'DEFENDANT' ? 'text-red-400 bg-red-900/30' : 'text-gray-400 bg-gray-800'
                  }`}>
                    {team.side}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <input 
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={scores[team.id] === 0 ? '' : scores[team.id]}
                    onChange={(e) => handleScoreChange(team.id, e.target.value)}
                    placeholder="0.00"
                    className="w-32 bg-court-dark border border-gold-muted/30 text-gold-accent p-2 text-right focus:border-gold-accent outline-none font-mono text-lg"
                  />
                </td>
              </tr>
            ))}
            
            {teams.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-parchment/50 font-inter text-sm">
                  No teams found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
