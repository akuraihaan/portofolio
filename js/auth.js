import { supabase, supabaseConfiguration } from '../supabase.js'

let accessCache = null
let idleTimer = null

function safeError(error) {
  return {
    code: error?.code || null,
    message: error?.message || 'Unknown Supabase error',
    details: error?.details || null,
    hint: error?.hint || null
  }
}

function logSupabaseError(label, error) {
  console.error(label, safeError(error))
}

export function authReady() {
  return Boolean(supabaseConfiguration.ready && supabase)
}

export async function getCurrentSession() {
  if (!authReady()) return null

  const { data, error } = await supabase.auth.getSession()
  if (error) {
    logSupabaseError('Session error:', error)
    return null
  }

  return data?.session ?? null
}

export async function getSession() {
  if (!authReady()) {
    return { session: null, error: new Error('Supabase belum dikonfigurasi.') }
  }

  const { data, error } = await supabase.auth.getSession()
  if (error) logSupabaseError('Session query failed:', error)
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
    logSupabaseError('Profile query failed:', profileError)
    throw new Error('Profil pengguna tidak dapat dibaca.')
  }

  if (!profile) throw new Error('Profil pengguna belum tersedia.')
  if (!profile.is_active) throw new Error('Akun pengguna tidak aktif.')

  const { data: userRoleRows, error: userRolesError } = await supabase
    .from('user_roles')
    .select('user_id, role_id')
    .eq('user_id', userId)

  if (userRolesError) {
    logSupabaseError('User roles query failed:', userRolesError)
    throw new Error('Role pengguna tidak dapat dibaca.')
  }

  const roleIds = [
    ...new Set(
      (userRoleRows ?? [])
        .map(row => row.role_id)
        .filter(value => value !== null && value !== undefined)
    )
  ]

  console.info('User role rows:', { userId, rowCount: userRoleRows?.length || 0, roleIds })

  if (!roleIds.length) {
    throw new Error('Akun belum memiliki role pada tabel user_roles.')
  }

  const { data: roleRows, error: rolesError } = await supabase
    .from('roles')
    .select('id, name, label, is_system')
    .in('id', roleIds)

  if (rolesError) {
    logSupabaseError('Roles query failed:', rolesError)
    throw new Error('Data role tidak dapat dibaca.')
  }

  const roleNames = [
    ...new Set((roleRows ?? []).map(role => role.name).filter(Boolean))
  ]

  if (!roleNames.length) {
    throw new Error('Relasi role ditemukan, tetapi data roles tidak tersedia.')
  }

  const { data: rolePermissionRows, error: rolePermissionsError } = await supabase
    .from('role_permissions')
    .select('role_id, permission_id')
    .in('role_id', roleIds)

  if (rolePermissionsError) {
    logSupabaseError('Role permissions query failed:', rolePermissionsError)
    throw new Error('Permission role tidak dapat dibaca.')
  }

  const permissionIds = [
    ...new Set(
      (rolePermissionRows ?? [])
        .map(row => row.permission_id)
        .filter(value => value !== null && value !== undefined)
    )
  ]

  let permissionRows = []
  if (permissionIds.length) {
    const { data, error: permissionsError } = await supabase
      .from('permissions')
      .select('id, key, module, action')
      .in('id', permissionIds)

    if (permissionsError) {
      logSupabaseError('Permissions query failed:', permissionsError)
      throw new Error('Permission pengguna tidak dapat dibaca.')
    }

    permissionRows = data ?? []
  }

  const permissionKeys = [
    ...new Set(permissionRows.map(permission => permission.key).filter(Boolean))
  ]

  accessCache = {
    user: session.user,
    profile,
    roles: roleNames,
    roleNames,
    permissions: permissionKeys,
    isSuperAdmin: roleNames.includes('super_admin'),
    hasDashboardAccess: permissionKeys.includes('dashboard.view')
  }

  console.info('Access context ready:', {
    userId,
    roles: roleNames,
    permissionCount: permissionKeys.length,
    hasDashboardAccess: accessCache.hasDashboardAccess,
    isSuperAdmin: accessCache.isSuperAdmin
  })

  return accessCache
}

export function clearAccessCache() {
  accessCache = null
}

export function hasRole(contextOrRole, roleName) {
  const context = typeof contextOrRole === 'string' ? accessCache : contextOrRole
  const role = typeof contextOrRole === 'string' ? contextOrRole : roleName
  return Boolean(context?.roleNames?.includes(role) || context?.roles?.includes(role))
}

export function hasAnyRole(contextOrRoles, maybeRoles = []) {
  const context = Array.isArray(contextOrRoles) ? accessCache : contextOrRoles
  const roles = Array.isArray(contextOrRoles) ? contextOrRoles : maybeRoles
  return roles.some(role => hasRole(context, role))
}

export function hasPermission(contextOrPermission, permissionKey) {
  const context = typeof contextOrPermission === 'string' ? accessCache : contextOrPermission
  const permission = typeof contextOrPermission === 'string' ? contextOrPermission : permissionKey
  return Boolean(
    hasRole(context, 'super_admin') || context?.permissions?.includes(permission)
  )
}

export function hasAnyPermission(contextOrPermissions, maybePermissions = []) {
  const context = Array.isArray(contextOrPermissions) ? accessCache : contextOrPermissions
  const permissions = Array.isArray(contextOrPermissions) ? contextOrPermissions : maybePermissions
  return permissions.some(permission => hasPermission(context, permission))
}

export async function signIn(email, password) {
  if (!authReady()) {
    throw new Error('Supabase belum dikonfigurasi. Isi environment variables terlebih dahulu.')
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    logSupabaseError('Supabase sign-in failed:', error)
    throw error
  }

  if (!data?.session || !data?.user) {
    throw new Error('Session login tidak berhasil dibuat.')
  }

  clearAccessCache()

  let context
  try {
    context = await getAccessContext(true)
  } catch (contextError) {
    await supabase.auth.signOut()
    throw contextError
  }

  if (!context?.profile?.is_active) {
    await supabase.auth.signOut()
    throw new Error('Akun pengguna tidak aktif.')
  }

  if (!hasPermission(context, 'dashboard.view')) {
    await supabase.auth.signOut()
    throw new Error('Akun tidak memiliki akses ke dashboard.')
  }

  // Login history is optional for authentication. A missing/blocked audit RPC
  // must never invalidate a valid session and access context.
  const { error: recordLoginError } = await supabase.rpc('record_login', {
    login_success: true,
    login_email: data.user.email,
    failure_reason_value: null,
    user_agent_value: typeof navigator === 'undefined' ? null : navigator.userAgent
  })
  if (recordLoginError) logSupabaseError('Optional login audit failed:', recordLoginError)

  return { user: data.user, session: data.session, context }
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
