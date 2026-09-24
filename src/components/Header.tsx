import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Zap, LogOut, User as UserIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { label: 'Verify', to: '/analyzer' },
  { label: 'How it works', to: '/features' },
  { label: 'Extension', to: '/extension' },
  { label: 'About', to: '/about' },
]

export default function Header() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const { user, isLoggedIn, credits, usageCount, logout } = useAuth()

  const isActive = (to: string) => to !== '/features#extension' && location.pathname === to.split('#')[0]

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: 'var(--paper)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <nav
        className="mx-auto px-6 lg:px-12 flex items-center justify-between h-[52px]"
        style={{ maxWidth: 1180 }}
      >
        {/* Wordmark */}
        <Link
          to="/"
          className="font-sans font-semibold text-base no-underline tracking-tight flex items-center gap-2"
          style={{ color: 'var(--ink)' }}
          onClick={() => setOpen(false)}
        >
          Veridex
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {NAV.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="font-sans text-sm no-underline transition-colors"
              style={{
                color: isActive(to) ? 'var(--ink)' : 'var(--ink-soft)',
                fontWeight: isActive(to) ? 600 : 400,
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right side: Credits badge & Auth controls */}
        <div className="hidden md:flex items-center gap-4">
          {/* Credit status pill */}
          {isLoggedIn ? (
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-mono font-semibold"
              style={{ background: 'rgba(22, 163, 74, 0.1)', color: 'var(--safe)', border: '1px solid rgba(22, 163, 74, 0.2)' }}
              title={`${usageCount} verification checks completed with this account`}
            >
              <Zap size={12} />
              Unlimited Checks ({usageCount} run)
            </div>
          ) : (
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-mono font-semibold no-underline transition-all"
              style={{
                background: credits <= 2 ? 'rgba(220, 38, 38, 0.1)' : 'var(--surface)',
                color: credits <= 2 ? 'var(--scam)' : 'var(--ink)',
                border: '1px solid var(--line)',
              }}
              title="Guests get 10 free credits. Register for unlimited checks."
            >
              <Zap size={12} className={credits <= 2 ? 'animate-pulse' : ''} />
              {credits}/10 Free Checks
            </Link>
          )}

          {/* User profile / Auth buttons */}
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover border border-slate-300" />
              ) : (
                <UserIcon size={14} style={{ color: 'var(--ink-soft)' }} />
              )}
              <span className="text-xs font-sans font-semibold flex items-center gap-1.5" style={{ color: 'var(--ink)' }}>
                {user?.name}
              </span>
              <button
                onClick={logout}
                className="p-1 rounded-sm transition-colors cursor-pointer"
                style={{ color: 'var(--ink-soft)', background: 'none', border: 'none' }}
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-xs font-sans">
              <Link
                to="/signin"
                className="no-underline font-medium"
                style={{ color: 'var(--ink-soft)' }}
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="no-underline font-semibold px-3 py-1.5 rounded-sm transition-all"
                style={{ background: 'var(--ink)', color: 'var(--paper)' }}
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-1.5 rounded"
          style={{ color: 'var(--ink)' }}
          onClick={() => setOpen(v => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden flex flex-col px-6 pb-4 gap-4"
          style={{ background: 'var(--paper)', borderBottom: '1px solid var(--line)' }}
        >
          {/* Mobile credit badge */}
          <div className="pt-2">
            {isLoggedIn ? (
              <span className="text-xs font-mono font-semibold" style={{ color: 'var(--safe)' }}>Unlimited Checks Active ({usageCount} run)</span>
            ) : (
              <span className="text-xs font-mono" style={{ color: 'var(--ink-soft)' }}>{credits}/10 Guest Checks Remaining</span>
            )}
          </div>
          {NAV.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="font-sans text-sm no-underline"
              style={{ color: isActive(to) ? 'var(--ink)' : 'var(--ink-soft)', fontWeight: isActive(to) ? 600 : 400 }}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          {isLoggedIn ? (
            <button
              onClick={() => { logout(); setOpen(false) }}
              className="font-sans text-sm text-left text-red-600 no-underline cursor-pointer"
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              Sign out ({user?.email})
            </button>
          ) : (
            <div className="flex gap-4 pt-2">
              <Link to="/signin" className="font-sans text-sm font-semibold" style={{ color: 'var(--ink)' }} onClick={() => setOpen(false)}>
                Sign in
              </Link>
              <Link to="/register" className="font-sans text-sm font-semibold text-emerald-700" onClick={() => setOpen(false)}>
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
