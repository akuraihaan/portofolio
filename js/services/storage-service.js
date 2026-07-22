import { supabase, supabaseConfiguration } from '../../supabase.js'
import { safeFileName } from '../utils.js'

export const PORTFOLIO_BUCKET = 'portfolio-public'
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function describeError(error, fallback = 'Operasi media gagal.') {
  return error?.message || error?.error_description || error?.details || fallback
}

function ensureStorageReady() {
  if (!supabaseConfiguration.ready || !supabase) throw new Error('Supabase belum dikonfigurasi.')
}

export function validateImageFile(file, { maxSize = MAX_IMAGE_SIZE, allowedTypes = ALLOWED_IMAGE_TYPES } = {}) {
  if (!file) throw new Error('Pilih file gambar terlebih dahulu.')
  if (!allowedTypes.includes(file.type)) throw new Error('Format gambar harus JPG, PNG, atau WebP.')
  const extension = String(file.name || '').split('.').pop().toLowerCase()
  const extensionTypes = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }
  if (extensionTypes[extension] && extensionTypes[extension] !== file.type) throw new Error('Ekstensi file tidak sesuai dengan MIME type gambar.')
  if (file.size > maxSize) throw new Error('Ukuran gambar maksimal ' + Math.round(maxSize / 1024 / 1024) + ' MB.')
  return file
}

export async function readImageDimensions(file) {
  validateImageFile(file)
  if (typeof createImageBitmap === 'function') {
    const bitmap = await createImageBitmap(file)
    const dimensions = { width: bitmap.width, height: bitmap.height }
    bitmap.close?.()
    return dimensions
  }
  if (typeof Image === 'undefined' || typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') return null
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => { URL.revokeObjectURL(objectUrl); resolve({ width: image.naturalWidth, height: image.naturalHeight }) }
    image.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Dimensi gambar tidak dapat dibaca.')) }
    image.src = objectUrl
  })
}

export async function validateImageDimensions(file, { minWidth = 1, minHeight = 1, aspectRatio = null, tolerance = 0.35 } = {}) {
  const dimensions = await readImageDimensions(file)
  if (!dimensions) return null
  if (dimensions.width < minWidth || dimensions.height < minHeight) throw new Error(`Gambar minimal berukuran ${minWidth}×${minHeight} piksel.`)
  if (aspectRatio && Math.abs((dimensions.width / dimensions.height) - aspectRatio) > tolerance) throw new Error('Rasio gambar tidak sesuai dengan kebutuhan field ini.')
  return dimensions
}

export function generateObjectPath(folder, fileName, userId = 'anonymous') {
  const cleanFolder = String(folder || 'general').replace(/[^a-zA-Z0-9/_-]+/g, '-').replace(/^\/+|\/+$/g, '')
  const cleanUser = String(userId || 'anonymous').replace(/[^a-zA-Z0-9_-]+/g, '-')
  const unique = globalThis.crypto?.randomUUID?.() || Date.now() + '-' + Math.random().toString(36).slice(2)
  return cleanFolder + '/' + cleanUser + '/' + unique + '-' + safeFileName(fileName)
}

export const createStoragePath = generateObjectPath

export async function uploadPublicImage({ file, folder = 'general', userId, maxSize, allowedTypes } = {}) {
  ensureStorageReady()
  validateImageFile(file, { maxSize, allowedTypes })
  const dimensions = await validateImageDimensions(file)
  const path = generateObjectPath(folder, file.name, userId)
  const { error: uploadError } = await supabase.storage.from(PORTFOLIO_BUCKET).upload(path, file, {
    cacheControl: '31536000',
    contentType: file.type,
    upsert: false
  })
  if (uploadError) throw new Error(describeError(uploadError, 'Gambar tidak dapat diupload.'))

  const { data } = supabase.storage.from(PORTFOLIO_BUCKET).getPublicUrl(path)
  if (!data?.publicUrl) {
    await deletePublicImage(path)
    throw new Error('URL publik gambar tidak tersedia.')
  }

  return { path, publicUrl: data.publicUrl, fileName: file.name, mimeType: file.type, sizeBytes: file.size, width: dimensions?.width || null, height: dimensions?.height || null }
}

export async function replacePublicImage({ file, folder = 'general', userId, previousPath = '', cleanupPrevious = false, maxSize, allowedTypes } = {}) {
  const uploaded = await uploadPublicImage({ file, folder, userId, maxSize, allowedTypes })
  if (cleanupPrevious && previousPath && previousPath !== uploaded.path) await deletePublicImage(previousPath)
  return uploaded
}

export async function saveMediaMetadata({ table = 'media_assets', record } = {}) {
  ensureStorageReady()
  if (!record || typeof record !== 'object') throw new Error('Metadata media tidak valid.')
  const { data, error } = await supabase.from(table).insert(record).select().single()
  if (error) throw new Error(describeError(error, 'Metadata media belum tersimpan.'))
  return data
}

export async function removeMediaMetadata({ table = 'media_assets', id } = {}) {
  ensureStorageReady()
  if (!id) return
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw new Error(describeError(error, 'Metadata media belum terhapus.'))
}

export async function deletePublicImage(path) {
  if (!path || !supabase) return
  const normalizedPath = String(path).replace(/^portfolio-public\//, '')
  const { error } = await supabase.storage.from(PORTFOLIO_BUCKET).remove([normalizedPath])
  if (error) console.warn('Gambar lama tidak dapat dihapus:', describeError(error))
}

export function getPublicImageUrl(pathOrUrl) {
  if (!pathOrUrl) return ''
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  if (!supabase) return ''
  return supabase.storage.from(PORTFOLIO_BUCKET).getPublicUrl(String(pathOrUrl).replace(/^portfolio-public\//, '')).data?.publicUrl || ''
}
