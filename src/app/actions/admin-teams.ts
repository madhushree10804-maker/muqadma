"use server";

import { createAdminClient } from "@/lib/supabase";
import crypto from "crypto";

export async function getAdminTeams() {
  const supabase = createAdminClient();

  const { data: teams, error } = await supabase
    .from("teams")
    .select(`
      *,
      team_access (
        failed_attempts,
        locked_until,
        last_verification
      )
    `)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching teams:", error);
    return [];
  }

  return teams;
}

export async function generateAllAccessCodes() {
  const supabase = createAdminClient();
  
  // 1. Fetch all teams
  const { data: teams } = await supabase.from("teams").select("id, college_name, phone_number");
  if (!teams || teams.length === 0) return { success: false, message: "No teams found." };

  const results: any[] = [];
  const inserts: any[] = [];

  // 2. Generate codes
  for (const team of teams) {
    // Generate a random 6 character code, e.g. "A8X2B9"
    const clearTextCode = crypto.randomBytes(3).toString("hex").toUpperCase();
    
    // Hash it for DB
    const accessCodeHash = crypto.createHash("sha256").update(clearTextCode).digest("hex");

    inserts.push({
      team_id: team.id,
      access_code_hash: accessCodeHash,
      active: true,
      failed_attempts: 0,
      locked_until: null,
      last_verification: null
    });

    results.push({
      college_name: team.college_name,
      phone_number: team.phone_number,
      access_code: clearTextCode
    });
  }

  // 3. Clear existing access codes (because we are regenerating all)
  await supabase.from("team_access").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  // 4. Insert new access codes
  const { error } = await supabase.from("team_access").insert(inserts);
  
  if (error) {
    console.error("Insert error:", error);
    return { success: false, message: error.message };
  }

  return { success: true, codes: results };
}

export async function createAdminTeam(data: any) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("teams").insert(data);
  if (error) return { success: false, message: error.message };
  return { success: true };
}

export async function updateAdminTeam(id: string, data: any) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("teams").update(data).eq("id", id);
  if (error) return { success: false, message: error.message };
  return { success: true };
}

export async function deleteAdminTeam(id: string) {
  const supabase = createAdminClient();

  // Wipe allocations first due to foreign key constraints
  await supabase.from("allocations").delete().eq("team_id", id);
  
  // Wipe team access codes
  await supabase.from("team_access").delete().eq("team_id", id);

  // Note: Matches table has team_a and team_b, but for now we only support pre-match deletion
  // If a match exists, this delete might still fail unless we delete the match too, but typically teams are deleted before match gen.
  const { error } = await supabase.from("teams").delete().eq("id", id);
  
  if (error) return { success: false, message: error.message };
  return { success: true };
}
