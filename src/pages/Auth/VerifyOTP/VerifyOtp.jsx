import { useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { AuthLayout } from '../../../components/auth/AuthLayout'
import { FieldError } from '../../../components/auth/formHelpers'

const OTP_LENGTH = 6

const otpSchema = z.object({
  otp: z
    .string()
    .length(OTP_LENGTH, `Enter the ${OTP_LENGTH}-digit code`)
    .regex(/^\d+$/, 'Code must be numbers only'),
})

function OtpInputGroup({ value, onChange, hasError }) {
  const inputsRef = useRef([])
  const digits = value.split('').concat(Array(OTP_LENGTH).fill('')).slice(0, OTP_LENGTH)

  const setDigit = (index, digit) => {
    const nextDigits = [...digits]
    nextDigits[index] = digit
    onChange(nextDigits.join(''))
  }

  const handleChange = (index, event) => {
    const raw = event.target.value.replace(/\D/g, '')
    if (!raw) {
      setDigit(index, '')
      return
    }
    const chars = raw.split('')
    chars.forEach((char, offset) => {
      if (index + offset < OTP_LENGTH) setDigit(index + offset, char)
    })
    const nextIndex = Math.min(index + chars.length, OTP_LENGTH - 1)
    inputsRef.current[nextIndex]?.focus()
  }

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (event) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    onChange(pasted)
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus()
  }

  return (
    <div className="flex justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          className={`h-14 w-full max-w-14 rounded-lg border bg-white text-center text-xl font-semibold text-ink outline-none transition-colors focus:border-orange/60 ${
            hasError ? 'border-red-400' : 'border-stone-300'
          }`}
        />
      ))}
    </div>
  )
}

export function VerifyOtp() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email ?? 'your email'

  const [resendCooldown, setResendCooldown] = useState(30)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  })

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => setResendCooldown((seconds) => seconds - 1), 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  const onSubmit = async (data) => {
    // Replace with your real "verify code" API call
    await new Promise((resolve) => setTimeout(resolve, 900))
    console.log('OTP submitted:', data.otp)
    navigate('/reset-password', { state: { email, otp: data.otp } })
  }

  const handleResend = () => {
    if (resendCooldown > 0) return
    // Replace with your real "resend code" API call
    console.log('Resending code to', email)
    setResendCooldown(30)
  }

  return (
    <AuthLayout
      eyebrow="Where Elegance Meets Tradition"
      headingLines={['One Last Step', 'To Secure Your Account']}
    >
      <div className="border-orange/25 bg-orange/10 text-orange mb-6 flex size-14 items-center justify-center rounded-2xl border">
        <ShieldCheck size={24} strokeWidth={1.5} />
      </div>
      <h2 className="font-display text-ink mb-2 text-3xl font-normal sm:text-4xl">Verify your code</h2>
      <p className="mb-8 text-sm leading-relaxed text-ink/50">
        Enter the {OTP_LENGTH}-digit code we sent to <span className="text-ink font-medium">{email}</span>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="otp"
          control={control}
          render={({ field }) => (
            <OtpInputGroup value={field.value} onChange={field.onChange} hasError={!!errors.otp} />
          )}
        />
        <FieldError message={errors.otp?.message} center />

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-orange mt-8 w-full rounded-full py-3.5 text-sm font-semibold text-white transition hover:bg-[#d4711f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Verifying…' : 'Verify Code'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/50">
        Didn&apos;t receive a code?{' '}
        {resendCooldown > 0 ? (
          <span className="text-ink/40">Resend in {resendCooldown}s</span>
        ) : (
          <button type="button" onClick={handleResend} className="text-orange font-semibold hover:underline">
            Resend code
          </button>
        )}
      </p>

      <p className="mt-4 text-center text-sm text-ink/50">
        <Link to="/forgot-password" className="text-orange font-semibold hover:underline">
          Use a different email
        </Link>
      </p>
    </AuthLayout>
  )
}

export default VerifyOtp