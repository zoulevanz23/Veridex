import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import EvidenceCard, { SampleData } from './EvidenceCard'

const TABS = ['Message', 'Link', 'Article', 'Document'] as const
type Tab = typeof TABS[number]

// ── Sample data for each tab ─────────────────────────────────────────────────

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <mark
      className="rounded-sm px-0.5 font-semibold"
      style={{ background: 'rgba(228,166,27,0.18)', color: 'inherit' }}
    >
      {children}
    </mark>
  )
}

const SAMPLES: Record<Tab, SampleData> = {
  Message: {
    rawText:
      "Dear customer, your DHL package #7291-JK was unable to be delivered today due to an incomplete address. To avoid return to sender, confirm your delivery details within 24 hours using the link below. Failure to do so will result in additional fees. Confirm now: dh1-delivery.secure-info.net/verify?id=7291JK",
    body: (
      <>
        Dear customer, your DHL package #7291-JK was unable to be{' '}
        delivered today due to an incomplete address.{' '}
        <Highlight>To avoid return to sender, confirm your delivery details within 24 hours</Highlight>{' '}
        using the link below.{' '}
        <Highlight>Failure to do so will result in additional fees.</Highlight>
        {'\n\n'}
        Confirm now:{' '}
        <Highlight>
          <span className="font-mono text-xs">dh1-delivery.secure-info.net/verify?id=7291JK</span>
        </Highlight>
      </>
    ),
    flags: [
      { label: 'Creates urgency', topPct: 20, rot: -1.5 },
      { label: 'Link doesn\'t match sender', topPct: 52, rot: 1 },
      { label: 'Asks for personal info', topPct: 72, rot: -0.8 },
    ],
    verdict: 'Suspicious',
    confidence: 87,
    verdictColor: 'var(--suspicious)',
    explanation: 'Urgent framing, a domain that impersonates a courier, and a request for personal information.',
  },

  Link: {
    rawText: 'paypa1-secure.account-verify.net/login?redirect=billing',
    body: (
      <>
        <span className="block mb-3 text-xs font-sans" style={{ color: 'var(--ink-soft)' }}>URL submitted for check:</span>
        <span className="font-mono text-sm block leading-relaxed">
          <Highlight>paypa1</Highlight>
          -secure.
          <Highlight>account-verify.net</Highlight>
          /login?redirect=billing
        </span>
        <div className="mt-5 text-sm font-sans leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          The domain substitutes the letter "l" for "1" in a recognizable brand name. The hosting domain{' '}
          <Highlight>account-verify.net</Highlight> has no documented relationship to PayPal. The path{' '}
          <Highlight>/login?redirect=billing</Highlight> routes through a redirect that is consistent with a credential-harvesting flow.
        </div>
      </>
    ),
    flags: [
      { label: 'Homograph substitution (1 → l)', topPct: 18, rot: -1 },
      { label: 'Unrelated hosting domain', topPct: 48, rot: 1.2 },
      { label: 'Redirect to credential page', topPct: 72, rot: -0.5 },
    ],
    verdict: 'Scam',
    confidence: 94,
    verdictColor: 'var(--scam)',
    meta: {
      fromLabel: 'Source:',
      fromValue: 'Forwarded SMS · sender unknown',
      date: 'Today, 11:02',
      subject: '“PayPal”: verify your billing details',
    },
    explanation: 'Character substitution in the brand name, an unrelated hosting domain, and a redirect into a credential page.',
  },

  Article: {
    rawText:
      'SCIENTISTS SHOCKED: Common household item cures inflammation overnight, and Big Pharma doesn\'t want you to know. A study published in an unnamed European journal claims a 97% success rate...',
    body: (
      <>
        <Highlight>SCIENTISTS SHOCKED:</Highlight> Common household item cures inflammation overnight,{' '}
        and <Highlight>Big Pharma doesn't want you to know.</Highlight>
        {'\n\n'}
        A study published in an unnamed European journal claims a{' '}
        <Highlight>97% success rate</Highlight>{' '}
        — far exceeding any peer-reviewed findings on the subject. The article urges readers to{' '}
        <Highlight>share before it gets taken down.</Highlight>
      </>
    ),
    flags: [
      { label: 'Authority framing', topPct: 15, rot: -1.2 },
      { label: 'Unverifiable source cited', topPct: 45, rot: 0.8 },
      { label: 'Pressure to share urgently', topPct: 72, rot: -1 },
    ],
    verdict: 'Suspicious',
    confidence: 78,
    verdictColor: 'var(--suspicious)',
    meta: {
      fromLabel: 'Source:',
      fromValue: 'Viral post · health-tips-daily.example',
      date: 'Shared 2,140 times',
      subject: '“Common household item cures inflammation overnight”',
    },
    explanation: 'Authority framing, an unverifiable study, and pressure to share before checking.',
  },

  Document: {
    rawText:
      'Invoice #INV-2024-8843. Amount due: $4,280.00. Please transfer to the new account details below — our banking provider has changed. Bank: Meridian Trust, Account: 8821-004-77. Payment due within 48 hours to avoid service suspension.',
    body: (
      <>
        <div className="text-xs font-sans mb-3 pb-3 flex justify-between" style={{ borderBottom: '1px solid var(--line)', color: 'var(--ink-soft)' }}>
          <span>Invoice #INV-2024-8843</span>
          <span>Amount due: $4,280.00</span>
        </div>
        Please transfer to the{' '}
        <Highlight>new account details below — our banking provider has changed.</Highlight>
        {'\n\n'}
        Bank: Meridian Trust{' '}
        Account: <Highlight>8821-004-77</Highlight>
        {'\n\n'}
        <Highlight>Payment due within 48 hours to avoid service suspension.</Highlight>
      </>
    ),
    flags: [
      { label: 'Banking detail change mid-document', topPct: 25, rot: -1.5 },
      { label: 'Unverifiable account reference', topPct: 52, rot: 0.9 },
      { label: 'Deadline threat', topPct: 74, rot: -0.7 },
    ],
    verdict: 'Suspicious',
    confidence: 82,
    verdictColor: 'var(--suspicious)',
    meta: {
      fromLabel: 'Document:',
      fromValue: 'Invoice #INV-2024-8843 · vendor email changed last week',
      date: 'Received yesterday',
      subject: 'Amount due: $4,280.00 — new bank details inside',
    },
    explanation: 'Banking details change mid-document, an unverifiable account reference, and a deadline threat.',
  },
}

// ── Component ────────────────────────────────────────────────────────────────

interface FolderTabsProps {
  mobile?: boolean
}

export default function FolderTabs({ mobile }: FolderTabsProps) {
  const [active, setActive] = useState<Tab>('Message')
  const [direction, setDirection] = useState(0)

  const handleTab = (tab: Tab) => {
    const tabIndex = TABS.indexOf(tab)
    const activeIndex = TABS.indexOf(active)
    setDirection(tabIndex > activeIndex ? 1 : -1)
    setActive(tab)
  }

  return (
    <div className="w-full">
      {/* Tab row */}
      <div
        className={`flex ${mobile ? 'overflow-x-auto gap-1 pb-0 tab-scroll' : 'gap-0'} relative`}
        role="tablist"
        aria-label="Content type"
        style={{ paddingBottom: 0 }}
      >
        {TABS.map((tab, i) => {
          const isActive = tab === active
          return (
            <button
              key={tab}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tab-panel-${tab}`}
              id={`tab-${tab}`}
              onClick={() => handleTab(tab)}
              className={`
                relative font-sans text-sm font-medium px-5 py-2.5 transition-all
                flex-shrink-0 focus-visible:outline-none
                ${mobile ? 'rounded-t-md' : ''}
                ${isActive
                  ? 'z-10'
                  : 'opacity-70 hover:opacity-90'
                }
              `}
              style={{
                background: isActive ? 'var(--surface)' : 'var(--paper)',
                color: isActive ? 'var(--ink)' : 'var(--ink-soft)',
                border: `1px solid var(--line)`,
                borderBottom: isActive ? `1px solid var(--surface)` : `1px solid var(--line)`,
                transform: isActive ? 'translateY(0)' : 'translateY(3px)',
                // Overlap tabs slightly like real folder tabs
                marginLeft: i > 0 && !mobile ? -1 : 0,
                borderRadius: '6px 6px 0 0',
                // notch shape via clip-path
                clipPath: 'polygon(6% 30%, 0% 100%, 100% 100%, 100% 30%, 94% 0%, 6% 0%)',
              }}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {/* Evidence card panel */}
      <div
        id={`tab-panel-${active}`}
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        className="relative overflow-visible"
        style={{
          border: `1px solid var(--line)`,
          borderRadius: '0 8px 8px 8px',
          background: 'var(--surface)',
          padding: mobile ? '24px 16px 32px' : '40px 40px 40px',
        }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={active}
            custom={direction}
            initial={{ opacity: 0, x: direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -16 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <EvidenceCard data={SAMPLES[active]} mobile={mobile} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
