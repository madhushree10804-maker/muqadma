import { getAdminScheduleFull } from "@/app/actions/admin-schedule";
import { Gavel, Shield } from "lucide-react";
import DownloadScheduleButton from "@/components/DownloadScheduleButton";

export const dynamic = 'force-dynamic';
export default async function ScheduleRegistry() {
  const schedule = await getAdminScheduleFull();

  return (
    
}
