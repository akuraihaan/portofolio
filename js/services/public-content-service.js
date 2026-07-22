import { supabase, supabaseConfiguration } from '../../supabase.js'
import { getPublishedEducations } from '../educations.js'
import { getPublicImageUrl } from './storage-service.js'
import { normalizeSettingValue } from '../utils.js'

export const PROFILE_COLUMNS = 'id,full_name,username,avatar_url,avatar_path,phone,bio,is_active,last_login_at,created_at,updated_at'
export const PROJECT_COLUMNS = 'id,title,slug,category,summary,description,thumbnail_url,thumbnail_path,cover_url,cover_image_url,cover_path,project_url,repository_url,technologies,start_date,completion_date,status,sort_order,is_featured,created_at,updated_at,published_at'
export const PROJECT_MEDIA_COLUMNS = 'id,project_id,media_url,media_path,alt_text,caption,sort_order,created_at'
export const ARTICLE_COLUMNS = 'id,title,slug,category,excerpt,content,thumbnail_url,thumbnail_path,cover_image_url,cover_path,tags,reading_time,status,sort_order,is_featured,created_at,updated_at,published_at'
export const SKILL_COLUMNS = 'id,name,category,description,level,status,sort_order,created_at,updated_at,published_at'
export const EXPERIENCE_COLUMNS = 'id,company,role_title,description,location,start_date,end_date,is_current,logo_url,logo_path,status,sort_order,created_at,updated_at,published_at'
export const EDUCATION_COLUMNS = 'id,institution,degree,field_of_study,location,description,start_date,end_date,is_current,logo_url,logo_path,sort_order,is_featured,status,created_at,updated_at,published_at'
export const CERTIFICATE_COLUMNS = 'id,title,issuer,issue_date,credential_url,credential_id,expiry_date,certificate_url,certificate_path,image_url,status,sort_order,created_at,updated_at,published_at'
export const SERVICE_COLUMNS = 'id,title,slug,description,icon,icon_url,icon_path,features,price_label,cta_label,cta_url,status,sort_order,is_featured,created_at,updated_at,published_at'
export const TESTIMONIAL_COLUMNS = 'id,author_name,author_role,company,quote,avatar_url,avatar_path,rating,status,sort_order,is_featured,created_at,updated_at,published_at'
export const SOCIAL_LINK_COLUMNS = 'id,platform,label,url,username,icon,is_active,open_in_new_tab,show_in_hero,show_in_contact,show_in_footer,sort_order,created_at,updated_at'
export const SITE_SETTING_COLUMNS = 'id,group_name,key,value,is_public,is_translatable,description,resume_url,resume_path,logo_url,logo_path,asset_url,asset_path,hero_image_url,hero_image_path,favicon_url,favicon_path,og_image_url,og_image_path,created_at,updated_at'
export const SECTION_COLUMNS = 'id,section_key,section_name,eyebrow,title,subtitle,description,badge_text,primary_button_label,primary_button_url,secondary_button_label,secondary_button_url,image_url,image_path,background_image_url,background_image_path,layout_variant,content_alignment,is_visible,sort_order,custom_data,created_at,updated_at'
export const NAVIGATION_COLUMNS = 'id,label,href,section_key,icon,target,is_visible,sort_order,created_at,updated_at'
export const STATISTICS_COLUMNS = 'id,label,value,suffix,icon,source_type,source_table,source_filter,is_visible,sort_order,created_at,updated_at'

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

async function readPublicTable(table, configure = query => query, columns = '*') {
  if (!supabaseConfiguration.ready || !supabase) return unavailable()
  const result = await configure(supabase.from(table).select(columns))
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
  const result = await readPublicTable('site_settings', query => query.eq('is_public', true).order('group_name').order('key'), SITE_SETTING_COLUMNS)
  const assetFields = { hero_image: ['hero_image_url', 'hero_image_path'], site_logo: ['logo_url', 'logo_path'], site_favicon: ['favicon_url', 'favicon_path'], og_image: ['og_image_url', 'og_image_path'] }
  const entries = await Promise.all(result.data.map(async row => {
    const value = normalizeSettingValue(row.value)
    const fields = assetFields[row.key]
    if (!fields) return [row.key, value]
    const source = row[fields[0]] || row[fields[1]] || value
    return [row.key, source ? await resolveAssetUrl(source) : '']
  }))
  return { ...result, data: Object.fromEntries(entries) }
}

export async function getVisibleSections() {
  const result = await readPublicTable('page_sections', query => query.eq('is_visible', true).order('sort_order').order('section_name'), SECTION_COLUMNS)
  return { ...result, data: await resolveAssetRows(result.data, ['image_url', 'background_image_url']) }
}

export async function getNavigationItems() {
  return readPublicTable('navigation_items', query => query.eq('is_visible', true).order('sort_order').order('created_at'), NAVIGATION_COLUMNS)
}

export async function getPublishedProjects() {
  const result = await readPublicTable('projects', publishedQuery, PROJECT_COLUMNS)
  return { ...result, data: await resolveAssetRows(result.data, ['thumbnail_url', 'cover_url']) }
}

export async function getPublishedProjectMedia(projects = []) {
  const projectIds = projects.map(project => project.id).filter(Boolean)
  if (!projectIds.length) return { ok: true, data: [], error: null }
  const result = await readPublicTable('project_media', query => query
    .in('project_id', projectIds)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true }), PROJECT_MEDIA_COLUMNS)
  return { ...result, data: await resolveAssetRows(result.data, ['media_url']) }
}

export async function getPublishedArticles() {
  const result = await readPublicTable('articles', publishedQuery, ARTICLE_COLUMNS)
  return { ...result, data: await resolveAssetRows(result.data, ['thumbnail_url']) }
}

export async function getPublishedSkills() {
  return readPublicTable('skills', publishedQuery, SKILL_COLUMNS)
}

export async function getPublishedExperiences() {
  const result = await readPublicTable('experiences', publishedQuery, EXPERIENCE_COLUMNS)
  return { ...result, data: await resolveAssetRows(result.data, ['logo_url']) }
}

export async function getPublishedEducationsData() {
  if (!supabaseConfiguration.ready || !supabase) return unavailable()
  try {
    return { ok: true, data: await resolveAssetRows(await getPublishedEducations(), ['logo_url']), error: null }
  } catch (error) {
    return { ok: false, data: [], error }
  }
}

export async function getPublishedCertificates() {
  const result = await readPublicTable('certificates', publishedQuery, CERTIFICATE_COLUMNS)
  return { ...result, data: await resolveAssetRows(result.data, ['certificate_url']) }
}

export async function getPublishedServices() {
  const result = await readPublicTable('services', publishedQuery, SERVICE_COLUMNS)
  return { ...result, data: await resolveAssetRows(result.data, ['icon_url']) }
}

export async function getPublishedTestimonials() {
  const result = await readPublicTable('testimonials', publishedQuery, TESTIMONIAL_COLUMNS)
  return { ...result, data: await resolveAssetRows(result.data, ['avatar_url']) }
}

export async function getSocialLinks() {
  return readPublicTable('social_links', query => query.eq('is_active', true).order('sort_order').order('created_at'), SOCIAL_LINK_COLUMNS)
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
  const manualResult = await readPublicTable('statistics', query => query.eq('is_visible', true).order('sort_order').order('created_at'), STATISTICS_COLUMNS)
  const counts = Object.fromEntries(await Promise.all(Object.entries(COUNT_TABLES).map(async ([key, table]) => [key, await getPublishedCount(table)])))
  const automatic = (manualResult.data || []).filter(item => item.source_type === 'count' && COUNT_TABLES[item.source_table]).map(item => ({ ...item, value: String(counts[item.source_table] ?? 0) }))
  const manual = (manualResult.data || []).filter(item => item.source_type !== 'count')
  return { ok: manualResult.ok, data: [...automatic, ...manual].sort((a, b) => a.sort_order - b.sort_order), counts, error: manualResult.error }
}

export async function getPublicContent() {
  const baseResults = await Promise.allSettled([
    getSiteSettings(),
    readPublicTable('profiles', query => query.eq('is_active', true).limit(1), PROFILE_COLUMNS),
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
  const [settings, profile, sections, navigation, projects, articles, skills, services, educations, experiences, certificates, testimonials, socialLinks, statistics] = baseResults.map(normalize)
  const projectMedia = await getPublishedProjectMedia(projects.data)
  const profileData = await resolveAssetRows(profile.data, ['avatar_url'])
  return { settings, profile: profileData[0] || null, sections, navigation, projects, projectMedia, articles, skills, services, educations, experiences, certificates, testimonials, socialLinks, statistics }
}
