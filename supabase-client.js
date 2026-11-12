const SUPABASE_URL = "https://aywoghnxwamodjdwbsmq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_nJWP_bHMlKom8_mmyqPN6g_9M5Q4A6x";

if (!window.supabase?.createClient) {
  throw new Error("Supabase JS did not load. Check your internet connection.");
}

window.supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
);
