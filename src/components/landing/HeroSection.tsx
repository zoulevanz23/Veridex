import { useState } from 'react'

interface HeroSectionProps {
  onTryIt: () => void
  onSeeDemo: () => void
}

export default function HeroSection({ onTryIt, onSeeDemo }: HeroSectionProps) {
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  return (
    <div className="hero-split">
      {/* Headline column — aligned to the site container */}
      <div className="hero-split-text">
        <div className="hero-split-text-inner">
          <p className="font-serif-display text-[15px] m-0 mb-5 animate-hero-rise" style={{ color: 'var(--ink-soft)' }}>
            A verification instrument, not a dashboard.
          </p>
          <h1
            className="font-serif-display font-medium tracking-tight m-0 animate-hero-rise"
            style={{ color: 'var(--ink)', fontSize: 'clamp(34px,4.6vw,52px)', lineHeight: 1.08, animationDelay: '90ms' }}
          >
            A second opinion for anything that feels off.
          </h1>
          <p
            className="font-serif-display m-0 mt-5 animate-hero-rise"
            style={{ color: 'var(--ink-soft)', fontSize: 18, lineHeight: 1.65, maxWidth: '52ch', animationDelay: '180ms' }}
          >
            Paste a message, link, or article. Veridex returns a verdict, a confidence range,
            and the exact signals behind it — then discards everything.
          </p>
          <div className="flex items-center gap-4 mt-7 flex-wrap animate-hero-rise" style={{ animationDelay: '260ms' }}>
            <button
              type="button"
              onClick={onTryIt}
              className="px-6 py-3 rounded-sm text-sm font-sans font-semibold cursor-pointer"
              style={{ background: 'var(--ink)', color: 'var(--paper)', border: '1px solid var(--ink)' }}
            >
              Check something now
            </button>
            <button
              type="button"
              onClick={onSeeDemo}
              className="px-1 py-3 text-sm font-sans font-semibold cursor-pointer bg-transparent"
              style={{ color: 'var(--ink)', border: 'none', borderBottom: '1px solid var(--lamp)' }}
            >
              See how it reads
            </button>
          </div>
          <p className="m-0 mt-6 text-[11px] font-mono animate-hero-rise" style={{ color: 'var(--ink-soft)', animationDelay: '340ms' }}>
            No account / Nothing stored / Shows its work
          </p>
        </div>
      </div>

      {/* Video column — flush to the viewport's right edge */}
      <div className="hero-split-media animate-hero-rise" style={{ animationDelay: '220ms' }}>
        <video
          src="/Vid/truth.mp4"
          className="hero-split-video"
          muted
          loop
          playsInline
          preload="metadata"
          autoPlay={!reducedMotion}
          controls={reducedMotion}
          aria-label="Video of hands typing on a laptop in lamplight"
        />
      </div>
    </div>
  )
}
