import { SessionLoader } from '../components/SessionLoader'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function GuestRoute({ children }) {
  const location = useLocation()
  const { isAuthenticated, isAuthLoading } = useAuth()

  if (isAuthLoading) {
    return <SessionLoader />
  }

  return isAuthenticated ? <Navigate to={location.state?.from ?? "/home"} replace /> : children
}

export default GuestRoute
