import { ShieldCheck, ShieldAlert, ShieldX, Copy, Share2 } from 'lucide-react'
import cn from 'classnames'

type Verdict = 'SAFE' | 'SUSPICIOUS' | 'SCAM' | 'TRUSTWORTHY' | 'QUESTIONABLE' | 'LIKELY_FAKE'
interface Props { result: { verdict: Verdict; confidence: number; explanation: string; signals: string[]; rawText?: string } }

const label: Record<Verdict,string> = {
  SAFE:'Safe', TRUSTWORTHY:'Trustworthy', SUSPICIOUS:'Suspicious', QUESTIONABLE:'Questionable', SCAM:'Likely scam', LIKELY_FAKE:'Likely fake'
}
const tone = (v: Verdict) => {
  if (v==='SAFE' || v==='TRUSTWORTHY') return { bg:'rgba(30,127,92,0.1)', border:'rgba(30,127,92,0.25)', color:'var(--safe)', Icon: ShieldCheck }
  if (v==='SCAM' || v==='LIKELY_FAKE') return { bg:'rgba(168,64,42,0.1)', border:'rgba(168,64,42,0.25)', color:'var(--scam)', Icon: ShieldX }
  return { bg:'rgba(228,166,27,0.12)', border:'rgba(228,166,27,0.3)', color:'var(--suspicious)', Icon: ShieldAlert }
}

export default function ResultCard({ result }: Props) {
  const t = tone(result.verdict)
  const pct = Math.max(0, Math.min(100, Math.round(result.confidence)))

  const copy = async () => {
    const text = `Verdict: ${label[result.verdict]} (${pct}%)\n\n${result.explanation}\n\nSignals:\n- ${result.signals.join('\n- ')}`
    try { await navigator.clipboard.writeText(text) } catch {}
  }
  const share = async () => {
    const text = `Verdict: ${label[result.verdict]} — ${result.explanation.slice(0,120)}`
    try {
      if ((navigator as any).share) await (navigator as any).share({ title:'Veridex result', text })
      else await navigator.clipboard.writeText(text)
    } catch {}
  }

  return (
    <div className="rounded-sm overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
      <div className="px-5 py-5 pb-4" style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex gap-3 items-center">
            <span className="w-9 h-9 rounded-sm inline-flex items-center justify-center" style={{ background: t.bg, border: `1px solid ${t.border}`, color: t.color }}>
              <t.Icon size={18} strokeWidth={2} />
            </span>
            <div>
              <div className="text-[11px] font-instrument font-semibold" style={{ color: 'var(--ink-soft)' }}>Analysis complete</div>
              <div className="text-[22px] font-instrument font-bold tracking-tight leading-tight" style={{ color: 'var(--ink)' }}>{label[result.verdict]}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={copy} aria-label="Copy result" className="w-9 h-9 rounded-sm inline-flex items-center justify-center cursor-pointer" style={{ border: '1px solid var(--line)', background: 'var(--paper)', color: 'var(--ink-soft)' }}><Copy size={16} /></button>
            <button onClick={share} aria-label="Share result" className="w-9 h-9 rounded-sm inline-flex items-center justify-center cursor-pointer" style={{ border: '1px solid var(--line)', background: 'var(--paper)', color: 'var(--ink-soft)' }}><Share2 size={16} /></button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-baseline mb-1.5">
            <span className="text-xs font-semibold" style={{ color: 'var(--ink-soft)' }}>Confidence</span>
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--ink)' }}>{pct}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--paper)' }}>
            <div className={cn('h-full rounded-full transition-all duration-600')} style={{ width:`${pct}%`, background: t.color }} />
          </div>
          <div className="text-xs mt-1.5" style={{ color: 'var(--ink-soft)' }}>
            {pct >= 80 ? 'High certainty' : pct >= 55 ? 'Moderate certainty' : 'Low certainty — verify with additional sources'}
          </div>
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="text-xs font-instrument font-semibold mb-2" style={{ color: 'var(--ink-soft)' }}>What this means</div>
        <p className="m-0 font-serif-display text-[16px] leading-[1.7] whitespace-pre-wrap" style={{ color: 'var(--ink)' }}>{result.explanation}</p>
      </div>

      {result.signals?.length > 0 && (
        <div className="px-5 pb-4">
          <div className="text-xs font-instrument font-semibold mb-2" style={{ color: 'var(--ink-soft)' }}>Why this result</div>
          <div className="rounded-sm overflow-hidden" style={{ border: '1px solid var(--line)' }}>
            {result.signals.slice(0,8).map((s,i) => (
              <div key={i} className="px-3 py-2.5 flex gap-2.5 items-start" style={{ background: i % 2 === 0 ? 'var(--paper)' : 'var(--surface)', borderTop: i !== 0 ? '1px solid var(--line)' : 'none' }}>
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: t.color }} />
                <span className="font-serif-display text-[16px] leading-[1.7]" style={{ color: 'var(--ink)' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-5 py-3 flex justify-between items-center gap-3 flex-wrap" style={{ background: 'var(--paper)', borderTop: '1px solid var(--line)' }}>
        <span className="text-xs" style={{ color: 'var(--ink-soft)' }}>Always verify from multiple sources.</span>
        <span className="text-[11px] font-mono" style={{ color: 'var(--ink-soft)' }}>ID {String(Date.now()).slice(-6)} • {new Date().toLocaleDateString()}</span>
      </div>
    </div>
  )
}