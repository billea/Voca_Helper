import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // Intentionally do not throw here to keep build working; callers should handle null.
}

export function getSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true } });
}

export function getSupabaseWithToken(token?: string | null) {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return createClient(supabaseUrl, supabaseAnonKey, { global: { headers }, auth: { persistSession: false } });
}
