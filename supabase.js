import { createClient } from '@supabase/supabase-js'

const viteEnv = import.meta.env || {}
const runtimeConfig = globalThis.__PORTFOLIO_CONFIG__ || {}

const supabaseUrl = String(
  viteEnv.VITE_SUPABASE_URL || runtimeConfig.VITE_SUPABASE_URL || ''
)
  .trim()
  .replace(/\/+$/, '')

const supabasePublishableKey = String(
  viteEnv.VITE_SUPABASE_PUBLISHABLE_KEY || runtimeConfig.VITE_SUPABASE_PUBLISHABLE_KEY || ''
).trim()

export const supabaseProjectRef =
  supabaseUrl.replace(/^https:\/\//, '').split('.')[0] || null

const hasValidBaseUrl =
  Boolean(supabaseUrl) &&
  !supabaseUrl.includes('/rest/v1') &&
  !supabaseUrl.includes('/auth/v1')

export const supabaseConfiguration = {
  urlConfigured: Boolean(supabaseUrl),
  keyConfigured: Boolean(supabasePublishableKey),
  validBaseUrl: hasValidBaseUrl,
  ready: Boolean(
    hasValidBaseUrl &&
    supabasePublishableKey
  )
}

export const supabase = supabaseConfiguration.ready
  ? createClient(
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
  : null

if (viteEnv.DEV) {
  console.info('Supabase project', { projectRef: supabaseProjectRef })
}
