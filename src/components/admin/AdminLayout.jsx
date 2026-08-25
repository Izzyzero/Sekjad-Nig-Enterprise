import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { FolderTree, Home, LogOut, Package, ShoppingBag } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const ADMIN_LINKS = [
  { label: 'Dashboard', to: '/admin', end: true, icon: Home },
  { label: 'Products', to: '/admin/products', icon: ShoppingBag },
  { label: 'Categories', to: '/admin/categories', icon: FolderTree },
  { label: 'Orders', to: '/admin/orders', icon: Package },
]

export function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827]">
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/home" className="font-display text-xl font-semibold">Sekjad Admin</Link>
          <div className="flex items-center gap-3">
            <Link to="/shop" className="text-sm font-medium text-[#6B7280] hover:text-[#E67E22]">
              View shop
            </Link>
            <button type="button" onClick={handleLogout} className="flex items-center gap-2 rounded-full border border-[#E5E7EB] px-4 py-2 text-sm font-medium hover:bg-stone-50">
              <LogOut size={15} /> Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 sm:px-8 md:grid-cols-[210px_minmax(0,1fr)]">
        <aside>
          <nav className="flex gap-2 overflow-x-auto md:flex-col" aria-label="Admin navigation">
            {ADMIN_LINKS.map(({ label, to, end, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => `flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? 'bg-[#E67E22] text-white' : 'text-[#6B7280] hover:bg-white hover:text-[#111827]'
                }`}
              >
                <Icon size={16} /> {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0"><Outlet /></main>
      </div>
    </div>
  )
}

export default AdminLayout
