import { useEffect, useState, useRef } from 'react'
import { Menu, X, ShoppingCart, User, Package, Heart, LogOut, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useAuth } from '../../../hooks/useAuth'
import { useCart } from '../../../hooks/useCart'
import { isAdminUser } from '../../../utils/auth'

const PUBLIC_NAV_LINKS = [
  { label: 'Collections', href: '#collections' },
  { label: 'New Arrivals', href: '#new-arrivals' },
  { label: 'Contact', href: '#contact' },
  { label: 'About Us', href: '/about-us' },
]

const AUTH_NAV_LINKS = [
  { label: 'Home', href: '/home' },
  { label: 'Shop', href: '/shop' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About Us', href: '/about-us' },
]

const ADMIN_NAV_LINK = { label: 'Admin', href: '/admin' }

const ACCOUNT_MENU = [
  { label: 'My Profile', href: '/profile', icon: User },
  { label: 'Orders',     href: '/orders',  icon: Package },
  { label: 'Wishlist',   href: '/wishlist', icon: Heart },
]

// cartCount is the only prop still needed from the parent (LandingPage manages cart state)
// Everything auth-related comes from useAuth directly
export function Navbar({
  open = false,
  setOpen = () => {},
  cartCount,
  navBackground: navBackgroundProp,
  forceScrolledStyle = false,
}) {
  const { isAuthenticated, user, logout } = useAuth()
  const { items: cartItems } = useCart()
  const displayedCartCount = cartCount ?? cartItems.reduce((total, item) => total + item.quantity, 0)

  const [scrolled, setScrolled] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const dropdownRef = useRef(null)

  const navLinks = isAuthenticated
    ? (isAdminUser(user) ? [...AUTH_NAV_LINKS, ADMIN_NAV_LINK] : AUTH_NAV_LINKS)
    : PUBLIC_NAV_LINKS
  const homeHref = isAuthenticated ? '/home' : '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAccountOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const closeMenu = () => setOpen(false)

  const handleLogout = () => {
    closeMenu()
    setAccountOpen(false)
    logout?.()
  }

  const useScrolledStyle = forceScrolledStyle || scrolled
  const navBackground = navBackgroundProp ?? (useScrolledStyle ? 'bg-white shadow-sm' : 'bg-transparent')
  const logoColor     = useScrolledStyle ? 'text-charcoal' : 'text-white'
  const linkColor     = useScrolledStyle ? 'text-charcoal/80 hover:text-orange' : 'text-white/80 hover:text-white'
  const iconColor     = useScrolledStyle ? 'text-charcoal' : 'text-white'
  const loginStyle    = useScrolledStyle
    ? 'border-charcoal/25 text-charcoal hover:border-charcoal/50'
    : 'border-white/35 text-white hover:border-white/70'

  return (
    <>
      {/* ── Navbar ── */}
      <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 sm:top-0 ${navBackground}`}>
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">

            {/* Logo */}
            <Link className="shrink-0 leading-none" to={homeHref} onClick={closeMenu}>
              <p className={`font-display text-xl font-semibold tracking-tight transition-colors ${logoColor}`}>
                Sekjad
              </p>
              <p className="text-orange text-[9px] font-medium uppercase tracking-[0.3em]">
                Nig Enterprises
              </p>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden items-center gap-7 lg:flex">
              {navLinks.map((link) => (
                link.href.startsWith('#') ? (
                  <a
                    key={link.label}
                    href={link.href}
                    className={`text-sm font-medium tracking-wide transition-colors duration-200 ${linkColor}`}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`text-sm font-medium tracking-wide transition-colors duration-200 ${linkColor}`}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>

            {/* Right-side actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {isAuthenticated ? (
                <>
                  {/* Cart */}
                  <Link to="/cart" className={`relative p-2 transition-colors ${iconColor}`} aria-label="Cart">
                    <ShoppingCart size={20} strokeWidth={1.8} />
                    {displayedCartCount > 0 && (
                      <span className="bg-orange absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white">
                        {displayedCartCount > 9 ? '9+' : displayedCartCount}
                      </span>
                    )}
                  </Link>

                  {/* Account dropdown — desktop only */}
                  <div className="relative hidden lg:block" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setAccountOpen(!accountOpen)}
                      className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors duration-200 ${loginStyle}`}
                    >
                      <span>{user?.firstName ?? 'Account'}</span>
                      <ChevronDown size={14} strokeWidth={2} className={`transition-transform duration-200 ${accountOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <div className={`absolute right-0 mt-2 w-48 origin-top-right rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-200 ${
                      accountOpen ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
                    }`}>
                      <div className="p-1.5">
                        {ACCOUNT_MENU.map(({ label, href, icon: Icon }) => (
                          <Link key={label} to={href} onClick={() => setAccountOpen(false)}
                            className="text-charcoal hover:text-orange hover:bg-orange/5 flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors">
                            <Icon size={15} strokeWidth={1.8} />
                            {label}
                          </Link>
                        ))}
                        <div className="my-1.5 border-t border-gray-100" />
                        <button type="button" onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50">
                          <LogOut size={15} strokeWidth={1.8} />
                          Log out
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login"
                    className={`hidden items-center rounded-full border px-5 py-2 text-sm font-medium transition-colors duration-200 lg:inline-flex ${loginStyle}`}>
                    Log in
                  </Link>
                  <Link to="/register"
                    className="bg-orange hidden items-center rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#d4711f] lg:inline-flex">
                    Sign up
                  </Link>
                </>
              )}

              {/* Hamburger */}
              <button type="button" onClick={() => setOpen(!open)}
                aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-navigation"
                className={`p-2 transition-colors lg:hidden ${iconColor}`}>
                {open ? <X size={22} strokeWidth={1.8} /> : <Menu size={22} strokeWidth={1.6} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile: backdrop ── */}
      <div aria-hidden="true" onClick={closeMenu}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* ── Mobile: left drawer ── */}
      <div id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Site navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <a href="#top" onClick={closeMenu} className="leading-none">
            <p className="text-charcoal font-display text-lg font-semibold tracking-tight">Sekjad</p>
            <p className="text-orange text-[9px] font-medium uppercase tracking-[0.3em]">Nig Enterprises</p>
          </a>
          <button type="button" onClick={closeMenu} aria-label="Close menu"
            className="text-charcoal/60 hover:text-charcoal rounded-full p-1.5 transition-colors">
            <X size={20} strokeWidth={1.8} />
          </button>
        </div>

        {/* Drawer body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isAuthenticated && user && (
            <div className="mb-5 rounded-2xl bg-gray-50 px-4 py-3">
              <p className="text-charcoal/50 text-xs font-medium uppercase tracking-widest">Welcome back</p>
              <p className="text-charcoal mt-0.5 font-semibold">{user.firstName} {user.lastName}</p>
            </div>
          )}

          <p className="text-charcoal/40 mb-2 text-[10px] font-semibold uppercase tracking-widest">Menu</p>
          {navLinks.map((link) => (
            link.href.startsWith('#') ? (
              <a key={link.label} href={link.href} onClick={closeMenu}
                className="text-charcoal hover:text-orange flex items-center justify-between border-b border-gray-100 py-3.5 font-medium transition-colors">
                {link.label}
                <span className="text-orange opacity-40">→</span>
              </a>
            ) : (
              <Link key={link.label} to={link.href} onClick={closeMenu}
                className="text-charcoal hover:text-orange flex items-center justify-between border-b border-gray-100 py-3.5 font-medium transition-colors">
                {link.label}
                <span className="text-orange opacity-40">→</span>
              </Link>
            )
          ))}

          {isAuthenticated && (
            <>
              <p className="text-charcoal/40 mb-2 mt-6 text-[10px] font-semibold uppercase tracking-widest">Account</p>
              {ACCOUNT_MENU.map(({ label, href, icon: Icon }) => (
                <Link key={label} to={href} onClick={closeMenu}
                  className="text-charcoal hover:text-orange flex items-center gap-3 border-b border-gray-100 py-3.5 font-medium transition-colors">
                  <Icon size={16} strokeWidth={1.8} className="shrink-0 opacity-60" />
                  {label}
                </Link>
              ))}
            </>
          )}
        </div>

        {/* Drawer footer */}
        <div className="border-t border-gray-100 px-5 py-4">
          {isAuthenticated ? (
            <button type="button" onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-red-200 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50">
              <LogOut size={15} strokeWidth={1.8} />
              Log out
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <Link to="/login" onClick={closeMenu}
                className="text-charcoal block w-full rounded-full border border-charcoal/20 py-3.5 text-center text-sm font-medium transition-colors hover:border-charcoal/40">
                Log in
              </Link>
              <Link to="/register" onClick={closeMenu}
                className="bg-orange block w-full rounded-full py-3.5 text-center text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#d4711f]">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Navbar
