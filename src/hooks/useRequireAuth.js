import { parsePath, useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'

export function useRequireAuth() {
  const { isAuthenticated, isAuthLoading } = useAuth()
  const navigate = useNavigate()
  return (destination) => {
    if (isAuthenticated && !isAuthLoading) return true
    navigate('/login', { state: {
      from: parsePath(destination),
      message: 'Please log in to continue.',
    } })
    return false
  }
}
