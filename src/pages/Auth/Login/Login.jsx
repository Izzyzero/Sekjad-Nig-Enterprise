import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { GoogleSignIn } from '../../../components/auth/GoogleSignIn'
import { AuthLayout } from '../../../components/auth/AuthLayout'
import { fieldClass, FieldError } from '../../../components/auth/FormHelpers'
import { useAuth } from '../../../hooks/useAuth'
import { applyApiFieldErrors, getApiError, getRateLimitSeconds } from '../../../services/api'
import { useRateLimit } from '../../../hooks/useRateLimit'

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Enter your email').email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
  remember: z.boolean().optional(),
})

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const { rateLimitSeconds, startRateLimit } = useRateLimit()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  })

  const onSubmit = async (data) => {
    setAuthError('')
    try {
      const credentials = { email: data.email, password: data.password }
      await login(credentials)
      navigate(location.state?.from ? { pathname: location.state.from.pathname, search: location.state.from.search, hash: location.state.from.hash } : '/home', { replace: true })
    } catch (error) {
      applyApiFieldErrors(error, setError)
      setAuthError(getApiError(error, 'Incorrect email or password. Please try again.'))
      startRateLimit(getRateLimitSeconds(error))
    }
  }

  return (
    <AuthLayout eyebrow="Where Elegance Meets Tradition" headingLines={['Welcome Back to', "Nigeria's Finest Fabrics"]}>
      <h2 className="font-display text-ink mb-2 text-3xl font-normal sm:text-4xl">Welcome back</h2>
      <p className="mb-8 text-sm text-ink/50">Log in to continue shopping premium Nigerian fabrics</p>

      {location.state?.message && (
        <div role="status" className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {location.state.message}
        </div>
      )}

      {authError && (
        <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email Address"
            autoComplete="email"
            className={fieldClass(errors.email)}
            {...register('email')}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              autoComplete="current-password"
              className={fieldClass(errors.password, 'pr-11')}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-ink/40 hover:text-ink/70"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          <FieldError message={errors.password?.message} />
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2.5 text-sm text-ink/60">
            <input
              type="checkbox"
              className="size-4 shrink-0 rounded border-stone-300 text-orange-500 focus:ring-orange-400"
              {...register('remember')}
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-orange text-sm font-medium hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || rateLimitSeconds > 0}
          className="bg-orange mt-2 w-full rounded-full py-3.5 text-sm font-semibold text-white transition hover:bg-[#d4711f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Logging in…' : rateLimitSeconds ? `Try again in ${rateLimitSeconds}s` : 'Log In'}
        </button>
      </form>

      <GoogleSignIn disabled={isSubmitting || rateLimitSeconds > 0} />

      <p className="mt-8 text-center text-sm text-ink/50">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-orange font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}

export default Login
