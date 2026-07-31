function GuestRoute({ children, isAuthenticated = false }) {
  return isAuthenticated ? null : children
}

export default GuestRoute
