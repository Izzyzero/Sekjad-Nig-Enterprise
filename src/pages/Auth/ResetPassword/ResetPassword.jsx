import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { AuthLayout } from '../../../components/auth/AuthLayout'
import { fieldClass, FieldError } from '../../../components/auth/FormHelpers'
import { authService } from '../../../services/auth.service'
import { applyApiFieldErrors, getApiError, getRateLimitSeconds } from '../../../services/api'
import { useRateLimit } from '../../../hooks/useRateLimit'
import { useAuth } from '../../../hooks/useAuth'

const schema = z.object({
  code: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Confirm your password'),
}).refine((value) => value.password === value.confirmPassword, {
  path: ['confirmPassword'], message: 'Passwords do not match',
})

export function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email
  const { clearSession } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const { rateLimitSeconds, startRateLimit } = useRateLimit()
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema), defaultValues: { code: '', password: '', confirmPassword: '' },
  })

  if (!email) return <Navigate to="/forgot-password" replace />

  const onSubmit = async (values) => {
    setAuthError('')
    try {
      const response = await authService.resetPassword({ email, ...values })
      clearSession()
      navigate('/login', { replace: true, state: { message: response.message } })
    } catch (error) {
      applyApiFieldErrors(error, setError)
      setAuthError(getApiError(error, 'Unable to reset your password. Please try again.'))
      startRateLimit(getRateLimitSeconds(error))
    }
  }

  return (
    <AuthLayout eyebrow="Where Elegance Meets Tradition" headingLines={['Almost There', 'Choose a New Password']}>
      <h2 className="font-display text-ink mb-2 text-3xl sm:text-4xl">Set new password</h2>
      <p className="mb-4 text-sm text-ink/50">Enter the code sent to <span className="text-ink font-medium">{email}</span> and choose a new password.</p>
      {location.state?.message && <div role="status" className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{location.state.message}</div>}
      {authError && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{authError}</div>}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div><input aria-label="Reset code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="6-digit code" className={fieldClass(errors.code)} {...register('code')} /><FieldError message={errors.code?.message} /></div>
        <div className="relative"><input aria-label="New password" type={showPassword ? 'text' : 'password'} placeholder="New Password" autoComplete="new-password" className={fieldClass(errors.password, 'pr-11')} {...register('password')} /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute inset-y-0 right-0 w-11 text-ink/40">{showPassword ? <EyeOff className="mx-auto" size={17} /> : <Eye className="mx-auto" size={17} />}</button></div>
        <FieldError message={errors.password?.message} />
        <div><input aria-label="Confirm new password" type="password" placeholder="Confirm New Password" autoComplete="new-password" className={fieldClass(errors.confirmPassword)} {...register('confirmPassword')} /><FieldError message={errors.confirmPassword?.message} /></div>
        <button type="submit" disabled={isSubmitting || rateLimitSeconds > 0} className="bg-orange w-full rounded-full py-3.5 text-sm font-semibold text-white disabled:opacity-60">{isSubmitting ? 'Resetting…' : rateLimitSeconds ? `Try again in ${rateLimitSeconds}s` : 'Reset Password'}</button>
      </form>
      <p className="mt-8 text-center text-sm text-ink/50"><Link to="/login" className="text-orange font-semibold hover:underline">Back to Log In</Link></p>
    </AuthLayout>
  )
}

export default ResetPassword
