import { Link } from 'react-router-dom'
import { ShieldCheck, Github, Linkedin, User } from 'lucide-react'
export default function Footer(){
  return (
    <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--line)' }}>
      <div className="max-w-[1120px] mx-auto px-6 py-5 flex justify-between gap-4 flex-wrap items-center">
        <div className="flex gap-2.5 items-center text-sm" style={{ color: 'var(--ink-soft)' }}>
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-sm" style={{ background: 'var(--ink)' }}>
            <ShieldCheck size={12} color="var(--paper)" />
          </span>
          <span className="font-instrument font-semibold" style={{ color: 'var(--ink)' }}>Veridex</span>
          <span>© {new Date().getFullYear()} • Privacy-first verification</span>
        </div>
        <div className="flex gap-3.5 text-sm font-sans items-center">
          <Link to="/features" className="no-underline" style={{ color: 'var(--ink-soft)' }}>How it works</Link>
          <Link to="/analyzer" className="no-underline" style={{ color: 'var(--ink-soft)' }}>Analyzer</Link>
          <Link to="/about" className="no-underline" style={{ color: 'var(--ink-soft)' }}>About</Link>
          <span aria-hidden="true" style={{ width: 1, height: 16, background: 'var(--line)' }} />
          <a
            href="https://github.com/zoulevanz23"
            target="_blank"
            rel="noreferrer"
            aria-label="Developer GitHub"
            className="inline-flex items-center"
            style={{ color: 'var(--ink-soft)' }}
          >
            <Github size={16} />
          </a>
          {/* Placeholder links — swap hrefs for the real profile URLs */}
          <a
            href="#"
            aria-label="Developer LinkedIn (link coming soon)"
            title="LinkedIn (link coming soon)"
            className="inline-flex items-center"
            style={{ color: 'var(--ink-soft)', opacity: 0.55 }}
          >
            <Linkedin size={16} />
          </a>
          <a
            href="#"
            aria-label="Developer portfolio (link coming soon)"
            title="Portfolio (link coming soon)"
            className="inline-flex items-center"
            style={{ color: 'var(--ink-soft)', opacity: 0.55 }}
          >
            <User size={16} />
          </a>
        </div>
      </div>
    </footer>
  )
}