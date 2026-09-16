"use client";

import { useState, useEffect } from "react";
import { getAdminTeams, generateAllAccessCodes, createAdminTeam, updateAdminTeam, deleteAdminTeam } from "@/app/actions/admin-teams";
import { autoAllocateTeams } from "@/app/actions/admin-allocations";
import { CheckCircle2, XCircle, Clock, KeyRound, Download, X, Wand2, Edit2, Trash2, Plus } from "lucide-react";

export default function TeamsRegistry() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAllocating, setIsAllocating] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState<any[] | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    team_code: "",
    college_name: "",
    participant_1: "",
    participant_2: "",
    phone_number: "",
    phone_number_2: "",
    status: "ACTIVE"
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    const data = await getAdminTeams();
    setTeams(data);
    setLoading(false);
  };

  const handleGenerateCodes = async () => {
    if (!confirm("Are you sure you want to REGENERATE all access codes? This will invalidate all existing codes and lock teams out until you distribute the new ones.")) return;
    
    setIsGenerating(true);
    const res = await generateAllAccessCodes();
    
    if (res.success) {
      setGeneratedCodes(res.codes || null);
      fetchTeams();
    } else {
      alert(`Error generating codes: ${res.message}`);
    }
    setIsGenerating(false);
  };

  const handleAutoAllocate = async () => {
    if (!confirm("WARNING: This will erase all existing case allocations and regenerate them randomly. Are you absolutely sure?")) return;
    if (!confirm("DOUBLE VERIFICATION: This action is destructive and irreversible. Do you still want to proceed with Auto Allocation?")) return;
    
    setIsAllocating(true);
    const res = await autoAllocateTeams();
    
    if (res.success) {
      alert(res.message);
      fetchTeams();
    } else {
      alert(`Error allocating teams: ${res.message}`);
    }
    setIsAllocating(false);
  };

  const handleDownloadCSV = () => {
    if (!generatedCodes) return;
    
    const headers = ["College Name", "Phone Number", "Access Code"];
    const csvContent = [
      headers.join(","),
      ...generatedCodes.map(c => `"${c.college_name}","${c.phone_number}","${c.access_code}"`)
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `muqadma_access_codes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenModal = (team: any = null) => {
    if (team) {
      setEditingTeam(team);
      setFormData({
        team_code: team.team_code,
        college_name: team.college_name,
        participant_1: team.participant_1,
        participant_2: team.participant_2,
        phone_number: team.phone_number,
        phone_number_2: team.phone_number_2 || "",
        status: team.status
      });
    } else {
      setEditingTeam(null);
      setFormData({
        team_code: "", college_name: "", participant_1: "", participant_2: "", phone_number: "", phone_number_2: "", status: "ACTIVE"
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    let res;
    if (editingTeam) {
      res = await updateAdminTeam(editingTeam.id, formData);
    } else {
      res = await createAdminTeam(formData);
    }

    if (res.success) {
      setIsModalOpen(false);
      fetchTeams();
    } else {
      alert(`Error saving team: ${res.message}`);
    }
    setIsSaving(false);
  };

  const handleDeleteTeam = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team? This will wipe their allocations and access codes!")) return;
    const res = await deleteAdminTeam(id);
    if (res.success) {
      fetchTeams();
    } else {
      alert(`Error deleting team: ${res.message}`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl md:text-4xl font-cinzel text-gold-accent">
            Registered Teams
          </h1>
          <div className="w-16 h-px bg-gold-muted mt-4" />
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => handleOpenModal()}
            className="px-6 py-3 border border-gold-muted/50 text-gold-muted hover:bg-gold-muted/20 uppercase tracking-widest text-xs transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> Add Team
          </button>
          <button 
            onClick={handleAutoAllocate}
            disabled={isAllocating}
            className="px-6 py-3 border border-gold-muted/50 text-gold-muted hover:bg-gold-muted/20 uppercase tracking-widest text-xs transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Wand2 size={16} /> {isAllocating ? "Allocating..." : "Auto-Allocate Teams"}
          </button>
          <button 
            onClick={handleGenerateCodes}
            disabled={isGenerating}
            className="px-6 py-3 border border-red-500/50 text-red-400 hover:bg-red-900/30 uppercase tracking-widest text-xs transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <KeyRound size={16} /> {isGenerating ? "Generating..." : "Generate All Access Codes"}
          </button>
        </div>
      </div>

      {generatedCodes && (
        <div className="bg-court-charcoal/90 border border-green-500/50 p-8 space-y-6 shadow-2xl relative">
          <button 
            onClick={() => setGeneratedCodes(null)}
            className="absolute top-4 right-4 text-parchment/50 hover:text-white"
          >
            <X size={24} />
          </button>
          
          <div>
            <h2 className="text-2xl font-cinzel text-green-400">Access Codes Generated</h2>
            <p className="text-sm font-inter text-parchment/70 mt-2">
              WARNING: These plain-text codes are shown ONLY ONCE. Please download the CSV immediately.
            </p>
          </div>
          
          <button 
            onClick={handleDownloadCSV}
            className="px-6 py-3 bg-green-900/50 hover:bg-green-800 text-green-100 border border-green-500/50 uppercase tracking-widest text-sm font-bold flex items-center gap-3 transition-colors w-full justify-center"
          >
            <Download size={20} /> Download CSV
          </button>
          
          <div className="max-h-64 overflow-y-auto border border-gold-muted/20 p-4 bg-black/30">
            {generatedCodes.map((c, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-gold-muted/10 last:border-0 font-inter text-sm">
                <span className="text-parchment truncate max-w-[60%]">{c.college_name}</span>
                <span className="text-green-400 font-mono text-lg font-bold tracking-widest">{c.access_code}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-parchment p-8">Loading records...</div>
      ) : (
        <div className="bg-court-charcoal/50 border border-gold-muted/30 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gold-muted/30 bg-court-navy">
                <th className="p-4 text-xs font-inter uppercase tracking-widest text-gold-muted">Institution</th>
                <th className="p-4 text-xs font-inter uppercase tracking-widest text-gold-muted">Contact Person</th>
                <th className="p-4 text-xs font-inter uppercase tracking-widest text-gold-muted">Phone</th>
                <th className="p-4 text-xs font-inter uppercase tracking-widest text-gold-muted">Status</th>
                <th className="p-4 text-xs font-inter uppercase tracking-widest text-gold-muted">Access Security</th>
                <th className="p-4 text-xs font-inter uppercase tracking-widest text-gold-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-muted/10">
              {teams.map((team) => {
                const access = Array.isArray(team.team_access) ? team.team_access[0] : team.team_access;
                const isLocked = access?.locked_until && new Date(access.locked_until) > new Date();

                return (
                  <tr key={team.id} className="hover:bg-court-navy/50 transition-colors">
                    <td className="p-4">
                      <p className="font-playfair text-parchment text-lg">{team.college_name}</p>
                      <p className="text-xs font-inter text-parchment/50 mt-1">{team.team_code}</p>
                    </td>
                    <td className="p-4 font-inter text-sm text-parchment/80">
                      <div className="space-y-1">
                        <p>1. {team.participant_1}</p>
                        <p>2. {team.participant_2}</p>
                      </div>
                    </td>
                    <td className="p-4 font-inter text-sm text-parchment/80 tracking-widest">
                      <div className="space-y-1">
                        <p>{team.phone_number}</p>
                        <p className="text-xs text-parchment/50">{team.phone_number_2}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase ${
                        team.status === 'ACTIVE' ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-red-900/30 text-red-400 border border-red-500/30'
                      }`}>
                        {team.status === 'ACTIVE' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {team.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="p-4">
                      {isLocked ? (
                        <span className="flex items-center gap-2 text-xs text-red-400 font-inter uppercase tracking-widest">
                          <Clock size={14} /> Locked Out
                        </span>
                      ) : (
                        <div className="text-xs text-parchment/60 font-inter">
                          <p>Attempts: {access ? (access.failed_attempts ?? 0) : '-'}</p>
                          <p className="mt-1">Last: {access?.last_verification ? new Date(access.last_verification).toLocaleTimeString() : 'Never'}</p>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenModal(team)} className="p-2 text-gold-muted hover:text-white hover:bg-gold-muted/20 rounded-md transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDeleteTeam(team.id)} className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/20 rounded-md transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {teams.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-parchment/50 font-inter text-sm">
                    No teams found in the registry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-court-charcoal border border-gold-muted/30 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-parchment/50 hover:text-white transition-colors">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-cinzel text-gold-accent mb-6">{editingTeam ? "Edit Team" : "Add New Team"}</h2>
            
            <form onSubmit={handleSaveTeam} className="space-y-4 font-inter">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gold-muted mb-1">Team Code</label>
                  <input required value={formData.team_code} onChange={e => setFormData({...formData, team_code: e.target.value})} className="w-full bg-court-dark border border-gold-muted/30 text-parchment p-3 focus:border-gold-accent outline-none" placeholder="e.g. MUQ-12" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gold-muted mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-court-dark border border-gold-muted/30 text-parchment p-3 focus:border-gold-accent outline-none appearance-none">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gold-muted mb-1">Institution Name</label>
                <input required value={formData.college_name} onChange={e => setFormData({...formData, college_name: e.target.value})} className="w-full bg-court-dark border border-gold-muted/30 text-parchment p-3 focus:border-gold-accent outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gold-muted mb-1">Participant 1 Name</label>
                  <input required value={formData.participant_1} onChange={e => setFormData({...formData, participant_1: e.target.value})} className="w-full bg-court-dark border border-gold-muted/30 text-parchment p-3 focus:border-gold-accent outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gold-muted mb-1">Participant 2 Name</label>
                  <input required value={formData.participant_2} onChange={e => setFormData({...formData, participant_2: e.target.value})} className="w-full bg-court-dark border border-gold-muted/30 text-parchment p-3 focus:border-gold-accent outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gold-muted mb-1">Phone 1</label>
                  <input required value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} className="w-full bg-court-dark border border-gold-muted/30 text-parchment p-3 focus:border-gold-accent outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gold-muted mb-1">Phone 2</label>
                  <input value={formData.phone_number_2} onChange={e => setFormData({...formData, phone_number_2: e.target.value})} className="w-full bg-court-dark border border-gold-muted/30 text-parchment p-3 focus:border-gold-accent outline-none" placeholder="Optional" />
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 border border-gold-muted/30 text-parchment hover:bg-white/5 uppercase tracking-widest text-xs transition-colors">Cancel</button>
                <button type="submit" disabled={isSaving} className="px-6 py-3 bg-gold-muted/20 border border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-court-dark uppercase tracking-widest text-xs transition-colors font-bold disabled:opacity-50 min-w-[120px]">
                  {isSaving ? "Saving..." : "Save Team"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
