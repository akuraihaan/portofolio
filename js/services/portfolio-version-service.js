import { supabase, supabaseConfiguration } from '../../supabase.js'

export const PORTFOLIO_VERSION_COLUMNS = 'id,owner_id,title,slug,portfolio_type,description,language,theme,accent_color,selected_projects,selected_skills,selected_experiences,selected_educations,selected_certificates,selected_articles,section_order,visibility,expires_at,show_photo,show_contact,density,seo_title,meta_description,created_at,updated_at'

function unavailable(message = 'Supabase belum dikonfigurasi.') {
  return { ok: false, data: null, error: new Error(message) }
}

export async function getPublicPortfolioVersion(slug) {
  if (!supabaseConfiguration.ready || !supabase) return unavailable()
  const cleanSlug = String(slug || '').trim()
  if (!cleanSlug) return unavailable('Slug portfolio belum tersedia.')
  const { data, error } = await supabase
    .from('portfolio_versions')
    .select(PORTFOLIO_VERSION_COLUMNS)
    .eq('slug', cleanSlug)
    .eq('visibility', 'published')
    .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
    .maybeSingle()
  return error ? { ok: false, data: null, error } : { ok: true, data: data || null, error: null }
}

export async function getPortfolioVersionBySlug(slug, { ownerId = null, publishedOnly = false } = {}) {
  if (!supabaseConfiguration.ready || !supabase) return unavailable()
  const cleanSlug = String(slug || '').trim()
  if (!cleanSlug) return unavailable('Slug portfolio belum tersedia.')
  let query = supabase.from('portfolio_versions').select(PORTFOLIO_VERSION_COLUMNS).eq('slug', cleanSlug)
  if (ownerId) query = query.eq('owner_id', ownerId)
  if (publishedOnly) query = query.eq('visibility', 'published')
  const { data, error } = await query.maybeSingle()
  return error ? { ok: false, data: null, error } : { ok: true, data: data || null, error: null }
}

export async function getOwnedPortfolioVersions(ownerId) {
  if (!supabaseConfiguration.ready || !supabase) return unavailable()
  let query = supabase.from('portfolio_versions').select(PORTFOLIO_VERSION_COLUMNS).order('updated_at', { ascending: false })
  if (ownerId) query = query.eq('owner_id', ownerId)
  const { data, error } = await query
  return error ? { ok: false, data: [], error } : { ok: true, data: data || [], error: null }
}

export async function savePortfolioVersion(payload) {
  if (!supabaseConfiguration.ready || !supabase) return unavailable()
  const { data, error } = await supabase
    .from('portfolio_versions')
    .upsert(payload, { onConflict: 'slug' })
    .select(PORTFOLIO_VERSION_COLUMNS)
    .single()
  return error ? { ok: false, data: null, error } : { ok: true, data, error: null }
}
