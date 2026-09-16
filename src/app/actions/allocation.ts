"use server";

import { createAdminClient } from "@/lib/supabase";
import crypto from "crypto";

// Helper for cryptographically secure random integer between 0 and max (exclusive)
function secureRandomInt(max: number) {
  return crypto.randomInt(0, max);
}

// Fisher-Yates shuffle using crypto.randomInt
function secureShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function allocateCases() {
  const supabase = createAdminClient();

  // 1. Check if allocation is already locked
  const { data: settings } = await supabase.from("event_settings").select("*").single();
  if (settings?.draw_locked) {
    return { success: false, error: "Allocation is already locked." };
  }

  // 2. Fetch all active teams
  const { data: teams, error: teamsError } = await supabase
    .from("teams")
    .select("id")
    .eq("status", "ACTIVE");

  if (teamsError || !teams || teams.length < 2) {
    return { success: false, error: "Not enough active teams." };
  }

  // 3. Fetch all active cases
  const { data: cases, error: casesError } = await supabase
    .from("cases")
    .select("id, case_number")
    .eq("active", true);

  if (casesError || !cases || cases.length === 0) {
    return { success: false, error: "No active cases found." };
  }

  // 4. Shuffle teams securely
  const shuffledTeams = secureShuffle(teams.map((t) => t.id));

  // Determine Bye Team (if odd number)
  let byeTeamId = null;
  if (shuffledTeams.length % 2 !== 0) {
    byeTeamId = shuffledTeams.pop(); // The last team gets the bye
  }

  // We need at least enough cases for the matches
  const numMatches = shuffledTeams.length / 2;
  if (cases.length < numMatches) {
    return { success: false, error: `Need at least ${numMatches} cases, but only ${cases.length} are active.` };
  }

  // 5. Shuffle cases securely
  const shuffledCases = secureShuffle(cases);

  // Clear existing allocations and matches to regenerate
  await supabase.from("allocations").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("matches").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const allocationsToInsert = [];

  // 6. Create matches and allocate
  for (let i = 0; i < numMatches; i++) {
    const teamA = shuffledTeams[i * 2];
    const teamB = shuffledTeams[i * 2 + 1];
    const assignedCase = shuffledCases[i];

    // Create Match
    const { data: matchData, error: matchError } = await supabase
      .from("matches")
      .insert({
        case_id: assignedCase.id,
        team_a: teamA,
        team_b: teamB,
        round: 1,
      })
      .select("id")
      .single();

    if (matchError) throw matchError;

    // Randomize Plaintiff / Defendant
    const isTeamAPlaintiff = secureRandomInt(2) === 0;

    allocationsToInsert.push({
      team_id: teamA,
      case_id: assignedCase.id,
      side: isTeamAPlaintiff ? "PLAINTIFF" : "DEFENDANT",
      court_number: assignedCase.case_number, // Court number equals case number
      match_id: matchData.id,
      locked: true, // we lock it upon creation as per instructions or leave for event settings? The prompt says "Lock the allocation."
    });

    allocationsToInsert.push({
      team_id: teamB,
      case_id: assignedCase.id,
      side: isTeamAPlaintiff ? "DEFENDANT" : "PLAINTIFF",
      court_number: assignedCase.case_number,
      match_id: matchData.id,
      locked: true,
    });
  }

  // Handle Bye Team Allocation if needed (they don't get a match, but need tracking)
  if (byeTeamId) {
    allocationsToInsert.push({
      team_id: byeTeamId,
      case_id: null,
      side: "BYE",
      court_number: 0,
      match_id: null,
      locked: true,
    });
  }

  // Insert Allocations
  const { error: allocError } = await supabase.from("allocations").insert(allocationsToInsert);
  if (allocError) {
    return { success: false, error: allocError.message };
  }

  // 7. Lock the draw in event settings
  await supabase.from("event_settings").update({ draw_locked: true }).eq("id", 1);

  // 8. Log the audit action
  await supabase.from("audit_logs").insert({
    action: "ALLOCATION_GENERATED",
    metadata: {
      matches_created: numMatches,
      bye_team_id: byeTeamId,
    }
  });

  return { success: true, message: "Secure allocation generated and locked successfully." };
}
