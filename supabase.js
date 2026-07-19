import { createClient } from '@supabase/supabase-js'

const supabaseUrl = String(
  import.meta.env.VITE_SUPABASE_URL || ''
)
  .trim()
  .replace(/\/+$/, '')

const supabasePublishableKey = String(
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''
).trim()

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL belum tersedia.')
}

if (!supabasePublishableKey) {
  throw new Error(
    'VITE_SUPABASE_PUBLISHABLE_KEY belum tersedia.'
  )
}

if (
  supabaseUrl.includes('/rest/v1') ||
  supabaseUrl.includes('/auth/v1')
) {
  throw new Error(
    'VITE_SUPABASE_URL harus menggunakan base Project URL tanpa /rest/v1 atau /auth/v1.'
  )
}

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
)