import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import { AuthLayout } from '../../../components/auth/AuthLayout'
import { fieldClass, FieldError } from '../../../components/auth/FormHelpers'

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Enter your email').email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
  remember: z.boolean().optional(),
})

export function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  })

  const onSubmit = async (data) => {
    setAuthError('')
    try {
      // Replace with your real auth call
      await new Promise((resolve) => setTimeout(resolve, 900))
      console.log('Login payload:', data)
      navigate('/')
    } catch {
      setAuthError('Incorrect email or password. Please try again.')
    }
  }

  return (
    <AuthLayout eyebrow="Where Elegance Meets Tradition" headingLines={['Welcome Back to', "Nigeria's Finest Fabrics"]}>
      <h2 className="font-display text-ink mb-2 text-3xl font-normal sm:text-4xl">Welcome back</h2>
      <p className="mb-8 text-sm text-ink/50">Log in to continue shopping premium Nigerian fabrics</p>

      {authError && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
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
          disabled={isSubmitting}
          className="bg-orange mt-2 w-full rounded-full py-3.5 text-sm font-semibold text-white transition hover:bg-[#d4711f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Logging in…' : 'Log In'}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-stone-200" />
        <span className="text-xs text-ink/40">or continue with</span>
        <div className="h-px flex-1 bg-stone-200" />
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-full border border-stone-300 py-3 text-sm font-medium text-ink/80 transition hover:border-stone-400"
      >
        <FcGoogle size={18} />
        Continue with Google
      </button>

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