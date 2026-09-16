"use client";

import { useState, useEffect } from "react";
import { getAdminCases, addCase, editCase, deleteCase } from "@/app/actions/admin-cases";
import { CheckCircle2, XCircle, Plus, Edit2, Trash2 } from "lucide-react";

export default function CasesRegistry() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editingCase, setEditingCase] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    setLoading(true);
    const data = await getAdminCases();
    setCases(data);
    setLoading(false);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    let res;
    if (editingCase) {
      res = await editCase(editingCase.id, formData);
    } else {
      res = await addCase(formData);
    }
    
    if (res.success) {
      alert(editingCase ? "Case updated successfully." : "Case added successfully.");
      setShowForm(false);
      setEditingCase(null);
      fetchCases();
    } else {
      alert(`Error: ${res.error}`);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this case? This action cannot be undone and may break team allocations.")) return;
    
    const res = await deleteCase(id);
    if (res.success) {
      fetchCases();
    } else {
      alert(`Failed to delete case: ${res.error}`);
    }
  };

  const handleEditClick = (caseFile: any) => {
    setEditingCase(caseFile);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCase(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl md:text-4xl font-cinzel text-gold-accent">
            Official Case Files
          </h1>
          <div className="w-16 h-px bg-gold-muted mt-4" />
        </div>
        <button 
          onClick={() => showForm ? handleCancelForm() : setShowForm(true)}
          className="px-6 py-3 border border-gold-muted text-gold-muted hover:bg-gold-muted hover:text-court-dark uppercase tracking-widest text-xs transition-colors flex items-center gap-2"
        >
          {showForm ? 'Cancel' : <><Plus size={16} /> Add New Case</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleFormSubmit} className="bg-court-charcoal/80 p-8 border border-gold-muted/30 space-y-6">
          <h2 className="text-xl font-cinzel text-ivory">
            {editingCase ? "Update Case Record" : "Draft New Case Record"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gold-muted">Case Number</label>
              <input name="case_number" type="number" required defaultValue={editingCase?.case_number} className="w-full bg-court-dark border border-gold-muted/30 text-parchment p-3" />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gold-muted">Theme</label>
              <input name="theme" type="text" required defaultValue={editingCase?.theme} placeholder="e.g. CCTV, Privacy..." className="w-full bg-court-dark border border-gold-muted/30 text-parchment p-3" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-gold-muted">Case Title</label>
            <input name="title" type="text" required defaultValue={editingCase?.title} placeholder="e.g. Asha v. St. Agnes College Management" className="w-full bg-court-dark border border-gold-muted/30 text-parchment p-3" />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-gold-muted">Facts of the Case</label>
            <textarea name="facts" required defaultValue={editingCase?.facts} rows={6} className="w-full bg-court-dark border border-gold-muted/30 text-parchment p-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gold-muted">Plaintiff</label>
              <input name="plaintiff" type="text" required defaultValue={editingCase?.plaintiff} className="w-full bg-court-dark border border-gold-muted/30 text-parchment p-3" />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gold-muted">Defendant</label>
              <input name="defendant" type="text" required defaultValue={editingCase?.defendant} className="w-full bg-court-dark border border-gold-muted/30 text-parchment p-3" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-gold-muted">Issues for Determination</label>
            <textarea name="issues" required defaultValue={editingCase?.issues} rows={4} placeholder="1. Whether...&#10;2. Whether..." className="w-full bg-court-dark border border-gold-muted/30 text-parchment p-3" />
          </div>

          <button disabled={isSubmitting} type="submit" className="px-8 py-4 bg-gold-muted hover:bg-gold-accent text-court-dark font-bold tracking-widest uppercase text-sm transition-all disabled:opacity-50">
            {isSubmitting ? "Saving..." : editingCase ? "Update Case Record" : "Seal Case Record into Database"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-parchment p-8">Loading records...</div>
      ) : (
        <div className="bg-court-charcoal/50 border border-gold-muted/30 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gold-muted/30 bg-court-navy">
                <th className="p-4 text-xs font-inter uppercase tracking-widest text-gold-muted">Case No.</th>
                <th className="p-4 text-xs font-inter uppercase tracking-widest text-gold-muted w-1/2">Title</th>
                <th className="p-4 text-xs font-inter uppercase tracking-widest text-gold-muted">Status</th>
                <th className="p-4 text-xs font-inter uppercase tracking-widest text-gold-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-muted/10">
              {cases.map((caseFile) => (
                <tr key={caseFile.id} className="hover:bg-court-navy/50 transition-colors">
                  <td className="p-4 font-cinzel text-2xl text-ivory">
                    {String(caseFile.case_number).padStart(2, '0')}
                  </td>
                  <td className="p-4">
                    <p className="font-playfair text-parchment text-lg">{caseFile.title}</p>
                    <p className="text-xs font-inter text-parchment/40 mt-2">{caseFile.theme}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase ${
                      caseFile.active ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-red-900/30 text-red-400 border border-red-500/30'
                    }`}>
                      {caseFile.active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      {caseFile.active ? 'Active' : 'Archived'}
                    </span>
                  </td>
                  <td className="p-4 flex items-center justify-end gap-4 h-full">
                    <a 
                      href={`/the-case/${caseFile.case_number}?token=${caseFile.adminToken}`} 
                      target="_blank" 
                      className="text-xs font-inter tracking-widest uppercase text-gold-accent hover:text-gold-muted underline underline-offset-4"
                    >
                      View
                    </a>
                    <button onClick={() => handleEditClick(caseFile)} className="text-parchment/70 hover:text-gold-accent transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(caseFile.id)} className="text-parchment/70 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {cases.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-parchment/50 font-inter text-sm">
                    No case records found in the registry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
