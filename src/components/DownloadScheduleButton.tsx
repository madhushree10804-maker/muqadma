"use client";

import { Download } from "lucide-react";

export default function DownloadScheduleButton({ schedule }: { schedule: any[] }) {
  const handleDownload = () => {
    // 1. Define CSV headers
    const headers = ["Court Number", "Case Number", "Case Title", "Plaintiff Counsel", "Defense Counsel"];
    
    // 2. Map schedule data to CSV rows
    const rows = schedule.map(match => [
      match.courtNumber,
      match.caseNumber,
      `"${match.caseTitle.replace(/"/g, '""')}"`, // Escape quotes and wrap in quotes for commas
      `"${(match.plaintiff || "Unassigned").replace(/"/g, '""')}"`,
      `"${(match.defendant || "Unassigned").replace(/"/g, '""')}"`
    ]);

    // 3. Combine headers and rows
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

    // 4. Create Blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `muqadma_court_schedule_${new Date().toISOString().slice(0, 10)}.csv`);
    
    // 5. Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={schedule.length === 0}
      className="flex items-center gap-2 px-6 py-3 bg-red-900/50 hover:bg-red-800 text-ivory border border-red-500/50 font-bold tracking-widest uppercase text-xs transition-all disabled:opacity-50"
    >
      <Download size={16} />
      Export to CSV
    </button>
  );
}
