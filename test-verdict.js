const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
  const { data: teams, error } = await supabase
    .from("teams")
    .select(`college_name, total_score, allocations(side)`)
    .order("total_score", { ascending: false });

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Teams:", JSON.stringify(teams, null, 2));
}

test();
