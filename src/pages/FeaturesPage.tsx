import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'

const types = [
  {
    t: 'Message',
    d: 'Urgent language, credential requests and sender mismatches — the reflexive check for an unexpected inbox.',
  },
  {
    t: 'Link',
    d: 'URL shape, shortening, redirects and risk-level domains before you click.',
  },
  {
    t: 'Article',
    d: 'Claim framing, sourcing and language that pressures a quick share.',
  },
  {
    t: 'Document',
    d: 'A pasted file, invoice or export read as a single object with the same structured output.',
  },
  {
    t: 'Image',
    d: 'Uploaded scans inspected for AI generation, deepfakes or digital manipulation, with the markers that led to the read.',
  },
]

const commitments = [
  'No account, no storage — content is validated, checked and discarded.',
  'Confidence shown as a range, not a false-precision number.',
  'Low certainty is stated and asks you to cross-check.',
]

export default function FeaturesPage() {
  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      {/* Header */}
      <section className="paper-grain" style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="mx-auto w-full" style={{ maxWidth: 1120, padding: '64px 24px 48px' }}>
          <p className="font-serif-display" style={{ color: 'var(--ink-soft)', fontSize: 15, maxWidth: '68ch', margin: '0 0 16px' }}>
            A short check with a clear output.
          </p>
          <h1 className="font-serif-display" style={{ color: 'var(--ink)', fontSize: 'clamp(28px,4vw,38px)', lineHeight: 1.15, maxWidth: '24ch', margin: 0 }}>
            Same structure every time, built for quick decisions.
          </h1>
          <p className="font-serif-display" style={{ color: 'var(--ink)', fontSize: 18, lineHeight: 1.6, maxWidth: '68ch', marginTop: 18 }}>
            Paste what you received. Get the same shape back every time {`\u2014`} verdict, confidence,
            explanation and signals. No chat, no extra steps.
          </p>
        </div>
      </section>

      {/* What gets checked */}
      <section className="paper-grain" style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="mx-auto w-full" style={{ maxWidth: 1120, padding: '56px 24px' }}>
          <h2 className="font-instrument font-semibold mb-8" style={{ fontSize: 22, color: 'var(--ink)' }}>
            What gets checked
          </h2>
          <div className="grid gap-x-10 gap-y-10 md:grid-cols-2" style={{ maxWidth: 900 }}>
            {types.map(t => (
              <div key={t.t}>
                <h3 className="font-instrument font-semibold mb-2" style={{ fontSize: 16, color: 'var(--ink)' }}>
                  {t.t}
                </h3>
                <p className="font-serif-display m-0" style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink-soft)', maxWidth: '68ch' }}>
                  {t.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The output */}
      <section className="paper-grain" style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="mx-auto w-full" style={{ maxWidth: 1120, padding: '56px 24px' }}>
          <h2 className="font-instrument font-semibold mb-8" style={{ fontSize: 22, color: 'var(--ink)' }}>
            The output
          </h2>
          <div className="grid gap-x-10 gap-y-10 md:grid-cols-2" style={{ maxWidth: 900 }}>
            <div>
              <h3 className="font-instrument font-semibold mb-2" style={{ fontSize: 16, color: 'var(--ink)' }}>
                Verdict
              </h3>
              <p className="font-serif-display m-0" style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink-soft)', maxWidth: '68ch' }}>
                Safe, Suspicious or Scam, always with a confidence range instead of a single number.
              </p>
            </div>
            <div>
              <h3 className="font-instrument font-semibold mb-2" style={{ fontSize: 16, color: 'var(--ink)' }}>
                Explanation
              </h3>
              <p className="font-serif-display m-0" style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink-soft)', maxWidth: '68ch' }}>
                One short paragraph in plain language, written so you can forward it to whoever sent it.
              </p>
            </div>
            <div>
              <h3 className="font-instrument font-semibold mb-2" style={{ fontSize: 16, color: 'var(--ink)' }}>
                Signals
              </h3>
              <p className="font-serif-display m-0" style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink-soft)', maxWidth: '68ch' }}>
                The checkable cues behind the verdict, each one you can verify yourself.
              </p>
            </div>
            <div>
              <h3 className="font-instrument font-semibold mb-2" style={{ fontSize: 16, color: 'var(--ink)' }}>
                Consistency
              </h3>
              <p className="font-serif-display m-0" style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink-soft)', maxWidth: '68ch' }}>
                Structured JSON and narrow prompts keep results fast, consistent and easy to scan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Commitments */}
      <section className="paper-grain" style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="mx-auto w-full" style={{ maxWidth: 1120, padding: '56px 24px' }}>
          <h2 className="font-instrument font-semibold mb-8" style={{ fontSize: 22, color: 'var(--ink)' }}>
            Privacy by default
          </h2>
          <ul className="m-0 list-none p-0 grid gap-4" style={{ maxWidth: 900 }}>
            {commitments.map(c => (
              <li key={c} className="flex gap-3 items-start">
                <ShieldCheck size={16} className="mt-1 shrink-0" style={{ color: 'var(--lamp)' }} />
                <span className="font-serif-display" style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink-soft)' }}>
                  {c}
                </span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 40 }}>
            <Link
              to="/analyzer"
              className="inline-block text-sm font-sans font-semibold no-underline"
              style={{ color: 'var(--ink)' }}
            >
              <span style={{ borderBottom: '1px solid var(--lamp)' }}>Try it now</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}