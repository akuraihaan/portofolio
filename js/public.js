import { supabase, supabaseConfiguration } from '../supabase.js'
import { normalizeSettingValue, escapeHtml, formatDate, showToast } from './utils.js'
import { getPublishedEducations } from './educations.js'
import { getPublicImageUrl } from './services/storage-service.js'

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
  loadPublicContent()
}

async function readTable(table, configure = query => query) {
  if (!supabaseConfiguration.ready || !supabase) return { ok: false, data: [], error: new Error('Supabase belum dikonfigurasi.') }
  const { data, error } = await configure(supabase.from(table).select('*'))
  if (error) {
    console.error(`Gagal membaca ${table}:`, {
      code: error.code || null,
      message: error.message || 'Unknown Supabase error',
      details: error.details || null,
      hint: error.hint || null
    })
    return { ok: false, data: [], error }
  }
  return { ok: true, data: data ?? [], error: null }
}

async function readEducations() {
  try {
    return { ok: true, data: await getPublishedEducations(), error: null }
  } catch (error) {
    return { ok: false, data: [], error }
  }
}

function publishedQuery(query) {
  return query
    .eq('status', 'published')
    .or(`published_at.is.null,published_at.lte.${new Date().toISOString()}`)
    .order('sort_order', { ascending: true })
    .order('published_at', { ascending: false })
}

async function loadPublicContent() {
  if (!supabaseConfiguration.ready || !supabase) {
    showPublicConfigNotice()
    return
  }

  const settledResults = await Promise.allSettled([
    readTable('site_settings', query => query.eq('is_public', true).order('group_name').order('key')),
    readTable('profiles', query => query.eq('is_active', true).limit(1)),
    readTable('projects', publishedQuery),
    readTable('articles', publishedQuery),
    readTable('skills', publishedQuery),
    readTable('services', publishedQuery),
    readEducations(),
    readTable('social_links', query => query.eq('is_active', true).order('sort_order').order('created_at')),
    readTable('experiences', publishedQuery),
    readTable('certificates', publishedQuery),
    readTable('testimonials', publishedQuery)
  ])
  const normalizeSettled = result => result.status === 'fulfilled' ? result.value : { ok: false, data: [], error: result.reason }
  const [settingsResult, profileResult, projectsResult, articlesResult, skillsResult, servicesResult, educationsResult, socialResult, experiencesResult, certificatesResult, testimonialsResult] = settledResults.map(normalizeSettled)

  const settings = Object.fromEntries(settingsResult.data.map(row => [row.key, normalizeSettingValue(row.value)]))
  const profile = profileResult.data[0] ?? null
  const projects = await resolveAssetRows(projectsResult.data, ['thumbnail_url', 'cover_url', 'cover_image_url'])
  const articles = await resolveAssetRows(articlesResult.data, ['thumbnail_url', 'cover_image_url'])
  const educations = await resolveAssetRows(educationsResult.data, ['logo_url'])
  const experiences = await resolveAssetRows(experiencesResult.data, ['logo_url'])
  const certificates = await resolveAssetRows(certificatesResult.data, ['certificate_url', 'image_url'])
  const testimonials = await resolveAssetRows(testimonialsResult.data, ['avatar_url'])
  applySiteIdentity(settings, profile)
  renderDynamicCapabilities(skillsResult.data, servicesResult.data)
  renderDynamicStats({ projects: projectsResult.data, skills: skillsResult.data, experiences: experiencesResult.data, certificates: certificatesResult.data, articles: articlesResult.data })
  renderDynamicEducations(educations)
  renderDynamicExperiences(experiences)
  renderDynamicProjects(projects)
  renderDynamicArticles(articles)
  renderDynamicCertificates(certificates)
  renderDynamicTestimonials(testimonials)
  renderSocialLinks(socialResult.data)
  updateNavigationVisibility({
    capabilities: skillsResult.data.length > 0 || servicesResult.data.length > 0,
    work: projectsResult.data.length > 0,
    experience: experiencesResult.data.length > 0,
    education: educations.length > 0,
    notes: articlesResult.data.length > 0,
    credentials: certificates.length > 0 || testimonials.length > 0
  })
  bindProjectInteractions()

  if ([settingsResult, profileResult, projectsResult, articlesResult, skillsResult, servicesResult, educationsResult, socialResult, experiencesResult, certificatesResult, testimonialsResult].some(result => !result.ok)) {
    showToast('Sebagian konten belum dapat dimuat. Silakan coba lagi nanti.', 'error')
  }
}

async function resolveAssetRows(rows, fields) {
  return Promise.all(rows.map(async row => {
    const resolved = { ...row }
    for (const field of fields) {
      const aliases = field === 'cover_url' ? ['cover_image_url'] : field === 'certificate_url' ? ['image_url'] : []
      const pathFields = field === 'cover_image_url' ? ['cover_path', 'thumbnail_path'] : field === 'certificate_url' || field === 'image_url' ? ['certificate_path'] : [field.replace(/_url$/, '_path')]
      const assetValue = [field, ...aliases].map(valueField => row[valueField]).find(Boolean) || pathFields.map(pathField => row[pathField]).find(Boolean)
      resolved[field] = await resolveAssetUrl(assetValue)
    }
    return resolved
  }))
}

async function resolveAssetUrl(value) {
  if (!value || /^https?:\/\//i.test(value)) return value || ''
  return getPublicImageUrl(value)
}

function applySiteIdentity(settings, profile) {
  const siteName = settings.site_name || settings.studio_name || 'bworiey'
  const displayName = profile?.full_name || siteName
  const description = settings.site_description || 'Portfolio digital bworiey.'
  const email = profile?.email || settings.public_email || settings.business_email || ''
  const city = profile?.city || settings.city || ''
  const country = profile?.country || settings.country || ''
  const location = [city, country].filter(Boolean).join(', ')
  const heroImage = settings.hero_image_url || settings.hero_image || profile?.avatar_url || ''

  document.title = settings.default_meta_title || `${siteName} — Portfolio digital`
  document.querySelector('meta[name="description"]')?.setAttribute('content', settings.default_meta_description || description)
  if (settings.og_image_url || settings.og_image) document.querySelector('meta[property="og:image"]')?.setAttribute('content', settings.og_image_url || settings.og_image)
  if (settings.favicon_url || settings.site_favicon) document.querySelector('link[rel="icon"]')?.setAttribute('href', settings.favicon_url || settings.site_favicon)
  const heroPortrait = document.querySelector('.hero__portrait')
  if (heroPortrait && heroImage) heroPortrait.innerHTML = '<img src="' + escapeHtml(heroImage) + '" alt="' + escapeHtml(displayName) + '" loading="eager" decoding="async" data-image-fallback data-fallback-label="' + escapeHtml(displayName.slice(0, 2).toUpperCase()) + '"><span class="hero__portrait-fallback" hidden>' + escapeHtml(displayName.slice(0, 2).toUpperCase()) + '</span><span class="hero__portrait-caption">Design<br />in motion</span>'
  document.querySelectorAll('[data-site-name]').forEach(element => { element.textContent = siteName })
  document.querySelectorAll('[data-site-mark]').forEach(element => { element.textContent = siteName.slice(0, 1).toUpperCase() })
  document.querySelector('[data-availability]')?.replaceChildren(document.createTextNode(settings.availability_label || siteName))
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
  document.querySelector('[data-contact-location]')?.replaceChildren(document.createTextNode(location || 'Konten belum tersedia.'))
  document.querySelector('[data-footer-name]')?.replaceChildren(document.createTextNode(displayName))
  document.querySelector('[data-footer-location]')?.replaceChildren(document.createTextNode(location))
  document.querySelectorAll('[data-copy-email]').forEach(button => { if (email) button.dataset.email = email })
  const roles = Array.isArray(settings.professional_titles) ? settings.professional_titles : []
  const roleElement = document.querySelector('[data-role]')
  if (roleElement && roles.length) {
    roleElement.dataset.roles = JSON.stringify(roles)
    initializeRoleTyping(roleElement, roles)
  }
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
    container.innerHTML = '<article class="capability capability--blue"><div class="capability__content"><h3>Konten belum tersedia.</h3><p>Tambahkan skills atau services dari panel admin.</p></div></article>'
    return
  }
  container.innerHTML = records.map((record, index) => {
    const color = palette[index % palette.length]
    return `<article class="capability capability--${color}" data-reveal><div class="capability__visual capability__visual--${color}" aria-hidden="true"><span>${String(index + 1).padStart(2, '0')}</span><i></i><i></i><i></i></div><div class="capability__content"><div class="capability__meta"><span class="category-label">${escapeHtml(record.type)}</span><span>${String(index + 1).padStart(2, '0')}</span></div><h3>${escapeHtml(record.title)}</h3><p>${escapeHtml(record.description || 'Konten belum tersedia.')}</p></div></article>`
  }).join('')
  initializeRevealAnimations()
}

function renderDynamicStats({ projects = [], skills = [], experiences = [], certificates = [], articles = [] } = {}) {
  const container = document.querySelector('[data-dynamic-stats]')
  if (!container) return
  container.innerHTML = [['Projects', projects.length], ['Skills', skills.length], ['Experience', experiences.length], ['Certificates', certificates.length], ['Articles', articles.length]].map(([label, value]) => '<span><strong>' + value + '</strong><small>' + label + '</small></span>').join('')
}

function renderDynamicEducations(educations) {
  const container = document.querySelector('[data-dynamic-educations]')
  if (!container) return

  if (!educations.length) {
    container.innerHTML = '<div class="public-empty-state">Belum ada pendidikan published.</div>'
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
    container.innerHTML = '<div class="public-empty-state">Belum ada pengalaman published.</div>'
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
    grid.innerHTML = '<div class="public-empty-state">Belum ada proyek published.</div>'
    if (footer) footer.textContent = '0 published projects'
    return
  }
  grid.innerHTML = projects.map((project, index) => {
    const category = (project.category || 'digital').toLowerCase().replace(/[^a-z0-9-]/g, '')
    const visual = palette[index % palette.length]
    const image = project.thumbnail_url || project.cover_url || project.cover_image_url
    return `<button class="project-card ${index === 0 ? 'project-card--wide' : ''}" type="button" data-project data-category="${escapeHtml(category)}" data-title="${escapeHtml(project.title)}" data-type="${escapeHtml(project.category || 'Project')}" data-description="${escapeHtml(project.summary || project.description || '')}" data-reel="${escapeHtml(project.project_url || '')}" data-reveal><span class="project-card__visual project-card__visual--${visual}" ${image ? `style="background-image:url('${escapeHtml(image)}');background-size:cover;background-position:center"` : ''} aria-label="${escapeHtml(project.title)}"><strong>${escapeHtml(project.title.slice(0, 12))}</strong></span><span class="project-card__info"><span><b>${escapeHtml(project.title)}</b><small>${escapeHtml(project.category || 'Project')}</small></span><span class="project-card__arrow">↗</span></span></button>`
  }).join('')
  if (footer) footer.textContent = `${projects.length} published project${projects.length === 1 ? '' : 's'}`
  initializeRevealAnimations()
}

function renderDynamicArticles(articles) {
  const grid = document.querySelector('[data-dynamic-articles]')
  if (!grid) return
  if (!articles.length) {
    grid.innerHTML = '<div class="public-empty-state">Belum ada artikel published.</div>'
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
    container.innerHTML = '<div class="public-empty-state">Belum ada sertifikat published.</div>'
    return
  }
  container.innerHTML = certificates.map(item => {
    const image = item.certificate_url || item.image_url
    const initials = getInitials(item.title)
    const imageMarkup = image
      ? '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(item.title) + '" loading="lazy" decoding="async" data-image-fallback data-fallback-label="' + initials + '"><span class="certificate-card__fallback" hidden>' + initials + '</span>'
      : '<div class="certificate-card__placeholder" aria-hidden="true">✦</div>'
    return '<article class="certificate-card" data-reveal>' + imageMarkup + '<div><p class="certificate-card__date">' + escapeHtml(formatDate(item.issue_date)) + '</p><h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.issuer || 'Certificate') + '</p>' + (item.credential_url ? '<a class="text-link" href="' + escapeHtml(item.credential_url) + '" target="_blank" rel="noreferrer">View credential ↗</a>' : '') + '</div></article>'
  }).join('')
  bindImageFallbacks(container)
  initializeRevealAnimations()
}

function renderDynamicTestimonials(testimonials) {
  const container = document.querySelector('[data-dynamic-testimonials]')
  if (!container) return
  if (!testimonials.length) {
    container.innerHTML = '<div class="public-empty-state">Belum ada testimonial published.</div>'
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
    container.innerHTML = links.map(link => `<a href="${escapeHtml(link.url)}" ${link.open_in_new_tab ? 'target="_blank" rel="noreferrer"' : ''}>${escapeHtml(link.label)} ↗</a>`).join('')
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
  if (stats) stats.innerHTML = '<span><strong>—</strong><small>Loading</small></span>'
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
