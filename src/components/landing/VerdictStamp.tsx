import { useEffect, useState } from 'react'

interface VerdictStampProps {
  verdict: string
  show: boolean
  colorOverride?: string
}

const verdictColors: Record<string, string> = {
  Safe:       'var(--safe)',
  Suspicious: 'var(--suspicious)',
  Scam:       'var(--scam)',
}

export default function VerdictStamp({ verdict, show, colorOverride }: VerdictStampProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      const t = setTimeout(() => setVisible(true), 80)
      return () => clearTimeout(t)
    }
  }, [show])

  const color = colorOverride || verdictColors[verdict] || 'var(--suspicious)'

  return (
    <div
      aria-label={`Verdict: ${verdict}`}
      className={`inline-flex flex-col items-center gap-2 transition-all ${
        visible ? 'animate-stamp-in' : 'opacity-0 scale-110'
      }`}
      style={{ '--flag-rot': '-2deg' } as React.CSSProperties}
    >
      <div
        className="px-5 py-2 rounded font-sans font-bold tracking-wider text-lg uppercase select-none"
        style={{
          color,
          border: `2.5px solid ${color}`,
          transform: 'rotate(-2deg)',
          letterSpacing: '0.12em',
          /* ink bleed: outer glow that briefly pulses via stamp-in animation shadow */
          textShadow: `0 0 0 transparent`,
          boxShadow: `inset 0 0 0 1px ${color}22`,
        }}
        role="img"
      >
        {verdict}
      </div>
    </div>
  )
}
