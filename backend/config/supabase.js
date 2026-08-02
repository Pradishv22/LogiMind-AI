const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY must be configured.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;
