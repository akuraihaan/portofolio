import { supabase, supabaseConfiguration } from '../supabase.js'
import { escapeHtml, formatDate, safeUrl, showToast } from './utils.js'
import { getPublicContent } from './services/public-content-service.js?v=20260904-3'
import { delegate, prefersReducedMotion } from './ui/jquery-ui.js'
import { initializeNavigation as initializeNavigationUi, initializeHeaderScroll as initializeHeaderScrollUi, initializeSectionNavigation as initializeSectionNavigationUi, initializeSmoothScroll as initializeSmoothScrollUi } from './ui/navigation.js'
import { closeModal, openModal } from './ui/modal.js'
import { applyProjectFilter, createProjectSearchHandler } from './ui/filters.js'
import { resetFormState, setFieldError, setFormSubmitting } from './ui/form-feedback.js'
import { initializeRevealAnimations as initializeRevealUi } from './ui/scroll-effects.js'
import { initializeWorldInteractions } from './ui/world-interactions.js'
import { renderExtraHome } from './extra-template.js'
import { loadAppearancePreview } from './appearance-admin.js'

const reduceMotion = prefersReducedMotion()
let activeRole = ''

const CONTENT_COLLECTIONS = ['sections', 'navigation', 'projects', 'projectMedia', 'articles', 'skills', 'services', 'educations', 'experiences', 'certificates', 'achievements', 'testimonials', 'socialLinks', 'statistics']

function emptyResult(error = new Error('Konten publik belum tersedia.')) {
  return { ok: false, data: [], error }
}

function createEmptyContent(error = new Error('Konten publik belum tersedia.')) {
  return {
    settings: { ok: false, data: {}, error },
    profile: null,
    ...Object.fromEntries(CONTENT_COLLECTIONS.map(key => [key, emptyResult(error)])),
    counts: {},
    usedFallback: false
  }
}

function normalizePublicContent(content = {}) {
  const empty = createEmptyContent(content.error || new Error('Konten publik belum tersedia.'))
  return {
    ...empty,
    ...content,
    settings: { ...empty.settings, ...(content.settings || {}), data: content.settings?.data || {} },
    profile: content.profile || null,
    ...Object.fromEntries(CONTENT_COLLECTIONS.map(key => [key, { ...empty[key], ...(content[key] || {}), data: Array.isArray(content[key]?.data) ? content[key].data : [] }])),
    counts: content.statistics?.counts || content.counts || {},
    usedFallback: Boolean(content.usedFallback)
  }
}

function isPlaceholderEmail(value) {
  const email = String(value || '').trim().toLowerCase()
  return !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function withTimeout(promise, timeoutMs = 9000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => window.setTimeout(() => reject(new Error('Waktu memuat konten habis.')), timeoutMs))
  ])
}

export function initializePublic() {
  initializeTheme()
  initializeNavigationUi()
  initializeHeaderScrollUi()
  initializeSectionNavigationUi()
  initializeRevealUi()
  initializeWorldInteractions()
  initializeCopyEmail()
  initializeCopyPortfolio()
  initializeSmoothScrollUi()
  initializeYear()
  initializeContactForm()
  setPublicLoadingState()
  loadDynamicPageContent()
}

async function loadDynamicPageContent() {
  if (!supabaseConfiguration.ready || !supabase) {
    renderPublicContent(createEmptyContent(), { fallback: true })
    showPublicConfigNotice('Konten publik belum tersedia. Hubungkan Supabase untuk memuatnya dari panel admin.')
    return
  }
  let content
  try {
    content = await withTimeout(getPublicContent())
  } catch (error) {
    console.error('Public content load failed:', error)
    renderPublicContent(createEmptyContent(error), { fallback: true })
    showPublicConfigNotice('Konten publik belum dapat dimuat dari Supabase.')
    return
  }
  const normalizedContent = normalizePublicContent(content)
  try {
    normalizedContent.settings.data = await loadAppearancePreview(normalizedContent.settings.data)
    renderPublicContent(normalizedContent, { fallback: false })
  } catch (error) {
    console.error('Public content render failed:', error)
    renderPublicContent(createEmptyContent(error), { fallback: true })
    showPublicConfigNotice('Konten publik belum dapat dirender.')
  }
}

export function renderPublicContent(content, { fallback = false } = {}) {
  const normalizedContent = content.usedFallback === undefined ? normalizePublicContent(content) : content
  const settings = normalizedContent.settings.data
  const profile = normalizedContent.profile
  const sections = normalizedContent.sections.data
  const hero = sections.find(section => section.section_key === 'hero')
  reorderPublicSections(sections)
  applyDynamicSectionSettings(sections)
  applySiteIdentity(settings, profile, hero)
  renderDynamicNavigation(normalizedContent.navigation.data)
  renderDynamicMarquee(settings, hero)
  renderDynamicAbout(sections.find(section => section.section_key === 'about'), profile, settings)
  renderDynamicCapabilities(normalizedContent.skills.data, normalizedContent.services.data, sections.find(section => ['skills', 'skill', 'services', 'service'].includes(section.section_key)), normalizedContent.projects.data, normalizedContent.experiences.data)
  renderDynamicStats(normalizedContent.statistics.data, normalizedContent.counts)
  renderDynamicProcess(sections.find(section => section.section_key === 'process'))
  renderDynamicEducations(normalizedContent.educations.data)
  renderDynamicExperiences(normalizedContent.experiences.data)
  renderDynamicProjects(normalizedContent.projects.data, normalizedContent.projectMedia.data, sections.find(section => ['projects', 'featured_projects', 'portfolio', 'work'].includes(section.section_key)))
  renderDynamicArticles(normalizedContent.articles.data)
  renderDynamicCertificates(normalizedContent.certificates.data)
  renderDynamicAchievements(normalizedContent.achievements?.data || [], sections.find(section => section.section_key === 'achievements'))
  renderDynamicCustomSections(sections)
  renderDynamicTestimonials(normalizedContent.testimonials.data)
  renderSocialLinks(normalizedContent.socialLinks.data)
  initializeRoleTyping(document.querySelector('[data-role]'), hero?.custom_data?.roles || [])
  renderDynamicRoleSelector(settings, normalizedContent.projects.data, hero)
  bindProjectInteractions()
  updateNavigationVisibilityFromSections(sections, normalizedContent)
  updatePublicSectionNumbers()
  renderExtraHome(normalizedContent)
  document.documentElement.classList.add('content-ready')
  document.documentElement.classList.toggle('fallback-content', fallback)
  if (!fallback) {
    const results = [normalizedContent.settings, normalizedContent.sections, normalizedContent.navigation, normalizedContent.projects, normalizedContent.projectMedia, normalizedContent.articles, normalizedContent.skills, normalizedContent.services, normalizedContent.educations, normalizedContent.experiences, normalizedContent.certificates, normalizedContent.achievements, normalizedContent.testimonials, normalizedContent.socialLinks]
    if (results.some(result => !result.ok)) showToast('Beberapa data belum dapat dimuat. Konten lainnya tetap tersedia.', 'error')
  }
}

function applyDynamicSectionSettings(sections = []) {
  const configuredSections = sections.filter(section => section.section_key !== 'statistics')
  const sectionElements = { hero: '#hero', about: '#about', about_me: '#about', profile: '#about', statistics: '#about', achievements: '#achievements', skills: '#capabilities', skill: '#capabilities', services: '#capabilities', service: '#capabilities', featured_projects: '#work', projects: '#work', portfolio: '#work', work: '#work', experiences: '#experience', experience: '#experience', educations: '#education', education: '#education', articles: '#notes', article: '#notes', notes: '#notes', certificates: '#credentials', certificate: '#credentials', testimonials: '#credentials', testimonial: '#credentials', contact: '#contact', cta: '#contact', process: '#process' }
  const titleSelectors = { hero: '[data-hero-title]', about: '#statement-title', about_me: '#statement-title', profile: '#statement-title', statistics: '#statement-title', achievements: '#achievements-title', skills: '#capabilities-title', skill: '#capabilities-title', services: '#capabilities-title', service: '#capabilities-title', projects: '#work-title', portfolio: '#work-title', work: '#work-title', featured_projects: '#work-title', experiences: '#experience-title', experience: '#experience-title', educations: '#education-title', education: '#education-title', articles: '#notes-title', article: '#notes-title', notes: '#notes-title', certificates: '#credentials-title', certificate: '#credentials-title', testimonials: '#credentials-title', testimonial: '#credentials-title', contact: '#contact-title', cta: '#contact-title', process: '#process-title' }
  const uniqueElements = new Map()
  configuredSections.forEach(section => {
    const selector = sectionElements[section.section_key]; const element = selector ? document.querySelector(selector) : null
    if (!element || uniqueElements.has(selector)) return
    uniqueElements.set(selector, element)
    const titleSelector = titleSelectors[section.section_key]
    const title = titleSelector ? document.querySelector(titleSelector) : null
    if (title) title.textContent = section.title || ''
    if (section.section_key === 'hero') {
      const badge = element.querySelector('[data-hero-badge]')
      const intro = element.querySelector('[data-hero-intro]')
      if (badge) badge.textContent = section.badge_text || ''
      const availability = element.querySelector('[data-availability]')
      if (availability) availability.textContent = section.custom_data?.availability_status || ''
      if (intro) {
        const roles = Array.isArray(section.custom_data?.roles) ? section.custom_data.roles : []
        const role = document.createElement('span')
        role.className = 'accent-green'
        role.dataset.role = ''
        role.dataset.roles = JSON.stringify(roles)
        intro.replaceChildren(document.createTextNode(section.description || ''), role)
      }
    }
    const eyebrow = element.querySelector('.eyebrow')
    if (eyebrow && section.eyebrow) eyebrow.textContent = `{ ${section.eyebrow} }`
    const description = element.querySelector('.section-heading > p') || element.querySelector('.section-heading--work p') || element.querySelector('.statement__aside > p') || element.querySelector('[data-contact-description]')
    if (description && section.description) description.textContent = section.description
    const primary = element.querySelector('[data-section-primary]'); const secondary = element.querySelector('[data-section-secondary]')
     if (primary) { const label = section.primary_button_label || ''; primary.replaceChildren(document.createTextNode(label)); primary.hidden = !label; if (section.primary_button_url) primary.href = safeUrl(section.primary_button_url) }
     if (secondary) { const label = section.secondary_button_label || ''; secondary.replaceChildren(document.createTextNode(label)); secondary.hidden = !label; if (section.secondary_button_url) secondary.href = safeUrl(section.secondary_button_url) }
     const aboutLink = element.querySelector('[data-about-contact-link]')
     if (aboutLink && ['about', 'about_me', 'profile'].includes(section.section_key)) { const label = section.secondary_button_label || section.primary_button_label || ''; aboutLink.textContent = label; aboutLink.hidden = !label; if (section.secondary_button_url || section.primary_button_url) aboutLink.href = safeUrl(section.secondary_button_url || section.primary_button_url) }
    element.dataset.sectionLayout = section.layout_variant || 'default'
    const objectPosition = ['center', 'top', 'bottom', 'left', 'right'].includes(section.custom_data?.object_position) ? section.custom_data.object_position : 'center'
    element.style.setProperty('--section-image-position', objectPosition)
    if (section.image_url) {
      element.dataset.sectionImage = 'true'
      element.style.setProperty('--section-image', `url("${section.image_url}")`)
    }
    if (section.background_image_url) {
      element.dataset.sectionBackground = 'true'
      element.style.setProperty('--section-background-image', `url("${section.background_image_url}")`)
    }
  })
  const configuredElements = new Set(configuredSections.map(section => sectionElements[section.section_key]).filter(Boolean))
  Object.entries(sectionElements).forEach(([key, selector]) => {
    const element = document.querySelector(selector)
    if (!element) return
    element.hidden = !configuredElements.has(selector)
  })
  reorderPublicSections(sections)
  updatePublicSectionNumbers()
}

function reorderPublicSections(sections = null) {
  const main = document.querySelector('main')
  if (!main) return
  const configuredSections = sections?.filter(section => section.section_key !== 'statistics') || null
  const sectionElements = { hero: 'hero', about: 'about', about_me: 'about', profile: 'about', statistics: 'about', skills: 'capabilities', skill: 'capabilities', services: 'capabilities', service: 'capabilities', featured_projects: 'work', projects: 'work', portfolio: 'work', work: 'work', experiences: 'experience', experience: 'experience', educations: 'education', education: 'education', certificates: 'credentials', certificate: 'credentials', testimonials: 'credentials', testimonial: 'credentials', achievements: 'achievements', articles: 'notes', article: 'notes', notes: 'notes', contact: 'contact', cta: 'contact', process: 'process' }
  const defaultIds = ['hero', 'about', 'capabilities', 'work', 'experience', 'education', 'credentials', 'achievements', 'notes', 'process', 'contact']
  if (configuredSections) main.dataset.configuredSectionOrder = JSON.stringify(configuredSections.map(section => section.section_key))
  let configuredKeys = defaultIds
  try { configuredKeys = JSON.parse(main.dataset.configuredSectionOrder || '[]').length ? JSON.parse(main.dataset.configuredSectionOrder) : defaultIds } catch { configuredKeys = defaultIds }
  if (configuredSections?.length) {
    const defaultOrder = new Map(defaultIds.map((key, index) => [key, index + 1]))
    const explicitOrder = new Map()
    configuredSections.forEach(section => {
      const canonical = sectionElements[section.section_key] || section.section_key
      if (!explicitOrder.has(canonical)) explicitOrder.set(canonical, Number(section.sort_order) || defaultOrder.get(canonical) || 999)
    })
    const allKeys = [...new Set([...explicitOrder.keys(), ...defaultIds])]
    configuredKeys = allKeys.sort((a, b) => (explicitOrder.get(a) || defaultOrder.get(a) || 999) - (explicitOrder.get(b) || defaultOrder.get(b) || 999))
  }
  const ordered = []
  configuredKeys.forEach(key => {
    const id = sectionElements[key] || key
    const element = document.getElementById(id) || [...main.querySelectorAll('[data-custom-section]')].find(item => item.dataset.customSection === key)
    if (element?.parentElement === main && !ordered.includes(element)) ordered.push(element)
  })
  const marquee = main.querySelector('.marquee')
  const seen = new Set(ordered)
  const children = [...main.children]
  const sequence = []
  ordered.forEach(element => {
    sequence.push(element)
    if (element.id === 'hero' && marquee) sequence.push(marquee)
  })
  children.forEach(element => { if (!seen.has(element) && element !== marquee) sequence.push(element) })
  sequence.forEach(element => main.appendChild(element))
}

function updatePublicSectionNumbers() {
  const sections = [...document.querySelectorAll('main > section.section-shell:not([hidden])')]
  const total = sections.length
  sections.forEach((section, index) => {
    section.querySelectorAll('[data-section-number]').forEach(element => {
      element.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0')
    })
  })
}

function renderDynamicNavigation(items = []) {
  const desktop = document.querySelector('.desktop-nav'); const mobile = document.querySelector('.mobile-nav')
  const footer = document.querySelector('[data-dynamic-footer-navigation]')
  const visibleItems = items.filter(item => item?.label && item?.href).slice(0, 7)
  const itemMarkup = (item, mobileMode = false, index = 0) => `<a href="${escapeHtml(safeUrl(item.href))}" target="${item.target === '_blank' ? '_blank' : '_self'}" ${item.target === '_blank' ? 'rel="noreferrer"' : ''}>${escapeHtml(item.label)}${mobileMode ? ` <span>${String(index + 1).padStart(2, '0')}</span>` : ''}</a>`
  if (desktop) desktop.innerHTML = visibleItems.map(item => itemMarkup(item)).join('')
  if (mobile) mobile.innerHTML = visibleItems.map((item, index) => itemMarkup(item, true, index)).join('')
  if (footer) footer.innerHTML = visibleItems.slice(0, 3).map(item => itemMarkup(item)).join('')
  initializeSectionNavigationUi()
}

function renderDynamicMarquee(settings, hero) {
  const track = document.querySelector('[data-dynamic-marquee]'); if (!track) return
  const items = hero?.custom_data?.marquee_items || settings.marquee_items || []
  track.parentElement.hidden = !items.length
  track.innerHTML = [...items, ...items].map(item => `<span>${escapeHtml(item)}</span><b aria-hidden="true">✳</b>`).join('')
}

function renderDynamicAbout(section, profile = null, settings = {}) {
  const data = section?.custom_data || {}
  const short = document.querySelector('[data-about-short]'); const long = document.querySelector('[data-about-long]')
  if (short && data.bio_short) short.textContent = data.bio_short
  if (long && (data.bio_long || section?.description)) long.textContent = data.bio_long || section.description
  const facts = document.querySelector('[data-about-facts]')
  if (facts) facts.innerHTML = (data.facts || []).map(fact => `<span><small>${escapeHtml(fact.label)}</small><strong>${escapeHtml(fact.value)}</strong></span>`).join('')
  const highlights = document.querySelector('[data-about-highlights]')
  if (highlights) {
    const items = Array.isArray(data.highlights) ? data.highlights : []
    highlights.innerHTML = items.map(item => '<span><strong>' + escapeHtml(item.title || '') + '</strong><small>' + escapeHtml(item.description || '') + '</small></span>').join('')
  }
  const image = section?.image_url || profile?.avatar_url || ''
  const imageContainer = document.querySelector('[data-about-image]')
  if (imageContainer) {
    const initials = getInitials(profile?.full_name || settings.owner_name || '')
    imageContainer.innerHTML = image
      ? '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(profile?.full_name || settings.owner_name || '') + '" loading="lazy" decoding="async" width="900" height="600" data-image-fallback data-fallback-label="' + initials + '"><span class="hero__portrait-fallback" hidden>' + initials + '</span>'
      : ''
    bindImageFallbacks(imageContainer)
  }
  const caption = document.querySelector('[data-about-caption]')
  if (caption && (data.caption || section?.subtitle)) caption.textContent = data.caption || section.subtitle
  const resume = document.querySelectorAll('[data-resume-link]')
  const resumeUrl = settings.resume_url || settings.resume || ''
  const resumeLabel = settings.resume_label || ''
  resume.forEach(element => {
    element.hidden = !resumeUrl || !resumeLabel
    element.textContent = resumeLabel
    if (resumeUrl) element.href = safeUrl(resumeUrl)
  })
}

function renderDynamicProcess(section) {
  const container = document.querySelector('[data-dynamic-process]'); if (!container) return
  const steps = Array.isArray(section?.custom_data?.steps) ? section.custom_data.steps : []
  container.innerHTML = steps.map((step, index) => `<article data-reveal><span>${String(index + 1).padStart(2, '0')}</span><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.description)}</p></article>`).join('')
  container.parentElement.hidden = !steps.length
  initializeRevealUi()
}

function updateNavigationVisibilityFromSections(sections, content) {
  const isVisible = id => {
    const element = document.querySelector('#' + id)
    return Boolean(element && !element.hidden)
  }
  updateNavigationVisibility({
    about: isVisible('about'),
    capabilities: isVisible('capabilities'),
    work: isVisible('work') && content.projects.data.length > 0,
    experience: isVisible('experience'),
    education: isVisible('education'),
    notes: isVisible('notes'),
    credentials: isVisible('credentials'),
    contact: isVisible('contact')
  })
}

function applySiteIdentity(settings, profile, hero = null) {
  applyAppearanceSettings(settings)
  const siteName = settings.site_name || settings.studio_name || profile?.full_name || ''
  const displayName = profile?.full_name || settings.owner_name || ''
  const description = settings.site_description || ''
  const configuredEmail = settings.owner_email || profile?.email || settings.public_email || settings.business_email || ''
  const email = isPlaceholderEmail(configuredEmail) ? '' : configuredEmail
  const location = settings.owner_location || [profile?.city || settings.city, profile?.country || settings.country].filter(Boolean).join(', ')
  const heroImage = settings.hero_image_url || settings.hero_image || profile?.avatar_url || ''
  const siteLogo = settings.site_logo || settings.logo_url || ''

  document.title = settings.default_meta_title || siteName || 'Portofolio'
  const metaDescription = settings.default_meta_description || description
  document.querySelector('meta[name="description"]')?.setAttribute('content', metaDescription)
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', settings.social_title || document.title)
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', settings.social_description || metaDescription)
  document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', settings.social_title || document.title)
  document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', settings.social_description || metaDescription)
  let robots = document.querySelector('meta[name="robots"]')
  if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.append(robots) }
  robots.content = ['index,follow', 'noindex,follow', 'noindex,nofollow'].includes(settings.robots) ? settings.robots : 'index,follow'
  if (settings.og_image_url || settings.og_image) document.querySelector('meta[property="og:image"]')?.setAttribute('content', settings.og_image_url || settings.og_image)
  const canonicalUrl = settings.canonical_url || `${window.location.origin}${window.location.pathname}`
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl)
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonicalUrl)
  if (settings.favicon_url || settings.site_favicon) document.querySelector('link[rel="icon"]')?.setAttribute('href', settings.favicon_url || settings.site_favicon)
  const jsonLd = document.querySelector('#person-jsonld')
  if (jsonLd) jsonLd.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: displayName || undefined, jobTitle: hero?.custom_data?.roles?.[0] || undefined, description: description || undefined, url: window.location.origin, email: email || undefined, address: location ? { '@type': 'PostalAddress', addressLocality: location } : undefined, sameAs: [] })
  const heroPortrait = document.querySelector('.hero__portrait')
  if (heroPortrait) {
    const initials = escapeHtml(getInitials(displayName))
    heroPortrait.setAttribute('aria-label', settings.profile_image_label || displayName)
    const portraitCaption = settings.profile_caption ? '<span class="hero__portrait-caption">' + escapeHtml(settings.profile_caption).replace(/\r?\n/g, '<br>') + '</span>' : ''
    heroPortrait.innerHTML = heroImage
      ? '<img src="' + escapeHtml(heroImage) + '" alt="' + escapeHtml(displayName) + '" loading="eager" decoding="async" width="900" height="1125" data-image-fallback data-fallback-label="' + escapeHtml(initials) + '"><span class="hero__portrait-fallback hero__portrait-fallback--placeholder" hidden>' + escapeHtml(initials) + '</span>' + portraitCaption
      : portraitCaption
  }
  document.querySelectorAll('[data-site-name]').forEach(element => { element.textContent = displayName })
  document.querySelectorAll('[data-site-owner-name]').forEach(element => { element.textContent = displayName })
  document.querySelectorAll('[data-site-mark]').forEach(element => { element.textContent = getInitials(displayName) })
  document.querySelector('.site-header .brand')?.setAttribute('aria-label', displayName + ' home')
  const logoElement = document.querySelector('[data-site-logo]')
  if (logoElement && siteLogo) logoElement.innerHTML = '<img src="' + escapeHtml(siteLogo) + '" alt="Logo ' + escapeHtml(siteName) + '" loading="eager" decoding="async" width="54" height="54" data-image-fallback data-fallback-label="' + escapeHtml(getInitials(displayName)) + '"><span hidden>' + escapeHtml(getInitials(displayName)) + '</span>'
  document.querySelectorAll('[data-site-location]').forEach(element => { element.textContent = location })
  document.querySelectorAll('[data-site-tagline]').forEach(element => { element.textContent = settings.site_tagline || '' })
  document.querySelectorAll('[data-contact-email]').forEach(element => {
    if (!email) { element.hidden = true; return }
    element.hidden = false
    element.textContent = `${email} ↗`
    element.setAttribute('href', `mailto:${email}`)
  })
  document.querySelector('[data-contact-location]')?.replaceChildren(document.createTextNode(location))
  document.querySelector('[data-footer-name]')?.replaceChildren(document.createTextNode(displayName))
  const copyright = String(settings.copyright_text || '').replaceAll('{year}', String(new Date().getFullYear()))
  document.querySelector('[data-footer-copyright]')?.replaceChildren(document.createTextNode(copyright))
  document.querySelector('[data-footer-location]')?.replaceChildren(document.createTextNode(location))
  document.querySelectorAll('[data-copy-email]').forEach(button => {
    button.hidden = !email
    if (email) button.dataset.email = email
    else button.removeAttribute('data-email')
  })
  const roles = Array.isArray(hero?.custom_data?.roles) ? hero.custom_data.roles : []
  const roleElement = document.querySelector('[data-role]')
  if (roleElement && roles.length) roleElement.dataset.roles = JSON.stringify(roles)
  bindImageFallbacks()
}

function applyAppearanceSettings(settings = {}) {
  const root = document.documentElement
  const allowedAccents = ['#0075de', '#f64932', '#ffb110', '#02093a']
  const allowedFonts = ['Inter', 'system-ui', 'Source Serif 4']
  if (['light', 'dark'].includes(settings.appearance_theme)) root.dataset.theme = settings.appearance_theme
  if (allowedAccents.includes(settings.appearance_accent)) root.style.setProperty('--color-notion-blue', settings.appearance_accent)
  if (allowedFonts.includes(settings.appearance_font)) root.style.setProperty('--font-notioninter', settings.appearance_font === 'Source Serif 4' ? "'Source Serif 4', Georgia, serif" : settings.appearance_font)
  if (['12px', '8px', '4px'].includes(settings.appearance_radius)) root.style.setProperty('--radius-card', settings.appearance_radius)
  if (settings.appearance_density === 'compact') root.style.setProperty('--section-gap', '56px')
  if (settings.appearance_motion === 'false' || settings.appearance_motion === false) root.dataset.reduceMotion = 'true'
}

function setImageFallback(image, label = 'BW') {
  image.addEventListener('error', () => {
    image.hidden = true
    const fallback = image.nextElementSibling
    if (fallback) {
      fallback.hidden = false
      fallback.textContent = label
    }
  }, { once: true })
}

function bindImageFallbacks(root = document) {
  root.querySelectorAll('[data-image-fallback]').forEach(image => {
    setImageFallback(image, image.dataset.fallbackLabel || '')
  })
}

function getInitials(value = '') {
  const words = String(value).trim().split(/\s+/).filter(Boolean)
  return (words.length > 1 ? words.slice(0, 2).map(word => word[0]) : [words[0]?.[0] || '']).join('').toUpperCase()
}

function formatDateRange(start, end, isCurrent = false) {
  const format = value => {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return new Intl.DateTimeFormat('id-ID', { month: 'short', year: 'numeric' }).format(date)
  }
  const from = format(start)
  const to = isCurrent ? 'Sekarang' : format(end)
  return [from, to].filter(Boolean).join(' — ')
}

function normalizeProjectCategory(value = '') {
  const category = String(value).toLowerCase()
  if (category.includes('ui') || category.includes('ux') || category.includes('design')) return 'uiux'
  if (category.includes('cloud') || category.includes('devops') || category.includes('infrastruktur')) return 'cloud-computing'
  if (category.includes('education') || category.includes('learning') || category.includes('pembelajaran') || category.includes('media')) return 'educational-technology'
  if (category.includes('web') || category.includes('website') || category.includes('frontend') || category.includes('backend')) return 'web-development'
  return 'web-development'
}

function renderDynamicRoleSelector(settings = {}, projects = [], hero = null) {
  const container = document.querySelector('[data-role-selector]')
  if (!container) return
  const titles = Array.isArray(hero?.custom_data?.roles) ? hero.custom_data.roles : []
  const profiles = hero?.custom_data?.role_profiles || settings.role_profiles || {}
  if (!titles.length) {
    container.replaceChildren()
    container.hidden = true
    document.querySelector('[data-hero-role-description]')?.replaceChildren()
    return
  }
  container.hidden = false
  if (!activeRole || !titles.includes(activeRole)) activeRole = titles[0]
  container.innerHTML = titles.map((title, index) => {
    const profile = profiles[title] || {}
    return '<button type="button" class="role-selector__item' + (title === activeRole ? ' is-active' : '') + '" data-role-choice="' + escapeHtml(title) + '" aria-pressed="' + String(title === activeRole) + '" style="--role-accent:' + escapeHtml(profile.accent || 'currentColor') + '"><span>' + String(index + 1).padStart(2, '0') + '</span>' + escapeHtml(title) + '</button>'
  }).join('')
  const update = title => {
    activeRole = title
    const profile = profiles[title] || {}
    container.querySelectorAll('[data-role-choice]').forEach(button => {
      const selected = button.dataset.roleChoice === title
      button.classList.toggle('is-active', selected)
      button.setAttribute('aria-pressed', String(selected))
    })
    document.documentElement.style.setProperty('--role-accent', profile.accent || 'currentColor')
    const description = document.querySelector('[data-hero-role-description]')
    if (description) description.textContent = profile.description || ''
    const roleElement = document.querySelector('[data-role]')
    if (roleElement) {
      if (roleElement.dataset.rotationTimer) window.clearInterval(Number(roleElement.dataset.rotationTimer))
      roleElement.dataset.rotationTimer = ''
      roleElement.textContent = title
    }
    const categories = profile.projectCategories || []
    document.querySelectorAll('[data-project-card]').forEach(card => {
      const match = !categories.length || categories.some(category => normalizeProjectCategory(category) === card.dataset.category || String(card.dataset.type || '').toLowerCase().includes(String(category).toLowerCase()))
      card.classList.toggle('is-role-match', match)
      card.classList.toggle('is-role-muted', !match)
    })
  }
  if (container.dataset.roleSelectorReady !== 'true') {
    container.addEventListener('click', event => {
      const button = event.target.closest('[data-role-choice]')
      if (button) update(button.dataset.roleChoice)
    })
    container.dataset.roleSelectorReady = 'true'
  }
  update(activeRole)
}

function bindSkillDomainInteractions() {
  const container = document.querySelector('[data-dynamic-capabilities]')
  if (!container || container.dataset.domainInteractionsReady === 'true') return
  container.addEventListener('click', event => {
    const button = event.target.closest('[data-skill-domain-open]')
    if (!button) return
    const domain = button.closest('[data-skill-domain]')
    const details = domain?.querySelector('[data-skill-domain-details]')
    if (!details) return
    const expanded = button.getAttribute('aria-expanded') === 'true'
    button.setAttribute('aria-expanded', String(!expanded))
    details.hidden = expanded
    button.querySelector('[data-domain-label]')?.replaceChildren(document.createTextNode(expanded ? 'Lihat portfolio bidang ini' : 'Sembunyikan detail bidang'))
  })
  container.dataset.domainInteractionsReady = 'true'
}

function renderDynamicCapabilities(skills = [], services = [], section = null, projects = [], experiences = []) {
  const container = document.querySelector('[data-dynamic-capabilities]')
  if (!container) return
  const sectionElement = container.closest('section')
  const categories = section?.custom_data?.categories
  if (Array.isArray(categories) && categories.length) {
    if (sectionElement) sectionElement.hidden = false
    const profileProjects = item => projects.filter(project => {
      const values = Array.isArray(item.projectCategories) ? item.projectCategories : []
      return !values.length || values.some(category => normalizeProjectCategory(category) === normalizeProjectCategory(project.category))
    }).slice(0, 3)
    container.innerHTML = categories.map((item, index) => {
      const relatedProjects = profileProjects(item)
      const relatedExperience = experiences.slice(0, 2)
      const technologyMarkup = (item.technologies || []).map(value => '<span class="skill-badge">' + escapeHtml(value) + '</span>').join('')
      const projectMarkup = relatedProjects.length ? '<ul>' + relatedProjects.map(project => '<li><a href="/projects/' + escapeHtml(project.slug || '') + '">' + escapeHtml(project.title) + '</a></li>').join('') + '</ul>' : '<p>Proyek terkait belum ditambahkan.</p>'
      const experienceMarkup = relatedExperience.length ? '<ul>' + relatedExperience.map(experience => '<li>' + escapeHtml(experience.role_title || experience.company || '') + '</li>').join('') + '</ul>' : ''
      return '<article class="skill-domain" data-skill-domain data-domain="' + escapeHtml(item.key || item.title) + '" data-reveal><div class="skill-domain__top"><span class="skill-domain__index">' + String(index + 1).padStart(2, '0') + '</span><span class="category-label">' + escapeHtml(item.title || '') + '</span></div><h3>' + escapeHtml(item.title || '') + '</h3><p>' + escapeHtml(item.description || '') + '</p><div class="skill-badges">' + technologyMarkup + '</div><button class="text-link" type="button" data-skill-domain-open aria-expanded="false"><span data-domain-label>Lihat portfolio bidang ini</span> ↗</button><div class="skill-domain__details" data-skill-domain-details hidden><div><small>Proyek terkait</small>' + projectMarkup + '</div><div><small>Pengalaman terkait</small>' + experienceMarkup + '</div></div></article>'
    }).join('')
    bindSkillDomainInteractions()
    initializeRevealUi()
    return
  }
  const groupedRecords = skills.map(item => ({ title: item.name, category: item.category || '' }))
    .concat(services.map(item => ({ title: item.title, category: item.category || '' })))
  const groupMap = new Map()
  groupedRecords.forEach(record => {
    const group = String(record.category || '').trim()
    if (!groupMap.has(group)) groupMap.set(group, [])
    groupMap.get(group).push(record)
  })
  if (groupedRecords.length) {
    if (sectionElement) sectionElement.hidden = false
    container.innerHTML = [...groupMap.entries()].filter(([, items]) => items.length).map(([group, items]) => '<section class="skill-group" data-reveal>' + (group ? '<div class="skill-group__heading"><h3>' + escapeHtml(group) + '</h3><span>' + String(items.length).padStart(2, '0') + '</span></div>' : '') + '<div class="skill-badges">' + items.map(item => '<span class="skill-badge">' + escapeHtml(item.title || '') + '</span>').join('') + '</div></section>').join('')
    initializeRevealUi()
    return
  }
  const records = skills.map(item => ({ title: item.name, description: item.description, type: item.category || '', level: item.level })).concat(services.map(item => ({ title: item.title, description: item.description, type: item.category || '', image: item.icon_url })))
  if (!records.length) {
    container.replaceChildren()
    if (sectionElement) sectionElement.hidden = true
    return
  }
  if (sectionElement) sectionElement.hidden = false
  container.innerHTML = records.map((record, index) => {
    const visual = record.image
      ? '<img src="' + escapeHtml(record.image) + '" alt="Ikon ' + escapeHtml(record.title) + '" loading="lazy" decoding="async" width="96" height="96" data-image-fallback data-fallback-label="' + getInitials(record.title) + '"><span class="capability__visual-fallback" hidden>' + getInitials(record.title) + '</span>'
      : '<span>' + String(index + 1).padStart(2, '0') + '</span>'
    return '<article class="capability" data-reveal><div class="capability__visual" aria-hidden="true">' + visual + '</div><div class="capability__content"><div class="capability__meta"><span class="category-label">' + escapeHtml(record.type || '') + '</span><span>' + String(index + 1).padStart(2, '0') + '</span></div><h3>' + escapeHtml(record.title) + '</h3><p>' + escapeHtml(record.description || '') + '</p></div></article>'
  }).join('')
  bindImageFallbacks(container)
  initializeRevealUi()
}

function renderDynamicStats(statistics = [], counts = {}) {
  const container = document.querySelector('[data-dynamic-stats]')
  if (!container) return
  const rows = Array.isArray(statistics) ? statistics : []
  container.innerHTML = rows.map(row => '<span><strong>' + escapeHtml(String(row.value ?? 0)) + '</strong><small>' + escapeHtml(row.label) + escapeHtml(row.suffix || '') + '</small></span>').join('')
  container.hidden = !rows.length
}

function renderDynamicEducations(educations) {
  const container = document.querySelector('[data-dynamic-educations]')
  if (!container) return
  const sectionElement = container.closest('section')

  if (!educations.length) {
    container.replaceChildren()
    if (sectionElement) sectionElement.hidden = true
    return
  }
  if (sectionElement) sectionElement.hidden = false

  container.innerHTML = educations.map(education => {
    const initials = getInitials(education.institution)
    const logo = education.logo_url
      ? '<span class="education-card__brand"><img src="' + escapeHtml(education.logo_url) + '" alt="Logo ' + escapeHtml(education.institution) + '" loading="lazy" decoding="async" width="88" height="88" data-image-fallback data-fallback-label="' + initials + '"><span class="education-card__fallback" hidden>' + initials + '</span></span>'
      : '<span class="education-card__brand education-card__brand--fallback" aria-hidden="true">' + initials + '</span>'
    const period = formatDateRange(education.start_date, education.end_date, education.is_current)
    return '<article class="education-card" data-reveal><div class="education-card__period">' + logo + '<span>' + escapeHtml(period) + '</span></div><div><h3>' + escapeHtml(education.degree || '') + '</h3><p class="education-card__institution">' + escapeHtml(education.institution) + '</p><p>' + escapeHtml([education.field_of_study, education.location, education.description].filter(Boolean).join(' · ')) + '</p></div></article>'
  }).join('')
  bindImageFallbacks(container)
  initializeRevealUi()
}

function renderDynamicExperiences(experiences) {
  const container = document.querySelector('[data-dynamic-experiences]')
  if (!container) return
  const sectionElement = container.closest('section')
  if (!experiences.length) {
    container.replaceChildren()
    if (sectionElement) sectionElement.hidden = true
    return
  }
  if (sectionElement) sectionElement.hidden = false
  container.innerHTML = experiences.map(item => {
    const initials = getInitials(item.company)
    const logo = item.logo_url
      ? '<img class="experience-card__logo" src="' + escapeHtml(item.logo_url) + '" alt="Logo ' + escapeHtml(item.company) + '" loading="lazy" decoding="async" width="88" height="88" data-image-fallback data-fallback-label="' + initials + '"><span class="experience-card__fallback" hidden>' + initials + '</span>'
      : '<span class="experience-card__logo experience-card__logo--fallback" aria-hidden="true">' + initials + '</span>'
    const highlights = Array.isArray(item.highlights) ? '<ul class="experience-card__highlights">' + item.highlights.slice(0, 3).map(value => '<li>' + escapeHtml(value) + '</li>').join('') + '</ul>' : ''
    return '<article class="experience-card" data-reveal><div class="experience-card__period">' + logo + '<span>' + escapeHtml(formatDateRange(item.start_date, item.end_date, item.is_current)) + '</span></div><div><p class="experience-card__company">' + escapeHtml(item.company) + '</p><h3>' + escapeHtml(item.role_title) + '</h3><p>' + escapeHtml([item.location, item.description].filter(Boolean).join(' · ')) + '</p>' + highlights + '</div></article>'
  }).join('')
  bindImageFallbacks(container)
  initializeRevealUi()
}

function renderDynamicProjects(projects, projectMedia = [], section = null) {
  const grid = document.querySelector('[data-dynamic-projects]')
  const footer = document.querySelector('[data-project-count]')
  if (!grid) return
  const sectionElement = grid.closest('section')
  const filterRow = document.querySelector('[data-project-filters]')
  if (filterRow) {
    const categories = [...new Map(projects.filter(project => project.category).map(project => [normalizeProjectCategory(project.category), project.category])).entries()]
    filterRow.innerHTML = '<label class="search-label">Cari proyek<input class="project-search" type="search" data-project-search placeholder="Judul atau teknologi" aria-label="Cari proyek" hidden></label><button class="filter-button is-active" type="button" data-filter="all" aria-pressed="true">Semua</button>' + categories.map(([key, label]) => '<button class="filter-button" type="button" data-filter="' + escapeHtml(key) + '" aria-pressed="false">' + escapeHtml(label) + '</button>').join('')
  }
  if (!projects.length) {
    grid.replaceChildren()
    if (footer) footer.textContent = ''
    if (sectionElement) sectionElement.hidden = true
    return
  }
  if (sectionElement) sectionElement.hidden = false
  const projectMediaByProject = new Map()
  projectMedia.forEach(item => {
    if (!projectMediaByProject.has(item.project_id)) projectMediaByProject.set(item.project_id, [])
    projectMediaByProject.get(item.project_id).push(item)
  })
  const makeProjectAttributes = (project, media) => ' data-slug="' + escapeHtml(project.slug || slugifyProject(project.title)) + '" data-title="' + escapeHtml(project.title) + '" data-type="' + escapeHtml(project.category || '') + '" data-description="' + escapeHtml(project.description || project.summary || '') + '" data-technologies="' + escapeHtml((Array.isArray(project.technologies) ? project.technologies : []).join(' ')) + '" data-reel="' + escapeHtml(project.role || '') + '" data-media="' + escapeHtml(media) + '"'
  grid.innerHTML = projects.map((project, index) => {
    const category = normalizeProjectCategory(project.category || 'web-development')
    const image = project.thumbnail_url || project.cover_url || project.cover_image_url || ''
    const initials = getInitials(project.title)
    const gallery = projectMediaByProject.get(project.id) || []
    const media = JSON.stringify(gallery.map(item => ({ url: item.media_url, alt: item.alt_text || project.title, caption: item.caption || '' })))
    const technologies = Array.isArray(project.technologies) ? project.technologies.filter(Boolean).slice(0, 8) : []
    const imageMarkup = image
      ? '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(project.title) + '" loading="' + (index < 2 ? 'eager' : 'lazy') + '" decoding="async" width="1200" height="675" data-image-fallback data-fallback-label="' + initials + '"><strong class="project-card__image-fallback" hidden>' + initials + '</strong>'
      : '<strong class="project-card__image-fallback">' + escapeHtml(project.title.slice(0, 12)) + '</strong>'
    const year = project.project_year || (project.completion_date ? String(new Date(project.completion_date).getFullYear()) : '')
    const detailUrl = '/projects/' + encodeURIComponent(project.slug || slugifyProject(project.title))
    const links = '<a class="text-link" href="' + escapeHtml(detailUrl) + '">Studi kasus lengkap ↗</a>' + (project.project_url ? '<a class="text-link" href="' + escapeHtml(safeUrl(project.project_url)) + '" target="_blank" rel="noreferrer">Lihat demo ↗</a>' : '') + (project.repository_url ? '<a class="text-link" href="' + escapeHtml(safeUrl(project.repository_url)) + '" target="_blank" rel="noreferrer">Repository ↗</a>' : '')
    const attributes = makeProjectAttributes(project, media)
    return '<article class="project-card" data-project-card data-category="' + escapeHtml(category) + '" data-title="' + escapeHtml(project.title) + '" data-type="' + escapeHtml(project.category || '') + '" data-description="' + escapeHtml(project.description || project.summary || '') + '" data-technologies="' + escapeHtml(technologies.join(' ')) + '" data-reel="' + escapeHtml(project.role || '') + '"><button class="project-card__open" type="button" data-project' + attributes + ' aria-label="Preview singkat ' + escapeHtml(project.title) + '"><span class="project-card__visual" aria-label="' + escapeHtml(project.title) + '">' + imageMarkup + '</span></button><div class="project-card__body"><div class="project-card__info"><span><small>' + escapeHtml(project.category || '') + '</small><b>' + escapeHtml(project.title) + '</b></span><span class="project-card__arrow" aria-hidden="true">↗</span></div><p class="project-card__summary">' + escapeHtml(project.summary || project.description || '') + '</p><div class="project-card__meta"><span><small>Peran</small><strong>' + escapeHtml(project.role || '') + '</strong></span><span><small>Tahun</small><strong>' + escapeHtml(year) + '</strong></span><span><small>Teknologi</small><strong>' + escapeHtml(technologies.join(' · ')) + '</strong></span></div><div class="project-card__links"><a class="text-link" href="' + escapeHtml(detailUrl) + '">Studi kasus lengkap ↗</a><button class="text-link" type="button" data-project' + attributes + '>Preview singkat ↗</button>' + links.replace('<a class="text-link" href="' + escapeHtml(detailUrl) + '">Studi kasus lengkap ↗</a>', '') + '</div></div></article>'
  }).join('')
  if (footer) footer.textContent = projects.length + ' proyek'
  const projectListLink = document.querySelector('[data-project-list-link]')
  if (projectListLink) {
    const label = section?.primary_button_label || ''
    projectListLink.textContent = label
    projectListLink.hidden = !label
    if (section?.primary_button_url) projectListLink.href = safeUrl(section.primary_button_url)
  }
  document.querySelector('.filter-row')?.classList.toggle('is-simple', projects.length <= 3)
  const search = document.querySelector('[data-project-search]')
  if (search) {
    search.hidden = projects.length <= 6
    if (projects.length <= 6) search.value = ''
  }
  bindImageFallbacks(grid)
  initializeRevealUi()
}

function renderDynamicArticles(articles) {
  const grid = document.querySelector('[data-dynamic-articles]')
  if (!grid) return
  const section = document.querySelector('#notes')
  if (section) section.hidden = !articles.length
  if (!articles.length) {
    grid.replaceChildren()
    updatePublicSectionNumbers()
    return
  }
  grid.innerHTML = articles.map(article => {
    const image = article.thumbnail_url || article.cover_image_url
    const initials = getInitials(article.title)
    const imageMarkup = image
      ? '<img class="note-card__image" src="' + escapeHtml(image) + '" alt="' + escapeHtml(article.title) + '" loading="lazy" decoding="async" width="1200" height="675" data-image-fallback data-fallback-label="' + initials + '"><span class="note-card__image-fallback" hidden>' + initials + '</span>'
      : ''
    const meta = [article.category, article.reading_time ? article.reading_time + ' menit' : ''].filter(Boolean)
    const tags = Array.isArray(article.tags) ? article.tags.filter(Boolean).slice(0, 3) : []
    const tagMarkup = tags.length ? '<span class="note-card__meta">' + tags.map(tag => '<small>' + escapeHtml(tag) + '</small>').join('') + '</span>' : ''
    return '<a class="note-card" href="#contact" data-reveal>' + imageMarkup + '<span class="note-card__date">' + formatDate(article.published_at || article.created_at) + '</span><h3>' + escapeHtml(article.title) + '</h3>' + (article.excerpt ? '<p class="note-card__excerpt">' + escapeHtml(article.excerpt) + '</p>' : '') + (meta.length ? '<span class="note-card__meta">' + meta.map(value => '<small>' + escapeHtml(value) + '</small>').join(' · ') + '</span>' : '') + tagMarkup + '<span class="note-card__arrow" aria-hidden="true">↗</span></a>'
  }).join('')
  bindImageFallbacks(grid)
  initializeRevealUi()
}

function renderDynamicCertificates(certificates) {
  const container = document.querySelector('[data-dynamic-certificates]')
  if (!container) return
  if (!certificates.length) {
    container.replaceChildren()
    updateCredentialsVisibility()
    return
  }
  container.innerHTML = certificates.map(item => {
    const image = item.certificate_url || item.image_url
    const initials = getInitials(item.title)
    const imageMarkup = image
      ? '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(item.title) + '" loading="lazy" decoding="async" width="800" height="600" data-image-fallback data-fallback-label="' + initials + '"><span class="certificate-card__fallback" hidden>' + initials + '</span>'
      : '<div class="certificate-card__placeholder" aria-hidden="true">✦</div>'
    const mediaButton = '<button class="certificate-card__media" type="button" data-certificate data-title="' + escapeHtml(item.title) + '" data-issuer="' + escapeHtml(item.issuer || '') + '" data-date="' + escapeHtml(formatDate(item.issue_date)) + '" data-image="' + escapeHtml(image || '') + '" aria-label="Preview ' + escapeHtml(item.title) + '">' + imageMarkup + '</button>'
    const links = [item.credential_url ? '<a class="text-link" href="' + escapeHtml(safeUrl(item.credential_url)) + '" target="_blank" rel="noreferrer">Lihat kredensial ↗</a>' : '', item.file_url ? '<a class="text-link" href="' + escapeHtml(safeUrl(item.file_url)) + '" target="_blank" rel="noreferrer">Buka file ↗</a>' : ''].filter(Boolean).join('')
    return '<article class="certificate-card" data-reveal>' + mediaButton + '<div><p class="certificate-card__date">' + escapeHtml(formatDate(item.issue_date)) + '</p><h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.issuer || '') + '</p>' + links + '</div></article>'
  }).join('')
  bindImageFallbacks(container)
  initializeRevealUi()
  updateCredentialsVisibility()
}

function renderDynamicAchievements(achievements, section = null) {
  const container = document.querySelector('[data-dynamic-achievements]')
  const sectionElement = document.querySelector('#achievements')
  if (!container || !sectionElement) return
  if (!achievements.length || section?.is_visible === false) { sectionElement.hidden = true; updatePublicSectionNumbers(); return }
  sectionElement.hidden = false
  const title = document.querySelector('#achievements-title'); if (title && section?.title) title.textContent = section.title
  const description = document.querySelector('[data-achievements-description]'); if (description && section?.description) description.textContent = section.description
  container.innerHTML = achievements.map(item => {
    const image = item.image_url ? `<img src="${escapeHtml(item.image_url)}" alt="${escapeHtml(item.title)}" loading="lazy" width="720" height="480">` : '<span class="achievement-card__mark" aria-hidden="true">✦</span>'
    const link = [item.link_url ? `<a class="text-link" href="${escapeHtml(safeUrl(item.link_url))}" target="_blank" rel="noreferrer">Lihat pencapaian ↗</a>` : '', item.document_url ? `<a class="text-link" href="${escapeHtml(safeUrl(item.document_url))}" target="_blank" rel="noreferrer">Buka dokumen ↗</a>` : ''].filter(Boolean).join('')
    return `<article class="achievement-card" data-reveal><div class="achievement-card__media">${item.image_url ? `<button type="button" class="certificate-card__media" data-certificate data-title="${escapeHtml(item.title)}" data-issuer="${escapeHtml(item.organizer || '')}" data-image="${escapeHtml(item.image_url)}" aria-label="Preview ${escapeHtml(item.title)}">${image}</button>` : image}</div><div><p class="achievement-card__date">${escapeHtml(formatDate(item.achievement_date))}</p><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml([item.organizer, item.result].filter(Boolean).join(' · '))}</p><p class="achievement-card__description">${escapeHtml(item.description || '')}</p>${link}</div></article>`
  }).join('')
  bindImageFallbacks(container); initializeRevealUi(); updatePublicSectionNumbers()
}

function renderDynamicCustomSections(sections = []) {
  const main = document.querySelector('main')
  if (!main) return
  main.querySelectorAll('[data-custom-section]').forEach(element => element.remove())
  const contact = document.querySelector('#contact')
  sections.filter(section => section.section_key?.startsWith('custom-') && section.is_visible !== false).forEach(section => {
    const data = section.custom_data || {}
    const element = document.createElement('section')
    element.className = 'custom-section section-shell'
    element.dataset.customSection = section.section_key
    element.setAttribute('aria-labelledby', section.section_key + '-title')
    const image = section.image_url ? `<img src="${escapeHtml(section.image_url)}" alt="${escapeHtml(section.title || '')}" loading="lazy" width="900" height="600">` : ''
    const button = data.button_label && data.button_url ? `<a class="button button--soft" href="${escapeHtml(safeUrl(data.button_url))}">${escapeHtml(data.button_label)} ↗</a>` : ''
    element.innerHTML = `<div class="section-intro"><span class="section-number" data-section-number></span><span class="eyebrow">${escapeHtml(section.eyebrow || '')}</span></div><div class="section-heading section-heading--split"><div><h2 id="${escapeHtml(section.section_key)}-title">${escapeHtml(section.title || '')}</h2><p>${escapeHtml(section.description || '')}</p>${button}</div>${image ? `<div class="custom-section__image">${image}</div>` : ''}</div><div class="custom-section__content">${escapeHtml(data.content || '').replace(/\r?\n\r?\n/g, '</p><p>').replace(/\r?\n/g, '<br>')}</div>`
    const firstParagraph = element.querySelector('.custom-section__content')
    if (firstParagraph && data.content) firstParagraph.innerHTML = '<p>' + escapeHtml(data.content).replace(/\r?\n\r?\n/g, '</p><p>').replace(/\r?\n/g, '<br>') + '</p>'
    if (contact) main.insertBefore(element, contact)
    else main.append(element)
  })
  reorderPublicSections(sections)
  updatePublicSectionNumbers()
}

function renderDynamicTestimonials(testimonials) {
  const container = document.querySelector('[data-dynamic-testimonials]')
  if (!container) return
  if (!testimonials.length) {
    container.replaceChildren()
    updateCredentialsVisibility()
    return
  }
  container.innerHTML = testimonials.map(item => {
    const initials = getInitials(item.author_name)
    const avatar = item.avatar_url
      ? '<img src="' + escapeHtml(item.avatar_url) + '" alt="Foto ' + escapeHtml(item.author_name) + '" loading="lazy" decoding="async" width="96" height="96" data-image-fallback data-fallback-label="' + initials + '"><span class="testimonial-card__avatar testimonial-card__avatar--fallback" hidden>' + initials + '</span>'
      : '<span class="testimonial-card__avatar" aria-hidden="true">' + initials + '</span>'
    return '<article class="testimonial-card" data-reveal><span class="testimonial-card__quote">“</span><blockquote>' + escapeHtml(item.quote) + '</blockquote><div class="testimonial-card__author">' + avatar + '<span><strong>' + escapeHtml(item.author_name) + '</strong><small>' + escapeHtml(item.author_role || '') + '</small></span></div></article>'
  }).join('')
  bindImageFallbacks(container)
  initializeRevealUi()
  updateCredentialsVisibility()
}

function updateCredentialsVisibility() {
  const section = document.querySelector('#credentials')
  if (!section) return
  const certificateCount = document.querySelectorAll('[data-dynamic-certificates] > .certificate-card').length
  const testimonialCount = document.querySelectorAll('[data-dynamic-testimonials] > .testimonial-card').length
  section.hidden = certificateCount + testimonialCount === 0
  updatePublicSectionNumbers()
}

function renderSocialLinks(links) {
  document.querySelectorAll('[data-social-links]').forEach(container => {
    const scope = container.dataset.socialScope
    const visibilityField = scope === 'hero' ? 'show_in_hero' : scope === 'contact' ? 'show_in_contact' : 'show_in_footer'
    const visibleLinks = links.filter(link => link[visibilityField] !== false && link.is_active !== false && link.url && safeUrl(link.url) !== '#')
    container.innerHTML = visibleLinks.map(link => `<a href="${escapeHtml(safeUrl(link.url))}" ${link.open_in_new_tab ? 'target="_blank" rel="noreferrer"' : ''}>${escapeHtml(link.label)} ↗</a>`).join('')
  })
}

function showPublicConfigNotice(message = 'Konten publik belum tersedia.') {
  const announcement = document.querySelector('.announcement span')
  if (announcement) announcement.textContent = 'Konten publik belum tersedia'
  document.documentElement.dataset.contentNotice = message
  let notice = document.querySelector('[data-public-load-notice]')
  if (!notice) {
    notice = document.createElement('p')
    notice.dataset.publicLoadNotice = ''
    notice.className = 'public-empty-state section-shell'
    notice.setAttribute('role', 'status')
    document.querySelector('main')?.prepend(notice)
  }
  notice.textContent = message
}

function setPublicLoadingState(message = 'Memuat konten Supabase...') {
  document.querySelectorAll('[data-dynamic-capabilities], [data-dynamic-educations], [data-dynamic-experiences], [data-dynamic-projects], [data-dynamic-articles], [data-dynamic-certificates], [data-dynamic-achievements], [data-dynamic-testimonials]').forEach(container => {
    container.innerHTML = '<div class="public-skeleton" aria-label="' + escapeHtml(message) + '"><span></span><span></span><span></span></div>'
  })
  const stats = document.querySelector('[data-dynamic-stats]')
  if (stats) stats.innerHTML = '<div class="public-skeleton public-skeleton--stats" aria-label="' + escapeHtml(message) + '"><span></span><span></span></div>'
}

function initializeTheme() {
  const root = document.documentElement
  const toggle = document.querySelector('[data-theme-toggle]')
  if (!toggle || root.dataset.themeReady === 'true') return
  const storedTheme = localStorage.getItem('portfolio-theme')
  const initialTheme = storedTheme === 'light' || storedTheme === 'dark'
    ? storedTheme
    : (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  root.dataset.theme = initialTheme
  const update = () => {
    const isDark = root.dataset.theme === 'dark'
    toggle.setAttribute('aria-label', isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap')
    toggle.setAttribute('aria-pressed', String(isDark))
  }
  update()
  delegate(document, 'click', '[data-theme-toggle]', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('portfolio-theme', root.dataset.theme)
    update()
  }, 'bworieyTheme')
  root.dataset.themeReady = 'true'
}

function updateNavigationVisibility(visibility = {}) {
  Object.entries(visibility).forEach(([id, visible]) => {
    document.querySelectorAll('a[href="#' + id + '"]').forEach(link => {
      link.hidden = !visible
    })
  })
}

function initializeRoleTyping(element = document.querySelector('[data-role]'), roles = null) {
  const roleElement = element
  let roleList = roles || []
  try { if (!roleList.length) roleList = roleElement?.dataset.roles ? JSON.parse(roleElement.dataset.roles) : [] } catch { roleList = [] }
  if (!roleElement || !roleList.length || roleElement.dataset.rotationStarted) return
  roleElement.dataset.rotationStarted = 'true'
  roleElement.textContent = roleList[0]
  if (roleList.length === 1 || reduceMotion) return
  let roleIndex = 0
  const rotate = () => {
    roleElement.classList.add('is-changing')
    window.setTimeout(() => {
      roleIndex = (roleIndex + 1) % roleList.length
      roleElement.textContent = roleList[roleIndex]
      roleElement.classList.remove('is-changing')
    }, 180)
  }
  roleElement.dataset.rotationTimer = String(window.setInterval(rotate, 3200))
}

function bindProjectInteractions() {
  if (document.documentElement.dataset.projectInteractionsReady === 'true') {
    applyProjectFilter({
      category: document.querySelector('[data-filter].is-active')?.dataset.filter || 'all',
      search: document.querySelector('[data-project-search]')?.value || ''
    })
    return
  }
  const search = document.querySelector('[data-project-search]')
  const updateFilter = () => applyProjectFilter({
    category: document.querySelector('[data-filter].is-active')?.dataset.filter || 'all',
    search: search?.value || ''
  })
  const debouncedSearch = createProjectSearchHandler(updateFilter)
  delegate(document, 'click', '[data-filter]', (event, button) => {
    document.querySelectorAll('[data-filter]').forEach(item => {
      const active = item === button
      item.classList.toggle('is-active', active)
      item.setAttribute('aria-pressed', String(active))
    })
    updateFilter()
  }, 'bworieyFilter')
  delegate(document, 'input', '[data-project-search]', () => debouncedSearch(), 'bworieyFilter')
  delegate(document, 'click', '[data-project]', (event, card) => {
    const dialog = document.querySelector('[data-project-dialog]')
    if (!dialog) return
    document.querySelector('[data-dialog-title]').textContent = card.dataset.title || ''
    document.querySelector('[data-dialog-type]').textContent = card.dataset.type || ''
    document.querySelector('[data-dialog-description]').textContent = card.dataset.description || ''
    document.querySelector('[data-dialog-reel]').textContent = card.dataset.reel || '—'
    document.querySelector('[data-dialog-detail]')?.setAttribute('href', '/projects/' + encodeURIComponent(card.dataset.slug || slugifyProject(card.dataset.title || 'project')))
    const gallery = document.querySelector('[data-dialog-gallery]')
    if (gallery) {
      let media = []
      try { media = JSON.parse(card.dataset.media || '[]') } catch { media = [] }
      gallery.replaceChildren(...media.map(item => {
        const figure = document.createElement('figure')
        const image = document.createElement('img')
        image.src = item.url
        image.alt = item.alt || card.dataset.title || 'Media proyek'
        image.loading = 'lazy'
        image.decoding = 'async'
        image.width = 1200
        image.height = 675
        const caption = document.createElement('figcaption')
        caption.textContent = item.caption || ''
        figure.append(image, caption)
        return figure
      }))
      gallery.hidden = !media.length
    }
    openModal(dialog, card)
  }, 'bworieyProject')
  delegate(document, 'click', '[data-dialog-contact]', () => {
    closeModal(document.querySelector('[data-project-dialog]'))
  }, 'bworieyModal')
  delegate(document, 'click', '[data-certificate]', (event, card) => {
    const dialog = document.querySelector('[data-certificate-dialog]')
    if (!dialog) return
    document.querySelector('[data-certificate-dialog-title]').textContent = card.dataset.title || 'Sertifikat'
    document.querySelector('[data-certificate-dialog-meta]').textContent = [card.dataset.issuer, card.dataset.date].filter(Boolean).join(' · ')
    const image = document.querySelector('[data-certificate-dialog-image]')
    if (image) {
      image.hidden = !card.dataset.image
      image.src = card.dataset.image || ''
      image.alt = card.dataset.title || 'Preview sertifikat'
    }
    openModal(dialog, card)
  }, 'bworieyCertificate')
  document.documentElement.dataset.projectInteractionsReady = 'true'
  updateFilter()
}

function initializeContactForm() {
  const form = document.querySelector('[data-contact-form]')
  const status = document.querySelector('[data-form-status]')
  if (!form || form.dataset.bound === 'true') return
  form.dataset.bound = 'true'
  const messageField = form.elements.message
  const characterCount = form.querySelector('[data-character-count]')
  const updateCharacterCount = () => { if (characterCount && messageField) characterCount.textContent = `${messageField.value.length}/${messageField.maxLength || 5000}` }
  messageField?.addEventListener('input', updateCharacterCount)
  updateCharacterCount()
  form.addEventListener('submit', async event => {
    event.preventDefault()
    resetFormState(form, status)
    ;[form.elements.name, form.elements.email, form.elements.message].forEach(field => {
      if (!field?.checkValidity()) setFieldError(field, field?.validationMessage || 'Periksa isian ini.')
    })
    if (!form.checkValidity()) { form.reportValidity(); return }
    setFormSubmitting(form, true)
    status.textContent = 'Mengirim pesan…'
    if (!supabase) {
      status.textContent = 'Form kontak belum terhubung.'
      setFormSubmitting(form, false)
      return
    }
    try {
      let response = await supabase.rpc('submit_contact_message', { message_name: form.elements.name.value.trim(), message_email: form.elements.email.value.trim(), message_subject: form.elements.subject?.value.trim() || '', message_body: form.elements.message.value.trim(), honeypot: form.elements.website?.value || '' })
      if (response.error?.code === '42883') response = await supabase.rpc('submit_contact_message', { message_name: form.elements.name.value.trim(), message_email: form.elements.email.value.trim(), message_body: form.elements.message.value.trim(), honeypot: form.elements.website?.value || '' })
      if (response.error) throw response.error
      status.textContent = 'Pesan berhasil dikirim. Terima kasih.'
      showToast('Pesan berhasil dikirim.')
      form.reset()
      updateCharacterCount()
    } catch (error) {
      console.error('Gagal mengirim pesan:', { code: error?.code || null, message: error?.message || 'Unknown error', details: error?.details || null, hint: error?.hint || null })
      status.textContent = 'Pesan belum dapat dikirim. Coba lagi atau kirim email langsung.'
      showToast('Pesan belum terkirim.', 'error')
    } finally {
      setFormSubmitting(form, false)
    }
  })
}

function initializeCopyEmail() {
  if (document.documentElement.dataset.copyEmailReady === 'true') return
  delegate(document, 'click', '[data-copy-email]', async (event, button) => {
    const email = button.dataset.email
    if (!email) return
    try { await navigator.clipboard.writeText(email); showToast('Email disalin.') } catch { showToast(email, 'info') }
  }, 'bworieyFeedback')
  document.documentElement.dataset.copyEmailReady = 'true'
}

function slugifyProject(value) {
  return String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'project'
}

function initializeCopyPortfolio() {
  if (document.documentElement.dataset.copyPortfolioReady === 'true') return
  delegate(document, 'click', '[data-copy-portfolio]', async () => {
    const url = window.location.origin + window.location.pathname
    try { await navigator.clipboard.writeText(url); showToast('Link portfolio disalin.') } catch { showToast(url, 'info') }
  }, 'bworieyPortfolioLink')
  document.documentElement.dataset.copyPortfolioReady = 'true'
}

function initializeYear() {
  const year = document.querySelector('[data-year]')
  if (year) year.textContent = new Date().getFullYear()
}
