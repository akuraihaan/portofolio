export const CONTENT_STATUSES = Object.freeze(['draft', 'published', 'hidden', 'archived'])

export const CONTENT_TABLES = Object.freeze([
  'projects',
  'articles',
  'skills',
  'experiences',
  'educations',
  'certificates',
  'achievements',
  'services',
  'testimonials',
  'social_links'
])

const REQUIRED_FIELDS = Object.freeze({
  projects: ['title', 'slug'],
  articles: ['title', 'slug', 'content'],
  skills: ['name'],
  experiences: ['company', 'role_title'],
  educations: ['institution'],
  certificates: ['title'],
  achievements: ['title'],
  services: ['title', 'slug'],
  testimonials: ['author_name', 'quote'],
  social_links: ['platform', 'label', 'url']
})

const SLUG_TABLES = new Set(['projects', 'articles', 'services'])
const URL_FIELDS = new Set(['url', 'project_url', 'repository_url', 'figma_url', 'documentation_url', 'video_url', 'organization_url', 'credential_url', 'link_url', 'thumbnail_url', 'cover_url', 'certificate_url', 'file_url', 'document_url', 'logo_url', 'icon_url', 'avatar_url'])
const DATE_FIELDS = new Set(['start_date', 'end_date', 'completion_date', 'published_at', 'issue_date', 'expiry_date', 'achievement_date'])

export function normalizeContentStatus(value, fallback = 'draft') {
  const status = String(value || '').trim().toLowerCase()
  return CONTENT_STATUSES.includes(status) ? status : fallback
}

export function validateContentPayload(table, payload = {}) {
  const errors = []
  if (!CONTENT_TABLES.includes(table)) errors.push('Modul konten tidak dikenal.')
  for (const field of REQUIRED_FIELDS[table] || []) {
    if (!String(payload[field] ?? '').trim()) errors.push(field + ' wajib diisi.')
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'status') && !CONTENT_STATUSES.includes(payload.status)) {
    errors.push('Status konten tidak valid.')
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'sort_order') && payload.sort_order !== null && (!Number.isInteger(payload.sort_order) || payload.sort_order < 0)) {
    errors.push('Urutan harus berupa angka nol atau lebih.')
  }
  if (SLUG_TABLES.has(table) && payload.slug && !/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/.test(String(payload.slug))) errors.push('Slug hanya boleh berisi huruf, angka, dan tanda hubung.')
  for (const [field, value] of Object.entries(payload)) {
    if (value === null || value === undefined || value === '') continue
    if (URL_FIELDS.has(field)) {
      try {
        const url = new URL(String(value), 'https://portfolio.invalid')
        if (!['http:', 'https:', 'mailto:'].includes(url.protocol)) errors.push(field + ' harus berupa URL yang valid.')
      } catch { errors.push(field + ' harus berupa URL yang valid.') }
    }
    if (DATE_FIELDS.has(field) && Number.isNaN(Date.parse(String(value)))) errors.push(field + ' harus berupa tanggal yang valid.')
    if (typeof value === 'string' && value.length > 10000) errors.push(field + ' terlalu panjang.')
  }
  return { ok: errors.length === 0, errors, data: { ...payload } }
}
