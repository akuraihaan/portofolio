import { bindOnce, delegate, lockBodyScroll, prefersReducedMotion } from './jquery-ui.js'

let activeObserver = null

function setMenuState(button, nav, isOpen) {
  button?.classList.toggle('is-open', isOpen)
  nav?.classList.toggle('is-open', isOpen)
  button?.setAttribute('aria-expanded', String(isOpen))
  button?.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu')
  lockBodyScroll(isOpen)
}

export function closeMobileNavigation() {
  const button = document.querySelector('[data-menu-toggle]')
  const nav = document.querySelector('[data-mobile-nav]')
  setMenuState(button, nav, false)
}

export function initializeNavigation() {
  const button = document.querySelector('[data-menu-toggle]')
  const nav = document.querySelector('[data-mobile-nav]')
  if (!button || !nav || document.documentElement.dataset.navigationReady === 'true') return
  button.dataset.menuTarget = nav.id || 'mobile-navigation'
  nav.id = nav.id || 'mobile-navigation'
  button.setAttribute('aria-controls', nav.id)

  delegate(document, 'click', '[data-menu-toggle]', () => {
    setMenuState(button, nav, !nav.classList.contains('is-open'))
  }, 'bworieyNavigation')
  delegate(document, 'click', '[data-mobile-nav] a', () => closeMobileNavigation(), 'bworieyNavigation')
  bindOnce(document, 'navigationEscape', 'keydown', event => {
    if (event.key === 'Escape') closeMobileNavigation()
  })
  bindOnce(window, 'navigationViewport', 'resize', () => {
    if (window.innerWidth > 900) closeMobileNavigation()
  }, { passive: true })
  document.documentElement.dataset.navigationReady = 'true'
}

export function initializeHeaderScroll() {
  const header = document.querySelector('[data-header]')
  if (!header || header.dataset.scrollReady === 'true') return
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 24)
  bindOnce(window, 'headerScroll', 'scroll', update, { passive: true })
  header.dataset.scrollReady = 'true'
  update()
}

export function initializeSectionNavigation() {
  if (document.documentElement.dataset.sectionNavigationReady === 'true') return
  const update = () => {
    const links = [...document.querySelectorAll('.desktop-nav a, .mobile-nav a')]
    const sections = links
      .map(link => document.querySelector(link.getAttribute('href')))
      .filter(Boolean)
    const marker = window.scrollY + 160
    let activeId = sections[0]?.id || 'top'
    sections.forEach(section => {
      if (section.offsetTop <= marker) activeId = section.id
    })
    links.forEach(link => {
      const active = link.getAttribute('href') === `#${activeId}`
      link.classList.toggle('is-active', active)
      if (active) link.setAttribute('aria-current', 'page')
      else link.removeAttribute('aria-current')
    })
  }
  bindOnce(window, 'sectionNavigationScroll', 'scroll', update, { passive: true })
  document.documentElement.dataset.sectionNavigationReady = 'true'
  update()
}

export function initializeSmoothScroll() {
  if (document.documentElement.dataset.smoothScrollReady === 'true') return
  delegate(document, 'click', 'a[href^="#"]', (event, link) => {
    const href = link.getAttribute('href')
    if (!href || href === '#') return
    const target = document.querySelector(href)
    if (!target) return
    event.preventDefault()
    target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
    window.history.replaceState(null, '', href)
  }, 'bworieyNavigation')
  document.documentElement.dataset.smoothScrollReady = 'true'
}

