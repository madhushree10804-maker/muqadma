"use server";

import { createAdminClient } from "@/lib/supabase";

export async function getPublicSchedule() {
  const supabase = createAdminClient();

  // 1. Check if the admin has explicitly published the schedule
  const { data: settings } = await supabase.from("event_settings").select("schedule_published").single();

  if (!settings?.schedule_published) {
    return { locked: false, courts: [] };
  }

  // 2. Fetch allocations with team and case details
  const { data: allocations, error } = await supabase
    .from("allocations")
    .select(`
      id,
      side,
      court_number,
      allotted_time,
      teams ( college_name, team_code ),
      cases ( case_number, title )
    `)
    .order("court_number", { ascending: true });

  if (error || !allocations) {
    return { locked: true, courts: [] };
  }

  // 3. Group by court number
  const courtsMap: Record<number, any> = {};

  allocations.forEach((alloc: any) => {
    const courtNum = alloc.court_number;
    if (!courtsMap[courtNum]) {
      courtsMap[courtNum] = {
        courtNumber: courtNum,
        time: alloc.allotted_time || "TBD",
        caseData: alloc.cases,
        plaintiff: null,
        defendant: null
      };
    }

    if (alloc.side === "PLAINTIFF") {
      courtsMap[courtNum].plaintiff = alloc.teams;
    } else if (alloc.side === "DEFENDANT") {
      courtsMap[courtNum].defendant = alloc.teams;
    }
  });

  return {
    locked: true,
    courts: Object.values(courtsMap)
  };
}
