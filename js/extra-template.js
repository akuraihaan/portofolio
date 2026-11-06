import { escapeHtml, safeUrl, normalizeSettingValue } from './utils.js'

export function normalizeAppearance(value = {}) {
  const raw = normalizeSettingValue(value) || {}
  const point = value => Math.max(0, Math.min(100, Number.isFinite(Number(value)) ? Number(value) : 50))
  return {
    template: raw.template === 'extra' ? 'extra' : 'default',
    accent: /^#[\da-f]{6}$/i.test(raw.accent || '') ? raw.accent : '#0075de',
    photoSource: raw.photoSource === 'hero' ? 'hero' : 'profile',
    focalX: point(raw.focalX ?? 50), focalY: point(raw.focalY ?? 35),
    motion: raw.motion !== false,
    skillIds: Array.isArray(raw.skillIds) ? raw.skillIds.map(String) : [],
    featuredIds: Array.isArray(raw.featuredIds) ? raw.featuredIds.map(String) : [],
    crops: raw.crops && typeof raw.crops === 'object' ? Object.fromEntries(Object.entries(raw.crops).map(([id, crop]) => [id, { x: point(crop?.x), y: point(crop?.y) }])) : {},
    cards: Array.isArray(raw.cards) ? raw.cards.filter(card => card && typeof card === 'object').slice(0, 20).map(card => ({ label: String(card.label || '').slice(0, 60), value: String(card.value || '').slice(0, 120), source: ['custom', 'projects', 'skills', 'role', 'availability'].includes(card.source) ? card.source : 'custom', visible: card.visible !== false })) : []
  }
}

export function heroCards(config, { projects = [], skills = [], hero = null } = {}) {
  projects = projects.filter(project => project.status === 'published' && (!project.published_at || Date.parse(project.published_at) <= Date.now()))
  const selected = skills.filter(skill => config.skillIds.includes(String(skill.id)))
  return config.cards.filter(card => card.visible).map(card => {
    const value = card.source === 'projects' ? (projects.length ? String(projects.length) : '')
      : card.source === 'skills' ? selected.map(skill => skill.name).filter(Boolean).join(' · ')
      : card.source === 'role' ? hero?.custom_data?.roles?.[0] || ''
      : card.source === 'availability' ? hero?.custom_data?.availability_status || '' : card.value
    return { ...card, value }
  }).filter(card => card.label && card.value).slice(0, 3)
}

export function cardsMarkup(cards) {
  return cards.length ? '<div class="extra-cards">' + cards.map(card => '<div class="extra-card"><span class="extra-card__icon" aria-hidden="true">' + ({ projects: '▦', skills: '⌘', role: '◇', availability: '○', custom: '✦' }[card.source] || '◇') + '</span><div><small>' + escapeHtml(card.label) + '</small><strong>' + escapeHtml(card.value) + '</strong></div></div>').join('') + '</div>' : ''
}

export function applyExtraAppearance(settings = {}) {
  const config = normalizeAppearance(settings.appearance_published)
  const root = document.documentElement
  root.dataset.template = config.template
  if (config.template === 'extra') {
    root.dataset.theme = 'light'
    root.dataset.reduceMotion = String(!config.motion)
    root.style.setProperty('--extra-accent', config.accent)
    root.style.setProperty('--color-notion-blue', config.accent)
    root.style.setProperty('--extra-button-text', accentTextColor(config.accent))
    root.style.setProperty('--extra-focal', `${config.focalX}% ${config.focalY}%`)
  }
  return config
}

export function accentTextColor(accent) {
  const channels = accent.slice(1).match(/../g).map(hex => parseInt(hex, 16) / 255).map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4)
  const luminance = channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722
  return luminance > .179 ? '#000000' : '#ffffff'
}

export function renderExtraHome(content) {
  const config = applyExtraAppearance(content.settings.data)
  if (config.template !== 'extra') return
  const settings = content.settings.data
  const hero = content.sections.data.find(section => section.section_key === 'hero')
  const profile = content.profile
  const name = profile?.full_name || settings.owner_name || ''
  const title = document.querySelector('[data-hero-title]')
  if (title) title.textContent = name
  const intro = document.querySelector('[data-hero-intro]')
  if (intro) intro.innerHTML = '<strong class="extra-profession">' + escapeHtml(hero?.custom_data?.roles?.[0] || '') + '</strong><span>' + escapeHtml(profile?.bio || hero?.description || '') + '</span>'
  const actions = document.querySelector('.hero__actions')
  const work = document.querySelector('#work:not([hidden])')
  const cv = safeUrl(settings.resume_url || settings.resume || '')
  if (actions) actions.innerHTML = (work && content.projects.data.length ? '<a class="button" href="#work">Lihat Proyek <span aria-hidden="true">↗</span></a>' : '') + (cv && cv !== '#' ? '<a class="button button--soft" href="' + escapeHtml(cv) + '" target="_blank" rel="noopener">Unduh CV</a>' : '')
  const portrait = document.querySelector('.hero__portrait')
  const photo = config.photoSource === 'hero' ? settings.hero_image || settings.hero_image_url || profile?.avatar_url : profile?.avatar_url
  if (portrait) {
    portrait.innerHTML = photo ? '<img src="' + escapeHtml(safeUrl(photo)) + '" alt="' + escapeHtml(name) + '" width="600" height="600" fetchpriority="high">' : ''
    portrait.hidden = !photo
  }
  const visual = document.querySelector('.hero__visual')
  if (visual) { visual.querySelector('.extra-cards')?.remove(); visual.insertAdjacentHTML('beforeend', cardsMarkup(heroCards(config, { projects: content.projects.data, skills: content.skills.data, hero }))); visual.hidden = !photo && !visual.querySelector('.extra-cards') }
  const heroElement = document.querySelector('#hero')
  heroElement?.classList.toggle('extra-no-visual', Boolean(visual?.hidden))
  if (heroElement && !name && !profile?.bio && !hero?.description && visual?.hidden) heroElement.hidden = true
  portrait?.querySelector('img')?.addEventListener('error', event => { event.target.hidden = true; portrait.hidden = true; if (visual && !visual.querySelector('.extra-cards')) visual.hidden = true }, { once: true })
  // Keep inherited controls with no configured destination out of the tab order.
  document.querySelectorAll('a').forEach(link => { if (!link.textContent.trim() && !link.getAttribute('aria-label') && !link.querySelector('img')) link.hidden = true })
  document.querySelectorAll('.project-card').forEach(card => {
    const link = card.querySelector('a[href^="/projects/"]')
    const project = content.projects.data.find(item => link?.getAttribute('href') === '/projects/' + encodeURIComponent(item.slug))
    const crop = config.crops[project?.id]
    if (crop) card.style.setProperty('--extra-project-focal', `${crop.x}% ${crop.y}%`)
    card.dataset.extraFeatured = String(config.featuredIds.includes(String(project?.id)))
    card.querySelector('.extra-featured-label')?.remove()
    if (card.dataset.extraFeatured === 'true') card.querySelector('.project-card__body')?.insertAdjacentHTML('afterbegin', '<small class="extra-featured-label">Proyek unggulan</small>')
  })
}

export function extraHomeNavigation(content) {
  const sections = content.sections?.data || []
  const ids = { hero: 'hero', about: 'about', skills: 'capabilities', services: 'capabilities', projects: 'work', featured_projects: 'work', experiences: 'experience', educations: 'education', certificates: 'credentials', contact: 'contact', articles: 'notes', achievements: 'achievements' }
  const links = (content.navigation?.data || []).filter(item => item.is_visible !== false && item.label && (!item.section_key || sections.some(section => section.section_key === item.section_key && section.is_visible !== false))).map(item => {
    const href = item.section_key && ids[item.section_key] ? '/#' + ids[item.section_key] : item.href?.startsWith('#') ? '/' + item.href : safeUrl(item.href)
    return href && href !== '#' ? '<a href="' + escapeHtml(href) + '">' + escapeHtml(item.label) + '</a>' : ''
  }).join('')
  return links ? '<nav class="extra-detail-nav" aria-label="Navigasi portfolio">' + links + '</nav>' : ''
}

export async function printPortfolio(className) {
  document.body.classList.add(className)
  const cleanup = () => document.body.classList.remove(className)
  window.addEventListener('afterprint', cleanup, { once: true })
  try {
    await document.fonts.ready
    await Promise.all(Array.from(document.images).map(async image => {
      image.loading = 'eager'
      try { await image.decode() } catch { /* Missing media must not block selectable text. */ }
    }))
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    window.print()
  } catch (error) { cleanup(); throw error }
}
