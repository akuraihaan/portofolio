import { supabase, supabaseConfiguration } from '../supabase.js'
import { normalizeSettingValue, escapeHtml, formatDate, showToast } from './utils.js'

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const palette = ['orange', 'pink', 'lilac', 'blue']

export function initializePublic() {
  initializeTheme()
  initializeMobileMenu()
  initializeHeaderScroll()
  initializeRevealAnimations()
  initializeCopyEmail()
  initializeSmoothScroll()
  initializeYear()
  initializeContactForm()
  loadPublicContent()
}

async function readTable(table, configure = query => query) {
  if (!supabaseConfiguration.ready || !supabase) return { ok: false, data: [], error: new Error('Supabase belum dikonfigurasi.') }
  const { data, error } = await configure(supabase.from(table).select('*'))
  if (error) {
    console.error(`Gagal membaca ${table}:`, error)
    return { ok: false, data: [], error }
  }
  return { ok: true, data: data ?? [], error: null }
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

  const [settingsResult, profileResult, projectsResult, articlesResult, skillsResult, servicesResult, socialResult] = await Promise.all([
    readTable('site_settings', query => query.eq('is_public', true).order('group_name').order('key')),
    readTable('profiles', query => query.eq('is_active', true).limit(1)),
    readTable('projects', publishedQuery),
    readTable('articles', publishedQuery),
    readTable('skills', publishedQuery),
    readTable('services', publishedQuery),
    readTable('social_links', query => query.eq('is_active', true).order('sort_order').order('created_at'))
  ])

  const settings = Object.fromEntries(settingsResult.data.map(row => [row.key, normalizeSettingValue(row.value)]))
  const profile = profileResult.data[0] ?? null
  const projects = await resolveAssetRows(projectsResult.data, ['cover_image_url'])
  const articles = await resolveAssetRows(articlesResult.data, ['cover_image_url'])
  applySiteIdentity(settings, profile)
  renderDynamicCapabilities(skillsResult.data, servicesResult.data)
  renderDynamicProjects(projects)
  renderDynamicArticles(articles)
  renderSocialLinks(socialResult.data)
  bindProjectInteractions()

  if ([settingsResult, profileResult, projectsResult, articlesResult, skillsResult, servicesResult, socialResult].some(result => !result.ok)) {
    showToast('Sebagian konten belum dapat dimuat. Silakan coba lagi nanti.', 'error')
  }
}

async function resolveAssetRows(rows, fields) {
  return Promise.all(rows.map(async row => {
    const resolved = { ...row }
    for (const field of fields) resolved[field] = await resolveAssetUrl(row[field])
    return resolved
  }))
}

async function resolveAssetUrl(value) {
  if (!value || /^https?:\/\//i.test(value)) return value || ''
  const path = String(value).replace(/^portfolio-public\//, '')
  if (!supabase || !path) return ''
  const { data, error } = await supabase.storage.from('portfolio-public').createSignedUrl(path, 3600)
  if (error) { console.error('Gagal membuat signed URL media:', error); return '' }
  return data?.signedUrl || ''
}

function applySiteIdentity(settings, profile) {
  const siteName = settings.site_name || settings.studio_name || 'bworiey'
  const displayName = profile?.full_name || siteName
  const description = settings.site_description || 'Portfolio digital bworiey.'
  const email = profile?.email || settings.public_email || settings.business_email || ''
  const city = profile?.city || settings.city || ''
  const country = profile?.country || settings.country || ''
  const location = [city, country].filter(Boolean).join(', ')

  document.title = settings.default_meta_title || `${siteName} — Portfolio digital`
  document.querySelector('meta[name="description"]')?.setAttribute('content', settings.default_meta_description || description)
  document.querySelectorAll('[data-site-name]').forEach(element => { element.textContent = siteName })
  document.querySelectorAll('[data-site-mark]').forEach(element => { element.textContent = siteName.slice(0, 1).toUpperCase() })
  document.querySelector('[data-availability]')?.replaceChildren(document.createTextNode(settings.availability_label || siteName))
  document.querySelector('[data-hero-badge]')?.replaceChildren(document.createTextNode(settings.hero_badge || 'Portfolio digital'))
  document.querySelector('#hero-title')?.replaceChildren(document.createTextNode(settings.hero_title || 'Konten belum tersedia.'))
  const heroIntro = document.querySelector('[data-hero-intro]')
  if (heroIntro) heroIntro.innerHTML = `${escapeHtml(settings.hero_description || profile?.bio || 'Konten belum tersedia.')} <span class="accent-green" data-role data-roles='${escapeHtml(JSON.stringify(settings.professional_titles || []))}'></span>`
  document.querySelector('[data-about-short]')?.replaceChildren(document.createTextNode(profile?.bio || 'Konten belum tersedia.'))
  document.querySelector('[data-about-long]')?.replaceChildren(document.createTextNode(settings.about_text || 'Konten belum tersedia.'))
  document.querySelector('[data-contact-description]')?.replaceChildren(document.createTextNode(settings.site_tagline || 'Konten belum tersedia.'))
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
  const roles = settings.professional_titles || []
  const roleElement = document.querySelector('[data-role]')
  if (roleElement && roles.length) {
    roleElement.dataset.roles = JSON.stringify(roles)
    initializeRoleTyping(roleElement, roles)
  }
}

function renderDynamicCapabilities(skills, services) {
  const container = document.querySelector('[data-dynamic-capabilities]')
  if (!container) return
  const records = skills.length ? skills.map(item => ({ title: item.name, description: item.description, type: item.category || 'Skill' })) : services.map(item => ({ title: item.title, description: item.description, type: 'Service' }))
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
    return `<button class="project-card ${index === 0 ? 'project-card--wide' : ''}" type="button" data-project data-category="${escapeHtml(category)}" data-title="${escapeHtml(project.title)}" data-type="${escapeHtml(project.category || 'Project')}" data-description="${escapeHtml(project.summary || project.description || '')}" data-reel="${escapeHtml(project.project_url || '')}" data-reveal><span class="project-card__visual project-card__visual--${visual}" ${project.cover_image_url ? `style="background-image:url('${escapeHtml(project.cover_image_url)}');background-size:cover;background-position:center"` : ''} aria-hidden="true"><strong>${escapeHtml(project.title.slice(0, 12))}</strong></span><span class="project-card__info"><span><b>${escapeHtml(project.title)}</b><small>${escapeHtml(project.category || 'Project')}</small></span><span class="project-card__arrow">↗</span></span></button>`
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
  grid.innerHTML = articles.map(article => `<a class="note-card" href="#contact" data-reveal><span class="note-card__date">${formatDate(article.published_at || article.created_at)}</span><h3>${escapeHtml(article.title)}</h3><span class="note-card__arrow">↗</span></a>`).join('')
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
  buttons.forEach(button => { if (button.dataset.bound) return; button.dataset.bound = 'true'; button.addEventListener('click', () => { const filter = button.dataset.filter; buttons.forEach(item => { const active = item === button; item.classList.toggle('is-active', active); item.setAttribute('aria-pressed', String(active)) }); cards().forEach(card => card.classList.toggle('is-hidden', !(filter === 'all' || card.dataset.category === filter))) }) })
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
    const { error } = await supabase.rpc('submit_contact_message', { message_name: form.elements.name.value, message_email: form.elements.email.value, message_body: form.elements.message.value, honeypot: form.elements.website?.value || '' })
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
