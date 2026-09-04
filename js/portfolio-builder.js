import { supabase, supabaseConfiguration } from '../supabase.js'
import { getCurrentSession } from './auth.js'
import { getPublicContent } from './services/public-content-service.js'
import { getPortfolioVersionBySlug, savePortfolioVersion } from './services/portfolio-version-service.js'
import { escapeHtml, formatDate, safeUrl, showToast, slugify } from './utils.js'
import { LOCAL_FALLBACK } from './public.js'

export const PORTFOLIO_TYPES = {
  general: { label: 'General', description: 'Ringkasan menyeluruh tentang cara Anda bekerja.' },
  uiux: { label: 'UI/UX', description: 'Menonjolkan proses, alur, dan keputusan desain.' },
  web: { label: 'Web development', description: 'Menonjolkan produk web, stack, dan implementasi.' },
  educational: { label: 'Teknologi pendidikan', description: 'Menonjolkan pengalaman belajar dan media interaktif.' },
  cloud: { label: 'Cloud computing', description: 'Menonjolkan arsitektur, deployment, dan layanan cloud.' },
  custom: { label: 'Custom', description: 'Susun sendiri isi dan urutan portfolio Anda.' }
}

export const DEFAULT_SECTION_ORDER = ['about', 'skills', 'projects', 'experience', 'education', 'certificates', 'process', 'contact']

const TYPE_CATEGORY_MAP = {
  general: [],
  uiux: ['uiux'],
  web: ['web-development'],
  educational: ['educational-technology'],
  cloud: ['cloud-computing'],
  custom: []
}

function recordsFrom(content, key, fallback = []) {
  const remote = Array.isArray(content?.[key]?.data) ? content[key].data : []
  const seen = new Set()
  return [...fallback, ...remote].filter(item => {
    const id = String(item?.id || item?.slug || item?.title || item?.name || '').toLowerCase()
    if (!id || seen.has(id)) return false
    seen.add(id)
    return true
  })
}

export function normalizeBuilderData(content = {}) {
  const remoteProfile = content.profile || null
  const profileName = String(remoteProfile?.full_name || '').trim().toLowerCase()
  const hasPersonalProfile = Boolean(remoteProfile?.full_name) && !/(bworiey|admin|studio|portfolio owner)/i.test(profileName)
  const settings = { ...LOCAL_FALLBACK.settings, ...(content.settings?.data || {}) }
  if (!hasPersonalProfile) {
    settings.site_name = LOCAL_FALLBACK.settings.site_name
    settings.owner_name = LOCAL_FALLBACK.settings.owner_name
    settings.owner_location = LOCAL_FALLBACK.settings.owner_location
    settings.site_description = LOCAL_FALLBACK.settings.site_description
    settings.site_tagline = LOCAL_FALLBACK.settings.site_tagline
  }
  return {
    profile: hasPersonalProfile ? remoteProfile : LOCAL_FALLBACK.profile,
    settings,
    projects: recordsFrom(content, 'projects', LOCAL_FALLBACK.projects),
    skills: recordsFrom(content, 'skills', LOCAL_FALLBACK.skills),
    experiences: recordsFrom(content, 'experiences', LOCAL_FALLBACK.experiences),
    educations: recordsFrom(content, 'educations', LOCAL_FALLBACK.educations),
    certificates: recordsFrom(content, 'certificates', LOCAL_FALLBACK.certificates),
    articles: recordsFrom(content, 'articles', [])
  }
}

function projectCategory(project) {
  const value = String(project?.category || '').toLowerCase()
  if (value.includes('ui') || value.includes('ux') || value.includes('design')) return 'uiux'
  if (value.includes('cloud') || value.includes('devops') || value.includes('infrastruktur')) return 'cloud-computing'
  if (value.includes('education') || value.includes('learning') || value.includes('pembelajaran') || value.includes('media')) return 'educational-technology'
  return 'web-development'
}

function projectForState(projects, ids) {
  const selected = new Set((ids || []).map(String))
  return projects.filter(project => [project.id, project.slug, project.name, project.title, project.label].filter(Boolean).some(value => selected.has(String(value))))
}

function selectedOrAll(records, ids) {
  const result = projectForState(records, ids)
  return result.length ? result : []
}

function getDefaultState(data, type = 'general') {
  const categories = TYPE_CATEGORY_MAP[type] || []
  const projects = categories.length
    ? data.projects.filter(project => {
      if (categories.includes(projectCategory(project))) return true
      const searchable = String(project.title || '') + ' ' + String(project.description || '') + ' ' + (Array.isArray(project.technologies) ? project.technologies.join(' ') : '')
      const value = searchable.toLowerCase()
      return type === 'cloud' && /(cloud|docker|deployment|run|sql|storage)/.test(value)
        || type === 'web' && /(web|website|laravel|php|javascript|frontend|backend)/.test(value)
    })
    : data.projects
  const title = type === 'general' ? 'Portfolio profesional' : 'Portfolio — ' + (PORTFOLIO_TYPES[type]?.label || 'Portfolio')
  return {
    title,
    description: 'Ringkasan kerja, proyek, dan pengalaman Taufik Raihandani.',
    portfolioType: type,
    language: 'id',
    theme: 'dark',
    accentColor: '#dc5000',
    projectIds: projects.map(item => item.id || item.slug),
    skillIds: data.skills.map(item => item.id || item.slug || item.name),
    experienceIds: data.experiences.map(item => item.id),
    educationIds: data.educations.map(item => item.id),
    certificateIds: data.certificates.map(item => item.id),
    articleIds: data.articles.map(item => item.id || item.slug),
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    showPhoto: true,
    showContact: true,
    density: 'full',
    slug: slugify(title) || 'taufik-raihandani-portfolio'
  }
}

export function normalizeState(value, data) {
  const defaults = getDefaultState(data, value?.portfolio_type || value?.portfolioType || 'general')
  return {
    ...defaults,
    title: value?.title || defaults.title,
    description: value?.description || defaults.description,
    portfolioType: value?.portfolio_type || value?.portfolioType || defaults.portfolioType,
    language: value?.language || defaults.language,
    theme: value?.theme || defaults.theme,
    accentColor: value?.accent_color || value?.accentColor || defaults.accentColor,
    projectIds: Array.isArray(value?.selected_projects) ? value.selected_projects : (Array.isArray(value?.projectIds) ? value.projectIds : defaults.projectIds),
    skillIds: Array.isArray(value?.selected_skills) ? value.selected_skills : (Array.isArray(value?.skillIds) ? value.skillIds : defaults.skillIds),
    experienceIds: Array.isArray(value?.selected_experiences) ? value.selected_experiences : (Array.isArray(value?.experienceIds) ? value.experienceIds : defaults.experienceIds),
    educationIds: Array.isArray(value?.selected_educations) ? value.selected_educations : (Array.isArray(value?.educationIds) ? value.educationIds : defaults.educationIds),
    certificateIds: Array.isArray(value?.selected_certificates) ? value.selected_certificates : (Array.isArray(value?.certificateIds) ? value.certificateIds : defaults.certificateIds),
    articleIds: Array.isArray(value?.selected_articles) ? value.selected_articles : (Array.isArray(value?.articleIds) ? value.articleIds : defaults.articleIds),
    sectionOrder: Array.isArray(value?.section_order) && value.section_order.length ? value.section_order : (Array.isArray(value?.sectionOrder) ? value.sectionOrder : defaults.sectionOrder),
    showPhoto: value?.show_photo ?? value?.showPhoto ?? defaults.showPhoto,
    showContact: value?.show_contact ?? value?.showContact ?? defaults.showContact,
    density: value?.density || defaults.density,
    slug: value?.slug || slugify(value?.title || defaults.title) || defaults.slug
  }
}

function getShareUrl(state) {
  return window.location.origin + '/portfolio/' + encodeURIComponent(state.slug || slugify(state.title) || 'portfolio')
}

function profileName(data) {
  const value = data.profile?.full_name || data.settings.owner_name || ''
  return /(bworiey|admin|studio|portfolio owner)/i.test(value) ? 'Taufik Raihandani' : (value || 'Taufik Raihandani')
}

function renderItems(items, emptyLabel = 'Belum ada data yang dipilih.') {
  return items.length ? items.join('') : '<p class="portfolio-document__empty">' + escapeHtml(emptyLabel) + '</p>'
}

function createQrMarkup(url) {
  return '<div class="portfolio-document__qr"><img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&amp;data=' + encodeURIComponent(url) + '" alt="QR code untuk ' + escapeHtml(url) + '" width="120" height="120" loading="lazy"><small>Scan untuk membuka versi online</small></div>'
}

export function createPortfolioPreviewMarkup(state, data, { publicView = false } = {}) {
  const coverHeadingTag = publicView ? 'h1' : 'h2'
  const selectedProjects = selectedOrAll(data.projects, state.projectIds)
  const selectedSkills = selectedOrAll(data.skills, state.skillIds)
  const selectedExperiences = selectedOrAll(data.experiences, state.experienceIds)
  const selectedEducations = selectedOrAll(data.educations, state.educationIds)
  const selectedCertificates = selectedOrAll(data.certificates, state.certificateIds)
  const selectedArticles = selectedOrAll(data.articles, state.articleIds)
  const name = profileName(data)
  const labels = state.language === 'en'
    ? { about: 'About', skills: 'Skills', projects: 'Selected projects', experience: 'Experience', education: 'Education', certificates: 'Certificates', articles: 'Articles', process: 'Working process', contact: 'Contact', open: 'Open case study' }
    : { about: 'Tentang', skills: 'Keahlian', projects: 'Proyek pilihan', experience: 'Pengalaman', education: 'Pendidikan', certificates: 'Sertifikasi', articles: 'Artikel', process: 'Proses kerja', contact: 'Kontak', open: 'Buka studi kasus' }
  const projectMarkup = selectedProjects.map(project => {
    const projectLink = project.slug
      ? '<a href="' + escapeHtml(safeUrl('/projects/' + encodeURIComponent(project.slug))) + '">' + labels.open + ' ↗</a>'
      : '<span class="portfolio-document__unavailable">Studi kasus belum tersedia</span>'
    const tech = Array.isArray(project.technologies) ? project.technologies.slice(0, 6).join(' · ') : ''
    return '<article class="portfolio-document__project"><div><small>' + escapeHtml(project.category || 'Project') + ' · ' + escapeHtml(project.project_year || '') + '</small><h3>' + escapeHtml(project.title || 'Untitled project') + '</h3><p>' + escapeHtml(project.summary || project.description || '') + '</p></div><div><span>' + escapeHtml(tech) + '</span>' + projectLink + '</div></article>'
  })
  const experienceMarkup = selectedExperiences.map(item => '<article class="portfolio-document__timeline"><small>' + escapeHtml(formatDate(item.start_date)) + ' — ' + escapeHtml(item.is_current ? 'Sekarang' : formatDate(item.end_date)) + '</small><div><h3>' + escapeHtml(item.role_title || 'Role') + '</h3><p>' + escapeHtml(item.company || '') + '</p><p>' + escapeHtml(item.description || '') + '</p></div></article>')
  const educationMarkup = selectedEducations.map(item => '<article class="portfolio-document__timeline"><small>' + escapeHtml(formatDate(item.start_date)) + ' — ' + escapeHtml(formatDate(item.end_date)) + '</small><div><h3>' + escapeHtml(item.degree || 'Pendidikan') + '</h3><p>' + escapeHtml(item.institution || '') + '</p><p>' + escapeHtml(item.description || '') + '</p></div></article>')
  const certificateMarkup = selectedCertificates.map(item => '<article class="portfolio-document__certificate"><small>' + escapeHtml(formatDate(item.issue_date)) + '</small><h3>' + escapeHtml(item.title || '') + '</h3><p>' + escapeHtml(item.issuer || '') + '</p></article>')
  const articleMarkup = selectedArticles.map(item => '<article class="portfolio-document__article"><small>' + escapeHtml(formatDate(item.published_at || item.created_at)) + '</small><h3>' + escapeHtml(item.title || '') + '</h3><p>' + escapeHtml(item.excerpt || item.description || '') + '</p></article>')
  const processMarkup = ['Pahami kebutuhan', 'Rancang alur', 'Bangun dan perbaiki'].map((item, index) => '<article><small>0' + (index + 1) + '</small><h3>' + item + '</h3><p>' + ['Mendengar konteks dan siapa yang akan memakai hasilnya.', 'Menyusun bentuk yang membuat masalah terasa lebih sederhana.', 'Mengembangkan, menguji, dan memperbaiki sampai siap digunakan.'][index] + '</p></article>')
  const sectionMarkup = {
    about: '<section class="portfolio-document__section"><p class="portfolio-document__eyebrow">' + labels.about + '</p><h2>Membuat teknologi terasa lebih mudah dipahami.</h2><p>' + escapeHtml(data.profile?.bio || data.settings.site_description || '') + '</p></section>',
    skills: '<section class="portfolio-document__section"><p class="portfolio-document__eyebrow">' + labels.skills + '</p><h2>Bidang yang saya jelajahi.</h2><div class="portfolio-document__skill-list">' + renderItems(selectedSkills.map(item => '<span>' + escapeHtml(item.name || item.title || item.label || '') + '</span>'), 'Belum ada keahlian yang dipilih.') + '</div></section>',
    projects: '<section class="portfolio-document__section"><p class="portfolio-document__eyebrow">' + labels.projects + '</p><h2>Masalah nyata, solusi yang berguna.</h2><div class="portfolio-document__project-list">' + renderItems(projectMarkup, 'Belum ada proyek yang dipilih.') + '</div></section>',
    experience: '<section class="portfolio-document__section"><p class="portfolio-document__eyebrow">' + labels.experience + '</p><h2>Belajar dengan mengerjakan.</h2><div class="portfolio-document__timeline-list">' + renderItems(experienceMarkup, 'Belum ada pengalaman yang dipilih.') + '</div></section>',
    education: '<section class="portfolio-document__section"><p class="portfolio-document__eyebrow">' + labels.education + '</p><h2>Fondasi yang membentuk cara kerja.</h2><div class="portfolio-document__timeline-list">' + renderItems(educationMarkup, 'Belum ada pendidikan yang dipilih.') + '</div></section>',
    certificates: certificateMarkup.length ? '<section class="portfolio-document__section"><p class="portfolio-document__eyebrow">' + labels.certificates + '</p><h2>Jejak belajar yang terus bergerak.</h2><div class="portfolio-document__certificate-list">' + certificateMarkup.join('') + '</div></section>' : '',
    articles: articleMarkup.length ? '<section class="portfolio-document__section"><p class="portfolio-document__eyebrow">' + labels.articles + '</p><h2>Catatan yang dibagikan.</h2><div class="portfolio-document__article-list">' + articleMarkup.join('') + '</div></section>' : '',
    process: '<section class="portfolio-document__section"><p class="portfolio-document__eyebrow">' + labels.process + '</p><h2>Terbuka, terarah, dan bisa berkembang.</h2><div class="portfolio-document__process-list">' + processMarkup.join('') + '</div></section>',
    contact: state.showContact ? '<section class="portfolio-document__section portfolio-document__contact"><p class="portfolio-document__eyebrow">' + labels.contact + '</p><h2>Mari membangun sesuatu yang bermanfaat.</h2><p>' + escapeHtml(data.settings.site_tagline || 'Terbuka untuk peluang kerja dan kolaborasi.') + '</p><div class="portfolio-document__contact-row"><span>' + escapeHtml(data.settings.owner_location || 'Banjarmasin, Indonesia') + '</span><a href="/#contact">Hubungi saya ↗</a></div></section>' : ''
  }
  const orderedSections = (state.sectionOrder || DEFAULT_SECTION_ORDER).map(key => sectionMarkup[key]).filter(Boolean).join('')
  const photo = state.showPhoto && data.profile?.avatar_url ? '<img class="portfolio-document__cover-photo" src="' + escapeHtml(safeUrl(data.profile.avatar_url)) + '" alt="Foto ' + escapeHtml(name) + '" width="260" height="320" loading="lazy">' : ''
  const cover = '<header class="portfolio-document__cover"><div><p class="portfolio-document__eyebrow">Interactive Portfolio Studio</p><p class="portfolio-document__cover-index">01 / ' + escapeHtml(String(state.portfolioType || 'general')) + '</p></div>' + photo + '<div><' + coverHeadingTag + '>' + escapeHtml(state.title || name) + '</' + coverHeadingTag + '><p>' + escapeHtml(state.description || '') + '</p><span class="portfolio-document__byline">' + escapeHtml(name) + ' · ' + escapeHtml(data.settings.owner_location || 'Indonesia') + '</span></div></header>'
  const footer = '<footer class="portfolio-document__footer"><span>' + escapeHtml(name) + '</span><span>' + escapeHtml(state.slug || '') + '</span></footer>'
  return '<article class="portfolio-document" data-document-theme="' + escapeHtml(state.theme || 'dark') + '" data-density="' + escapeHtml(state.density || 'full') + '" style="--portfolio-accent:' + escapeHtml(state.accentColor || '#dc5000') + '"><div class="portfolio-document__inner">' + cover + orderedSections + (publicView ? '<aside class="portfolio-document__share">' + createQrMarkup(getShareUrl(state)) + '<div><small>Versi publik</small><p>' + escapeHtml(getShareUrl(state)) + '</p></div></aside>' : '') + footer + '</div></article>'
}

function renderSelection(items, name, selectedIds, getTitle, getMeta) {
  const selected = new Set((selectedIds || []).map(String))
  return items.length
    ? items.map(item => { const itemKey = item.id || item.slug || item.name || item.title || item.label || ''; return '<label class="builder-check"><input type="checkbox" name="' + name + '" value="' + escapeHtml(itemKey) + '" ' + (selected.has(String(itemKey)) ? 'checked' : '') + '><span><strong>' + escapeHtml(getTitle(item)) + '</strong><small>' + escapeHtml(getMeta(item)) + '</small></span></label>' }).join('')
    : '<p class="builder-empty">Belum ada data untuk dipilih.</p>'
}

function renderBuilderEditor(container, state, data) {
  const typeButtons = Object.entries(PORTFOLIO_TYPES).map(([key, item]) => '<button type="button" class="builder-type' + (state.portfolioType === key ? ' is-active' : '') + '" data-builder-type="' + key + '" aria-pressed="' + String(state.portfolioType === key) + '"><strong>' + escapeHtml(item.label) + '</strong><span>' + escapeHtml(item.description) + '</span></button>').join('')
  const orderItems = state.sectionOrder.map((key, index) => '<li class="builder-order-row"><span>' + String(index + 1).padStart(2, '0') + '</span><strong>' + escapeHtml(key) + '</strong><div><button type="button" class="icon-button" data-order-up="' + key + '" aria-label="Naikkan ' + key + '">↑</button><button type="button" class="icon-button" data-order-down="' + key + '" aria-label="Turunkan ' + key + '">↓</button></div></li>').join('')
  container.innerHTML = '<div class="builder-panel__heading"><p class="eyebrow">{ Susun portfolio }</p><h2>Ruang kerja yang bisa Anda atur.</h2><p>Pilih fokus, isi, dan urutan yang ingin dibawa ke versi ini. Semua perubahan terlihat di preview.</p></div><fieldset class="builder-fieldset"><legend>Fokus portfolio</legend><div class="builder-type-grid">' + typeButtons + '</div></fieldset><div class="builder-form-grid"><label class="builder-field builder-field--wide"><span>Judul versi</span><input name="builder_title" type="text" value="' + escapeHtml(state.title) + '" maxlength="120"></label><label class="builder-field builder-field--wide"><span>Deskripsi singkat</span><textarea name="builder_description" rows="3" maxlength="260">' + escapeHtml(state.description) + '</textarea></label><label class="builder-field"><span>Bahasa</span><select name="builder_language"><option value="id" ' + (state.language === 'id' ? 'selected' : '') + '>Bahasa Indonesia</option><option value="en" ' + (state.language === 'en' ? 'selected' : '') + '>English</option></select></label><label class="builder-field"><span>Tema</span><select name="builder_theme"><option value="dark" ' + (state.theme === 'dark' ? 'selected' : '') + '>Gelap editorial</option><option value="light" ' + (state.theme === 'light' ? 'selected' : '') + '>Terang kertas</option></select></label><label class="builder-field"><span>Warna aksen</span><select name="builder_accent"><option value="#dc5000" ' + (state.accentColor === '#dc5000' ? 'selected' : '') + '>Ember</option><option value="#879b87" ' + (state.accentColor === '#879b87' ? 'selected' : '') + '>Sage</option><option value="#778da9" ' + (state.accentColor === '#778da9' ? 'selected' : '') + '>Blue grey</option><option value="#b38b62" ' + (state.accentColor === '#b38b62' ? 'selected' : '') + '>Clay</option></select></label><label class="builder-field"><span>Kepadatan isi</span><select name="builder_density"><option value="full" ' + (state.density === 'full' ? 'selected' : '') + '>Lengkap</option><option value="compact" ' + (state.density === 'compact' ? 'selected' : '') + '>Ringkas</option></select></label></div><div class="builder-toggle-row"><label class="builder-toggle"><input name="builder_photo" type="checkbox" ' + (state.showPhoto ? 'checked' : '') + '><span>Tampilkan foto bila tersedia</span></label><label class="builder-toggle"><input name="builder_contact" type="checkbox" ' + (state.showContact ? 'checked' : '') + '><span>Tampilkan kontak</span></label></div><fieldset class="builder-fieldset"><legend>Proyek yang dibawa</legend><div class="builder-selection-grid">' + renderSelection(data.projects, 'builder_projects', state.projectIds, item => item.title || 'Project', item => item.category || 'Project') + '</div></fieldset><fieldset class="builder-fieldset"><legend>Keahlian yang dibawa</legend><div class="builder-selection-grid">' + renderSelection(data.skills, 'builder_skills', state.skillIds, item => item.name || item.title || item.label || 'Skill', item => item.category || '') + '</div></fieldset><fieldset class="builder-fieldset"><legend>Pengalaman yang dibawa</legend><div class="builder-selection-grid">' + renderSelection(data.experiences, 'builder_experiences', state.experienceIds, item => item.role_title || 'Role', item => item.company || '') + '</div></fieldset><fieldset class="builder-fieldset"><legend>Pendidikan yang dibawa</legend><div class="builder-selection-grid">' + renderSelection(data.educations, 'builder_educations', state.educationIds, item => item.degree || 'Pendidikan', item => item.institution || '') + '</div></fieldset><fieldset class="builder-fieldset"><legend>Sertifikasi yang dibawa</legend><div class="builder-selection-grid">' + renderSelection(data.certificates, 'builder_certificates', state.certificateIds, item => item.title || 'Certificate', item => item.issuer || '') + '</div></fieldset><fieldset class="builder-fieldset"><legend>Artikel yang dibawa</legend><div class="builder-selection-grid">' + renderSelection(data.articles, 'builder_articles', state.articleIds, item => item.title || 'Artikel', item => item.category || '') + '</div></fieldset><fieldset class="builder-fieldset"><legend>Urutan section</legend><ol class="builder-order-list" data-builder-order>' + orderItems + '</ol></fieldset>'
}

function syncStateFromEditor(root, state) {
  const get = name => root.querySelector('[name="' + name + '"]')
  state.title = get('builder_title')?.value.trim() || state.title
  state.description = get('builder_description')?.value.trim() || ''
  state.language = get('builder_language')?.value || state.language
  state.theme = get('builder_theme')?.value || state.theme
  state.accentColor = get('builder_accent')?.value || state.accentColor
  state.density = get('builder_density')?.value || state.density
  state.showPhoto = Boolean(get('builder_photo')?.checked)
  state.showContact = Boolean(get('builder_contact')?.checked)
  state.projectIds = [...root.querySelectorAll('input[name="builder_projects"]:checked')].map(item => item.value)
  state.skillIds = [...root.querySelectorAll('input[name="builder_skills"]:checked')].map(item => item.value)
  state.experienceIds = [...root.querySelectorAll('input[name="builder_experiences"]:checked')].map(item => item.value)
  state.educationIds = [...root.querySelectorAll('input[name="builder_educations"]:checked')].map(item => item.value)
  state.certificateIds = [...root.querySelectorAll('input[name="builder_certificates"]:checked')].map(item => item.value)
  state.articleIds = [...root.querySelectorAll('input[name="builder_articles"]:checked')].map(item => item.value)
  state.slug = slugify(state.title) || state.slug
}

function updateBuilderPreview(root, state, data) {
  const preview = root.querySelector('[data-builder-preview-output]')
  if (preview) preview.innerHTML = createPortfolioPreviewMarkup(state, data)
  root.querySelector('[data-builder-share-url]').textContent = getShareUrl(state)
  root.querySelector('[data-builder-state]').textContent = 'Draft lokal · ' + state.slug
  root.querySelector('[data-builder-preview-frame]')?.setAttribute('data-preview-theme', state.theme)
}

function applyPreset(root, state, data, type) {
  const current = getDefaultState(data, type)
  state.portfolioType = type
  state.projectIds = current.projectIds
  state.accentColor = type === 'cloud' ? '#778da9' : type === 'uiux' ? '#879b87' : type === 'educational' ? '#b38b62' : '#dc5000'
  state.title = current.title
  state.slug = current.slug
  renderBuilderEditor(root.querySelector('[data-builder-editor]'), state, data)
  updateBuilderPreview(root, state, data)
}

async function copyText(value, success = 'Link disalin.') {
  try { await navigator.clipboard.writeText(value); showToast(success) } catch { showToast(value, 'info') }
}

async function persistVersion(root, state) {
  const session = await getCurrentSession()
  const payload = {
    owner_id: session?.user?.id,
    title: state.title,
    slug: state.slug,
    portfolio_type: state.portfolioType,
    description: state.description,
    language: state.language,
    theme: state.theme,
    accent_color: state.accentColor,
    selected_projects: state.projectIds,
    selected_skills: state.skillIds,
    selected_experiences: state.experienceIds,
    selected_educations: state.educationIds,
    selected_certificates: state.certificateIds,
    selected_articles: state.articleIds,
    section_order: state.sectionOrder,
    visibility: 'published',
    expires_at: null,
    show_photo: state.showPhoto,
    show_contact: state.showContact,
    density: state.density
  }
  const status = root.querySelector('[data-builder-state]')
  if (session?.user && supabaseConfiguration.ready && supabase) {
    const result = await savePortfolioVersion(payload)
    if (result.ok) {
      localStorage.setItem('portfolio-version:' + state.slug, JSON.stringify(result.data))
      status.textContent = 'Dipublikasikan · ' + state.slug
      showToast('Versi portfolio dipublikasikan.')
      return true
    }
    console.error('Portfolio version save failed:', result.error)
  }
  const localRecord = { ...payload, owner_id: session?.user?.id || null, saved_locally: true, updated_at: new Date().toISOString() }
  localStorage.setItem('portfolio-version:' + state.slug, JSON.stringify(localRecord))
  status.textContent = 'Tersimpan di browser · ' + state.slug
  showToast('Draft tersimpan di browser. Jalankan migration untuk link publik lintas perangkat.', 'info')
  return false
}

async function loadBuilderData() {
  try {
    return normalizeBuilderData(await getPublicContent())
  } catch (error) {
    console.error('Builder content load failed:', error)
    return normalizeBuilderData({})
  }
}

export async function initializePortfolioBuilder() {
  const data = await loadBuilderData()
  const querySlug = new URLSearchParams(window.location.search).get('edit')
  let stored = null
  if (querySlug) {
    const session = await getCurrentSession()
    const remote = session?.user ? await getPortfolioVersionBySlug(querySlug, { ownerId: session.user.id }) : { data: null }
    stored = remote.data || null
  }
  if (!stored && querySlug) {
    try { stored = JSON.parse(localStorage.getItem('portfolio-version:' + querySlug) || 'null') } catch { stored = null }
  }
  const state = normalizeState(stored, data)
  document.title = (state.title || 'Portfolio Builder') + ' — Taufik Raihandani'
  document.body.innerHTML = '<div class="builder-shell"><a class="skip-link" href="#builder-main">Lewati ke konten utama</a><header class="builder-topbar"><a class="text-link" href="/">← Kembali ke portfolio</a><span>Interactive Portfolio Studio</span><a class="text-link" href="/admin/portfolio_versions">Kelola versi ↗</a></header><main id="builder-main" class="portfolio-builder"><section class="builder-editor" data-builder-editor-wrap><div data-builder-editor></div><div class="builder-action-bar"><button class="button button--small" type="button" data-builder-save>Simpan & buat link</button><button class="button button--small button--soft" type="button" data-builder-pdf>Preview / export PDF</button><button class="text-link" type="button" data-builder-copy>Salin link</button><button class="text-link" type="button" data-builder-share>Bagikan</button><button class="text-link" type="button" data-builder-new>Mulai baru</button><p class="builder-status" data-builder-state>Draft lokal</p></div></section><section class="builder-preview"><div class="builder-preview-toolbar"><div><p class="eyebrow">{ Live preview }</p><h1>Versi yang sedang dirakit.</h1></div><div class="builder-device-tabs" role="group" aria-label="Mode preview"><button type="button" class="is-active" data-preview-mode="desktop" aria-pressed="true">Desktop</button><button type="button" data-preview-mode="mobile" aria-pressed="false">Mobile</button><button type="button" data-preview-mode="print" aria-pressed="false">A4</button></div></div><div class="builder-preview-frame" data-builder-preview-frame><div data-builder-preview-output></div></div><div class="builder-share-note"><span>Link versi ini</span><code data-builder-share-url></code></div></section></main></div>'
  const root = document.querySelector('.builder-shell')
  renderBuilderEditor(root.querySelector('[data-builder-editor]'), state, data)
  updateBuilderPreview(root, state, data)
  root.addEventListener('input', () => { syncStateFromEditor(root, state); updateBuilderPreview(root, state, data) })
  root.addEventListener('change', () => { syncStateFromEditor(root, state); updateBuilderPreview(root, state, data) })
  root.addEventListener('click', async event => {
    const typeButton = event.target.closest('[data-builder-type]')
    if (typeButton) { syncStateFromEditor(root, state); applyPreset(root, state, data, typeButton.dataset.builderType); return }
    const up = event.target.closest('[data-order-up]'); const down = event.target.closest('[data-order-down]')
    if (up || down) {
      const key = (up || down).dataset.orderUp || (up || down).dataset.orderDown
      const index = state.sectionOrder.indexOf(key); const target = up ? index - 1 : index + 1
      if (index >= 0 && target >= 0 && target < state.sectionOrder.length) {
        ;[state.sectionOrder[index], state.sectionOrder[target]] = [state.sectionOrder[target], state.sectionOrder[index]]
        renderBuilderEditor(root.querySelector('[data-builder-editor]'), state, data); updateBuilderPreview(root, state, data)
      }
      return
    }
    if (event.target.closest('[data-preview-mode]')) {
      const button = event.target.closest('[data-preview-mode]')
      root.querySelectorAll('[data-preview-mode]').forEach(item => { const active = item === button; item.classList.toggle('is-active', active); item.setAttribute('aria-pressed', String(active)) })
      root.querySelector('[data-builder-preview-frame]')?.setAttribute('data-preview-mode', button.dataset.previewMode)
      return
    }
    if (event.target.closest('[data-builder-save]')) { syncStateFromEditor(root, state); await persistVersion(root, state); updateBuilderPreview(root, state, data); return }
    if (event.target.closest('[data-builder-copy]')) { syncStateFromEditor(root, state); await copyText(getShareUrl(state)); return }
    if (event.target.closest('[data-builder-share]')) {
      syncStateFromEditor(root, state)
      const url = getShareUrl(state)
      if (navigator.share) { try { await navigator.share({ title: state.title, text: state.description, url }) } catch (error) { if (error?.name !== 'AbortError') await copyText(url) } } else await copyText(url)
      return
    }
    if (event.target.closest('[data-builder-pdf]')) {
      syncStateFromEditor(root, state)
      document.body.classList.add('builder-print-mode')
      window.setTimeout(() => window.print(), 20)
      window.addEventListener('afterprint', () => document.body.classList.remove('builder-print-mode'), { once: true })
      return
    }
    if (event.target.closest('[data-builder-new]')) {
      const fresh = getDefaultState(data, 'general')
      Object.assign(state, fresh)
      renderBuilderEditor(root.querySelector('[data-builder-editor]'), state, data); updateBuilderPreview(root, state, data); showToast('Ruang kerja dimulai ulang.', 'info')
    }
  })
}
