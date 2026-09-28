import InputForm from '../components/InputForm'
import { ShieldCheck } from 'lucide-react'

const AnalyzerPage = () => {
  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)', minHeight: 'calc(100vh - 56px)' }}>
      <section className="paper-grain" style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="mx-auto w-full" style={{ maxWidth: 1120, padding: '64px 24px 48px' }}>
          <p className="font-serif-display text-[15px]" style={{ color: 'var(--ink-soft)', maxWidth: '68ch', margin: '0 0 16px' }}>
            A short check with a clear output.
          </p>
          <h1 className="font-serif-display" style={{ color: 'var(--ink)', fontSize: 'clamp(28px,4vw,38px)', lineHeight: 1.15, maxWidth: '24ch', margin: 0 }}>
            What do you want to verify?
          </h1>
          <p className="font-serif-display" style={{ color: 'var(--ink)', fontSize: 18, lineHeight: 1.6, maxWidth: '68ch', marginTop: 18 }}>
            Paste a message, link, article, document or image. Veridex returns the same shape every time — verdict, confidence, explanation and signals.
          </p>
          <div className="mt-6">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-instrument font-semibold"
              style={{ background: 'var(--surface)', color: 'var(--safe)', border: '1px solid var(--line)' }}
            >
              <ShieldCheck size={14} /> Privacy-first · No data stored
            </span>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full" style={{ maxWidth: 1120, padding: '56px 24px' }}>
          <InputForm />
        </div>
      </section>

      <section className="paper-grain" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="mx-auto w-full" style={{ maxWidth: 1120, padding: '56px 24px' }}>
          <div className="grid gap-x-10 gap-y-10 md:grid-cols-2" style={{ maxWidth: 900 }}>
            <div>
              <h3 className="font-instrument font-semibold mb-2" style={{ fontSize: 16, color: 'var(--ink)' }}>How it works</h3>
              <p className="font-serif-display m-0" style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink-soft)', maxWidth: '68ch' }}>
                Transparent heuristics run first, then a structured model check reads the full context and returns the same output shape every time.
              </p>
            </div>
            <div>
              <h3 className="font-instrument font-semibold mb-2" style={{ fontSize: 16, color: 'var(--ink)' }}>Trust & privacy</h3>
              <p className="font-serif-display m-0" style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink-soft)', maxWidth: '68ch' }}>
                No login. Content is analyzed and discarded. Rate-limited and validated on the server. Always cross-check important decisions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
export default AnalyzerPage