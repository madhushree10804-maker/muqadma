"use server";

import { createAdminClient } from "@/lib/supabase";

export async function getVerdict() {
  const supabase = createAdminClient(); // Use admin client to bypass RLS for fetching the verdict

  // 1. Check if results are published
  const { data: settings } = await supabase.from("event_settings").select("results_published").single();

  if (!settings?.results_published) {
    return { published: false };
  }

  // 2. Fetch manual results first (use maybeSingle instead of single)
  const { data: results, error: resError } = await supabase
    .from("results")
    .select(`
      best_plaintiff_team:teams!results_best_plaintiff_team_fkey ( college_name ),
      best_defendant_team:teams!results_best_defendant_team_fkey ( college_name )
    `)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const resData: any = results;

  // 3. If no manual override is found for a side, fallback to scores
  const { data: teams, error: teamsError } = await supabase
    .from("teams")
    .select(`college_name, total_score, allocations(side)`)
    .order("total_score", { ascending: false });

  console.log("Teams error:", teamsError);
  console.log("Teams data:", JSON.stringify(teams, null, 2));

  const getSide = (t: any) => {
    if (!t.allocations) return null;
    if (Array.isArray(t.allocations)) {
      return t.allocations.length > 0 ? t.allocations[0].side : null;
    }
    return t.allocations.side;
  };

  const plaintiffTeams = teams?.filter((t: any) => getSide(t) === "PLAINTIFF") || [];
  const defendantTeams = teams?.filter((t: any) => getSide(t) === "DEFENDANT") || [];

  const autoBestPlaintiff = plaintiffTeams.length > 0 ? plaintiffTeams[0].college_name : "Pending";
  const autoBestDefendant = defendantTeams.length > 0 ? defendantTeams[0].college_name : "Pending";

  const getManualName = (obj: any) => {
    if (!obj) return null;
    if (Array.isArray(obj)) return obj.length > 0 ? obj[0].college_name : null;
    return obj.college_name;
  };

  const manualPlaintiff = getManualName(resData?.best_plaintiff_team);
  const manualDefendant = getManualName(resData?.best_defendant_team);

  return {
    published: true,
    bestPlaintiff: manualPlaintiff || autoBestPlaintiff,
    bestDefendant: manualDefendant || autoBestDefendant
  };
}
