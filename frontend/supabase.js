import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://jyosypwmwrdvcolcswio.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Kzx6c74SYjrBwsTbD90anQ_CvfadDjZ";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

window.supabase = supabase;
window.supabaseClient = supabase;
