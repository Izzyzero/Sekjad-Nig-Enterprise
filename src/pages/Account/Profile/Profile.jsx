import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../../../components/layout/Navbar/Navbar'
import { Footer } from '../../../components/layout/Footer/Footer'
import { useAuth } from '../../../hooks/useAuth'
import {
  Camera, Save, Eye, EyeOff, MapPin, Plus, Trash2,
  ChevronRight, User, Package, Heart, ArrowLeft
} from 'lucide-react'

// ── Shared account sidebar nav used on all three pages ──────────────────────
function AccountNav({ active }) {
  const links = [
    { label: 'My Profile', href: '/profile',  icon: User    },
    { label: 'Orders',     href: '/orders',   icon: Package },
    { label: 'Wishlist',   href: '/wishlist', icon: Heart   },
  ]
  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <nav className="sticky top-32 rounded-2xl border border-slate-200 bg-white overflow-hidden">
        {links.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            to={href}
            className={`flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors border-b border-slate-100 last:border-0
              ${active === label
                ? 'bg-orange/5 text-orange border-l-2 border-l-orange'
                : 'text-charcoal/70 hover:text-charcoal hover:bg-slate-50'}`}
          >
            <Icon size={16} strokeWidth={1.8} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

// ── Mobile top tab strip ─────────────────────────────────────────────────────
function MobileAccountTabs({ active }) {
  const links = [
    { label: 'Profile', href: '/profile',  icon: User    },
    { label: 'Orders',  href: '/orders',   icon: Package },
    { label: 'Wishlist',href: '/wishlist', icon: Heart   },
  ]
  return (
    <div className="flex lg:hidden border-b border-slate-200 bg-white sticky top-[4.5rem] z-30">
      {links.map(({ label, href, icon: Icon }) => (
        <Link
          key={label}
          to={href}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-semibold tracking-wide transition-colors
            ${active === label || (active === 'My Profile' && label === 'Profile')
              ? 'text-orange border-b-2 border-orange'
              : 'text-charcoal/50 hover:text-charcoal'}`}
        >
          <Icon size={17} strokeWidth={1.8} />
          {label}
        </Link>
      ))}
    </div>
  )
}

export function Profile() {
  const { user,isAuthenticated } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const fileInputRef = useRef(null)

  // ── Personal info ────────────────────────────────────────────────────────
  const [info, setInfo] = useState({
    firstName: user?.firstName ?? '',
    lastName:  user?.lastName  ?? '',
    email:     user?.email     ?? '',
    phone:     user?.phone     ?? '',
  })
  const [infoSaved, setInfoSaved] = useState(false)
  const [avatarSrc, setAvatarSrc] = useState(user?.avatar ?? null)

  const handleInfoChange = (e) => {
    setInfo((p) => ({ ...p, [e.target.name]: e.target.value }))
    setInfoSaved(false)
  }
  const saveInfo = (e) => {
    e.preventDefault()
    // TODO: call PATCH /api/auth/me
    console.log('Save info:', info)
    setInfoSaved(true)
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setAvatarSrc(ev.target.result)
    reader.readAsDataURL(file)
    // TODO: upload file to backend
  }

  // ── Change password ──────────────────────────────────────────────────────
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' })
  const [showPwd, setShowPwd] = useState({ current: false, next: false, confirm: false })
  const [pwdError, setPwdError] = useState('')
  const [pwdSaved, setPwdSaved] = useState(false)

  const handlePwdChange = (e) => {
    setPwd((p) => ({ ...p, [e.target.name]: e.target.value }))
    setPwdError('')
    setPwdSaved(false)
  }
  const savePwd = (e) => {
    e.preventDefault()
    if (pwd.next !== pwd.confirm) { setPwdError('New passwords do not match.'); return }
    if (pwd.next.length < 8)      { setPwdError('Password must be at least 8 characters.'); return }
    // TODO: call POST /api/auth/change-password
    console.log('Change password')
    setPwdSaved(true)
    setPwd({ current: '', next: '', confirm: '' })
  }

  // ── Saved addresses ──────────────────────────────────────────────────────
  const [addresses, setAddresses] = useState(user?.addresses ?? [])
  const [addingAddr, setAddingAddr] = useState(false)
  const [newAddr, setNewAddr] = useState({ label: '', street: '', city: '', state: '' })

  const saveAddress = (e) => {
    e.preventDefault()
    if (!newAddr.street || !newAddr.city || !newAddr.state) return
    setAddresses((p) => [...p, { ...newAddr, id: Date.now() }])
    setNewAddr({ label: '', street: '', city: '', state: '' })
    setAddingAddr(false)
    // TODO: call POST /api/addresses
  }
  const deleteAddress = (id) => {
    setAddresses((p) => p.filter((a) => a.id !== id))
    // TODO: call DELETE /api/addresses/:id
  }

  // ── Initials avatar fallback ─────────────────────────────────────────────
  const initials = [info.firstName[0], info.lastName[0]].filter(Boolean).join('').toUpperCase() || 'U'

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Announcement bar placeholder height */}
      <div className="bg-charcoal h-9" />
      <Navbar open={menuOpen} setOpen={setMenuOpen} isAuthenticated={isAuthenticated} navBackground="bg-white shadow-sm"  forceScrolledStyle={true} />

      <MobileAccountTabs active="My Profile" />

      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:py-14">
        {/* Back link — mobile */}
        <Link to="/" className="lg:hidden inline-flex items-center gap-1.5 text-sm text-charcoal/50 hover:text-charcoal mb-6 transition-colors">
          <ArrowLeft size={15} /> Back to store
        </Link>

        <div className="flex gap-10">
          <AccountNav active="My Profile" />

          <div className="flex-1 min-w-0 space-y-6">

            {/* ── Avatar + name header ── */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-5">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-orange/10 flex items-center justify-center ring-2 ring-orange/20">
                  {avatarSrc
                    ? <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                    : <span className="text-orange text-2xl font-bold font-display">{initials}</span>}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-orange rounded-full flex items-center justify-center shadow text-white hover:bg-[#d4711f] transition-colors"
                  aria-label="Change photo"
                >
                  <Camera size={13} strokeWidth={2} />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>
              <div>
                <p className="text-charcoal font-display text-lg font-semibold">
                  {info.firstName || info.lastName ? `${info.firstName} ${info.lastName}`.trim() : 'Your Name'}
                </p>
                <p className="text-charcoal/45 text-sm mt-0.5">{info.email || 'your@email.com'}</p>
              </div>
            </div>

            {/* ── Personal info ── */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-charcoal font-display text-base font-semibold mb-5">Personal Information</h2>
              <form onSubmit={saveInfo} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    { name: 'firstName', label: 'First Name',    type: 'text',  placeholder: 'Israel'       },
                    { name: 'lastName',  label: 'Last Name',     type: 'text',  placeholder: 'Doe'          },
                    { name: 'email',     label: 'Email Address', type: 'email', placeholder: 'you@email.com' },
                    { name: 'phone',     label: 'Phone Number',  type: 'tel',   placeholder: '080X XXX XXXX' },
                  ].map(({ name, label, type, placeholder }) => (
                    <div key={name}>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-charcoal/40 mb-1.5">{label}</label>
                      <input
                        type={type}
                        name={name}
                        value={info[name]}
                        onChange={handleInfoChange}
                        placeholder={placeholder}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-charcoal outline-none focus:border-orange/60 transition-colors placeholder:text-charcoal/25"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <button type="submit" className="bg-orange inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d4711f]">
                    <Save size={14} strokeWidth={2} /> Save changes
                  </button>
                  {infoSaved && <span className="text-sm text-green-600 font-medium">Saved ✓</span>}
                </div>
              </form>
            </section>

            {/* ── Change password ── */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-charcoal font-display text-base font-semibold mb-5">Change Password</h2>
              <form onSubmit={savePwd} className="space-y-4">
                {[
                  { name: 'current', label: 'Current Password',  placeholder: '••••••••' },
                  { name: 'next',    label: 'New Password',       placeholder: 'Min. 8 characters' },
                  { name: 'confirm', label: 'Confirm New Password', placeholder: '••••••••' },
                ].map(({ name, label, placeholder }) => (
                  <div key={name}>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-charcoal/40 mb-1.5">{label}</label>
                    <div className="relative">
                      <input
                        type={showPwd[name] ? 'text' : 'password'}
                        name={name}
                        value={pwd[name]}
                        onChange={handlePwdChange}
                        placeholder={placeholder}
                        required
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-11 text-sm text-charcoal outline-none focus:border-orange/60 transition-colors placeholder:text-charcoal/25"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd((p) => ({ ...p, [name]: !p[name] }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/35 hover:text-charcoal transition-colors"
                        aria-label={showPwd[name] ? 'Hide' : 'Show'}
                      >
                        {showPwd[name] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                ))}
                {pwdError && <p className="text-sm text-red-500">{pwdError}</p>}
                <div className="flex items-center gap-3 pt-1">
                  <button type="submit" className="bg-charcoal inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange">
                    <Save size={14} strokeWidth={2} /> Update password
                  </button>
                  {pwdSaved && <span className="text-sm text-green-600 font-medium">Password updated ✓</span>}
                </div>
              </form>
            </section>

            {/* ── Saved addresses ── */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-charcoal font-display text-base font-semibold">Saved Addresses</h2>
                {!addingAddr && (
                  <button
                    type="button"
                    onClick={() => setAddingAddr(true)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange hover:text-[#d4711f] transition-colors"
                  >
                    <Plus size={15} strokeWidth={2.2} /> Add address
                  </button>
                )}
              </div>

              {/* Address list */}
              <div className="space-y-3">
                {addresses.length === 0 && !addingAddr && (
                  <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center">
                    <MapPin size={22} className="mx-auto mb-2 text-charcoal/25" strokeWidth={1.5} />
                    <p className="text-sm text-charcoal/40">No saved addresses yet.</p>
                  </div>
                )}
                {addresses.map((addr) => (
                  <div key={addr.id} className="flex items-start justify-between rounded-xl border border-slate-200 px-4 py-3">
                    <div className="flex gap-3">
                      <MapPin size={16} className="text-orange mt-0.5 shrink-0" strokeWidth={1.8} />
                      <div>
                        {addr.label && <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/40 mb-0.5">{addr.label}</p>}
                        <p className="text-sm text-charcoal">{addr.street}, {addr.city}, {addr.state}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteAddress(addr.id)}
                      className="text-charcoal/30 hover:text-red-400 transition-colors ml-4 shrink-0"
                      aria-label="Remove address"
                    >
                      <Trash2 size={15} strokeWidth={1.8} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add address form */}
              {addingAddr && (
                <form onSubmit={saveAddress} className="mt-4 rounded-xl border border-orange/30 bg-orange/[0.03] p-4 space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-charcoal/40 mb-1.5">Label (optional)</label>
                      <input type="text" value={newAddr.label} onChange={(e) => setNewAddr((p) => ({ ...p, label: e.target.value }))}
                        placeholder="Home, Office…"
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-charcoal outline-none focus:border-orange/60 placeholder:text-charcoal/25" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-charcoal/40 mb-1.5">Street</label>
                      <input type="text" required value={newAddr.street} onChange={(e) => setNewAddr((p) => ({ ...p, street: e.target.value }))}
                        placeholder="14 Balogun Street"
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-charcoal outline-none focus:border-orange/60 placeholder:text-charcoal/25" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-charcoal/40 mb-1.5">City</label>
                      <input type="text" required value={newAddr.city} onChange={(e) => setNewAddr((p) => ({ ...p, city: e.target.value }))}
                        placeholder="Lagos"
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-charcoal outline-none focus:border-orange/60 placeholder:text-charcoal/25" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-charcoal/40 mb-1.5">State</label>
                      <input type="text" required value={newAddr.state} onChange={(e) => setNewAddr((p) => ({ ...p, state: e.target.value }))}
                        placeholder="Lagos State"
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-charcoal outline-none focus:border-orange/60 placeholder:text-charcoal/25" />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button type="submit" className="bg-orange rounded-full px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#d4711f]">Save address</button>
                    <button type="button" onClick={() => setAddingAddr(false)} className="rounded-full px-5 py-2 text-sm font-medium text-charcoal/60 hover:text-charcoal transition-colors">Cancel</button>
                  </div>
                </form>
              )}
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Profile
