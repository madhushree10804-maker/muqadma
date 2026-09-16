"use server";

import { createAdminClient } from "@/lib/supabase";

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function autoAllocateTeams() {
  const supabase = createAdminClient();

  // 1. Fetch active teams
  const { data: teams, error: teamsError } = await supabase
    .from("teams")
    .select("id")
    .eq("status", "ACTIVE");

  if (teamsError || !teams || teams.length === 0) {
    return { success: false, message: "No active teams found." };
  }

  // 2. Fetch active cases
  const { data: cases, error: casesError } = await supabase
    .from("cases")
    .select("id, case_number")
    .eq("active", true);

  if (casesError || !cases || cases.length === 0) {
    return { success: false, message: "No active cases found." };
  }

  // 3. Shuffle teams and cases
  const shuffledTeams = shuffleArray(teams);
  const shuffledCases = shuffleArray(cases);

  // 4. Wipe existing allocations
  await supabase.from("allocations").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const newAllocations = [];
  let courtNumber = 1;
  let teamIndex = 0;
  let caseIndex = 0;

  // 5. Generate allocations in pairs
  while (teamIndex < shuffledTeams.length) {
    const plaintiffTeam = shuffledTeams[teamIndex];
    const defendantTeam = shuffledTeams[teamIndex + 1]; // Might be undefined for the odd 11th team
    const assignedCase = shuffledCases[caseIndex % shuffledCases.length]; // Wrap around if not enough cases

    // The user requested that the Court Number exactly matches the Case Number
    const courtNumber = assignedCase.case_number;

    newAllocations.push({
      team_id: plaintiffTeam.id,
      case_id: assignedCase.id,
      side: "PLAINTIFF",
      court_number: courtNumber,
      allotted_time: "5 MINUTES",
      round: 1
    });

    if (defendantTeam) {
      newAllocations.push({
        team_id: defendantTeam.id,
        case_id: assignedCase.id,
        side: "DEFENDANT",
        court_number: courtNumber,
        allotted_time: "5 MINUTES",
        round: 1
      });
    }

    teamIndex += 2;
    caseIndex++;
  }

  // 6. Insert new allocations
  const { error: insertError } = await supabase.from("allocations").insert(newAllocations);

  if (insertError) {
    console.error("Error inserting allocations:", insertError);
    return { success: false, message: insertError.message };
  }

  // 7. Lock the allocations so the public schedule page displays them
  await supabase.from("event_settings").update({ allocations_locked: true }).eq("id", 1);

  const uniqueCourts = new Set(newAllocations.map(a => a.court_number)).size;

  return { 
    success: true, 
    message: `Successfully allocated ${shuffledTeams.length} teams across ${uniqueCourts} courts.` 
  };
}
