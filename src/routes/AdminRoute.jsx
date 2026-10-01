import { SessionLoader } from '../components/SessionLoader'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { isAdminUser } from '../utils/auth'

// Gates every /admin/* route.
// Mirrors PrivateRoute's loading/redirect pattern, plus a role check.
// NOTE: this is a UX convenience only — the backend must independently
// verify admin privileges on every /admin/* API call.
function AdminRoute({ children }) {
  const { isAuthenticated, isAuthLoading, user } = useAuth()
  const location = useLocation()

  if (isAuthLoading) {
    return <SessionLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!isAdminUser(user)) {
    return <Navigate to="/home" replace />
  }

  return children
}

export default AdminRoute
