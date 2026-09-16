"use client";

import { useState, useEffect } from "react";
import { toggleResultsPublished, getEventSettings, getTeamsWithScores, getManualResults, saveManualResults } from "@/app/actions/admin-scoring";
import { Trophy, Globe, Save } from "lucide-react";

export default function ResultsRegistry() {
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<any[]>([]);
  
  const [manualPlaintiffId, setManualPlaintiffId] = useState<string>("");
  const [manualDefendantId, setManualDefendantId] = useState<string>("");
  const [savingManual, setSavingManual] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch settings
    const settings = await getEventSettings();
    setPublished(settings?.results_published || false);
    
    // Fetch teams for dropdowns
    const teamsData = await getTeamsWithScores();
    setTeams(teamsData);

    // Fetch existing manual results if any
    const manualData = await getManualResults();
    if (manualData) {
      setManualPlaintiffId(manualData.best_plaintiff_team || "");
      setManualDefendantId(manualData.best_defendant_team || "");
    }
    
    setLoading(false);
  };

  const handleToggle = async () => {
    setLoading(true);
    const res = await toggleResultsPublished();
    if (res.success) {
      setPublished(res.published);
    }
    setLoading(false);
  };

  const handleSaveManual = async () => {
    setSavingManual(true);
    const res = await saveManualResults(
      manualPlaintiffId || null, 
      manualDefendantId || null
    );
    if (res.success) {
      alert("Manual Winners Saved! These will override the scoresheet math.");
    } else {
      alert("Failed to save manual winners.");
    }
    setSavingManual(false);
  };

  if (loading) return <div className="p-8 text-parchment">Loading...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl md:text-4xl font-cinzel text-gold-accent flex items-center gap-4">
          <Trophy size={32} />
          Results Management
        </h1>
        <p className="text-parchment/60 font-inter mt-2 text-sm">
          Publish the final moot court results to the public domain.
        </p>
        <div className="w-16 h-px bg-gold-muted mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Manual Override Section */}
        <div className="bg-court-charcoal/50 border border-gold-muted/30 p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-cinzel text-gold-accent">Manual Winner Override</h2>
            <p className="text-sm font-inter text-parchment/60">
              Select specific teams to win. Leave blank to "Auto-Calculate" based on highest scores from the Scoresheet.
            </p>
          </div>

          <div className="space-y-4 font-inter">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gold-muted mb-2">Best Plaintiff Counsel</label>
              <select 
                value={manualPlaintiffId} 
                onChange={e => setManualPlaintiffId(e.target.value)} 
                className="w-full bg-court-dark border border-gold-muted/30 text-parchment p-3 focus:border-gold-accent outline-none appearance-none"
              >
                <option value="">-- Auto Calculate (Highest Score) --</option>
                {teams.filter(t => t.side === 'PLAINTIFF').map(t => (
                  <option key={t.id} value={t.id}>{t.college_name} (Score: {t.total_score})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-gold-muted mb-2">Best Defense Counsel</label>
              <select 
                value={manualDefendantId} 
                onChange={e => setManualDefendantId(e.target.value)} 
                className="w-full bg-court-dark border border-gold-muted/30 text-parchment p-3 focus:border-gold-accent outline-none appearance-none"
              >
                <option value="">-- Auto Calculate (Highest Score) --</option>
                {teams.filter(t => t.side === 'DEFENDANT').map(t => (
                  <option key={t.id} value={t.id}>{t.college_name} (Score: {t.total_score})</option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={handleSaveManual}
              disabled={savingManual}
              className="w-full px-6 py-3 bg-court-navy/50 border border-gold-muted/50 text-gold-muted hover:bg-gold-muted/20 hover:text-white uppercase tracking-widest text-xs transition-colors flex justify-center items-center gap-2 mt-4"
            >
              <Save size={16} /> {savingManual ? "Saving..." : "Save Winners"}
            </button>
          </div>
        </div>

        {/* Publication Section */}
        <div className="bg-court-charcoal/80 border border-gold-muted/30 p-12 text-center space-y-8 flex flex-col justify-center items-center">
          <div className="space-y-4 w-full">
            <p className="text-xs uppercase tracking-[0.2em] text-gold-muted font-inter">Current Public Status</p>
            <h2 className={`text-4xl font-cinzel tracking-widest ${published ? 'text-green-500' : 'text-red-500'}`}>
              {published ? 'PUBLISHED' : 'WITHHELD'}
            </h2>
            <p className="text-parchment/60 font-playfair italic max-w-md mx-auto mt-4">
              {published 
                ? "The results are currently live on the public /results page. All participants and guests can view them."
                : "The results are completely hidden. The public /results page currently shows a 'Results Pending' message."}
            </p>
          </div>

          <button 
            onClick={handleToggle}
            disabled={loading}
            className={`px-8 py-4 font-bold tracking-widest uppercase text-sm transition-all flex items-center gap-3 mx-auto mt-8 ${
              published 
                ? 'bg-transparent border border-red-500 text-red-500 hover:bg-red-900/20' 
                : 'bg-gold-muted hover:bg-gold-accent text-court-dark shadow-[0_0_20px_rgba(197,169,106,0.2)]'
            }`}
          >
            <Globe size={18} />
            {published ? 'Revoke Publication' : 'Publish Results to World'}
          </button>
        </div>
      </div>
    </div>
  );
}
