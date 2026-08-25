import { useEffect, useState } from 'react'
import { ArrowRight, Check, Gem, HeartHandshake, Leaf, MapPin, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Navbar } from '../../components/layout/Navbar/Navbar'
import { Footer } from '../../components/layout/Footer/Footer'
import heroImg from '../../assets/images/heroImg.jpg'
import AsoOke from '../../assets/images/AsoOke.jpg'
import Brocade from '../../assets/images/Brocade.jpg'

const values = [
  {
    icon: Gem,
    title: 'Quality without compromise',
    copy: 'Every fabric is carefully assessed for its finish, colour, weight, and craftsmanship before it reaches you.',
  },
  {
    icon: Leaf,
    title: 'Rooted in authenticity',
    copy: 'We honour the stories behind Nigerian textiles by sourcing thoughtfully and celebrating their true character.',
  },
  {
    icon: HeartHandshake,
    title: 'Service that feels personal',
    copy: 'From one special outfit to a full celebration, our team helps you find a fabric that feels distinctly yours.',
  },
]

const milestones = [
  { year: '2009', text: 'Sekjad begins with a simple commitment to exceptional traditional fabrics.' },
  { year: '2015', text: 'Our growing collection reaches customers and designers across Nigeria.' },
  { year: '2020', text: 'Personal shopping and nationwide delivery make our expertise easier to access.' },
  { year: 'Today', text: 'We serve a global community while staying true to quality, heritage, and care.' },
]

export function AboutPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'About Us | Sekjad Nig Enterprises'
    return () => { document.title = 'Sekjad Nig Enterprises' }
  }, [])

  return (
    <div className="min-h-screen bg-white text-ink">
      <Navbar open={menuOpen} setOpen={setMenuOpen} />

      <main>
        <section className="relative flex min-h-[680px] items-end overflow-hidden bg-charcoal pt-24 sm:min-h-[720px]">
          <img src={heroImg} alt="A rich selection of premium Nigerian fabrics" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#11131b]/95 via-[#11131b]/70 to-[#11131b]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11131b]/75 via-transparent to-[#11131b]/20" />

          <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 sm:pb-20 lg:pb-24">
            <div className="max-w-3xl animate-fade-up">
              <p className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-orange">
                <span className="h-px w-10 bg-orange" /> Our story
              </p>
              <h1 className="font-display text-5xl font-normal leading-[0.98] text-white sm:text-6xl lg:text-8xl">
                Woven with heritage.<br /><em className="text-orange">Chosen with care.</em>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
                For over fifteen years, Sekjad has connected people to beautiful Nigerian textiles—one carefully chosen fabric at a time.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-cream py-16 sm:py-24 lg:py-32">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div className="relative mx-auto w-full max-w-xl pb-12 pr-8 sm:pb-16 sm:pr-14">
              <div className="h-[430px] overflow-hidden rounded-[2rem] bg-stone-200 sm:h-[570px]">
                <img src={AsoOke} alt="Colourful authentic Aso Oke fabric" className="h-full w-full object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 w-44 rounded-2xl border border-white/70 bg-white p-5 shadow-xl sm:w-56 sm:p-7">
                <p className="font-display text-4xl text-orange sm:text-5xl">15+</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/50">Years of fabric excellence</p>
              </div>
            </div>

            <div>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-orange">Where it began</p>
              <h2 className="font-display text-4xl font-normal leading-tight text-ink sm:text-5xl lg:text-6xl">
                More than fabric.<br /><em>A part of your story.</em>
              </h2>
              <div className="mt-7 space-y-5 text-sm leading-7 text-ink/60 sm:text-base">
                <p>Sekjad Nig Enterprises began in 2009 with a love for the artistry, identity, and celebration held within Nigerian textiles.</p>
                <p>What started as a trusted local fabric destination has grown into a home for carefully selected lace, Aso Oke, brocade, damask, senator materials, and bridal fabrics—serving customers across Nigeria and beyond.</p>
                <p>We believe choosing fabric should feel inspiring, not overwhelming. That is why our work pairs deep product knowledge with warm, honest guidance.</p>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {['Carefully selected pieces', 'Trusted fabric guidance', 'Nationwide delivery', 'Collections for every occasion'].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-medium text-charcoal">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-orange/10 text-orange"><Check size={13} strokeWidth={2.5} /></span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-12 max-w-2xl sm:mb-16">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-orange">What guides us</p>
              <h2 className="font-display text-4xl font-normal text-ink sm:text-5xl">The values in every yard</h2>
            </div>
            <div className="grid gap-px overflow-hidden rounded-3xl border border-stone-200 bg-stone-200 md:grid-cols-3">
              {values.map(({ icon: Icon, title, copy }, index) => (
                <article key={title} className="group bg-white p-8 transition-colors hover:bg-cream sm:p-10 lg:p-12">
                  <div className="mb-8 flex items-start justify-between">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-orange/10 text-orange"><Icon size={22} strokeWidth={1.6} /></span>
                    <span className="font-display text-sm text-charcoal/25">0{index + 1}</span>
                  </div>
                  <h3 className="font-display mb-4 text-2xl text-ink">{title}</h3>
                  <p className="text-sm leading-7 text-ink/55">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-charcoal py-16 sm:py-24 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-orange">Our journey</p>
              <h2 className="font-display text-4xl font-normal leading-tight text-white sm:text-5xl">From a local vision to a global community.</h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-white/45">Our story keeps growing, but the promise at its heart remains the same: beautiful, authentic fabrics and service you can trust.</p>
            </div>
            <div className="space-y-0">
              {milestones.map(({ year, text }, index) => (
                <div key={year} className="grid grid-cols-[72px_1fr] gap-5 border-b border-white/10 py-7 first:pt-0 sm:grid-cols-[100px_1fr]">
                  <p className="font-display text-xl text-orange sm:text-2xl">{year}</p>
                  <div>
                    <p className="text-sm leading-7 text-white/60 sm:text-base">{text}</p>
                    {index === milestones.length - 1 && <Sparkles className="mt-4 text-orange" size={18} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-cream py-16 sm:py-24 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 lg:grid-cols-2">
            <div className="relative min-h-[420px] overflow-hidden rounded-3xl sm:min-h-[540px]">
              <img src={Brocade} alt="Premium brocade fabric from the Sekjad collection" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-orange">Our collection</p>
                <h2 className="font-display text-3xl text-white sm:text-4xl">Made for life&apos;s remarkable moments.</h2>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-3xl bg-white p-8 sm:p-12 lg:p-14">
              <div>
                <MapPin className="mb-8 text-orange" size={32} strokeWidth={1.4} />
                <p className="font-display text-3xl leading-snug text-ink sm:text-4xl">“Our greatest joy is helping you find the fabric that makes an occasion unforgettable.”</p>
                <p className="mt-6 text-sm font-semibold text-charcoal">The Sekjad Team</p>
                <p className="mt-1 text-xs text-charcoal/45">Oyo, Nigeria</p>
              </div>
              <div className="mt-12 flex flex-col gap-3 sm:flex-row">
                <Link to="/shop" className="inline-flex items-center justify-center gap-2 rounded-full bg-orange px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#d4711f]">
                  Explore our fabrics <ArrowRight size={15} />
                </Link>
                <Link to="/home#contact" className="inline-flex items-center justify-center rounded-full border border-charcoal/20 px-7 py-3.5 text-sm font-semibold text-charcoal transition hover:border-charcoal/50">
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default AboutPage
