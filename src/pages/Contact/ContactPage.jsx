import { useContactForm } from '../../hooks/useContactForm'
import { useEffect, useState } from 'react'
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'

import { Navbar } from '../../components/layout/Navbar/Navbar'
import { Footer } from '../../components/layout/Footer/Footer'
import { useAuth } from '../../hooks/useAuth'

const email = 'hello@sekjad.com'
const phone = '+2348032071990'
const whatsapp = 'https://wa.me/2349165151867'

export function ContactPage() {
  const { user } = useAuth()
  const { send, sending, sent, error } = useContactForm()
  const [menuOpen, setMenuOpen] = useState(false)
  const [form, setForm] = useState(() => ({
    name: [user?.firstName, user?.lastName].filter(Boolean).join(' '),
    email: user?.email || '',
    subject: '',
    message: '',
  }))

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Contact Us | Sekjad Nig Enterprises'
    return () => { document.title = 'Sekjad Nig Enterprises' }
  }, [])

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }))

  const sendMessage = (event) => {
    event.preventDefault()
    const name = form.name.trim()
    const subject = form.subject.trim()
    const message = form.message.trim()
    if (!name || !form.email.trim() || !subject || !message) return

    send({ name, email: form.email.trim(), subject, message })
  }

  const fieldClass = 'w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-charcoal/35 focus:border-orange focus:ring-2 focus:ring-orange/15'

  return (
    <div className="min-h-screen bg-cream text-ink">
      <Navbar open={menuOpen} setOpen={setMenuOpen} forceScrolledStyle />
      <main>
        <section className="bg-charcoal px-5 pb-16 pt-36 text-white sm:px-8 sm:pb-20 sm:pt-40">
          <div className="mx-auto max-w-7xl">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.35em] text-orange">We are here to help</p>
            <h1 className="font-display text-5xl leading-tight sm:text-6xl lg:text-7xl">Let&apos;s talk <em className="text-orange">fabric.</em></h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base">Questions about an order, finding the right fabric, or planning something special? Reach out to the Sekjad team.</p>
          </div>
        </section>

        <section className="px-5 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-orange">Get in touch</p>
              <h2 className="font-display text-3xl sm:text-4xl">Choose the way that works for you.</h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-charcoal/60">Send us a message or contact us directly. For questions about an existing order, include your order number so we can help faster.</p>

              <div className="mt-9 space-y-4">
                <a href={`mailto:${email}`} className="group flex items-center gap-4 rounded-2xl border border-charcoal/10 bg-white p-5 transition hover:border-orange/40">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-orange/10 text-orange"><Mail size={20} /></span>
                  <span className="min-w-0 flex-1"><span className="block text-xs font-semibold uppercase tracking-widest text-charcoal/45">Email</span><span className="mt-1 block break-all text-sm font-medium">{email}</span></span>
                  <ArrowRight size={17} className="shrink-0 text-orange" />
                </a>
                <a href={`tel:${phone}`} className="group flex items-center gap-4 rounded-2xl border border-charcoal/10 bg-white p-5 transition hover:border-orange/40">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-orange/10 text-orange"><Phone size={20} /></span>
                  <span className="min-w-0 flex-1"><span className="block text-xs font-semibold uppercase tracking-widest text-charcoal/45">Call us</span><span className="mt-1 block text-sm font-medium">+234 803 207 1990</span></span>
                  <ArrowRight size={17} className="shrink-0 text-orange" />
                </a>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-2xl border border-charcoal/10 bg-white p-5 transition hover:border-orange/40">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-orange/10 text-orange"><MessageCircle size={20} /></span>
                  <span className="min-w-0 flex-1"><span className="block text-xs font-semibold uppercase tracking-widest text-charcoal/45">WhatsApp</span><span className="mt-1 block text-sm font-medium">Chat with our team</span></span>
                  <ArrowRight size={17} className="shrink-0 text-orange" />
                </a>
                <div className="flex items-center gap-4 px-5 py-3 text-sm text-charcoal/60"><MapPin size={20} className="shrink-0 text-orange" /><span>Oyo, Nigeria</span></div>
              </div>
            </div>

            <div className="rounded-3xl border border-charcoal/10 bg-white p-6 shadow-sm sm:p-10 lg:p-12">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-orange">Send a message</p>
              <h2 className="font-display text-3xl sm:text-4xl">How can we help?</h2>
              <p className="mt-3 text-sm leading-6 text-charcoal/55">Fill in the details below to send a message to our team.</p>
              <form onSubmit={sendMessage} className="mt-8 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div><label htmlFor="contact-name" className="mb-2 block text-sm font-medium">Full name</label><input id="contact-name" name="name" autoComplete="name" required value={form.name} onChange={update('name')} className={fieldClass} placeholder="Your name" /></div>
                  <div><label htmlFor="contact-email" className="mb-2 block text-sm font-medium">Email address</label><input id="contact-email" name="email" type="email" autoComplete="email" required value={form.email} onChange={update('email')} className={fieldClass} placeholder="you@example.com" /></div>
                </div>
                <div><label htmlFor="contact-subject" className="mb-2 block text-sm font-medium">Subject</label><input id="contact-subject" name="subject" required value={form.subject} onChange={update('subject')} className={fieldClass} placeholder="What is your message about?" /></div>
                <div><label htmlFor="contact-message" className="mb-2 block text-sm font-medium">Message</label><textarea id="contact-message" name="message" rows={6} required value={form.message} onChange={update('message')} className={`${fieldClass} resize-y`} placeholder="Tell us how we can help..." /></div>
                {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
                {sent && <p role="status" className="text-sm text-green-700">Your message has been sent. Thank you for contacting us.</p>}
                <button disabled={sending} type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-dark sm:w-auto">{sending ? 'Sending...' : 'Send Message'} <ArrowRight size={16} /></button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default ContactPage
