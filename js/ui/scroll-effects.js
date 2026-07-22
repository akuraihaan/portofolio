import { prefersReducedMotion } from './jquery-ui.js'

let revealObserver

export function initializeRevealAnimations(root = document) {
  const elements = root.querySelectorAll?.('[data-reveal]:not(.is-visible)') || []
  if (!elements.length) return
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    elements.forEach(element => element.classList.add('is-visible'))
    return
  }
  revealObserver ||= new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      const delay = entry.target.dataset.revealDelay
      if (delay) entry.target.style.setProperty('--reveal-delay', `${delay}ms`)
      entry.target.classList.add('is-visible')
      observer.unobserve(entry.target)
    })
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
  elements.forEach(element => revealObserver.observe(element))
}

