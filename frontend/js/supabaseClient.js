/**
 * Meenachi Grocery - Supabase Database & Auth Client
 */
import { supabase } from "./supabase.js";

export { supabase };
window.supabaseClient = supabase;
window.supabase = supabase;
console.log("🌿 Meenachi Grocery: Supabase client ready.");
