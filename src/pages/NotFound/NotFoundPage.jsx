import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Footer } from '../../components/layout/Footer/Footer'
import { Navbar } from '../../components/layout/Navbar/Navbar'

export function NotFoundPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    window.document.title = 'Page Not Found | Sekjad Enterprise'
    return () => { window.document.title = 'Sekjad Enterprise' }
  }, [])

  return (
    <div className="min-h-screen bg-white text-ink">
      <Navbar open={menuOpen} setOpen={setMenuOpen} navBackground="bg-white shadow-sm" forceScrolledStyle />
      <main className="flex min-h-[70vh] items-center justify-center px-5 py-24 sm:px-8">
        <div className="max-w-xl text-center">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-orange">404 · Page not found</p>
          <h1 className="font-display text-4xl font-normal text-ink sm:text-5xl">This page is unavailable</h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-ink/55 sm:text-base">
            The address may be incorrect, or the page may have moved.
          </p>
          <Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d4711f]">
            <ArrowLeft size={16} aria-hidden="true" /> Return home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default NotFoundPage
