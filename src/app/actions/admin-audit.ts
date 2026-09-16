"use server";

import { createAdminClient } from "@/lib/supabase";

export async function getAdminAuditLogs() {
  const supabase = createAdminClient();

  const { data: logs, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("timestamp", { ascending: false });

  if (error) {
    console.error("Error fetching audit logs:", error);
    return [];
  }

  return logs;
}
