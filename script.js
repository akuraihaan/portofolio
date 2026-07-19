import { supabase } from './supabase.js'

const root = document.documentElement
const reduceMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

const currentPath = window.location.pathname
const isAdminPath =
  currentPath === '/admin' ||
  currentPath === '/admin/' ||
  currentPath.startsWith('/admin/')

/* =========================================================
   ADMIN
========================================================= */

async function initializeAdmin() {
  renderAdminLoading()

  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession()

  if (sessionError) {
    console.error('Gagal membaca sesi Supabase:', sessionError)
    renderAdminLogin('Gagal membaca sesi. Silakan masuk kembali.')
    return
  }

  if (!session?.user) {
    renderAdminLogin()
    return
  }

  const profile = await getAdminProfile(session.user.id)

  if (!profile) {
    await supabase.auth.signOut()
    renderAdminLogin('Akun tidak memiliki akses admin.')
    return
  }

  renderAdminDashboard(profile, session.user)
}

async function getAdminProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, is_active')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    console.error('Gagal membaca profil admin:', error)
    return null
  }

  const allowedRoles = ['admin', 'super_admin']

  if (
    !data ||
    data.is_active !== true ||
    !allowedRoles.includes(data.role)
  ) {
    return null
  }

  return data
}

function renderAdminLoading() {
  document.body.innerHTML = `
    <main class="admin-auth-page">
      <section class="admin-auth-card">
        <p>Memeriksa sesi admin...</p>
      </section>
    </main>
  `
}

function renderAdminLogin(message = '') {
  document.title = 'Admin Login'

  document.body.innerHTML = `
    <main class="admin-auth-page">
      <section class="admin-auth-card">
        <div class="admin-auth-header">
          <p class="admin-auth-eyebrow">Portfolio CMS</p>
          <h1>Masuk sebagai Admin</h1>
          <p>Gunakan akun yang terdaftar pada Supabase Authentication.</p>
        </div>

        ${
          message
            ? `<div class="admin-auth-alert" role="alert">${escapeHtml(
                message
              )}</div>`
            : ''
        }

        <form id="admin-login-form" novalidate>
          <label class="admin-field">
            <span>Email</span>
            <input
              id="admin-email"
              name="email"
              type="email"
              autocomplete="email"
              placeholder="admin@email.com"
              required
            >
          </label>

          <label class="admin-field">
            <span>Password</span>
            <input
              id="admin-password"
              name="password"
              type="password"
              autocomplete="current-password"
              placeholder="Masukkan password"
              required
            >
          </label>

          <button id="admin-login-button" type="submit">
            Masuk
          </button>

          <p id="admin-login-error" class="admin-form-error" role="alert"></p>
        </form>

        <a class="admin-back-link" href="/">
          Kembali ke portfolio
        </a>
      </section>
    </main>
  `

  const form = document.querySelector('#admin-login-form')
  const button = document.querySelector('#admin-login-button')
  const errorElement = document.querySelector('#admin-login-error')

  form?.addEventListener('submit', async event => {
    event.preventDefault()

    errorElement.textContent = ''

    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    const email = document
      .querySelector('#admin-email')
      .value.trim()

    const password = document.querySelector(
      '#admin-password'
    ).value

    button.disabled = true
    button.textContent = 'Memproses...'

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password
        })

      if (error) {
        throw new Error(translateAuthError(error.message))
      }

      if (!data.user) {
        throw new Error('Data pengguna tidak ditemukan.')
      }

      const profile = await getAdminProfile(data.user.id)

      if (!profile) {
        await supabase.auth.signOut()
        throw new Error(
          'Akun ini tidak memiliki akses ke panel admin.'
        )
      }

      window.location.replace('/admin')
    } catch (error) {
      console.error('Login admin gagal:', error)
      errorElement.textContent =
        error.message || 'Login gagal. Silakan coba lagi.'
    } finally {
      button.disabled = false
      button.textContent = 'Masuk'
    }
  })
}

function renderAdminDashboard(profile, user) {
  document.title = 'Admin Dashboard'

  document.body.innerHTML = `
    <main class="admin-dashboard">
      <header class="admin-dashboard-header">
        <div>
          <p class="admin-dashboard-eyebrow">Portfolio CMS</p>
          <h1>Dashboard Admin</h1>
          <p>
            Selamat datang,
            ${escapeHtml(profile.full_name || user.email || 'Admin')}.
          </p>
        </div>

        <div class="admin-dashboard-actions">
          <a href="/" target="_blank" rel="noopener">
            Lihat portfolio
          </a>

          <button id="admin-logout-button" type="button">
            Keluar
          </button>
        </div>
      </header>

      <section class="admin-dashboard-grid">
        <article class="admin-dashboard-card">
          <p>Status akun</p>
          <h2>Aktif</h2>
          <span>${escapeHtml(profile.role)}</span>
        </article>

        <article class="admin-dashboard-card">
          <p>Email</p>
          <h2>${escapeHtml(user.email || '-')}</h2>
          <span>Supabase Authentication</span>
        </article>

        <article class="admin-dashboard-card">
          <p>Database</p>
          <h2>Terhubung</h2>
          <span>Supabase</span>
        </article>
      </section>

      <section class="admin-content-section">
        <div class="admin-section-header">
          <div>
            <p>Konten</p>
            <h2>Daftar Proyek</h2>
          </div>

          <button id="admin-refresh-projects" type="button">
            Muat ulang
          </button>
        </div>

        <div id="admin-project-status">
          Memuat data proyek...
        </div>

        <div id="admin-project-list"></div>
      </section>
    </main>
  `

  document
    .querySelector('#admin-logout-button')
    ?.addEventListener('click', handleAdminLogout)

  document
    .querySelector('#admin-refresh-projects')
    ?.addEventListener('click', loadAdminProjects)

  loadAdminProjects()
}

async function handleAdminLogout() {
  const button = document.querySelector('#admin-logout-button')

  if (button) {
    button.disabled = true
    button.textContent = 'Keluar...'
  }

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Logout gagal:', error)

    if (button) {
      button.disabled = false
      button.textContent = 'Keluar'
    }

    return
  }

  window.location.replace('/admin')
}

async function loadAdminProjects() {
  const statusElement = document.querySelector(
    '#admin-project-status'
  )

  const listElement = document.querySelector(
    '#admin-project-list'
  )

  if (!statusElement || !listElement) return

  statusElement.textContent = 'Memuat data proyek...'
  listElement.innerHTML = ''

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Gagal membaca proyek:', error)
    statusElement.textContent =
      `Gagal memuat proyek: ${error.message}`
    return
  }

  if (!data?.length) {
    statusElement.textContent =
      'Belum ada proyek pada database Supabase.'
    return
  }

  statusElement.textContent =
    `${data.length} proyek ditemukan.`

  listElement.innerHTML = data
    .map(project => {
      const title =
        project.title ||
        project.name ||
        'Proyek tanpa judul'

      const status = project.status || 'draft'

      const description =
        project.summary ||
        project.description ||
        'Tidak ada deskripsi.'

      return `
        <article class="admin-project-item">
          <div>
            <span class="admin-project-status">
              ${escapeHtml(status)}
            </span>

            <h3>${escapeHtml(title)}</h3>

            <p>${escapeHtml(description)}</p>
          </div>

          <div class="admin-project-meta">
            <span>
              ${formatDate(project.created_at)}
            </span>
          </div>
        </article>
      `
    })
    .join('')
}

function translateAuthError(message) {
  const normalizedMessage = message.toLowerCase()

  if (normalizedMessage.includes('invalid login credentials')) {
    return 'Email atau password salah.'
  }

  if (normalizedMessage.includes('email not confirmed')) {
    return 'Email belum dikonfirmasi.'
  }

  if (normalizedMessage.includes('too many requests')) {
    return 'Terlalu banyak percobaan. Coba lagi nanti.'
  }

  return message
}

/* =========================================================
   PORTFOLIO PUBLIK
========================================================= */

function initializePortfolio() {
  initializeTheme()
  initializeMobileMenu()
  initializeHeaderScroll()
  initializeRevealAnimations()
  initializeRoleTyping()
  initializeProjectFilters()
  initializeProjectDialog()
  initializeContactForm()
  initializeCopyEmail()
  initializeSmoothScroll()
  initializeYear()
}

function initializeTheme() {
  const themeToggle = document.querySelector(
    '[data-theme-toggle]'
  )

  const savedTheme = localStorage.getItem('portfolio-theme')

  if (savedTheme === 'light') {
    root.dataset.theme = 'light'
  }

  function updateThemeLabel() {
    const isLight = root.dataset.theme === 'light'

    themeToggle?.setAttribute(
      'aria-label',
      isLight
        ? 'Switch to dark mode'
        : 'Switch to light mode'
    )
  }

  updateThemeLabel()

  themeToggle?.addEventListener('click', () => {
    const isLight = root.dataset.theme === 'light'

    root.dataset.theme = isLight ? 'dark' : 'light'

    localStorage.setItem(
      'portfolio-theme',
      isLight ? 'dark' : 'light'
    )

    updateThemeLabel()
  })
}

function initializeMobileMenu() {
  const menuToggle = document.querySelector(
    '[data-menu-toggle]'
  )

  const mobileNav = document.querySelector(
    '[data-mobile-nav]'
  )

  function closeMenu() {
    menuToggle?.classList.remove('is-open')
    mobileNav?.classList.remove('is-open')

    menuToggle?.setAttribute(
      'aria-expanded',
      'false'
    )

    menuToggle?.setAttribute(
      'aria-label',
      'Open menu'
    )
  }

  menuToggle?.addEventListener('click', () => {
    const isOpen = mobileNav?.classList.toggle('is-open')

    menuToggle.classList.toggle(
      'is-open',
      Boolean(isOpen)
    )

    menuToggle.setAttribute(
      'aria-expanded',
      String(Boolean(isOpen))
    )

    menuToggle.setAttribute(
      'aria-label',
      isOpen ? 'Close menu' : 'Open menu'
    )
  })

  mobileNav
    ?.querySelectorAll('a')
    .forEach(link => {
      link.addEventListener('click', closeMenu)
    })
}

function initializeHeaderScroll() {
  const header = document.querySelector('[data-header]')

  const onScroll = () => {
    header?.classList.toggle(
      'is-scrolled',
      window.scrollY > 30
    )
  }

  window.addEventListener('scroll', onScroll, {
    passive: true
  })

  onScroll()
}

function initializeRevealAnimations() {
  const reveals = document.querySelectorAll(
    '[data-reveal]'
  )

  if (
    reduceMotion ||
    !('IntersectionObserver' in window)
  ) {
    reveals.forEach(element => {
      element.classList.add('is-visible')
    })

    return
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return

        const delay =
          entry.target.dataset.revealDelay

        if (delay) {
          entry.target.style.transitionDelay =
            `${delay}ms`
        }

        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    {
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.08
    }
  )

  reveals.forEach(element => {
    revealObserver.observe(element)
  })
}

function initializeRoleTyping() {
  const roleElement = document.querySelector(
    '[data-role]'
  )

  let roles = []

  try {
    roles = roleElement?.dataset.roles
      ? JSON.parse(roleElement.dataset.roles)
      : []
  } catch {
    roles = []
  }

  if (
    !roleElement ||
    !roles.length ||
    reduceMotion
  ) {
    return
  }

  let roleIndex = 0
  let characterIndex = 0
  let deleting = false

  const typeRole = () => {
    const role = roles[roleIndex]

    if (!deleting) {
      characterIndex += 1
      roleElement.textContent = role.slice(
        0,
        characterIndex
      )

      if (characterIndex === role.length) {
        deleting = true

        window.setTimeout(typeRole, 1700)
        return
      }
    } else {
      characterIndex -= 1
      roleElement.textContent = role.slice(
        0,
        characterIndex
      )

      if (characterIndex === 0) {
        deleting = false
        roleIndex =
          (roleIndex + 1) % roles.length
      }
    }

    window.setTimeout(
      typeRole,
      deleting ? 45 : 80
    )
  }

  typeRole()
}

function initializeProjectFilters() {
  const filterButtons =
    document.querySelectorAll('[data-filter]')

  const projectCards =
    document.querySelectorAll('[data-project]')

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter

      filterButtons.forEach(item => {
        const active = item === button

        item.classList.toggle(
          'is-active',
          active
        )

        item.setAttribute(
          'aria-pressed',
          String(active)
        )
      })

      projectCards.forEach(card => {
        const matches =
          filter === 'all' ||
          card.dataset.category === filter

        card.classList.toggle(
          'is-hidden',
          !matches
        )
      })
    })
  })
}

function initializeProjectDialog() {
  const projectCards =
    document.querySelectorAll('[data-project]')

  const dialog = document.querySelector(
    '[data-project-dialog]'
  )

  const dialogTitle = document.querySelector(
    '[data-dialog-title]'
  )

  const dialogType = document.querySelector(
    '[data-dialog-type]'
  )

  const dialogDescription = document.querySelector(
    '[data-dialog-description]'
  )

  const dialogReel = document.querySelector(
    '[data-dialog-reel]'
  )

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      if (!dialog) return

      if (dialogTitle) {
        dialogTitle.textContent =
          card.dataset.title || ''
      }

      if (dialogType) {
        dialogType.textContent =
          card.dataset.type || ''
      }

      if (dialogDescription) {
        dialogDescription.textContent =
          card.dataset.description || ''
      }

      if (dialogReel) {
        dialogReel.textContent =
          card.dataset.reel || ''
      }

      dialog.showModal()
    })
  })

  document
    .querySelector('[data-dialog-close]')
    ?.addEventListener('click', () => {
      dialog?.close()
    })

  document
    .querySelector('[data-dialog-contact]')
    ?.addEventListener('click', () => {
      dialog?.close()
    })

  dialog?.addEventListener('click', event => {
    if (event.target === dialog) {
      dialog.close()
    }
  })
}

function initializeContactForm() {
  const form = document.querySelector(
    '[data-contact-form]'
  )

  const formStatus = document.querySelector(
    '[data-form-status]'
  )

  form?.addEventListener('submit', event => {
    event.preventDefault()

    if (!form.checkValidity()) {
      if (formStatus) {
        formStatus.textContent =
          'Please complete the required fields.'
      }

      form.reportValidity()
      return
    }

    if (formStatus) {
      formStatus.textContent =
        'Thanks. Your note is ready to send.'
    }

    showToast(
      'Message captured locally for this demo.'
    )

    form.reset()
  })
}

function initializeCopyEmail() {
  document
    .querySelector('[data-copy-email]')
    ?.addEventListener('click', async event => {
      const email =
        event.currentTarget.dataset.email

      try {
        await navigator.clipboard.writeText(email)
        showToast('Email copied to clipboard.')
      } catch {
        showToast(email)
      }
    })
}

function initializeSmoothScroll() {
  document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {
      link.addEventListener('click', event => {
        const targetId =
          link.getAttribute('href')

        if (
          !targetId ||
          targetId === '#'
        ) {
          return
        }

        const target =
          document.querySelector(targetId)

        if (!target) return

        event.preventDefault()

        target.scrollIntoView({
          behavior: reduceMotion
            ? 'auto'
            : 'smooth'
        })
      })
    })
}

function initializeYear() {
  const year = document.querySelector('[data-year]')

  if (year) {
    year.textContent =
      new Date().getFullYear()
  }
}

/* =========================================================
   UTILITAS
========================================================= */

let toastTimer

function showToast(message) {
  const toast = document.querySelector('[data-toast]')

  if (!toast) return

  toast.textContent = message
  toast.classList.add('is-visible')

  window.clearTimeout(toastTimer)

  toastTimer = window.setTimeout(() => {
    toast.classList.remove('is-visible')
  }, 2800)
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function formatDate(value) {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

/* =========================================================
   INISIALISASI
========================================================= */

if (isAdminPath) {
  initializeAdmin()
} else {
  initializePortfolio()
}