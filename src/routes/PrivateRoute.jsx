function PrivateRoute({ children, isAuthenticated = false }) {
  return isAuthenticated ? children : null
}

export default PrivateRoute
