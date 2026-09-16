"use server";

import { createAdminClient } from "@/lib/supabase";
import crypto from "crypto";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export async function verifyTeam(college: string, phone: string, accessCode: string) {
  const supabase = createAdminClient();

  // 1. Hash the access code provided by user
  const accessCodeHash = crypto.createHash("sha256").update(accessCode).digest("hex");

  // 2. Find the team by college and phone (either member's phone)
  const { data: team, error: teamError } = await supabase
    .from("teams")
    .select("id")
    .eq("college_name", college)
    .or(`phone_number.eq.${phone},phone_number_2.eq.${phone}`)
    .maybeSingle();

  if (teamError) {
    return { success: false, message: `DATABASE ERROR: ${teamError.message}. Did you run supabase db reset?` };
  }
  if (!team) {
    // We don't reveal if team exists or not for security.
    return { success: false, message: "IDENTITY NOT VERIFIED. The Court Registry could not verify these details. Please check your institution, registered phone number and access code." };
  }

  // 3. Fetch team access record
  const { data: accessRecord, error: accessError } = await supabase
    .from("team_access")
    .select("*")
    .eq("team_id", team.id)
    .single();

  if (accessError || !accessRecord) {
    return { success: false, message: "IDENTITY NOT VERIFIED. Contact Registry." };
  }

  // 4. Check for lockout
  if (accessRecord.locked_until && new Date(accessRecord.locked_until) > new Date()) {
    return { success: false, message: "ACCOUNT TEMPORARILY LOCKED due to excessive failed attempts. Please try again later." };
  }

  // 5. Verify Hash
  if (accessRecord.access_code_hash !== accessCodeHash) {
    // Increment failed attempts
    const newAttempts = accessRecord.failed_attempts + 1;
    let lockedUntil = null;
    if (newAttempts >= MAX_FAILED_ATTEMPTS) {
      lockedUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000).toISOString();
    }
    await supabase.from("team_access").update({ 
      failed_attempts: newAttempts,
      locked_until: lockedUntil,
      last_verification: new Date().toISOString()
    }).eq("id", accessRecord.id);

    return { success: false, message: "IDENTITY NOT VERIFIED. The Court Registry could not verify these details." };
  }

  // 6. Success! Reset failed attempts
  await supabase.from("team_access").update({ 
    failed_attempts: 0,
    locked_until: null,
    last_verification: new Date().toISOString()
  }).eq("id", accessRecord.id);

  // Return a secure session token or simply return success so the client knows it's verified.
  // In a real production app we would use cookies/JWT here to maintain session.
  // For this architecture, we will return a temporary token that can be verified on subsequent requests.
  const sessionToken = crypto.randomBytes(32).toString("hex");
  
  // Optionally, store this session token in the DB or use JWT. 
  // Since we are maintaining simplicity, we'll return the team ID signed or just the ID for the next steps.
  // DO NOT trust client with plain team ID for subsequent secure calls without signature.
  const signature = crypto.createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY!).update(team.id).digest("hex");

  return { 
    success: true, 
    teamId: team.id,
    token: `${team.id}.${signature}`
  };
}

export async function getReleaseStatus() {
  const supabase = createAdminClient();
  const { data: settings } = await supabase.from("event_settings").select("release_time").single();
  
  if (!settings) return { releaseTime: new Date().toISOString(), serverTime: new Date().toISOString() };

  return {
    releaseTime: settings.release_time,
    serverTime: new Date().toISOString()
  };
}
