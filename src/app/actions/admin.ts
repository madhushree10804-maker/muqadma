"use server";

import { createAdminClient } from "@/lib/supabase";

export async function getDashboardStats() {
  const supabase = createAdminClient();

  // Parallel fetches for performance
  const [
    { count: totalTeams },
    { count: activeCases },
    { data: allocations },
    { data: settings },
    { data: revealLogs }
  ] = await Promise.all([
    supabase.from("teams").select("*", { count: "exact", head: true }),
    supabase.from("cases").select("*", { count: "exact", head: true }).eq("active", true),
    supabase.from("allocations").select("team_id, side"),
    supabase.from("event_settings").select("*").single(),
    supabase.from("reveal_logs").select("team_id")
  ]);

  const allocatedCount = allocations?.filter(a => a.side !== "BYE").length || 0;
  const byeTeamId = allocations?.find(a => a.side === "BYE")?.team_id;

  let byeTeamName = "None";
  if (byeTeamId) {
    const { data: team } = await supabase.from("teams").select("college_name").eq("id", byeTeamId).single();
    byeTeamName = team?.college_name || "Unknown";
  }

  const isReleased = settings?.release_time && new Date(settings.release_time).getTime() <= Date.now();

  // Calculate distinct revealed teams
  const uniqueRevealedTeams = new Set(revealLogs?.map(log => log.team_id)).size;

  return {
    totalTeams: totalTeams || 0,
    activeCases: activeCases || 0,
    allocatedTeams: allocatedCount,
    byeTeam: byeTeamName,
    drawLocked: settings?.draw_locked || false,
    caseRelease: isReleased ? "RELEASED" : "SEALED",
    revealedTeams: uniqueRevealedTeams,
    unrevealedTeams: (allocatedCount + (byeTeamId ? 1 : 0)) - uniqueRevealedTeams
  };
}
