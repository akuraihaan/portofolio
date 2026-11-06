import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
export function credentials() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    "https://txsqhxhnamgteofarqfz.supabase.co";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    "sb_publishable_VJzrD1xlPgvCuMuNId2nyw_fJkd2zNf";
  return { url, key };
}
export async function sessionClient() {
  const { url, key } = credentials();
  const store = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (values) => {
        try {
          values.forEach(({ name, value, options }) =>
            store.set(name, value, options),
          );
        } catch {
          /* Server Components rely on proxy for refresh writes. */
        }
      },
    },
  });
}
export function publicClient() {
  const { url, key } = credentials();
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
}
