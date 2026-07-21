import { supabase, supabaseConfiguration } from '../../supabase.js'
import { getPublishedEducations } from '../educations.js'
import { getPublicImageUrl } from './storage-service.js'
import { normalizeSettingValue } from '../utils.js'

const COUNT_TABLES = {
  projects: 'projects',
  skills: 'skills',
  experiences: 'experiences',
  certificates: 'certificates',
  articles: 'articles'
}

function unavailable(message = 'Supabase belum dikonfigurasi.') {
  return { ok: false, data: [], error: new Error(message) }
}

async function readPublicTable(table, configure = query => query) {
  if (!supabaseConfiguration.ready || !supabase) return unavailable()
  const result = await configure(supabase.from(table).select('*'))
  if (result.error) {
    console.error(`Konten ${table} tidak dapat dimuat:`, {
      code: result.error.code || null,
      message: result.error.message || 'Unknown Supabase error',
      details: result.error.details || null,
      hint: result.error.hint || null
    })
    return { ok: false, data: [], error: result.error }
  }
  return { ok: true, data: result.data || [], error: null }
}

function publishedQuery(query) {
  return query
    .eq('status', 'published')
    .or(`published_at.is.null,published_at.lte.${new Date().toISOString()}`)
    .order('sort_order', { ascending: true })
    .order('published_at', { ascending: false })
}

async function resolveAssetRows(rows = [], fields = []) {
  return Promise.all(rows.map(async row => {
    const resolved = { ...row }
    for (const field of fields) {
      const aliases = field === 'cover_url' ? ['cover_image_url'] : field === 'certificate_url' ? ['image_url'] : []
      const pathFields = field === 'cover_url' ? ['cover_path', 'thumbnail_path'] : field === 'certificate_url' ? ['certificate_path'] : [field.replace(/_url$/, '_path')]
      const source = [field, ...aliases].map(name => row[name]).find(Boolean) || pathFields.map(name => row[name]).find(Boolean)
      resolved[field] = source ? (await resolveAssetUrl(source)) : ''
    }
    return resolved
  }))
}

async function resolveAssetUrl(value) {
  if (!value || /^https?:\/\//i.test(value)) return value || ''
  return getPublicImageUrl(value)
}

export async function getSiteSettings() {
  const result = await readPublicTable('site_settings', query => query.eq('is_public', true).order('group_name').order('key'))
  return { ...result, data: Object.fromEntries(result.data.map(row => [row.key, normalizeSettingValue(row.value)])) }
}

export async function getVisibleSections() {
  return readPublicTable('page_sections', query => query.eq('is_visible', true).order('sort_order').order('section_name'))
}

export async function getNavigationItems() {
  return readPublicTable('navigation_items', query => query.eq('is_visible', true).order('sort_order').order('created_at'))
}

export async function getPublishedProjects() {
  const result = await readPublicTable('projects', publishedQuery)
  return { ...result, data: await resolveAssetRows(result.data, ['thumbnail_url', 'cover_url']) }
}

export async function getPublishedArticles() {
  const result = await readPublicTable('articles', publishedQuery)
  return { ...result, data: await resolveAssetRows(result.data, ['thumbnail_url']) }
}

export async function getPublishedSkills() {
  return readPublicTable('skills', publishedQuery)
}

export async function getPublishedExperiences() {
  const result = await readPublicTable('experiences', publishedQuery)
  return { ...result, data: await resolveAssetRows(result.data, ['logo_url']) }
}

export async function getPublishedEducationsData() {
  if (!supabaseConfiguration.ready || !supabase) return unavailable()
  try {
    return { ok: true, data: await getPublishedEducations(), error: null }
  } catch (error) {
    return { ok: false, data: [], error }
  }
}

export async function getPublishedCertificates() {
  const result = await readPublicTable('certificates', publishedQuery)
  return { ...result, data: await resolveAssetRows(result.data, ['certificate_url']) }
}

export async function getPublishedServices() {
  const result = await readPublicTable('services', publishedQuery)
  return { ...result, data: await resolveAssetRows(result.data, ['icon_url']) }
}

export async function getPublishedTestimonials() {
  const result = await readPublicTable('testimonials', publishedQuery)
  return { ...result, data: await resolveAssetRows(result.data, ['avatar_url']) }
}

export async function getSocialLinks() {
  return readPublicTable('social_links', query => query.eq('is_active', true).order('sort_order').order('created_at'))
}

async function getPublishedCount(table) {
  if (!supabaseConfiguration.ready || !supabase) return 0
  const { count, error } = await supabase.from(table).select('id', { count: 'exact', head: true }).eq('status', 'published')
  if (error) {
    console.error(`Statistik ${table} tidak dapat dihitung:`, { code: error.code, message: error.message })
    return 0
  }
  return count || 0
}

export async function getStatistics() {
  const manualResult = await readPublicTable('statistics', query => query.eq('is_visible', true).order('sort_order').order('created_at'))
  const counts = Object.fromEntries(await Promise.all(Object.entries(COUNT_TABLES).map(async ([key, table]) => [key, await getPublishedCount(table)])))
  const automatic = (manualResult.data || []).filter(item => item.source_type === 'count' && COUNT_TABLES[item.source_table]).map(item => ({ ...item, value: String(counts[item.source_table] ?? 0) }))
  const manual = (manualResult.data || []).filter(item => item.source_type !== 'count')
  return { ok: manualResult.ok, data: [...automatic, ...manual].sort((a, b) => a.sort_order - b.sort_order), counts, error: manualResult.error }
}

export async function getPublicContent() {
  const results = await Promise.allSettled([
    getSiteSettings(),
    readPublicTable('profiles', query => query.eq('is_active', true).limit(1)),
    getVisibleSections(),
    getNavigationItems(),
    getPublishedProjects(),
    getPublishedArticles(),
    getPublishedSkills(),
    getPublishedServices(),
    getPublishedEducationsData(),
    getPublishedExperiences(),
    getPublishedCertificates(),
    getPublishedTestimonials(),
    getSocialLinks(),
    getStatistics()
  ])
  const normalize = result => result.status === 'fulfilled' ? result.value : unavailable(result.reason?.message)
  const [settings, profile, sections, navigation, projects, articles, skills, services, educations, experiences, certificates, testimonials, socialLinks, statistics] = results.map(normalize)
  return { settings, profile: profile.data[0] || null, sections, navigation, projects, articles, skills, services, educations, experiences, certificates, testimonials, socialLinks, statistics }
}
