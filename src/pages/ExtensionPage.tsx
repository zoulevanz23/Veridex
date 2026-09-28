import ExtensionDemo from '../components/landing/ExtensionDemo'
import { ShieldCheck, Zap, MousePointerClick, Menu, Image as ImageIcon, Download } from 'lucide-react'

export default function ExtensionPage() {
  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh', color: 'var(--ink)' }}>
      {/* Hero */}
      <section className="paper-grain" style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="max-w-[1120px] mx-auto px-6 py-16">
          <div className="max-w-[720px] mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-sm text-[11px] font-instrument font-semibold mb-6"
              style={{ background: 'rgba(228,166,27,0.15)', color: 'var(--ink)', border: '1px solid var(--line)' }}
            >
              <ShieldCheck size={13} style={{ color: 'var(--lamp)' }} />
              Veridex Chrome & Edge Extension
            </div>
            <h1
              className="text-[clamp(28px,4vw,38px)] font-serif-display font-normal leading-tight tracking-tight m-0"
              style={{ color: 'var(--ink)' }}
            >
              Highlight any phrase on the web.<br />Instant forensic verification.
            </h1>
            <p
              className="font-serif-display text-[17px] leading-relaxed mt-5 max-w-[640px] mx-auto"
              style={{ color: 'var(--ink-soft)' }}
            >
              Highlight text on any website or right-click any suspicious link. Veridex evaluates claims, phishing indicators, and AI synthesis inline without leaving your page.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6" style={{ color: 'var(--ink-soft)' }}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-sans" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
                <MousePointerClick size={13} style={{ color: 'var(--lamp)' }} /> Highlight Selection
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-sans" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
                <Menu size={13} style={{ color: 'var(--lamp)' }} /> Right-Click Context Menu
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-sans" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
                <ImageIcon size={13} style={{ color: 'var(--lamp)' }} /> Image & Link Inspection
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Download */}
      <section style={{ background: 'var(--surface)', borderBottom: '1px solid var(--line)' }}>
        <div className="max-w-[1120px] mx-auto px-6 py-14">
          <div className="max-w-[720px] mx-auto text-center">
            <h2 className="text-[22px] font-instrument font-bold tracking-tight m-0 mb-3" style={{ color: 'var(--ink)' }}>
              Download the extension
            </h2>
            <p className="font-serif-display text-[16px] leading-relaxed mb-7 max-w-[560px] mx-auto" style={{ color: 'var(--ink-soft)' }}>
              Get the latest Veridex browser extension as a ready-to-install package. Works with Chrome, Edge, Brave, and other Chromium-based browsers.
            </p>
            <div className="inline-flex flex-col items-center gap-3">
              <a
                href="/browser-extension.zip"
                download
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-sm font-instrument font-semibold text-sm no-underline transition-colors"
                style={{ background: 'var(--ink)', color: 'var(--paper)', border: '1px solid var(--ink)' }}
              >
                <Download size={17} />
                Download Extension (.zip)
              </a>
              <span className="text-xs font-mono" style={{ color: 'var(--ink-soft)' }}>
                v1.2 · 31 KB · Chromium-based browsers
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Extension Demo Sandbox */}
      <section style={{ background: 'var(--paper)', borderBottom: '1px solid var(--line)' }}>
        <div className="max-w-[1120px] mx-auto px-6 py-14">
          <div className="text-center mb-8">
            <span className="text-[11px] font-instrument font-semibold tracking-wide" style={{ color: 'var(--ink-soft)', borderBottom: '1px solid var(--lamp)', paddingBottom: '4px' }}>
              Live Interactive Demo
            </span>
          </div>
          <ExtensionDemo />
        </div>
      </section>

      {/* Installation & Quick Setup Guide */}
      <section className="paper-grain">
        <div className="max-w-[1120px] mx-auto px-6 py-14">
          <div className="max-w-[720px] mx-auto">
            <div className="p-8 rounded-sm" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
              <h2 className="text-[22px] font-instrument font-bold tracking-tight m-0 mb-6 flex items-center gap-2.5" style={{ color: 'var(--ink)' }}>
                <Zap size={20} style={{ color: 'var(--lamp)' }} />
                Install Locally (Chrome / Edge / Brave)
              </h2>
              <ol className="m-0 pl-5 font-serif-display text-[16px] leading-[1.9]" style={{ color: 'var(--ink)' }}>
                <li>
                  Open the repository folder on your computer and locate <code className="px-2 py-0.5 rounded font-mono text-[13px]" style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}>browser-extension</code>.
                </li>
                <li>
                  In your browser, open <code className="px-2 py-0.5 rounded font-mono text-[13px]" style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}>chrome://extensions</code> (or <code className="px-2 py-0.5 rounded font-mono text-[13px]" style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}>edge://extensions</code>).
                </li>
                <li>
                  Turn on <span className="font-semibold" style={{ color: 'var(--lamp)' }}>Developer mode</span> using the toggle in the top-right corner.
                </li>
                <li>
                  Click <span className="font-semibold">Load unpacked</span> and choose the <code className="px-2 py-0.5 rounded font-mono text-[13px]" style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}>browser-extension</code> directory.
                </li>
              </ol>
              <div
                className="mt-6 p-4 rounded-sm font-serif-display text-[15px] leading-[1.7] flex items-start gap-3"
                style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink-soft)' }}
              >
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: 'var(--lamp)' }} />
                <div>
                  <strong>How to use:</strong> Simply highlight any phrase on any webpage to see the floating <span style={{ color: 'var(--ink)', fontWeight: 600 }}>"Check with Veridex"</span> trigger, or right-click text/links/images to run instant analysis!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
