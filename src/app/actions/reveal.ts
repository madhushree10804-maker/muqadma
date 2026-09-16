"use server";

import { createAdminClient } from "@/lib/supabase";
import crypto from "crypto";

export async function fetchTeamAllocation(token: string) {
  const supabase = createAdminClient();

  // 1. Verify token signature
  const [teamId, signature] = token.split(".");
  if (!teamId || !signature) {
    return { success: false, message: "Invalid session token." };
  }

  const expectedSignature = crypto.createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY!).update(teamId).digest("hex");
  if (signature !== expectedSignature) {
    return { success: false, message: "Session tampered or expired." };
  }

  // 2. Fetch Allocation (do NOT fetch opponent details)
  const { data: allocation, error } = await supabase
    .from("allocations")
    .select(`
      side,
      court_number,
      allotted_time,
      cases (
        case_number,
        title,
        pdf_url
      )
    `)
    .eq("team_id", teamId)
    .single();

  if (error || !allocation) {
    return { success: false, message: "No allocation found for your team. The Court Registry may still be finalizing the assignments." };
  }

  // 3. Log the Reveal
  await supabase.from("reveal_logs").insert({
    team_id: teamId,
    verified_at: new Date().toISOString(),
    revealed_at: new Date().toISOString(),
    last_activity: new Date().toISOString()
  });

  const allocData: any = allocation;

  return {
    success: true,
    allocation: {
      side: allocData.side,
      courtNumber: allocData.court_number,
      allottedTime: allocData.allotted_time || "5 MINUTES",
      caseNumber: allocData.cases?.case_number || (Array.isArray(allocData.cases) ? allocData.cases[0]?.case_number : null),
      caseTitle: allocData.cases?.title || (Array.isArray(allocData.cases) ? allocData.cases[0]?.title : null),
      pdfUrl: allocData.cases?.pdf_url || (Array.isArray(allocData.cases) ? allocData.cases[0]?.pdf_url : null)
    }
  };
}
