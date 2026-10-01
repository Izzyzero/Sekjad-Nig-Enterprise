import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { AuthLayout } from '../../../components/auth/AuthLayout'
import { GoogleSignIn } from '../../../components/auth/GoogleSignIn'
import { fieldClass, FieldError } from '../../../components/auth/FormHelpers'
import { authService } from '../../../services/auth.service'
import { applyApiFieldErrors, getApiError, getRateLimitSeconds } from '../../../services/api'
import { useRateLimit } from '../../../hooks/useRateLimit'

const PHONE_REGEX = /^\+[1-9]\d{7,14}$/
const schema = z.object({
  firstName: z.string().trim().min(1, 'Enter your first name'),
  lastName: z.string().trim().min(1, 'Enter your last name'),
  email: z.string().trim().min(1, 'Enter your email').email('Enter a valid email address'),
  phoneNumber: z.string().trim().regex(PHONE_REGEX, 'Use international format, for example +233541234567'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Confirm your password'),
  acceptedTerms: z.boolean().refine((accepted) => accepted, 'You must accept the Terms of Service and Privacy Policy'),
}).refine((value) => value.password === value.confirmPassword, {
  path: ['confirmPassword'], message: 'Passwords do not match',
})

export function Register() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const { rateLimitSeconds, startRateLimit } = useRateLimit()
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { firstName: '', lastName: '', email: '', phoneNumber: '', password: '', confirmPassword: '', acceptedTerms: false },
  })

  const onSubmit = async (values) => {
    setAuthError('')
    try {
      const { firstName, lastName, email, phoneNumber, password } = values
      const response = await authService.register({ firstName, lastName, email, phoneNumber, password })
      navigate('/verify-email', { state: { email: values.email, message: response.message, from: location.state?.from } })
    } catch (error) {
      applyApiFieldErrors(error, setError)
      setAuthError(getApiError(error, 'Unable to start registration. Please try again.'))
      startRateLimit(getRateLimitSeconds(error))
    }
  }

  const disabled = isSubmitting || rateLimitSeconds > 0
  return (
    <AuthLayout eyebrow="Where Elegance Meets Tradition" headingLines={["Nigeria's Most Trusted", 'Premium Fabric Store']}>
      <h2 className="font-display text-ink mb-2 text-3xl sm:text-4xl">Create your account</h2>
      <p className="mb-8 text-sm text-ink/50">Join thousands of customers enjoying premium fabrics</p>
      {authError && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{authError}</div>}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><input aria-label="First name" placeholder="First Name" autoComplete="given-name" className={fieldClass(errors.firstName)} {...register('firstName')} /><FieldError message={errors.firstName?.message} /></div>
          <div><input aria-label="Last name" placeholder="Last Name" autoComplete="family-name" className={fieldClass(errors.lastName)} {...register('lastName')} /><FieldError message={errors.lastName?.message} /></div>
        </div>
        <div><input aria-label="Email" type="email" placeholder="Email Address" autoComplete="email" className={fieldClass(errors.email)} {...register('email')} /><FieldError message={errors.email?.message} /></div>
        <div><input aria-label="Phone number" type="tel" placeholder="Phone Number (+233541234567)" autoComplete="tel" className={fieldClass(errors.phoneNumber)} {...register('phoneNumber')} /><FieldError message={errors.phoneNumber?.message} /></div>
        <div className="relative"><input aria-label="Password" type={showPassword ? 'text' : 'password'} placeholder="Password" autoComplete="new-password" className={fieldClass(errors.password, 'pr-11')} {...register('password')} /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute inset-y-0 right-0 w-11 text-ink/40">{showPassword ? <EyeOff className="mx-auto" size={17} /> : <Eye className="mx-auto" size={17} />}</button></div>
        <FieldError message={errors.password?.message} />
        <div><input aria-label="Confirm password" type="password" placeholder="Confirm Password" autoComplete="new-password" className={fieldClass(errors.confirmPassword)} {...register('confirmPassword')} /><FieldError message={errors.confirmPassword?.message} /></div>
        <div>
          <label htmlFor="acceptedTerms" className="flex items-start gap-2.5 text-xs leading-5 text-ink/60">
            <input id="acceptedTerms" type="checkbox" className="mt-1 size-4 shrink-0 accent-orange-500" {...register('acceptedTerms')} />
            <span>
              I agree to the <Link to="/terms" className="text-orange font-semibold hover:underline">Terms of Service</Link> and acknowledge the <Link to="/privacy" className="text-orange font-semibold hover:underline">Privacy Policy</Link>.
            </span>
          </label>
          <FieldError message={errors.acceptedTerms?.message} />
        </div>
        <button type="submit" disabled={disabled} className="bg-orange w-full rounded-full py-3.5 text-sm font-semibold text-white disabled:opacity-60">{isSubmitting ? 'Creating account…' : rateLimitSeconds ? `Try again in ${rateLimitSeconds}s` : 'Create Account'}</button>
      </form>
      <GoogleSignIn disabled={disabled} />
      <p className="mt-8 text-center text-sm text-ink/50">Already have an account? <Link to="/login" state={{ from: location.state?.from }} className="text-orange font-semibold hover:underline">Log in</Link></p>
    </AuthLayout>
  )
}

export default Register
