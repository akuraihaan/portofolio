import { supabase, supabaseConfiguration } from '../../supabase.js'

function ensureReady() {
  if (!supabaseConfiguration.ready || !supabase) throw new Error('Supabase belum dikonfigurasi.')
}

function logError(operation, error) {
  console.error(`Settings service ${operation} failed:`, {
    code: error?.code || null,
    message: error?.message || 'Unknown error',
    details: error?.details || null,
    hint: error?.hint || null
  })
}

export async function listSettings({ keys = null, group = null, columns = '*', orderBy = 'key', ascending = true, limit = null } = {}) {
  ensureReady()
  let query = supabase.from('site_settings').select(columns)
  if (Array.isArray(keys) && keys.length) query = query.in('key', keys)
  if (group) query = query.eq('group_name', group)
  query = query.order(orderBy, { ascending })
  if (limit) query = query.limit(limit)
  const result = await query
  if (result.error) logError('list', result.error)
  return result
}

export async function getSettingsByKeys(keys, options = {}) {
  return listSettings({ ...options, keys })
}

export async function saveSettings(rows, { onConflict = 'key' } = {}) {
  ensureReady()
  const result = await supabase.from('site_settings').upsert(rows, { onConflict })
  if (result.error) logError('save', result.error)
  return result
}

export async function updateSetting(id, payload) {
  ensureReady()
  const result = await supabase.from('site_settings').update(payload).eq('id', id)
  if (result.error) logError('update', result.error)
  return result
}

export async function createSetting(payload) {
  ensureReady()
  const result = await supabase.from('site_settings').insert(payload)
  if (result.error) logError('create', result.error)
  return result
}

export async function deleteSetting(id) {
  ensureReady()
  const result = await supabase.from('site_settings').delete().eq('id', id)
  if (result.error) logError('delete', result.error)
  return result
}

export async function deleteSettingByKey(key) {
  ensureReady()
  const result = await supabase.from('site_settings').delete().eq('key', key)
  if (result.error) logError('delete by key', result.error)
  return result
}
