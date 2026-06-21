const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

let supabaseUrl = '';
let supabaseAnonKey = '';

try {
  const env = fs.readFileSync('.env.local', 'utf8');
  env.split(/\r?\n/).forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      if (key === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = val;
      if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') supabaseAnonKey = val;
    }
  });
} catch (e) {
  console.error("Could not read .env.local file");
  process.exit(1);
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  console.log("Connecting to:", supabaseUrl);
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*');
    
  if (error) {
    console.error("Error fetching profiles:", error.message);
  } else {
    console.log("Profiles in database:", data);
  }
}

check();
