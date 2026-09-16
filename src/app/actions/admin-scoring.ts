"use server";

import { createAdminClient } from "@/lib/supabase";

export async function getMatchesWithScores(roundNum: number) {
  const supabase = createAdminClient();

  // Fetch matches
  const { data: matches, error: matchesError } = await supabase
    .from("matches")
    .select(`
      id,
      round,
      cases ( case_number, title ),
      team_a:teams!matches_team_a_fkey ( id, college_name ),
      team_b:teams!matches_team_b_fkey ( id, college_name )
    `)
    .eq("round", roundNum)
    .order("id", { ascending: true });

  if (matchesError || !matches) return [];

  // Fetch scores for this round
  const { data: scores } = await supabase
    .from("scores")
    .select("*")
    .eq("round", roundNum);

  // Map scores to matches
  return matches.map((m: any) => {
    const scoreA = scores?.find(s => s.match_id === m.id && s.team_id === m.team_a.id);
    const scoreB = scores?.find(s => s.match_id === m.id && s.team_id === m.team_b.id);
    return {
      ...m,
      score_a: scoreA?.score || null,
      score_b: scoreB?.score || null,
    };
  });
}

export async function saveMatchScore(matchId: string, teamId: string, roundNum: number, score: number) {
  const supabase = createAdminClient();

  // Upsert score
  const { data: existing } = await supabase
    .from("scores")
    .select("id")
    .eq("match_id", matchId)
    .eq("team_id", teamId)
    .eq("round", roundNum)
    .single();

  if (existing) {
    await supabase.from("scores").update({ score }).eq("id", existing.id);
  } else {
    await supabase.from("scores").insert({
      match_id: matchId,
      team_id: teamId,
      round: roundNum,
      score: score
    });
  }
  return { success: true };
}

export async function toggleResultsPublished() {
  const supabase = createAdminClient();
  const { data: current } = await supabase.from("event_settings").select("results_published").single();
  
  const newState = !current?.results_published;
  
  await supabase.from("event_settings").update({ results_published: newState }).eq("id", 1);
  return { success: true, published: newState };
}

export async function getEventSettings() {
  const supabase = createAdminClient();
  const { data: settings } = await supabase.from("event_settings").select("*").single();
  return settings;
}

export async function getTeamsWithScores() {
  const supabase = createAdminClient();
  
  // Fetch teams and their allocations to know their side and case
  const { data: teams, error } = await supabase
    .from("teams")
    .select(`
      id,
      team_code,
      college_name,
      total_score,
      allocations ( side )
    `)
    .order("college_name", { ascending: true });

  if (error || !teams) return [];

  return teams.map(t => ({
    id: t.id,
    team_code: t.team_code,
    college_name: t.college_name,
    total_score: t.total_score || 0,
    side: t.allocations ? (Array.isArray(t.allocations) ? t.allocations[0]?.side : (t.allocations as any).side) : 'UNALLOCATED'
  }));
}

export async function saveTeamScores(scores: { id: string; score: number }[]) {
  const supabase = createAdminClient();
  
  for (const { id, score } of scores) {
    await supabase.from("teams").update({ total_score: score }).eq("id", id);
  }
  
  return { success: true };
}

export async function getManualResults() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("results").select("*").order("created_at", { ascending: false }).limit(1).single();
  return data;
}

export async function saveManualResults(plaintiffId: string | null, defendantId: string | null) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("results").insert({
    best_plaintiff_team: plaintiffId || null,
    best_defendant_team: defendantId || null,
    published_at: new Date().toISOString()
  });
  if (error) return { success: false, message: error.message };
  return { success: true };
}
