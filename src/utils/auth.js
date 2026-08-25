export const isAdminUser = (user) => {
  if (!user) return false

  const role = String(user.role ?? user.userRole ?? '').trim().toLowerCase()
  const roles = Array.isArray(user.roles)
    ? user.roles.map((item) => String(item).trim().toLowerCase())
    : []

  return role === 'admin' || roles.includes('admin') || user.isAdmin === true || user.is_admin === true
}
