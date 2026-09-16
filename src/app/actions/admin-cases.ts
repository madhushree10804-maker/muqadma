"use server";

import { createAdminClient } from "@/lib/supabase";
import crypto from "crypto";

export async function getAdminCases() {
  const supabase = createAdminClient();

  const { data: cases, error } = await supabase
    .from("cases")
    .select("*")
    .order("case_number", { ascending: true });

  if (error) {
    console.error("Error fetching cases:", error);
    return [];
  }

  const adminSignature = crypto.createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY!).update("ADMIN").digest("hex");
  const adminToken = `ADMIN.${adminSignature}`;

  return cases.map((c) => ({
    ...c,
    adminToken,
  }));
}

export async function addCase(formData: FormData) {
  const supabase = createAdminClient();
  
  const payload = {
    case_number: parseInt(formData.get("case_number") as string, 10),
    title: formData.get("title") as string,
    theme: formData.get("theme") as string,
    facts: formData.get("facts") as string,
    plaintiff: formData.get("plaintiff") as string,
    defendant: formData.get("defendant") as string,
    issues: formData.get("issues") as string,
  };

  const { error } = await supabase.from("cases").insert(payload);
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

export async function editCase(id: string, formData: FormData) {
  const supabase = createAdminClient();
  
  const payload = {
    case_number: parseInt(formData.get("case_number") as string, 10),
    title: formData.get("title") as string,
    theme: formData.get("theme") as string,
    facts: formData.get("facts") as string,
    plaintiff: formData.get("plaintiff") as string,
    defendant: formData.get("defendant") as string,
    issues: formData.get("issues") as string,
  };

  const { error } = await supabase.from("cases").update(payload).eq("id", id);
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

export async function deleteCase(id: string) {
  const supabase = createAdminClient();
  
  // Note: Depending on foreign key constraints, this might fail if a case is already allocated.
  // We assume CASCADE delete or that the admin knows what they are doing.
  const { error } = await supabase.from("cases").delete().eq("id", id);
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true };
}
