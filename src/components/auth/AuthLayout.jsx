import { Link } from 'react-router-dom'
import { Gem, Truck, Sparkles } from 'lucide-react'
import heroImg from '../../assets/images/heroImg.jpg'

const PROMISES = [
  [Gem, '200+ premium fabric designs'],
  [Sparkles, 'Direct from master weavers'],
  [Truck, 'Nationwide delivery in 24–72 hrs'],
]

// const TESTIMONIAL = {
//   quote:
//     "Their Aso Oke collection is extraordinary. Ordered Thursday — delivered Saturday. The best fabric experience I've had.",
// }

export function AuthLayout({ eyebrow, headingLines = [], children }) {
  const [heading, accentHeading] = headingLines

  return (
    <div className="flex min-h-screen bg-white">
      {/* LEFT — brand / hero panel, hidden below lg */}
      <div className="relative hidden w-1/2 shrink-0 overflow-hidden bg-charcoal lg:block">
        <img
          src={heroImg}
          alt="Elegant Nigerian woman in traditional patterned dress"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/50" />

        <div className="relative flex h-full flex-col justify-between p-10 xl:p-12">
          <Link to="/" className="flex flex-col gap-0.5">
            <p className="font-display text-xl font-semibold tracking-tight text-white">Sekjad</p>
            <p className="text-orange text-[9px] font-medium uppercase tracking-[0.3em]">Nig Enterprises</p>
          </Link>

          <div className="max-w-md">
            <p className="text-orange mb-3 text-[10px] font-semibold uppercase tracking-[0.35em]">{eyebrow}</p>
            <h1 className="font-display mb-6 text-4xl font-normal leading-[1.1] text-white xl:text-5xl">
              {heading}
              {accentHeading && (
                <>
                  <br />
                  <em className="font-normal text-cream/90">{accentHeading}</em>
                </>
              )}
            </h1>
            <ul className="space-y-3">
              {PROMISES.map(([Icon, label]) => (
                <li key={label} className="flex items-center gap-3 text-sm text-white/80">
                  <span className="border-orange/30 bg-orange/10 text-orange flex size-7 shrink-0 items-center justify-center rounded-full border">
                    <Icon size={13} strokeWidth={1.75} />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div aria-hidden="true" />
        </div>
      </div>

      {/* RIGHT — form panel */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-10 sm:py-16 lg:w-1/2 lg:px-16 xl:px-20">
        <Link to="/" className="mb-8 flex flex-col gap-0.5 lg:hidden">
          <p className="font-display text-lg font-semibold tracking-tight text-charcoal">Sekjad</p>
          <p className="text-orange text-[9px] font-medium uppercase tracking-[0.3em]">Nig Enterprises</p>
        </Link>

        <div className="mx-auto w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}

export default AuthLayout;
