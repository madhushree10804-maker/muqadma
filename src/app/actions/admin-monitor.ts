"use server";

import { createAdminClient } from "@/lib/supabase";

export async function getAdminRevealLogs() {
  const supabase = createAdminClient();

  const { data: logs, error } = await supabase
    .from("reveal_logs")
    .select(`
      id,
      verified_at,
      revealed_at,
      teams ( college_name, phone_number )
    `)
    .order("revealed_at", { ascending: false });

  if (error) {
    console.error("Error fetching reveal logs:", error);
    return [];
  }

  return logs;
}
