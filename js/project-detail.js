import { getPublicContent } from './services/public-content-service.js'
import { escapeHtml, formatDate, safeUrl, showToast } from './utils.js'
import { normalizeBuilderData } from './portfolio-builder.js'
import { applyExtraAppearance, extraHomeNavigation } from './extra-template.js'

function setMeta(name, content, property = false) {
  const selector = property ? 'meta[property="' + name + '"]' : 'meta[name="' + name + '"]'
  let element = document.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    if (property) element.setAttribute('property', name)
    else element.setAttribute('name', name)
    document.head.append(element)
  }
  element.setAttribute('content', content)
}

function setCanonical(url) {
  let link = document.querySelector('link[rel="canonical"]')
  if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.append(link) }
  link.href = url
}

function renderList(items) {
  return Array.isArray(items) && items.length ? '<ul>' + items.map(item => '<li>' + escapeHtml(item) + '</li>').join('') + '</ul>' : '<p class="case-study__missing">Detail ini belum ditambahkan.</p>'
}

export function renderProject(project, media = [], content = {}) {
  const study = project.case_study || {}
  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : String(project.technologies || '').split(',').map(item => item.trim()).filter(Boolean)
  const sections = [
    ['background', 'Konteks'],
    ['problem', 'Masalah yang ditemui'],
    ['goal', 'Tujuan'],
    ['audience', 'Untuk siapa'],
    ['architecture', 'Arsitektur dan teknologi'],
    ['challenges', 'Tantangan'],
    ['solution', 'Solusi'],
    ['outcome', 'Hasil'],
    ['lessons', 'Pelajaran']
  ]
  const bodySections = sections.filter(([key]) => study[key]).map(([key, title]) => '<section class="case-study__section" data-reveal><p class="eyebrow">{ ' + escapeHtml(title) + ' }</p><h2>' + escapeHtml(title) + '</h2><p>' + escapeHtml(study[key]) + '</p></section>').join('')
  const gallery = media.length
    ? '<section class="case-study__gallery"><p class="eyebrow">{ Galeri }</p><div>' + media.map(item => '<figure><img src="' + escapeHtml(item.media_url || '') + '" alt="' + escapeHtml(item.alt_text || project.title) + '" loading="lazy" decoding="async" width="1200" height="675"><figcaption>' + escapeHtml(item.caption || '') + '</figcaption></figure>').join('') + '</div></section>'
    : ''
  const responsibilities = renderList(study.responsibilities)
  const links = (project.project_url ? '<a class="button button--small" href="' + escapeHtml(safeUrl(project.project_url)) + '" target="_blank" rel="noreferrer">Lihat demo ↗</a>' : '') + (project.repository_url ? '<a class="text-link" href="' + escapeHtml(safeUrl(project.repository_url)) + '" target="_blank" rel="noreferrer">Repository ↗</a>' : '')
  const year = project.project_year || (project.completion_date ? String(new Date(project.completion_date).getFullYear()) : '')
  document.body.innerHTML = '<div class="case-study-page"><a class="skip-link" href="#case-study-main">Lewati ke konten utama</a><header class="case-study__topbar"><a class="text-link" href="/">← Kembali ke portfolio</a><span>Interactive Portfolio Studio</span><div><button class="text-link" type="button" data-detail-share>Bagikan</button><button class="text-link" type="button" data-detail-copy>Salin link</button></div></header><main id="case-study-main"><header class="case-study__hero"><p class="eyebrow">{ Studi kasus }</p><p class="case-study__index">' + escapeHtml(project.category || '') + ' · ' + escapeHtml(year) + '</p><h1>' + escapeHtml(project.title || '') + '</h1><p class="case-study__summary">' + escapeHtml(project.summary || project.description || '') + '</p><div class="case-study__meta"><span><small>Peran</small><strong>' + escapeHtml(project.role || '') + '</strong></span><span><small>Teknologi</small><strong>' + escapeHtml(technologies.join(' · ')) + '</strong></span><span><small>Status</small><strong>' + escapeHtml(project.status || '') + '</strong></span></div></header><section class="case-study__cover">' + (project.cover_url || project.thumbnail_url ? '<img src="' + escapeHtml(project.cover_url || project.thumbnail_url) + '" alt="' + escapeHtml(project.title) + '" width="1600" height="900">' : '<div class="case-study__cover-placeholder"><span>Visual proyek belum ditambahkan</span><small>Tambahkan cover dari panel admin agar studi kasus lebih lengkap.</small></div>') + '</section><div class="case-study__intro"><div><p class="eyebrow">{ Ringkasan }</p><p>' + escapeHtml(project.description || project.summary || '') + '</p></div><div><p class="eyebrow">{ Tanggung jawab }</p>' + responsibilities + '</div></div>' + bodySections + gallery + '<footer class="case-study__footer"><div><p class="eyebrow">{ Lanjutkan eksplorasi }</p><h2>Ingin melihat versi portfolio yang lebih ringkas?</h2></div><div class="case-study__footer-actions"><a class="button button--small" href="/portfolio-builder">Buat portfolio PDF ↗</a>' + links + '<a class="text-link" href="/#contact">Hubungi saya ↗</a></div></footer></main></div>'
  const contentName = content.profile?.full_name || content.settings?.data?.owner_name || ''
  document.title = project.title + (contentName ? ' — ' + contentName : '')
  const url = window.location.origin + '/projects/' + encodeURIComponent(project.slug || '')
  const description = project.summary || project.description || ''
  setMeta('description', description)
  setMeta('og:title', document.title, true)
  setMeta('og:description', description, true)
  setMeta('og:url', url, true)
  setCanonical(url)
  const jsonLd = { '@context': 'https://schema.org', '@type': 'CreativeWork', name: project.title, description, author: { '@type': 'Person', name: contentName || undefined }, url }
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(jsonLd)
  document.head.append(script)
  const share = async () => {
    if (navigator.share) { try { await navigator.share({ title: project.title, text: description, url }) } catch (error) { if (error?.name !== 'AbortError') await navigator.clipboard?.writeText(url) } }
    else { try { await navigator.clipboard.writeText(url); showToast('Link studi kasus disalin.') } catch { showToast(url, 'info') } }
  }
  document.querySelector('[data-detail-share]')?.addEventListener('click', share)
  document.querySelector('[data-detail-copy]')?.addEventListener('click', async () => { try { await navigator.clipboard.writeText(url); showToast('Link studi kasus disalin.') } catch { showToast(url, 'info') } })
  const config = applyExtraAppearance(content.settings?.data)
  if (config.template === 'extra') {
    const back = document.querySelector('.case-study__topbar a')
    if (back) back.href = '/#work'
    const brand = document.querySelector('.case-study__topbar > span')
    if (brand) brand.textContent = contentName
    document.querySelector('.case-study__topbar')?.insertAdjacentHTML('afterend', extraHomeNavigation(content))
    const crop = config.crops[project.id]
    const cover = document.querySelector('.case-study__cover img')
    if (cover && crop) cover.style.objectPosition = `${crop.x}% ${crop.y}%`
  }
}

export async function initializeProjectDetail(slug) {
  let content = {}
  try { content = await getPublicContent() } catch (error) { console.error('Project detail content load failed:', error) }
  if (!content.projects?.ok) {
    document.body.innerHTML = '<main class="admin-auth-page"><section class="admin-auth-card"><h1>Proyek tidak dapat dimuat.</h1><p role="alert">Koneksi atau schema konten belum tersedia. Silakan coba lagi.</p><a href="/">Kembali ke portfolio</a></section></main>'
    return
  }
  const data = normalizeBuilderData(content)
  const project = data.projects.find(item => item.slug === slug)
  if (!project) {
    document.body.innerHTML = '<main class="admin-auth-page"><section class="admin-auth-card"><p class="admin-auth-eyebrow">Project</p><h1>Studi kasus belum ditemukan.</h1><p>Project ini belum tersedia sebagai konten publik.</p><a class="admin-primary-button admin-button-link" href="/">Kembali ke portfolio</a></section></main>'
    document.title = 'Project tidak ditemukan'
    return
  }
  const media = Array.isArray(content?.projectMedia?.data) ? content.projectMedia.data.filter(item => item.project_id === project.id) : []
  renderProject(project, media, content)
}
