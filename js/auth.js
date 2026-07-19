import { supabase, supabaseConfiguration } from '../supabase.js'

let accessCache = null
let idleTimer = null

export function authReady() {
  return Boolean(supabaseConfiguration.ready && supabase)
}

export async function getCurrentSession() {
  if (!authReady()) return null

  const { data, error } = await supabase.auth.getSession()
  if (error) {
    console.error('Gagal membaca session:', error)
    return null
  }

  return data?.session ?? null
}

export async function getSession() {
  if (!authReady()) return { session: null, error: new Error('Supabase belum dikonfigurasi.') }

  const { data, error } = await supabase.auth.getSession()
  return { session: data?.session ?? null, error }
}

export async function getAccessContext(forceRefresh = false) {
  if (!authReady()) return null
  if (accessCache && !forceRefresh) return accessCache

  const session = await getCurrentSession()
  if (!session?.user) return null

  const userId = session.user.id
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, username, avatar_url, phone, bio, is_active, last_login_at')
    .eq('id', userId)
    .maybeSingle()

  if (profileError) {
    console.error('Gagal membaca profil:', profileError)
    throw new Error('Profil pengguna tidak dapat dibaca.')
  }

  if (!profile || !profile.is_active) {
    throw new Error('Akun belum aktif atau belum memiliki profil.')
  }

  const { data: userRoles, error: userRolesError } = await supabase
    .from('user_roles')
    .select('role_id')
    .eq('user_id', userId)

  if (userRolesError) {
    console.error('Gagal membaca user role:', userRolesError)
    throw new Error('Role pengguna tidak dapat dibaca.')
  }

  const roleIds = [...new Set((userRoles ?? []).map(row => row.role_id).filter(Boolean))]
  if (!roleIds.length) throw new Error('Akun belum memiliki role.')

  const { data: roles, error: rolesError } = await supabase
    .from('roles')
    .select('id, name, label, is_system')
    .in('id', roleIds)

  if (rolesError) {
    console.error('Gagal membaca role:', rolesError)
    throw new Error('Data role tidak dapat dibaca.')
  }

  const { data: rolePermissions, error: rolePermissionsError } = await supabase
    .from('role_permissions')
    .select('permission_id')
    .in('role_id', roleIds)

  if (rolePermissionsError) {
    console.error('Gagal membaca role permission:', rolePermissionsError)
    throw new Error('Hubungan role dan permission tidak dapat dibaca.')
  }

  const permissionIds = [...new Set((rolePermissions ?? []).map(row => row.permission_id).filter(Boolean))]
  let permissionRows = []

  if (permissionIds.length) {
    const { data, error: permissionsError } = await supabase
      .from('permissions')
      .select('id, key, module, action')
      .in('id', permissionIds)

    if (permissionsError) {
      console.error('Gagal membaca permission:', permissionsError)
      throw new Error('Permission pengguna tidak dapat dibaca.')
    }

    permissionRows = data ?? []
  }

  const roleNames = [...new Set((roles ?? []).map(role => role.name).filter(Boolean))]
  const permissionKeys = [...new Set(permissionRows.map(permission => permission.key).filter(Boolean))]

  accessCache = {
    user: session.user,
    profile,
    roles: roleNames,
    roleNames,
    permissions: permissionKeys
  }

  console.info('Access context', JSON.stringify({
    userId,
    roles: roleNames,
    permissionCount: permissionKeys.length,
    hasDashboardAccess: permissionKeys.includes('dashboard.view')
  }))

  return accessCache
}

export function clearAccessCache() {
  accessCache = null
}

export function hasRole(context, role) {
  return Boolean(context?.roleNames?.includes(role))
}

export function hasAnyRole(context, roles = []) {
  return roles.some(role => hasRole(context, role))
}

export function hasPermission(context, permission) {
  return hasRole(context, 'super_admin') || Boolean(context?.permissions?.includes(permission))
}

export function hasAnyPermission(context, permissions = []) {
  return permissions.some(permission => hasPermission(context, permission))
}

export async function signIn(email, password) {
  if (!authReady()) throw new Error('Supabase belum dikonfigurasi. Isi environment variables terlebih dahulu.')

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error

  clearAccessCache()
  const context = await getAccessContext(true)
  if (!context?.profile?.is_active) {
    await supabase.auth.signOut()
    throw new Error('Akun belum aktif atau belum memiliki profil.')
  }

  await supabase.rpc('record_login', {
    login_success: true,
    login_email: data.user.email,
    failure_reason_value: null,
    user_agent_value: navigator.userAgent
  })

  return { user: data.user, context }
}

export async function signOut() {
  clearAccessCache()
  if (supabase) await supabase.auth.signOut()
}

export function subscribeToAuthChanges(callback) {
  if (!authReady()) return { data: { subscription: { unsubscribe() {} } } }

  return supabase.auth.onAuthStateChange((event, session) => {
    clearAccessCache()
    callback(event, session)
  })
}

export function startIdleSessionTimeout(onTimeout, duration = 2 * 60 * 60 * 1000) {
  if (!authReady()) return () => {}

  const reset = () => {
    window.clearTimeout(idleTimer)
    idleTimer = window.setTimeout(onTimeout, duration)
  }

  const events = ['pointerdown', 'keydown', 'scroll', 'touchstart']
  events.forEach(event => window.addEventListener(event, reset, { passive: true }))
  reset()
  return () => events.forEach(event => window.removeEventListener(event, reset))
}
