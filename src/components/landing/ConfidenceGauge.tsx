import { useEffect, useState } from 'react'

interface ConfidenceGaugeProps {
  value: number      // 0–100
  show: boolean
  label: string      // e.g. "Suspicious"
  color?: string     // CSS color, defaults to --suspicious
}

export default function ConfidenceGauge({
  value,
  show,
  label,
  color = 'var(--suspicious)',
}: ConfidenceGaugeProps) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (show) {
      const t = setTimeout(() => setActive(true), 200)
      return () => clearTimeout(t)
    }
  }, [show])

  // Arc geometry: half-circle, 180° sweep, r=38
  const R = 38
  const cx = 50
  const cy = 50
  const circumference = Math.PI * R   // half circle arc length
  // strokeDashoffset trick for arc fill
  const pct = Math.max(0, Math.min(100, value))
  const filled = (pct / 100) * circumference

  // Needle angle: -90° (left = 0%) to +90° (right = 100%)
  const needleDeg = active ? (pct / 100) * 180 - 90 : -90

  return (
    <div className="flex flex-col items-center gap-1" aria-label={`Confidence: ${value}%, ${label}`}>
      <div className="relative" style={{ width: 100, height: 58 }}>
        <svg viewBox="0 0 100 55" width={100} height={55} aria-hidden="true">
          {/* Track */}
          <path
            d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
            fill="none"
            stroke="var(--line)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Fill */}
          <path
            d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={active ? circumference - filled : circumference}
            style={{ transition: active ? 'stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)' : 'none' }}
          />
          {/* Needle (shortened to not overlap center text) */}
          <line
            x1={cx}
            y1={cy - R + 16}
            x2={cx}
            y2={cy - R + 2}
            stroke="var(--ink)"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              transformOrigin: `${cx}px ${cy}px`,
              transform: `rotate(${needleDeg}deg)`,
              transition: active ? 'transform 1.2s cubic-bezier(0.22,1,0.36,1)' : 'none',
            }}
          />
          {/* Removed center pivot dot so the text stands alone */}
        </svg>
        {/* Numeral */}
        <div
          className="absolute bottom-0 left-0 right-0 text-center font-sans font-bold text-xl leading-none"
          style={{ color: 'var(--ink)' }}
        >
          {value}
          <span className="text-sm font-normal" style={{ color: 'var(--ink-soft)' }}>%</span>
        </div>
      </div>
      {/* Always show text label for colorblind safety */}
      <div className="text-xs font-sans font-semibold" style={{ color }}>
        {label}
      </div>
    </div>
  )
}
