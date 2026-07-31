import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
} from 'react-icons/fa'

const FOOTER_LINKS = {
  Shop: ['Lace Fabrics', 'Aso Oke', 'Brocade', 'Damask&Sego', 'Senator Material', 'Bridal Fabrics'],
  Company: ['About Us', 'Our Story', 'Blog', 'Press', 'Careers'],
  Support: ['Contact Us', 'FAQs', 'Shipping Policy', 'Returns', 'Size Guide'],
}

const SOCIAL_LINKS = [
  {
    Icon: FaInstagram,
    title: 'Instagram',
    href: 'https://instagram.com/your_username',
  },
  {
    Icon: FaFacebookF,
    title: 'Facebook',
    href: 'https://facebook.com/your_page',
  },
  {
    Icon: FaTiktok,
    title: 'TikTok',
    href: 'https://tiktok.com/@your_username',
  },
  {
    Icon: FaWhatsapp,
    title: 'WhatsApp',
    href: 'https://wa.me/234XXXXXXXXXX',
  },
]

export function Footer() {
  return (
    <footer className="bg-[#0d0d1a] px-5 py-12  sm:px-8 sm:py-16">
      <div className="mx-auto max-w-7xl ">
        <div className="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 justify-between">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-display mb-0.5 text-2xl font-normal text-white">Sekjad</p>
            <p className="text-orange mb-5 text-[9px] uppercase tracking-[0.3em]">Nig Enterprises</p>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-white/35">
              Nigeria&apos;s most trusted destination for premium traditional fabrics.
              Serving customers across Nigeria and the diaspora since 2009.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ Icon, title, href }) => (
                <a
                  key={title}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={title}
                  title={title}
                  className="
                    flex h-10 w-10 items-center justify-center
                    rounded-full border border-gray-600
                    text-gray-600 transition-all duration-200
                    hover:-translate-y-1 hover:border-orange-500
                    hover:bg-orange-500 hover:text-white
                  "
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-white">{heading}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a className="hover:text-orange text-sm text-white/35 transition-colors" href="#top">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/25">© 2026 Sekjad Nig Enterprises. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-center text-xs text-white/25 sm:gap-5">
            <span>📍 Oyo, Nigeria</span>
            <span>☎ +2348032071990 </span>
          </div>
          <div className="flex gap-5">
            <a className="text-xs text-white/25 transition-colors hover:text-white/50" href="#top">Privacy</a>
            <a className="text-xs text-white/25 transition-colors hover:text-white/50" href="#top">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
