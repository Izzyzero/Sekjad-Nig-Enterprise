import { authService } from '../../../services/auth.service'
import { getApiError, getRateLimitSeconds } from '../../../services/api'
import { useRateLimit } from '../../../hooks/useRateLimit'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar } from '../../../components/layout/Navbar/Navbar'
import { Footer } from '../../../components/layout/Footer/Footer'
import { useAuth } from '../../../hooks/useAuth'
import {
  Save, Eye, EyeOff,
  User, Package, Heart, ArrowLeft
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

const infoOf = (user) => ({ firstName: user?.firstName ?? '', lastName: user?.lastName ?? '', email: user?.email ?? '', phone: user?.phoneNumber ?? '' })
const inputClass = 'w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-charcoal outline-none focus:border-orange/60'
const buttonClass = 'inline-flex items-center gap-2 rounded-full bg-orange px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#d4711f] disabled:opacity-60 disabled:cursor-not-allowed'
function ErrorMessage({ children }) { return children ? <p role="alert" className="text-sm text-red-600">{children}</p> : null }

export function Profile() {
  const { user, isAuthenticated, updateUser, clearSession } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [info, setInfo] = useState(() => infoOf(user))
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [busy, setBusy] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})
  const [emailPassword, setEmailPassword] = useState('')
  const [pendingEmail, setPendingEmail] = useState('')
  const [code, setCode] = useState('')
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [showPwd, setShowPwd] = useState({})
  const profileLimit = useRateLimit()
  const passwordLimit = useRateLimit()
  const verificationLimit = useRateLimit()
  const emailChanged = info.email.trim().toLowerCase() !== (user?.email ?? '').trim().toLowerCase()

  useEffect(() => {
    let active = true
    authService.me().then((response) => {
      if (!active) return
      updateUser(response.data.user)
      setInfo(infoOf(response.data.user))
      setLoadError('')
    }).catch((error) => {
      if (!active) return
      if (error.response?.status === 401) {
        clearSession()
        navigate('/login', { replace: true })
      } else setLoadError(getApiError(error))
    }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [updateUser, clearSession, navigate, loadAttempt])

  const fail = (error, section, limit) => {
    if (error.response?.status === 401) {
      clearSession()
      navigate('/login', { replace: true, state: { message: 'Please sign in again to continue.' } })
      return
    }
    const fields = { general: getApiError(error) }
    for (const item of error.response?.data?.errors ?? []) fields[item.field === 'phoneNumber' ? 'phone' : item.field] = item.message
    setErrors((previous) => ({ ...previous, [section]: fields }))
    limit.startRateLimit(getRateLimitSeconds(error))
  }
  const saveInfo = async (e) => {
    e.preventDefault()
    if (busy || profileLimit.rateLimitSeconds) return
    setBusy('info'); setMessage(''); setErrors({})
    try {
      const details = Object.fromEntries(Object.entries(info).map(([key, value]) => [key, value.trim()]))
      if (emailChanged) details.currentPassword = emailPassword
      const response = await authService.updateProfile(details)
      updateUser(response.data.user)
      setInfo(infoOf(response.data.user))
      setEmailPassword('')
      setMessage(response.message)
      if (response.data.emailVerificationRequired) {
        setPendingEmail(response.data.pendingEmail)
        setCode('')
      }
    } catch (error) { fail(error, 'info', profileLimit) }
    finally { setBusy('') }
  }
  const verifyEmail = async (e) => {
    e.preventDefault()
    if (busy || verificationLimit.rateLimitSeconds) return
    setBusy('verify'); setErrors({}); setMessage('')
    try {
      const response = await authService.verifyProfileEmail({ email: pendingEmail, code })
      updateUser(response.data.user)
      setInfo(infoOf(response.data.user))
      setPendingEmail(''); setCode(''); setEmailPassword('')
      setMessage(response.message)
    } catch (error) { fail(error, 'verify', verificationLimit) }
    finally { setBusy('') }
  }
  const resendEmail = async () => {
    if (busy || profileLimit.rateLimitSeconds || !emailPassword) return
    setBusy('resend'); setErrors({}); setMessage('')
    try {
      const response = await authService.updateProfile({ email: pendingEmail, currentPassword: emailPassword })
      updateUser(response.data.user)
      setPendingEmail(response.data.emailVerificationRequired ? response.data.pendingEmail : '')
      setCode(''); setEmailPassword('')
      setMessage(response.message)
    } catch (error) { fail(error, 'verify', profileLimit) }
    finally { setBusy('') }
  }
  const savePwd = async (e) => {
    e.preventDefault()
    if (busy || passwordLimit.rateLimitSeconds) return
    if (pwd.newPassword !== pwd.confirmPassword) { setErrors({ password: { confirmPassword: 'New passwords do not match.' } }); return }
    if (pwd.newPassword.length < 8) { setErrors({ password: { newPassword: 'Password must be at least 8 characters.' } }); return }
    setBusy('password'); setErrors({}); setMessage('')
    try {
      await authService.changePassword(pwd)
      setPwd({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setEmailPassword('')
      clearSession()
      navigate('/login', { replace: true, state: { message: 'Password changed successfully. Please sign in again.' } })
    } catch (error) { fail(error, 'password', passwordLimit) }
    finally { setBusy('') }
  }
  const disabled = loading || Boolean(loadError) || Boolean(busy)
  const initials = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join('').toUpperCase() || 'U'
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-charcoal h-9" />
      <Navbar open={menuOpen} setOpen={setMenuOpen} isAuthenticated={isAuthenticated} navBackground="bg-white shadow-sm" forceScrolledStyle={true} />
      <MobileAccountTabs active="My Profile" />
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:py-14">
        <Link to="/" className="lg:hidden inline-flex items-center gap-1.5 text-sm text-charcoal/50 hover:text-charcoal mb-6"><ArrowLeft size={15} /> Back to store</Link>
        <div className="flex gap-10">
          <AccountNav active="My Profile" />
          <div className="flex-1 min-w-0 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-5">
              <div className="shrink-0 w-20 h-20 rounded-full bg-orange/10 flex items-center justify-center ring-2 ring-orange/20"><span className="text-orange text-2xl font-bold font-display">{initials}</span></div>
              <div><p className="text-charcoal font-display text-lg font-semibold">{[user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Your Name'}</p><p className="text-charcoal/45 text-sm mt-0.5">{user?.email}</p></div>
            </div>
            {loading && <p role="status">Loading your profile...</p>}
            {loadError && <div><ErrorMessage>{loadError}</ErrorMessage><button type="button" className="text-orange" onClick={() => { setLoading(true); setLoadAttempt((n) => n + 1) }}>Retry loading profile</button></div>}
            {message && <p role="status" className="text-sm text-green-700">{message}</p>}
            <section className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-charcoal font-display text-base font-semibold mb-5">Personal Information</h2>
              <form onSubmit={saveInfo}>
                <fieldset disabled={disabled} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {[
                      { name: 'firstName', label: 'First Name', type: 'text', autoComplete: 'given-name' },
                      { name: 'lastName', label: 'Last Name', type: 'text', autoComplete: 'family-name' },
                      { name: 'email', label: 'Email Address', type: 'email', autoComplete: 'email' },
                      { name: 'phone', label: 'Phone Number', type: 'tel', autoComplete: 'tel' },
                    ].map(({ name, label, type, autoComplete }) => <div key={name}>
                      <label htmlFor={name} className="block text-xs font-semibold uppercase tracking-wide text-charcoal/40 mb-1.5">{label}</label>
                      <input id={name} name={name} type={type} autoComplete={autoComplete} required maxLength={name.endsWith('Name') ? 50 : undefined} pattern={name === 'phone' ? '[+]?[1-9][0-9]{7,14}' : undefined} title={name === 'phone' ? 'Enter 8–15 digits, starting with 1–9, with an optional + prefix.' : undefined} value={info[name]} onChange={(e) => { setInfo((previous) => ({ ...previous, [name]: e.target.value })); setMessage(''); setErrors({}) }} className={inputClass} />
                      <ErrorMessage>{errors.info?.[name]}</ErrorMessage>
                    </div>)}
                  </div>
                  {emailChanged && <div>
                    <label htmlFor="email-password" className="block text-sm mb-2">Current password to change your email</label>
                    <input id="email-password" type="password" autoComplete="current-password" required value={emailPassword} onChange={(e) => setEmailPassword(e.target.value)} className={inputClass} />
                    <ErrorMessage>{errors.info?.currentPassword}</ErrorMessage>
                  </div>}
                  <ErrorMessage>{errors.info?.general}</ErrorMessage>
                  <button disabled={profileLimit.rateLimitSeconds > 0} className={buttonClass}><Save size={14} />{busy === 'info' ? 'Saving...' : profileLimit.rateLimitSeconds ? `Try again in ${profileLimit.rateLimitSeconds}s` : 'Save changes'}</button>
                </fieldset>
              </form>
              {pendingEmail && <form onSubmit={verifyEmail} className="mt-6 border-t border-slate-200 pt-5 space-y-3">
                <h3 className="font-semibold">Verify your new email</h3>
                <p className="text-sm">Enter the code sent to {pendingEmail}. Your active email is still {user?.email}.</p>
                <fieldset disabled={disabled} className="space-y-3">
                  <label htmlFor="email-code" className="block text-sm">Verification code</label>
                  <input id="email-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={(e) => setCode(e.target.value)} className={inputClass} />
                  <ErrorMessage>{errors.verify?.code || errors.verify?.email}</ErrorMessage>
                  <ErrorMessage>{errors.verify?.general}</ErrorMessage>
                  <button disabled={verificationLimit.rateLimitSeconds > 0} className={buttonClass}>{busy === 'verify' ? 'Verifying...' : verificationLimit.rateLimitSeconds ? `Try again in ${verificationLimit.rateLimitSeconds}s` : 'Verify email'}</button>
                  <label htmlFor="resend-password" className="block text-sm">Current password to request a new code</label>
                  <input id="resend-password" type="password" autoComplete="current-password" value={emailPassword} onChange={(e) => setEmailPassword(e.target.value)} className={inputClass} />
                  <ErrorMessage>{errors.verify?.currentPassword}</ErrorMessage>
                  <button type="button" disabled={!emailPassword || profileLimit.rateLimitSeconds > 0} onClick={resendEmail} className="text-orange font-semibold disabled:opacity-60">{busy === 'resend' ? 'Sending...' : profileLimit.rateLimitSeconds ? `Try again in ${profileLimit.rateLimitSeconds}s` : 'Resend code'}</button>
                </fieldset>
              </form>}
            </section>
            <section className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-charcoal font-display text-base font-semibold mb-2">Change Password</h2>
              <p className="text-sm text-charcoal/60 mb-5">After changing your password, you will need to sign in again.</p>
              <form onSubmit={savePwd}>
                <fieldset disabled={disabled} className="space-y-4">
                  {[{ name: 'currentPassword', label: 'Current Password' }, { name: 'newPassword', label: 'New Password' }, { name: 'confirmPassword', label: 'Confirm New Password' }].map(({ name, label }) => <div key={name}>
                    <label htmlFor={name} className="block text-xs font-semibold uppercase tracking-wide text-charcoal/40 mb-1.5">{label}</label>
                    <div className="relative">
                      <input id={name} name={name} type={showPwd[name] ? 'text' : 'password'} autoComplete={name === 'currentPassword' ? 'current-password' : 'new-password'} required minLength={name === 'currentPassword' ? undefined : 8} value={pwd[name]} onChange={(e) => { setPwd((previous) => ({ ...previous, [name]: e.target.value })); setErrors({}) }} className={`${inputClass} pr-11`} />
                      <button type="button" onClick={() => setShowPwd((previous) => ({ ...previous, [name]: !previous[name] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40" aria-label={`${showPwd[name] ? 'Hide' : 'Show'} ${label.toLowerCase()}`}>{showPwd[name] ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                    </div>
                    <ErrorMessage>{errors.password?.[name]}</ErrorMessage>
                  </div>)}
                  <ErrorMessage>{errors.password?.general}</ErrorMessage>
                  <button disabled={passwordLimit.rateLimitSeconds > 0} className={`${buttonClass} bg-charcoal`}><Save size={14} />{busy === 'password' ? 'Updating...' : passwordLimit.rateLimitSeconds ? `Try again in ${passwordLimit.rateLimitSeconds}s` : 'Update password'}</button>
                </fieldset>
              </form>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
export default Profile