import { getRoute } from './js/router.js?v=20260904-3'
import { initializeAdminRoute } from './js/admin.js?v=20260904-3'
import { initializePublic } from './js/public.js?v=20260904-3'
import { initializeProjects } from './js/projects.js?v=20260904-3'
import { initializeProjectDetail } from './js/project-detail.js?v=20260904-3'
import { initializePortfolioBuilder } from './js/portfolio-builder.js?v=20260904-3'
import { initializePublicPortfolioVersion } from './js/public-portfolio.js?v=20260904-3'
import { subscribeToAuthChanges } from './js/auth.js'

const route = getRoute()

subscribeToAuthChanges((event) => {
  if (event === 'SIGNED_OUT' && route.path.startsWith('/admin')) {
    window.location.replace('/login')
  }
})

if (route.path === '/admin' || route.path.startsWith('/admin/')) {
  void initializeAdminRoute(route).catch(error => {
    console.error('Route initialization failed:', {
      code: error?.code || null,
      message: error?.message || 'Unknown route initialization error',
      details: error?.details || null,
      hint: error?.hint || null
    })
    window.location.replace('/login')
  })
} else if (route.name === 'home') {
  initializePublic()
} else if (route.name === 'projects') {
  void initializeProjects()
} else if (route.name === 'projectDetail') {
  void initializeProjectDetail(route.slug)
} else if (route.name === 'portfolioBuilder') {
  void initializePortfolioBuilder()
} else if (route.name === 'portfolioVersion') {
  void initializePublicPortfolioVersion(route.slug)
} else if (route.name === 'notFound') {
  document.body.innerHTML = '<main class="admin-auth-page"><section class="admin-auth-card"><p class="admin-auth-eyebrow">404</p><h1>Halaman tidak ditemukan.</h1><a class="admin-primary-button admin-button-link" href="/">Kembali ke portfolio</a></section></main>'
} else {
  void initializeAdminRoute(route).catch(error => {
    console.error('Route initialization failed:', {
      code: error?.code || null,
      message: error?.message || 'Unknown route initialization error',
      details: error?.details || null,
      hint: error?.hint || null
    })
  })
}
