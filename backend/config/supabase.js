const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://ziodflzmifpsqhtgzkca.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppb2RmbHptaWZwc3FodGd6a2NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1MTA3MTYsImV4cCI6MjEwMTA4NjcxNn0._WhGcRV9RBBAz92EvfndY9FmMBuvLaoUNsjzozsmGo4";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;
