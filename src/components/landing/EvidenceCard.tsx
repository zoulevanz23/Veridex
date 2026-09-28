import { useEffect, useRef, useState } from 'react'
import VerdictStamp from './VerdictStamp'
import ConfidenceGauge from './ConfidenceGauge'

export interface SampleData {
  body: React.ReactNode    // the message body with highlight spans
  rawText: string          // plain version for aria
  flags: {
    label: string
    topPct: number         // approximate % down the card where this flag appears
    rot?: number           // slight skew in degrees, e.g. -1.5
  }[]
  verdict: 'Safe' | 'Suspicious' | 'Scam'
  confidence: number
  verdictColor: string
  meta?: {
    fromLabel?: string
    fromValue?: string
    date?: string
    subject?: string
  }
  explanation?: string
}

interface EvidenceCardProps {
  data: SampleData
  mobile?: boolean
}

// Checks reduced-motion preference
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function EvidenceCard({ data, mobile }: EvidenceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'done'>('idle')
  const [visibleFlags, setVisibleFlags] = useState<number[]>([])
  const [showVerdict, setShowVerdict] = useState(false)

  const SCAN_DURATION = 2400  // ms — matches animate-scan-down duration

  useEffect(() => {
    const reduced = prefersReducedMotion()

    if (reduced) {
      // Instant reveal — no sweep
      setPhase('done')
      setVisibleFlags(data.flags.map((_, i) => i))
      setShowVerdict(true)
      return
    }

    // Intersection observer: start once card is in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect()
          runScan()
        }
      },
      { threshold: 0.3 }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [data])

  function runScan() {
    setPhase('scanning')
    setVisibleFlags([])
    setShowVerdict(false)

    // Stagger flag appearances based on their topPct in the card
    data.flags.forEach((flag, i) => {
      const delay = (flag.topPct / 100) * SCAN_DURATION + 100
      setTimeout(() => {
        setVisibleFlags(prev => [...prev, i])
      }, delay)
    })

    // Verdict stamps at end of scan
    setTimeout(() => {
      setPhase('done')
      setShowVerdict(true)
    }, SCAN_DURATION + 200)
  }

  return (
    <div
      ref={cardRef}
      className="relative paper-grain bg-surface rounded-sm shadow-md"
      style={{
        border: '1px solid var(--line)',
        // Very slight rotation: looks like a document laid on a desk
        transform: 'rotate(-0.4deg)',
        maxWidth: 560,
        width: '100%',
      }}
    >
      {/* Deckled / torn top edge — SVG wave */}
      <svg
        className="absolute top-[-7px] left-0 w-full"
        viewBox="0 0 560 8"
        preserveAspectRatio="none"
        height={8}
        aria-hidden="true"
      >
        <path
          d="M0,8 C20,2 40,6 60,3 C80,0 100,5 120,3 C140,1 160,6 180,4 C200,2 220,7 240,4 C260,1 280,6 300,3 C320,0 340,5 360,3 C380,1 400,6 420,4 C440,2 460,7 480,4 C500,1 520,5 540,3 C552,2 557,4 560,4 L560,8 Z"
          fill="var(--surface)"
          stroke="none"
        />
      </svg>

      {/* Scan line — only rendered while scanning */}
      {phase === 'scanning' && (
        <div
          className="absolute left-0 right-0 h-[2px] pointer-events-none animate-scan-down z-20"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, var(--lamp) 30%, var(--lamp) 70%, transparent 100%)',
            boxShadow: '0 0 12px 2px rgba(228,166,27,0.35)',
            top: 0,
          }}
          aria-hidden="true"
        />
      )}

      {/* Card content */}
      <div className="px-7 pt-8 pb-4 relative">
        {/* From / meta line */}
        <div className="flex gap-3 items-baseline mb-4 flex-wrap">
          <span className="text-xs font-sans font-semibold" style={{ color: 'var(--ink-soft)' }}>{data.meta?.fromLabel ?? 'From:'}</span>
          <span className="text-xs font-sans" style={{ color: 'var(--ink-soft)' }}>{data.meta?.fromValue ?? 'notifications@dhl-parcel-track.net'}</span>
          <span className="text-xs font-sans ml-auto" style={{ color: 'var(--line)' }}>{data.meta?.date ?? 'Today, 09:14'}</span>
        </div>

        {/* Subject */}
        <div className="font-instrument font-semibold text-[15px] mb-4" style={{ color: 'var(--ink)' }}>
          {data.meta?.subject ?? 'Action required: Delivery attempt failed — reschedule now'}
        </div>

        {/* Body */}
        <div
          className="font-serif-display text-[15px] leading-[1.75] relative z-10"
          style={{ color: 'var(--ink)', maxWidth: 68 + 'ch' }}
          aria-label={data.rawText}
        >
          {data.body}
        </div>
      </div>

      {/* Signal flags — right margin on desktop, stacked inline on mobile */}
      {!mobile && (
        <div
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{ left: 'calc(100% + 12px)', width: 220 }}
          aria-label="Detected signals"
        >
          {data.flags.map((flag, i) => (
            <div
              key={i}
              className={`absolute transition-all ${visibleFlags.includes(i) ? 'animate-flag-pop' : 'opacity-0'}`}
              style={{
                top: `${flag.topPct}%`,
                '--flag-rot': `${flag.rot ?? -1}deg`,
                transform: `rotate(${flag.rot ?? -1}deg)`,
              } as React.CSSProperties}
            >
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-sans font-semibold rounded-sm shadow-sm"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--lamp)',
                  color: 'var(--ink)',
                  whiteSpace: 'nowrap',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: 'var(--lamp)' }}
                />
                {flag.label}
              </div>
              {/* Leader line back to card */}
              <svg
                className="absolute right-full top-1/2 -translate-y-1/2"
                width={16}
                height={2}
                aria-hidden="true"
              >
                <line x1={0} y1={1} x2={16} y2={1} stroke="var(--lamp)" strokeWidth={1} strokeDasharray="3 2" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* Mobile flags — stacked below their phrases */}
      {mobile && visibleFlags.length > 0 && (
        <div className="px-7 pb-2 flex flex-col gap-2">
          {data.flags.map((flag, i) =>
            visibleFlags.includes(i) ? (
              <div
                key={i}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-sans font-semibold rounded-sm w-fit"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--lamp)',
                  color: 'var(--ink)',
                }}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--lamp)' }} />
                {flag.label}
              </div>
            ) : null
          )}
        </div>
      )}

      {/* Verdict + gauge */}
      <div
        className="px-7 pb-7 pt-3 flex items-center gap-6 flex-wrap border-t"
        style={{ borderColor: 'var(--line)' }}
      >
        <VerdictStamp verdict={data.verdict} show={showVerdict} />
        <ConfidenceGauge
          value={data.confidence}
          show={showVerdict}
          label={data.verdict}
          color={data.verdictColor}
        />
        {showVerdict && (
          <p className="text-xs font-sans leading-relaxed flex-1 min-w-[160px]" style={{ color: 'var(--ink-soft)' }}>
            {data.explanation ?? 'Urgent framing, a domain that impersonates a courier, and a request for personal information.'}
          </p>
        )}
      </div>
    </div>
  )
}
