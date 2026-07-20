import { supabase, supabaseConfiguration } from '../supabase.js'

export const EDUCATION_COLUMNS = [
  'id',
  'institution',
  'degree',
  'field_of_study',
  'location',
  'description',
  'start_date',
  'end_date',
  'is_current',
  'logo_url',
  'sort_order',
  'is_featured',
  'status',
  'published_at',
  'created_at',
  'updated_at'
].join(', ')

function logEducationError(label, error) {
  console.error(label, {
    code: error?.code || null,
    message: error?.message || 'Unknown Supabase error',
    details: error?.details || null,
    hint: error?.hint || null
  })
}

function ensureReady() {
  if (!supabaseConfiguration.ready || !supabase) {
    throw new Error('Supabase belum dikonfigurasi.')
  }
}

function normalizeEducationPayload(payload = {}) {
  const institution = String(payload.institution || '').trim()
  if (!institution) throw new Error('Institusi pendidikan wajib diisi.')

  const status = payload.status || 'draft'
  const isCurrent = Boolean(payload.is_current)
  const publishedAt = status === 'published'
    ? payload.published_at || new Date().toISOString()
    : null

  const normalized = {
    institution,
    degree: payload.degree ? String(payload.degree).trim() : null,
    field_of_study: payload.field_of_study ? String(payload.field_of_study).trim() : null,
    location: payload.location ? String(payload.location).trim() : null,
    description: payload.description ? String(payload.description).trim() : null,
    start_date: payload.start_date || null,
    end_date: isCurrent ? null : (payload.end_date || null),
    is_current: isCurrent,
    logo_url: payload.logo_url ? String(payload.logo_url).trim() : null,
    sort_order: Number.isFinite(Number(payload.sort_order)) ? Number(payload.sort_order) : 0,
    is_featured: Boolean(payload.is_featured),
    status,
    published_at: publishedAt
  }

  if (payload.created_by) normalized.created_by = payload.created_by
  if (payload.updated_by) normalized.updated_by = payload.updated_by
  return normalized
}

export async function getPublishedEducations() {
  ensureReady()
  const { data, error } = await supabase
    .from('educations')
    .select(EDUCATION_COLUMNS)
    .eq('status', 'published')
    .or(`published_at.is.null,published_at.lte.${new Date().toISOString()}`)
    .order('sort_order', { ascending: true })
    .order('start_date', { ascending: false })

  if (error) {
    logEducationError('getPublishedEducations failed:', error)
    throw error
  }

  return data || []
}

export async function getAdminEducations() {
  ensureReady()
  const { data, error } = await supabase
    .from('educations')
    .select(EDUCATION_COLUMNS)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    logEducationError('getAdminEducations failed:', error)
    throw error
  }

  return data || []
}

export async function getEducationById(id) {
  ensureReady()
  const { data, error } = await supabase
    .from('educations')
    .select(EDUCATION_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    logEducationError('getEducationById failed:', error)
    throw error
  }

  return data || null
}

export async function createEducation(payload) {
  ensureReady()
  const { data, error } = await supabase
    .from('educations')
    .insert(normalizeEducationPayload(payload))
    .select(EDUCATION_COLUMNS)
    .single()

  if (error) {
    logEducationError('createEducation failed:', error)
    throw error
  }

  return data
}

export async function updateEducation(id, payload) {
  ensureReady()
  const { data, error } = await supabase
    .from('educations')
    .update(normalizeEducationPayload(payload))
    .eq('id', id)
    .select(EDUCATION_COLUMNS)
    .single()

  if (error) {
    logEducationError('updateEducation failed:', error)
    throw error
  }

  return data
}

export async function deleteEducation(id) {
  ensureReady()
  const { error } = await supabase
    .from('educations')
    .delete()
    .eq('id', id)

  if (error) {
    logEducationError('deleteEducation failed:', error)
    throw error
  }
}
