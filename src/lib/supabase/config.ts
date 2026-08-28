/**
 * True once the public Supabase env vars are present. `@supabase/ssr` throws
 * synchronously when they're missing, and since proxy.ts creates a Supabase
 * client on nearly every request, an unconfigured deployment would otherwise
 * 500 on every page (including static ones) instead of just the pages that
 * actually need data. Callers use this to degrade gracefully instead.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
