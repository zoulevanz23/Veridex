import { useState } from 'react'
import { X, ArrowRight, Lock, Mail, User as UserIcon, Zap, Check } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { validatePassword } from '../../lib/password'
import PasswordStrengthMeter from './PasswordStrengthMeter'
import GoogleSignInButton from './GoogleSignInButton'

type Tab = 'register' | 'signin'

export default function AuthModal() {
  const { showAuthModal, setShowAuthModal, login, register, credits } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab] = useState<Tab>('register')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const passwordStrength = validatePassword(password)

  if (!showAuthModal) return null

  const close = () => {
    setShowAuthModal(false)
    setError(null)
    setName(''); setEmail(''); setPassword('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (tab === 'register') {
      if (!name || !email || !password) return
      if (!passwordStrength.isValid) {
        setError('Password must meet all complexity requirements.')
        return
      }
      setLoading(true)
      try {
        await register({ name, email, password }, true)
        close()
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    } else {
      if (!email || !password) return
      setLoading(true)
      try {
        await login(email, password, true)
        close()
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div
        className="relative w-full max-w-md rounded-sm overflow-hidden shadow-2xl"
        style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
      >
        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 p-1.5 rounded-sm transition-colors cursor-pointer z-10"
          style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink-soft)' }}
        >
          <X size={16} />
        </button>

        <div className="p-6">
          {/* Credit Status Banner */}
          <div
            className="mb-6 p-4 rounded-sm"
            style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap size={16} style={{ color: '#f59e0b' }} />
                <span className="text-xs font-mono font-semibold uppercase tracking-wider" style={{ color: 'var(--ink-soft)' }}>
                  Guest Credits
                </span>
              </div>
              <div className="text-lg font-mono font-bold" style={{ color: credits === 0 ? 'var(--scam)' : 'var(--ink)' }}>
                {credits}/10
              </div>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface)' }}>
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${(credits / 10) * 100}%`,
                  background: credits <= 2 ? 'var(--scam)' : credits <= 5 ? '#f59e0b' : 'var(--safe)'
                }}
              />
            </div>
            <p className="text-[11px] mt-2" style={{ color: 'var(--ink-soft)' }}>
              {credits === 0
                ? 'All free credits used. Create an account to continue.'
                : credits <= 3
                ? `${credits} check${credits === 1 ? '' : 's'} remaining. Sign up for unlimited access.`
                : 'Create an account for unlimited verifications and history.'}
            </p>
          </div>

          {/* Header */}
          <div className="mb-5">
            <h2 className="font-serif-display text-xl italic leading-tight" style={{ color: 'var(--ink)' }}>
              {tab === 'register' ? 'Create Free Account' : 'Sign In'}
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--ink-soft)' }}>
              {tab === 'register' ? 'Get unlimited checks and save your verification history.' : 'Welcome back to continue your verification work.'}
            </p>
          </div>

          {/* Tab switcher */}
          <div
            className="flex rounded-sm p-1 mb-5"
            style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}
          >
            {(['register', 'signin'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(null) }}
                className="flex-1 py-2 text-xs font-semibold font-sans rounded-sm transition-all cursor-pointer"
                style={{
                  background: tab === t ? 'var(--surface)' : 'transparent',
                  color: tab === t ? 'var(--ink)' : 'var(--ink-soft)',
                  border: tab === t ? '1px solid var(--line)' : '1px solid transparent',
                }}
              >
                {t === 'register' ? 'Sign Up' : 'Sign In'}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div
              className="mb-4 px-3.5 py-2.5 rounded-sm text-xs font-sans"
              style={{ background: 'var(--scam)', color: 'white' }}
            >
              {error}
            </div>
          )}

          {/* Google OAuth */}
          <div className="mb-4">
            <GoogleSignInButton
              text={tab === 'register' ? 'Continue with Google' : 'Sign in with Google'}
              onSuccess={close}
            />
          </div>

          <div className="relative my-4 text-center">
            <hr style={{ border: 'none', borderTop: '1px solid var(--line)' }} />
            <span
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 text-[10px] font-mono uppercase tracking-widest"
              style={{ background: 'var(--surface)', color: 'var(--ink-soft)' }}
            >
              or
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {tab === 'register' && (
              <div className="relative">
                <UserIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-soft)' }} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full pl-9 pr-4 py-2.5 text-sm font-sans rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--ink)]/20 transition-all"
                  style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' }}
                />
              </div>
            )}

            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-soft)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full pl-9 pr-4 py-2.5 text-sm font-sans rounded-sm focus:outline-none transition-all"
                style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' }}
              />
            </div>

            <div>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-soft)' }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-9 pr-4 py-2.5 text-sm font-sans rounded-sm focus:outline-none transition-all"
                  style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' }}
                />
              </div>
              {tab === 'register' && password && <PasswordStrengthMeter password={password} />}
            </div>

            {tab === 'signin' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => { close(); navigate('/forgot-password') }}
                  className="text-[11px] font-sans cursor-pointer"
                  style={{ background: 'none', border: 'none', color: 'var(--ink-soft)', textDecoration: 'underline' }}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (tab === 'register' && !!password && !passwordStrength.isValid)}
              className="w-full py-2.5 font-sans text-xs font-semibold uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              style={{ background: 'var(--ink)', color: 'var(--paper)', border: 'none' }}
            >
              {loading
                ? (tab === 'register' ? 'Creating account...' : 'Signing in...')
                : (tab === 'register' ? <><span>Create Account</span><ArrowRight size={14} /></> : <><span>Sign In</span><ArrowRight size={14} /></>)
              }
            </button>
          </form>

          {/* Benefits */}
          <div className="mt-5 pt-4 border-t" style={{ borderColor: 'var(--line)' }}>
            <div className="space-y-2">
              {['Unlimited verifications', 'Save check history', 'Priority processing'].map(benefit => (
                <div key={benefit} className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--ink-soft)' }}>
                  <Check size={12} style={{ color: 'var(--safe)' }} />
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
