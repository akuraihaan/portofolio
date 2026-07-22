import { escapeHtml } from '../utils.js'
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE, readImageDimensions, validateImageFile } from '../services/storage-service.js'

const ACCEPT = ALLOWED_IMAGE_TYPES.join(',')

export function renderImageUploader({ name, label = 'Gambar', existingUrl = '', required = false, help = 'JPG, PNG, atau WebP · maksimal 5 MB' } = {}) {
  const safeName = escapeHtml(name || 'image')
  const hasExisting = Boolean(existingUrl)
  const preview = hasExisting
    ? '<img src="' + escapeHtml(existingUrl) + '" alt="Preview ' + safeName + '" loading="lazy" data-image-existing><span class="image-uploader__preview-fallback" hidden>Preview tidak tersedia</span>'
    : ''
  return '<div class="admin-field admin-field-wide image-uploader" data-image-uploader="' + safeName + '" data-image-name="' + safeName + '" data-image-has-existing="' + (hasExisting ? 'true' : 'false') + '">' +
    '<span>' + escapeHtml(label) + '</span>' +
    '<label class="image-uploader__dropzone" data-image-dropzone>' +
      '<input class="image-uploader__input" name="' + safeName + '" type="file" accept="' + ACCEPT + '"' + (required && !hasExisting ? ' required' : '') + '>' +
      '<span class="image-uploader__copy"><strong data-image-action>' + (hasExisting ? 'Ganti gambar' : 'Pilih gambar') + '</strong><small>Tarik file ke area ini atau pilih dari perangkat.</small><span class="image-uploader__state" data-image-state>' + (hasExisting ? 'Gambar tersimpan' : 'Belum ada gambar') + '</span><small>' + escapeHtml(help) + '</small></span>' +
      '<span class="image-uploader__preview" data-image-preview' + (hasExisting ? '' : ' hidden') + '>' + preview + '</span>' +
    '</label>' +
    '<button class="admin-secondary-button image-uploader__clear" type="button" data-image-clear' + (hasExisting ? '' : ' hidden') + '>' + (hasExisting ? 'Hapus gambar' : 'Hapus pilihan') + '</button>' +
    '<small class="image-uploader__filename" data-image-filename>' + (hasExisting ? 'Pilih file baru untuk mengganti gambar.' : '') + '</small>' +
    '<small class="image-uploader__meta" data-image-meta>' + (hasExisting ? 'Gambar saat ini' : '') + '</small>' +
  '</div>'
}

export function bindImageUploader(root, { maxSize = MAX_IMAGE_SIZE, allowedTypes = ALLOWED_IMAGE_TYPES } = {}) {
  const container = typeof root === 'string' ? document.querySelector(root) : root
  if (!container) return null
  if (container._imageUploaderController) return container._imageUploaderController
  const input = container.querySelector('.image-uploader__input')
  const preview = container.querySelector('[data-image-preview]')
  const fileName = container.querySelector('[data-image-filename]')
  const imageMeta = container.querySelector('[data-image-meta]')
  const clearButton = container.querySelector('[data-image-clear]')
  const actionLabel = container.querySelector('[data-image-action]')
  const stateLabel = container.querySelector('[data-image-state]')
  const hasExisting = container.dataset.imageHasExisting === 'true'
  const existingPreview = preview?.innerHTML || ''
  let selectedFile = null
  let objectUrl = ''

  const bindExistingPreview = () => {
    const existingImage = preview?.querySelector('[data-image-existing]')
    const fallback = preview?.querySelector('.image-uploader__preview-fallback')
    existingImage?.addEventListener('error', () => { existingImage.hidden = true; if (fallback) fallback.hidden = false }, { once: true })
  }
  bindExistingPreview()

  const showPreview = async file => {
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    objectUrl = URL.createObjectURL(file)
    preview.innerHTML = '<img src="' + objectUrl + '" alt="Preview ' + escapeHtml(file.name) + '">'
    preview.hidden = false
    container.classList.add('has-file')
    container.classList.remove('has-error')
    fileName.textContent = file.name + ' · ' + Math.max(1, Math.round(file.size / 1024)) + ' KB · belum disimpan'
    imageMeta.textContent = file.type + ' · membaca dimensi...'
    if (actionLabel) actionLabel.textContent = 'Gambar baru dipilih'
    if (stateLabel) stateLabel.textContent = hasExisting ? 'Akan menggantikan gambar tersimpan' : 'Siap disimpan'
    clearButton.textContent = hasExisting ? 'Batalkan penggantian' : 'Hapus pilihan'
    clearButton.hidden = false
    container.dataset.imageCleared = 'false'
    const dimensions = await readImageDimensions(file).catch(() => null)
    if (selectedFile === file) imageMeta.textContent = dimensions ? file.type + ' · ' + dimensions.width + ' × ' + dimensions.height + ' px' : file.type
  }
  const clear = () => {
    if (selectedFile && hasExisting) {
      selectedFile = null
      if (objectUrl) URL.revokeObjectURL(objectUrl)
      objectUrl = ''
      input.value = ''
      preview.innerHTML = existingPreview
      preview.hidden = !existingPreview
      bindExistingPreview()
      fileName.textContent = 'Pilih file baru untuk mengganti gambar.'
      imageMeta.textContent = hasExisting ? 'Gambar saat ini' : ''
      if (actionLabel) actionLabel.textContent = 'Ganti gambar'
      if (stateLabel) stateLabel.textContent = 'Gambar tersimpan'
      clearButton.textContent = 'Hapus gambar'
      clearButton.hidden = false
      input.setCustomValidity('')
      container.dataset.imageCleared = 'false'
      container.classList.remove('has-file', 'has-error')
      return
    }
    if (!selectedFile && hasExisting && container.dataset.imageCleared !== 'true') {
      input.value = ''
      preview.innerHTML = ''
      preview.hidden = true
      fileName.textContent = 'Gambar akan dihapus saat formulir disimpan.'
      imageMeta.textContent = 'Preview dihapus setelah penyimpanan.'
      if (actionLabel) actionLabel.textContent = 'Gambar dihapus'
      if (stateLabel) stateLabel.textContent = 'Penghapusan menunggu disimpan'
      clearButton.textContent = 'Batalkan penghapusan'
      clearButton.hidden = false
      input.setCustomValidity('')
      container.dataset.imageCleared = 'true'
      container.classList.remove('has-file', 'has-error')
      return
    }
    if (!selectedFile && hasExisting && container.dataset.imageCleared === 'true') {
      preview.innerHTML = existingPreview
      preview.hidden = !existingPreview
      bindExistingPreview()
      fileName.textContent = 'Pilih file baru untuk mengganti gambar.'
      imageMeta.textContent = 'Gambar saat ini'
      if (actionLabel) actionLabel.textContent = 'Ganti gambar'
      if (stateLabel) stateLabel.textContent = 'Gambar tersimpan'
      clearButton.textContent = 'Hapus gambar'
      container.dataset.imageCleared = 'false'
      container.classList.remove('has-file', 'has-error')
      return
    }
    selectedFile = null
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    objectUrl = ''
    input.value = ''
    preview.innerHTML = ''
    preview.hidden = true
    fileName.textContent = ''
    imageMeta.textContent = ''
    if (actionLabel) actionLabel.textContent = 'Pilih gambar'
    if (stateLabel) stateLabel.textContent = 'Belum ada gambar'
    clearButton.textContent = 'Hapus pilihan'
    clearButton.hidden = true
    input.setCustomValidity('')
    container.dataset.imageCleared = 'true'
    container.classList.remove('has-file', 'has-error')
  }
  const receive = file => {
    if (!file) return
    try {
      selectedFile = validateImageFile(file, { maxSize, allowedTypes })
      try {
        const transfer = new DataTransfer()
        transfer.items.add(selectedFile)
        input.files = transfer.files
      } catch {
        // Some browsers do not allow assigning a FileList; regular input changes still work.
      }
      showPreview(selectedFile)
      input.setCustomValidity('')
    } catch (error) {
      container.classList.add('has-error')
      if (hasExisting) {
        selectedFile = null
        input.value = ''
        preview.innerHTML = existingPreview
        preview.hidden = !existingPreview
        bindExistingPreview()
        fileName.textContent = 'Gambar tersimpan tetap digunakan.'
        imageMeta.textContent = 'Gambar saat ini'
        if (actionLabel) actionLabel.textContent = 'Ganti gambar'
        if (stateLabel) stateLabel.textContent = 'Gambar tersimpan'
        clearButton.textContent = 'Hapus gambar'
        clearButton.hidden = false
        container.dataset.imageCleared = 'false'
      } else {
        clear()
        container.classList.add('has-error')
      }
      input.setCustomValidity(error.message)
      input.reportValidity()
    }
  }

  input?.addEventListener('change', () => receive(input.files?.[0]))
  clearButton?.addEventListener('click', clear)
  container.addEventListener('dragover', event => { event.preventDefault(); container.classList.add('is-dragging') })
  container.addEventListener('dragleave', event => { if (!container.contains(event.relatedTarget)) container.classList.remove('is-dragging') })
  container.addEventListener('drop', event => {
    event.preventDefault()
    container.classList.remove('is-dragging')
    receive(event.dataTransfer?.files?.[0])
  })

  const destroy = () => {
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    objectUrl = ''
    container._imageUploaderController = null
    observer?.disconnect()
  }
  const observer = typeof MutationObserver === 'function'
    ? new MutationObserver(() => { if (!document.documentElement.contains(container)) destroy() })
    : null
  observer?.observe(document.body, { childList: true, subtree: true })
  const controller = { getFile: () => selectedFile, clear, destroy }
  container._imageUploaderController = controller
  return controller
}

export function bindImageUploaders(root = document) {
  return [...root.querySelectorAll('[data-image-uploader]')].map(container => ({
    name: container.dataset.imageName,
    controller: bindImageUploader(container)
  }))
}
