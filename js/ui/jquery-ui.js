/*
 * BWORIEY UI entry point.
 *
 * The repository does not ship jQuery, so this layer intentionally uses the
 * native DOM API while keeping the same responsibilities that used to be
 * scattered across small interaction snippets. The binding registry gives
 * each feature a namespace-like key and makes every initializer idempotent.
 */

const bindingRegistry = new WeakMap()

export const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

export function debounce(callback, delay = 250) {
  let timeoutId
  return function debounced(...args) {
    window.clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => callback.apply(this, args), delay)
  }
}

export function delegate(root, eventName, selector, handler, namespace = 'bworiey') {
  if (!root) return () => {}
  const key = `${eventName}.${namespace}.${selector}`
  const bindings = bindingRegistry.get(root) || new Map()
  const previous = bindings.get(key)
  if (previous) root.removeEventListener(eventName, previous)

  const listener = event => {
    const target = event.target?.closest?.(selector)
    if (!target || !root.contains(target)) return
    handler(event, target)
  }

  root.addEventListener(eventName, listener)
  bindings.set(key, listener)
  bindingRegistry.set(root, bindings)
  return () => {
    if (bindings.get(key) !== listener) return
    root.removeEventListener(eventName, listener)
    bindings.delete(key)
  }
}

export function bindOnce(element, key, eventName, handler, options) {
  if (!element) return () => {}
  const bindings = bindingRegistry.get(element) || new Map()
  const registryKey = `${eventName}.${key}`
  const previous = bindings.get(registryKey)
  if (previous) element.removeEventListener(eventName, previous, options)
  element.addEventListener(eventName, handler, options)
  bindings.set(registryKey, handler)
  bindingRegistry.set(element, bindings)
  return () => element.removeEventListener(eventName, handler, options)
}

export function lockBodyScroll(locked) {
  document.body.classList.toggle('is-scroll-locked', locked)
  document.body.dataset.scrollLocked = String(locked)
}

export function getFocusable(container) {
  if (!container) return []
  return [...container.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )]
}

