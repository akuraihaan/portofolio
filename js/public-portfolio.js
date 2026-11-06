import { printPortfolio } from './extra-template.js'
import { getPublicContent } from './services/public-content-service.js'
import { getPublicPortfolioVersion } from './services/portfolio-version-service.js'
import { createPortfolioPreviewMarkup, normalizeBuilderData, normalizeState } from './portfolio-builder.js'
import { escapeHtml, showToast } from './utils.js'

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

export async function initializePublicPortfolioVersion(slug) {
  let result = await getPublicPortfolioVersion(slug)
  if (!result.ok) {
    document.body.innerHTML = '<main class="admin-auth-page"><section class="admin-auth-card"><h1>Versi portfolio tidak dapat dimuat.</h1><p role="alert">Koneksi atau schema belum tersedia. Silakan coba lagi.</p><a href="/">Kembali ke portfolio</a></section></main>'
    return
  }
  const version = result.data
  if (!version) {
    document.body.innerHTML = '<main class="admin-auth-page"><section class="admin-auth-card"><p class="admin-auth-eyebrow">Portfolio publik</p><h1>Versi portfolio belum tersedia.</h1><p>Link ini mungkin masih berupa draft, sudah dinonaktifkan, atau migration Supabase belum dijalankan.</p><a class="admin-primary-button admin-button-link" href="/portfolio-builder">Buat portfolio baru</a><a class="admin-back-link" href="/">Kembali ke portfolio</a></section></main>'
    document.title = 'Portfolio belum tersedia'
    return
  }
  let content = {}
  try { content = await getPublicContent() } catch (error) { console.error('Public version content load failed:', error) }
  const data = normalizeBuilderData(content)
  const state = normalizeState(version, data)
  const url = window.location.origin + '/portfolio/' + encodeURIComponent(slug)
  const description = state.description || data.settings.site_description || ''
  const ownerName = data.profile?.full_name || data.settings.owner_name || ''
  document.title = [state.title, ownerName].filter(Boolean).join(' — ') || 'Portfolio'
  setMeta('description', description)
  setMeta('og:title', document.title, true)
  setMeta('og:description', description, true)
  setMeta('og:url', url, true)
  setCanonical(url)
  const jsonLd = { '@context': 'https://schema.org', '@type': 'ProfilePage', name: state.title || ownerName || 'Portfolio', description: description || undefined, url, mainEntity: { '@type': 'Person', name: ownerName || undefined } }
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(jsonLd)
  document.head.append(script)
  document.body.innerHTML = '<div class="portfolio-public-shell"><a class="skip-link" href="#portfolio-public-main">Lewati ke konten utama</a><header class="portfolio-public__topbar"><a class="text-link" href="/">← Portfolio utama</a><span>Versi portfolio / ' + escapeHtml(state.portfolioType) + '</span><div><button class="text-link" type="button" data-public-share>Bagikan</button><button class="text-link" type="button" data-public-copy>Salin link</button><button class="text-link" type="button" data-public-print>Cetak / Simpan PDF</button></div></header><main id="portfolio-public-main" class="portfolio-public__document">' + createPortfolioPreviewMarkup(state, data, { publicView: true }) + '</main></div>'
  const copy = async () => { try { await navigator.clipboard.writeText(url); showToast('Link versi portfolio disalin.') } catch { showToast(url, 'info') } }
  document.querySelector('[data-public-copy]')?.addEventListener('click', copy)
  document.querySelector('[data-public-share]')?.addEventListener('click', async () => {
    if (navigator.share) { try { await navigator.share({ title: state.title, text: description, url }) } catch (error) { if (error?.name !== 'AbortError') await copy() } } else await copy()
  })
  document.querySelector('[data-public-print]')?.addEventListener('click', async () => {
    await printPortfolio('public-print-mode')
  })
}
