import "server-only";
import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client using the service role key, which bypasses
// RLS by design (docs/TRD.md §4.3 — the `leads` table has zero public
// policies, so this is the only access path). Never import this module
// from a Client Component; the `server-only` import above makes that a
// build-time error rather than an accidental runtime secret leak.
//
// Lazily constructed so a missing env var fails with a clear error at the
// point of use (inside the route handler's try/catch) rather than
// crashing module evaluation for the whole server.
export function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase is not configured: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
