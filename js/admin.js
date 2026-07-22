import { supabase, supabaseConfiguration } from '../supabase.js'
import { ADMIN_MODULES } from './router.js'
import { authReady, getAccessContext, getCurrentSession, hasPermission, signIn, signOut, startIdleSessionTimeout } from './auth.js'
import { createEducation, deleteEducation, getAdminEducations, updateEducation } from './educations.js'
import { escapeHtml, formatDate, getValue, parseSettingValue, setBusy, showToast, slugify } from './utils.js'
import { deletePublicImage, uploadPublicImage } from './services/storage-service.js'
import { bindImageUploaders, renderImageUploader } from './components/image-uploader.js'
import { renderNavigationAdmin, renderSectionEditorAdmin, renderSectionsAdmin, renderStatisticsAdmin } from './admin-sections.js'

const contentFields = {
  projects: [
    ['title', 'Judul', 'text', true], ['slug', 'Slug', 'text', true], ['category', 'Kategori', 'text', false], ['summary', 'Ringkasan', 'textarea', false], ['description', 'Deskripsi', 'textarea', false], ['thumbnail_url', 'Thumbnail', 'image', false, 'thumbnail_path', 'projects/thumbnails'], ['cover_url', 'Cover image', 'image', false, 'cover_path', 'projects/covers'], ['project_url', 'URL proyek', 'url', false], ['status', 'Status', 'status', true], ['sort_order', 'Urutan', 'number', false], ['is_featured', 'Featured', 'boolean', false]
  ],
  articles: [
    ['title', 'Judul', 'text', true], ['slug', 'Slug', 'text', true], ['excerpt', 'Excerpt', 'textarea', false], ['content', 'Konten', 'textarea', true], ['thumbnail_url', 'Thumbnail', 'image', false, 'thumbnail_path', 'articles/thumbnails'], ['status', 'Status', 'status', true], ['sort_order', 'Urutan', 'number', false], ['is_featured', 'Featured', 'boolean', false]
  ],
  skills: [['name', 'Nama', 'text', true], ['category', 'Kategori', 'text', false], ['description', 'Deskripsi', 'textarea', false], ['level', 'Level 0-100', 'number', false], ['status', 'Status', 'status', true], ['sort_order', 'Urutan', 'number', false]],
  experiences: [['company', 'Perusahaan', 'text', true], ['role_title', 'Jabatan', 'text', true], ['description', 'Deskripsi', 'textarea', false], ['location', 'Lokasi', 'text', false], ['start_date', 'Mulai', 'date', false], ['end_date', 'Selesai', 'date', false], ['is_current', 'Saat ini', 'boolean', false], ['logo_url', 'Logo perusahaan', 'image', false, 'logo_path', 'experiences/logos'], ['status', 'Status', 'status', true], ['sort_order', 'Urutan', 'number', false]],
  educations: [['institution', 'Institusi', 'text', true], ['degree', 'Gelar', 'text', false], ['field_of_study', 'Bidang studi', 'text', false], ['location', 'Lokasi', 'text', false], ['description', 'Deskripsi', 'textarea', false], ['start_date', 'Mulai', 'date', false], ['end_date', 'Selesai', 'date', false], ['is_current', 'Saat ini', 'boolean', false], ['logo_url', 'Logo institusi', 'image', false, 'logo_path', 'educations/logos'], ['is_featured', 'Featured', 'boolean', false], ['status', 'Status', 'status', true], ['sort_order', 'Urutan', 'number', false]],
  certificates: [['title', 'Judul', 'text', true], ['issuer', 'Penerbit', 'text', false], ['issue_date', 'Tanggal', 'date', false], ['credential_url', 'URL credential', 'url', false], ['certificate_url', 'Gambar sertifikat', 'image', false, 'certificate_path', 'certificates'], ['status', 'Status', 'status', true], ['sort_order', 'Urutan', 'number', false]],
  services: [['title', 'Judul', 'text', true], ['slug', 'Slug', 'text', true], ['description', 'Deskripsi', 'textarea', false], ['icon', 'Icon key', 'text', false], ['icon_url', 'Icon image', 'image', false, 'icon_path', 'services/icons'], ['status', 'Status', 'status', true], ['sort_order', 'Urutan', 'number', false], ['is_featured', 'Featured', 'boolean', false]],
  testimonials: [['author_name', 'Nama', 'text', true], ['author_role', 'Peran', 'text', false], ['quote', 'Kutipan', 'textarea', true], ['avatar_url', 'Avatar', 'image', false, 'avatar_path', 'testimonials/avatars'], ['status', 'Status', 'status', true], ['sort_order', 'Urutan', 'number', false], ['is_featured', 'Featured', 'boolean', false]],
  social_links: [['platform', 'Platform', 'text', true], ['label', 'Label', 'text', true], ['url', 'URL', 'url', true], ['username', 'Username', 'text', false], ['icon', 'Icon key', 'text', false], ['is_active', 'Aktif', 'boolean', false], ['open_in_new_tab', 'Buka tab baru', 'boolean', false], ['sort_order', 'Urutan', 'number', false]],
  roles: [['name', 'Name', 'text', true], ['label', 'Label', 'text', true], ['description', 'Deskripsi', 'textarea', false], ['is_system', 'System role', 'boolean', false]]
}

const profileFields = [['full_name', 'Nama lengkap', 'text', false], ['username', 'Username', 'text', false], ['phone', 'Telepon', 'text', false], ['bio', 'Bio publik', 'textarea', false], ['avatar_url', 'Avatar profile', 'image', false, 'avatar_path', 'avatars'], ['is_active', 'Aktif di publik', 'boolean', false]]

const heroSettingFields = [
  ['hero_badge', 'Label kecil', 'text'],
  ['hero_title', 'Judul utama', 'text'],
  ['hero_description', 'Deskripsi utama', 'textarea'],
  ['professional_titles', 'Jabatan profesional', 'titles'],
  ['availability_label', 'Label ketersediaan', 'text']
]

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
  else if (route.name === 'sections') await renderSections(context)
  else if (route.name === 'navigation') await renderNavigation(context)
  else if (route.name === 'statistics') await renderStatistics(context)
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
  document.title = 'Login — bworiey'
  document.body.innerHTML = `<main class="admin-auth-page"><section class="admin-auth-card"><div class="admin-auth-header"><p class="admin-auth-eyebrow">BWORIEY CMS</p><h1>Masuk sebagai Admin</h1><p>Gunakan akun yang terdaftar pada Supabase Authentication.</p></div><div id="login-alert"></div><form id="login-form" novalidate><label class="admin-field"><span>Email</span><input name="email" type="email" autocomplete="email" placeholder="admin@email.com" required></label><label class="admin-field"><span>Password</span><input name="password" type="password" autocomplete="current-password" required></label><button type="submit" class="admin-primary-button">Masuk</button><p class="admin-form-error" id="login-error" role="alert"></p></form><a class="admin-back-link" href="/forgot-password">Lupa password?</a><a class="admin-back-link" href="/">Kembali ke portfolio</a></section></main>`
  const form = document.querySelector('#login-form'); const error = document.querySelector('#login-error'); const button = form.querySelector('button')
  form.addEventListener('submit', async event => { event.preventDefault(); if (!form.checkValidity()) { form.reportValidity(); return } setBusy(button, true); error.textContent = ''; try { await signIn(form.elements.email.value.trim(), form.elements.password.value); window.location.replace('/admin') } catch (loginError) { console.error('Login gagal:', { code: loginError?.code || null, message: loginError?.message || 'Unknown login error', details: loginError?.details || null, hint: loginError?.hint || null }); error.textContent = translateAuthError(loginError.message) } finally { setBusy(button, false, 'Masuk') } })
}

function renderForgotPasswordPage() {
  if (!authReady()) { renderConfigurationError('Isi environment variables Supabase untuk memakai reset password.'); return }
  document.title = 'Reset password — bworiey'
  document.body.innerHTML = `<main class="admin-auth-page"><section class="admin-auth-card"><div class="admin-auth-header"><p class="admin-auth-eyebrow">BWORIEY CMS</p><h1>Reset password</h1><p>Kami akan mengirim tautan reset ke email akunmu.</p></div><form id="forgot-form"><label class="admin-field"><span>Email</span><input name="email" type="email" required></label><button class="admin-primary-button" type="submit">Kirim tautan</button><p id="forgot-status" class="admin-form-error" role="status"></p></form><a class="admin-back-link" href="/login">Kembali ke login</a></section></main>`
  document.querySelector('#forgot-form').addEventListener('submit', async event => { event.preventDefault(); const form = event.currentTarget; const button = form.querySelector('button'); const status = document.querySelector('#forgot-status'); setBusy(button, true); const { error } = await supabase.auth.resetPasswordForEmail(form.elements.email.value.trim(), { redirectTo: `${window.location.origin}/reset-password` }); setBusy(button, false, 'Kirim tautan'); status.textContent = error ? 'Tautan belum dapat dikirim. Coba lagi.' : 'Jika email terdaftar, tautan reset sudah dikirim.' })
}

function renderResetPasswordPage() {
  if (!authReady()) { renderConfigurationError('Isi environment variables Supabase untuk memakai reset password.'); return }
  document.title = 'Password baru — bworiey'
  document.body.innerHTML = `<main class="admin-auth-page"><section class="admin-auth-card"><div class="admin-auth-header"><p class="admin-auth-eyebrow">BWORIEY CMS</p><h1>Buat password baru</h1></div><form id="reset-form"><label class="admin-field"><span>Password baru</span><input name="password" type="password" minlength="8" required></label><label class="admin-field"><span>Ulangi password</span><input name="confirmation" type="password" minlength="8" required></label><button class="admin-primary-button" type="submit">Simpan password</button><p id="reset-status" class="admin-form-error" role="status"></p></form><a class="admin-back-link" href="/login">Kembali ke login</a></section></main>`
  document.querySelector('#reset-form').addEventListener('submit', async event => { event.preventDefault(); const form = event.currentTarget; const status = document.querySelector('#reset-status'); if (form.elements.password.value !== form.elements.confirmation.value) { status.textContent = 'Password tidak sama.'; return } const button = form.querySelector('button'); setBusy(button, true); const { error } = await supabase.auth.updateUser({ password: form.elements.password.value }); setBusy(button, false, 'Simpan password'); status.textContent = error ? 'Password belum dapat diperbarui.' : 'Password diperbarui. Silakan login.'; if (!error) window.setTimeout(() => window.location.replace('/login'), 1200) })
}

function renderAdminShell(context, user, route) {
  const menu = [
    ['dashboard', 'Ikhtisar', 'dashboard.view'], ['sections', 'Editor section', 'settings.view'], ['navigation', 'Navigasi', 'settings.view'], ['statistics', 'Statistik', 'settings.view'], ['projects', 'Proyek', 'projects.view'], ['articles', 'Artikel', 'articles.view'], ['skills', 'Keahlian', 'skills.manage'], ['experiences', 'Pengalaman', 'experiences.manage'], ['educations', 'Pendidikan', 'educations.manage'], ['certificates', 'Sertifikat', 'certificates.manage'], ['services', 'Layanan', 'services.manage'], ['testimonials', 'Testimoni', 'testimonials.manage'], ['messages', 'Pesan', 'messages.view'], ['media', 'Media', 'media.manage'], ['social_links', 'Tautan sosial', 'social_links.manage'], ['settings', 'Pengaturan situs', 'settings.view'], ['profile', 'Profil portfolio', 'users.update'], ['users', 'Pengguna', 'users.view'], ['roles', 'Peran', 'roles.view'], ['permissions', 'Permission', 'permissions.view'], ['security', 'Keamanan', 'security.view'], ['login_history', 'Riwayat login', 'login_history.view']
  ].filter(item => item[0] === 'dashboard' ? hasPermission(context, item[2]) : hasPermission(context, item[2]))
  document.body.innerHTML = `<div class="admin-app"><aside class="admin-sidebar"><a class="admin-brand" href="/admin"><span class="admin-brand-mark">B</span><span><strong>bworiey</strong><small>Control room</small></span></a><nav class="admin-nav" aria-label="Admin navigation">${menu.map(([key, label]) => `<a class="${route.name === key ? 'is-active' : ''}" href="/admin${key === 'dashboard' ? '' : `/${key}`}" data-admin-nav="${key}">${escapeHtml(label)}<span>↗</span></a>`).join('')}</nav><button class="admin-logout-link" id="admin-logout" type="button">Keluar</button></aside><main class="admin-main"><header class="admin-topbar"><span>${formatDate(new Date())}</span><a href="/" target="_blank" rel="noopener">Lihat portfolio ↗</a></header><div id="admin-content"></div></main></div>`
  document.querySelector('#admin-logout').addEventListener('click', async () => { setBusy(document.querySelector('#admin-logout'), true, 'Keluar...'); await signOut(); window.location.replace('/login') })
}

async function renderDashboard(context) {
  const content = document.querySelector('#admin-content')
  content.innerHTML = `<div class="admin-page-heading"><div><p>{ Ikhtisar }</p><h1>Terus <em>bergerak.</em></h1><span>Data dashboard dibaca langsung dari Supabase.</span></div></div><div class="admin-stat-grid" id="admin-stats"><article class="admin-card">Memuat statistik...</article></div><div class="admin-two-column"><section class="admin-card"><div class="admin-section-heading"><div><p>Jejak aktivitas</p><h2>Aktivitas terbaru</h2></div></div><div id="admin-activity">Memuat...</div></section><section class="admin-card"><div class="admin-section-heading"><div><p>Autentikasi</p><h2>Login terbaru</h2></div></div><div id="admin-logins">Memuat...</div></section></div>`
  const count = async (table, filter = null) => { let query = supabase.from(table).select('*', { count: 'exact', head: true }); if (filter) query = filter(query); const { count: total, error } = await query; return error ? null : total ?? 0 }
  const [projects, articles, skills, experiences, educations, certificates, services, testimonials, unread, users, media] = await Promise.all([
    count('projects'), count('articles'), count('skills'), count('experiences'), count('educations'), count('certificates'), count('services'), count('testimonials'), count('contact_messages', query => query.eq('status', 'unread')), count('profiles', query => query.eq('is_active', true)), count('media_assets')
  ])
  document.querySelector('#admin-stats').innerHTML = [['Proyek', projects], ['Artikel', articles], ['Keahlian', skills], ['Pengalaman', experiences], ['Pendidikan', educations], ['Sertifikat', certificates], ['Layanan', services], ['Testimoni', testimonials], ['Pesan belum dibaca', unread], ['Pengguna aktif', users], ['Aset media', media]].map(([label, value]) => `<article class="admin-stat-card"><p>${label}</p><strong>${value === null ? '—' : value}</strong><span>Supabase</span></article>`).join('')
  const activity = document.querySelector('#admin-activity'); const logins = document.querySelector('#admin-logins')
  if (hasPermission(context, 'security.view')) { const { data } = await supabase.from('audit_logs').select('action, table_name, created_at').order('created_at', { ascending: false }).limit(6); activity.innerHTML = data?.length ? data.map(item => `<p class="admin-list-row"><span>${escapeHtml(item.action)} · ${escapeHtml(item.table_name)}</span><small>${formatDate(item.created_at)}</small></p>`).join('') : '<p class="admin-empty">Belum ada aktivitas.</p>' } else activity.innerHTML = '<p class="admin-empty">Tidak ada permission security.view.</p>'
  if (hasPermission(context, 'login_history.view')) { const { data } = await supabase.from('login_history').select('email, was_successful, created_at').order('created_at', { ascending: false }).limit(6); logins.innerHTML = data?.length ? data.map(item => `<p class="admin-list-row"><span class="${item.was_successful ? 'is-success' : 'is-failure'}">${item.was_successful ? 'Berhasil' : 'Gagal'} · ${escapeHtml(item.email || '-')}</span><small>${formatDate(item.created_at)}</small></p>`).join('') : '<p class="admin-empty">Belum ada login.</p>' } else logins.innerHTML = '<p class="admin-empty">Tidak ada permission login_history.view.</p>'
}

async function renderModule(key, context) {
  if (key === 'messages') return renderMessages(context)
  if (key === 'media') return renderMedia(context)
  if (key === 'users') return renderUsers(context)
  if (key === 'profile') return renderPortfolioProfile(context)
  if (key === 'settings') return renderSettings(context)
  if (key === 'permissions' || key === 'security' || key === 'login_history') return renderReadOnlyModule(key)
  const config = ADMIN_MODULES[key]
  const fields = contentFields[key] || []
  const canManage = Boolean(config.manage && hasPermission(context, config.manage))
  const content = document.querySelector('#admin-content')
  content.innerHTML = `<div class="admin-page-heading"><div><p>{ ${escapeHtml(config.label)} }</p><h1>${escapeHtml(config.label)}.</h1><span>Kelola data ${escapeHtml(config.label.toLowerCase())} dengan status dan audit trail.</span></div>${canManage ? '<button class="admin-primary-button" data-action="new">Tambah</button>' : ''}</div><div id="module-form"></div><section class="admin-card"><div class="admin-section-heading"><div><p>Database</p><h2>Daftar ${escapeHtml(config.label)}</h2></div><input class="admin-search" data-search placeholder="Cari..."></div><div id="module-status">Memuat...</div><div id="module-list"></div></section>`
  const formContainer = document.querySelector('#module-form'); const list = document.querySelector('#module-list'); const status = document.querySelector('#module-status'); const statusFilter = document.createElement('select'); statusFilter.className = 'admin-search'; statusFilter.dataset.statusFilter = ''; statusFilter.innerHTML = '<option value="all">Semua status</option><option value="draft">Draft</option><option value="published">Dipublikasikan</option><option value="archived">Diarsipkan</option>'; document.querySelector('[data-search]')?.after(statusFilter); let rows = []
  const load = async () => { status.textContent = 'Memuat data...'; try { rows = key === 'educations' ? await getAdminEducations() : (await supabase.from(config.table).select('*').order('created_at', { ascending: false }).limit(100)).data ?? []; status.textContent = `${rows.length} data`; renderRows() } catch (loadError) { status.innerHTML = `<span class="admin-form-error">Tidak dapat memuat data. Periksa policy RLS.</span>`; console.error('Admin module load failed:', { code: loadError?.code || null, message: loadError?.message || 'Unknown error', details: loadError?.details || null, hint: loadError?.hint || null }) } }
  const renderRows = () => { const term = document.querySelector('[data-search]').value.toLowerCase(); const filtered = rows.filter(row => JSON.stringify(row).toLowerCase().includes(term) && (statusFilter.value === 'all' || row.status === statusFilter.value)); list.innerHTML = filtered.length ? filtered.map(row => renderGenericRow(key, row, canManage)).join('') : '<p class="admin-empty">Belum ada data.</p>' }
  const openForm = row => { formContainer.innerHTML = renderGenericForm(key, row, fields, canManage); bindImageUploaders(formContainer); formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' }); const form = formContainer.querySelector('form'); form.addEventListener('submit', event => saveGeneric(event, key, row, context, load, formContainer)); form.querySelector('[data-cancel-form]')?.addEventListener('click', () => { formContainer.innerHTML = '' }) }
  document.querySelector('[data-action="new"]')?.addEventListener('click', () => openForm(null))
  document.querySelector('[data-search]').addEventListener('input', renderRows)
  statusFilter.addEventListener('change', renderRows)
  list.addEventListener('click', event => { const button = event.target.closest('[data-edit]'); if (button) { const row = rows.find(item => item.id === button.dataset.edit); if (row) openForm(row) } const remove = event.target.closest('[data-delete]'); if (remove) { if (key === 'educations') deleteEducation(remove.dataset.delete).then(load).catch(error => showToast(error.message || 'Pendidikan tidak dapat dihapus.', 'error')); else deleteRecord(config.table, remove.dataset.delete, context, load, key) } })
  await load()
}

async function renderPortfolioProfile(context) {
  const content = document.querySelector('#admin-content')
  content.innerHTML = `<div class="admin-page-heading"><div><p>{ Public identity }</p><h1>Portfolio profile.</h1><span>Profil ini dipakai oleh homepage publik dan dapat diubah tanpa menyentuh HTML.</span></div></div><section id="portfolio-profile-form" class="admin-card">Memuat...</section>`
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

function renderGenericForm(key, row, fields, canManage) {
  return `<section class="admin-card admin-form-card"><div class="admin-section-heading"><div><p>${row ? 'Edit' : 'Create'}</p><h2>${row ? 'Perbarui' : 'Tambah'} ${escapeHtml(ADMIN_MODULES[key].label)}</h2></div></div><form data-generic-form><div class="admin-form-grid">${fields.map(([name, label, type, required, pathName, folder]) => renderField(name, label, type, row?.[name], required, pathName, folder)).join('')}</div><div class="admin-form-actions"><button type="submit" class="admin-primary-button" ${canManage ? '' : 'disabled'}>Simpan</button><button type="button" class="admin-secondary-button" data-cancel-form>Batal</button></div><p class="admin-form-error" data-form-error role="alert"></p></form></section>`
}

function renderField(name, label, type, value, required, pathName, folder) {
  if (type === 'image') return renderImageUploader({ name, label, existingUrl: value, required })
  if (type === 'boolean') return `<label class="admin-checkbox"><input type="checkbox" name="${name}" ${value ? 'checked' : ''}><span>${escapeHtml(label)}</span></label>`
  if (type === 'status') return `<label class="admin-field"><span>${escapeHtml(label)}</span><select name="${name}" ${required ? 'required' : ''}><option value="draft" ${value === 'draft' || !value ? 'selected' : ''}>Draft</option><option value="published" ${value === 'published' ? 'selected' : ''}>Dipublikasikan</option><option value="archived" ${value === 'archived' ? 'selected' : ''}>Diarsipkan</option></select></label>`
  const input = type === 'textarea' ? `<textarea name="${name}" rows="4" ${required ? 'required' : ''}>${escapeHtml(value)}</textarea>` : `<input name="${name}" type="${type}" value="${escapeHtml(value)}" ${required ? 'required' : ''}>`
  return `<label class="admin-field"><span>${escapeHtml(label)}</span>${input}</label>`
}

async function saveGeneric(event, key, row, context, reload, formContainer) {
  event.preventDefault(); const form = event.currentTarget; const button = form.querySelector('button[type="submit"]'); if (button.disabled) return; const error = form.querySelector('[data-form-error]'); setBusy(button, true); error.textContent = ''
  const payload = {}; for (const [name, , type] of contentFields[key]) if (type !== 'image') payload[name] = getValue(form, name, type === 'boolean' ? 'boolean' : type === 'number' ? 'number' : 'text')
  if ((key === 'projects' || key === 'articles' || key === 'services') && !payload.slug) payload.slug = slugify(payload.title)
  if (!['roles', 'permissions'].includes(key)) {
    if (!row) payload.created_by = context.user.id
    payload.updated_by = context.user.id
  }
  let saveError = null
  let imageChanges = []
  try {
    imageChanges = await prepareImageUploads(form, contentFields[key], payload, row, context.user.id)
    if (key === 'educations') {
      if (payload.is_current) payload.end_date = null
      if (payload.status === 'published') payload.published_at = new Date().toISOString()
      const saved = row ? updateEducation(row.id, payload) : createEducation(payload)
      await saved
    } else {
      const request = row ? supabase.from(ADMIN_MODULES[key].table).update(payload).eq('id', row.id) : supabase.from(ADMIN_MODULES[key].table).insert(payload)
      const result = await request
      saveError = result.error
    }
    if (!saveError) await cleanupReplacedImages(imageChanges)
  } catch (error) {
    saveError = error
    await cleanupNewImages(imageChanges)
  }
  setBusy(button, false, 'Simpan')
  if (saveError) { console.error(saveError); error.textContent = saveError.code === '42501' ? 'Operasi ditolak oleh permission/RLS.' : 'Data belum tersimpan. Periksa field dan coba lagi.'; return }
  showToast('Data berhasil disimpan.'); formContainer.innerHTML = ''; await reload()
}

async function prepareImageUploads(form, fields, payload, row, userId) {
  const changes = []
  for (const [name, , type, , pathName, folder] of fields) {
    if (type !== 'image') continue
    const input = form.elements[name]
    const uploader = input?.closest('[data-image-uploader]')
    const file = input?.files?.[0]
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
  const load = async () => { const { data, error } = await supabase.from('site_settings').select('*').order('group_name').order('key'); if (error) { list.innerHTML = '<span class="admin-form-error">Settings tidak dapat dimuat.</span>'; return } rows = data ?? []; renderRows() }
  const openForm = row => { formContainer.innerHTML = `<section class="admin-card admin-form-card"><form id="settings-edit-form"><div class="admin-form-grid"><label class="admin-field"><span>Key</span><input name="key" value="${escapeHtml(row?.key)}" required ${row ? 'readonly' : ''}></label><label class="admin-field"><span>Group</span><input name="group_name" value="${escapeHtml(row?.group_name || 'general')}" required></label><label class="admin-field admin-field-wide"><span>Value (JSON atau teks)</span><textarea name="value" rows="4">${escapeHtml(parseSettingValue(row?.value))}</textarea></label><label class="admin-checkbox"><input type="checkbox" name="is_public" ${row?.is_public !== false ? 'checked' : ''}><span>Public setting</span></label></div><div class="admin-form-actions"><button class="admin-primary-button" type="submit">Simpan</button><button class="admin-secondary-button" type="button" data-setting-cancel>Batal</button></div><p class="admin-form-error" data-setting-error></p></form></section>`; formContainer.querySelector('form').addEventListener('submit', async event => { event.preventDefault(); const form = event.currentTarget; const button = form.querySelector('button[type="submit"]'); const error = form.querySelector('[data-setting-error]'); let value = form.elements.value.value; try { value = JSON.parse(value) } catch {} setBusy(button, true); const payload = { key: form.elements.key.value.trim(), group_name: form.elements.group_name.value.trim(), value, is_public: form.elements.is_public.checked, updated_by: context.user.id }; const request = row ? supabase.from('site_settings').update(payload).eq('id', row.id) : supabase.from('site_settings').insert(payload); const { error: saveError } = await request; setBusy(button, false, 'Simpan'); if (saveError) { error.textContent = 'Setting belum tersimpan. Periksa key unik dan permission.'; return } formContainer.innerHTML = ''; showToast('Setting berhasil disimpan.'); await load() }) }
  document.querySelector('[data-setting-new]')?.addEventListener('click', () => openForm(null)); document.querySelector('[data-setting-search]').addEventListener('input', renderRows); list.addEventListener('click', async event => { const edit = event.target.closest('[data-setting-edit]'); if (edit) openForm(rows.find(row => row.id === edit.dataset.settingEdit)); const remove = event.target.closest('[data-setting-delete]'); if (remove && window.confirm('Hapus setting ini?')) { const { error } = await supabase.from('site_settings').delete().eq('id', remove.dataset.settingDelete); if (error) showToast('Setting tidak dapat dihapus.', 'error'); else { showToast('Setting dihapus.'); await load() } } }); await load()
}

function renderHeroSettingValue(key, value) {
  if (key === 'professional_titles') {
    let parsed = value
    if (typeof parsed === 'string') {
      try { parsed = JSON.parse(parsed) } catch { parsed = parsed.split(/\r?\n/) }
    }
    return Array.isArray(parsed) ? parsed.filter(Boolean).join('\n') : ''
  }
  return parseSettingValue(value)
}

async function renderHeroSettings(context) {
  if (!hasPermission(context, 'settings.update')) return
  const content = document.querySelector('#admin-content')
  if (!content) return
  content.insertAdjacentHTML('afterbegin', '<section class="admin-card admin-form-card"><div class="admin-section-heading"><div><p>Homepage · Section 1</p><h2>Hero content</h2><span>Konten ini tampil di bagian paling atas portfolio publik.</span></div></div><form id="hero-settings-form"><p>Memuat konten hero...</p></form></section>')
  const form = document.querySelector('#hero-settings-form')
  if (!form) return

  const keys = heroSettingFields.map(field => field[0])
  const result = await supabase.from('site_settings').select('key,value').in('key', keys)
  if (result.error) {
    form.innerHTML = '<p class="admin-form-error">Konten hero tidak dapat dimuat. Periksa permission settings.view.</p>'
    return
  }

  const currentValues = new Map((result.data || []).map(row => [row.key, row.value]))
  form.innerHTML = '<div class="admin-form-grid">' + heroSettingFields.map(([key, label, type]) => {
    const value = escapeHtml(renderHeroSettingValue(key, currentValues.get(key)))
    if (type === 'textarea' || type === 'titles') {
      const hint = type === 'titles' ? '<small class="admin-field-help">Satu jabatan per baris, misalnya Full Stack Developer.</small>' : ''
      return '<label class="admin-field admin-field-wide"><span>' + label + '</span><textarea name="' + key + '" rows="' + (type === 'titles' ? '3' : '4') + '" placeholder="' + (type === 'titles' ? 'Full Stack Developer&#10;Creative Developer' : '') + '">' + value + '</textarea>' + hint + '</label>'
    }
    return '<label class="admin-field"><span>' + label + '</span><input name="' + key + '" type="text" value="' + value + '"></label>'
  }).join('') + '</div><div class="admin-form-actions"><button class="admin-primary-button" type="submit">Simpan Section 1</button></div><p class="admin-form-error" data-hero-settings-error></p>'

  form.addEventListener('submit', async event => {
    event.preventDefault()
    const button = form.querySelector('button[type="submit"]')
    const errorElement = form.querySelector('[data-hero-settings-error]')
    const payload = heroSettingFields.map(([key]) => {
      const rawValue = form.elements[key].value.trim()
      const value = key === 'professional_titles'
        ? rawValue.split(/\r?\n/).map(item => item.trim()).filter(Boolean)
        : rawValue
      return { key, group_name: 'identity', value, is_public: true, updated_by: context.user.id }
    })

    errorElement.textContent = ''
    setBusy(button, true)
    const saveResult = await supabase.from('site_settings').upsert(payload, { onConflict: 'key' })
    setBusy(button, false, 'Simpan Section 1')
    if (saveResult.error) {
      console.error('Hero settings save error:', saveResult.error)
      errorElement.textContent = 'Section 1 belum tersimpan. Periksa permission dan struktur tabel site_settings.'
      return
    }
    showToast('Konten Section 1 berhasil diperbarui.')
  })
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
    let result = await supabase.from('site_settings').select('id,key,value,asset_url,asset_path,hero_image_url,hero_image_path,logo_url,logo_path,favicon_url,favicon_path,og_image_url,og_image_path').in('key', assetFields.map(field => field[0]))
    if (result.error?.code === '42703') result = await supabase.from('site_settings').select('id,key,value,asset_url,asset_path').in('key', assetFields.map(field => field[0]))
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
        const { error } = await supabase.from('site_settings').upsert({ key, group_name: 'assets', value: uploaded.publicUrl, [urlName]: uploaded.publicUrl, [pathName]: uploaded.path, asset_url: uploaded.publicUrl, asset_path: uploaded.path, is_public: true, updated_by: context.user.id }, { onConflict: 'key' })
        if (error) throw error
        uploadedImages[uploadedImages.length - 1].saved = true
        assetRows.set(key, { asset_url: uploaded.publicUrl, asset_path: uploaded.path, [urlName]: uploaded.publicUrl, [pathName]: uploaded.path, value: uploaded.publicUrl })
      }
      await Promise.all(uploadedImages.filter(item => item.oldPath && item.oldPath !== item.uploaded.path).map(item => deletePublicImage(item.oldPath)))
      showToast('Gambar situs diperbarui.')
      await load()
    } catch (saveError) {
      for (const item of uploadedImages.filter(entry => entry.saved)) {
        if (item.oldRow) await supabase.from('site_settings').update({ value: item.oldRow.value, [item.urlName]: item.oldRow[item.urlName] || null, [item.pathName]: item.oldRow[item.pathName] || null, asset_url: item.oldRow.asset_url || null, asset_path: item.oldRow.asset_path || null }).eq('key', item.key)
        else await supabase.from('site_settings').delete().eq('key', item.key)
      }
      await cleanupNewImages(uploadedImages.map(item => ({ newPath: item.uploaded.path })))
      errorElement.textContent = saveError.message || 'Gambar situs belum tersimpan.'
    } finally {
      setBusy(button, false, 'Simpan gambar situs')
    }
  })
  load()
}

function renderGenericRow(key, row, canManage) {
  const title = row.title || row.name || row.company || row.institution || row.author_name || row.label || row.key || 'Tanpa judul'
  const secondary = row.summary || row.description || row.role_title || row.email || row.group_name || row.url || ''
  return `<article class="admin-list-card"><div><p class="admin-list-kicker">${escapeHtml(row.status || (row.is_active === false ? 'inactive' : 'active'))}</p><h3>${escapeHtml(title)}</h3><p>${escapeHtml(String(secondary).slice(0, 180))}</p></div>${canManage ? `<div class="admin-row-actions"><button class="admin-secondary-button" data-edit="${row.id}">Edit</button><button class="admin-danger-button" data-delete="${row.id}">Hapus</button></div>` : ''}</article>`
}

async function deleteRecord(table, id, context, reload, key = '') {
  if (!window.confirm('Hapus data ini?')) return
  const existing = key ? (await supabase.from(table).select('*').eq('id', id).maybeSingle()).data : null
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) { console.error(error); showToast('Data tidak dapat dihapus oleh policy/RLS.', 'error'); return }
  const imagePaths = (contentFields[key] || []).filter(field => field[2] === 'image').map(field => existing?.[field[4]]).filter(Boolean)
  await Promise.all(imagePaths.map(path => deletePublicImage(path)))
  showToast('Data dihapus.'); await reload()
}

async function renderMessages(context) {
  const content = document.querySelector('#admin-content'); const canUpdate = hasPermission(context, 'messages.update'); const canDelete = hasPermission(context, 'messages.delete')
  content.innerHTML = `<div class="admin-page-heading"><div><p>{ Inbox }</p><h1>Messages.</h1><span>Pesan dari form kontak publik.</span></div></div><section class="admin-card"><div id="module-status">Memuat...</div><div id="module-list"></div></section>`
  const list = document.querySelector('#module-list'); const status = document.querySelector('#module-status'); const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(100)
  if (error) { status.innerHTML = '<span class="admin-form-error">Pesan tidak dapat dimuat. Periksa permission messages.view.</span>'; return }
  status.textContent = `${data?.length ?? 0} pesan`; list.innerHTML = data?.length ? data.map(message => `<article class="admin-list-card"><div><p class="admin-list-kicker">${escapeHtml(message.status)} · ${formatDate(message.created_at)}</p><h3>${escapeHtml(message.name)} <small>${escapeHtml(message.email)}</small></h3><p>${escapeHtml(message.message)}</p></div><div class="admin-row-actions">${canUpdate ? `<select data-message-status="${message.id}"><option value="unread" ${message.status === 'unread' ? 'selected' : ''}>Unread</option><option value="read" ${message.status === 'read' ? 'selected' : ''}>Read</option><option value="archived" ${message.status === 'archived' ? 'selected' : ''}>Archived</option></select>` : ''}${canDelete ? `<button class="admin-danger-button" data-message-delete="${message.id}">Hapus</button>` : ''}</div></article>`).join('') : '<p class="admin-empty">Belum ada pesan.</p>'
  list.addEventListener('change', async event => { const select = event.target.closest('[data-message-status]'); if (!select) return; const { error: updateError } = await supabase.from('contact_messages').update({ status: select.value, updated_at: new Date().toISOString() }).eq('id', select.dataset.messageStatus); if (updateError) showToast('Status pesan tidak dapat diubah.', 'error'); else showToast('Status pesan diperbarui.') })
  list.addEventListener('click', async event => { const button = event.target.closest('[data-message-delete]'); if (!button || !window.confirm('Hapus pesan ini?')) return; const { error: deleteError } = await supabase.from('contact_messages').delete().eq('id', button.dataset.messageDelete); if (deleteError) showToast('Pesan tidak dapat dihapus.', 'error'); else { button.closest('.admin-list-card').remove(); showToast('Pesan dihapus.') } })
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

function renderAccessDenied(message = 'Akunmu tidak memiliki permission untuk halaman ini.') { document.body.innerHTML = `<main class="admin-auth-page"><section class="admin-auth-card"><p class="admin-auth-eyebrow">403</p><h1>Akses ditolak.</h1><p>${escapeHtml(message)}</p><a class="admin-primary-button admin-button-link" href="/admin">Kembali ke dashboard</a></section></main>` }
function renderConfigurationError(message = 'Supabase belum dikonfigurasi.') { document.body.innerHTML = `<main class="admin-auth-page"><section class="admin-auth-card"><p class="admin-auth-eyebrow">Configuration</p><h1>Konfigurasi belum siap.</h1><p>${escapeHtml(message)}</p><a class="admin-back-link" href="/">Kembali ke portfolio</a></section></main>` }
function renderNotFound() { document.body.innerHTML = `<main class="admin-auth-page"><section class="admin-auth-card"><p class="admin-auth-eyebrow">404</p><h1>Halaman tidak ditemukan.</h1><a class="admin-primary-button admin-button-link" href="/">Kembali</a></section></main>` }
function translateAuthError(message = '') { const value = message.toLowerCase(); if (value.includes('invalid login credentials')) return 'Email atau password salah.'; if (value.includes('email not confirmed')) return 'Email belum dikonfirmasi.'; if (value.includes('too many requests')) return 'Terlalu banyak percobaan. Coba lagi nanti.'; return 'Login belum berhasil. Periksa data dan coba lagi.' }
