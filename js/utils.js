export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

export function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric'
  }).format(date)
}

export function slugify(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function parseSettingValue(value) {
  if (value === null || value === undefined) return ''
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

export function normalizeSettingValue(value) {
  if (typeof value !== 'string') return value
  try { return JSON.parse(value) } catch { return value }
}

export function showToast(message, type = 'success') {
  let toast = document.querySelector('[data-toast]')
  if (!toast) {
    toast = document.createElement('div')
    toast.className = 'toast'
    toast.setAttribute('data-toast', '')
    toast.setAttribute('role', 'status')
    toast.setAttribute('aria-live', 'polite')
    document.body.append(toast)
  }
  toast.textContent = message
  toast.dataset.type = type
  toast.classList.add('is-visible')
  window.clearTimeout(showToast.timer)
  showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 3200)
}

export function setBusy(button, busy, busyLabel = 'Memproses...') {
  if (!button) return
  if (busy) {
    button.dataset.defaultLabel = button.textContent
    button.disabled = true
    button.textContent = busyLabel
  } else {
    button.disabled = false
    button.textContent = button.dataset.defaultLabel || button.textContent
  }
}

export function renderError(message) {
  return `<div class="admin-inline-error" role="alert">${escapeHtml(message)}</div>`
}

export function getValue(form, name, type = 'text') {
  const field = form.elements[name]
  if (!field) return null
  if (type === 'boolean') return field.checked
  if (type === 'number') return field.value === '' ? null : Number(field.value)
  return field.value.trim()
}

export function safeFileName(fileName) {
  const cleaned = String(fileName ?? 'file')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
  return cleaned || 'file'
}
