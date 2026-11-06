import { supabase, supabaseConfiguration } from '../../supabase.js'
import { CONTENT_TABLES, validateContentPayload } from '../content-schema.js'

function ensureReady() {
  if (!supabaseConfiguration.ready || !supabase) throw new Error('Supabase belum dikonfigurasi.')
}

function ensureTable(table) {
  if (!CONTENT_TABLES.includes(table)) throw new Error('Modul konten tidak diizinkan.')
}

function logError(operation, error) {
  console.error(`Content service ${operation} failed:`, {
    code: error?.code || null,
    message: error?.message || 'Unknown error',
    details: error?.details || null,
    hint: error?.hint || null
  })
}

export async function listContent(table, { columns = '*', orderBy = 'created_at', ascending = false, limit = 100, includeArchived = false } = {}) {
  ensureReady()
  ensureTable(table)
  let query = supabase.from(table).select(columns)
  if (!includeArchived && table !== 'social_links') query = query.neq('status', 'archived')
  const { data, error } = await query.order(orderBy, { ascending }).limit(limit)
  if (error) { logError(`list ${table}`, error); throw error }
  return data || []
}

export async function createContent(table, payload) {
  ensureReady()
  ensureTable(table)
  const validation = validateContentPayload(table, payload)
  if (!validation.ok) throw new Error(validation.errors.join(' '))
  const { data, error } = await supabase.from(table).insert(validation.data).select().single()
  if (error) { logError(`create ${table}`, error); throw error }
  return data
}

export async function updateContent(table, id, payload) {
  ensureReady()
  ensureTable(table)
  const validation = validateContentPayload(table, payload)
  if (!validation.ok) throw new Error(validation.errors.join(' '))
  const { data, error } = await supabase.from(table).update(validation.data).eq('id', id).select().single()
  if (error) { logError(`update ${table}`, error); throw error }
  return data
}

export async function deleteContent(table, id) {
  ensureReady()
  ensureTable(table)
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) { logError(`delete ${table}`, error); throw error }
}
