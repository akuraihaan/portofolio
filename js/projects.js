import { applyExtraAppearance } from './extra-template.js'
import { getPublicContent } from './services/public-content-service.js'
import { escapeHtml, safeUrl } from './utils.js'

function categoryKey(value = '') {
  const text = String(value).toLowerCase()
  if (/(ui|ux|design)/.test(text)) return 'uiux'
  if (/(cloud|devops|infrastruktur)/.test(text)) return 'cloud-computing'
  if (/(education|learning|pembelajaran|media)/.test(text)) return 'educational-technology'
  return 'web-development'
}

function projectImage(project) {
  return project.thumbnail_url || project.cover_url || project.cover_image_url || ''
}

function renderProjects(projects) {
  const grid = document.querySelector('[data-all-projects]')
  const count = document.querySelector('[data-all-project-count]')
  if (!grid) return
  if (count) count.textContent = `${projects.length} proyek dipublikasikan`
  if (!projects.length) {
    grid.innerHTML = '<div class="public-empty-state">Belum ada proyek yang dipublikasikan.</div>'
    return
  }
  grid.innerHTML = projects.map((project, index) => {
    const image = projectImage(project)
    const year = project.project_year || (project.completion_date ? new Date(project.completion_date).getFullYear() : '')
    const technologies = Array.isArray(project.technologies) ? project.technologies.filter(Boolean).slice(0, 5) : []
    const detail = `/projects/${encodeURIComponent(project.slug || '')}`
    const media = image
      ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(project.title || '')}" loading="${index < 2 ? 'eager' : 'lazy'}" decoding="async" width="1200" height="750">`
      : `<span class="project-card__image-fallback">${escapeHtml(String(project.title || '').slice(0, 2).toUpperCase())}</span>`
    return `<article class="all-project-card" data-all-project-card data-category="${escapeHtml(categoryKey(project.category))}" data-search="${escapeHtml([project.title, project.category, project.summary, technologies.join(' ')].filter(Boolean).join(' '))}"><a class="all-project-card__media" href="${escapeHtml(detail)}">${media}</a><div class="all-project-card__body"><div class="project-card__eyebrow"><span>${escapeHtml(project.category || '')}</span><span>${escapeHtml(String(year || ''))}</span></div><h2><a href="${escapeHtml(detail)}">${escapeHtml(project.title || '')}</a></h2><p>${escapeHtml(project.summary || project.description || '')}</p><div class="tag-list">${technologies.map(item => `<span>${escapeHtml(item)}</span>`).join('')}</div><div class="all-project-card__actions"><a class="text-link" href="${escapeHtml(detail)}">Buka studi kasus <span aria-hidden="true">↗</span></a>${project.project_url ? `<a class="text-link" href="${escapeHtml(safeUrl(project.project_url))}" target="_blank" rel="noopener noreferrer">Demo <span aria-hidden="true">↗</span></a>` : ''}</div></div></article>`
  }).join('')
}

function renderFilters(projects) {
  const container = document.querySelector('[data-all-project-filters]')
  if (!container) return
  const categories = [...new Map(projects.filter(project => project.category).map(project => [categoryKey(project.category), project.category])).entries()]
  container.innerHTML = '<button class="filter-button is-active" type="button" data-all-project-filter="all" aria-pressed="true">Semua</button>' + categories.map(([key, label]) => `<button class="filter-button" type="button" data-all-project-filter="${escapeHtml(key)}" aria-pressed="false">${escapeHtml(label)}</button>`).join('')
}

function bindFilters(projects) {
  const search = document.querySelector('[data-all-project-search]')
  const buttons = [...document.querySelectorAll('[data-all-project-filter]')]
  const apply = () => {
    const category = document.querySelector('[data-all-project-filter].is-active')?.dataset.allProjectFilter || 'all'
    const term = search?.value.trim().toLowerCase() || ''
    let visible = 0
    document.querySelectorAll('[data-all-project-card]').forEach(card => {
      const matchesCategory = category === 'all' || card.dataset.category === category
      const matchesSearch = !term || card.dataset.search.toLowerCase().includes(term)
      card.hidden = !(matchesCategory && matchesSearch)
      if (!card.hidden) visible += 1
    })
    const count = document.querySelector('[data-all-project-count]')
    if (count) count.textContent = `${visible} proyek ditampilkan`
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    buttons.forEach(item => { const active = item === button; item.classList.toggle('is-active', active); item.setAttribute('aria-pressed', String(active)) })
    apply()
  }))
  search?.addEventListener('input', apply)
}

export async function initializeProjects() {
  let content = {}
  try { content = await getPublicContent() } catch (error) { console.error('Project listing failed:', error) }
  const projects = Array.isArray(content.projects?.data) ? content.projects.data : []
  const settings = content.settings?.data || {}
  const profile = content.profile || null
  const section = (content.sections?.data || []).find(item => ['projects', 'featured_projects', 'work', 'portfolio'].includes(item.section_key)) || {}
  const name = profile?.full_name || settings.owner_name || ''
  const title = settings.default_meta_title || section.title || name || 'Portofolio'
  document.title = title
  document.querySelector('meta[name="description"]')?.setAttribute('content', settings.default_meta_description || section.description || '')
  document.body.innerHTML = `<div class="listing-page"><a class="skip-link" href="#listing-main">Lewati ke konten utama</a><header class="listing-topbar"><a class="brand" href="/"><span class="brand__mark">${escapeHtml((name.match(/\b\w/g) || ['']).slice(0, 2).join('').toUpperCase())}</span><span>${escapeHtml(name)}</span></a><a class="text-link" href="/">← Kembali ke portfolio</a></header><main id="listing-main" class="listing-main"><div class="listing-heading"><p class="eyebrow">${escapeHtml(section.eyebrow || '')}</p><h1>${escapeHtml(section.title || '')}</h1><p>${escapeHtml(section.description || '')}</p></div><div class="listing-toolbar"><label class="search-label">Cari proyek<input type="search" data-all-project-search placeholder="Judul, kategori, teknologi" aria-label="Cari semua proyek"></label><div class="filter-row" data-all-project-filters role="group" aria-label="Filter semua proyek"></div></div><p class="listing-count" data-all-project-count></p><div class="all-project-grid" data-all-projects></div></main></div>`
  renderFilters(projects)
  renderProjects(projects)
  bindFilters(projects)
  applyExtraAppearance(settings)
  if (content.projects?.ok === false) document.querySelector('[data-all-projects]').innerHTML = '<p role="alert">Proyek tidak dapat dimuat. Silakan coba lagi.</p>'
}
