import { prefersReducedMotion } from './jquery-ui.js'

export function initializeWorldInteractions() {
  const root = document.documentElement
  if (root.dataset.worldInteractionsReady === 'true') return
  root.dataset.worldInteractionsReady = 'true'

  const reducedMotion = prefersReducedMotion()
  const finePointer = window.matchMedia?.('(pointer: fine)').matches
  const progress = document.querySelector('[data-scroll-progress]')
  let scrollFrame = 0
  let pointerFrame = 0
  let pointerEvent = null
  let activeCard = null
  let activeControl = null

  const resetCard = () => {
    if (!activeCard) return
    activeCard.classList.remove('is-pointer-active')
    activeCard.style.removeProperty('--tilt-x')
    activeCard.style.removeProperty('--tilt-y')
    activeCard = null
  }

  const resetControl = () => {
    if (!activeControl) return
    activeControl.style.removeProperty('--mag-x')
    activeControl.style.removeProperty('--mag-y')
    activeControl.classList.remove('is-magnetic-active')
    activeControl = null
  }

  const updateScroll = () => {
    scrollFrame = 0
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    const value = Math.min(1, Math.max(0, window.scrollY / maxScroll))
    root.style.setProperty('--scroll-progress', String(Math.round(value * 100)) + '%')
    if (progress) progress.setAttribute('aria-valuenow', String(Math.round(value * 100)))
  }

  const scheduleScroll = () => {
    if (scrollFrame) return
    scrollFrame = window.requestAnimationFrame(updateScroll)
  }

  window.addEventListener('scroll', scheduleScroll, { passive: true })
  window.addEventListener('resize', scheduleScroll, { passive: true })
  scheduleScroll()

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('is-in-view', entry.isIntersecting))
    }, { threshold: 0.16 })
    document.querySelectorAll('main section.section-shell').forEach(section => sectionObserver.observe(section))
  }

  if (!finePointer || reducedMotion) return

  root.classList.add('world-motion-ready')

  const updatePointer = () => {
    pointerFrame = 0
    if (!pointerEvent) return
    const { clientX, clientY, target } = pointerEvent
    root.style.setProperty('--pointer-x', String(clientX) + 'px')
    root.style.setProperty('--pointer-y', String(clientY) + 'px')

    const hero = document.querySelector('.hero')
    if (hero) {
      const bounds = hero.getBoundingClientRect()
      const x = ((clientX - bounds.left) / Math.max(1, bounds.width) - .5)
      const y = ((clientY - bounds.top) / Math.max(1, bounds.height) - .5)
      root.style.setProperty('--hero-parallax-x', String((x * 18).toFixed(2)) + 'px')
      root.style.setProperty('--hero-parallax-y', String((y * 14).toFixed(2)) + 'px')
      root.style.setProperty('--hero-image-x', String((x * 5).toFixed(2)) + 'px')
      root.style.setProperty('--hero-image-y', String((y * 4).toFixed(2)) + 'px')
    }

    const card = target?.closest?.('[data-project]')
    if (card) {
      const bounds = card.getBoundingClientRect()
      const x = (clientX - bounds.left) / Math.max(1, bounds.width) - .5
      const y = (clientY - bounds.top) / Math.max(1, bounds.height) - .5
      if (activeCard && activeCard !== card) resetCard()
      activeCard = card
      activeCard.classList.add('is-pointer-active')
      activeCard.style.setProperty('--tilt-x', String((x * 1.6).toFixed(2)) + 'deg')
      activeCard.style.setProperty('--tilt-y', String((-y * 1.6).toFixed(2)) + 'deg')
    } else {
      resetCard()
    }

    const control = target?.closest?.('a.button, button.button, .text-link, .filter-button, .icon-button')
    if (control) {
      const bounds = control.getBoundingClientRect()
      const x = (clientX - bounds.left) / Math.max(1, bounds.width) - .5
      const y = (clientY - bounds.top) / Math.max(1, bounds.height) - .5
      if (activeControl && activeControl !== control) resetControl()
      activeControl = control
      activeControl.classList.add('is-magnetic-active')
      activeControl.style.setProperty('--mag-x', String((x * 4).toFixed(2)) + 'px')
      activeControl.style.setProperty('--mag-y', String((y * 3).toFixed(2)) + 'px')
    } else {
      resetControl()
    }
  }

  const onPointerMove = event => {
    pointerEvent = event
    if (pointerFrame) return
    pointerFrame = window.requestAnimationFrame(updatePointer)
  }

  const resetPointer = () => {
    pointerEvent = null
    root.style.removeProperty('--hero-parallax-x')
    root.style.removeProperty('--hero-parallax-y')
    root.style.removeProperty('--hero-image-x')
    root.style.removeProperty('--hero-image-y')
    resetCard()
    resetControl()
  }

  document.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('blur', resetPointer, { passive: true })
}
