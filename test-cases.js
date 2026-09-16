import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCases() {
  const { data, error, count } = await supabase.from('cases').select('*', { count: 'exact' });
  console.log("Total Cases in DB:", count);
  console.log("Cases:", data.map(c => ({ id: c.id, active: c.active })));
}

checkCases();
