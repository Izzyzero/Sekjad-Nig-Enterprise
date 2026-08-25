import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function GuestRoute({ children }) {
  const { isAuthenticated, isAuthLoading } = useAuth()

  if (isAuthLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-white">
        <p className="text-sm text-[#6B7280]">Checking your session...</p>
      </div>
    )
  }

  return isAuthenticated ? <Navigate to="/home" replace /> : children
}

export default GuestRoute
