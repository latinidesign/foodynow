/**
 * Supabase client (Pages compatibility)
 */
import { createClient } from "@supabase/supabase-js";

/** @type {string | undefined} */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
/** @type {string | undefined} */
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is required.");
}
if (!supabaseAnonKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY is required."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
