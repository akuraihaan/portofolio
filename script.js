import { getRoute } from './js/router.js'
import { initializeAdminRoute } from './js/admin.js'
import { initializePublic } from './js/public.js'
import { subscribeToAuthChanges } from './js/auth.js'

const route = getRoute()

subscribeToAuthChanges((event) => {
  if (event === 'SIGNED_OUT' && route.path.startsWith('/admin')) {
    window.location.replace('/login')
  }
})

if (route.name === 'home') {
  initializePublic()
} else if (route.name === 'notFound') {
  document.body.innerHTML = '<main class="admin-auth-page"><section class="admin-auth-card"><p class="admin-auth-eyebrow">404</p><h1>Halaman tidak ditemukan.</h1><a class="admin-primary-button admin-button-link" href="/">Kembali ke portfolio</a></section></main>'
} else {
  initializeAdminRoute(route)
}
