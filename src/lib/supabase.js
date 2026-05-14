import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("⚠️ Supabase credentials missing. Madventure is running in DEMO/MOCK mode.");
}

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseKey && supabaseUrl !== 'https://placeholder.supabase.co';

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder-key'
);
