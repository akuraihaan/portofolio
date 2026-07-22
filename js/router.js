export const ROUTES = {
  home: '/',
  login: '/login',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  admin: '/admin'
}

export const ADMIN_MODULES = {
  projects: { label: 'Proyek', table: 'projects', permission: 'projects.view', manage: 'projects.create' },
  articles: { label: 'Artikel', table: 'articles', permission: 'articles.view', manage: 'articles.create' },
  skills: { label: 'Keahlian', table: 'skills', permission: 'skills.manage', manage: 'skills.manage' },
  experiences: { label: 'Pengalaman', table: 'experiences', permission: 'experiences.manage', manage: 'experiences.manage' },
  educations: { label: 'Pendidikan', table: 'educations', permission: 'educations.manage', manage: 'educations.manage' },
  certificates: { label: 'Sertifikat', table: 'certificates', permission: 'certificates.manage', manage: 'certificates.manage' },
  services: { label: 'Layanan', table: 'services', permission: 'services.manage', manage: 'services.manage' },
  testimonials: { label: 'Testimoni', table: 'testimonials', permission: 'testimonials.manage', manage: 'testimonials.manage' },
  messages: { label: 'Pesan', table: 'contact_messages', permission: 'messages.view', manage: 'messages.update' },
  media: { label: 'Media', table: 'media_assets', permission: 'media.manage', manage: 'media.manage' },
  social_links: { label: 'Tautan sosial', table: 'social_links', permission: 'social_links.manage', manage: 'social_links.manage' },
  settings: { label: 'Pengaturan situs', table: 'site_settings', permission: 'settings.view', manage: 'settings.update' },
  sections: { label: 'Editor section', table: 'page_sections', permission: 'settings.view', manage: 'settings.update' },
  navigation: { label: 'Navigasi', table: 'navigation_items', permission: 'settings.view', manage: 'settings.update' },
  statistics: { label: 'Statistik', table: 'statistics', permission: 'settings.view', manage: 'settings.update' },
  profile: { label: 'Profil portfolio', table: 'profiles', permission: 'users.update', manage: 'users.update' },
  users: { label: 'Pengguna', table: 'profiles', permission: 'users.view', manage: 'users.update' },
  roles: { label: 'Peran', table: 'roles', permission: 'roles.view', manage: 'roles.manage' },
  permissions: { label: 'Permission', table: 'permissions', permission: 'permissions.view', manage: null },
  security: { label: 'Keamanan', table: 'security_events', permission: 'security.view', manage: null },
  login_history: { label: 'Riwayat login', table: 'login_history', permission: 'login_history.view', manage: null }
}

export function normalizePath(path = window.location.pathname) {
  if (path.length > 1) return path.replace(/\/+$/, '')
  return path || '/'
}

export function getRoute(path = window.location.pathname) {
  const normalized = normalizePath(path)
  if (normalized === '/') return { name: 'home', path: normalized }
  if (normalized === '/login') return { name: 'login', path: normalized }
  if (normalized === '/forgot-password') return { name: 'forgotPassword', path: normalized }
  if (normalized === '/reset-password') return { name: 'resetPassword', path: normalized }
  if (normalized === '/admin') return { name: 'dashboard', path: normalized }
  if (normalized === '/admin/sections') return { name: 'sections', path: normalized }
  if (normalized.startsWith('/admin/sections/')) return { name: 'sectionEditor', sectionKey: normalized.slice('/admin/sections/'.length).split('/')[0], path: normalized }
  if (normalized.startsWith('/admin/')) {
    const key = normalized.slice('/admin/'.length).split('/')[0]
    return { name: ADMIN_MODULES[key] ? key : 'notFound', key, path: normalized }
  }
  return { name: 'notFound', path: normalized }
}
