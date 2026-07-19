import { supabase, supabaseConfiguration } from '../supabase.js'

let accessCache = null
let idleTimer = null

export function authReady() {
  return Boolean(supabaseConfiguration.ready && supabase)
}

export async function getSession() {
  if (!authReady()) return { session: null, error: new Error('Supabase belum dikonfigurasi.') }
  const { data, error } = await supabase.auth.getSession()
  return { session: data?.session ?? null, error }
}

export async function getAccessContext(userId, force = false) {
  if (!authReady()) return { error: new Error('Supabase belum dikonfigurasi.') }
  if (accessCache?.user?.id === userId && !force) return accessCache

  const [{ data: profile, error: profileError }, { data: userRoles, error: rolesError }] = await Promise.all([
    supabase.from('profiles').select('id, full_name, username, avatar_url, phone, bio, is_active, last_login_at').eq('id', userId).maybeSingle(),
    supabase.from('user_roles').select('role_id, roles(id, name, label, is_system)').eq('user_id', userId)
  ])

  if (profileError) return { error: profileError }
  if (rolesError) return { error: rolesError }
  if (!profile) return { error: new Error('Profil pengguna belum tersedia.') }

  const roleRows = (userRoles ?? []).map(row => row.roles).filter(Boolean)
  const roleIds = roleRows.map(role => role.id)
  let permissionRows = []
  if (roleIds.length) {
    const { data, error } = await supabase
      .from('role_permissions')
      .select('role_id, permissions(key, module, action)')
      .in('role_id', roleIds)
    if (error) return { error }
    permissionRows = data ?? []
  }

  accessCache = {
    user: { id: userId },
    profile,
    roles: roleRows,
    roleNames: roleRows.map(role => role.name),
    permissions: [...new Set(permissionRows.map(row => row.permissions?.key).filter(Boolean))]
  }
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
  const context = await getAccessContext(data.user.id, true)
  if (context.error || !context.profile?.is_active) {
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
    if (event === 'SIGNED_OUT') clearAccessCache()
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
