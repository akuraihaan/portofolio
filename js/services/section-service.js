import { supabase, supabaseConfiguration } from '../../supabase.js'
import { deletePublicImage, uploadPublicImage } from './storage-service.js'

export const SECTION_KEYS = ['hero', 'about', 'statistics', 'skills', 'services', 'featured_projects', 'projects', 'experiences', 'educations', 'certificates', 'articles', 'testimonials', 'contact', 'cta', 'process', 'footer']

function ensureReady() {
  if (!supabaseConfiguration.ready || !supabase) throw new Error('Supabase belum dikonfigurasi.')
}

function logSectionError(label, error) {
  console.error(label, { code: error?.code || null, message: error?.message || 'Unknown error', details: error?.details || null, hint: error?.hint || null })
}

export async function getAllSections() {
  ensureReady()
  const { data, error } = await supabase.from('page_sections').select('*').order('sort_order').order('section_name')
  if (error) { logSectionError('getAllSections failed', error); throw error }
  return data || []
}

export async function getSectionByKey(sectionKey) {
  ensureReady()
  const { data, error } = await supabase.from('page_sections').select('*').eq('section_key', sectionKey).maybeSingle()
  if (error) { logSectionError('getSectionByKey failed', error); throw error }
  return data || null
}

export async function createSection(payload) {
  ensureReady()
  const { data, error } = await supabase.from('page_sections').insert(payload).select('*').single()
  if (error) { logSectionError('createSection failed', error); throw error }
  return data
}

export async function updateSection(id, payload) {
  ensureReady()
  const { data, error } = await supabase.from('page_sections').update(payload).eq('id', id).select('*').single()
  if (error) { logSectionError('updateSection failed', error); throw error }
  return data
}

export async function updateSectionOrder(items) {
  ensureReady()
  const results = await Promise.all(items.map(item => supabase.from('page_sections').update({ sort_order: item.sort_order, updated_by: item.updated_by }).eq('id', item.id)))
  const error = results.map(result => result.error).find(Boolean)
  if (error) { logSectionError('updateSectionOrder failed', error); throw error }
}

export async function toggleSectionVisibility(id, isVisible, updatedBy) {
  return updateSection(id, { is_visible: Boolean(isVisible), updated_by: updatedBy })
}

export async function uploadSectionImage(file, { folder = 'sections', userId } = {}) {
  return uploadPublicImage({ file, folder, userId })
}

export async function removeSectionImage(path) {
  return deletePublicImage(path)
}
