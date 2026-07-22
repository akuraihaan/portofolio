import { debounce } from './jquery-ui.js'

export function applyProjectFilter({ category = 'all', search = '' } = {}) {
  const term = String(search).trim().toLowerCase()
  const cards = [...document.querySelectorAll('[data-project]')]
  let visibleCount = 0
  cards.forEach(card => {
    const haystack = [card.dataset.title, card.dataset.type, card.dataset.description, card.dataset.technologies]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    const visible = (category === 'all' || card.dataset.category === category) && (!term || haystack.includes(term))
    card.classList.toggle('is-hidden', !visible)
    card.setAttribute('aria-hidden', String(!visible))
    if (visible) visibleCount += 1
  })
  const count = document.querySelector('[data-project-count]')
  if (count) count.textContent = term || category !== 'all' ? `${visibleCount} proyek sesuai filter` : `${visibleCount} proyek dipublikasikan`
  return visibleCount
}

export function createProjectSearchHandler(callback) {
  return debounce(callback, 250)
}

