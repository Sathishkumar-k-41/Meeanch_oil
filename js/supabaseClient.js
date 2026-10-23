/**
 * Meenachi Grocery - Supabase Database & Auth Client
 * Connects the frontend to Supabase PostgreSQL and Authentication services.
 */

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://jyosypwmwrdvcolcswio.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Kzx6c74SYjrBwsTbD90anQ_CvfadDjZ";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

// Expose globally for vanilla scripts
window.supabaseClient = supabase;
console.log("🌿 Meenachi Grocery: Supabase client initialized successfully.");
