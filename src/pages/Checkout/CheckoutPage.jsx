import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Navbar } from '../../components/layout/Navbar/Navbar'
import { Footer } from '../../components/layout/Footer/Footer'
import { paymentService } from '../../services/payment.service'
import { CartPage } from '../Cart/CartPage'
import { getApiError } from '../../services/api'

const referenceKey = 'checkoutPaymentReference'

function CheckoutLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return <div className="min-h-screen bg-[#FAF9F7]">
    <Navbar open={menuOpen} setOpen={setMenuOpen} forceScrolledStyle />
    <main className="mx-auto min-h-[70vh] max-w-5xl px-5 pb-24 pt-28 sm:px-8 sm:pt-32">{children}</main>
    <Footer />
  </div>
}

export function CheckoutPage() {
  return <CartPage />
}

export function CheckoutReturnPage() {
  const [searchParams] = useSearchParams()
  const reference = searchParams.get('reference') || sessionStorage.getItem(referenceKey)
  const queryClient = useQueryClient()
  const { data, isPending, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['payment-verification', reference],
    queryFn: () => paymentService.verify(reference),
    enabled: Boolean(reference),
    retry: false,
    refetchOnWindowFocus: false,
  })
  const status = data?.paymentStatus
  useEffect(() => {
    if (status) queryClient.invalidateQueries({ queryKey: ['customer-orders'] })
    // The server must finalize the order and reconcile purchased cart items.
    if (status === 'paid') queryClient.invalidateQueries({ queryKey: ['cart'] })
  }, [status, queryClient])
  return <CheckoutLayout><div className="mx-auto max-w-xl rounded-2xl border border-[#E9E4DF] bg-white p-8 text-center">
    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#E67E22]">Payment status</p>
    {!reference ? <><h1 className="font-display text-3xl">Payment reference missing</h1><p className="mt-3 text-[#6B7280]">We could not check this payment.</p></>
      : isPending || isFetching ? <><h1 className="font-display text-3xl">Checking your payment</h1><p role="status" className="mt-3 text-[#6B7280]">Please wait while we verify with the server.</p></>
      : isError ? <><h1 className="font-display text-3xl">Could not check payment</h1><p role="alert" className="mt-3 text-red-600">{getApiError(error)}</p><button onClick={() => refetch()} className="mt-5 rounded-full bg-[#E67E22] px-6 py-3 text-white">Check again</button></>
      : status === 'paid' ? <><h1 className="font-display text-3xl">Payment successful</h1><p className="mt-3 text-[#6B7280]">Your payment has been confirmed.</p><Link to="/orders" className="mt-5 block text-[#E67E22]">View orders</Link></>
      : status === 'failed' ? <><h1 className="font-display text-3xl">Payment failed</h1><p className="mt-3 text-[#6B7280]">Your payment was not completed.</p><Link to="/cart" className="mt-5 inline-block text-[#E67E22]">Back to cart</Link></>
      : <><h1 className="font-display text-3xl">Payment processing</h1><p className="mt-3 text-[#6B7280]">Your payment is still pending. Check again shortly.</p><button onClick={() => refetch()} className="mt-5 rounded-full bg-[#E67E22] px-6 py-3 text-white">Check again</button></>}
    </div></CheckoutLayout>
}
