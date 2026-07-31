function AdminRoute({ children, isAdmin = false }) {
  return isAdmin ? children : null
}

export default AdminRoute
