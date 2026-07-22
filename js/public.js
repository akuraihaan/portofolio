import { supabase, supabaseConfiguration } from '../supabase.js'
import { escapeHtml, formatDate, showToast } from './utils.js'
import { getPublicContent } from './services/public-content-service.js'

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const palette = ['orange', 'pink', 'lilac', 'blue']

export function initializePublic() {
  initializeTheme()
  initializeMobileMenu()
  initializeHeaderScroll()
  initializeSectionNavigation()
  initializeRevealAnimations()
  initializeCopyEmail()
  initializeSmoothScroll()
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
  renderDynamicAbout(sections.find(section => section.section_key === 'about'))
  renderDynamicCapabilities(content.skills.data, content.services.data)
  renderDynamicStats(content.statistics.data, content.statistics.counts)
  renderDynamicProcess(sections.find(section => section.section_key === 'process'))
  renderDynamicEducations(content.educations.data)
  renderDynamicExperiences(content.experiences.data)
  renderDynamicProjects(content.projects.data)
  renderDynamicArticles(content.articles.data)
  renderDynamicCertificates(content.certificates.data)
  renderDynamicTestimonials(content.testimonials.data)
  renderSocialLinks(content.socialLinks.data)
  initializeRoleTyping(document.querySelector('[data-role]'), hero?.custom_data?.roles || [])
  bindProjectInteractions()
  updateNavigationVisibilityFromSections(sections, content)
  document.documentElement.classList.add('content-ready')
  const results = [content.settings, content.profile, content.sections, content.navigation, content.projects, content.articles, content.skills, content.services, content.educations, content.experiences, content.certificates, content.testimonials, content.socialLinks]
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
    if (primary) { primary.textContent = section.primary_button_label || primary.dataset.fallbackLabel || ''; primary.hidden = !section.primary_button_label; if (section.primary_button_url) primary.href = section.primary_button_url }
    if (secondary) { secondary.textContent = section.secondary_button_label || secondary.dataset.fallbackLabel || ''; secondary.hidden = !section.secondary_button_label; if (section.secondary_button_url) secondary.href = section.secondary_button_url }
    element.dataset.sectionLayout = section.layout_variant || 'default'
    if (section.image_url) element.style.setProperty('--section-image', `url("${section.image_url}")`)
    if (section.background_image_url) element.style.setProperty('--section-background-image', `url("${section.background_image_url}")`)
  })
  Object.entries(sectionElements).forEach(([key, selector]) => { const element = document.querySelector(selector); if (element && !uniqueElements.has(selector)) element.hidden = !visibleKeys.has(key) })
  const main = document.querySelector('main'); if (!main) return
  const originalChildren = [...main.children]; const ordered = []; const seen = new Set()
  sections.sort((a, b) => a.sort_order - b.sort_order).forEach(section => { const selector = sectionElements[section.section_key]; const element = selector ? document.querySelector(selector) : null; if (element && element.parentElement === main && !seen.has(element)) { ordered.push(element); seen.add(element) } })
  originalChildren.forEach(element => { if (!seen.has(element)) ordered.push(element) }); ordered.forEach(element => main.appendChild(element))
}

function renderDynamicNavigation(items = []) {
  if (!items.length) return
  const desktop = document.querySelector('.desktop-nav'); const mobile = document.querySelector('.mobile-nav')
  const itemMarkup = (item, mobileMode = false, index = 0) => `<a href="${escapeHtml(item.href)}" target="${escapeHtml(item.target || '_self')}" ${item.target === '_blank' ? 'rel="noreferrer"' : ''}>${escapeHtml(item.label)}${mobileMode ? ` <span>${String(index + 1).padStart(2, '0')}</span>` : ''}</a>`
  if (desktop) desktop.innerHTML = items.map(item => itemMarkup(item)).join('')
  if (mobile) mobile.innerHTML = items.map((item, index) => itemMarkup(item, true, index)).join('')
  initializeSectionNavigation()
}

function renderDynamicMarquee(settings, hero) {
  const track = document.querySelector('[data-dynamic-marquee]'); if (!track) return
  const items = hero?.custom_data?.marquee_items || settings.marquee_items || ['Desain', 'Kode', 'Produk', 'Sistem']
  track.innerHTML = [...items, ...items].map(item => `<span>${escapeHtml(item)}</span><b aria-hidden="true">✳</b>`).join('')
}

function renderDynamicAbout(section) {
  if (!section) return
  const data = section.custom_data || {}
  const short = document.querySelector('[data-about-short]'); const long = document.querySelector('[data-about-long]')
  if (short && data.bio_short) short.textContent = data.bio_short
  if (long && (data.bio_long || section.description)) long.textContent = data.bio_long || section.description
  const facts = document.querySelector('[data-about-facts]')
  if (facts) facts.innerHTML = (data.facts || []).map(fact => `<span><small>${escapeHtml(fact.label)}</small><strong>${escapeHtml(fact.value)}</strong></span>`).join('')
}

function renderDynamicProcess(section) {
  const container = document.querySelector('[data-dynamic-process]'); if (!container || !section) return
  const steps = section.custom_data?.steps || []
  container.innerHTML = steps.map((step, index) => `<article data-reveal><span>${String(index + 1).padStart(2, '0')}</span><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.description)}</p></article>`).join('')
  initializeRevealAnimations()
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

  document.title = settings.default_meta_title || `${siteName} — Portfolio digital`
  document.querySelector('meta[name="description"]')?.setAttribute('content', settings.default_meta_description || description)
  if (settings.og_image_url || settings.og_image) document.querySelector('meta[property="og:image"]')?.setAttribute('content', settings.og_image_url || settings.og_image)
  if (settings.favicon_url || settings.site_favicon) document.querySelector('link[rel="icon"]')?.setAttribute('href', settings.favicon_url || settings.site_favicon)
  const heroPortrait = document.querySelector('.hero__portrait')
  if (heroPortrait && heroImage) heroPortrait.innerHTML = '<img src="' + escapeHtml(heroImage) + '" alt="' + escapeHtml(displayName) + '" loading="eager" decoding="async" data-image-fallback data-fallback-label="' + escapeHtml(displayName.slice(0, 2).toUpperCase()) + '"><span class="hero__portrait-fallback" hidden>' + escapeHtml(displayName.slice(0, 2).toUpperCase()) + '</span><span class="hero__portrait-caption">Ide<br />yang bergerak</span>'
  document.querySelectorAll('[data-site-name]').forEach(element => { element.textContent = siteName })
  document.querySelectorAll('[data-site-owner-name]').forEach(element => { element.textContent = displayName })
  document.querySelectorAll('[data-site-mark]').forEach(element => { element.textContent = siteName.slice(0, 1).toUpperCase() })
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
  const records = skills.map(item => ({ title: item.name, description: item.description, type: item.category || 'Skill', level: item.level })).concat(services.map(item => ({ title: item.title, description: item.description, type: 'Service', image: item.icon_url })))
  if (!records.length) {
    container.innerHTML = '<article class="capability capability--blue"><div class="capability__content"><h3>Konten sedang disiapkan.</h3><p>Tambahkan keahlian atau layanan dari panel admin agar bagian ini tampil.</p></div></article>'
    return
  }
  container.innerHTML = records.map((record, index) => {
    const color = palette[index % palette.length]
    return `<article class="capability capability--${color}" data-reveal><div class="capability__visual capability__visual--${color}" aria-hidden="true"><span>${String(index + 1).padStart(2, '0')}</span><i></i><i></i><i></i></div><div class="capability__content"><div class="capability__meta"><span class="category-label">${escapeHtml(record.type)}</span><span>${String(index + 1).padStart(2, '0')}</span></div><h3>${escapeHtml(record.title)}</h3><p>${escapeHtml(record.description || 'Deskripsi akan ditambahkan segera.')}</p></div></article>`
  }).join('')
  initializeRevealAnimations()
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
      ? '<span class="education-card__brand"><img src="' + escapeHtml(education.logo_url) + '" alt="" loading="lazy" decoding="async" data-image-fallback data-fallback-label="' + initials + '"><span class="education-card__fallback" hidden>' + initials + '</span></span>'
      : '<span class="education-card__brand education-card__brand--fallback" aria-hidden="true">' + initials + '</span>'
    const period = education.is_current ? formatDate(education.start_date) + ' — Sekarang' : formatDate(education.start_date) + ' — ' + formatDate(education.end_date)
    return '<article class="education-card" data-reveal><div class="education-card__period">' + logo + '<span>' + escapeHtml(period) + '</span></div><div><h3>' + escapeHtml(education.degree || 'Pendidikan') + '</h3><p class="education-card__institution">' + escapeHtml(education.institution) + '</p><p>' + escapeHtml([education.field_of_study, education.location, education.description].filter(Boolean).join(' · ')) + '</p></div></article>'
  }).join('')
  bindImageFallbacks(container)
  initializeRevealAnimations()
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
      ? '<img class="experience-card__logo" src="' + escapeHtml(item.logo_url) + '" alt="" loading="lazy" decoding="async" data-image-fallback data-fallback-label="' + initials + '"><span class="experience-card__fallback" hidden>' + initials + '</span>'
      : '<span class="experience-card__logo experience-card__logo--fallback" aria-hidden="true">' + initials + '</span>'
    return '<article class="experience-card" data-reveal><div class="experience-card__period">' + logo + '<span>' + escapeHtml(item.is_current ? formatDate(item.start_date) + ' — Sekarang' : formatDate(item.start_date) + ' — ' + formatDate(item.end_date)) + '</span></div><div><p class="experience-card__company">' + escapeHtml(item.company) + '</p><h3>' + escapeHtml(item.role_title) + '</h3><p>' + escapeHtml([item.location, item.description].filter(Boolean).join(' · ')) + '</p></div></article>'
  }).join('')
  bindImageFallbacks(container)
  initializeRevealAnimations()
}

function renderDynamicProjects(projects) {
  const grid = document.querySelector('[data-dynamic-projects]')
  const footer = document.querySelector('[data-project-count]')
  if (!grid) return
  if (!projects.length) {
    grid.innerHTML = '<div class="public-empty-state">Belum ada proyek yang dipublikasikan.</div>'
    if (footer) footer.textContent = 'Belum ada proyek dipublikasikan'
    return
  }
  grid.innerHTML = projects.map((project, index) => {
    const category = (project.category || 'digital').toLowerCase().replace(/[^a-z0-9-]/g, '')
    const visual = palette[index % palette.length]
    const image = project.thumbnail_url || project.cover_url || project.cover_image_url
    return `<button class="project-card ${index === 0 ? 'project-card--wide' : ''}" type="button" data-project data-category="${escapeHtml(category)}" data-title="${escapeHtml(project.title)}" data-type="${escapeHtml(project.category || 'Project')}" data-description="${escapeHtml(project.summary || project.description || '')}" data-reel="${escapeHtml(project.project_url || '')}" data-reveal><span class="project-card__visual project-card__visual--${visual}" ${image ? `style="background-image:url('${escapeHtml(image)}');background-size:cover;background-position:center"` : ''} aria-label="${escapeHtml(project.title)}"><strong>${escapeHtml(project.title.slice(0, 12))}</strong></span><span class="project-card__info"><span><b>${escapeHtml(project.title)}</b><small>${escapeHtml(project.category || 'Project')}</small></span><span class="project-card__arrow">↗</span></span></button>`
  }).join('')
  if (footer) footer.textContent = `${projects.length} proyek dipublikasikan`
  initializeRevealAnimations()
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
      ? '<img class="note-card__image" src="' + escapeHtml(image) + '" alt="' + escapeHtml(article.title) + '" loading="lazy" decoding="async" data-image-fallback data-fallback-label="' + initials + '"><span class="note-card__image-fallback" hidden>' + initials + '</span>'
      : ''
    return '<a class="note-card" href="#contact" data-reveal>' + imageMarkup + '<span class="note-card__date">' + formatDate(article.published_at || article.created_at) + '</span><h3>' + escapeHtml(article.title) + '</h3><span class="note-card__arrow">↗</span></a>'
  }).join('')
  bindImageFallbacks(grid)
  initializeRevealAnimations()
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
      ? '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(item.title) + '" loading="lazy" decoding="async" data-image-fallback data-fallback-label="' + initials + '"><span class="certificate-card__fallback" hidden>' + initials + '</span>'
      : '<div class="certificate-card__placeholder" aria-hidden="true">✦</div>'
    return '<article class="certificate-card" data-reveal>' + imageMarkup + '<div><p class="certificate-card__date">' + escapeHtml(formatDate(item.issue_date)) + '</p><h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.issuer || 'Sertifikat') + '</p>' + (item.credential_url ? '<a class="text-link" href="' + escapeHtml(item.credential_url) + '" target="_blank" rel="noreferrer">Lihat kredensial ↗</a>' : '') + '</div></article>'
  }).join('')
  bindImageFallbacks(container)
  initializeRevealAnimations()
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
      ? '<img src="' + escapeHtml(item.avatar_url) + '" alt="" loading="lazy" decoding="async" data-image-fallback data-fallback-label="' + initials + '"><span class="testimonial-card__avatar testimonial-card__avatar--fallback" hidden>' + initials + '</span>'
      : '<span class="testimonial-card__avatar" aria-hidden="true">' + initials + '</span>'
    return '<article class="testimonial-card" data-reveal><span class="testimonial-card__quote">“</span><blockquote>' + escapeHtml(item.quote) + '</blockquote><div class="testimonial-card__author">' + avatar + '<span><strong>' + escapeHtml(item.author_name) + '</strong><small>' + escapeHtml(item.author_role || '') + '</small></span></div></article>'
  }).join('')
  bindImageFallbacks(container)
  initializeRevealAnimations()
}

function renderSocialLinks(links) {
  document.querySelectorAll('[data-social-links]').forEach(container => {
    const scope = container.dataset.socialScope
    const visibilityField = scope === 'hero' ? 'show_in_hero' : scope === 'contact' ? 'show_in_contact' : 'show_in_footer'
    const visibleLinks = links.filter(link => link[visibilityField] !== false)
    container.innerHTML = visibleLinks.map(link => `<a href="${escapeHtml(link.url)}" ${link.open_in_new_tab ? 'target="_blank" rel="noreferrer"' : ''}>${escapeHtml(link.label)} ↗</a>`).join('')
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
  if (localStorage.getItem('portfolio-theme') === 'light') root.dataset.theme = 'light'
  const update = () => toggle?.setAttribute('aria-label', root.dataset.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode')
  update()
  toggle?.addEventListener('click', () => { root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light'; localStorage.setItem('portfolio-theme', root.dataset.theme); update() })
}

function initializeMobileMenu() {
  const button = document.querySelector('[data-menu-toggle]')
  const nav = document.querySelector('[data-mobile-nav]')
  const close = () => { button?.classList.remove('is-open'); nav?.classList.remove('is-open'); button?.setAttribute('aria-expanded', 'false') }
  button?.addEventListener('click', () => { const open = nav?.classList.toggle('is-open'); button.classList.toggle('is-open', Boolean(open)); button.setAttribute('aria-expanded', String(Boolean(open))) })
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', close))
}

function initializeHeaderScroll() {
  const header = document.querySelector('[data-header]')
  const update = () => header?.classList.toggle('is-scrolled', window.scrollY > 30)
  window.addEventListener('scroll', update, { passive: true })
  update()
}

function initializeSectionNavigation() {
  const links = [...document.querySelectorAll('.desktop-nav a, .mobile-nav a')]
  const sections = links
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean)
  const updateActive = () => {
    const marker = window.scrollY + 150
    let activeId = sections[0]?.id || 'top'
    sections.forEach(section => {
      if (section.offsetTop <= marker) activeId = section.id
    })
    links.forEach(link => {
      const active = link.getAttribute('href') === '#' + activeId
      link.classList.toggle('is-active', active)
      if (active) link.setAttribute('aria-current', 'page')
      else link.removeAttribute('aria-current')
    })
  }
  window.addEventListener('scroll', updateActive, { passive: true })
  updateActive()
}

function updateNavigationVisibility(visibility = {}) {
  Object.entries(visibility).forEach(([id, visible]) => {
    document.querySelectorAll('a[href="#' + id + '"]').forEach(link => {
      link.hidden = !visible
    })
  })
}

function initializeRevealAnimations() {
  const elements = document.querySelectorAll('[data-reveal]:not(.is-visible)')
  if (reduceMotion || !('IntersectionObserver' in window)) { elements.forEach(element => element.classList.add('is-visible')); return }
  const observer = new IntersectionObserver((entries, currentObserver) => entries.forEach(entry => { if (!entry.isIntersecting) return; const delay = entry.target.dataset.revealDelay; if (delay) entry.target.style.transitionDelay = `${delay}ms`; entry.target.classList.add('is-visible'); currentObserver.unobserve(entry.target) }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
  elements.forEach(element => observer.observe(element))
}

function initializeRoleTyping(element = document.querySelector('[data-role]'), roles = null) {
  const roleElement = element
  let roleList = roles || []
  try { if (!roleList.length) roleList = roleElement?.dataset.roles ? JSON.parse(roleElement.dataset.roles) : [] } catch { roleList = [] }
  if (!roleElement || !roleList.length || reduceMotion || roleElement.dataset.typingStarted) return
  roleElement.dataset.typingStarted = 'true'
  let roleIndex = 0; let characterIndex = 0; let deleting = false
  const type = () => { const role = roleList[roleIndex] || ''; characterIndex += deleting ? -1 : 1; roleElement.textContent = role.slice(0, characterIndex); if (!deleting && characterIndex >= role.length) { deleting = true; window.setTimeout(type, 1700); return } if (deleting && characterIndex <= 0) { deleting = false; roleIndex = (roleIndex + 1) % roleList.length } window.setTimeout(type, deleting ? 45 : 80) }
  type()
}

function bindProjectInteractions() {
  const buttons = document.querySelectorAll('[data-filter]')
  const cards = () => document.querySelectorAll('[data-project]')
  const search = document.querySelector('[data-project-search]')
  const applyProjectFilter = () => {
    const filter = document.querySelector('[data-filter].is-active')?.dataset.filter || 'all'
    const term = (search?.value || '').trim().toLowerCase()
    cards().forEach(card => {
      const matchesFilter = filter === 'all' || card.dataset.category === filter
      const matchesSearch = !term || (card.dataset.title || '').toLowerCase().includes(term) || (card.dataset.type || '').toLowerCase().includes(term)
      card.classList.toggle('is-hidden', !(matchesFilter && matchesSearch))
    })
  }
  buttons.forEach(button => { if (button.dataset.bound) return; button.dataset.bound = 'true'; button.addEventListener('click', () => { buttons.forEach(item => { const active = item === button; item.classList.toggle('is-active', active); item.setAttribute('aria-pressed', String(active)) }); applyProjectFilter() }) })
  search?.addEventListener('input', applyProjectFilter)
  const dialog = document.querySelector('[data-project-dialog]')
  cards().forEach(card => { if (card.dataset.dialogBound) return; card.dataset.dialogBound = 'true'; card.addEventListener('click', () => { if (!dialog) return; document.querySelector('[data-dialog-title]').textContent = card.dataset.title || ''; document.querySelector('[data-dialog-type]').textContent = card.dataset.type || ''; document.querySelector('[data-dialog-description]').textContent = card.dataset.description || ''; document.querySelector('[data-dialog-reel]').textContent = card.dataset.reel || '—'; dialog.showModal() }) })
  document.querySelector('[data-dialog-close]')?.addEventListener('click', () => dialog?.close())
  dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close() })
}

function initializeContactForm() {
  const form = document.querySelector('[data-contact-form]')
  const status = document.querySelector('[data-form-status]')
  form?.addEventListener('submit', async event => {
    event.preventDefault()
    if (!form.checkValidity()) { form.reportValidity(); return }
    const button = form.querySelector('button[type="submit"]')
    button.disabled = true
    status.textContent = 'Mengirim...'
    if (!supabase) { status.textContent = 'Form kontak belum terhubung.'; button.disabled = false; return }
    let response = await supabase.rpc('submit_contact_message', { message_name: form.elements.name.value, message_email: form.elements.email.value, message_subject: form.elements.subject?.value || '', message_body: form.elements.message.value, honeypot: form.elements.website?.value || '' })
    if (response.error?.code === '42883') response = await supabase.rpc('submit_contact_message', { message_name: form.elements.name.value, message_email: form.elements.email.value, message_body: form.elements.message.value, honeypot: form.elements.website?.value || '' })
    const { error } = response
    button.disabled = false
    if (error) { console.error('Gagal mengirim pesan:', error); status.textContent = 'Pesan belum dapat dikirim. Silakan coba lagi.'; return }
    status.textContent = 'Pesan berhasil dikirim. Terima kasih.'
    showToast('Pesan berhasil dikirim.')
    form.reset()
  })
}

function initializeCopyEmail() {
  document.querySelectorAll('[data-copy-email]').forEach(button => button.addEventListener('click', async event => { const email = event.currentTarget.dataset.email; if (!email) return; try { await navigator.clipboard.writeText(email); showToast('Email disalin.') } catch { showToast(email) } }))
}

function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => { const target = document.querySelector(link.getAttribute('href')); if (!target) return; event.preventDefault(); target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }) }))
}

function initializeYear() {
  const year = document.querySelector('[data-year]')
  if (year) year.textContent = new Date().getFullYear()
}
