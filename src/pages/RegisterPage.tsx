import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import GoogleSignInButton from '../components/ui/GoogleSignInButton'

const RegisterPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({})
  const navigate = useNavigate()

  const validate = () => {
    const errors: { name?: string; email?: string; password?: string } = {}
    if (!name.trim()) {
      errors.name = 'Please enter a display name.'
    } else if (name.trim().length < 2) {
      errors.name = 'That name looks too short — at least 2 characters.'
    }
    if (!email.trim()) {
      errors.email = 'Please enter your email address.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'That email address doesn\'t look right. Check for typos and try again.'
    }
    if (!password) {
      errors.password = 'Please create a password.'
    } else if (password.length < 8) {
      errors.password = 'Your password needs at least 8 characters to keep your account safe.'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, name: name.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'We couldn\'t create your account. Try again in a moment.')
      }

      if (data.token) {
        localStorage.setItem('veridex-auth-token', data.token)
        localStorage.setItem('veridex-user', JSON.stringify(data.user))
      }

      navigate('/')
    } catch (err: any) {
      setError(err.message || 'We couldn\'t create your account. Try again in a moment.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--paper)' }}>
      <div className="max-w-md w-full rounded-sm p-8" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck size={20} style={{ color: 'var(--lamp)' }} />
          <span className="text-xs font-instrument font-semibold" style={{ color: 'var(--ink-soft)' }}>Veridex</span>
        </div>
        <h2 className="text-2xl font-instrument font-bold tracking-tight m-0 mb-6" style={{ color: 'var(--ink)' }}>Create account</h2>

        {error && (
          <div className="mb-4 p-3 rounded-sm text-sm" style={{ background: 'rgba(168,64,42,0.08)', border: '1px solid rgba(168,64,42,0.25)', color: 'var(--scam)' }}>
            {error}
          </div>
        )}

        <div className="mb-4">
          <GoogleSignInButton text="Continue with Google" onSuccess={() => navigate('/')} />
        </div>

        <div className="relative mb-4 text-center">
          <div style={{ borderTop: '1px solid var(--line)' }} />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 text-xs font-sans" style={{ background: 'var(--surface)', color: 'var(--ink-soft)' }}>
            or
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="email" style={{ color: fieldErrors.email ? 'var(--scam)' : 'var(--ink-soft)' }}>
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={e => { setEmail(e.target.value); setFieldErrors(prev => ({ ...prev, email: undefined })) }}
              className="w-full px-4 py-2.5 rounded-sm border text-sm"
              style={{ background: 'var(--paper)', borderColor: fieldErrors.email ? 'var(--scam)' : 'var(--line)', color: 'var(--ink)', outline: 'none' }}
              onFocus={e => e.currentTarget.style.borderColor = fieldErrors.email ? 'var(--scam)' : 'var(--lamp)'}
              onBlur={e => { e.currentTarget.style.borderColor = fieldErrors.email ? 'var(--scam)' : 'var(--line)'; }}
              placeholder="email@example.com"
            />
            {fieldErrors.email && <p className="text-xs mt-1" style={{ color: 'var(--scam)' }}>{fieldErrors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="name" style={{ color: fieldErrors.name ? 'var(--scam)' : 'var(--ink-soft)' }}>
              Display name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setFieldErrors(prev => ({ ...prev, name: undefined })) }}
              className="w-full px-4 py-2.5 rounded-sm border text-sm"
              style={{ background: 'var(--paper)', borderColor: fieldErrors.name ? 'var(--scam)' : 'var(--line)', color: 'var(--ink)', outline: 'none' }}
              onFocus={e => e.currentTarget.style.borderColor = fieldErrors.name ? 'var(--scam)' : 'var(--lamp)'}
              onBlur={e => { e.currentTarget.style.borderColor = fieldErrors.name ? 'var(--scam)' : 'var(--line)'; }}
              placeholder="Your name"
            />
            {fieldErrors.name && <p className="text-xs mt-1" style={{ color: 'var(--scam)' }}>{fieldErrors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="password" style={{ color: fieldErrors.password ? 'var(--scam)' : 'var(--ink-soft)' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={e => { setPassword(e.target.value); setFieldErrors(prev => ({ ...prev, password: undefined })) }}
              className="w-full px-4 py-2.5 rounded-sm border text-sm"
              style={{ background: 'var(--paper)', borderColor: fieldErrors.password ? 'var(--scam)' : 'var(--line)', color: 'var(--ink)', outline: 'none' }}
              onFocus={e => e.currentTarget.style.borderColor = fieldErrors.password ? 'var(--scam)' : 'var(--lamp)'}
              onBlur={e => { e.currentTarget.style.borderColor = fieldErrors.password ? 'var(--scam)' : 'var(--line)'; }}
              placeholder="••••••••••••••••"
            />
            {fieldErrors.password && <p className="text-xs mt-1" style={{ color: 'var(--scam)' }}>{fieldErrors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 font-semibold text-sm rounded-sm cursor-pointer transition-colors disabled:opacity-50"
            style={{ background: 'var(--ink)', color: 'var(--paper)', border: '1px solid var(--ink)' }}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/signin" className="text-sm font-medium no-underline" style={{ color: 'var(--ink-soft)' }}>
            Already have an account? <span style={{ color: 'var(--ink)', fontWeight: 600 }}>Sign in</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage