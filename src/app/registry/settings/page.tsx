"use client";

import { useState, useEffect } from "react";
import { getSettingsPageData, generateTeamAccessCode, updateReleaseTime, triggerAllocation, toggleSchedulePublished } from "@/app/actions/admin-settings";
import { Settings, Key, Clock, Shuffle, Calendar } from "lucide-react";

export default function SettingsRegistry() {
  const [data, setData] = useState<{ settings: any, teams: any[] }>({ settings: null, teams: [] });
  const [loading, setLoading] = useState(true);
  
  const [selectedTeam, setSelectedTeam] = useState("");
  const [generatedCode, setGeneratedCode] = useState<{ teamName: string, code: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [releaseTime, setReleaseTime] = useState("");
  const [isUpdatingTime, setIsUpdatingTime] = useState(false);

  const [isAllocating, setIsAllocating] = useState(false);

  const [schedulePublished, setSchedulePublished] = useState(false);
  const [isPublishingSchedule, setIsPublishingSchedule] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getSettingsPageData();
    setData(res);
    if (res.settings?.release_time) {
      // Format for datetime-local input
      const date = new Date(res.settings.release_time);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      setReleaseTime(date.toISOString().slice(0, 16));
    }
    setSchedulePublished(res.settings?.schedule_published || false);
    setLoading(false);
  };

  const handleGenerateCode = async () => {
    if (!selectedTeam) return alert("Select a team first");
    setIsGenerating(true);
    const res = await generateTeamAccessCode(selectedTeam);
    if (res.success) {
      const team = data.teams.find(t => t.id === selectedTeam);
      setGeneratedCode({ teamName: team?.college_name || "Team", code: res.code });
      setSelectedTeam("");
    }
    setIsGenerating(false);
  };

  const handleUpdateTime = async () => {
    setIsUpdatingTime(true);
    const isoString = new Date(releaseTime).toISOString();
    await updateReleaseTime(isoString);
    alert("Release time updated successfully.");
    setIsUpdatingTime(false);
  };

  const handleAllocation = async () => {
    if (!confirm("WARNING: This will permanently lock the draw and assign all cases cryptographically. Proceed?")) return;
    if (!confirm("DOUBLE VERIFICATION: This action is destructive and irreversible. Are you absolutely sure you want to lock and execute the draw?")) return;
    
    setIsAllocating(true);
    const res = await triggerAllocation();
    alert(res.message || res.error);
    await fetchData();
    setIsAllocating(false);
  };

  const handleToggleSchedule = async () => {
    setIsPublishingSchedule(true);
    const res = await toggleSchedulePublished();
    if (res.success) {
      setSchedulePublished(res.published);
    }
    setIsPublishingSchedule(false);
  };

  if (loading) return <div className="p-8 text-parchment">Loading settings...</div>;

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl md:text-4xl font-cinzel text-gold-accent flex items-center gap-4">
          <Settings size={32} />
          Event Settings
        </h1>
        <div className="w-16 h-px bg-gold-muted mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Access Code Generation */}
        <div className="bg-court-charcoal/80 border border-gold-muted/30 p-8 space-y-6">
          <h2 className="text-xl font-cinzel text-gold-muted flex items-center gap-2 border-b border-gold-muted/20 pb-4">
            <Key size={20} /> Access Code Management
          </h2>
          <p className="text-xs text-parchment/60 font-inter">
            Generate a new secure 6-character access code for a team. This replaces their existing code. Note this down immediately!
          </p>
          
          <select 
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="w-full bg-court-dark border border-gold-muted/30 text-parchment p-3 focus:outline-none focus:border-gold-accent text-sm"
          >
            <option value="" disabled>Select Institution...</option>
            {data.teams.map(t => (
              <option key={t.id} value={t.id}>{t.team_code} - {t.college_name}</option>
            ))}
          </select>

          <button 
            onClick={handleGenerateCode}
            disabled={isGenerating || !selectedTeam}
            className="w-full py-3 bg-gold-muted hover:bg-gold-accent text-court-dark font-bold tracking-widest uppercase text-xs transition-all disabled:opacity-50"
          >
            {isGenerating ? "Generating..." : "Generate New Code"}
          </button>

          {generatedCode && (
            <div className="p-4 bg-green-900/20 border border-green-500/30 text-center space-y-2 mt-4 animate-in fade-in">
              <p className="text-xs text-green-400 font-inter">Code for {generatedCode.teamName}</p>
              <p className="text-3xl font-mono text-ivory tracking-[0.5em]">{generatedCode.code}</p>
            </div>
          )}
        </div>

        {/* Global Timers */}
        <div className="bg-court-charcoal/80 border border-gold-muted/30 p-8 space-y-6">
          <h2 className="text-xl font-cinzel text-gold-muted flex items-center gap-2 border-b border-gold-muted/20 pb-4">
            <Clock size={20} /> Release Timer
          </h2>
          <p className="text-xs text-parchment/60 font-inter">
            Set the exact time when the case files will be unlocked for the participants. The countdown syncs to this.
          </p>
          
          <input 
            type="datetime-local" 
            value={releaseTime}
            onChange={(e) => setReleaseTime(e.target.value)}
            className="w-full bg-court-dark border border-gold-muted/30 text-parchment p-3 focus:outline-none focus:border-gold-accent text-sm"
          />

          <button 
            onClick={handleUpdateTime}
            disabled={isUpdatingTime}
            className="w-full py-3 bg-gold-muted hover:bg-gold-accent text-court-dark font-bold tracking-widest uppercase text-xs transition-all disabled:opacity-50"
          >
            {isUpdatingTime ? "Updating..." : "Update Release Time"}
          </button>
        </div>

        {/* Allocation Trigger */}
        <div className="bg-court-charcoal/80 border border-red-500/30 p-8 space-y-6 md:col-span-2">
          <h2 className="text-xl font-cinzel text-red-500 flex items-center gap-2 border-b border-red-500/20 pb-4">
            <Shuffle size={20} /> Master Case Allocation
          </h2>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <p className="text-xs text-parchment/60 font-inter flex-1">
              Trigger the cryptographically secure allocation engine. This will erase any pending draws, lock the matches, pick the BYE team, and assign all courts. 
              <strong> Current Status: {data.settings?.draw_locked ? 'LOCKED' : 'PENDING'}</strong>
            </p>
            <button 
              onClick={handleAllocation}
              disabled={isAllocating || data.settings?.draw_locked}
              className="px-8 py-4 bg-red-900/80 hover:bg-red-800 text-ivory border border-red-500/50 font-bold tracking-widest uppercase text-xs transition-all disabled:opacity-50"
            >
              {isAllocating ? "Allocating..." : "Execute Allocation Draw"}
            </button>
          </div>
        </div>

        {/* Public Schedule Visibility */}
        <div className="bg-court-charcoal/80 border border-gold-muted/30 p-8 space-y-6 md:col-span-2">
          <h2 className="text-xl font-cinzel text-gold-muted flex items-center gap-2 border-b border-gold-muted/20 pb-4">
            <Calendar size={20} /> Public Schedule Visibility
          </h2>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <p className="text-xs text-parchment/60 font-inter flex-1">
              Manually publish or withhold the Court Schedule from the public. This overrides any timers.
              <strong> Current Status: {schedulePublished ? 'PUBLISHED' : 'WITHHELD'}</strong>
            </p>
            <button 
              onClick={handleToggleSchedule}
              disabled={isPublishingSchedule}
              className={`px-8 py-4 font-bold tracking-widest uppercase text-xs transition-all ${
                schedulePublished 
                  ? 'bg-transparent border border-red-500 text-red-500 hover:bg-red-900/20' 
                  : 'bg-gold-muted hover:bg-gold-accent text-court-dark shadow-[0_0_20px_rgba(197,169,106,0.2)]'
              }`}
            >
              {isPublishingSchedule ? "Updating..." : (schedulePublished ? 'Revoke Publication' : 'Publish Schedule to World')}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
