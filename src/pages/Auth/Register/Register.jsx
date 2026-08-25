import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import { AuthLayout } from '../../../components/auth/AuthLayout'
import { fieldClass, FieldError } from '../../../components/auth/FormHelpers'
import { useAuth } from '../../../hooks/useAuth'
import { getApiError } from '../../../services/api'

const PHONE_REGEX = /^[7-9][0-9]{9}$/ // NG local number, no leading 0/+234

const registerSchema = z
  .object({
    firstName: z.string().trim().min(2, 'Enter your first name'),
    lastName: z.string().trim().min(2, 'Enter your last name'),
    email: z.string().trim().min(1, 'Enter your email').email('Enter a valid email address'),
    phone: z
      .string()
      .trim()
      .min(1, 'Enter your phone number')
      .regex(PHONE_REGEX, 'Enter a valid Nigerian number (e.g. 8012345678)'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Include at least one uppercase letter')
      .regex(/[0-9]/, 'Include at least one number'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to continue' }),
    }),
    subscribe: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export function Register() {
  const { register: createAccount } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [authError, setAuthError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
      subscribe: false,
    },
  })

  const onSubmit = async (data) => {
    setAuthError('')
    const details = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      phone: `+234${data.phone}`,
      subscribe: data.subscribe,
    }
    try {
      await createAccount({ ...details, phoneNumber: data.phone })
      setSubmitted(true)
    } catch (error) {
      setAuthError(getApiError(error, 'Unable to create your account. Please try again.'))
    }
  }

  return (
    <AuthLayout
      eyebrow="Where Elegance Meets Tradition"
      headingLines={["Nigeria's Most Trusted", 'Premium Fabric Store']}
    >
      {submitted ? (
        <div className="bg-orange/10 border-orange/25 rounded-2xl border px-8 py-10 text-center">
          <p className="font-display text-orange mb-2 text-2xl font-medium">Welcome to Sekjad!</p>
          <p className="text-sm text-ink/55">
            Your account has been created. Check your email to verify and get started.
            <Link to="/login" className="text-orange font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      ) : (
        <>
          <h2 className="font-display text-ink mb-2 text-3xl font-normal sm:text-4xl">Create your account</h2>
          <p className="mb-8 text-sm text-ink/50">Join thousands of customers enjoying premium Nigerian fabrics</p>

          {authError && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  autoComplete="given-name"
                  className={fieldClass(errors.firstName)}
                  {...register('firstName')}
                />
                <FieldError message={errors.firstName?.message} />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Last Name"
                  autoComplete="family-name"
                  className={fieldClass(errors.lastName)}
                  {...register('lastName')}
                />
                <FieldError message={errors.lastName?.message} />
              </div>
            </div>

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
              <div
                className={`flex items-stretch overflow-hidden rounded-lg border bg-white transition-colors focus-within:border-orange/60 ${
                  errors.phone ? 'border-red-400' : 'border-stone-300'
                }`}
              >
                <span className="flex items-center gap-1.5 border-r border-stone-200 px-3 text-sm text-ink/60">
                  <span className="text-[10px] font-semibold tracking-wide">NG</span>
                  <span>+234</span>
                </span>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  autoComplete="tel-national"
                  className="w-full px-4 py-3 text-sm text-ink outline-none placeholder:text-ink/35"
                  {...register('phone')}
                />
              </div>
              <FieldError message={errors.phone?.message} />
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  autoComplete="new-password"
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

            <div>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  className={fieldClass(errors.confirmPassword, 'pr-11')}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((value) => !value)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-ink/40 hover:text-ink/70"
                >
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              <FieldError message={errors.confirmPassword?.message} />
            </div>

            <div className="space-y-3 pt-1">
              <label className="flex items-start gap-2.5 text-sm text-ink/60">
                <input
                  type="checkbox"
                  className="mt-0.5 size-4 shrink-0 rounded border-stone-300 text-orange-500 focus:ring-orange-400"
                  {...register('agreeTerms')}
                />
                <span>
                  I agree to Sekjad&apos;s{' '}
                  <a href="#" className="text-orange font-medium hover:underline">Terms of Service</a> and{' '}
                  <a href="#" className="text-orange font-medium hover:underline">Privacy Policy</a>
                </span>
              </label>
              <FieldError message={errors.agreeTerms?.message} />

              <label className="flex items-start gap-2.5 text-sm text-ink/60">
                <input
                  type="checkbox"
                  className="mt-0.5 size-4 shrink-0 rounded border-stone-300 text-orange-500 focus:ring-orange-400"
                  {...register('subscribe')}
                />
                <span>Subscribe to our newsletter for exclusive deals and new arrivals (optional)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange mt-2 w-full rounded-full py-3.5 text-sm font-semibold text-white transition hover:bg-[#d4711f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Creating account…' : 'Create Account'}
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
            Already have an account?{' '}
            <Link to="/login" className="text-orange font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  )
}

export default Register
