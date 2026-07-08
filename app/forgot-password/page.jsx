'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const resetRedirectUrl = `${window.location.origin}/reset-password`

      const response = await fetch(`${supabaseUrl}/functions/v1/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, redirectTo: resetRedirectUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to send reset link. Please try again.')
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt="Background"
            src="https://images.unsplash.com/photo-1617195737496-bc30194e3a19?ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="hidden lg:relative lg:block lg:p-12">
            <Link href="/" className="block">
              <Image src="/logo.svg" width={140} height={48} alt="Logo" className="brightness-0 invert" />
            </Link>
            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Reset Your Password
            </h2>
            <p className="mt-4 leading-relaxed text-white/90">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>
          </div>
        </section>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl w-full lg:max-w-3xl">
            <div className="relative -mt-16 block lg:hidden mb-8">
              <Link href="/" className="inline-flex items-center justify-center rounded-full bg-white shadow-md p-3">
                <Image src="/logo.svg" width={100} height={36} alt="Logo" />
              </Link>
              <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                Reset Your Password
              </h1>
            </div>

            {success ? (
              <div className="mt-8 space-y-6">
                <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-6 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-3">
                    <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">Check your email</h3>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    We&apos;ve sent a password reset link to <strong>{email}</strong>.
                    Please check your inbox and click the link to set a new password.
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-500 mt-3">
                    Didn&apos;t receive the email? Check your spam folder or try again.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => { setSuccess(false); setEmail(''); }}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Try a different email
                  </button>
                  <Link
                    href="/sign-in"
                    className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 px-5 py-3 text-sm font-medium text-white transition-colors text-center"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white hidden lg:block">Forgot Password</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
                </p>

                {error && (
                  <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="you@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 px-5 py-3 text-sm font-medium text-white transition-colors"
                >
                  {loading ? 'Sending reset link...' : 'Send Reset Link'}
                </button>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Remember your password?{' '}
                  <Link href="/sign-in" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Sign in
                  </Link>
                </p>
              </form>
            )}
          </div>
        </main>
      </div>
    </section>
  )
}
