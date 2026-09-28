import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FolderTabs from '../components/landing/FolderTabs'
import HeroSection from '../components/landing/HeroSection'
import Reveal from '../components/landing/Reveal'
import MarginNotes from '../components/landing/MarginNotes'
import ExtensionDemo from '../components/landing/ExtensionDemo'
import IntakeSlip from '../components/landing/IntakeSlip'
import { analyzeContent, type AnalysisResponse } from '../lib/api'

function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const q = window.matchMedia('(max-width: 767px)')
    const update = () => setMobile(q.matches)
    update()
    q.addEventListener('change', update)
    return () => q.removeEventListener('change', update)
  }, [])
  return mobile
}

const verdictColorFor = (verdict: string) => {
  const v = verdict.toLowerCase()
  if (v === 'safe' || v === 'trustworthy') return 'var(--safe)'
  if (v === 'scam') return 'var(--scam)'
  return 'var(--suspicious)'
}

/* A real paste field wired to the analyzer backend — the hero is the product */
function PasteBox() {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalysisResponse['result'] | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || loading) return
    if (trimmed.length < 10) {
      setError('Please paste at least a sentence or two — a few words are hard to verify.')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const out = await analyzeContent(value, 'message')
      setResult(out)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="rounded-sm"
      style={{ background: 'var(--surface)', border: '1px solid var(--line)', maxWidth: 640 }}
    >
      <form onSubmit={submit} className="m-0">
        <label
          htmlFor="hero-paste"
          className="block px-4 pt-4 pb-2 text-sm font-sans font-semibold"
          style={{ color: 'var(--ink)' }}
        >
          Paste here to try it
        </label>
        <div className="px-4">
          <textarea
            id="hero-paste"
            rows={4}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={loading}
            maxLength={10000}
            placeholder="Paste the message exactly as you received it, sender and all…"
            className="w-full rounded-sm p-3 text-sm font-sans focus:outline-none"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              color: 'var(--ink)',
            }}
          />
        </div>
        <div
          className="px-4 py-3 mt-1 flex items-center justify-between gap-3 flex-wrap"
          style={{ borderTop: '1px solid var(--line)' }}
        >
          <span className="text-xs font-mono" style={{ color: 'var(--ink-soft)' }}>
            {value.length} / 10,000 · discarded after checking
          </span>
          <button
            type="submit"
            disabled={!value.trim() || loading}
            className="px-5 py-2.5 rounded-sm text-sm font-sans font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-default"
            style={{ background: 'var(--ink)', color: 'var(--paper)', border: 'none' }}
          >
            {loading ? 'Checking…' : 'Check this'}
          </button>
        </div>
      </form>

      {error && (
        <p className="mx-4 mb-4 text-sm font-sans" style={{ color: 'var(--scam)' }}>
          {error}
        </p>
      )}

      {result && (
        <div className="mx-4 mb-4 p-4 rounded-sm" style={{ border: '1px solid var(--line)', background: 'var(--paper)' }}>
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="font-instrument font-bold text-base" style={{ color: verdictColorFor(result.verdict) }}>
              {result.verdict}
            </span>
            <span className="text-xs font-mono" style={{ color: 'var(--ink-soft)' }}>
              {result.confidence}% confidence
            </span>
          </div>
          {result.explanation && (
            <p className="mt-2 mb-0 text-sm font-serif-display leading-relaxed" style={{ color: 'var(--ink)' }}>
              {result.explanation}
            </p>
          )}
          <Link
            to="/analyzer"
            className="inline-block mt-3 text-sm font-sans font-semibold no-underline"
            style={{ color: 'var(--ink)' }}
          >
            <span style={{ borderBottom: '1px solid var(--lamp)' }}>Open the full workspace for signals</span>
          </Link>
        </div>
      )}
    </div>
  )
}

const HomePage = () => {
  const mobile = useIsMobile()

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      {/* Lamp light falls from the upper left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0"
        style={{
          height: 420,
          background: 'radial-gradient(560px 300px at 18% 0%, rgba(228,166,27,0.10), transparent 70%)',
        }}
      />

      {/* Hero — fills the viewport on initial load */}
      <section
        className="relative"
        style={{ minHeight: 'calc(100svh - 53px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowX: 'clip' }}
      >
        <HeroSection onTryIt={() => scrollTo('try-it')} onSeeDemo={() => scrollTo('examination')} />
        <div
          aria-hidden="true"
          className="absolute bottom-5 left-0 right-0 flex flex-col items-center gap-2 animate-hero-rise"
          style={{ animationDelay: '550ms' }}
        >
          <span className="text-[10px] font-mono" style={{ color: 'var(--ink-soft)' }}>Scroll</span>
          <span style={{ width: 1, height: 28, background: 'var(--line)' }} />
        </div>
      </section>

      {/* The live examination */}
      <section id="examination" style={{ borderTop: '1px solid var(--line)', scrollMarginTop: 72 }}>
        <div className="mx-auto px-6 w-full" style={{ maxWidth: 1120, paddingTop: 56, paddingBottom: 56 }}>
          <Reveal>
            <h2 className="font-instrument font-semibold mb-3" style={{ fontSize: 22, color: 'var(--ink)' }}>
              Watch an examination
            </h2>
            <p className="font-serif-display mt-0 mb-10" style={{ color: 'var(--ink-soft)', fontSize: 17, lineHeight: 1.7, maxWidth: '68ch' }}>
              Four exhibits, each read the way a fraud examiner would — flags first, verdict last.
            </p>
            <FolderTabs mobile={mobile} />
          </Reveal>
        </div>
      </section>

      {/* Try it — the paste box */}
      <section id="try-it" style={{ borderTop: '1px solid var(--line)', background: 'var(--surface)', scrollMarginTop: 72 }}>
        <div className="mx-auto px-6 w-full" style={{ maxWidth: 1120, paddingTop: 56, paddingBottom: 56 }}>
          <p
            className="font-serif-display mt-0 mb-8"
            style={{ color: 'var(--ink)', fontSize: 18, lineHeight: 1.6, maxWidth: '68ch' }}
          >
            Paste anything. Veridex reads it the way a fraud examiner would, and shows its work.
          </p>
          <PasteBox />
        </div>
      </section>

      {/* How it works — margin notes beside a continuous paragraph */}
      <section style={{ borderTop: '1px solid var(--line)' }}>
        <div className="mx-auto px-6 w-full" style={{ maxWidth: 1120, paddingTop: 56, paddingBottom: 56 }}>
          <h2 className="font-instrument font-semibold mb-8" style={{ fontSize: 22, color: 'var(--ink)' }}>
            How it works
          </h2>
          <MarginNotes
            notes={[
              { id: 'n1', note: 'Heuristics run first, and stay visible in the output.', targetId: 'hw-1' },
              { id: 'n2', note: 'The model check follows one fixed structure.', targetId: 'hw-2' },
              { id: 'n3', note: 'Low confidence is stated, not hidden.', targetId: 'hw-3' },
            ]}
          >
            <p className="font-serif-display" style={{ fontSize: 17, lineHeight: 1.75, color: 'var(--ink)' }}>
              <span id="hw-1">
                Every submission first passes through transparent heuristics that flag pressure tactics,
                credential requests, and reshaped links.{' '}
              </span>
              <span id="hw-2">
                A structured check then reads the full context and returns the same shape every time:
                a verdict, a confidence range, a plain-language explanation, and the signals behind it.{' '}
              </span>
              <span id="hw-3">
                Nothing is retained along the way — content is validated, examined, and discarded.
              </span>
            </p>
          </MarginNotes>
        </div>
      </section>

      {/* Extension — the literal product moment */}
      <section style={{ borderTop: '1px solid var(--line)', background: 'var(--surface)' }}>
        <div className="mx-auto px-6 w-full" style={{ maxWidth: 1120, paddingTop: 56, paddingBottom: 56 }}>
          <h2 className="font-instrument font-semibold mb-4" style={{ fontSize: 22, color: 'var(--ink)' }}>
            Check without leaving the page
          </h2>
          <p className="font-serif-display mb-10" style={{ fontSize: 17, lineHeight: 1.75, color: 'var(--ink-soft)', maxWidth: '68ch' }}>
            Right-click anything doubtful and verify it inline. The extension reads the selection
            and returns the same verdict, right where you are.
          </p>
          <ExtensionDemo />
          <Link
            to="/extension"
            className="inline-block mt-8 text-sm font-sans font-semibold no-underline"
            style={{ color: 'var(--ink)' }}
          >
            <span style={{ borderBottom: '1px solid var(--lamp)' }}>Get the browser extension</span>
          </Link>
        </div>
      </section>

      {/* Principles — short paragraphs, one with extra care */}
      <section style={{ borderTop: '1px solid var(--line)' }}>
        <div className="mx-auto px-6 w-full" style={{ maxWidth: 1120, paddingTop: 56, paddingBottom: 56 }}>
          <div className="grid gap-10 md:grid-cols-2" style={{ maxWidth: 960 }}>
            <div>
              <h3 className="font-instrument font-semibold mb-2" style={{ fontSize: 16, color: 'var(--ink)' }}>
                Verdict
              </h3>
              <p className="font-serif-display m-0" style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink-soft)', maxWidth: '68ch' }}>
                Safe, Suspicious, or Scam, always with a confidence range instead of a
                false-precision number. When certainty is low, Veridex says so and asks
                you to cross-check.
              </p>
            </div>
            <div>
              <h3 className="font-instrument font-semibold mb-2" style={{ fontSize: 16, color: 'var(--ink)' }}>
                Explanation
              </h3>
              <p className="font-serif-display m-0" style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink-soft)', maxWidth: '68ch' }}>
                One short paragraph in plain language, written so you can forward it to
                whoever sent you the message.
              </p>
            </div>
            <div>
              <h3 className="font-instrument font-semibold mb-2" style={{ fontSize: 16, color: 'var(--ink)' }}>
                Signals
              </h3>
              <p className="font-serif-display m-0" style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink-soft)', maxWidth: '68ch' }}>
                The checkable details behind the verdict — urgency, credential requests,
                authority framing, reshaped links — each one you can verify yourself.
              </p>
            </div>
            <div>
              <h3 className="font-instrument font-semibold mb-2" style={{ fontSize: 16, color: 'var(--ink)' }}>
                Built for speed
              </h3>
              <p className="font-serif-display m-0" style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink-soft)', maxWidth: '68ch' }}>
                Paste, read, decide. Most checks finish in seconds, and the output is
                shaped for scanning, not scrolling.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-start gap-8">
            <div style={{ maxWidth: 420 }}>
              <h3 className="font-instrument font-semibold mb-2" style={{ fontSize: 16, color: 'var(--ink)' }}>
                Privacy by default
              </h3>
              <p className="font-serif-display m-0" style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink-soft)', maxWidth: '68ch' }}>
                No account, no stored content. What you paste is examined and then gone.
              </p>
            </div>
            <IntakeSlip />
          </div>
        </div>
      </section>

      {/* Quiet close */}
      <section style={{ borderTop: '1px solid var(--line)', background: 'var(--surface)' }}>
        <div className="mx-auto px-6 w-full" style={{ maxWidth: 1120, paddingTop: 40, paddingBottom: 48 }}>
          <p className="font-serif-display mb-4" style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--ink)', maxWidth: '68ch' }}>
            Start with whatever you just received. No setup, no tracking.
          </p>
          <Link
            to="/analyzer"
            className="inline-block text-sm font-sans font-semibold no-underline"
            style={{ color: 'var(--ink)' }}
          >
            <span style={{ borderBottom: '1px solid var(--lamp)' }}>Open the analyzer</span>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
