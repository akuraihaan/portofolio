import { escapeHtml } from '../utils.js'
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE, validateImageFile } from '../services/storage-service.js'

const ACCEPT = ALLOWED_IMAGE_TYPES.join(',')

export function renderImageUploader({ name, label = 'Gambar', existingUrl = '', required = false, help = 'JPG, PNG, atau WebP · maksimal 5 MB' } = {}) {
  const safeName = escapeHtml(name || 'image')
  const hasExisting = Boolean(existingUrl)
  const preview = hasExisting
    ? '<img src="' + escapeHtml(existingUrl) + '" alt="Preview ' + safeName + '" loading="lazy">'
    : ''
  return '<div class="admin-field admin-field-wide image-uploader" data-image-uploader="' + safeName + '" data-image-name="' + safeName + '">' +
    '<span>' + escapeHtml(label) + '</span>' +
    '<label class="image-uploader__dropzone" data-image-dropzone>' +
      '<input class="image-uploader__input" name="' + safeName + '" type="file" accept="' + ACCEPT + '"' + (required && !hasExisting ? ' required' : '') + '>' +
      '<span class="image-uploader__copy"><strong>Pilih gambar</strong><small>' + escapeHtml(help) + '</small></span>' +
      '<span class="image-uploader__preview" data-image-preview' + (hasExisting ? '' : ' hidden') + '>' + preview + '</span>' +
    '</label>' +
    '<button class="admin-secondary-button image-uploader__clear" type="button" data-image-clear' + (hasExisting ? '' : ' hidden') + '>Hapus pilihan</button>' +
    '<small class="image-uploader__filename" data-image-filename>' + (hasExisting ? 'Gambar tersimpan' : '') + '</small>' +
  '</div>'
}

export function bindImageUploader(root, { maxSize = MAX_IMAGE_SIZE, allowedTypes = ALLOWED_IMAGE_TYPES } = {}) {
  const container = typeof root === 'string' ? document.querySelector(root) : root
  if (!container) return null
  const input = container.querySelector('.image-uploader__input')
  const preview = container.querySelector('[data-image-preview]')
  const fileName = container.querySelector('[data-image-filename]')
  const clearButton = container.querySelector('[data-image-clear]')
  let selectedFile = null
  let objectUrl = ''

  const showPreview = file => {
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    objectUrl = URL.createObjectURL(file)
    preview.innerHTML = '<img src="' + objectUrl + '" alt="Preview ' + escapeHtml(file.name) + '">'
    preview.hidden = false
    fileName.textContent = file.name + ' · ' + Math.max(1, Math.round(file.size / 1024)) + ' KB'
    clearButton.hidden = false
    container.dataset.imageCleared = 'false'
  }
  const clear = () => {
    selectedFile = null
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    objectUrl = ''
    input.value = ''
    preview.innerHTML = ''
    preview.hidden = true
    fileName.textContent = ''
    clearButton.hidden = true
    input.setCustomValidity('')
    container.dataset.imageCleared = 'true'
  }
  const receive = file => {
    try {
      selectedFile = validateImageFile(file, { maxSize, allowedTypes })
      showPreview(selectedFile)
      input.setCustomValidity('')
    } catch (error) {
      clear()
      input.setCustomValidity(error.message)
      input.reportValidity()
    }
  }

  input?.addEventListener('change', () => receive(input.files?.[0]))
  clearButton?.addEventListener('click', clear)
  container.addEventListener('dragover', event => { event.preventDefault(); container.classList.add('is-dragging') })
  container.addEventListener('dragleave', () => container.classList.remove('is-dragging'))
  container.addEventListener('drop', event => {
    event.preventDefault()
    container.classList.remove('is-dragging')
    receive(event.dataTransfer?.files?.[0])
  })

  return { getFile: () => selectedFile, clear, destroy: () => { if (objectUrl) URL.revokeObjectURL(objectUrl) } }
}

export function bindImageUploaders(root = document) {
  return [...root.querySelectorAll('[data-image-uploader]')].map(container => ({
    name: container.dataset.imageName,
    controller: bindImageUploader(container)
  }))
}
