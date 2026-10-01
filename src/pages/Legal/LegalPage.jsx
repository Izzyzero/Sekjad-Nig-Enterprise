import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Footer } from '../../components/layout/Footer/Footer'
import { Navbar } from '../../components/layout/Navbar/Navbar'

const LEGAL_DOCUMENTS = {
  terms: {
    title: 'Terms of Service',
    lastUpdated: 'September 30, 2026',
    intro: [
      'Welcome to Sekjad Nigeria Enterprises ("Sekjad", "we", "us", or "our"). These Terms of Service ("Terms") govern your use of the Sekjad website, products, services, and related features.',
      'By accessing or using our website, you agree to these Terms. If you do not agree with any part of these Terms, please do not use our website.',
    ],
    sections: [
      {
        title: 'About Sekjad',
        blocks: [
          { type: 'paragraph', text: 'Sekjad Nigeria Enterprises is an online platform for browsing and ordering fashion and textile materials, including Lace Fabrics, Aso Oke, Damask & Sego, Brocade Materials, Senator Materials, and Bridal materials.' },
          { type: 'paragraph', text: 'Our website allows customers to view products, add products to a cart, and submit orders through WhatsApp.' },
        ],
      },
      {
        title: 'Using Our Website',
        blocks: [
          { type: 'paragraph', text: 'You agree to use the website only for lawful purposes. You must not:' },
          { type: 'list', items: [
            'Use the website for fraudulent or illegal activities.',
            'Attempt to gain unauthorized access to our systems or accounts.',
            'Interfere with the operation or security of the website.',
            'Submit false or misleading information.',
            'Copy, reproduce, or commercially exploit our website content without permission.',
          ] },
          { type: 'paragraph', text: 'We reserve the right to restrict or terminate access to the website where we reasonably believe these Terms have been violated.' },
        ],
      },
      {
        title: 'User Accounts',
        blocks: [
          { type: 'paragraph', text: 'Some features may require you to create an account.' },
          { type: 'paragraph', text: 'When creating an account, you agree to provide accurate and up-to-date information and to keep your login credentials secure.' },
          { type: 'paragraph', text: 'You are responsible for activities performed through your account.' },
          { type: 'paragraph', text: 'If you believe that your account has been accessed without authorization, please contact us immediately.' },
        ],
      },
      {
        title: 'Products and Product Information',
        blocks: [
          { type: 'paragraph', text: 'We make reasonable efforts to ensure that product names, descriptions, images, prices, and other information displayed on the website are accurate. However:' },
          { type: 'list', items: [
            'Product colors may appear differently depending on your device or screen.',
            'Product images may not perfectly represent the actual material.',
            'Product availability may change without notice.',
            'We may correct errors in product descriptions, prices, or other information.',
          ] },
          { type: 'paragraph', text: 'Displaying a product on our website does not guarantee that the product will be available when you place an order.' },
        ],
      },
      {
        title: 'Orders',
        blocks: [
          { type: 'paragraph', text: 'When you add products to your cart and select "Order via WhatsApp", your selected products and relevant order information may be transferred to WhatsApp so that our staff can process your order.' },
          { type: 'paragraph', text: 'Submitting an order request does not automatically mean that the order has been accepted.' },
          { type: 'paragraph', text: 'Our staff will confirm product availability, quantity, price, delivery details, and other relevant information through WhatsApp before the order is finalized.' },
          { type: 'paragraph', text: 'We reserve the right to decline or cancel an order where a product is unavailable, information is incorrect, or other circumstances prevent us from fulfilling the order.' },
        ],
      },
      {
        title: 'Prices and Payments',
        blocks: [
          { type: 'paragraph', text: 'Product prices displayed on the website may change without prior notice.' },
          { type: 'paragraph', text: 'At the current stage of our service, payment arrangements may be completed through communication with our staff on WhatsApp.' },
          { type: 'paragraph', text: 'Any payment instructions provided by Sekjad will be communicated through our authorized business channels.' },
          { type: 'paragraph', text: 'Customers should not send payments to unauthorized individuals or accounts claiming to represent Sekjad.' },
        ],
      },
      {
        title: 'Delivery and Collection',
        blocks: [
          { type: 'paragraph', text: 'Delivery or collection arrangements will be communicated and agreed upon with the customer during order processing.' },
          { type: 'paragraph', text: "Delivery fees, estimated delivery times, and collection arrangements may vary depending on the customer's location and the nature of the order." },
          { type: 'paragraph', text: 'Any delivery timeframe provided by Sekjad is an estimate unless expressly stated otherwise.' },
        ],
      },
      {
        title: 'Returns, Exchanges and Refunds',
        blocks: [
          { type: 'paragraph', text: "Returns, exchanges, and refunds are handled according to the circumstances of the individual order and Sekjad's applicable return policy." },
          { type: 'paragraph', text: 'Customers should inspect products when received and contact us promptly if there is a problem with an order.' },
          { type: 'paragraph', text: 'Where a return, exchange, or refund is requested, we may require relevant information such as the order details, photographs, or other evidence necessary to assess the request.' },
          { type: 'paragraph', text: 'Any refund, where approved, will be handled using an agreed payment method and according to the applicable refund terms.' },
        ],
      },
      {
        title: 'Intellectual Property',
        blocks: [
          { type: 'paragraph', text: 'Unless otherwise stated, the website and its content, including text, graphics, logos, images, designs, and software, are owned by or licensed to Sekjad Nigeria Enterprises.' },
          { type: 'paragraph', text: 'You may view and use the website for personal shopping purposes.' },
          { type: 'paragraph', text: 'You may not reproduce, distribute, modify, publish, sell, or commercially exploit our content without our prior written permission.' },
        ],
      },
      {
        title: 'Third-Party Services',
        blocks: [
          { type: 'paragraph', text: 'Our website may use or link to third-party services, including WhatsApp, Google authentication services, payment providers, analytics services, hosting providers, and other external services.' },
          { type: 'paragraph', text: 'Your use of those services may also be subject to the terms and privacy policies of the relevant third parties.' },
          { type: 'paragraph', text: 'Sekjad is not responsible for the availability, security, or policies of third-party services outside our control.' },
        ],
      },
      {
        title: 'Website Availability',
        blocks: [
          { type: 'paragraph', text: 'We aim to keep our website available and functioning properly, but we do not guarantee that the website will always be available, uninterrupted, secure, or error-free.' },
          { type: 'paragraph', text: 'We may temporarily suspend or modify parts of the website for maintenance, updates, security reasons, or other operational purposes.' },
        ],
      },
      {
        title: 'Limitation of Liability',
        blocks: [
          { type: 'paragraph', text: 'To the extent permitted by applicable law, Sekjad Nigeria Enterprises will not be responsible for losses resulting from circumstances outside our reasonable control, interruptions to third-party services, or unauthorized access caused by circumstances beyond our reasonable control.' },
          { type: 'paragraph', text: 'Nothing in these Terms is intended to exclude or limit liability that cannot legally be excluded or limited under applicable law.' },
        ],
      },
      {
        title: 'Changes to These Terms',
        blocks: [
          { type: 'paragraph', text: 'We may update these Terms from time to time.' },
          { type: 'paragraph', text: 'When we make changes, we may update the "Last Updated" date at the top of this page.' },
          { type: 'paragraph', text: 'Your continued use of the website after changes are posted means that you acknowledge the updated Terms.' },
        ],
      },
      {
        title: 'Governing Law',
        blocks: [
          { type: 'paragraph', text: 'These Terms shall be governed by and interpreted in accordance with the laws applicable in the Federal Republic of Nigeria.' },
        ],
      },
      {
        title: 'Contact Us',
        blocks: [
          { type: 'paragraph', text: 'If you have questions about these Terms, an order, or our services, please contact Sekjad Nigeria Enterprises through our official contact channels provided on the website.' },
          { type: 'paragraph', text: 'Sekjad Nigeria Enterprises · Nigeria' },
        ],
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: 'September 30, 2026',
    intro: [
      'Sekjad Nigeria Enterprises ("Sekjad", "we", "us", or "our") respects your privacy and is committed to protecting the personal information you provide when using our website.',
      'This Privacy Policy explains what information we collect, why we collect it, how we use it, and the choices available to you.',
    ],
    sections: [
      {
        title: 'Information We Collect',
        blocks: [
          { type: 'paragraph', text: 'Depending on how you use our website, we may collect information such as:' },
          { type: 'subheading', text: 'Account Information' },
          { type: 'paragraph', text: 'When you create an account, we may collect:' },
          { type: 'list', items: ['Name', 'Email address', 'Password or authentication information', 'Information associated with your Google account if you choose Google Sign-In'] },
          { type: 'subheading', text: 'Order Information' },
          { type: 'paragraph', text: 'When you place or request an order, we may collect:' },
          { type: 'list', items: ['Products ordered', 'Quantity', 'Customer name', 'Contact information', 'Delivery information', 'Order details', 'Information you provide when communicating with us through WhatsApp'] },
          { type: 'subheading', text: 'Contact Information' },
          { type: 'paragraph', text: 'If you contact us through our website or other communication channels, we may collect the information you provide, such as your name, email address, phone number, and the contents of your message.' },
          { type: 'subheading', text: 'Technical Information' },
          { type: 'paragraph', text: 'When you use our website, certain technical information may be collected automatically, including:' },
          { type: 'list', items: ['IP address', 'Browser type', 'Device information', 'Operating system', 'Pages visited', 'Website usage information', 'Date and time of visits'] },
        ],
      },
      {
        title: 'How We Use Your Information',
        blocks: [
          { type: 'paragraph', text: 'We may use your information to:' },
          { type: 'list', items: [
            'Create and manage your account.',
            'Authenticate your identity.',
            'Process and manage orders.',
            'Confirm product availability.',
            'Communicate with you about your orders.',
            'Respond to questions and customer-support requests.',
            'Send account verification and password-reset emails.',
            'Improve our website and services.',
            'Detect, prevent, and investigate fraud or unauthorized activity.',
            'Maintain the security and functionality of our website.',
            'Comply with applicable legal and regulatory requirements.',
          ] },
          { type: 'paragraph', text: 'We will only use your personal information for legitimate purposes connected with operating and improving our services.' },
        ],
      },
      {
        title: 'WhatsApp Orders',
        blocks: [
          { type: 'paragraph', text: 'When you choose to order through WhatsApp, information relating to your cart or order may be transferred to WhatsApp so that our staff can receive and process your request. This may include:' },
          { type: 'list', items: ['Product names', 'Product quantities', 'Product images', 'Order information', 'Your contact information where necessary'] },
          { type: 'paragraph', text: "Your use of WhatsApp is also subject to WhatsApp's own terms and privacy policy." },
        ],
      },
      {
        title: 'Google Sign-In',
        blocks: [
          { type: 'paragraph', text: 'If you choose to sign in using Google, we may receive information from Google that is necessary to create or authenticate your account.' },
          { type: 'paragraph', text: 'This may include information such as your name, email address, and Google account identifier.' },
          { type: 'paragraph', text: 'We do not receive your Google password.' },
          { type: 'paragraph', text: "Your use of Google authentication is also subject to Google's applicable terms and privacy policies." },
        ],
      },
      {
        title: 'Emails',
        blocks: [
          { type: 'paragraph', text: 'We may send transactional emails relating to your account or activities on our website, including:' },
          { type: 'list', items: ['Email verification', 'Password reset instructions', 'Account notifications', 'Order-related notifications', 'Customer-service communications'] },
          { type: 'paragraph', text: 'These emails are intended to provide services you have requested or information necessary to manage your account.' },
        ],
      },
      {
        title: 'Cookies and Similar Technologies',
        blocks: [
          { type: 'paragraph', text: 'Our website may use cookies and similar technologies to provide essential functionality, maintain sessions, remember preferences, improve security, and understand how visitors use the website.' },
          { type: 'paragraph', text: 'You can configure your browser to reject certain cookies. However, disabling essential cookies may affect some website functionality.' },
        ],
      },
      {
        title: 'How We Share Information',
        blocks: [
          { type: 'paragraph', text: 'We do not sell your personal information.' },
          { type: 'paragraph', text: 'We may share relevant information with trusted service providers when necessary to operate our website and provide our services. These providers may include:' },
          { type: 'list', items: ['Hosting providers', 'Database providers', 'Email delivery providers', 'Authentication providers', 'WhatsApp or other communication services', 'Payment providers where applicable', 'Analytics or security service providers'] },
          { type: 'paragraph', text: 'We may also disclose information where required by applicable law, regulation, legal process, or to protect our rights, users, or the security of our services.' },
        ],
      },
      {
        title: 'Data Security',
        blocks: [
          { type: 'paragraph', text: 'We use reasonable technical and organizational measures designed to protect your personal information from unauthorized access, alteration, disclosure, or destruction.' },
          { type: 'paragraph', text: 'However, no online system can be guaranteed to be completely secure.' },
          { type: 'paragraph', text: 'You are also responsible for keeping your account credentials confidential.' },
        ],
      },
      {
        title: 'Data Retention',
        blocks: [
          { type: 'paragraph', text: 'We retain personal information for as long as reasonably necessary to provide our services, maintain accounts, process orders, comply with legal obligations, resolve disputes, enforce agreements, and protect our legitimate interests.' },
          { type: 'paragraph', text: 'When information is no longer required, we may delete or anonymize it in accordance with our applicable retention practices and legal obligations.' },
        ],
      },
      {
        title: 'Your Privacy Rights',
        blocks: [
          { type: 'paragraph', text: 'Depending on applicable law, you may have rights relating to your personal information, including the right to:' },
          { type: 'list', items: [
            'Request access to personal information we hold about you.',
            'Request correction of inaccurate information.',
            'Request deletion of certain information.',
            'Object to or restrict certain processing.',
            'Withdraw consent where processing is based on consent.',
            'Request information about how your personal data is processed.',
          ] },
          { type: 'paragraph', text: 'To exercise a privacy right, contact us using the contact details provided on our website.' },
          { type: 'paragraph', text: 'We may need to verify your identity before processing certain requests.' },
        ],
      },
      {
        title: "Children's Privacy",
        blocks: [
          { type: 'paragraph', text: 'Our website is not intended to knowingly collect personal information from children without appropriate authorization.' },
          { type: 'paragraph', text: 'If you believe that a child has provided personal information to us improperly, please contact us so that we can investigate and take appropriate action.' },
        ],
      },
      {
        title: 'Third-Party Websites',
        blocks: [
          { type: 'paragraph', text: 'Our website may contain links or integrations with third-party websites and services.' },
          { type: 'paragraph', text: 'We are not responsible for the privacy practices, content, or security of third-party websites.' },
          { type: 'paragraph', text: 'We encourage you to review the privacy policies of third-party services before providing them with personal information.' },
        ],
      },
      {
        title: 'Changes to This Privacy Policy',
        blocks: [
          { type: 'paragraph', text: 'We may update this Privacy Policy from time to time to reflect changes in our services, technology, legal requirements, or privacy practices.' },
          { type: 'paragraph', text: 'The "Last Updated" date at the top of this page will indicate when the policy was most recently changed.' },
        ],
      },
      {
        title: 'Contact Us',
        blocks: [
          { type: 'paragraph', text: 'If you have questions about this Privacy Policy or wish to exercise a privacy right, please contact Sekjad Nigeria Enterprises through the official contact information provided on our website.' },
          { type: 'paragraph', text: 'Sekjad Nigeria Enterprises · Nigeria' },
        ],
      },
    ],
  },
}

export function LegalPage({ documentKey }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const document = LEGAL_DOCUMENTS[documentKey]

  useEffect(() => {
    window.scrollTo(0, 0)
    window.document.title = `${document.title} | Sekjad Nigeria Enterprises`
    return () => { window.document.title = 'Sekjad Nigeria Enterprises' }
  }, [document])

  return (
    <div className="min-h-screen bg-white text-ink">
      <Navbar open={menuOpen} setOpen={setMenuOpen} navBackground="bg-white shadow-sm" forceScrolledStyle />
      <main className="pt-20">
        <header className="bg-charcoal px-5 py-12 text-white sm:px-8 sm:py-16">
          <div className="mx-auto max-w-4xl">
            <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-white">
              <ArrowLeft size={16} aria-hidden="true" /> Back to home
            </Link>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-orange">Legal</p>
            <h1 className="font-display text-4xl font-normal sm:text-5xl">{document.title}</h1>
            <p className="mt-4 text-sm text-white/55">Last updated: {document.lastUpdated}</p>
          </div>
        </header>

        <article className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
          <div className="mb-10 space-y-4 text-sm leading-7 text-ink/70 sm:text-base">
            {document.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>

          <div className="divide-y divide-stone-200">
            {document.sections.map((section, index) => (
              <section key={section.title} id={`section-${index + 1}`} className="scroll-mt-28 py-7 first:pt-0">
                <h2 className="font-display mb-4 text-2xl font-medium text-ink sm:text-3xl">{index + 1}. {section.title}</h2>
                <div className="space-y-4 text-sm leading-7 text-ink/70 sm:text-base">
                  {section.blocks.map((block, blockIndex) => {
                    if (block.type === 'list') {
                      return (
                        <ul key={blockIndex} className="list-disc space-y-2 pl-6 marker:text-orange">
                          {block.items.map((item) => <li key={item}>{item}</li>)}
                        </ul>
                      )
                    }
                    if (block.type === 'subheading') {
                      return <h3 key={blockIndex} className="pt-2 text-sm font-semibold text-ink">{block.text}</h3>
                    }
                    return <p key={blockIndex}>{block.text}</p>
                  })}
                </div>
              </section>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}

export default LegalPage
