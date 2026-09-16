"use server";

import { createAdminClient } from "@/lib/supabase";
import crypto from "crypto";

// For fetching settings and teams to generate codes
export async function getSettingsPageData() {
  const supabase = createAdminClient();
  const { data: settings } = await supabase.from("event_settings").select("*").single();
  const { data: teams } = await supabase.from("teams").select("id, college_name, team_code").order("team_code");
  
  return { settings, teams: teams || [] };
}

// Generate new access code for a team
export async function generateTeamAccessCode(teamId: string) {
  const supabase = createAdminClient();
  
  // Generate a random 6-character alphanumeric code
  const code = crypto.randomBytes(3).toString("hex").toUpperCase();
  const hash = crypto.createHash("sha256").update(code).digest("hex");

  // Upsert the team_access record
  const { data: existing } = await supabase.from("team_access").select("id").eq("team_id", teamId).single();
  
  if (existing) {
    await supabase.from("team_access").update({ access_code_hash: hash, failed_attempts: 0, locked_until: null }).eq("id", existing.id);
  } else {
    await supabase.from("team_access").insert({ team_id: teamId, access_code_hash: hash });
  }

  // Log to audit
  await supabase.from("audit_logs").insert({
    action: "ACCESS_CODE_GENERATED",
    metadata: { team_id: teamId }
  });

  return { success: true, code };
}

export async function toggleSchedulePublished() {
  const supabase = createAdminClient();
  const { data: current } = await supabase.from("event_settings").select("schedule_published").single();
  
  const newState = !current?.schedule_published;
  
  await supabase.from("event_settings").update({ schedule_published: newState }).eq("id", 1);
  return { success: true, published: newState };
}

// Update release time
export async function updateReleaseTime(releaseTimeStr: string) {
  const supabase = createAdminClient();
  
  await supabase.from("event_settings").update({ release_time: releaseTimeStr }).eq("id", 1);
  
  await supabase.from("audit_logs").insert({
    action: "RELEASE_TIME_UPDATED",
    metadata: { new_time: releaseTimeStr }
  });

  return { success: true };
}

// Trigger Secure Case Allocation (Phase 7 logic manually triggered from admin)
import { allocateCases as runAllocationLogic } from "./allocation";

export async function triggerAllocation() {
  return await runAllocationLogic();
}
