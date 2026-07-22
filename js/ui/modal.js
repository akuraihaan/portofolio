import { bindOnce, getFocusable, lockBodyScroll } from './jquery-ui.js'

const openerByModal = new WeakMap()

function focusTrap(dialog, event) {
  if (event.key !== 'Tab') return
  const focusable = getFocusable(dialog)
  if (!focusable.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

export function initializeModal(dialog) {
  if (!dialog || dialog.dataset.modalReady === 'true') return
  bindOnce(dialog, 'modalKeydown', 'keydown', event => focusTrap(dialog, event))
  bindOnce(dialog, 'modalEscape', 'keydown', event => {
    if (event.key !== 'Escape') return
    event.preventDefault()
    closeModal(dialog)
  })
  bindOnce(dialog, 'modalOverlay', 'click', event => {
    if (event.target === dialog) closeModal(dialog)
  })
  bindOnce(dialog, 'modalCloseButton', 'click', event => {
    if (event.target.closest('[data-dialog-close]')) closeModal(dialog)
  })
  bindOnce(dialog, 'modalNativeClose', 'close', () => {
    lockBodyScroll(false)
    openerByModal.get(dialog)?.focus?.()
  })
  dialog.dataset.modalReady = 'true'
}

export function openModal(dialog, opener = null) {
  if (!dialog) return
  initializeModal(dialog)
  openerByModal.set(dialog, opener || document.activeElement)
  lockBodyScroll(true)
  if (typeof dialog.showModal === 'function') dialog.showModal()
  else dialog.setAttribute('open', '')
  requestAnimationFrame(() => getFocusable(dialog)[0]?.focus())
}

export function closeModal(dialog) {
  if (!dialog) return
  if (typeof dialog.close === 'function' && dialog.open) dialog.close()
  else dialog.removeAttribute('open')
  lockBodyScroll(false)
}
