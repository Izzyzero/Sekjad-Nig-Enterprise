import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../../../components/auth/AuthLayout'
import { fieldClass, FieldError } from '../../../components/auth/FormHelpers'
import { authService } from '../../../services/auth.service'
import { applyApiFieldErrors, getApiError, getRateLimitSeconds } from '../../../services/api'
import { useRateLimit } from '../../../hooks/useRateLimit'

const schema = z.object({ email: z.string().trim().min(1, 'Enter your email').email('Enter a valid email address') })

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [authError, setAuthError] = useState('')
  const { rateLimitSeconds, startRateLimit } = useRateLimit()
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema), defaultValues: { email: '' } })

  const onSubmit = async ({ email }) => {
    setAuthError('')
    try {
      const response = await authService.forgotPassword({ email })
      navigate('/reset-password', { state: { email, message: response.message } })
    } catch (error) {
      applyApiFieldErrors(error, setError)
      setAuthError(getApiError(error, 'Unable to send a reset code. Please try again.'))
      startRateLimit(getRateLimitSeconds(error))
    }
  }

  return (
    <AuthLayout eyebrow="Where Elegance Meets Tradition" headingLines={["Let's Get You", 'Back Into Your Account']}>
      <h2 className="font-display text-ink mb-2 text-3xl sm:text-4xl">Forgot password?</h2>
      <p className="mb-8 text-sm text-ink/50">Enter the email linked to your account and we’ll send you a reset code.</p>
      {authError && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{authError}</div>}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div><input aria-label="Email" type="email" placeholder="Email Address" autoComplete="email" className={fieldClass(errors.email)} {...register('email')} /><FieldError message={errors.email?.message} /></div>
        <button type="submit" disabled={isSubmitting || rateLimitSeconds > 0} className="bg-orange w-full rounded-full py-3.5 text-sm font-semibold text-white disabled:opacity-60">{isSubmitting ? 'Sending…' : rateLimitSeconds ? `Try again in ${rateLimitSeconds}s` : 'Send Reset Code'}</button>
      </form>
      <p className="mt-8 text-center text-sm text-ink/50">Remember your password? <Link to="/login" className="text-orange font-semibold hover:underline">Log in</Link></p>
    </AuthLayout>
  )
}

export default ForgotPasswordPage
