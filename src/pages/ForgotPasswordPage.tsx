import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { validatePassword } from '../lib/password'
import PasswordStrengthMeter from '../components/ui/PasswordStrengthMeter'
import { updateUserPassword } from '../lib/userStore'

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<'email' | 'code' | 'done'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const passwordStrength = validatePassword(newPassword)

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError(null)
    try {
      await resetPassword(email)
      setStep('code')
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordStrength.isValid) {
      setError('Password does not meet all complexity requirements.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      updateUserPassword(email, newPassword)
      await new Promise((r) => setTimeout(r, 600))
      setStep('done')
    } catch (err: any) {
      setError(err.message || 'Reset failed. Email address not found in user records.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-52px)] flex items-center justify-center p-6" style={{ background: 'var(--paper)' }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-serif-display text-3xl font-normal italic mb-2" style={{ color: 'var(--ink)' }}>
            Reset password
          </h1>
          <p className="font-sans text-sm m-0" style={{ color: 'var(--ink-soft)' }}>
            {step === 'email' && 'Enter your email address to receive reset instructions'}
            {step === 'code' && 'Enter verification code and your new secure password'}
            {step === 'done' && 'Password updated successfully'}
          </p>
        </div>

        <div
          className="rounded-sm p-8 shadow-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
        >
          {error && (
            <div
              className="mb-6 p-3.5 rounded-sm text-xs font-sans text-center"
              style={{ background: 'var(--scam-bg, #fdf2f2)', border: '1px solid var(--scam)', color: 'var(--scam)' }}
            >
              {error}
            </div>
          )}

          {step === 'email' && (
            <form onSubmit={handleSendEmail} className="space-y-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--ink-soft)' }} htmlFor="email">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-soft)' }} />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 font-sans text-sm rounded-sm focus:outline-none transition-all"
                    style={{
                      background: 'var(--paper)',
                      border: '1px solid var(--line)',
                      color: 'var(--ink)',
                    }}
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 font-sans text-xs font-semibold uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-2"
                style={{
                  background: 'var(--ink)',
                  color: 'var(--paper)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {loading ? 'Sending code…' : <>Send Reset Code <ArrowRight size={16} /></>}
              </button>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--ink-soft)' }}>
                  6-Digit Reset Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full text-center tracking-widest font-mono text-base py-2.5 rounded-sm focus:outline-none"
                  style={{
                    background: 'var(--paper)',
                    border: '1px solid var(--line)',
                    color: 'var(--ink)',
                  }}
                  placeholder="123456"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--ink-soft)' }}>
                  New Secure Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-soft)' }} />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 font-sans text-sm rounded-sm focus:outline-none"
                    style={{
                      background: 'var(--paper)',
                      border: '1px solid var(--line)',
                      color: 'var(--ink)',
                    }}
                    placeholder="••••••••••••••••"
                  />
                </div>
                <PasswordStrengthMeter password={newPassword} />
              </div>

              <button
                type="submit"
                disabled={loading || !passwordStrength.isValid}
                className="w-full py-2.5 px-4 font-sans text-xs font-semibold uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                style={{
                  background: 'var(--ink)',
                  color: 'var(--paper)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {loading ? 'Updating password…' : 'Update Password →'}
              </button>
            </form>
          )}

          {step === 'done' && (
            <div className="text-center py-4 space-y-4">
              <CheckCircle size={48} className="mx-auto" style={{ color: 'var(--safe)' }} />
              <p className="font-sans text-sm" style={{ color: 'var(--ink)' }}>
                Your password has been successfully updated. You can now sign in with your new password.
              </p>
              <button
                onClick={() => navigate('/signin')}
                className="w-full py-2.5 px-4 font-sans text-xs font-semibold uppercase tracking-wider rounded-sm transition-all"
                style={{
                  background: 'var(--ink)',
                  color: 'var(--paper)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Go to Sign In →
              </button>
            </div>
          )}

          <div className="mt-6 pt-6 text-center" style={{ borderTop: '1px solid var(--line)' }}>
            <Link to="/signin" className="text-xs font-sans no-underline transition-colors" style={{ color: 'var(--ink-soft)' }}>
              ← Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
