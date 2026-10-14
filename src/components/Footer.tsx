import { Link } from 'react-router-dom'
import { Github, Linkedin, User } from 'lucide-react'
export default function Footer(){
  return (
    <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--line)' }}>
      <div className="max-w-[1120px] mx-auto px-6 py-5 flex justify-between gap-4 flex-wrap items-center">
        <div className="flex gap-2.5 items-center text-sm" style={{ color: 'var(--ink-soft)' }}>
          <img src="/veridex-logo.png" alt="Veridex logo" className="w-5 h-5 object-contain rounded-sm" />
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
          {/* Placeholder link — swap href for the real portfolio URL */}
          <a
            href="https://www.linkedin.com/in/josh-ivan-sartin-312287376/"
            target="_blank"
            rel="noreferrer"
            aria-label="Developer LinkedIn"
            className="inline-flex items-center"
            style={{ color: 'var(--ink-soft)' }}
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