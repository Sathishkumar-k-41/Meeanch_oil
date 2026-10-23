import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || "https://jyosypwmwrdvcolcswio.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "sb_publishable_Kzx6c74SYjrBwsTbD90anQ_CvfadDjZ";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ CRITICAL: SUPABASE_URL or SUPABASE_KEY missing in environment!");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
console.log("🌿 Supabase Client initialized for backend ->", SUPABASE_URL);
