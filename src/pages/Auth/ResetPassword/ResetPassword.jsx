import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { AuthLayout } from '../../../components/auth/AuthLayout'
import { fieldClass, FieldError } from '../../../components/auth/formHelpers'

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Include at least one uppercase letter')
      .regex(/[0-9]/, 'Include at least one number'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const { email, otp } = location.state ?? {}

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [done, setDone] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const onSubmit = async (data) => {
    // Replace with your real "reset password" API call — send email/otp + data.password
    await new Promise((resolve) => setTimeout(resolve, 900))
    console.log('Reset password payload:', { email, otp, password: data.password })
    setDone(true)
  }

  return (
    <AuthLayout eyebrow="Where Elegance Meets Tradition" headingLines={['Almost There', 'Choose a New Password']}>
      {done ? (
        <>
          <div className="mb-6 flex size-14 items-center justify-center rounded-2xl border border-green-200 bg-green-50 text-green-600">
            <CheckCircle2 size={24} strokeWidth={1.5} />
          </div>
          <h2 className="font-display text-ink mb-2 text-3xl font-normal sm:text-4xl">Password reset</h2>
          <p className="mb-8 text-sm leading-relaxed text-ink/50">
            Your password has been updated successfully. You can now log in with your new password.
          </p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="bg-orange w-full rounded-full py-3.5 text-sm font-semibold text-white transition hover:bg-[#d4711f]"
          >
            Back to Log In
          </button>
        </>
      ) : (
        <>
          <h2 className="font-display text-ink mb-2 text-3xl font-normal sm:text-4xl">Set new password</h2>
          <p className="mb-8 text-sm text-ink/50">
            Your new password must be different from previously used passwords.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New Password"
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
                  placeholder="Confirm New Password"
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange mt-2 w-full rounded-full py-3.5 text-sm font-semibold text-white transition hover:bg-[#d4711f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Resetting…' : 'Reset Password'}
            </button>
          </form>
        </>
      )}

      <p className="mt-8 text-center text-sm text-ink/50">
        <Link to="/login" className="text-orange font-semibold hover:underline">
          Back to Log In
        </Link>
      </p>
    </AuthLayout>
  )
}

export default ResetPassword