import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { AuthLayout } from '../../../components/auth/AuthLayout'
import { fieldClass, FieldError } from '../../../components/auth/FormHelpers'
import { authService } from '../../../services/auth.service'
import { applyApiFieldErrors, getApiError, getRateLimitSeconds } from '../../../services/api'
import { useRateLimit } from '../../../hooks/useRateLimit'

const schema = z.object({ code: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code') })

export function VerifyOtp() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email
  const [authError, setAuthError] = useState('')
  const { rateLimitSeconds, startRateLimit } = useRateLimit()
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema), defaultValues: { code: '' },
  })

  if (!email) return <Navigate to="/register" replace />

  const onSubmit = async ({ code }) => {
    setAuthError('')
    try {
      const response = await authService.verifyEmail({ email, code })
      navigate('/login', { replace: true, state: { message: response.message, from: location.state?.from } })
    } catch (error) {
      applyApiFieldErrors(error, setError)
      setAuthError(getApiError(error, 'Unable to verify your email. Please try again.'))
      startRateLimit(getRateLimitSeconds(error))
    }
  }

  return (
    <AuthLayout eyebrow="Where Elegance Meets Tradition" headingLines={['One Last Step', 'To Secure Your Account']}>
      <div className="border-orange/25 bg-orange/10 text-orange mb-6 flex size-14 items-center justify-center rounded-2xl border"><ShieldCheck size={24} /></div>
      <h2 className="font-display text-ink mb-2 text-3xl sm:text-4xl">Verify your email</h2>
      <p className="mb-8 text-sm text-ink/50">Enter the 6-digit code sent to <span className="text-ink font-medium">{email}</span>.</p>
      {(location.state?.message || authError) && <div role={authError ? 'alert' : 'status'} className={`mb-5 rounded-lg border px-4 py-3 text-sm ${authError ? 'border-red-200 bg-red-50 text-red-600' : 'border-green-200 bg-green-50 text-green-700'}`}>{authError || location.state.message}</div>}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <input aria-label="Verification code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="123456" className={`${fieldClass(errors.code)} text-center text-xl tracking-[0.5em]`} {...register('code')} />
        <FieldError message={errors.code?.message} center />
        <button type="submit" disabled={isSubmitting || rateLimitSeconds > 0} className="bg-orange mt-8 w-full rounded-full py-3.5 text-sm font-semibold text-white disabled:opacity-60">{isSubmitting ? 'Verifying…' : rateLimitSeconds ? `Try again in ${rateLimitSeconds}s` : 'Verify Email'}</button>
      </form>
      <p className="mt-6 text-center text-sm text-ink/50"><Link to="/register" className="text-orange font-semibold hover:underline">Use a different email</Link></p>
    </AuthLayout>
  )
}

export default VerifyOtp
