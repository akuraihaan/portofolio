import { supabase, supabaseConfiguration } from '../supabase.js'
import { ADMIN_MODULES } from './router.js'
import { authReady, getAccessContext, getCurrentSession, hasPermission, signIn, signOut, startIdleSessionTimeout } from './auth.js'
import { createEducation, deleteEducation, getAdminEducations, updateEducation } from './educations.js'
import { escapeHtml, formatDate, getValue, parseSettingValue, setBusy, showToast, slugify } from './utils.js'
import { deletePublicImage, uploadPublicImage } from './services/storage-service.js'
import { bindImageUploaders, renderImageUploader } from './components/image-uploader.js'
import { renderNavigationAdmin, renderSectionEditorAdmin, renderSectionsAdmin, renderStatisticsAdmin } from './admin-sections.js'
import { getOwnedPortfolioVersions } from './services/portfolio-version-service.js'
import { createContent, deleteContent, listContent, updateContent } from './services/content-service.js'
import { normalizeContentStatus, validateContentPayload } from './content-schema.js'
import { createSetting, deleteSetting, deleteSettingByKey, getSettingsByKeys, listSettings, saveSettings, updateSetting } from './services/settings-service.js'
import { delegate, lockBodyScroll } from './ui/jquery-ui.js'
import { renderTemplateAdmin } from './appearance-admin.js'

const contentFields = {
  projects: [
    ['title', 'Judul', 'text', true], ['slug', 'Slug', 'text', true], ['summary', 'Ringkasan', 'textarea', false], ['description', 'Deskripsi lengkap', 'textarea', false], ['category', 'Kategori', 'text', false], ['project_year', 'Tahun', 'text', false], ['duration', 'Durasi', 'text', false], ['role', 'Peran', 'text', false], ['client', 'Klien atau institusi', 'text', false], ['technologies', 'Teknologi (satu per baris)', 'tags', false], ['thumbnail_url', 'Thumbnail', 'image', false, 'thumbnail_path', 'projects/thumbnails'], ['cover_url', 'Cover image', 'image', false, 'cover_path', 'projects/covers'], ['project_url', 'URL demo', 'url', false], ['repository_url', 'URL repository', 'url', false], ['figma_url', 'URL Figma', 'url', false], ['documentation_url', 'URL dokumentasi', 'url', false], ['video_url', 'URL video demo', 'url', false], ['start_date', 'Tanggal mulai', 'date', false], ['completion_date', 'Tanggal selesai', 'date', false], ['case_study', 'Studi kasus (JSON opsional)', 'json', false], ['seo_title', 'SEO title', 'text', false], ['meta_description', 'Meta description', 'textarea', false], ['status', 'Status', 'status', true], ['sort_order', 'Urutan', 'number', false], ['is_featured', 'Tampilkan sebagai unggulan', 'boolean', false]
  ],
  articles: [
    ['title', 'Judul', 'text', true], ['slug', 'Slug', 'text', true], ['category', 'Kategori', 'text', false], ['excerpt', 'Ringkasan', 'textarea', false], ['content', 'Isi artikel', 'textarea', true], ['tags', 'Tag (satu per baris)', 'tags', false], ['reading_time', 'Estimasi baca (menit)', 'number', false], ['thumbnail_url', 'Cover artikel', 'image', false, 'thumbnail_path', 'articles/thumbnails'], ['seo_title', 'SEO title', 'text', false], ['meta_description', 'Meta description', 'textarea', false], ['status', 'Status', 'status', true], ['sort_order', 'Urutan', 'number', false], ['is_featured', 'Tampilkan sebagai unggulan', 'boolean', false]
  ],
  skills: [['name', 'Nama', 'text', true], ['category', 'Kategori', 'text', false], ['description', 'Deskripsi', 'textarea', false], ['level', 'Level 0-100', 'number', false], ['status', 'Status', 'status', true], ['sort_order', 'Urutan', 'number', false]],
  experiences: [['company', 'Organisasi', 'text', true], ['role_title', 'Posisi', 'text', true], ['experience_type', 'Jenis pengalaman', 'text', false], ['description', 'Deskripsi', 'textarea', false], ['responsibilities', 'Tanggung jawab (JSON atau satu per baris)', 'json', false], ['achievements', 'Pencapaian (JSON atau satu per baris)', 'json', false], ['location', 'Lokasi', 'text', false], ['organization_url', 'URL organisasi', 'url', false], ['start_date', 'Mulai', 'date', false], ['end_date', 'Selesai', 'date', false], ['is_current', 'Masih berlangsung', 'boolean', false], ['logo_url', 'Logo organisasi', 'image', false, 'logo_path', 'experiences/logos'], ['status', 'Status', 'status', true], ['sort_order', 'Urutan', 'number', false]],
  educations: [['institution', 'Institusi', 'text', true], ['degree', 'Gelar', 'text', false], ['field_of_study', 'Bidang studi', 'text', false], ['location', 'Lokasi', 'text', false], ['description', 'Deskripsi', 'textarea', false], ['start_date', 'Mulai', 'date', false], ['end_date', 'Selesai', 'date', false], ['is_current', 'Saat ini', 'boolean', false], ['logo_url', 'Logo institusi', 'image', false, 'logo_path', 'educations/logos'], ['is_featured', 'Featured', 'boolean', false], ['status', 'Status', 'status', true], ['sort_order', 'Urutan', 'number', false]],
  certificates: [['title', 'Nama sertifikat', 'text', true], ['issuer', 'Penerbit', 'text', false], ['category', 'Kategori', 'text', false], ['issue_date', 'Tanggal diterbitkan', 'date', false], ['expiry_date', 'Tanggal kedaluwarsa', 'date', false], ['credential_id', 'Credential ID', 'text', false], ['credential_url', 'URL credential', 'url', false], ['description', 'Deskripsi', 'textarea', false], ['certificate_url', 'Gambar sertifikat', 'image', false, 'certificate_path', 'certificates'], ['file_url', 'File pendukung PDF', 'file', false, 'file_path', 'certificates/documents'], ['status', 'Status', 'status', true], ['sort_order', 'Urutan', 'number', false], ['is_featured', 'Tampilkan sebagai unggulan', 'boolean', false]],
  achievements: [['title', 'Nama prestasi', 'text', true], ['organizer', 'Penyelenggara', 'text', false], ['result', 'Peringkat atau hasil', 'text', false], ['achievement_date', 'Tanggal', 'date', false], ['description', 'Deskripsi', 'textarea', false], ['image_url', 'Gambar prestasi', 'image', false, 'image_path', 'achievements'], ['document_url', 'Dokumen pendukung PDF', 'file', false, 'document_path', 'achievements/documents'], ['link_url', 'Tautan', 'url', false], ['status', 'Status', 'status', true], ['sort_order', 'Urutan', 'number', false], ['is_featured', 'Tampilkan sebagai unggulan', 'boolean', false]],
  services: [['title', 'Judul', 'text', true], ['slug', 'Slug', 'text', true], ['description', 'Deskripsi', 'textarea', false], ['icon', 'Icon key', 'text', false], ['icon_url', 'Icon image', 'image', false, 'icon_path', 'services'], ['status', 'Status', 'status', true], ['sort_order', 'Urutan', 'number', false], ['is_featured', 'Featured', 'boolean', false]],
  testimonials: [['author_name', 'Nama', 'text', true], ['author_role', 'Peran', 'text', false], ['quote', 'Kutipan', 'textarea', true], ['avatar_url', 'Avatar', 'image', false, 'avatar_path', 'testimonials/avatars'], ['status', 'Status', 'status', true], ['sort_order', 'Urutan', 'number', false], ['is_featured', 'Featured', 'boolean', false]],
  social_links: [['platform', 'Platform', 'text', true], ['label', 'Label', 'text', true], ['url', 'URL', 'url', true], ['username', 'Username', 'text', false], ['icon', 'Icon key', 'text', false], ['is_active', 'Aktif', 'boolean', false], ['open_in_new_tab', 'Buka tab baru', 'boolean', false], ['sort_order', 'Urutan', 'number', false]],
  roles: [['name', 'Name', 'text', true], ['label', 'Label', 'text', true], ['description', 'Deskripsi', 'textarea', false], ['is_system', 'System role', 'boolean', false]]
}

const profileFields = [['full_name', 'Nama lengkap', 'text', false], ['username', 'Username', 'text', false], ['phone', 'Telepon', 'text', false], ['bio', 'Bio publik', 'textarea', false], ['avatar_url', 'Avatar profile', 'image', false, 'avatar_path', 'profiles/avatars'], ['is_active', 'Aktif di publik', 'boolean', false]]

export async function initializeAdminRoute(route) {
  if (route.name === 'login') { await renderLoginPage(); return }
  if (route.name === 'forgotPassword') { renderForgotPasswordPage(); return }
  if (route.name === 'resetPassword') { renderResetPasswordPage(); return }
  if (!route.path.startsWith('/admin')) { renderNotFound(); return }

  if (!authReady()) { renderConfigurationError(); return }
  const module = ADMIN_MODULES[route.name]
  const requiredPermission = route.name === 'dashboard' ? 'dashboard.view' : route.name === 'sectionEditor' ? 'settings.view' : module?.permission
  const context = await protectRoute(requiredPermission)
  if (!context) return
  renderAdminShell(context, context.user, route)
  startIdleSessionTimeout(async () => { await signOut(); window.location.replace('/login?expired=1') })
  if (route.name === 'dashboard') await renderDashboard(context)
  else if (route.name === 'sectionEditor') await renderSectionEditorAdmin(context, route.sectionKey)
  else if (route.name === 'sections') await renderSectionsAdmin(context)
  else if (route.name === 'navigation') await renderNavigationAdmin(context)
  else if (route.name === 'statistics') await renderStatisticsAdmin(context)
  else if (route.name === 'appearance') await renderAppearance(context)
  else if (route.name === 'seo') await renderSeo(context)
  else if (route.name === 'contact') await renderContactSettings(context)
  else if (route.name === 'account') await renderAccountSettings(context)
  else if (route.name === 'preview') await renderAdminPreview(context)
  else if (route.name === 'pdf') await renderPdfExport(context)
  else await renderModule(route.name, context)
}

export async function protectRoute(requiredPermission = null) {
  try {
    const context = await getAccessContext(true)

    if (!context?.user) {
      window.location.replace('/login')
      return null
    }

    if (!context.profile?.is_active) {
      await signOut()
      window.location.replace('/login')
      return null
    }

    if (requiredPermission && !hasPermission(context, requiredPermission)) {
      renderAccessDenied()
      return null
    }

    return context
  } catch (error) {
    console.error('Route guard error:', {
      code: error?.code || null,
      message: error?.message || 'Unknown route guard error',
      details: error?.details || null,
      hint: error?.hint || null
    })

    const requiresFreshLogin = [
      'Profil pengguna belum tersedia.',
      'Akun pengguna tidak aktif.',
      'Role pengguna tidak dapat dibaca.',
      'Akun belum memiliki role pada tabel user_roles.',
      'Data role tidak dapat dibaca.',
      'Relasi role ditemukan, tetapi data roles tidak tersedia.',
      'Permission role tidak dapat dibaca.',
      'Permission pengguna tidak dapat dibaca.'
    ].includes(error?.message)

    if (requiresFreshLogin) {
      await signOut()
      window.location.replace('/login')
      return null
    }

    renderAccessDenied('Akses pengguna tidak dapat diverifikasi. Periksa policy RLS dan konfigurasi Supabase.')
    return null
  }
}

async function renderLoginPage() {
  if (!supabaseConfiguration.ready || !supabase) {
    console.error('Supabase configuration missing', {
      urlConfigured: supabaseConfiguration.urlConfigured,
      keyConfigured: supabaseConfiguration.keyConfigured
    })
    renderConfigurationError('Isi VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY untuk mengaktifkan login.')
    return
  }
  const session = await getCurrentSession()
  if (session?.user) {
    try {
      const context = await getAccessContext()
      if (context?.profile?.is_active) { window.location.replace('/admin'); return }
    } catch (error) {
      console.error('Access context saat login:', {
        code: error?.code || null,
        message: error?.message || 'Unknown access context error',
        details: error?.details || null,
        hint: error?.hint || null
      })
      await signOut()
    }
  }
  document.title = 'Login — Portfolio CMS'
  document.body.innerHTML = `<main class="admin-auth-page"><section class="admin-auth-card"><div class="admin-auth-header"><p class="admin-auth-eyebrow">PORTFOLIO CMS</p><h1>Masuk sebagai Admin</h1><p>Gunakan akun yang terdaftar pada Supabase Authentication.</p></div><div id="login-alert"></div><form id="login-form" novalidate><label class="admin-field"><span>Email</span><input name="email" type="email" autocomplete="email" placeholder="nama@domain.com" required></label><label class="admin-field"><span>Password</span><input name="password" type="password" autocomplete="current-password" required></label><button type="submit" class="admin-primary-button">Masuk</button><p class="admin-form-error" id="login-error" role="alert"></p></form><a class="admin-back-link" href="/forgot-password">Lupa password?</a><a class="admin-back-link" href="/">Kembali ke portfolio</a></section></main>`
  const form = document.querySelector('#login-form'); const error = document.querySelector('#login-error'); const button = form.querySelector('button')
  form.addEventListener('submit', async event => { event.preventDefault(); if (!form.checkValidity()) { form.reportValidity(); return } setBusy(button, true); error.textContent = ''; try { await signIn(form.elements.email.value.trim(), form.elements.password.value); window.location.replace('/admin') } catch (loginError) { console.error('Login gagal:', { code: loginError?.code || null, message: loginError?.message || 'Unknown login error', details: loginError?.details || null, hint: loginError?.hint || null }); error.textContent = translateAuthError(loginError.message) } finally { setBusy(button, false, 'Masuk') } })
}

function renderForgotPasswordPage() {
  if (!authReady()) { renderConfigurationError('Isi environment variables Supabase untuk memakai reset password.'); return }
  document.title = 'Reset password — Portfolio CMS'
  document.body.innerHTML = `<main class="admin-auth-page"><section class="admin-auth-card"><div class="admin-auth-header"><p class="admin-auth-eyebrow">PORTFOLIO CMS</p><h1>Reset password</h1><p>Kami akan mengirim tautan reset ke email akunmu.</p></div><form id="forgot-form"><label class="admin-field"><span>Email</span><input name="email" type="email" placeholder="nama@domain.com" required></label><button class="admin-primary-button" type="submit">Kirim tautan</button><p id="forgot-status" class="admin-form-error" role="status"></p></form><a class="admin-back-link" href="/login">Kembali ke login</a></section></main>`
  document.querySelector('#forgot-form').addEventListener('submit', async event => { event.preventDefault(); const form = event.currentTarget; const button = form.querySelector('button'); const status = document.querySelector('#forgot-status'); setBusy(button, true); const { error } = await supabase.auth.resetPasswordForEmail(form.elements.email.value.trim(), { redirectTo: `${window.location.origin}/reset-password` }); setBusy(button, false, 'Kirim tautan'); status.textContent = error ? 'Tautan belum dapat dikirim. Coba lagi.' : 'Jika email terdaftar, tautan reset sudah dikirim.' })
}

function renderResetPasswordPage() {
  if (!authReady()) { renderConfigurationError('Isi environment variables Supabase untuk memakai reset password.'); return }
  document.title = 'Password baru — Portfolio CMS'
  document.body.innerHTML = `<main class="admin-auth-page"><section class="admin-auth-card"><div class="admin-auth-header"><p class="admin-auth-eyebrow">PORTFOLIO CMS</p><h1>Buat password baru</h1></div><form id="reset-form"><label class="admin-field"><span>Password baru</span><input name="password" type="password" minlength="8" required></label><label class="admin-field"><span>Ulangi password</span><input name="confirmation" type="password" minlength="8" required></label><button class="admin-primary-button" type="submit">Simpan password</button><p id="reset-status" class="admin-form-error" role="status"></p></form><a class="admin-back-link" href="/login">Kembali ke login</a></section></main>`
  document.querySelector('#reset-form').addEventListener('submit', async event => { event.preventDefault(); const form = event.currentTarget; const status = document.querySelector('#reset-status'); if (form.elements.password.value !== form.elements.confirmation.value) { status.textContent = 'Password tidak sama.'; return } const button = form.querySelector('button'); setBusy(button, true); const { error } = await supabase.auth.updateUser({ password: form.elements.password.value }); setBusy(button, false, 'Simpan password'); status.textContent = error ? 'Password belum dapat diperbarui.' : 'Password diperbarui. Silakan login.'; if (!error) window.setTimeout(() => window.location.replace('/login'), 1200) })
}

function renderAdminShell(context, user, route) {
  const groups = [
    ['Ringkasan', [['dashboard', 'Dashboard', 'dashboard.view']]],
    ['Konten utama', [
      ['profile', 'Profil', 'users.update'], ['sections', 'Bagian portfolio', 'settings.view'], ['skills', 'Keahlian', 'skills.manage'], ['projects', 'Proyek', 'projects.view'], ['experiences', 'Pengalaman', 'experiences.manage'], ['educations', 'Pendidikan', 'educations.manage'], ['certificates', 'Sertifikasi', 'certificates.manage'], ['achievements', 'Prestasi', 'achievements.manage'], ['services', 'Layanan', 'services.manage'], ['articles', 'Artikel', 'articles.view']
    ]],
    ['Publikasi', [['portfolio_versions', 'Portfolio Versions', 'settings.view'], ['preview', 'Preview website', 'settings.view'], ['pdf', 'Ekspor PDF', 'settings.view']]],
    ['Komunikasi', [['messages', 'Pesan masuk', 'messages.view'], ['social_links', 'Media sosial', 'social_links.manage'], ['contact', 'Kontak', 'settings.view']]],
    ['Pengaturan', [['appearance', 'Tampilan', 'settings.view'], ['navigation', 'Navigasi', 'settings.view'], ['seo', 'SEO', 'settings.view'], ['media', 'Media', 'media.manage'], ['account', 'Pengaturan akun', 'users.update']]]
  ]
  const pathFor = key => key === 'dashboard' ? '/admin' : key === 'portfolio_versions' ? '/admin/portfolio-versions' : '/admin/' + key
  const menuGroups = groups.map(([label, items]) => {
    const links = items.filter(([, , permission]) => hasPermission(context, permission)).map(([key, labelText]) => `<a class="${route.name === key ? 'is-active' : ''}" href="${pathFor(key)}" data-admin-nav="${key}" title="${escapeHtml(labelText)}"><span class="admin-nav-label">${escapeHtml(labelText)}</span>${key === 'messages' ? '<span class="admin-unread-badge" data-unread-messages hidden>0</span>' : '<span class="admin-nav-arrow" aria-hidden="true">↗</span>'}</a>`).join('')
    return links ? `<div class="admin-nav-group"><p>${escapeHtml(label)}</p>${links}</div>` : ''
  }).join('')
  const pageLabel = ADMIN_MODULES[route.name]?.label || (route.name === 'sectionEditor' ? 'Editor section' : 'Dashboard')
  document.body.innerHTML = `<div class="admin-app"><a class="skip-link admin-skip-link" href="#admin-content">Lewati ke konten utama</a><aside class="admin-sidebar" data-admin-sidebar><div class="admin-sidebar-head"><a class="admin-brand" href="/admin"><span class="admin-brand-mark">P</span><span class="admin-brand-copy"><strong>Portfolio CMS</strong><small>Ruang kerja konten</small></span></a><button class="admin-collapse-toggle" type="button" data-admin-collapse aria-label="Ciutkan sidebar" title="Ciutkan sidebar">←</button></div><nav class="admin-nav" aria-label="Navigasi admin">${menuGroups}</nav><div class="admin-sidebar-foot"><a class="admin-view-link" href="/" target="_blank" rel="noopener">Lihat website ↗</a><button class="admin-logout-link" id="admin-logout" type="button">Keluar</button></div></aside><button class="admin-sidebar-overlay" type="button" data-admin-menu-close aria-label="Tutup navigasi admin"></button><main class="admin-main"><header class="admin-topbar"><button class="admin-menu-toggle" type="button" data-admin-menu-toggle aria-expanded="false" aria-controls="admin-sidebar">Menu</button><div class="admin-topbar-context"><span class="admin-breadcrumb">Admin <b>/</b> ${escapeHtml(pageLabel)}</span><span>${escapeHtml(context.profile?.full_name || user?.email || 'Admin')}</span></div><a href="/" target="_blank" rel="noopener">Lihat website ↗</a></header><div id="admin-content"></div></main></div>`
  document.querySelector('[data-admin-sidebar]')?.setAttribute('id', 'admin-sidebar')
  if (localStorage.getItem('portfolio-admin-sidebar') === 'collapsed') document.body.classList.add('admin-sidebar-collapsed')
  const closeAdminMenu = () => { document.body.classList.remove('admin-menu-open'); document.querySelector('[data-admin-menu-toggle]')?.setAttribute('aria-expanded', 'false'); lockBodyScroll(false) }
  const openAdminMenu = () => { document.body.classList.add('admin-menu-open'); document.querySelector('[data-admin-menu-toggle]')?.setAttribute('aria-expanded', 'true'); lockBodyScroll(true) }
  delegate(document, 'click', '[data-admin-menu-toggle]', event => { event.currentTarget.getAttribute('aria-expanded') === 'true' ? closeAdminMenu() : openAdminMenu() }, 'bworieyAdmin')
  delegate(document, 'click', '[data-admin-menu-close], [data-admin-nav]', closeAdminMenu, 'bworieyAdmin')
  delegate(document, 'click', '[data-admin-collapse]', () => { const collapsed = document.body.classList.toggle('admin-sidebar-collapsed'); localStorage.setItem('portfolio-admin-sidebar', collapsed ? 'collapsed' : 'expanded') }, 'bworieyAdmin')
  delegate(document, 'keydown', 'body', event => { if (event.key === 'Escape') closeAdminMenu() }, 'bworieyAdmin')
  document.querySelector('#admin-logout').addEventListener('click', async () => { setBusy(document.querySelector('#admin-logout'), true, 'Keluar...'); await signOut(); window.location.replace('/login') })
  supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('status', 'unread').then(({ count }) => { const badge = document.querySelector('[data-unread-messages]'); if (badge && count) { badge.textContent = String(count); badge.hidden = false } })
}

async function renderDashboard(context) {
  const content = document.querySelector('#admin-content')
  content.innerHTML = `<div class="admin-page-heading"><div><p>{ Ringkasan }</p><h1>Selamat datang kembali.</h1><span>Ringkasan ini membantu menentukan pekerjaan konten berikutnya.</span></div><a class="admin-primary-button admin-button-link" href="/admin/preview">Lihat preview</a></div><section class="admin-dashboard-overview"><article class="admin-card admin-completeness-card"><div class="admin-section-heading"><div><p>Kesiapan portfolio</p><h2 data-profile-completeness>Memeriksa...</h2></div><span class="admin-completeness-ring" data-completeness-ring>—</span></div><div class="admin-progress"><span data-completeness-progress></span></div><p class="admin-field-help" data-completeness-note>Memeriksa data identitas dan publikasi.</p></article><div class="admin-stat-grid" id="admin-stats"><article class="admin-card">Memuat ringkasan...</article></div></section><section class="admin-card admin-quick-actions"><div class="admin-section-heading"><div><p>Tindakan cepat</p><h2>Mulai dari sini</h2></div></div><div class="admin-action-grid"><a class="admin-secondary-button admin-button-link" href="/admin/projects?new=1">Tambah proyek</a><a class="admin-secondary-button admin-button-link" href="/admin/experiences?new=1">Tambah pengalaman</a><a class="admin-secondary-button admin-button-link" href="/admin/certificates?new=1">Unggah sertifikat</a><a class="admin-secondary-button admin-button-link" href="/admin/profile">Edit profil</a><a class="admin-secondary-button admin-button-link" href="/admin/preview">Preview website</a></div></section><div class="admin-two-column"><section class="admin-card"><div class="admin-section-heading"><div><p>Prioritas</p><h2>Langkah berikutnya</h2></div></div><div id="admin-next-steps">Memeriksa...</div></section><section class="admin-card"><div class="admin-section-heading"><div><p>Jejak perubahan</p><h2>Aktivitas terbaru</h2></div></div><div id="admin-activity">Memuat...</div></section></div>`
  const count = async (table, filter = null) => { let query = supabase.from(table).select('id', { count: 'exact', head: true }); if (filter) query = filter(query); const { count: total, error } = await query; return error ? null : total ?? 0 }
  const countStatus = async (table, status) => count(table, query => query.eq('status', status))
  const [publishedProjects, draftProjects, certificates, experiences, unread, media, profileResult, settingsResult, heroResult, activeVersion] = await Promise.all([
    countStatus('projects', 'published'), countStatus('projects', 'draft'), count('certificates'), count('experiences'), count('contact_messages', query => query.eq('status', 'unread')), count('media_assets'), supabase.from('profiles').select('*').eq('id', context.user.id).maybeSingle(), listSettings({ columns: 'key,value,updated_at', orderBy: 'updated_at', ascending: false, limit: 100 }), supabase.from('page_sections').select('title,description').eq('section_key', 'hero').maybeSingle(), supabase.from('portfolio_versions').select('title,slug').eq('owner_id', context.user.id).eq('visibility', 'published').limit(1).maybeSingle()
  ])
  document.querySelector('#admin-stats').innerHTML = [['Proyek published', publishedProjects], ['Proyek draft', draftProjects], ['Sertifikat', certificates], ['Pengalaman', experiences], ['Pesan belum dibaca', unread], ['Aset media', media]].map(([label, value]) => `<article class="admin-stat-card"><p>${escapeHtml(label)}</p><strong>${value === null ? '—' : value}</strong><span>Data Supabase</span></article>`).join('')
  const profile = profileResult.data || context.profile || {}
  const settings = Object.fromEntries((settingsResult.data || []).map(item => [item.key, item.value]))
  const settingValue = key => { const value = settings[key]; return typeof value === 'string' ? value : value ? JSON.stringify(value) : '' }
  const hero = heroResult.data || {}
  const checks = [['Nama lengkap', profile.full_name], ['Bio singkat', profile.bio], ['Foto profil', profile.avatar_url], ['Headline hero', hero.title], ['Deskripsi hero', hero.description], ['CV', settingValue('resume_url')]]
  const complete = checks.filter(([, value]) => String(value || '').trim()).length; const percentage = Math.round((complete / checks.length) * 100)
  document.querySelector('[data-profile-completeness]').textContent = percentage + '% lengkap'
  document.querySelector('[data-completeness-ring]').textContent = percentage + '%'
  document.querySelector('[data-completeness-progress]').style.width = percentage + '%'
  document.querySelector('[data-completeness-note]').textContent = complete === checks.length ? 'Data utama sudah siap dipublikasikan.' : `${checks.length - complete} bagian masih perlu dilengkapi.`
  const steps = checks.filter(([, value]) => !String(value || '').trim()).map(([label]) => { const target = label.includes('hero') ? '/admin/sections/hero' : label === 'CV' ? '/admin/profile' : '/admin/profile'; return `<a class="admin-list-row" href="${target}"><span>Lengkapi ${escapeHtml(label)}</span><small>Atur sekarang ↗</small></a>` })
  if (draftProjects) steps.push('<a class="admin-list-row" href="/admin/projects?status=draft"><span>Publikasikan proyek yang masih draft</span><small>Periksa ↗</small></a>')
  if (!steps.length) steps.push('<p class="admin-empty">Tidak ada prioritas yang tertunda. Portfolio siap ditinjau.</p>')
  document.querySelector('#admin-next-steps').innerHTML = steps.slice(0, 5).join('')
  const activity = document.querySelector('#admin-activity')
  if (hasPermission(context, 'security.view')) { const { data } = await supabase.from('audit_logs').select('action, table_name, created_at').order('created_at', { ascending: false }).limit(6); activity.innerHTML = data?.length ? data.map(item => `<p class="admin-list-row"><span>${escapeHtml(item.action)} · ${escapeHtml(item.table_name)}</span><small>${formatDate(item.created_at)}</small></p>`).join('') : '<p class="admin-empty">Belum ada aktivitas.</p>' } else activity.innerHTML = '<p class="admin-empty">Aktivitas hanya terlihat untuk admin dengan akses keamanan.</p>'
  const activeText = activeVersion.data ? `${escapeHtml(activeVersion.data.title)} · /portfolio/${escapeHtml(activeVersion.data.slug)}` : 'Portfolio utama'
  content.querySelector('[data-completeness-note]').insertAdjacentHTML('afterend', `<p class="admin-dashboard-meta"><strong>Website:</strong> Aktif · <strong>Versi aktif:</strong> ${activeText}</p>`)
}

async function renderModule(key, context) {
  if (key === 'messages') return renderMessages(context)
  if (key === 'media') return renderMedia(context)
  if (key === 'users') return renderUsers(context)
  if (key === 'profile') return renderPortfolioProfile(context)
  if (key === 'portfolio_versions') return renderPortfolioVersions(context)
  if (key === 'settings') return renderSettings(context)
  if (key === 'permissions' || key === 'security' || key === 'login_history') return renderReadOnlyModule(key)
  const config = ADMIN_MODULES[key]
  const fields = contentFields[key] || []
  const canManage = Boolean(config.manage && hasPermission(context, config.manage))
  const content = document.querySelector('#admin-content')
  content.innerHTML = `<div class="admin-page-heading"><div><p>{ ${escapeHtml(config.label)} }</p><h1>${escapeHtml(config.label)}.</h1><span>Kelola data ${escapeHtml(config.label.toLowerCase())} dengan status dan audit trail.</span></div>${canManage ? '<button class="admin-primary-button" data-action="new">Tambah</button>' : ''}</div><div id="module-form"></div><section class="admin-card"><div class="admin-section-heading"><div><p>Database</p><h2>Daftar ${escapeHtml(config.label)}</h2></div><input class="admin-search" data-search placeholder="Cari..."></div><div id="module-status">Memuat...</div><div id="module-list"></div></section>`
  const formContainer = document.querySelector('#module-form'); const list = document.querySelector('#module-list'); const status = document.querySelector('#module-status'); const statusFilter = document.createElement('select'); statusFilter.className = 'admin-search'; statusFilter.dataset.statusFilter = ''; statusFilter.innerHTML = '<option value="all">Semua status</option><option value="draft">Draft</option><option value="published">Dipublikasikan</option><option value="hidden">Disembunyikan</option><option value="archived">Diarsipkan</option>'; document.querySelector('[data-search]')?.after(statusFilter); let rows = []
  const load = async () => { status.textContent = 'Memuat data...'; try { rows = key === 'educations' ? await getAdminEducations({ includeArchived: statusFilter.value === 'archived' }) : await listContent(config.table, { includeArchived: statusFilter.value === 'archived' }); status.textContent = `${rows.length} data`; renderRows() } catch (loadError) { status.innerHTML = `<span class="admin-form-error">Tidak dapat memuat data. Periksa policy RLS.</span>`; console.error('Admin module load failed:', { code: loadError?.code || null, message: loadError?.message || 'Unknown error', details: loadError?.details || null, hint: loadError?.hint || null }) } }
  const renderRows = () => { const term = document.querySelector('[data-search]').value.toLowerCase(); const filtered = rows.filter(row => JSON.stringify(row).toLowerCase().includes(term) && (statusFilter.value === 'all' || row.status === statusFilter.value)); list.innerHTML = filtered.length ? filtered.map(row => renderGenericRow(key, row, canManage)).join('') : '<p class="admin-empty">Belum ada data.</p>' }
  const openForm = row => { formContainer.innerHTML = renderGenericForm(key, row, fields, canManage); bindImageUploaders(formContainer); bindFileUploaders(formContainer); if (key === 'projects' && row) { loadProjectMediaEditor(row.id, formContainer); bindProjectMediaEditor(formContainer) } formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' }); const form = formContainer.querySelector('form'); form.addEventListener('submit', event => saveGeneric(event, key, row, context, load, formContainer)); form.querySelector('[data-save-draft]')?.addEventListener('click', () => { if (form.elements.status) form.elements.status.value = 'draft'; form.requestSubmit() }); form.querySelector('[data-form-preview]')?.addEventListener('click', event => window.open(event.currentTarget.dataset.formPreview, '_blank', 'noopener,noreferrer')); form.querySelector('[data-cancel-form]')?.addEventListener('click', () => { formContainer.innerHTML = '' }) }
  document.querySelector('[data-action="new"]')?.addEventListener('click', () => openForm(null))
  document.querySelector('[data-search]').addEventListener('input', renderRows)
  statusFilter.addEventListener('change', load)
  list.addEventListener('click', async event => { const button = event.target.closest('[data-edit]'); if (button) { const row = rows.find(item => item.id === button.dataset.edit); if (row) openForm(row) } const remove = event.target.closest('[data-delete]'); if (remove) { if (key === 'educations') deleteEducation(remove.dataset.delete).then(load).catch(error => showToast(error.message || 'Pendidikan tidak dapat dihapus.', 'error')); else deleteRecord(config.table, remove.dataset.delete, context, load, key) } const preview = event.target.closest('[data-preview]'); if (preview) { window.open(preview.dataset.preview, '_blank', 'noopener,noreferrer'); return } const duplicate = event.target.closest('[data-duplicate]'); if (duplicate && canManage) { const source = rows.find(item => item.id === duplicate.dataset.duplicate); if (!source) return; const copy = { ...source, title: source.title ? source.title + ' (salinan)' : source.title, slug: source.slug ? source.slug + '-salinan-' + Date.now() : undefined, status: 'draft', published_at: null, created_by: context.user.id, updated_by: context.user.id }; ['id', 'created_at', 'updated_at'].forEach(field => delete copy[field]); try { await createContent(config.table, copy); showToast('Data diduplikat sebagai draft.'); await load() } catch (error) { console.error('Admin duplicate failed:', error); showToast('Salinan belum berhasil dibuat.', 'error') } } })
  const params = new URLSearchParams(window.location.search); if (params.get('status')) statusFilter.value = params.get('status'); await load(); if (params.get('new') === '1' && canManage) openForm(null)
}

async function renderPortfolioVersions(context) {
  const content = document.querySelector('#admin-content')
  const canManage = hasPermission(context, 'settings.update')
  content.innerHTML = '<div class="admin-page-heading"><div><p>{ Portfolio builder }</p><h1>Versi portfolio.</h1><span>Kelola portfolio yang dibuat dari editor interaktif dan link publiknya.</span></div><a class="admin-primary-button admin-button-link" href="/portfolio-builder">Buat versi baru</a></div><section class="admin-card"><div class="admin-section-heading"><div><p>Database</p><h2>Portfolio yang tersimpan</h2></div><span class="admin-list-kicker" data-version-count>Memuat...</span></div><div data-version-status>Memuat versi portfolio...</div><div data-version-list></div></section>'
  const list = content.querySelector('[data-version-list]')
  const status = content.querySelector('[data-version-status]')
  const count = content.querySelector('[data-version-count]')
  let rows = []
  const render = () => {
    count.textContent = rows.length + ' versi'
    list.innerHTML = rows.length ? rows.map(row => '<article class="admin-list-card portfolio-version-row"><div><p class="admin-list-kicker">' + escapeHtml(row.portfolio_type || 'general') + ' · ' + escapeHtml(row.visibility || 'draft') + '</p><h3>' + escapeHtml(row.title) + '</h3><p>' + escapeHtml(row.description || 'Tanpa deskripsi') + '</p><small>/portfolio/' + escapeHtml(row.slug) + ' · diperbarui ' + escapeHtml(formatDate(row.updated_at)) + '</small></div><div class="admin-row-actions"><a class="admin-secondary-button admin-button-link" href="/portfolio-builder?edit=' + encodeURIComponent(row.slug) + '">Edit</a><a class="admin-secondary-button admin-button-link" href="/portfolio/' + encodeURIComponent(row.slug) + '" target="_blank" rel="noreferrer">Preview</a><button class="admin-secondary-button" type="button" data-version-copy="' + escapeHtml(row.slug) + '">Salin link</button>' + (canManage ? '<button class="admin-secondary-button" type="button" data-version-duplicate="' + escapeHtml(row.id) + '">Duplikat</button><button class="admin-danger-button" type="button" data-version-disable="' + escapeHtml(row.id) + '">Nonaktifkan</button>' : '') + '</div></article>').join('') : '<p class="admin-empty">Belum ada versi portfolio. Buat satu dari Portfolio Builder.</p>'
  }
  const load = async () => {
    status.textContent = 'Memuat versi portfolio...'
    const result = await getOwnedPortfolioVersions(context.user.id)
    if (!result.ok) {
      const migrationHint = result.error?.code === 'PGRST205' ? ' Jalankan migration 202609030001_portfolio_versions.sql di Supabase SQL Editor.' : ''
      status.innerHTML = '<span class="admin-form-error">Versi portfolio belum dapat dimuat.' + escapeHtml(migrationHint) + '</span>'
      list.replaceChildren()
      return
    }
    rows = result.data || []
    status.textContent = 'Data tersimpan aman di Supabase.'
    render()
  }
  list.addEventListener('click', async event => {
    const copy = event.target.closest('[data-version-copy]')
    if (copy) {
      const url = window.location.origin + '/portfolio/' + encodeURIComponent(copy.dataset.versionCopy)
      try { await navigator.clipboard.writeText(url); showToast('Link versi disalin.') } catch { showToast(url, 'info') }
      return
    }
    const duplicate = event.target.closest('[data-version-duplicate]')
    if (duplicate) {
      const row = rows.find(item => item.id === duplicate.dataset.versionDuplicate)
      if (!row) return
      const payload = { ...row, id: undefined, owner_id: context.user.id, title: row.title + ' (copy)', slug: row.slug + '-copy-' + Date.now(), visibility: 'draft', created_at: undefined, updated_at: undefined }
      delete payload.id
      delete payload.created_at
      delete payload.updated_at
      const { error } = await supabase.from('portfolio_versions').insert(payload)
      if (error) showToast('Duplikat belum berhasil dibuat.', 'error')
      else { showToast('Versi diduplikat sebagai draft.'); await load() }
      return
    }
    const disable = event.target.closest('[data-version-disable]')
    if (disable) {
      const { error } = await supabase.from('portfolio_versions').update({ visibility: 'disabled' }).eq('id', disable.dataset.versionDisable).eq('owner_id', context.user.id)
      if (error) showToast('Versi belum dapat dinonaktifkan.', 'error')
      else { showToast('Versi portfolio dinonaktifkan.'); await load() }
    }
  })
  await load()
}

async function renderPortfolioProfile(context) {
  const content = document.querySelector('#admin-content')
  content.innerHTML = `<div class="admin-page-heading"><div><p>{ Public identity }</p><h1>Portfolio profile.</h1><span>Profil ini dipakai oleh homepage publik dan dapat diubah tanpa menyentuh HTML.</span></div></div><section id="portfolio-profile-form" class="admin-card">Memuat...</section>`
  renderIdentitySettings(context)
  renderHeroSettings(context)
  renderSiteAssetUploader(context)
  renderResumeUploader(context)
  const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', context.user.id).maybeSingle()
  const container = document.querySelector('#portfolio-profile-form')
  if (error || !profile) { container.innerHTML = '<p class="admin-form-error">Profil belum tersedia. Pastikan trigger profile sudah dijalankan.</p>'; return }
  container.innerHTML = `<div class="admin-section-heading"><div><p>Profile</p><h2>Identitas publik</h2></div></div><form id="portfolio-profile-edit"><div class="admin-form-grid">${profileFields.map(([name, label, type, required, pathName, folder]) => renderField(name, label, type, profile[name], required, pathName, folder)).join('')}</div><div class="admin-form-actions"><button type="submit" class="admin-primary-button">Simpan</button></div><p class="admin-form-error" data-profile-error></p></form>`
  const profileForm = container.querySelector('form')
  bindImageUploaders(profileForm)
  profileForm.addEventListener('submit', async event => {
    event.preventDefault()
    const form = event.currentTarget
    const button = form.querySelector('button')
    const errorElement = form.querySelector('[data-profile-error]')
    const payload = { full_name: getValue(form, 'full_name'), username: getValue(form, 'username'), phone: getValue(form, 'phone'), bio: getValue(form, 'bio'), is_active: getValue(form, 'is_active', 'boolean'), updated_at: new Date().toISOString() }
    let imageChanges = []
    let saveError = null
    setBusy(button, true)
    try {
      imageChanges = await prepareImageUploads(form, profileFields, payload, profile, context.user.id)
      saveError = (await supabase.from('profiles').update(payload).eq('id', profile.id)).error
      if (!saveError) await cleanupReplacedImages(imageChanges)
    } catch (error) {
      saveError = error
      await cleanupNewImages(imageChanges)
    }
    setBusy(button, false, 'Simpan')
    if (saveError) errorElement.textContent = saveError.code === '42501' ? 'Operasi ditolak oleh permission/RLS.' : (saveError.message || 'Profil belum tersimpan. Periksa username dan policy RLS.')
    else showToast('Profil portfolio diperbarui.')
  })
}

async function renderIdentitySettings(context) {
  if (!hasPermission(context, 'settings.update')) return
  const content = document.querySelector('#admin-content')
  if (!content) return
  const fields = [
    ['owner_name', 'Nama publik', 'text'],
    ['owner_location', 'Lokasi', 'text'],
    ['owner_email', 'Email publik', 'email'],
    ['site_name', 'Nama situs', 'text'],
    ['site_tagline', 'Tagline situs', 'textarea'],
    ['site_description', 'Deskripsi situs', 'textarea'],
    ['resume_label', 'Label tautan CV', 'text'],
    ['copyright_text', 'Teks copyright', 'text']
  ]
  content.insertAdjacentHTML('afterbegin', '<section class="admin-card admin-form-card"><div class="admin-section-heading"><div><p>Identity</p><h2>Detail publik</h2><span>Nilai ini dipakai di header, footer, kontak, dan metadata portfolio.</span></div></div><form id="identity-settings-form"><p>Memuat identitas publik...</p></form></section>')
  const form = content.querySelector('#identity-settings-form')
  const result = await getSettingsByKeys(fields.map(field => field[0]), { columns: 'key,value' })
  if (result.error) { form.innerHTML = '<p class="admin-form-error">Detail publik tidak dapat dimuat.</p>'; return }
  const values = new Map((result.data || []).map(row => [row.key, row.value]))
  form.innerHTML = '<div class="admin-form-grid">' + fields.map(([key, label, type]) => {
    const raw = values.get(key)
    const value = escapeHtml(typeof raw === 'string' ? raw : parseSettingValue(raw))
    return type === 'textarea'
      ? '<label class="admin-field admin-field-wide"><span>' + label + '</span><textarea name="' + key + '" rows="3">' + value + '</textarea></label>'
      : '<label class="admin-field"><span>' + label + '</span><input name="' + key + '" type="' + type + '" value="' + value + '"></label>'
  }).join('') + '</div><div class="admin-form-actions"><button class="admin-primary-button" type="submit">Simpan detail publik</button></div><p class="admin-form-error" data-identity-settings-error></p>'
  form.addEventListener('submit', async event => {
    event.preventDefault()
    const button = form.querySelector('button[type="submit"]')
    const error = form.querySelector('[data-identity-settings-error]')
    setBusy(button, true); error.textContent = ''
    const payload = fields.map(([key]) => ({ key, group_name: 'identity', value: form.elements[key].value.trim(), is_public: true, updated_by: context.user.id }))
    const save = await saveSettings(payload)
    setBusy(button, false, 'Simpan detail publik')
    if (save.error) { error.textContent = 'Detail publik belum tersimpan. Periksa permission settings.'; return }
    showToast('Detail publik berhasil diperbarui.')
  })
}

function renderGenericForm(key, row, fields, canManage) {
  const projectMediaEditor = key === 'projects' ? renderProjectMediaEditor(row) : ''
  const hasStatus = fields.some(([, , type]) => type === 'status')
  const previewUrl = row?.slug ? (key === 'projects' ? '/projects/' + encodeURIComponent(row.slug) : key === 'articles' ? '/#notes' : '') : ''
  return `<section class="admin-card admin-form-card"><div class="admin-section-heading"><div><p>${row ? 'Edit data' : 'Data baru'}</p><h2>${row ? 'Perbarui' : 'Tambah'} ${escapeHtml(ADMIN_MODULES[key].label)}</h2></div><span class="admin-field-help">Perubahan tidak dipublikasikan sebelum status diubah.</span></div><form data-generic-form><div class="admin-form-grid">${fields.map(([name, label, type, required, pathName, folder]) => renderField(name, label, type, row?.[name], required, pathName, folder)).join('')}</div>${projectMediaEditor}<div class="admin-form-actions"><button type="submit" class="admin-primary-button" ${canManage ? '' : 'disabled'}>Simpan perubahan</button>${hasStatus ? '<button type="button" class="admin-secondary-button" data-save-draft>Simpan sebagai draf</button>' : ''}${previewUrl ? `<button type="button" class="admin-secondary-button" data-form-preview="${escapeHtml(previewUrl)}">Preview</button>` : ''}<button type="button" class="admin-secondary-button" data-cancel-form>Batal</button></div><p class="admin-form-error" data-form-error role="alert"></p></form></section>`
}

function renderField(name, label, type, value, required, pathName, folder) {
  if (type === 'image') return renderImageUploader({ name, label, existingUrl: value, required })
  if (type === 'file') return renderFileUploader({ name, label, existingUrl: value })
  if (type === 'boolean') return `<label class="admin-checkbox"><input type="checkbox" name="${name}" ${value ? 'checked' : ''}><span>${escapeHtml(label)}</span></label>`
  if (type === 'status') return `<label class="admin-field"><span>${escapeHtml(label)}</span><select name="${name}" ${required ? 'required' : ''}><option value="draft" ${value === 'draft' || !value ? 'selected' : ''}>Draft</option><option value="published" ${value === 'published' ? 'selected' : ''}>Dipublikasikan</option><option value="hidden" ${value === 'hidden' ? 'selected' : ''}>Disembunyikan</option><option value="archived" ${value === 'archived' ? 'selected' : ''}>Diarsipkan</option></select></label>`
  if (type === 'tags') return `<label class="admin-field admin-field-wide"><span>${escapeHtml(label)}</span><textarea name="${name}" rows="3" placeholder="Contoh: Supabase&#10;Vite&#10;UI design">${escapeHtml(Array.isArray(value) ? value.join('\n') : value || '')}</textarea><small class="admin-field-help">Pisahkan dengan baris baru atau koma.</small></label>`
  if (type === 'json') return `<label class="admin-field admin-field-wide"><span>${escapeHtml(label)}</span><textarea name="${name}" rows="5" placeholder="Satu item per baris, atau JSON valid">${escapeHtml(typeof value === 'object' ? JSON.stringify(value, null, 2) : value || '')}</textarea><small class="admin-field-help">Gunakan satu item per baris untuk daftar sederhana. Untuk studi kasus, gunakan JSON.</small></label>`
  const input = type === 'textarea' ? `<textarea name="${name}" rows="4" ${required ? 'required' : ''}>${escapeHtml(value)}</textarea>` : `<input name="${name}" type="${type}" value="${escapeHtml(value)}" ${required ? 'required' : ''}>`
  return `<label class="admin-field"><span>${escapeHtml(label)}</span>${input}</label>`
}

function renderFileUploader({ name, label, existingUrl = '' }) {
  const existing = existingUrl ? `<a class="admin-file-link" href="${escapeHtml(existingUrl)}" target="_blank" rel="noopener">Buka file saat ini ↗</a>` : '<small class="admin-field-help">Belum ada file.</small>'
  return `<div class="admin-field admin-field-wide" data-file-uploader><span>${escapeHtml(label)}</span><input name="${escapeHtml(name)}" type="file" accept="application/pdf"><small class="admin-field-help">PDF maksimal 8 MB.</small><div class="admin-file-current">${existing}</div><button class="admin-secondary-button" type="button" data-file-clear ${existingUrl ? '' : 'hidden'}>Hapus file tersimpan</button></div>`
}

function bindFileUploaders(container) {
  container.querySelectorAll('[data-file-uploader]').forEach(uploader => {
    if (uploader.dataset.bound) return
    uploader.dataset.bound = 'true'
    const input = uploader.querySelector('input[type="file"]')
    const clear = uploader.querySelector('[data-file-clear]')
    input?.addEventListener('change', () => { if (input.files?.[0]) clear.hidden = false })
    clear?.addEventListener('click', () => { if (input) input.value = ''; uploader.dataset.fileCleared = 'true'; clear.hidden = true; uploader.querySelector('.admin-file-current').textContent = 'File akan dihapus setelah disimpan.' })
  })
}

function renderProjectMediaEditor(row) {
  if (!row) return '<div class="admin-field admin-field-wide project-media-editor"><span>Galeri proyek</span><small class="admin-field-help">Simpan proyek terlebih dahulu. Setelah itu, buka kembali untuk menambahkan gambar galeri.</small></div>'
  return '<div class="admin-field admin-field-wide project-media-editor"><div class="admin-section-heading"><div><p>Project media</p><h3>Galeri proyek</h3><small class="admin-field-help">Tambahkan gambar tanpa menyalin URL. File akan disimpan ke Storage dan metadata ke project_media.</small></div></div>' + renderImageUploader({ name: 'project_media_file', label: 'Tambah gambar galeri' }) + '<div class="project-media-list" data-project-media-list>Memuat galeri...</div></div>'
}

async function saveGeneric(event, key, row, context, reload, formContainer) {
  event.preventDefault(); const form = event.currentTarget; const button = form.querySelector('button[type="submit"]'); if (button.disabled) return; const error = form.querySelector('[data-form-error]'); setBusy(button, true); error.textContent = ''
  const payload = {}; for (const [name, , type] of contentFields[key]) if (!['image', 'file'].includes(type)) payload[name] = type === 'tags' ? getTagValue(form, name) : type === 'json' ? getJsonValue(form, name) : getValue(form, name, type === 'boolean' ? 'boolean' : type === 'number' ? 'number' : 'text')
  if ((key === 'projects' || key === 'articles' || key === 'services') && !payload.slug) payload.slug = slugify(payload.title)
  if (Object.prototype.hasOwnProperty.call(payload, 'status')) payload.published_at = payload.status === 'published' ? (row?.published_at || new Date().toISOString()) : null
  if (!['roles', 'permissions'].includes(key)) {
    if (!row) payload.created_by = context.user.id
    payload.updated_by = context.user.id
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'status')) payload.status = normalizeContentStatus(payload.status)
  const validation = validateContentPayload(key, payload)
  if (!validation.ok) { setBusy(button, false, 'Simpan'); error.textContent = validation.errors.join(' '); return }
  let saveError = null
  let savedRow = row
  let projectMediaError = null
  let imageChanges = []
  try {
    imageChanges = await prepareImageUploads(form, contentFields[key], payload, row, context.user.id)
    imageChanges.push(...await prepareFileUploads(form, contentFields[key], payload, row, context.user.id))
    if (key === 'educations') {
      if (payload.is_current) payload.end_date = null
      if (payload.status === 'published') payload.published_at = new Date().toISOString()
      const saved = row ? updateEducation(row.id, payload) : createEducation(payload)
      await saved
    } else {
      savedRow = row ? await updateContent(ADMIN_MODULES[key].table, row.id, payload) : await createContent(ADMIN_MODULES[key].table, payload)
    }
    if (!saveError) await cleanupReplacedImages(imageChanges)
  } catch (error) {
    saveError = error
    await cleanupNewImages(imageChanges)
  }
  setBusy(button, false, 'Simpan')
  if (saveError) { console.error(saveError); error.textContent = saveError.code === '42501' ? 'Operasi ditolak oleh permission/RLS.' : 'Data belum tersimpan. Periksa field dan coba lagi.'; return }
  if (key === 'projects' && savedRow?.id) {
    try { await saveProjectMedia(form, savedRow.id, context.user.id) } catch (mediaError) { projectMediaError = mediaError; console.error('Project media save failed:', mediaError) }
  }
  if (projectMediaError) showToast('Proyek tersimpan, tetapi gambar galeri belum berhasil disimpan.', 'error')
  else showToast('Data berhasil disimpan.')
  formContainer.innerHTML = ''; await reload()
}

function getTagValue(form, name) {
  const value = getValue(form, name)
  return String(value || '').split(/[\n,]+/).map(item => item.trim()).filter(Boolean)
}

function getJsonValue(form, name) {
  const value = String(getValue(form, name) || '').trim()
  if (!value) return name === 'case_study' ? {} : []
  try { return JSON.parse(value) } catch {
    return value.split(/\n+/).map(item => item.trim()).filter(Boolean)
  }
}

async function saveProjectMedia(form, projectId, userId) {
  const file = form.elements.project_media_file?.files?.[0]
  if (!file) return
  const uploaded = await uploadPublicImage({ file, folder: 'projects/gallery', userId })
  try {
    const { data: latest } = await supabase.from('project_media').select('sort_order').eq('project_id', projectId).order('sort_order', { ascending: false }).limit(1).maybeSingle()
    const { error } = await supabase.from('project_media').insert({ project_id: projectId, media_url: uploaded.publicUrl, media_path: uploaded.path, alt_text: form.elements.title?.value?.trim() || 'Media proyek', sort_order: Number(latest?.sort_order || 0) + 1 })
    if (error) throw error
  } catch (error) {
    await deletePublicImage(uploaded.path)
    throw error
  }
}

async function loadProjectMediaEditor(projectId, container) {
  const list = container.querySelector('[data-project-media-list]')
  if (!list) return
  const { data, error } = await supabase.from('project_media').select('id,media_url,media_path,alt_text,caption,sort_order').eq('project_id', projectId).order('sort_order').order('created_at')
  if (error) { list.innerHTML = '<span class="admin-form-error">Galeri belum dapat dimuat. Periksa permission project media.</span>'; return }
  list.innerHTML = data?.length ? data.map(item => '<article class="project-media-item"><span class="project-media-thumb"><img src="' + escapeHtml(item.media_url) + '" alt="' + escapeHtml(item.alt_text || 'Media proyek') + '" width="320" height="180" loading="lazy"><span class="project-media-thumb-fallback" hidden>BW</span></span><div><p>' + escapeHtml(item.caption || item.alt_text || 'Media proyek') + '</p><button type="button" class="admin-danger-button" data-project-media-delete="' + item.id + '" data-project-media-path="' + escapeHtml(item.media_path) + '">Hapus gambar</button></div></article>').join('') : '<p class="admin-empty">Belum ada gambar galeri.</p>'
  list.querySelectorAll('.project-media-thumb img').forEach(image => image.addEventListener('error', () => { image.hidden = true; image.nextElementSibling.hidden = false }, { once: true }))
}

function bindProjectMediaEditor(container) {
  const list = container.querySelector('[data-project-media-list]')
  if (!list || list.dataset.bound) return
  list.dataset.bound = 'true'
  list.addEventListener('click', async event => {
    const button = event.target.closest('[data-project-media-delete]')
    if (!button || !window.confirm('Hapus gambar galeri ini?')) return
    button.disabled = true
    const { error } = await supabase.from('project_media').delete().eq('id', button.dataset.projectMediaDelete)
    if (error) { button.disabled = false; showToast('Gambar galeri tidak dapat dihapus.', 'error'); return }
    await deletePublicImage(button.dataset.projectMediaPath)
    button.closest('.project-media-item')?.remove()
    if (!list.children.length) list.innerHTML = '<p class="admin-empty">Belum ada gambar galeri.</p>'
    showToast('Gambar galeri dihapus.')
  })
}

async function prepareImageUploads(form, fields, payload, row, userId) {
  const changes = []
  for (const [name, , type, , pathName, folder] of fields) {
    if (type !== 'image') continue
    const input = form.elements[name]
    const uploader = input?.closest('[data-image-uploader]')
    // The controller keeps the dropped file even in browsers that reject
    // assigning a FileList programmatically.
    const file = input?.files?.[0] || uploader?._imageUploaderController?.getFile?.()
    if (file) {
      const uploaded = await uploadPublicImage({ file, folder, userId })
      payload[name] = uploaded.publicUrl
      if (pathName) payload[pathName] = uploaded.path
      changes.push({ newPath: uploaded.path, oldPath: row?.[pathName] })
    } else if (uploader?.dataset.imageCleared === 'true' && row) {
      payload[name] = null
      if (pathName) payload[pathName] = null
      changes.push({ oldPath: row?.[pathName] })
    }
  }
  return changes
}

async function prepareFileUploads(form, fields, payload, row, userId) {
  const changes = []
  for (const [name, , type, , pathName, folder] of fields) {
    if (type !== 'file') continue
    const input = form.elements[name]
    const uploader = input?.closest('[data-file-uploader]')
    const file = input?.files?.[0]
    if (file) {
      if (file.type !== 'application/pdf' || file.size > 8 * 1024 * 1024) throw new Error('File pendukung harus PDF dan berukuran maksimal 8 MB.')
      const path = `documents/${folder || 'admin'}/${userId}/${Date.now()}-${file.name.replace(/[^a-z0-9._-]+/gi, '-')}`
      const upload = await supabase.storage.from('portfolio-public').upload(path, file, { upsert: false, contentType: 'application/pdf', cacheControl: '3600' })
      if (upload.error) throw upload.error
      const publicUrl = supabase.storage.from('portfolio-public').getPublicUrl(path).data.publicUrl
      payload[name] = publicUrl
      if (pathName) payload[pathName] = path
      changes.push({ newPath: path, oldPath: row?.[pathName] })
    } else if (uploader?.dataset.fileCleared === 'true' && row) {
      payload[name] = null
      if (pathName) payload[pathName] = null
      changes.push({ oldPath: row?.[pathName] })
    }
  }
  return changes
}

async function cleanupNewImages(changes) {
  await Promise.all((changes || []).filter(item => item.newPath).map(item => deletePublicImage(item.newPath)))
}

async function cleanupReplacedImages(changes) {
  await Promise.all((changes || []).filter(item => item.oldPath && item.oldPath !== item.newPath).map(item => deletePublicImage(item.oldPath)))
}

async function renderSettings(context) {
  const canManage = hasPermission(context, 'settings.update')
  const content = document.querySelector('#admin-content')
  content.innerHTML = `<div class="admin-page-heading"><div><p>{ Public configuration }</p><h1>Site settings.</h1><span>Nilai disimpan sebagai JSON agar tipe boolean dan angka tetap konsisten.</span></div>${canManage ? '<button class="admin-primary-button" data-setting-new>Tambah</button>' : ''}</div><div id="settings-form"></div><section class="admin-card"><div class="admin-section-heading"><div><p>Database</p><h2>Settings</h2></div><input class="admin-search" data-setting-search placeholder="Cari key..."></div><div id="settings-list">Memuat...</div></section>`
  renderHeroSettings(context)
  renderSiteAssetUploader(context)
  const formContainer = document.querySelector('#settings-form'); const list = document.querySelector('#settings-list'); let rows = []
  const renderRows = () => { const term = document.querySelector('[data-setting-search]').value.toLowerCase(); const filtered = rows.filter(row => `${row.key} ${row.group_name}`.toLowerCase().includes(term)); list.innerHTML = filtered.length ? filtered.map(row => `<article class="admin-list-card"><div><p class="admin-list-kicker">${escapeHtml(row.group_name)} · ${row.is_public ? 'public' : 'private'}</p><h3>${escapeHtml(row.key)}</h3><p>${escapeHtml(parseSettingValue(row.value))}</p></div>${canManage ? `<div class="admin-row-actions"><button class="admin-secondary-button" data-setting-edit="${row.id}">Edit</button><button class="admin-danger-button" data-setting-delete="${row.id}">Hapus</button></div>` : ''}</article>`).join('') : '<p class="admin-empty">Belum ada setting.</p>' }
  const load = async () => { const result = await listSettings({ orderBy: 'group_name' }); if (result.error) { list.innerHTML = '<span class="admin-form-error">Settings tidak dapat dimuat.</span>'; return } rows = result.data ?? []; renderRows() }
  const openForm = row => { formContainer.innerHTML = `<section class="admin-card admin-form-card"><form id="settings-edit-form"><div class="admin-form-grid"><label class="admin-field"><span>Key</span><input name="key" value="${escapeHtml(row?.key)}" required ${row ? 'readonly' : ''}></label><label class="admin-field"><span>Group</span><input name="group_name" value="${escapeHtml(row?.group_name || 'general')}" required></label><label class="admin-field admin-field-wide"><span>Value (JSON atau teks)</span><textarea name="value" rows="4">${escapeHtml(parseSettingValue(row?.value))}</textarea></label><label class="admin-checkbox"><input type="checkbox" name="is_public" ${row?.is_public !== false ? 'checked' : ''}><span>Public setting</span></label></div><div class="admin-form-actions"><button class="admin-primary-button" type="submit">Simpan</button><button class="admin-secondary-button" type="button" data-setting-cancel>Batal</button></div><p class="admin-form-error" data-setting-error></p></form></section>`; formContainer.querySelector('form').addEventListener('submit', async event => { event.preventDefault(); const form = event.currentTarget; const button = form.querySelector('button[type="submit"]'); const error = form.querySelector('[data-setting-error]'); let value = form.elements.value.value; try { value = JSON.parse(value) } catch {} setBusy(button, true); const payload = { key: form.elements.key.value.trim(), group_name: form.elements.group_name.value.trim(), value, is_public: form.elements.is_public.checked, updated_by: context.user.id }; const result = row ? await updateSetting(row.id, payload) : await createSetting(payload); setBusy(button, false, 'Simpan'); if (result.error) { error.textContent = 'Setting belum tersimpan. Periksa key unik dan permission.'; return } formContainer.innerHTML = ''; showToast('Setting berhasil disimpan.'); await load() }) }
  document.querySelector('[data-setting-new]')?.addEventListener('click', () => openForm(null)); document.querySelector('[data-setting-search]').addEventListener('input', renderRows); list.addEventListener('click', async event => { const edit = event.target.closest('[data-setting-edit]'); if (edit) openForm(rows.find(row => row.id === edit.dataset.settingEdit)); const remove = event.target.closest('[data-setting-delete]'); if (remove && window.confirm('Hapus setting ini?')) { const { error } = await deleteSetting(remove.dataset.settingDelete); if (error) showToast('Setting tidak dapat dihapus.', 'error'); else { showToast('Setting dihapus.'); await load() } } }); await load()
}

async function renderHeroSettings(context) {
  if (!hasPermission(context, 'settings.update')) return
  const content = document.querySelector('#admin-content')
  if (!content) return
  content.insertAdjacentHTML('afterbegin', '<section class="admin-card admin-form-card"><div class="admin-section-heading"><div><p>Homepage · Section 1</p><h2>Konten hero</h2><span>Judul, badge, deskripsi, tombol, jabatan, dan foto hero dikelola dari satu editor section.</span></div><a class="admin-primary-button admin-button-link" href="/admin/sections/hero">Edit hero</a></div></section>')
}

function renderSiteAssetUploader(context) {
  if (!hasPermission(context, 'settings.update')) return
  const assetFields = [
    ['hero_image', 'Hero image', 'site/hero', 'hero_image_url', 'hero_image_path'],
    ['site_logo', 'Logo situs', 'site/logo', 'logo_url', 'logo_path'],
    ['site_favicon', 'Favicon', 'site/favicon', 'favicon_url', 'favicon_path'],
    ['og_image', 'Open Graph image', 'site/og', 'og_image_url', 'og_image_path']
  ]
  const content = document.querySelector('#admin-content')
  if (!content) return
  content.insertAdjacentHTML('afterbegin', '<section class="admin-card admin-form-card"><div class="admin-section-heading"><div><p>Assets</p><h2>Site imagery</h2></div></div><form id="site-assets-form" class="admin-form-grid"><p>Memuat gambar situs...</p></form></section>')
  const assetForm = document.querySelector('#site-assets-form')
  const assetRows = new Map()
  const load = async () => {
    let result = await getSettingsByKeys(assetFields.map(field => field[0]), { columns: 'id,key,value,asset_url,asset_path,hero_image_url,hero_image_path,logo_url,logo_path,favicon_url,favicon_path,og_image_url,og_image_path' })
    if (result.error?.code === '42703') result = await getSettingsByKeys(assetFields.map(field => field[0]), { columns: 'id,key,value,asset_url,asset_path' })
    const { data, error } = result
    if (error) { assetForm.innerHTML = '<p class="admin-form-error">Asset situs tidak dapat dimuat.</p>'; return }
    ;(data || []).forEach(row => assetRows.set(row.key, row))
    assetForm.innerHTML = assetFields.map(([key, label, , urlName]) => {
      const row = assetRows.get(key)
      const existingUrl = row?.[urlName] || row?.asset_url || (typeof row?.value === 'string' ? row.value : '')
      return renderImageUploader({ name: 'asset_' + key, label, existingUrl })
    }).join('') + '<div class="admin-form-actions"><button class="admin-primary-button" type="submit">Simpan gambar situs</button></div><p class="admin-form-error" data-site-assets-error></p>'
    bindImageUploaders(assetForm)
  }
  assetForm.addEventListener('submit', async event => {
    event.preventDefault()
    const button = assetForm.querySelector('button[type="submit"]')
    const errorElement = assetForm.querySelector('[data-site-assets-error]')
    const uploadedImages = []
    setBusy(button, true)
    try {
      for (const [key, , folder, urlName, pathName] of assetFields) {
        const file = assetForm.elements['asset_' + key]?.files?.[0]
        if (!file) continue
        const oldRow = assetRows.get(key)
        const uploaded = await uploadPublicImage({ file, folder, userId: context.user.id })
        uploadedImages.push({ key, uploaded, oldPath: oldRow?.[pathName] || oldRow?.asset_path, oldRow, urlName, pathName, saved: false })
        const { error } = await saveSettings({ key, group_name: 'assets', value: uploaded.publicUrl, [urlName]: uploaded.publicUrl, [pathName]: uploaded.path, asset_url: uploaded.publicUrl, asset_path: uploaded.path, is_public: true, updated_by: context.user.id })
        if (error) throw error
        uploadedImages[uploadedImages.length - 1].saved = true
        assetRows.set(key, { asset_url: uploaded.publicUrl, asset_path: uploaded.path, [urlName]: uploaded.publicUrl, [pathName]: uploaded.path, value: uploaded.publicUrl })
      }
      await Promise.all(uploadedImages.filter(item => item.oldPath && item.oldPath !== item.uploaded.path).map(item => deletePublicImage(item.oldPath)))
      showToast('Gambar situs diperbarui.')
      await load()
    } catch (saveError) {
      for (const item of uploadedImages.filter(entry => entry.saved)) {
        if (item.oldRow) await updateSetting(item.oldRow.id, { value: item.oldRow.value, [item.urlName]: item.oldRow[item.urlName] || null, [item.pathName]: item.oldRow[item.pathName] || null, asset_url: item.oldRow.asset_url || null, asset_path: item.oldRow.asset_path || null })
        else await deleteSettingByKey(item.key)
      }
      await cleanupNewImages(uploadedImages.map(item => ({ newPath: item.uploaded.path })))
      errorElement.textContent = saveError.message || 'Gambar situs belum tersimpan.'
    } finally {
      setBusy(button, false, 'Simpan gambar situs')
    }
  })
  load()
}

function renderResumeUploader(context) {
  if (!hasPermission(context, 'settings.update')) return
  const content = document.querySelector('#admin-content')
  if (!content) return
  content.insertAdjacentHTML('afterbegin', '<section class="admin-card admin-form-card"><div class="admin-section-heading"><div><p>Dokumen</p><h2>CV atau resume</h2><span>PDF disimpan di Supabase Storage dan dapat diganti tanpa mengubah source code.</span></div></div><form id="resume-form" class="admin-form-grid"><p>Memuat CV...</p></form></section>')
  const form = document.querySelector('#resume-form')
  let current = null
  const load = async () => {
    const result = await getSettingsByKeys(['resume_url'], { columns: 'id,key,value,resume_url,resume_path' })
    current = result.data?.[0] || null
    const url = current?.resume_url || current?.value || ''
    form.innerHTML = `<label class="admin-field admin-field-wide"><span>File CV</span><input name="resume_file" type="file" accept="application/pdf"><small class="admin-field-help">PDF · maksimal 8 MB. ${url ? 'CV saat ini tersedia di bawah.' : 'Belum ada CV.'}</small></label><div class="admin-form-actions admin-field-wide"><button class="admin-primary-button" type="submit">Simpan CV</button>${url ? `<a class="admin-secondary-button admin-button-link" href="${escapeHtml(url)}" target="_blank" rel="noopener">Preview CV ↗</a>` : ''}</div><p class="admin-form-error admin-field-wide" data-resume-error></p>`
  }
  form.addEventListener('submit', async event => {
    event.preventDefault(); const file = form.elements.resume_file.files?.[0]; const error = form.querySelector('[data-resume-error]'); const button = form.querySelector('button'); error.textContent = ''
    if (!file) { error.textContent = 'Pilih file PDF terlebih dahulu.'; return }
    if (file.type !== 'application/pdf' || file.size > 8 * 1024 * 1024) { error.textContent = 'File harus PDF dan berukuran maksimal 8 MB.'; return }
    setBusy(button, true); const path = `documents/${context.user.id}/${Date.now()}-${file.name.replace(/[^a-z0-9._-]+/gi, '-')}`
    try {
      const upload = await supabase.storage.from('portfolio-public').upload(path, file, { upsert: false, contentType: 'application/pdf', cacheControl: '3600' })
      if (upload.error) throw upload.error
      const publicUrl = supabase.storage.from('portfolio-public').getPublicUrl(path).data.publicUrl
      const save = await saveSettings({ key: 'resume_url', group_name: 'identity', value: publicUrl, resume_url: publicUrl, resume_path: path, is_public: true, updated_by: context.user.id })
      if (save.error) throw save.error
      if (current?.resume_path && current.resume_path !== path) await deletePublicImage(current.resume_path)
      showToast('CV berhasil diperbarui.'); await load()
    } catch (saveError) { await deletePublicImage(path); console.error('Resume upload failed:', saveError); error.textContent = 'CV belum tersimpan. Periksa bucket Storage dan permission.' }
    finally { setBusy(button, false, 'Simpan CV') }
  })
  load()
}

function renderGenericRow(key, row, canManage) {
  const title = row.title || row.name || row.company || row.institution || row.author_name || row.label || row.key || 'Tanpa judul'
  const secondary = row.summary || row.description || row.role_title || row.email || row.group_name || row.url || ''
  const status = row.status === 'hidden' ? 'disembunyikan' : row.status === 'archived' ? 'diarsipkan' : row.status === 'published' ? 'dipublikasikan' : row.status === 'draft' ? 'draf' : row.status || (row.is_active === false ? 'nonaktif' : 'aktif')
  const image = row.thumbnail_url || row.cover_url || row.image_url || row.certificate_url || row.logo_url
  const thumb = image ? `<img class="admin-list-thumb" src="${escapeHtml(image)}" alt="" loading="lazy">` : ''
  const previewUrl = key === 'projects' && row.slug ? '/projects/' + encodeURIComponent(row.slug) : key === 'articles' && row.slug ? '/#notes' : ''
  return `<article class="admin-list-card ${image ? 'has-thumb' : ''}">${thumb}<div><p class="admin-list-kicker"><span class="admin-status admin-status--${escapeHtml(row.status || 'active')}">${escapeHtml(status)}</span>${row.is_featured ? ' · unggulan' : ''}${row.updated_at ? ' · ' + escapeHtml(formatDate(row.updated_at)) : ''}</p><h3>${escapeHtml(title)}</h3><p>${escapeHtml(String(secondary).slice(0, 180))}</p></div>${canManage ? `<div class="admin-row-actions"><button class="admin-secondary-button" data-edit="${row.id}">Edit</button>${previewUrl ? `<button class="admin-secondary-button" data-preview="${escapeHtml(previewUrl)}">Preview</button>` : ''}${!['roles', 'social_links'].includes(key) ? `<button class="admin-secondary-button" data-duplicate="${row.id}">Duplikat</button>` : ''}<button class="admin-danger-button" data-delete="${row.id}">Hapus</button></div>` : (previewUrl ? `<div class="admin-row-actions"><button class="admin-secondary-button" data-preview="${escapeHtml(previewUrl)}">Preview</button></div>` : '')}</article>`
}

async function deleteRecord(table, id, context, reload, key = '') {
  if (!window.confirm('Hapus data ini?')) return
  const existing = key ? (await supabase.from(table).select('*').eq('id', id).maybeSingle()).data : null
  const projectMedia = key === 'projects' ? (await supabase.from('project_media').select('media_path').eq('project_id', id)).data || [] : []
  try { await deleteContent(table, id) } catch (error) { console.error(error); showToast('Data tidak dapat dihapus oleh policy/RLS.', 'error'); return }
  const imagePaths = (contentFields[key] || []).filter(field => ['image', 'file'].includes(field[2])).map(field => existing?.[field[4]]).filter(Boolean)
  await Promise.all([...imagePaths, ...projectMedia.map(item => item.media_path).filter(Boolean)].map(path => deletePublicImage(path)))
  showToast('Data dihapus.'); await reload()
}

async function renderMessages(context) {
  const content = document.querySelector('#admin-content'); const canUpdate = hasPermission(context, 'messages.update'); const canDelete = hasPermission(context, 'messages.delete')
  content.innerHTML = `<div class="admin-page-heading"><div><p>{ Komunikasi }</p><h1>Pesan masuk.</h1><span>Pesan dari formulir publik hanya dapat dibaca oleh akun admin.</span></div></div><section class="admin-card"><div class="admin-section-heading"><div><p>Inbox</p><h2>Semua pesan</h2></div><span data-message-count>Memuat...</span></div><div class="admin-toolbar"><input class="admin-search" data-message-search placeholder="Cari nama, email, atau isi pesan"><select class="admin-search" data-message-filter><option value="all">Semua status</option><option value="unread">Baru</option><option value="read">Sudah dibaca</option><option value="archived">Diarsipkan</option></select></div><div class="admin-message-layout"><div id="module-list">Memuat...</div><aside class="admin-card admin-message-detail" data-message-detail><p class="admin-empty">Pilih pesan untuk melihat detailnya.</p></aside></div></section>`
  const list = document.querySelector('#module-list'); const detail = document.querySelector('[data-message-detail]'); const count = document.querySelector('[data-message-count]'); const result = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(200)
  if (result.error) { list.innerHTML = '<span class="admin-form-error">Pesan tidak dapat dimuat. Periksa permission messages.view.</span>'; return }
  const rows = result.data || []
  const render = () => { const term = document.querySelector('[data-message-search]').value.toLowerCase(); const filter = document.querySelector('[data-message-filter]').value; const filtered = rows.filter(item => (filter === 'all' || item.status === filter) && `${item.name} ${item.email} ${item.subject || ''} ${item.message}`.toLowerCase().includes(term)); count.textContent = `${filtered.length} pesan`; list.innerHTML = filtered.length ? filtered.map(message => `<button class="admin-message-row ${message.status === 'unread' ? 'is-unread' : ''}" type="button" data-message-open="${message.id}"><span><strong>${escapeHtml(message.name)}</strong><small>${escapeHtml(message.subject || message.email)}</small></span><small>${formatDate(message.created_at)}</small></button>`).join('') : '<p class="admin-empty">Tidak ada pesan yang cocok.</p>' }
  const openDetail = async message => { if (canUpdate && message.status === 'unread') { const update = await supabase.from('contact_messages').update({ status: 'read', updated_at: new Date().toISOString() }).eq('id', message.id); if (!update.error) message.status = 'read' } detail.innerHTML = `<p class="admin-list-kicker">${escapeHtml(message.status)} · ${formatDate(message.created_at)}</p><h2>${escapeHtml(message.subject || 'Pesan tanpa topik')}</h2><p><strong>${escapeHtml(message.name)}</strong><br><a href="mailto:${escapeHtml(message.email)}">${escapeHtml(message.email)}</a></p><p class="admin-message-body">${escapeHtml(message.message).replace(/\r?\n/g, '<br>')}</p><div class="admin-row-actions">${canUpdate ? `<button class="admin-secondary-button" data-message-mark="${message.id}">${message.status === 'archived' ? 'Pulihkan' : 'Arsipkan'}</button>` : ''}${canDelete ? `<button class="admin-danger-button" data-message-delete="${message.id}">Hapus pesan</button>` : ''}</div>`; render() }
  render(); document.querySelector('[data-message-search]').addEventListener('input', render); document.querySelector('[data-message-filter]').addEventListener('change', render)
  list.addEventListener('click', event => { const button = event.target.closest('[data-message-open]'); if (button) openDetail(rows.find(item => item.id === button.dataset.messageOpen)) })
  detail.addEventListener('click', async event => { const mark = event.target.closest('[data-message-mark]'); if (mark) { const message = rows.find(item => item.id === mark.dataset.messageMark); const next = message.status === 'archived' ? 'read' : 'archived'; const update = await supabase.from('contact_messages').update({ status: next, updated_at: new Date().toISOString() }).eq('id', message.id); if (update.error) showToast('Status pesan belum berubah.', 'error'); else { message.status = next; showToast(next === 'archived' ? 'Pesan diarsipkan.' : 'Pesan dipulihkan.'); openDetail(message) } } const remove = event.target.closest('[data-message-delete]'); if (remove && window.confirm('Hapus pesan ini? Tindakan ini tidak dapat dibatalkan.')) { const deletion = await supabase.from('contact_messages').delete().eq('id', remove.dataset.messageDelete); if (deletion.error) showToast('Pesan tidak dapat dihapus.', 'error'); else { const index = rows.findIndex(item => item.id === remove.dataset.messageDelete); if (index >= 0) rows.splice(index, 1); detail.innerHTML = '<p class="admin-empty">Pesan dihapus.</p>'; render(); showToast('Pesan dihapus.') } } })
}

async function renderMedia(context) {
  const canManage = hasPermission(context, 'media.manage')
  const content = document.querySelector('#admin-content')
  content.innerHTML = '<div class="admin-page-heading"><div><p>{ Pustaka media }</p><h1>Media.</h1><span>File tersimpan di Supabase Storage bucket portfolio-public.</span></div></div>' +
    (canManage ? '<section class="admin-card admin-form-card"><form id="media-form" class="admin-form-grid">' + renderImageUploader({ name: 'media_file', label: 'Upload gambar' }) + '<label class="admin-field"><span>Teks alternatif</span><input name="alt_text" maxlength="160"></label><label class="admin-field"><span>Status</span><select name="status"><option value="draft">Draft</option><option value="published">Dipublikasikan</option></select></label><div class="admin-form-actions"><button class="admin-primary-button" type="submit">Upload</button></div><p class="admin-form-error" data-media-error></p></form></section>' : '') +
    '<section class="admin-card"><div id="media-list">Memuat...</div></section>'
  const mediaForm = document.querySelector('#media-form')
  if (mediaForm) bindImageUploaders(mediaForm)
  const load = async () => {
    const { data, error } = await supabase.from('media_assets').select('*').order('created_at', { ascending: false }).limit(100)
    const list = document.querySelector('#media-list')
    if (error) { list.innerHTML = '<span class="admin-form-error">Media tidak dapat dimuat.</span>'; return }
    list.innerHTML = data?.length ? data.map(item => '<article class="admin-list-card"><div><p class="admin-list-kicker">' + escapeHtml(item.status) + ' · ' + escapeHtml(item.mime_type) + '</p><h3>' + escapeHtml(item.file_name) + '</h3><p>' + Math.round(item.size_bytes / 1024) + ' KB · ' + formatDate(item.created_at) + '</p></div>' + (canManage ? '<button class="admin-danger-button" data-media-delete="' + item.id + '" data-media-path="' + escapeHtml(item.object_path || item.path) + '">Hapus</button>' : '') + '</article>').join('') : '<p class="admin-empty">Belum ada media.</p>'
  }
  await load()
  mediaForm?.addEventListener('submit', async event => {
    event.preventDefault()
    const form = event.currentTarget
    const button = form.querySelector('button[type="submit"]')
    const error = form.querySelector('[data-media-error]')
    const file = form.elements.media_file.files[0]
    if (!file) { error.textContent = 'Pilih gambar terlebih dahulu.'; return }
    setBusy(button, true)
    let uploaded = null
    try {
      uploaded = await uploadPublicImage({ file, folder: 'media', userId: context.user.id })
      const record = { owner_id: context.user.id, bucket_id: 'portfolio-public', bucket_name: 'portfolio-public', path: uploaded.path, object_path: uploaded.path, public_url: uploaded.publicUrl, file_name: file.name, mime_type: file.type, size_bytes: file.size, alt_text: form.elements.alt_text.value.trim(), status: form.elements.status.value, created_by: context.user.id, uploaded_by: context.user.id }
      const { error: rowError } = await supabase.from('media_assets').insert(record)
      if (rowError) throw rowError
      showToast('Media berhasil diupload.')
      form.reset()
      form.querySelector('[data-image-clear]')?.click()
      error.textContent = ''
      await load()
    } catch (uploadError) {
      if (uploaded?.path) await deletePublicImage(uploaded.path)
      error.textContent = uploadError.message || 'Upload gagal. Periksa ukuran file dan policy Storage.'
    } finally {
      setBusy(button, false, 'Upload')
    }
  })
  document.querySelector('#media-list').addEventListener('click', async event => {
    const button = event.target.closest('[data-media-delete]')
    if (!button || !window.confirm('Hapus media ini?')) return
    const { error } = await supabase.from('media_assets').delete().eq('id', button.dataset.mediaDelete)
    if (error) { showToast('Media tidak dapat dihapus.', 'error'); return }
    await deletePublicImage(button.dataset.mediaPath)
    button.closest('.admin-list-card').remove()
    showToast('Media dihapus.')
  })
}

async function renderUsers(context) {
  const content = document.querySelector('#admin-content'); const canUpdate = hasPermission(context, 'users.update') || hasPermission(context, 'users.deactivate'); const canAssign = hasPermission(context, 'users.update')
  content.innerHTML = `<div class="admin-page-heading"><div><p>{ Access control }</p><h1>Users.</h1><span>Pembuatan akun dilakukan melalui Supabase Authentication; panel ini mengatur profil aktif dan role.</span></div></div><section class="admin-card"><div id="users-list">Memuat...</div></section>`
  const [{ data: profiles, error }, { data: roles }, { data: userRoles, error: userRolesError }] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('roles').select('id,name,label').order('name'),
    supabase.from('user_roles').select('user_id, role_id')
  ])
  const list = document.querySelector('#users-list')
  if (error || userRolesError) { list.innerHTML = '<span class="admin-form-error">User tidak dapat dimuat. Periksa policy RLS.</span>'; return }
  const roleIndex = new Map((roles ?? []).map(role => [role.id, role]))
  const roleMap = Object.groupBy ? Object.groupBy(userRoles ?? [], row => row.user_id) : (userRoles ?? []).reduce((map, row) => { (map[row.user_id] ||= []).push(row); return map }, {})
  list.innerHTML = profiles?.length ? profiles.map(profile => { const currentRoles = (roleMap[profile.id] ?? []).map(row => roleIndex.get(row.role_id)).filter(Boolean); return `<article class="admin-list-card"><div><p class="admin-list-kicker">${profile.is_active ? 'active' : 'inactive'} · ${formatDate(profile.created_at)}</p><h3>${escapeHtml(profile.full_name || profile.username || 'Tanpa nama')}</h3><p>${escapeHtml(profile.phone || profile.bio || profile.id)}</p><div class="admin-role-pills">${currentRoles.map(role => `<span>${escapeHtml(role.label || role.name || '')}</span>`).join('')}</div></div><div class="admin-row-actions">${canUpdate ? `<button class="admin-secondary-button" data-user-active="${profile.id}" data-active="${profile.is_active}">${profile.is_active ? 'Nonaktifkan' : 'Aktifkan'}</button>` : ''}${canAssign ? `<select data-user-role="${profile.id}"><option value="">Tambah role...</option>${(roles ?? []).map(role => `<option value="${role.id}">${escapeHtml(role.label || role.name)}</option>`).join('')}</select>` : ''}</div></article>` }).join('') : '<p class="admin-empty">Belum ada profil user.</p>'
  list.addEventListener('click', async event => { const button = event.target.closest('[data-user-active]'); if (!button) return; const next = button.dataset.active !== 'true'; const { error: updateError } = await supabase.from('profiles').update({ is_active: next, updated_at: new Date().toISOString() }).eq('id', button.dataset.userActive); if (updateError) showToast('Status user ditolak oleh RLS.', 'error'); else { button.dataset.active = String(next); button.textContent = next ? 'Nonaktifkan' : 'Aktifkan'; showToast('Status user diperbarui.') } })
  list.addEventListener('change', async event => { const select = event.target.closest('[data-user-role]'); if (!select?.value) return; const { error: assignError } = await supabase.from('user_roles').insert({ user_id: select.dataset.userRole, role_id: select.value, assigned_by: context.user.id }); if (assignError) showToast('Role tidak dapat ditambahkan oleh RLS.', 'error'); else { showToast('Role ditambahkan.'); select.value = '' } })
}

async function renderReadOnlyModule(key) {
  const definitions = { permissions: ['Permissions', 'permissions', ['key', 'module', 'action', 'description']], security: ['Security events', 'security_events', ['event_type', 'severity', 'created_at']], login_history: ['Login history', 'login_history', ['email', 'was_successful', 'failure_reason', 'created_at']] }
  const [label, table, columns] = definitions[key]; const content = document.querySelector('#admin-content'); content.innerHTML = `<div class="admin-page-heading"><div><p>{ ${label} }</p><h1>${label}.</h1><span>Data terlindungi oleh permission dan RLS.</span></div></div><section class="admin-card"><div id="readonly-list">Memuat...</div></section>`
  const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false }).limit(100); const list = document.querySelector('#readonly-list'); if (error) { list.innerHTML = '<span class="admin-form-error">Data tidak dapat dimuat.</span>'; return } list.innerHTML = data?.length ? data.map(row => `<article class="admin-list-card"><div>${columns.map(column => `<p><strong>${escapeHtml(column)}:</strong> ${escapeHtml(row[column] === true ? 'true' : row[column] === false ? 'false' : row[column] ?? '-')}</p>`).join('')}</div></article>`).join('') : '<p class="admin-empty">Belum ada data.</p>'
}

function settingInput(key, label, type, value, help = '') {
  if (type === 'boolean') return `<label class="admin-checkbox"><input type="checkbox" name="${escapeHtml(key)}" ${value === true || value === 'true' ? 'checked' : ''}><span>${escapeHtml(label)}</span></label>${help ? `<small class="admin-field-help">${escapeHtml(help)}</small>` : ''}`
  if (type === 'select') return `<label class="admin-field"><span>${escapeHtml(label)}</span><select name="${escapeHtml(key)}">${value.options.map(option => `<option value="${escapeHtml(option.value)}" ${option.value === value.selected ? 'selected' : ''}>${escapeHtml(option.label)}</option>`).join('')}</select>${help ? `<small class="admin-field-help">${escapeHtml(help)}</small>` : ''}</label>`
  const input = type === 'textarea' ? `<textarea name="${escapeHtml(key)}" rows="4">${escapeHtml(value || '')}</textarea>` : `<input name="${escapeHtml(key)}" type="${['url', 'email', 'number'].includes(type) ? type : 'text'}" value="${escapeHtml(value || '')}">`
  return `<label class="admin-field ${type === 'textarea' ? 'admin-field-wide' : ''}"><span>${escapeHtml(label)}</span>${input}${help ? `<small class="admin-field-help">${escapeHtml(help)}</small>` : ''}</label>`
}

function currentSetting(rows, key, fallback = '') {
  const row = rows.find(item => item.key === key)
  if (!row) return fallback
  return row.value ?? fallback
}

async function renderSettingPage(context, { group, eyebrow, title, description, fields }) {
  const canManage = hasPermission(context, 'settings.update')
  const content = document.querySelector('#admin-content')
  content.innerHTML = `<div class="admin-page-heading"><div><p>{ ${escapeHtml(eyebrow)} }</p><h1>${escapeHtml(title)}.</h1><span>${escapeHtml(description)}</span></div></div><section class="admin-card admin-form-card"><div class="admin-section-heading"><div><p>Pengaturan tersimpan</p><h2>Atur tanpa menyentuh kode</h2></div><span class="admin-list-kicker">${escapeHtml(group)}</span></div><form id="settings-page-form" class="admin-form-grid"><p class="admin-empty">Memuat pengaturan...</p></form></section>`
  const form = content.querySelector('#settings-page-form')
  const result = await listSettings({ group })
  const rows = result.data || []
  if (result.error) { form.innerHTML = '<p class="admin-form-error">Pengaturan belum dapat dimuat. Periksa permission settings.view.</p>'; return }
  form.innerHTML = fields.map(field => {
    const value = currentSetting(rows, field.key, field.default)
    if (field.type === 'select') return settingInput(field.key, field.label, field.type, { options: field.options, selected: value }, field.help)
    return settingInput(field.key, field.label, field.type, value, field.help)
  }).join('') + `<div class="admin-form-actions admin-field-wide"><button class="admin-primary-button" type="submit" ${canManage ? '' : 'disabled'}>Simpan perubahan</button><a class="admin-secondary-button admin-button-link" href="/admin/preview">Lihat preview</a></div><p class="admin-form-error admin-field-wide" data-settings-error role="alert"></p>`
  if (!canManage) form.querySelector('[data-settings-error]').textContent = 'Akun ini hanya dapat melihat pengaturan.'
  form.addEventListener('submit', async event => {
    event.preventDefault()
    if (!canManage) return
    const button = form.querySelector('button[type="submit"]'); const error = form.querySelector('[data-settings-error]'); setBusy(button, true); error.textContent = ''
    try {
      for (const field of fields) {
        const control = form.elements[field.key]
        const value = field.type === 'boolean' ? control.checked : control.value.trim()
        const payload = { group_name: group, key: field.key, value, is_public: field.isPublic !== false, is_translatable: Boolean(field.isTranslatable), description: field.help || null, updated_by: context.user.id }
        const save = await saveSettings(payload)
        if (save.error) throw save.error
      }
      showToast('Pengaturan berhasil disimpan.')
    } catch (saveError) { console.error('Settings save failed:', saveError); error.textContent = saveError.code === '42501' ? 'Perubahan ditolak oleh permission.' : 'Pengaturan belum tersimpan. Data lama tetap dipertahankan.' }
    finally { setBusy(button, false, 'Simpan perubahan') }
  })
}

async function renderAppearance(context) {
  await renderSettingPage(context, { group: 'appearance', eyebrow: 'Pengaturan tampilan', title: 'Tampilan', description: 'Pilih tampilan yang tetap mengikuti design system portfolio.', fields: [
    { key: 'appearance_theme', label: 'Tema dasar', type: 'select', default: 'light', options: [{ value: 'light', label: 'Terang' }, { value: 'dark', label: 'Gelap' }], help: 'Tema diterapkan pada halaman publik.' },
    { key: 'appearance_accent', label: 'Warna utama', type: 'select', default: '#0075de', options: [{ value: '#0075de', label: 'Notion Blue' }, { value: '#f64932', label: 'Coral' }, { value: '#ffb110', label: 'Marigold' }, { value: '#02093a', label: 'Midnight' }] },
    { key: 'appearance_font', label: 'Font', type: 'select', default: 'Inter', options: [{ value: 'Inter', label: 'Inter' }, { value: 'system-ui', label: 'System UI' }, { value: 'Source Serif 4', label: 'Source Serif 4' }] },
    { key: 'appearance_radius', label: 'Bentuk sudut', type: 'select', default: '12px', options: [{ value: '12px', label: 'Lembut (12px)' }, { value: '8px', label: 'Ringkas (8px)' }, { value: '4px', label: 'Tegas (4px)' }] },
    { key: 'appearance_density', label: 'Kepadatan layout', type: 'select', default: 'comfortable', options: [{ value: 'comfortable', label: 'Nyaman' }, { value: 'compact', label: 'Ringkas' }] },
    { key: 'appearance_motion', label: 'Animasi ringan', type: 'boolean', default: true, help: 'Matikan jika ingin mengurangi gerakan.' },
    { key: 'appearance_project_card', label: 'Tampilan kartu proyek', type: 'select', default: 'editorial', options: [{ value: 'editorial', label: 'Editorial' }, { value: 'compact', label: 'Ringkas' }] },
    { key: 'appearance_gallery', label: 'Tampilan galeri', type: 'select', default: 'grid', options: [{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'Daftar' }] }
  ] })
  await renderTemplateAdmin(context)
}

async function renderSeo(context) {
  await renderSettingPage(context, { group: 'seo', eyebrow: 'Optimasi mesin pencari', title: 'SEO', description: 'Kelola metadata pencarian dan berbagi sosial dengan nilai yang mudah dipahami.', fields: [
    { key: 'default_meta_title', label: 'Judul default', type: 'text', default: '', help: 'Judul yang dipakai jika halaman belum memiliki judul sendiri.' },
    { key: 'title_template', label: 'Template judul', type: 'text', default: '%s', help: 'Gunakan %s sebagai pengganti judul halaman.' },
    { key: 'default_meta_description', label: 'Deskripsi default', type: 'textarea', default: '', help: 'Disarankan 140–160 karakter.' },
    { key: 'social_title', label: 'Judul social sharing', type: 'text', default: '' },
    { key: 'social_description', label: 'Deskripsi social sharing', type: 'textarea', default: '' },
    { key: 'canonical_url', label: 'Canonical URL', type: 'url', default: '' },
    { key: 'robots', label: 'Robots', type: 'select', default: 'index,follow', options: [{ value: 'index,follow', label: 'Index dan follow' }, { value: 'noindex,follow', label: 'No index, follow' }, { value: 'noindex,nofollow', label: 'No index, no follow' }] },
    { key: 'site_favicon', label: 'URL favicon', type: 'url', default: '', help: 'Untuk file dari Storage, gunakan URL publik dari Media.' },
    { key: 'og_image', label: 'URL Open Graph image', type: 'url', default: '', help: 'Gunakan gambar rasio 1.91:1 agar rapi saat dibagikan.' }
  ] })
}

async function renderContactSettings(context) {
  await renderSettingPage(context, { group: 'contact', eyebrow: 'Kontak publik', title: 'Kontak', description: 'Atur informasi kontak dan field yang tersedia pada formulir publik.', fields: [
    { key: 'contact_heading', label: 'Heading', type: 'text', default: '' },
    { key: 'contact_description', label: 'Deskripsi', type: 'textarea', default: '' },
    { key: 'contact_email', label: 'Email', type: 'email', default: '' },
    { key: 'contact_whatsapp', label: 'Nomor WhatsApp', type: 'text', default: '' },
    { key: 'contact_success_message', label: 'Pesan berhasil', type: 'text', default: '' },
    { key: 'contact_form_active', label: 'Aktifkan formulir kontak', type: 'boolean', default: true },
    { key: 'contact_fields', label: 'Field formulir (JSON)', type: 'text', default: '["name","email","subject","message"]', help: 'Daftar field yang aktif. Field teknis akan diabaikan di halaman publik.' }
  ] })
}

async function renderAccountSettings(context) {
  const content = document.querySelector('#admin-content')
  const profile = context.profile || {}
  content.innerHTML = `<div class="admin-page-heading"><div><p>{ Keamanan akun }</p><h1>Pengaturan akun.</h1><span>Kelola identitas akun admin dan ganti password secara aman.</span></div></div><div class="admin-two-column"><section class="admin-card admin-form-card"><div class="admin-section-heading"><div><p>Identitas akun</p><h2>Nama yang tampil di panel</h2></div></div><form id="account-profile-form" class="admin-form-grid"><label class="admin-field admin-field-wide"><span>Email login</span><input value="${escapeHtml(context.user?.email || '')}" disabled></label><label class="admin-field"><span>Nama lengkap</span><input name="full_name" value="${escapeHtml(profile.full_name || '')}" required></label><label class="admin-field"><span>Username</span><input name="username" value="${escapeHtml(profile.username || '')}"></label><div class="admin-form-actions admin-field-wide"><button class="admin-primary-button" type="submit">Simpan identitas</button></div><p class="admin-form-error admin-field-wide" data-account-profile-error></p></form></section><section class="admin-card admin-form-card"><div class="admin-section-heading"><div><p>Password</p><h2>Ganti password</h2></div></div><form id="account-password-form"><label class="admin-field"><span>Password baru</span><input name="password" type="password" minlength="8" required></label><label class="admin-field"><span>Ulangi password</span><input name="confirmation" type="password" minlength="8" required></label><div class="admin-form-actions"><button class="admin-primary-button" type="submit">Perbarui password</button></div><p class="admin-form-error" data-account-password-error></p></form></section></div>`
  content.querySelector('#account-profile-form').addEventListener('submit', async event => { event.preventDefault(); const form = event.currentTarget; const button = form.querySelector('button'); const error = form.querySelector('[data-account-profile-error]'); setBusy(button, true); const result = await supabase.from('profiles').update({ full_name: form.elements.full_name.value.trim(), username: form.elements.username.value.trim(), updated_at: new Date().toISOString() }).eq('id', context.user.id); setBusy(button, false, 'Simpan identitas'); if (result.error) error.textContent = 'Identitas belum tersimpan. Periksa permission.'; else showToast('Identitas akun diperbarui.') })
  content.querySelector('#account-password-form').addEventListener('submit', async event => { event.preventDefault(); const form = event.currentTarget; const error = form.querySelector('[data-account-password-error]'); if (form.elements.password.value !== form.elements.confirmation.value) { error.textContent = 'Password tidak sama.'; return } const button = form.querySelector('button'); setBusy(button, true); const result = await supabase.auth.updateUser({ password: form.elements.password.value }); setBusy(button, false, 'Perbarui password'); if (result.error) error.textContent = 'Password belum dapat diperbarui.'; else { form.reset(); showToast('Password diperbarui.') } })
}

async function renderAdminPreview() {
  const content = document.querySelector('#admin-content')
  content.innerHTML = `<div class="admin-page-heading"><div><p>{ Publikasi }</p><h1>Preview website.</h1><span>Tinjau website pada viewport nyata sebelum membagikan atau memublikasikan perubahan.</span></div><div class="admin-row-actions"><button class="admin-secondary-button" type="button" data-preview-reload>Muat ulang</button><a class="admin-primary-button admin-button-link" href="/" target="_blank" rel="noopener">Buka di tab baru ↗</a></div></div><section class="admin-card admin-preview-workspace"><div class="admin-preview-toolbar"><span>Mode desktop</span><div><button class="admin-secondary-button" type="button" data-preview-size="desktop">Desktop</button><button class="admin-secondary-button" type="button" data-preview-size="tablet">Tablet</button><button class="admin-secondary-button" type="button" data-preview-size="mobile">Mobile</button></div></div><div class="admin-website-preview" data-preview-frame-wrap><iframe title="Preview website portfolio" src="/?preview=1" data-preview-frame></iframe></div><p class="admin-field-help">Preview membaca data publik terbaru. Draft tidak tampil sampai statusnya diubah menjadi Dipublikasikan.</p></section>`
  const frame = content.querySelector('[data-preview-frame]'); const wrap = content.querySelector('[data-preview-frame-wrap]')
  content.querySelector('[data-preview-reload]').addEventListener('click', () => { frame.src = '/?preview=1&updated=' + Date.now() })
  content.querySelectorAll('[data-preview-size]').forEach(button => button.addEventListener('click', () => { wrap.dataset.previewSize = button.dataset.previewSize }))
}

async function renderPdfExport(context) {
  const versions = await getOwnedPortfolioVersions(context.user.id)
  const options = (versions.data || []).map(row => `<option value="/portfolio/${encodeURIComponent(row.slug)}">${escapeHtml(row.title)} · ${escapeHtml(row.visibility || 'draft')}</option>`).join('')
  const content = document.querySelector('#admin-content')
  content.innerHTML = `<div class="admin-page-heading"><div><p>{ Publikasi }</p><h1>Ekspor PDF.</h1><span>Gunakan tampilan print browser agar hasil PDF mengikuti layout preview.</span></div></div><section class="admin-card admin-form-card"><div class="admin-form-grid"><label class="admin-field admin-field-wide"><span>Sumber dokumen</span><select data-pdf-source><option value="/">Portfolio utama</option>${options}</select><small class="admin-field-help">Pastikan konten yang ingin dibawa sudah berstatus Dipublikasikan.</small></label><div class="admin-form-actions admin-field-wide"><button class="admin-primary-button" type="button" data-pdf-open>Buka dokumen</button><button class="admin-secondary-button" type="button" data-pdf-print>Cetak / simpan sebagai PDF</button></div><p class="admin-field-help admin-field-wide">Di dialog cetak browser, pilih “Save as PDF”.</p></div></section>`
  const source = content.querySelector('[data-pdf-source]'); content.querySelector('[data-pdf-open]').addEventListener('click', () => window.open(source.value, '_blank', 'noopener,noreferrer')); content.querySelector('[data-pdf-print]').addEventListener('click', () => { const tab = window.open(source.value, '_blank', 'noopener,noreferrer'); if (tab) window.setTimeout(() => tab.print(), 1200) })
}

function renderAccessDenied(message = 'Akunmu tidak memiliki permission untuk halaman ini.') { document.body.innerHTML = `<main class="admin-auth-page"><section class="admin-auth-card"><p class="admin-auth-eyebrow">403</p><h1>Akses ditolak.</h1><p>${escapeHtml(message)}</p><a class="admin-primary-button admin-button-link" href="/admin">Kembali ke dashboard</a></section></main>` }
function renderConfigurationError(message = 'Supabase belum dikonfigurasi.') { document.body.innerHTML = `<main class="admin-auth-page"><section class="admin-auth-card"><p class="admin-auth-eyebrow">Configuration</p><h1>Konfigurasi belum siap.</h1><p>${escapeHtml(message)}</p><a class="admin-back-link" href="/">Kembali ke portfolio</a></section></main>` }
function renderNotFound() { document.body.innerHTML = `<main class="admin-auth-page"><section class="admin-auth-card"><p class="admin-auth-eyebrow">404</p><h1>Halaman tidak ditemukan.</h1><a class="admin-primary-button admin-button-link" href="/">Kembali</a></section></main>` }
function translateAuthError(message = '') { const value = message.toLowerCase(); if (value.includes('invalid login credentials')) return 'Email atau password salah.'; if (value.includes('email not confirmed')) return 'Email belum dikonfirmasi.'; if (value.includes('too many requests')) return 'Terlalu banyak percobaan. Coba lagi nanti.'; return 'Login belum berhasil. Periksa data dan coba lagi.' }
