"use client";

import { useState, useEffect } from "react";
import { getMatchesWithScores, saveMatchScore } from "@/app/actions/admin-scoring";
import { Award, Save } from "lucide-react";

export default function Round1Registry() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMatchesWithScores(1).then(data => {
      setMatches(data);
      setLoading(false);
    });
  }, []);

  const handleScoreChange = (matchIndex: number, teamKey: 'score_a' | 'score_b', value: string) => {
    const updated = [...matches];
    updated[matchIndex][teamKey] = parseFloat(value) || 0;
    setMatches(updated);
  };

  const handleSave = async (match: any) => {
    setSaving(true);
    if (match.team_a) await saveMatchScore(match.id, match.team_a.id, 1, match.score_a);
    if (match.team_b) await saveMatchScore(match.id, match.team_b.id, 1, match.score_b);
    setSaving(false);
    alert("Scores saved for this match.");
  };

  if (loading) return <div className="p-8 text-parchment">Loading matches...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl md:text-4xl font-cinzel text-gold-accent flex items-center gap-4">
          <Award size={32} />
          Round I Scoring
        </h1>
        <p className="text-parchment/60 font-inter mt-2 text-sm">
          Enter and lock judges' scores for the first round of oral arguments.
        </p>
        <div className="w-16 h-px bg-gold-muted mt-4" />
      </div>

      <div className="space-y-6">
        {matches.map((match, index) => (
          <div key={match.id} className="bg-court-charcoal/80 border border-gold-muted/30 p-6 flex flex-col md:flex-row gap-6 items-center justify-between hover:border-gold-accent transition-colors">
            
            <div className="flex-1 space-y-4 w-full">
              <div className="text-xs uppercase tracking-widest text-gold-muted font-inter">
                Case {match.cases?.case_number}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 p-4 bg-black/20 border border-gold-muted/10">
                  <p className="text-sm font-playfair text-parchment">{match.team_a?.college_name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-parchment/50 uppercase tracking-widest">Score:</span>
                    <input 
                      type="number" 
                      value={match.score_a || ""}
                      onChange={(e) => handleScoreChange(index, 'score_a', e.target.value)}
                      className="bg-court-dark border border-gold-muted/30 text-parchment p-2 w-24 focus:outline-none focus:border-gold-accent text-right"
                    />
                  </div>
                </div>

                <div className="space-y-2 p-4 bg-black/20 border border-gold-muted/10">
                  <p className="text-sm font-playfair text-parchment">{match.team_b?.college_name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-parchment/50 uppercase tracking-widest">Score:</span>
                    <input 
                      type="number" 
                      value={match.score_b || ""}
                      onChange={(e) => handleScoreChange(index, 'score_b', e.target.value)}
                      className="bg-court-dark border border-gold-muted/30 text-parchment p-2 w-24 focus:outline-none focus:border-gold-accent text-right"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleSave(match)}
              disabled={saving}
              className="px-6 py-4 bg-gold-muted hover:bg-gold-accent text-court-dark font-bold tracking-widest uppercase text-sm transition-all flex items-center gap-2 md:w-auto w-full justify-center disabled:opacity-50"
            >
              <Save size={16} /> Save
            </button>
          </div>
        ))}

        {matches.length === 0 && (
          <div className="p-12 text-center text-parchment/50 font-inter text-sm border border-gold-muted/30 bg-court-charcoal/50">
            No matches generated yet.
          </div>
        )}
      </div>
    </div>
  );
}
