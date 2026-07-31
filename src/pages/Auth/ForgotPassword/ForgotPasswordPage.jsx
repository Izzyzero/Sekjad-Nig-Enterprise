import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { AuthLayout } from '../../../components/auth/AuthLayout'
import { fieldClass, FieldError } from '../../../components/auth/formHelpers'

const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, 'Enter your email').email('Enter a valid email address'),
})

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [sent, setSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data) => {
    // Replace with your real "send reset code" API call
    await new Promise((resolve) => setTimeout(resolve, 900))
    console.log('Forgot password payload:', data)
    setSentEmail(data.email)
    setSent(true)
  }

  const goToVerify = () => navigate('/verify-otp', { state: { email: sentEmail } })

  return (
    <AuthLayout
      eyebrow="Where Elegance Meets Tradition"
      headingLines={["Let's Get You", 'Back Into Your Account']}
    >
      {sent ? (
        <>
          <div className="border-orange/25 bg-orange/10 text-orange mb-6 flex size-14 items-center justify-center rounded-2xl border">
            <Mail size={24} strokeWidth={1.5} />
          </div>
          <h2 className="font-display text-ink mb-2 text-3xl font-normal sm:text-4xl">Check your email</h2>
          <p className="mb-8 text-sm leading-relaxed text-ink/50">
            We&apos;ve sent a 6-digit verification code to{' '}
            <span className="text-ink font-medium">{sentEmail}</span>. Enter it on the next screen to reset your
            password.
          </p>

          <button
            type="button"
            onClick={goToVerify}
            className="bg-orange w-full rounded-full py-3.5 text-sm font-semibold text-white transition hover:bg-[#d4711f]"
          >
            Enter Verification Code
          </button>

          <p className="mt-6 text-center text-sm text-ink/50">
            Didn&apos;t get the email?{' '}
            <button type="button" onClick={() => setSent(false)} className="text-orange font-semibold hover:underline">
              Try a different address
            </button>
          </p>
        </>
      ) : (
        <>
          <h2 className="font-display text-ink mb-2 text-3xl font-normal sm:text-4xl">Forgot password?</h2>
          <p className="mb-8 text-sm text-ink/50">
            No worries — enter the email linked to your account and we&apos;ll send you a code to reset it.
          </p>

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

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange mt-2 w-full rounded-full py-3.5 text-sm font-semibold text-white transition hover:bg-[#d4711f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Sending…' : 'Send Reset Code'}
            </button>
          </form>
        </>
      )}

      <p className="mt-8 text-center text-sm text-ink/50">
        Remember your password?{' '}
        <Link to="/login" className="text-orange font-semibold hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}

export default ForgotPasswordPage