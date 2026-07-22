import { supabase, supabaseConfiguration } from '../supabase.js'
import { escapeHtml, formatDate, safeUrl, showToast } from './utils.js'
import { getPublicContent } from './services/public-content-service.js'
import { delegate, prefersReducedMotion } from './ui/jquery-ui.js'
import { initializeNavigation as initializeNavigationUi, initializeHeaderScroll as initializeHeaderScrollUi, initializeSectionNavigation as initializeSectionNavigationUi, initializeSmoothScroll as initializeSmoothScrollUi } from './ui/navigation.js'
import { closeModal, openModal } from './ui/modal.js'
import { applyProjectFilter, createProjectSearchHandler } from './ui/filters.js'
import { resetFormState, setFieldError, setFormSubmitting } from './ui/form-feedback.js'
import { initializeRevealAnimations as initializeRevealUi } from './ui/scroll-effects.js'

const reduceMotion = prefersReducedMotion()

export function initializePublic() {
  initializeTheme()
  initializeNavigationUi()
  initializeHeaderScrollUi()
  initializeSectionNavigationUi()
  initializeRevealUi()
  initializeCopyEmail()
  initializeSmoothScrollUi()
  initializeYear()
  initializeContactForm()
  setPublicLoadingState()
  loadDynamicPageContent()
}

async function loadDynamicPageContent() {
  if (!supabaseConfiguration.ready || !supabase) { showPublicConfigNotice(); return }
  const content = await getPublicContent()
  const settings = content.settings.data
  const profile = content.profile
  const sections = content.sections.data
  const hero = sections.find(section => section.section_key === 'hero')
  applySiteIdentity(settings, profile)
  applyDynamicSectionSettings(sections)
  renderDynamicNavigation(content.navigation.data)
  renderDynamicMarquee(settings, hero)
  renderDynamicAbout(sections.find(section => section.section_key === 'about'), profile, settings)
  renderDynamicCapabilities(content.skills.data, content.services.data)
  renderDynamicStats(content.statistics.data, content.statistics.counts)
  renderDynamicProcess(sections.find(section => section.section_key === 'process'))
  renderDynamicEducations(content.educations.data)
  renderDynamicExperiences(content.experiences.data)
  renderDynamicProjects(content.projects.data, content.projectMedia.data)
  renderDynamicArticles(content.articles.data)
  renderDynamicCertificates(content.certificates.data)
  renderDynamicTestimonials(content.testimonials.data)
  renderSocialLinks(content.socialLinks.data)
  initializeRoleTyping(document.querySelector('[data-role]'), hero?.custom_data?.roles || [])
  bindProjectInteractions()
  updateNavigationVisibilityFromSections(sections, content)
  document.documentElement.classList.add('content-ready')
  const results = [content.settings, content.sections, content.navigation, content.projects, content.projectMedia, content.articles, content.skills, content.services, content.educations, content.experiences, content.certificates, content.testimonials, content.socialLinks]
  if (results.some(result => !result.ok)) showToast('Sebagian konten belum dapat dimuat. Silakan coba lagi nanti.', 'error')
}

function applyDynamicSectionSettings(sections = []) {
  if (!sections.length) return
  const sectionElements = { hero: '#hero', about: '#about', statistics: '#about', skills: '#capabilities', services: '#capabilities', featured_projects: '#work', projects: '#work', experiences: '#experience', educations: '#education', articles: '#notes', certificates: '#credentials', testimonials: '#credentials', contact: '#contact', cta: '#contact', process: '#process' }
  const titleSelectors = { hero: '[data-hero-title]', about: '#statement-title', skills: '#capabilities-title', services: '#capabilities-title', projects: '#work-title', featured_projects: '#work-title', experiences: '#experience-title', educations: '#education-title', articles: '#notes-title', certificates: '#credentials-title', testimonials: '#credentials-title', contact: '#contact-title', cta: '#contact-title', process: '#process-title' }
  const visibleKeys = new Set(sections.map(section => section.section_key))
  const uniqueElements = new Map()
  sections.forEach(section => {
    const selector = sectionElements[section.section_key]; const element = selector ? document.querySelector(selector) : null
    if (!element) return
    uniqueElements.set(selector, element)
    const titleSelector = titleSelectors[section.section_key]
    const title = titleSelector ? document.querySelector(titleSelector) : null
    if (title && section.title) title.textContent = section.title
    const eyebrow = element.querySelector('.eyebrow')
    if (eyebrow && section.eyebrow) eyebrow.textContent = `{ ${section.eyebrow} }`
    const description = element.querySelector('.section-heading > p') || element.querySelector('.statement__aside > p') || element.querySelector('[data-contact-description]')
    if (description && section.description) description.textContent = section.description
    const primary = element.querySelector('[data-section-primary]'); const secondary = element.querySelector('[data-section-secondary]')
    if (primary) { primary.textContent = section.primary_button_label || primary.dataset.fallbackLabel || ''; primary.hidden = !section.primary_button_label; if (section.primary_button_url) primary.href = safeUrl(section.primary_button_url) }
    if (secondary) { secondary.textContent = section.secondary_button_label || secondary.dataset.fallbackLabel || ''; secondary.hidden = !section.secondary_button_label; if (section.secondary_button_url) secondary.href = safeUrl(section.secondary_button_url) }
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
  const configuredKeys = new Set(sections.map(section => section.section_key))
  Object.entries(sectionElements).forEach(([key, selector]) => {
    const element = document.querySelector(selector)
    if (!element) return
    if (configuredKeys.has(key)) element.hidden = !uniqueElements.has(selector)
  })
  const main = document.querySelector('main'); if (!main) return
  const originalChildren = [...main.children]; const ordered = []; const seen = new Set()
  const heroElement = document.querySelector('#hero')
  const marqueeElement = main.querySelector('.marquee')
  if (heroElement) { ordered.push(heroElement); seen.add(heroElement) }
  if (marqueeElement) { ordered.push(marqueeElement); seen.add(marqueeElement) }
  sections.sort((a, b) => a.sort_order - b.sort_order).forEach(section => { const selector = sectionElements[section.section_key]; const element = selector ? document.querySelector(selector) : null; if (element && element.parentElement === main && !seen.has(element)) { ordered.push(element); seen.add(element) } })
  originalChildren.forEach(element => { if (!seen.has(element)) ordered.push(element) }); ordered.forEach(element => main.appendChild(element))
}

function renderDynamicNavigation(items = []) {
  if (!items.length) return
  const desktop = document.querySelector('.desktop-nav'); const mobile = document.querySelector('.mobile-nav')
  const itemMarkup = (item, mobileMode = false, index = 0) => `<a href="${escapeHtml(safeUrl(item.href))}" target="${item.target === '_blank' ? '_blank' : '_self'}" ${item.target === '_blank' ? 'rel="noreferrer"' : ''}>${escapeHtml(item.label)}${mobileMode ? ` <span>${String(index + 1).padStart(2, '0')}</span>` : ''}</a>`
  if (desktop) desktop.innerHTML = items.map(item => itemMarkup(item)).join('')
  if (mobile) mobile.innerHTML = items.map((item, index) => itemMarkup(item, true, index)).join('')
  initializeSectionNavigationUi()
}

function renderDynamicMarquee(settings, hero) {
  const track = document.querySelector('[data-dynamic-marquee]'); if (!track) return
  const items = hero?.custom_data?.marquee_items || settings.marquee_items || ['Desain', 'Kode', 'Produk', 'Sistem']
  track.innerHTML = [...items, ...items].map(item => `<span>${escapeHtml(item)}</span><b aria-hidden="true">✳</b>`).join('')
}

function renderDynamicAbout(section, profile = null, settings = {}) {
  if (!section) return
  const data = section.custom_data || {}
  const short = document.querySelector('[data-about-short]'); const long = document.querySelector('[data-about-long]')
  if (short && data.bio_short) short.textContent = data.bio_short
  if (long && (data.bio_long || section.description)) long.textContent = data.bio_long || section.description
  const facts = document.querySelector('[data-about-facts]')
  if (facts) facts.innerHTML = (data.facts || []).map(fact => `<span><small>${escapeHtml(fact.label)}</small><strong>${escapeHtml(fact.value)}</strong></span>`).join('')
  const image = section.image_url || profile?.avatar_url || ''
  const imageContainer = document.querySelector('[data-about-image]')
  if (imageContainer) {
    const initials = getInitials(profile?.full_name || settings.owner_name || 'BW')
    imageContainer.innerHTML = image
      ? '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(profile?.full_name || settings.owner_name || 'Profil BWORIEY') + '" loading="lazy" decoding="async" width="900" height="600" data-image-fallback data-fallback-label="' + initials + '"><span class="hero__portrait-fallback" hidden>' + initials + '</span>'
      : '<span class="hero__portrait-fallback">' + initials + '</span>'
    bindImageFallbacks(imageContainer)
  }
  const caption = document.querySelector('[data-about-caption]')
  if (caption && (data.caption || section.subtitle)) caption.textContent = data.caption || section.subtitle
  const resume = document.querySelector('[data-resume-link]')
  const resumeUrl = settings.resume_url || settings.resume || ''
  if (resume) {
    resume.hidden = !resumeUrl
    if (resumeUrl) resume.href = safeUrl(resumeUrl)
  }
}

function renderDynamicProcess(section) {
  const container = document.querySelector('[data-dynamic-process]'); if (!container || !section) return
  const steps = section.custom_data?.steps || []
  container.innerHTML = steps.map((step, index) => `<article data-reveal><span>${String(index + 1).padStart(2, '0')}</span><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.description)}</p></article>`).join('')
  initializeRevealUi()
}

function updateNavigationVisibilityFromSections(sections, content) {
  const visible = new Set(sections.map(section => section.section_key))
  updateNavigationVisibility({ about: visible.has('about'), capabilities: visible.has('skills') || visible.has('services'), work: visible.has('projects') && content.projects.data.length > 0, experience: visible.has('experiences'), education: visible.has('educations'), notes: visible.has('articles'), credentials: visible.has('certificates') || visible.has('testimonials'), contact: visible.has('contact') })
}

function applySiteIdentity(settings, profile) {
  const siteName = settings.site_name || settings.studio_name || 'bworiey'
  const displayName = settings.owner_name || profile?.full_name || siteName
  const description = settings.site_description || 'Portfolio digital bworiey.'
  const email = settings.owner_email || profile?.email || settings.public_email || settings.business_email || ''
  const location = settings.owner_location || [profile?.city || settings.city, profile?.country || settings.country].filter(Boolean).join(', ') || 'Indonesia'
  const heroImage = settings.hero_image_url || settings.hero_image || profile?.avatar_url || ''
  const siteLogo = settings.site_logo || settings.logo_url || ''

  document.title = settings.default_meta_title || `${siteName} — Portfolio digital`
  document.querySelector('meta[name="description"]')?.setAttribute('content', settings.default_meta_description || description)
  if (settings.og_image_url || settings.og_image) document.querySelector('meta[property="og:image"]')?.setAttribute('content', settings.og_image_url || settings.og_image)
  if (settings.favicon_url || settings.site_favicon) document.querySelector('link[rel="icon"]')?.setAttribute('href', settings.favicon_url || settings.site_favicon)
  const heroPortrait = document.querySelector('.hero__portrait')
  if (heroPortrait) {
    const initials = escapeHtml(getInitials(displayName))
    heroPortrait.setAttribute('aria-label', 'Foto profil ' + escapeHtml(displayName))
    heroPortrait.innerHTML = heroImage
      ? '<img src="' + escapeHtml(heroImage) + '" alt="' + escapeHtml(displayName) + '" loading="eager" decoding="async" width="900" height="1125" data-image-fallback data-fallback-label="' + initials + '"><span class="hero__portrait-fallback" hidden>' + initials + '</span><span class="hero__portrait-caption">Ide<br />yang bergerak</span>'
      : '<span class="hero__portrait-fallback">' + initials + '</span><span class="hero__portrait-caption">Ide<br />yang bergerak</span>'
  }
  document.querySelectorAll('[data-site-name]').forEach(element => { element.textContent = siteName })
  document.querySelectorAll('[data-site-owner-name]').forEach(element => { element.textContent = displayName })
  document.querySelectorAll('[data-site-mark]').forEach(element => { element.textContent = siteName.slice(0, 1).toUpperCase() })
  const logoElement = document.querySelector('[data-site-logo]')
  if (logoElement && siteLogo) logoElement.innerHTML = '<img src="' + escapeHtml(siteLogo) + '" alt="Logo ' + escapeHtml(siteName) + '" loading="eager" decoding="async" width="54" height="54" data-image-fallback data-fallback-label="' + escapeHtml(siteName.slice(0, 1).toUpperCase()) + '"><span hidden>' + escapeHtml(siteName.slice(0, 1).toUpperCase()) + '</span>'
  document.querySelectorAll('[data-site-location]').forEach(element => { element.textContent = location })
  document.querySelectorAll('[data-site-tagline]').forEach(element => { element.textContent = settings.site_tagline || description })
  document.querySelector('[data-availability]')?.replaceChildren(document.createTextNode(settings.availability_label || 'Terbuka untuk kolaborasi pilihan'))
  document.querySelector('[data-hero-badge]')?.replaceChildren(document.createTextNode(settings.hero_badge || 'Portfolio digital'))
  document.querySelector('#hero-title')?.replaceChildren(document.createTextNode(settings.hero_title || 'Membangun pengalaman digital yang berarti.'))
  const heroIntro = document.querySelector('[data-hero-intro]')
  if (heroIntro) heroIntro.innerHTML = `${escapeHtml(settings.hero_description || profile?.bio || 'Saya membangun aplikasi web yang dinamis, mudah digunakan, dan berorientasi pada pengalaman pengguna.')} <span class="accent-green" data-role data-roles='${escapeHtml(JSON.stringify(settings.professional_titles || []))}'></span>`
  document.querySelector('[data-about-short]')?.replaceChildren(document.createTextNode(profile?.bio || 'Desain yang jelas, teknologi yang tepat, dan pengalaman yang terasa manusiawi.'))
  document.querySelector('[data-about-long]')?.replaceChildren(document.createTextNode(settings.about_text || 'Dari ide pertama hingga produk yang siap digunakan, setiap detail dibangun dengan tujuan.'))
  document.querySelector('[data-contact-description]')?.replaceChildren(document.createTextNode(settings.site_tagline || 'Ceritakan apa yang sedang Anda bangun dan mari temukan cara terbaik untuk membuatnya bergerak.'))
  document.querySelectorAll('[data-contact-email]').forEach(element => {
    if (!email) { element.hidden = true; return }
    element.hidden = false
    element.textContent = `${email} ↗`
    element.setAttribute('href', `mailto:${email}`)
  })
  document.querySelector('[data-contact-location]')?.replaceChildren(document.createTextNode(location))
  document.querySelector('[data-footer-name]')?.replaceChildren(document.createTextNode(displayName))
  document.querySelector('[data-footer-location]')?.replaceChildren(document.createTextNode(location))
  document.querySelectorAll('[data-copy-email]').forEach(button => { if (email) button.dataset.email = email })
  const roles = Array.isArray(settings.professional_titles) ? settings.professional_titles : []
  const roleElement = document.querySelector('[data-role]')
  if (roleElement && roles.length) roleElement.dataset.roles = JSON.stringify(roles)
  bindImageFallbacks()
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
    setImageFallback(image, image.dataset.fallbackLabel || 'BW')
  })
}

function getInitials(value = '') {
  const words = String(value).trim().split(/\s+/).filter(Boolean)
  return (words.length > 1 ? words.slice(0, 2).map(word => word[0]) : [words[0]?.[0] || 'B']).join('').toUpperCase()
}

function renderDynamicCapabilities(skills, services) {
  const container = document.querySelector('[data-dynamic-capabilities]')
  if (!container) return
  const records = skills.map(item => ({ title: item.name, description: item.description, type: item.category || 'Keahlian', level: item.level })).concat(services.map(item => ({ title: item.title, description: item.description, type: 'Layanan', image: item.icon_url })))
  if (!records.length) {
    container.innerHTML = '<div class="public-empty-state">Konten keahlian dan layanan belum tersedia. Tambahkan dari panel admin agar bagian ini tampil.</div>'
    return
  }
  container.innerHTML = records.map((record, index) => {
    const visual = record.image
      ? '<img src="' + escapeHtml(record.image) + '" alt="Ikon ' + escapeHtml(record.title) + '" loading="lazy" decoding="async" width="96" height="96" data-image-fallback data-fallback-label="' + getInitials(record.title) + '"><span class="capability__visual-fallback" hidden>' + getInitials(record.title) + '</span>'
      : '<span>' + String(index + 1).padStart(2, '0') + '</span>'
    return '<article class="capability" data-reveal><div class="capability__visual" aria-hidden="true">' + visual + '</div><div class="capability__content"><div class="capability__meta"><span class="category-label">' + escapeHtml(record.type) + '</span><span>' + String(index + 1).padStart(2, '0') + '</span></div><h3>' + escapeHtml(record.title) + '</h3><p>' + escapeHtml(record.description || 'Deskripsi akan ditambahkan segera.') + '</p></div></article>'
  }).join('')
  bindImageFallbacks(container)
  initializeRevealUi()
}

function renderDynamicStats(statistics = [], counts = {}) {
  const container = document.querySelector('[data-dynamic-stats]')
  if (!container) return
  if (!Array.isArray(statistics) && statistics) { counts = Object.fromEntries(['projects', 'skills', 'experiences', 'certificates', 'articles'].map(key => [key, statistics[key]?.length || 0])); statistics = [] }
  const rows = Array.isArray(statistics) && statistics.length ? statistics : [['Proyek', counts.projects || 0], ['Keahlian', counts.skills || 0], ['Pengalaman', counts.experiences || 0], ['Sertifikat', counts.certificates || 0], ['Artikel', counts.articles || 0]].map(([label, value]) => ({ label, value }))
  container.innerHTML = rows.map(row => '<span><strong>' + escapeHtml(String(row.value ?? 0)) + '</strong><small>' + escapeHtml(row.label) + escapeHtml(row.suffix || '') + '</small></span>').join('')
}

function renderDynamicEducations(educations) {
  const container = document.querySelector('[data-dynamic-educations]')
  if (!container) return

  if (!educations.length) {
    container.innerHTML = '<div class="public-empty-state">Belum ada data pendidikan yang dipublikasikan.</div>'
    return
  }

  container.innerHTML = educations.map(education => {
    const initials = getInitials(education.institution)
    const logo = education.logo_url
      ? '<span class="education-card__brand"><img src="' + escapeHtml(education.logo_url) + '" alt="Logo ' + escapeHtml(education.institution) + '" loading="lazy" decoding="async" width="88" height="88" data-image-fallback data-fallback-label="' + initials + '"><span class="education-card__fallback" hidden>' + initials + '</span></span>'
      : '<span class="education-card__brand education-card__brand--fallback" aria-hidden="true">' + initials + '</span>'
    const period = education.is_current ? formatDate(education.start_date) + ' — Sekarang' : formatDate(education.start_date) + ' — ' + formatDate(education.end_date)
    return '<article class="education-card" data-reveal><div class="education-card__period">' + logo + '<span>' + escapeHtml(period) + '</span></div><div><h3>' + escapeHtml(education.degree || 'Pendidikan') + '</h3><p class="education-card__institution">' + escapeHtml(education.institution) + '</p><p>' + escapeHtml([education.field_of_study, education.location, education.description].filter(Boolean).join(' · ')) + '</p></div></article>'
  }).join('')
  bindImageFallbacks(container)
  initializeRevealUi()
}

function renderDynamicExperiences(experiences) {
  const container = document.querySelector('[data-dynamic-experiences]')
  if (!container) return
  if (!experiences.length) {
    container.innerHTML = '<div class="public-empty-state">Belum ada data pengalaman yang dipublikasikan.</div>'
    return
  }
  container.innerHTML = experiences.map(item => {
    const initials = getInitials(item.company)
    const logo = item.logo_url
      ? '<img class="experience-card__logo" src="' + escapeHtml(item.logo_url) + '" alt="Logo ' + escapeHtml(item.company) + '" loading="lazy" decoding="async" width="88" height="88" data-image-fallback data-fallback-label="' + initials + '"><span class="experience-card__fallback" hidden>' + initials + '</span>'
      : '<span class="experience-card__logo experience-card__logo--fallback" aria-hidden="true">' + initials + '</span>'
    return '<article class="experience-card" data-reveal><div class="experience-card__period">' + logo + '<span>' + escapeHtml(item.is_current ? formatDate(item.start_date) + ' — Sekarang' : formatDate(item.start_date) + ' — ' + formatDate(item.end_date)) + '</span></div><div><p class="experience-card__company">' + escapeHtml(item.company) + '</p><h3>' + escapeHtml(item.role_title) + '</h3><p>' + escapeHtml([item.location, item.description].filter(Boolean).join(' · ')) + '</p></div></article>'
  }).join('')
  bindImageFallbacks(container)
  initializeRevealUi()
}

function renderDynamicProjects(projects, projectMedia = []) {
  const grid = document.querySelector('[data-dynamic-projects]')
  const footer = document.querySelector('[data-project-count]')
  if (!grid) return
  if (!projects.length) {
    grid.innerHTML = '<div class="public-empty-state">Belum ada proyek yang dipublikasikan.</div>'
    if (footer) footer.textContent = 'Belum ada proyek dipublikasikan'
    return
  }
  const mediaByProject = new Map()
  projectMedia.forEach(item => {
    if (!mediaByProject.has(item.project_id)) mediaByProject.set(item.project_id, [])
    mediaByProject.get(item.project_id).push(item)
  })
  grid.innerHTML = projects.map((project, index) => {
    const category = (project.category || 'digital').toLowerCase().replace(/[^a-z0-9-]/g, '')
    const image = project.thumbnail_url || project.cover_url || project.cover_image_url
    const initials = getInitials(project.title)
    const gallery = mediaByProject.get(project.id) || []
    const media = JSON.stringify(gallery.map(item => ({ url: item.media_url, alt: item.alt_text || project.title, caption: item.caption || '' })))
    const technologies = Array.isArray(project.technologies) ? project.technologies.filter(Boolean).slice(0, 3) : []
    const imageMarkup = image
      ? '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(project.title) + '" loading="' + (index < 2 ? 'eager' : 'lazy') + '" decoding="async" width="1200" height="675" data-image-fallback data-fallback-label="' + initials + '"><strong class="project-card__image-fallback" hidden>' + initials + '</strong>'
      : '<strong class="project-card__image-fallback">' + escapeHtml(project.title.slice(0, 12)) + '</strong>'
    const tags = technologies.length ? '<span class="project-card__tags">' + technologies.map(technology => '<small>' + escapeHtml(technology) + '</small>').join('') + '</span>' : ''
    return '<button class="project-card ' + (index === 0 ? 'project-card--wide' : '') + '" type="button" data-project data-category="' + escapeHtml(category) + '" data-title="' + escapeHtml(project.title) + '" data-type="' + escapeHtml(project.category || 'Project') + '" data-description="' + escapeHtml(project.summary || project.description || '') + '" data-technologies="' + escapeHtml(technologies.join(' ')) + '" data-reel="' + escapeHtml(safeUrl(project.project_url, '')) + '" data-media="' + escapeHtml(media) + '" data-reveal><span class="project-card__visual" aria-label="' + escapeHtml(project.title) + '">' + imageMarkup + '</span><span class="project-card__info"><span><b>' + escapeHtml(project.title) + '</b><small>' + escapeHtml(project.category || 'Proyek') + '</small>' + tags + '</span><span class="project-card__arrow" aria-hidden="true">↗</span></span></button>'
  }).join('')
  if (footer) footer.textContent = `${projects.length} proyek dipublikasikan`
  bindImageFallbacks(grid)
  initializeRevealUi()
}

function renderDynamicArticles(articles) {
  const grid = document.querySelector('[data-dynamic-articles]')
  if (!grid) return
  if (!articles.length) {
    grid.innerHTML = '<div class="public-empty-state">Belum ada artikel yang dipublikasikan.</div>'
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
    container.innerHTML = '<div class="public-empty-state">Belum ada sertifikat yang dipublikasikan.</div>'
    return
  }
  container.innerHTML = certificates.map(item => {
    const image = item.certificate_url || item.image_url
    const initials = getInitials(item.title)
    const imageMarkup = image
      ? '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(item.title) + '" loading="lazy" decoding="async" width="800" height="600" data-image-fallback data-fallback-label="' + initials + '"><span class="certificate-card__fallback" hidden>' + initials + '</span>'
      : '<div class="certificate-card__placeholder" aria-hidden="true">✦</div>'
    const mediaButton = '<button class="certificate-card__media" type="button" data-certificate data-title="' + escapeHtml(item.title) + '" data-issuer="' + escapeHtml(item.issuer || 'Sertifikat') + '" data-date="' + escapeHtml(formatDate(item.issue_date)) + '" data-image="' + escapeHtml(image || '') + '" aria-label="Preview ' + escapeHtml(item.title) + '">' + imageMarkup + '</button>'
    return '<article class="certificate-card" data-reveal>' + mediaButton + '<div><p class="certificate-card__date">' + escapeHtml(formatDate(item.issue_date)) + '</p><h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.issuer || 'Sertifikat') + '</p>' + (item.credential_url ? '<a class="text-link" href="' + escapeHtml(safeUrl(item.credential_url)) + '" target="_blank" rel="noreferrer">Lihat kredensial ↗</a>' : '') + '</div></article>'
  }).join('')
  bindImageFallbacks(container)
  initializeRevealUi()
}

function renderDynamicTestimonials(testimonials) {
  const container = document.querySelector('[data-dynamic-testimonials]')
  if (!container) return
  if (!testimonials.length) {
    container.innerHTML = '<div class="public-empty-state">Belum ada testimoni yang dipublikasikan.</div>'
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
}

function renderSocialLinks(links) {
  document.querySelectorAll('[data-social-links]').forEach(container => {
    const scope = container.dataset.socialScope
    const visibilityField = scope === 'hero' ? 'show_in_hero' : scope === 'contact' ? 'show_in_contact' : 'show_in_footer'
    const visibleLinks = links.filter(link => link[visibilityField] !== false)
    container.innerHTML = visibleLinks.map(link => `<a href="${escapeHtml(safeUrl(link.url))}" ${link.open_in_new_tab ? 'target="_blank" rel="noreferrer"' : ''}>${escapeHtml(link.label)} ↗</a>`).join('')
  })
}

function showPublicConfigNotice() {
  const announcement = document.querySelector('.announcement span')
  if (announcement) announcement.textContent = 'Konten publik bworiey sedang disiapkan'
  setPublicLoadingState('Konten belum tersedia.')
}

function setPublicLoadingState(message = 'Memuat konten Supabase...') {
  document.querySelectorAll('[data-dynamic-capabilities], [data-dynamic-educations], [data-dynamic-experiences], [data-dynamic-projects], [data-dynamic-articles], [data-dynamic-certificates], [data-dynamic-testimonials]').forEach(container => {
    container.innerHTML = '<div class="public-empty-state">' + escapeHtml(message) + '</div>'
  })
  const stats = document.querySelector('[data-dynamic-stats]')
  if (stats) stats.innerHTML = '<span><strong>—</strong><small>Memuat...</small></span>'
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

function initializeYear() {
  const year = document.querySelector('[data-year]')
  if (year) year.textContent = new Date().getFullYear()
}
