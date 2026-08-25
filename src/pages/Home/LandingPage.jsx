import { useEffect, useRef, useState } from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useProducts } from '../../hooks/useProducts'
import { useCart } from '../../hooks/useCart'
import { useWishlist } from '../../hooks/useWishlist'
import { formatCurrency } from '../../utils/formatCurrency'
import {
  ArrowLeft,
  ArrowRight,
  Gem,
  Heart,
  Leaf,
  MessageSquare,
  Star,
  Truck,
} from 'lucide-react'
import { Navbar } from '../../components/layout/Navbar/Navbar'
import { Footer } from '../../components/layout/Footer/Footer'
import heroImg from '../../assets/images/heroImg.jpg'
import AsoOke from '../../assets/images/AsoOke.jpg'
import Brocade from '../../assets/images/Brocade.jpg'
import sego from '../../assets/images/sego.jpg'
import lace from '../../assets/images/lace.jpg'

const COLLECTION_ROUTES = {
  'Lace Fabrics':      '/shop?category=lace',
  'Aso Oke':           '/shop?category=aso-oke',
  'Brocade Materials': '/shop?category=brocade',
  'Damask&Sego':       '/shop?category=damask-sego',
  'Senator Material':  '/shop?category=senator',
  'Bridal Wears':      '/shop?category=bridal',
}

const GUEST_PRODUCTS = [
  { id: 'guest-royal-blue-brocade', name: 'Royal Blue Brocade', price: 30000, compareAtPrice: 35000, image: 'https://i.pinimg.com/1200x/e1/f0/e9/e1f0e962fce266ae8745f73c5c0284e3.jpg' },
  { id: 'guest-gold-beaded-lace', name: 'Gold Beaded Lace', price: 50000, compareAtPrice: null, image: 'https://i.pinimg.com/1200x/b9/4e/54/b94e54ecf54f780dffd36325ef247542.jpg' },
  { id: 'guest-3d-sego', name: '3D Sego', price: 40000, compareAtPrice: null, image: 'https://i.pinimg.com/1200x/dd/c6/0d/ddc60d6a5d42c1424291bc13d5a6cd65.jpg' },
  { id: 'guest-swiss-lace-set', name: 'Swiss Lace Set', price: 65000, compareAtPrice: null, image: 'https://i.pinimg.com/1200x/3b/8c/1c/3b8c1c7103ce2f9e3da28ca26ddb5145.jpg' },
  { id: 'guest-deep-navy-senator', name: 'Deep Navy Senator', price: 18500, compareAtPrice: null, image: 'https://i.pinimg.com/1200x/89/57/3d/89573de8bb6ce6ce53190277715c56ca.jpg' },
  { id: 'guest-vintage-aso-oke', name: 'Vintage Aso Oke', price: 35000, compareAtPrice: 95000, image: 'https://i.pinimg.com/736x/e1/f2/e8/e1f2e8d9246bff8d9a245399a08e8ffe.jpg' },
]

export function LandingPage() {
  const { isAuthenticated, user } = useAuth()
  const { data: featuredData, isLoading: featuredLoading, isError: featuredError } = useProducts(
    { isFeatured: true, limit: 6, sort: '-createdAt' },
    { enabled: isAuthenticated },
  )
  const { data: latestData } = useProducts(
    { limit: 5, sort: '-createdAt' },
    { enabled: isAuthenticated },
  )
  const { addToCart } = useCart()
  const { isWishlisted, toggle: toggleWishlist } = useWishlist()
  const featuredProducts = isAuthenticated ? (featuredData?.items ?? []) : GUEST_PRODUCTS
  const latestProducts = isAuthenticated ? (latestData?.items ?? []) : GUEST_PRODUCTS.slice(0, 5)

  const collections = [
    { name: 'Lace Fabrics',      tagline: 'French & Swiss elegance',      img: lace    },
    { name: 'Aso Oke',           tagline: 'Handwoven Yoruba heritage',     img: AsoOke  },
    { name: 'Brocade Materials', tagline: 'Delta & Igbo tradition',        img: Brocade },
    { name: 'Damask&Sego',       tagline: 'Bold African excellence',       img: sego    },
    { name: 'Senator Material',  tagline: 'Premium menswear distinction',  img: 'https://i.pinimg.com/1200x/9e/78/3d/9e783deae2a8315cef285ce0e7eb6a76.jpg' },
    { name: 'Bridal Wears',      tagline: 'Your perfect wedding vision',   img: 'https://i.pinimg.com/1200x/fa/bb/21/fabb21f89c9c1298e47ae5f7b4eba717.jpg'  },
  ]

  const promises = [
    { title: 'Premium Quality',    description: 'Every yard is hand-selected by our master fabric curators.',     icon: Gem          },
    { title: 'Authentic Sourcing', description: 'Direct from master weavers and mills across Nigeria.',           icon: Leaf         },
    { title: 'Express Delivery',   description: 'Nationwide delivery within 24–72 hours and worldwide shipping.', icon: Truck        },
    { title: 'Expert Guidance',    description: 'Fabric specialists are available daily to help you choose.',     icon: MessageSquare },
  ]

  const testimonials = [
    { name: 'Adaeze Okonkwo',   location: 'Lagos, Nigeria',         text: 'Sekjad transformed my wedding day. The bridal lace was absolutely stunning and the quality was truly unmatched.',  img: 'https://images.unsplash.com/photo-1783606599598-1a2ea0c8f1e5?w=120&h=120&fit=crop&auto=format&q=80' },
    { name: 'Chisom Eze',       location: 'Abuja, Nigeria',         text: 'I have ordered George fabric from Sekjad for three years. The quality and service are consistently excellent.',     img: 'https://images.unsplash.com/photo-1687052093309-7a14efa58ecb?w=120&h=120&fit=crop&auto=format&q=80' },
    { name: 'Folake Babatunde', location: 'Port Harcourt, Nigeria', text: 'Their Aso Oke collection is extraordinary. My order arrived quickly and received so many compliments.',            img: 'https://images.unsplash.com/photo-1651616292466-8cfdac43e8b5?w=120&h=120&fit=crop&auto=format&q=80' },
  ]

  const SOCIAL_LINKS = [
    { Icon: FaInstagram, title: 'Instagram', href: 'https://instagram.com/your_username' },
    { Icon: FaFacebookF, title: 'Facebook',  href: 'https://facebook.com/your_page'     },
    { Icon: FaTiktok,    title: 'TikTok',    href: 'https://tiktok.com/@your_username'  },
    { Icon: FaWhatsapp,  title: 'WhatsApp',  href: 'https://wa.me/234XXXXXXXXXX'        },
  ]

  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredCollection, setHoveredCollection] = useState(null)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [testimonialChanging, setTestimonialChanging] = useState(false)
  const [whatsAppVisible, setWhatsAppVisible] = useState(false)
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [contactSubmitted, setContactSubmitted] = useState(false)
  const productScroller = useRef(null)

  const scrollProducts = (direction) => productScroller.current?.scrollBy({ left: direction * 330, behavior: 'smooth' })
  const changeTestimonial = (index) => {
    if (index !== activeTestimonial) {
      setTestimonialChanging(true)
      window.setTimeout(() => { setActiveTestimonial(index); setTestimonialChanging(false) }, 300)
    }
  }
  const submitContactForm = (event) => {
    event.preventDefault()
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) return
    console.log('Contact form payload:', contactForm)
    setContactSubmitted(true)
  }

  const setupTestimonialTimer = () =>
    ((timer) => () => window.clearInterval(timer))(
      window.setInterval(() => {
        setTestimonialChanging(true)
        window.setTimeout(() => {
          setActiveTestimonial((current) => (current + 1) % testimonials.length)
          setTestimonialChanging(false)
        }, 300)
      }, 6000)
    )
  const setupWhatsAppVisibility = () =>
    ((fn) => (fn(), window.addEventListener('scroll', fn, { passive: true }), () => window.removeEventListener('scroll', fn)))(
      () => setWhatsAppVisible(window.scrollY > 200)
    )

  useEffect(setupTestimonialTimer, [testimonials.length])
  useEffect(setupWhatsAppVisibility, [])

  const testimonial = testimonials[activeTestimonial]

  // Derived route helpers — single source of truth for auth-conditional links
  const shopRoute      = (path) => isAuthenticated ? path : '/register'
  const productRoute   = (id) => isAuthenticated ? `/shop/product/${id}` : '/register'

  return (
    <div className="min-h-screen bg-white">
      {/* Announcement bar */}
      {/* <div className="bg-charcoal fixed inset-x-0 top-0 z-50 px-4 py-2 text-center text-xs tracking-wide text-white">
        <span className="hidden opacity-80 sm:inline">🎁 Free delivery on orders above </span>
        <span className="sm:hidden opacity-80">🎁 Free delivery above </span>
        <span className="text-orange font-semibold">₦50,000</span>
        <span className="hidden opacity-80 sm:inline"> &nbsp;|&nbsp; </span>
        <Link className="ml-2 underline underline-offset-2 opacity-80 transition-opacity hover:opacity-100 sm:ml-0" to={shopRoute('/shop')}>Shop Now →</Link>
      </div> */}

      <Navbar
        open={menuOpen}
        setOpen={setMenuOpen}
        isAuthenticated={isAuthenticated}
        user={user}
      />

      <main>
        {/* ── HERO ── */}
        <section id="top" className="bg-charcoal relative h-screen min-h-[560px] overflow-hidden sm:min-h-[640px]">
          <img src={heroImg} alt="Elegant Nigerian woman in traditional patterned dress" className="absolute inset-0 h-full w-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
          <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 sm:px-10 lg:items-center lg:px-16">
            <div className="max-w-lg pb-20 lg:pb-0">
              <h1 className="font-display mb-6 text-3xl font-normal leading-[1.1] text-white sm:text-4xl sm:leading-[1.05] lg:text-6xl">
                Where Elegance<br /><em className="text-cream/90 font-normal">Meets Tradition</em>
              </h1>
              <p className="mb-8 max-w-sm text-sm leading-relaxed text-white/65 sm:mb-10 sm:text-base lg:text-lg">
                Nigeria&apos;s finest Lace, Aso Oke, George, Ankara and luxury bridal fabrics—curated for those who demand excellence.
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {/* Always scrolls to collections on this page */}
                <a href="#collections" className="bg-orange rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:bg-[#d4711f] sm:px-8 sm:py-4">
                  Explore Collections
                </a>

                {/*
                  NOT authenticated → "Create Account" → /register
                  Authenticated     → "Our Story"      → #about-us
                */}
                {isAuthenticated ? (
                  <a href="#about-us" className="rounded-full border border-white/40 px-6 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:bg-white/10 sm:px-8 sm:py-4">
                    Our Story
                  </a>
                ) : (
                  <Link to="/register" className="rounded-full border border-white/40 px-6 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:bg-white/10 sm:px-8 sm:py-4">
                    Create Account
                  </Link>
                )}
              </div>
              <div className="mt-10 flex gap-8 sm:mt-12">
                {[['15+', 'Years in Business'], ['200+', 'Fabric Designs']].map(([value, label]) => (
                  <div key={label}>
                    <p className="font-display text-xl font-semibold text-white sm:text-2xl">{value}</p>
                    <p className="mt-0.5 text-xs text-white/45">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── COLLECTIONS ── */}
        <section id="collections" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-20 lg:scroll-mt-28 lg:py-28">
          <div className="mb-10 text-center sm:mb-12">
            <p className="text-orange mb-3 text-[10px] font-semibold uppercase tracking-[0.35em]">What We Offer</p>
            <h2 className="font-display text-ink text-3xl font-normal sm:text-4xl lg:text-5xl">Our Collections</h2>
            <div className="bg-orange mx-auto mt-5 h-0.5 w-10 rounded-full" />
          </div>
          <div className="grid auto-rows-[220px] grid-cols-1 gap-4 sm:auto-rows-[240px] sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection, index) => (
              // Authenticated → real category page | Guest → /register
              <Link
                key={collection.name}
                to={isAuthenticated ? COLLECTION_ROUTES[collection.name] : '/register'}
                className={`group relative overflow-hidden rounded-2xl bg-stone-200 ${index === 0 ? 'sm:row-span-2' : ''}`}
                onMouseEnter={() => setHoveredCollection(index)}
                onMouseLeave={() => setHoveredCollection(null)}
              >
                <img
                  src={collection.img}
                  alt={collection.name}
                  className={`h-full w-full object-cover transition duration-700 ${hoveredCollection === index ? 'scale-105' : 'scale-100'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                  <h3 className="font-display text-xl sm:text-2xl">{collection.name}</h3>
                  <p className="mt-1 text-xs text-white/55 transition-all duration-300">{collection.tagline}</p>
                  <div className="mt-3 flex items-center gap-1.5 transition-all duration-300">
                    {/* Label hint changes too so guests know they need to sign up */}
                    <span className="text-orange text-xs font-semibold tracking-wide">
                      {isAuthenticated ? 'Browse' : 'Sign up to browse'}
                    </span>
                    <ArrowRight className="text-orange" size={14} aria-hidden="true" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── FEATURED PRODUCTS ── */}
        <section id="featured-products" className="bg-cream scroll-mt-24 py-16 sm:py-20 lg:scroll-mt-28 lg:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-10 flex items-end justify-between sm:mb-12">
              <div>
                <p className="text-orange mb-3 text-[10px] font-semibold uppercase tracking-[0.35em]">Handpicked For You</p>
                <h2 className="font-display text-ink text-3xl font-normal sm:text-4xl lg:text-5xl">Featured Products</h2>
              </div>
              <div className="hidden gap-2 sm:flex">
                <button className="grid size-11 place-items-center rounded-full border border-stone-300 transition hover:border-orange-400" onClick={() => scrollProducts(-1)} type="button" aria-label="Previous products">
                  <ArrowLeft size={18} />
                </button>
                <button className="grid size-11 place-items-center rounded-full border border-stone-300 transition hover:border-orange-400" onClick={() => scrollProducts(1)} type="button" aria-label="Next products">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
            <div ref={productScroller} className="flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none]">
              {isAuthenticated && featuredLoading && (
                <p className="py-16 text-sm text-charcoal/50">Loading featured products…</p>
              )}
              {isAuthenticated && featuredError && (
                <p className="py-16 text-sm text-red-600">Could not load featured products.</p>
              )}
              {isAuthenticated && !featuredLoading && !featuredError && featuredProducts.length === 0 && (
                <p className="py-16 text-sm text-charcoal/50">No featured products yet.</p>
              )}
              {featuredProducts.map((product) => {
                const wishlisted = isWishlisted(product.id)
                return (
                <article key={product.id} className="w-[230px] shrink-0 snap-start sm:w-[260px] lg:w-[290px]">
                  <Link to={productRoute(product.id)} className="group relative block h-[300px] overflow-hidden rounded-xl bg-stone-200 sm:h-[350px]">
                    <img className="h-full w-full object-cover transition duration-700 group-hover:scale-105" src={product.image} alt={product.name} />
                    <button
                      className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white shadow-sm"
                      onClick={(event) => { event.preventDefault(); toggleWishlist(product) }}
                      type="button"
                      aria-label={`Save ${product.name}`}
                    >
                      <Heart size={17} fill={wishlisted ? '#E67E22' : 'none'} color={wishlisted ? '#E67E22' : '#374151'} />
                    </button>
                  </Link>
                  <Link to={productRoute(product.id)} className="text-ink hover:text-orange mt-4 mb-2 block text-sm font-semibold transition-colors">
                    {product.name}
                  </Link>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-orange font-bold">{formatCurrency(product.price)}</span>
                    {product.compareAtPrice && <span className="text-sm text-gray-400 line-through">{formatCurrency(product.compareAtPrice)}</span>}
                  </div>
                  <button className="bg-charcoal hover:bg-orange w-full rounded-full py-3 text-xs font-semibold tracking-wide text-white transition" onClick={() => addToCart(product)} type="button">
                    Add to Cart
                  </button>
                </article>
              )})}
            </div>
            <div className="mt-10 text-center">
              <Link to={shopRoute('/shop')} className="text-charcoal border-charcoal/20 hover:border-charcoal/50 inline-flex items-center gap-2 rounded-full border px-8 py-3.5 text-sm font-medium transition-colors">
                View all products <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE SEKJAD ── */}
        <section className="bg-charcoal py-16 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-12 text-center sm:mb-16">
              <p className="text-orange mb-3 text-[10px] font-semibold uppercase tracking-[0.35em]">Our Promise</p>
              <h2 className="font-display text-3xl font-normal text-white sm:text-4xl lg:text-5xl">Why Choose Sekjad</h2>
            </div>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {promises.map(({ title, description, icon: PromiseIcon }) => (
                <div key={title} className="text-center">
                  <div className="border-orange/25 bg-orange/5 text-orange mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl border">
                    <PromiseIcon size={22} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display mb-3 text-xl font-medium text-white">{title}</h3>
                  <p className="text-sm leading-relaxed text-white/45">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LATEST ARRIVALS ── */}
        <section id="new-arrivals" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-20 lg:scroll-mt-28 lg:py-28">
          <div className="mb-10 sm:mb-12">
            <p className="text-orange mb-3 text-[10px] font-semibold uppercase tracking-[0.35em]">Just Arrived</p>
            <h2 className="font-display text-ink text-3xl font-normal sm:text-4xl lg:text-5xl">Latest Arrivals</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5 lg:gap-5">
            {latestProducts.map((product, index) => (
              <article key={product.id} className="group">
                <div className={`relative mb-3 overflow-hidden rounded-xl bg-stone-200 sm:mb-4 ${index % 2 === 0 ? 'h-[220px] sm:h-[300px]' : 'h-[190px] sm:h-[260px]'}`}>
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <Link
                    to={productRoute(product.id)}
                    className="text-charcoal hover:bg-orange absolute inset-x-3 bottom-3 rounded-full bg-white py-2.5 text-center text-xs font-semibold opacity-0 shadow-sm transition group-hover:opacity-100 hover:text-white"
                  >
                    Quick Add
                  </Link>
                </div>
                <Link to={productRoute(product.id)} className="text-ink hover:text-orange mb-1 block text-sm font-medium transition-colors">
                  {product.name}
                </Link>
                <span className="text-orange font-bold">{formatCurrency(product.price)}</span>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to={shopRoute('/shop?sort=newest')} className="bg-orange inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#d4711f]">
              See all new arrivals <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* ── ABOUT / OUR STORY ── */}
        <section id="about-us" className="bg-cream relative scroll-mt-24 overflow-hidden lg:h-[480px] lg:scroll-mt-28">
          <div className="flex h-full flex-col lg:flex-row">
            <div className="h-56 overflow-hidden bg-stone-200 sm:h-72 lg:h-full lg:w-1/2">
              <img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1687052034884-391a9e5ea8dd?w=800&h=600&fit=crop&auto=format&q=80" alt="Traditional Nigerian fabric artisan" />
            </div>
            <div className="flex items-center px-6 py-10 sm:px-8 sm:py-14 lg:w-1/2 lg:px-16">
              <div className="max-w-md">
                <p className="text-orange mb-4 text-[10px] font-semibold uppercase tracking-[0.35em]">Our Heritage</p>
                <h2 className="font-display text-ink mb-5 text-2xl font-normal leading-tight sm:text-3xl lg:text-4xl">
                  Fifteen Years of<br /><em>Fabric Excellence</em>
                </h2>
                <p className="text-ink/55 mb-5 text-sm leading-relaxed">Founded in Lagos in 2009, Sekjad Nig Enterprises was born from a belief that every Nigerian deserves access to the finest traditional fabrics.</p>
                <p className="text-ink/55 mb-7 text-sm leading-relaxed">We partner directly with master weavers across Yorubaland, Igboland, and the Niger Delta.</p>
                <Link to="/about-us" className="text-orange border-orange/30 hover:border-orange inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors">
                  Read our full story <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="bg-cream py-16 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
            <p className="text-orange mb-3 text-[10px] font-semibold uppercase tracking-[0.35em]">Testimonials</p>
            <h2 className="font-display text-ink mb-10 text-3xl font-normal sm:mb-12 sm:text-4xl lg:text-5xl">Loved by Thousands</h2>
            <div className="mb-6 flex justify-center gap-1 sm:mb-7">
              {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={18} fill="#E67E22" color="#E67E22" />)}
            </div>
            <blockquote
              className="font-display text-ink/80 mb-8 min-h-28 text-lg italic leading-relaxed transition duration-300 sm:text-xl lg:text-2xl"
              style={{ opacity: testimonialChanging ? 0 : 1 }}
            >
              "{testimonial.text}"
            </blockquote>
            <div className="mb-8 flex items-center justify-center gap-4">
              <img src={testimonial.img} alt={testimonial.name} className="ring-orange/20 size-12 rounded-full object-cover ring-2" />
              <div className="text-left">
                <p className="text-ink text-sm font-semibold">{testimonial.name}</p>
                <p className="text-ink/40 text-xs">{testimonial.location}</p>
              </div>
            </div>
            <div className="flex justify-center gap-2">
              {testimonials.map((item, index) => (
                <button key={item.name} onClick={() => changeTestimonial(index)} className={`h-2 rounded-full transition-all ${index === activeTestimonial ? 'bg-orange w-7' : 'w-2 bg-stone-300'}`} type="button" aria-label={`Show testimonial from ${item.name}`} />
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="relative scroll-mt-24 overflow-hidden bg-[#1a1a2e] py-20 lg:scroll-mt-28 lg:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="mb-14 text-center sm:mb-16">
              <p className="text-orange mb-4 text-[10px] font-semibold uppercase tracking-[0.35em]">Get In Touch</p>
              <h2 className="font-display mb-4 text-3xl font-normal text-white sm:text-4xl lg:text-5xl">Visit or Contact Us</h2>
              <p className="mx-auto max-w-md text-sm leading-relaxed text-white/45">
                Have a question about a fabric, a bulk order, or a bespoke request? Our team is ready to help.
              </p>
            </div>
            <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
              <div className="lg:col-span-2">
                <div className="space-y-7">
                  <div className="flex gap-4">
                    <span className="border-orange/25 bg-orange/10 text-orange flex size-11 shrink-0 items-center justify-center rounded-xl border"><MapPin size={18} strokeWidth={1.75} /></span>
                    <div>
                      <h3 className="mb-1 text-sm font-semibold text-white">Showroom Address</h3>
                      <p className="text-sm leading-relaxed text-white/45">14 Balogun Street, Idumota Market<br />Lagos Island, Lagos, Nigeria</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="border-orange/25 bg-orange/10 text-orange flex size-11 shrink-0 items-center justify-center rounded-xl border"><Phone size={18} strokeWidth={1.75} /></span>
                    <div>
                      <h3 className="mb-1 text-sm font-semibold text-white">Phone</h3>
                      <a href="tel:+2348001234523" className="block text-sm text-white/45 transition hover:text-orange">+234 800 SEKJAD</a>
                      <a href="tel:+2349165151867" className="block text-sm text-white/45 transition hover:text-orange">+234 916 515 1867</a>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="border-orange/25 bg-orange/10 text-orange flex size-11 shrink-0 items-center justify-center rounded-xl border"><Mail size={18} strokeWidth={1.75} /></span>
                    <div>
                      <h3 className="mb-1 text-sm font-semibold text-white">Email</h3>
                      <a href="mailto:hello@sekjad.com" className="block text-sm text-white/45 transition hover:text-orange">hello@sekjad.com</a>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="border-orange/25 bg-orange/10 text-orange flex size-11 shrink-0 items-center justify-center rounded-xl border"><Clock size={18} strokeWidth={1.75} /></span>
                    <div>
                      <h3 className="mb-1 text-sm font-semibold text-white">Business Hours</h3>
                      <p className="text-sm leading-relaxed text-white/45">Mon – Sat: 8:00am – 7:00pm<br />Sunday: Closed</p>
                    </div>
                  </div>
                </div>
                <div className="mt-9 border-t border-white/10 pt-7">
                  <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">Follow Us</h3>
                  <div className="flex items-center gap-3">
                    {SOCIAL_LINKS.map(({ Icon, title, href }) => (
                      <a key={title} href={href} target="_blank" rel="noopener noreferrer" aria-label={title} title={title}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/50 transition-all duration-200 hover:-translate-y-1 hover:border-orange hover:bg-orange hover:text-white">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-3">
                {contactSubmitted ? (
                  <div className="bg-orange/10 border-orange/25 flex h-full flex-col items-center justify-center rounded-2xl border px-8 py-14 text-center">
                    <p className="font-display text-orange mb-2 text-2xl font-medium">Message sent!</p>
                    <p className="max-w-xs text-sm text-white/50">Thanks for reaching out — our team will get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={submitContactForm} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                    <div className="mb-5 grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-white/40">Full Name</label>
                        <input type="text" required value={contactForm.name} onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))} placeholder="Your name"
                          className="focus:border-orange/60 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25" />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-white/40">Email Address</label>
                        <input type="email" required value={contactForm.email} onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))} placeholder="you@example.com"
                          className="focus:border-orange/60 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25" />
                      </div>
                    </div>
                    <div className="mb-5">
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-white/40">Phone Number <span className="normal-case text-white/25">(optional)</span></label>
                      <input type="tel" value={contactForm.phone} onChange={(e) => setContactForm((p) => ({ ...p, phone: e.target.value }))} placeholder="080X XXX XXXX"
                        className="focus:border-orange/60 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25" />
                    </div>
                    <div className="mb-6">
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-white/40">Message</label>
                      <textarea required rows={4} value={contactForm.message} onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))} placeholder="Tell us what you're looking for..."
                        className="focus:border-orange/60 w-full resize-none rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25" />
                    </div>
                    <button type="submit" className="bg-orange w-full rounded-full py-3.5 text-sm font-semibold text-white transition hover:bg-[#d4711f] sm:w-auto sm:px-10">
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <a href="https://wa.me/2349165151867" target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp"
        className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 flex h-12 w-12 items-center justify-center sm:h-14 sm:w-14 rounded-full bg-green-500 text-white shadow-lg transition-all duration-300 ease-out hover:bg-green-600 ${
          whatsAppVisible ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-[0.8] translate-y-5 pointer-events-none'
        }`}
      >
        <FaWhatsapp className="h-6 w-6 sm:h-7 sm:w-7" />
      </a>
    </div>
  )
}

export default LandingPage
