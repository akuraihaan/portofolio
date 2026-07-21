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
  if (file.size > maxSize) throw new Error('Ukuran gambar maksimal ' + Math.round(maxSize / 1024 / 1024) + ' MB.')
  return file
}

export function createStoragePath(folder, fileName, userId = 'anonymous') {
  const cleanFolder = String(folder || 'general').replace(/[^a-zA-Z0-9/_-]+/g, '-').replace(/^\/+|\/+$/g, '')
  const cleanUser = String(userId || 'anonymous').replace(/[^a-zA-Z0-9_-]+/g, '-')
  return cleanFolder + '/' + cleanUser + '/' + crypto.randomUUID() + '-' + safeFileName(fileName)
}

export async function uploadPublicImage({ file, folder = 'general', userId, maxSize, allowedTypes } = {}) {
  ensureStorageReady()
  validateImageFile(file, { maxSize, allowedTypes })
  const path = createStoragePath(folder, file.name, userId)
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

  return { path, publicUrl: data.publicUrl, fileName: file.name, mimeType: file.type, sizeBytes: file.size }
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
