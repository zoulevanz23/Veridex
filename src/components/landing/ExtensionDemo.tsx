import { useEffect, useRef, useState } from 'react'

export default function ExtensionDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<'idle' | 'moving' | 'menu' | 'verdict'>('idle')
  const timers = useRef<number[]>([])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const clearTimers = () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }

    const run = () => {
      clearTimers()
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setPhase('verdict')
        return
      }
      setPhase('moving')
      timers.current.push(window.setTimeout(() => setPhase('menu'), 900))
      timers.current.push(window.setTimeout(() => setPhase('verdict'), 2600))
    }

    const reset = () => {
      clearTimers()
      setPhase('idle')
    }

    let triggered = false
    const play = () => {
      if (!triggered) {
        triggered = true
        run()
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          play()
        } else if (triggered) {
          triggered = false
          reset()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)

    // Start immediately if already in view on mount
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      play()
    }

    return () => {
      observer.disconnect()
      clearTimers()
    }
  }, [])

  return (
    <div ref={ref} className="w-full max-w-[660px] mx-auto select-none">
      {/* Browser chrome */}
      <div
        className="rounded-lg overflow-hidden shadow-lg"
        style={{ border: '1px solid var(--line)' }}
      >
        {/* Tab bar */}
        <div
          className="flex items-center gap-2 px-3 py-2.5"
          style={{ background: '#DDDEDE', borderBottom: '1px solid var(--line)' }}
        >
          {/* Dots */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: '#e16056' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#e7ba45' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#5bb85d' }} />
          </div>
          {/* Fake tab */}
          <div className="flex-1 mx-2">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-t-md text-xs font-sans font-medium"
              style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Breaking: Urgent investment alert — act now
            </div>
          </div>
        </div>

        {/* Address bar */}
        <div
          className="flex items-center gap-2 px-3 py-2"
          style={{ background: '#EAEBE7', borderBottom: '1px solid var(--line)' }}
        >
          <div
            className="flex-1 rounded px-3 py-1.5 text-xs font-mono flex items-center justify-between"
            style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }}
          >
            <span className="flex items-center gap-1.5">
              <span className="text-amber-600 font-bold">!</span>{' '}
              secure-investment-alerts24.info/breaking
            </span>
            <span className="text-[10px] font-sans px-1.5 py-0.5 rounded" style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink-soft)' }}>
              Unverified Domain
            </span>
          </div>
        </div>

        {/* Page content with generous height */}
        <div
          className="relative px-8 py-8 font-sans text-sm leading-relaxed overflow-hidden flex flex-col justify-between"
          style={{ background: 'var(--surface)', minHeight: 380, color: 'var(--ink)' }}
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono mb-2" style={{ color: 'var(--ink-soft)' }}>
              <span>FINANCIAL BULLETIN</span>
              <span>•</span>
              <span>PUBLISHED TODAY</span>
            </div>
            <h3 className="mb-4 font-serif-display text-xl font-semibold leading-snug" style={{ color: 'var(--ink)' }}>
              Analysts predict 900% returns — window closes in 48 hours
            </h3>
            <p className="mb-4 text-sm leading-7" style={{ color: 'var(--ink-soft)' }}>
              A leaked internal memo suggests that one obscure crypto token is about to be listed on major global exchanges.{' '}
              <span
                id="ext-highlight-text"
                className="font-semibold rounded-sm px-1 py-0.5 transition-all"
                style={{
                  background: phase === 'menu' || phase === 'verdict' ? 'rgba(228,166,27,0.25)' : 'transparent',
                  color: 'var(--ink)',
                  borderBottom: phase === 'verdict' ? '2px solid var(--suspicious)' : 'none'
                }}
              >
                Experts say you must act before the market opens Monday or miss the opportunity entirely.
              </span>{' '}
              All transactions require direct wire transfer or non-reversible crypto payments. No refunds permitted.
            </p>

            <p className="text-xs leading-6 mb-4" style={{ color: 'var(--ink-soft)' }}>
              Note: The publishing entity reserves the right to adjust terms without prior notice to individual account holders.
            </p>

            {/* Inline Veridex extension verdict popover popup */}
            {phase === 'verdict' && (
              <div
                className="p-4 rounded-sm shadow-md animate-fade-in"
                style={{
                  background: 'var(--paper)',
                  border: '1px solid var(--line)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: 'rgba(228,166,27,0.15)', color: 'var(--suspicious)' }}>
                      VERDICT: SUSPICIOUS
                    </span>
                    <span className="text-xs font-mono" style={{ color: 'var(--ink-soft)' }}>88% Confidence</span>
                  </div>
                  <span className="text-[11px] font-mono" style={{ color: 'var(--ink-soft)' }}>Veridex Extension v1.2</span>
                </div>
                <p className="text-xs font-sans leading-relaxed mb-2" style={{ color: 'var(--ink)' }}>
                  This text displays high-pressure time limits paired with non-standard payment channels.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono" style={{ color: 'var(--ink-soft)' }}>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--suspicious)' }} />
                    Artificial urgency framing
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--suspicious)' }} />
                    Non-reversible payment demand
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cursor */}
          {phase !== 'verdict' && (
            <div
              className="absolute pointer-events-none z-10 transition-all"
              style={{
                left: phase === 'idle' ? 40 : 220,
                top: phase === 'idle' ? 90 : 150,
                transition: phase === 'moving' ? 'left 0.7s cubic-bezier(0.22,1,0.36,1), top 0.7s cubic-bezier(0.22,1,0.36,1)' : 'none',
              }}
              aria-hidden="true"
            >
              <svg width={18} height={22} viewBox="0 0 18 22" fill="none">
                <path d="M1 1L1 16L5.5 12L8 18L10 17L7.5 11L13 11L1 1Z" fill="var(--ink)" stroke="var(--surface)" strokeWidth={1.5} />
              </svg>
            </div>
          )}

          {/* Context menu */}
          {phase === 'menu' && (
            <div
              className="absolute z-20 rounded-md shadow-xl overflow-hidden animate-menu-in"
              style={{
                left: 226,
                top: 155,
                minWidth: 220,
                background: 'var(--surface)',
                border: '1px solid var(--line)',
              }}
              role="menu"
              aria-label="Browser context menu"
            >
              {['Back', 'Forward', 'Reload', '─'].map((item, i) => (
                <div
                  key={i}
                  className="px-4 py-1.5 text-xs font-sans"
                  style={{ color: item === '─' ? 'var(--line)' : 'var(--ink-soft)' }}
                  role="menuitem"
                  aria-disabled="true"
                >
                  {item === '─' ? <hr style={{ border: 'none', borderTop: '1px solid var(--line)', margin: '2px 0' }} /> : item}
                </div>
              ))}
              <div
                className="px-4 py-2 text-xs font-sans font-semibold flex items-center gap-2 cursor-pointer"
                style={{
                  background: 'var(--lamp)',
                  color: 'var(--ink)',
                }}
                role="menuitem"
              >
                <svg width={12} height={12} viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M6 1L11 3V6C11 8.76 8.76 11 6 11C3.24 11 1 8.76 1 6V3L6 1Z" stroke="var(--ink)" strokeWidth={1.2} fill="none"/>
                  <path d="M4 6L5.5 7.5L8 4.5" stroke="var(--ink)" strokeWidth={1.2} strokeLinecap="round"/>
                </svg>
                Verify with Veridex
              </div>
              {['Save as…', 'Print…'].map((item, i) => (
                <div
                  key={i}
                  className="px-4 py-1.5 text-xs font-sans"
                  style={{ color: 'var(--ink-soft)' }}
                  role="menuitem"
                  aria-disabled="true"
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-xs font-sans text-center" style={{ color: 'var(--ink-soft)' }}>
        Right-click any text or link → Verify with Veridex inline without switching tabs
      </p>
    </div>
  )
}
