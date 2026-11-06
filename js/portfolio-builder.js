import { printPortfolio, normalizeAppearance, cardsMarkup, heroCards } from './extra-template.js'
import { supabase, supabaseConfiguration } from '../supabase.js'
import { getCurrentSession } from './auth.js'
import { getPublicContent } from './services/public-content-service.js'
import { getPortfolioVersionBySlug, savePortfolioVersion } from './services/portfolio-version-service.js'
import { escapeHtml, formatDate, safeUrl, showToast, slugify } from './utils.js'

export const PORTFOLIO_TYPES = {
  general: { label: 'General', description: 'Ringkasan menyeluruh tentang cara Anda bekerja.' },
  uiux: { label: 'UI/UX', description: 'Menonjolkan proses, alur, dan keputusan desain.' },
  web: { label: 'Web development', description: 'Menonjolkan produk web, stack, dan implementasi.' },
  educational: { label: 'Teknologi pendidikan', description: 'Menonjolkan pengalaman belajar dan media interaktif.' },
  cloud: { label: 'Cloud computing', description: 'Menonjolkan arsitektur, deployment, dan layanan cloud.' },
  custom: { label: 'Custom', description: 'Susun sendiri isi dan urutan portfolio Anda.' }
}

export const DEFAULT_SECTION_ORDER = ['about', 'skills', 'projects', 'experience', 'education', 'certificates', 'process', 'contact']

const SECTION_ALIASES = {
  about: ['about', 'about_me', 'profile'],
  skills: ['skills', 'skill', 'services', 'service'],
  projects: ['projects', 'featured_projects', 'portfolio', 'work'],
  experience: ['experiences', 'experience'],
  education: ['educations', 'education'],
  certificates: ['certificates', 'certificate'],
  articles: ['articles', 'article', 'notes'],
  process: ['process'],
  contact: ['contact', 'cta']
}

const TYPE_CATEGORY_MAP = {
  general: [],
  uiux: ['uiux'],
  web: ['web-development'],
  educational: ['educational-technology'],
  cloud: ['cloud-computing'],
  custom: []
}

function recordsFrom(content, key) {
  const remote = Array.isArray(content?.[key]?.data) ? content[key].data : []
  return remote.filter(Boolean)
}

export function normalizeBuilderData(content = {}) {
  const settings = content.settings?.data || {}
  return {
    profile: content.profile || null,
    settings,
    projects: recordsFrom(content, 'projects'),
    skills: recordsFrom(content, 'skills'),
    experiences: recordsFrom(content, 'experiences'),
    educations: recordsFrom(content, 'educations'),
    certificates: recordsFrom(content, 'certificates'),
    articles: recordsFrom(content, 'articles'),
    socialLinks: recordsFrom(content, 'socialLinks'),
    sections: recordsFrom(content, 'sections')
  }
}

function sectionFor(data, key) {
  const aliases = SECTION_ALIASES[key] || [key]
  return (data.sections || []).find(section => aliases.includes(section.section_key)) || null
}

function sectionLabel(section) {
  return section?.eyebrow || section?.section_name || ''
}

function sectionTitle(section) {
  return section?.title || ''
}

function sectionDescription(section) {
  return section?.description || section?.subtitle || ''
}

function sectionShell(section, label, title, description, body = '') {
  if (!section) return ''
  const labelMarkup = label ? '<p class="portfolio-document__eyebrow">' + escapeHtml(label) + '</p>' : ''
  const titleMarkup = title ? '<h2>' + escapeHtml(title) + '</h2>' : ''
  const descriptionMarkup = description ? '<p>' + escapeHtml(description) + '</p>' : ''
  return '<section class="portfolio-document__section">' + labelMarkup + titleMarkup + descriptionMarkup + body + '</section>'
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
  const ownerName = profileName(data)
  const title = type === 'general' ? (data.settings.site_name || ownerName || 'Portfolio') : [data.settings.site_name || ownerName, PORTFOLIO_TYPES[type]?.label].filter(Boolean).join(' — ')
  return {
    title,
    description: data.settings.site_description || data.settings.site_tagline || '',
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
    slug: slugify(title) || 'portfolio'
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
  return data.profile?.full_name || data.settings.owner_name || ''
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
  const appearance = normalizeAppearance(data.settings.appearance_published)
  const sections = Object.fromEntries(Object.keys(SECTION_ALIASES).map(key => [key, sectionFor(data, key)]))
  const labels = Object.fromEntries(Object.keys(sections).map(key => [key, sectionLabel(sections[key])]))
  const openLabel = state.language === 'en' ? 'Open case study' : 'Buka studi kasus'
  const projectMarkup = selectedProjects.map(project => {
    const projectLink = project.slug
      ? '<a href="' + escapeHtml(safeUrl('/projects/' + encodeURIComponent(project.slug))) + '">' + openLabel + ' ↗</a>'
      : ''
    const tech = Array.isArray(project.technologies) ? project.technologies.slice(0, 6).join(' · ') : ''
    const meta = [project.category, project.project_year].filter(Boolean).join(' · ')
    return '<article class="portfolio-document__project"><div>' + (state.theme === 'extra' && (project.cover_url || project.thumbnail_url) ? '<img class="extra-document-cover" src="' + escapeHtml(safeUrl(project.cover_url || project.thumbnail_url)) + '" alt="' + escapeHtml(project.title) + '" style="object-position:' + (appearance.crops[project.id]?.x ?? 50) + '% ' + (appearance.crops[project.id]?.y ?? 50) + '%">' : '') + (meta ? '<small>' + escapeHtml(meta) + '</small>' : '') + '<h3>' + escapeHtml(project.title || '') + '</h3><p>' + escapeHtml(project.summary || project.description || '') + '</p></div><div>' + (tech ? '<span>' + escapeHtml(tech) + '</span>' : '') + projectLink + '</div></article>'
  })
  const experienceMarkup = selectedExperiences.map(item => '<article class="portfolio-document__timeline"><small>' + escapeHtml(formatDate(item.start_date)) + ' — ' + escapeHtml(item.is_current ? (state.language === 'en' ? 'Present' : 'Sekarang') : formatDate(item.end_date)) + '</small><div><h3>' + escapeHtml(item.role_title || '') + '</h3><p>' + escapeHtml(item.company || '') + '</p><p>' + escapeHtml(item.description || '') + '</p></div></article>')
  const educationMarkup = selectedEducations.map(item => '<article class="portfolio-document__timeline"><small>' + escapeHtml(formatDate(item.start_date)) + ' — ' + escapeHtml(item.is_current ? (state.language === 'en' ? 'Present' : 'Sekarang') : formatDate(item.end_date)) + '</small><div><h3>' + escapeHtml(item.degree || item.field_of_study || '') + '</h3><p>' + escapeHtml(item.institution || '') + '</p><p>' + escapeHtml(item.description || '') + '</p></div></article>')
  const certificateMarkup = selectedCertificates.map(item => '<article class="portfolio-document__certificate"><small>' + escapeHtml(formatDate(item.issue_date)) + '</small><h3>' + escapeHtml(item.title || '') + '</h3><p>' + escapeHtml(item.issuer || '') + '</p>' + (item.certificate_url ? '<a href="' + escapeHtml(safeUrl(item.certificate_url)) + '" target="_blank" rel="noopener"><img class="extra-certificate-thumb" src="' + escapeHtml(safeUrl(item.certificate_url)) + '" alt="' + escapeHtml(item.title) + '" width="240" height="160"></a>' : '') + (item.file_url ? '<a href="' + escapeHtml(safeUrl(item.file_url)) + '" target="_blank" rel="noopener">Unduh dokumen</a>' : '') + '</article>')
  const articleMarkup = selectedArticles.map(item => '<article class="portfolio-document__article"><small>' + escapeHtml(formatDate(item.published_at || item.created_at)) + '</small><h3>' + escapeHtml(item.title || '') + '</h3><p>' + escapeHtml(item.excerpt || item.description || '') + '</p></article>')
  const processSteps = Array.isArray(sections.process?.custom_data?.steps) ? sections.process.custom_data.steps : []
  const processMarkup = processSteps.map((item, index) => '<article><small>' + String(index + 1).padStart(2, '0') + '</small><h3>' + escapeHtml(item.title || '') + '</h3><p>' + escapeHtml(item.description || '') + '</p></article>')
  const sectionMarkup = {
    about: sectionShell(sections.about, labels.about, sectionTitle(sections.about), sectionDescription(sections.about), '<p>' + escapeHtml(sections.about?.custom_data?.bio_long || sections.about?.custom_data?.bio_short || data.profile?.bio || '') + '</p>'),
    skills: sectionShell(sections.skills, labels.skills, sectionTitle(sections.skills), sectionDescription(sections.skills), '<div class="portfolio-document__skill-list">' + renderItems(selectedSkills.map(item => '<span>' + escapeHtml(item.name || item.title || item.label || '') + '</span>')) + '</div>'),
    projects: sectionShell(sections.projects, labels.projects, sectionTitle(sections.projects), sectionDescription(sections.projects), '<div class="portfolio-document__project-list">' + renderItems(projectMarkup) + '</div>'),
    experience: sectionShell(sections.experience, labels.experience, sectionTitle(sections.experience), sectionDescription(sections.experience), '<div class="portfolio-document__timeline-list">' + renderItems(experienceMarkup) + '</div>'),
    education: sectionShell(sections.education, labels.education, sectionTitle(sections.education), sectionDescription(sections.education), '<div class="portfolio-document__timeline-list">' + renderItems(educationMarkup) + '</div>'),
    certificates: certificateMarkup.length ? sectionShell(sections.certificates, labels.certificates, sectionTitle(sections.certificates), sectionDescription(sections.certificates), '<div class="portfolio-document__certificate-list">' + certificateMarkup.join('') + '</div>') : '',
    articles: articleMarkup.length ? sectionShell(sections.articles, labels.articles, sectionTitle(sections.articles), sectionDescription(sections.articles), '<div class="portfolio-document__article-list">' + articleMarkup.join('') + '</div>') : '',
    process: processMarkup.length ? sectionShell(sections.process, labels.process, sectionTitle(sections.process), sectionDescription(sections.process), '<div class="portfolio-document__process-list">' + processMarkup.join('') + '</div>') : '',
    contact: state.showContact ? sectionShell(sections.contact, labels.contact, sectionTitle(sections.contact), sectionDescription(sections.contact) || data.settings.site_tagline, '<div class="portfolio-document__contact-row">' + (data.settings.owner_location ? '<span>' + escapeHtml(data.settings.owner_location) + '</span>' : '') + (data.settings.owner_email ? '<a href="mailto:' + escapeHtml(data.settings.owner_email) + '">' + escapeHtml(data.settings.owner_email) + '</a>' : '') + '</div>') : ''
  }
  const orderedSections = (state.sectionOrder || DEFAULT_SECTION_ORDER).map(key => sectionMarkup[key]).filter(Boolean).join('')
  const photo = state.showPhoto && data.profile?.avatar_url ? '<img class="portfolio-document__cover-photo" style="object-position:' + appearance.focalX + '% ' + appearance.focalY + '%" src="' + escapeHtml(safeUrl(data.profile.avatar_url)) + '" alt="' + escapeHtml(name) + '" width="260" height="320" loading="lazy">' : ''
  const coverEyebrow = sectionLabel(sections.hero) || ''
  let cover = '<header class="portfolio-document__cover"><div>' + (coverEyebrow ? '<p class="portfolio-document__eyebrow">' + escapeHtml(coverEyebrow) + '</p>' : '') + '<p class="portfolio-document__cover-index">01 / ' + escapeHtml(String(state.portfolioType || 'general')) + '</p></div>' + photo + '<div><' + coverHeadingTag + '>' + escapeHtml(state.title || name) + '</' + coverHeadingTag + '><p>' + escapeHtml(state.description || sectionDescription(sections.hero)) + '</p>' + (name || data.settings.owner_location ? '<span class="portfolio-document__byline">' + escapeHtml([name, data.settings.owner_location].filter(Boolean).join(' · ')) + '</span>' : '') + '</div></header>'
  if (state.theme === 'extra') {
    const hero = data.sections.find(section => section.section_key === 'hero')
    const role = hero?.custom_data?.roles?.[0] || ''
    const heroPhoto = state.showPhoto && (appearance.photoSource === 'hero' ? data.settings.hero_image || data.profile?.avatar_url : data.profile?.avatar_url)
    const image = heroPhoto ? '<img class="portfolio-document__cover-photo" src="' + escapeHtml(safeUrl(heroPhoto)) + '" alt="' + escapeHtml(name) + '" style="object-position:' + appearance.focalX + '% ' + appearance.focalY + '%" width="400" height="400">' : ''
    cover = '<header class="portfolio-document__cover"><div><p class="portfolio-document__eyebrow">' + escapeHtml(state.title) + '</p></div>' + image + '<div><' + coverHeadingTag + '>' + escapeHtml(name) + '</' + coverHeadingTag + '><p><strong>' + escapeHtml(role) + '</strong></p><p>' + escapeHtml(data.profile?.bio || state.description || '') + '</p>' + cardsMarkup(heroCards(appearance, { projects: selectedProjects, skills: selectedSkills, hero })) + '</div></header>'
  }
  const footer = '<footer class="portfolio-document__footer"><span>' + escapeHtml(name) + '</span><span>' + escapeHtml(state.slug || '') + '</span></footer>'
  return '<article class="portfolio-document" data-document-theme="' + escapeHtml(state.theme || 'dark') + '" data-density="' + escapeHtml(state.density || 'full') + '" style="--portfolio-accent:' + escapeHtml(/^#[\da-f]{6}$/i.test(state.accentColor || '') ? state.accentColor : '#0075de') + '"><div class="portfolio-document__inner">' + cover + orderedSections + (publicView ? '<aside class="portfolio-document__share">' + createQrMarkup(getShareUrl(state)) + '<div><small>Versi publik</small><p>' + escapeHtml(getShareUrl(state)) + '</p></div></aside>' : '') + footer + '</div></article>'
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
  container.innerHTML = '<div class="builder-panel__heading"><p class="eyebrow">{ Susun portfolio }</p><h2>Ruang kerja yang bisa Anda atur.</h2><p>Pilih fokus, isi, dan urutan yang ingin dibawa ke versi ini. Semua perubahan terlihat di preview.</p></div><fieldset class="builder-fieldset"><legend>Fokus portfolio</legend><div class="builder-type-grid">' + typeButtons + '</div></fieldset><div class="builder-form-grid"><label class="builder-field builder-field--wide"><span>Judul versi</span><input name="builder_title" type="text" value="' + escapeHtml(state.title) + '" maxlength="120"></label><label class="builder-field builder-field--wide"><span>Deskripsi singkat</span><textarea name="builder_description" rows="3" maxlength="260">' + escapeHtml(state.description) + '</textarea></label><label class="builder-field"><span>Bahasa</span><select name="builder_language"><option value="id" ' + (state.language === 'id' ? 'selected' : '') + '>Bahasa Indonesia</option><option value="en" ' + (state.language === 'en' ? 'selected' : '') + '>English</option></select></label><label class="builder-field"><span>Tema</span><select name="builder_theme"><option value="dark" ' + (state.theme === 'dark' ? 'selected' : '') + '>Gelap editorial</option><option value="extra" ' + (state.theme === 'extra' ? 'selected' : '') + '>Extra</option><option value="light" ' + (state.theme === 'light' ? 'selected' : '') + '>Terang kertas</option></select></label><label class="builder-field"><span>Warna aksen</span><select name="builder_accent"><option value="#dc5000" ' + (state.accentColor === '#dc5000' ? 'selected' : '') + '>Ember</option><option value="#879b87" ' + (state.accentColor === '#879b87' ? 'selected' : '') + '>Sage</option><option value="#778da9" ' + (state.accentColor === '#778da9' ? 'selected' : '') + '>Blue grey</option><option value="#b38b62" ' + (state.accentColor === '#b38b62' ? 'selected' : '') + '>Clay</option></select></label><label class="builder-field"><span>Kepadatan isi</span><select name="builder_density"><option value="full" ' + (state.density === 'full' ? 'selected' : '') + '>Lengkap</option><option value="compact" ' + (state.density === 'compact' ? 'selected' : '') + '>Ringkas</option></select></label></div><div class="builder-toggle-row"><label class="builder-toggle"><input name="builder_photo" type="checkbox" ' + (state.showPhoto ? 'checked' : '') + '><span>Tampilkan foto bila tersedia</span></label><label class="builder-toggle"><input name="builder_contact" type="checkbox" ' + (state.showContact ? 'checked' : '') + '><span>Tampilkan kontak</span></label></div><fieldset class="builder-fieldset"><legend>Proyek yang dibawa</legend><div class="builder-selection-grid">' + renderSelection(data.projects, 'builder_projects', state.projectIds, item => item.title || 'Project', item => item.category || 'Project') + '</div></fieldset><fieldset class="builder-fieldset"><legend>Keahlian yang dibawa</legend><div class="builder-selection-grid">' + renderSelection(data.skills, 'builder_skills', state.skillIds, item => item.name || item.title || item.label || 'Skill', item => item.category || '') + '</div></fieldset><fieldset class="builder-fieldset"><legend>Pengalaman yang dibawa</legend><div class="builder-selection-grid">' + renderSelection(data.experiences, 'builder_experiences', state.experienceIds, item => item.role_title || 'Role', item => item.company || '') + '</div></fieldset><fieldset class="builder-fieldset"><legend>Pendidikan yang dibawa</legend><div class="builder-selection-grid">' + renderSelection(data.educations, 'builder_educations', state.educationIds, item => item.degree || 'Pendidikan', item => item.institution || '') + '</div></fieldset><fieldset class="builder-fieldset"><legend>Sertifikasi yang dibawa</legend><div class="builder-selection-grid">' + renderSelection(data.certificates, 'builder_certificates', state.certificateIds, item => item.title || 'Certificate', item => item.issuer || '') + '</div></fieldset><fieldset class="builder-fieldset"><legend>Artikel yang dibawa</legend><div class="builder-selection-grid">' + renderSelection(data.articles, 'builder_articles', state.articleIds, item => item.title || 'Artikel', item => item.category || '') + '</div></fieldset><fieldset class="builder-fieldset"><legend>Urutan section</legend><ol class="builder-order-list" data-builder-order>' + orderItems + '</ol></fieldset>'
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
      status.textContent = 'Dipublikasikan · ' + state.slug
      showToast('Versi portfolio dipublikasikan.')
      return true
    }
    console.error('Portfolio version save failed:', result.error)
  }
  status.textContent = 'Belum tersimpan'
  showToast('Versi belum tersimpan. Login sebagai admin dan pastikan Supabase tersedia.', 'error')
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
  const state = normalizeState(stored, data)
  document.title = [state.title, profileName(data)].filter(Boolean).join(' — ') || 'Portfolio'
  document.body.innerHTML = '<div class="builder-shell"><a class="skip-link" href="#builder-main">Lewati ke konten utama</a><header class="builder-topbar"><a class="text-link" href="/">← Kembali ke portfolio</a><span>Interactive Portfolio Studio</span><a class="text-link" href="/admin/portfolio_versions">Kelola versi ↗</a></header><main id="builder-main" class="portfolio-builder"><section class="builder-editor" data-builder-editor-wrap><div data-builder-editor></div><div class="builder-action-bar"><button class="button button--small" type="button" data-builder-save>Publikasikan versi</button><button class="button button--small button--soft" type="button" data-builder-pdf>Cetak / Simpan PDF</button><button class="text-link" type="button" data-builder-copy>Salin link</button><button class="text-link" type="button" data-builder-share>Bagikan</button><button class="text-link" type="button" data-builder-new>Mulai baru</button><p class="builder-status" data-builder-state>Draft lokal</p></div></section><section class="builder-preview"><div class="builder-preview-toolbar"><div><p class="eyebrow">{ Live preview }</p><h1>Versi yang sedang dirakit.</h1></div><div class="builder-device-tabs" role="group" aria-label="Mode preview"><button type="button" class="is-active" data-preview-mode="desktop" aria-pressed="true">Desktop</button><button type="button" data-preview-mode="mobile" aria-pressed="false">Mobile</button><button type="button" data-preview-mode="print" aria-pressed="false">A4</button></div></div><div class="builder-preview-frame" data-builder-preview-frame><div data-builder-preview-output></div></div><div class="builder-share-note"><span>Link versi ini</span><code data-builder-share-url></code></div></section></main></div>'
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
      updateBuilderPreview(root, state, data)
      await printPortfolio('builder-print-mode')
      return
    }
    if (event.target.closest('[data-builder-new]')) {
      const fresh = getDefaultState(data, 'general')
      Object.assign(state, fresh)
      renderBuilderEditor(root.querySelector('[data-builder-editor]'), state, data); updateBuilderPreview(root, state, data); showToast('Ruang kerja dimulai ulang.', 'info')
    }
  })
}
