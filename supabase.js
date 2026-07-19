import { createClient } from '@supabase/supabase-js'

const supabaseUrl = String(
  import.meta.env.VITE_SUPABASE_URL || ''
).trim()

const supabasePublishableKey = String(
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''
).trim()

export const supabaseConfiguration = {
  urlConfigured: Boolean(supabaseUrl),
  keyConfigured: Boolean(supabasePublishableKey),
  ready: Boolean(supabaseUrl && supabasePublishableKey)
}

console.info('Supabase environment status', JSON.stringify({
  mode: import.meta.env.MODE,
  production: import.meta.env.PROD,
  urlConfigured: supabaseConfiguration.urlConfigured,
  keyConfigured: supabaseConfiguration.keyConfigured
}))

export const supabase = supabaseConfiguration.ready
  ? createClient(supabaseUrl, supabasePublishableKey, {
      db: { schema: 'public' },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null
