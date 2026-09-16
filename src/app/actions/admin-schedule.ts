"use server";

import { createAdminClient } from "@/lib/supabase";

export async function getAdminSchedule() {
  const supabase = createAdminClient();

  // Fetch matches along with the associated case and both teams
  const { data: matches, error } = await supabase
    .from("matches")
    .select(`
      id,
      round,
      cases ( case_number, title ),
      team_a:teams!matches_team_a_fkey ( college_name ),
      team_b:teams!matches_team_b_fkey ( college_name ),
      allocations!inner( team_id, side )
    `)
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching admin schedule:", error);
    return [];
  }

  // We need to figure out who is plaintiff and defendant by matching the team_ids in allocations
  return matches.map((m: any) => {
    // allocations array contains both teams for this match.
    // team_a is the one matching m.team_a.id ? Wait, the select didn't get team ID. Let's fix that below manually if needed.
    // Actually, allocations has team_id.
    // To keep it simple, we just pass raw data to frontend and let frontend parse it if we didn't join exactly.
    return m;
  });
}

// Fixed robust query
export async function getAdminScheduleFull() {
  const supabase = createAdminClient();

  // Fetch from allocations and group by court_number
  // Use FK hints (cases!case_id, teams!team_id) to disambiguate Supabase joins
  const { data: allocations, error } = await supabase
    .from("allocations")
    .select(`
      match_id,
      side,
      court_number,
      teams!team_id ( college_name ),
      cases!case_id ( case_number, title )
    `)
    .neq("side", "BYE")
    .order("court_number", { ascending: true });

  if (error) {
    console.error("[getAdminScheduleFull] Supabase error:", error);
    return [];
  }
  if (!allocations) return [];

  // Group by court_number instead of match_id since auto-allocation doesn't create match records
  const scheduleMap = new Map();

  allocations.forEach((alloc: any) => {
    if (!scheduleMap.has(alloc.court_number)) {
      scheduleMap.set(alloc.court_number, {
        matchId: alloc.match_id || `court-${alloc.court_number}`,
        courtNumber: alloc.court_number,
        caseNumber: alloc.cases?.case_number,
        caseTitle: alloc.cases?.title,
        plaintiff: null,
        defendant: null
      });
    }

    const match = scheduleMap.get(alloc.court_number);
    if (alloc.side === "PLAINTIFF") {
      match.plaintiff = alloc.teams?.college_name;
    } else if (alloc.side === "DEFENDANT") {
      match.defendant = alloc.teams?.college_name;
    }
  });

  return Array.from(scheduleMap.values());
}
