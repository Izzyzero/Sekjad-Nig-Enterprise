import { SessionLoader } from '../components/SessionLoader'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function GuestRoute({ children }) {
  const { isAuthenticated, isAuthLoading } = useAuth()

  if (isAuthLoading) {
    return <SessionLoader />
  }

  return isAuthenticated ? <Navigate to="/home" replace /> : children
}

export default GuestRoute
