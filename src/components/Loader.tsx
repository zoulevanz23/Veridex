export default function Loader() {
  return (
    <div className="inline-flex items-center gap-2 text-sm" style={{ color: 'var(--ink-soft)' }}>
      <span className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--line)', borderTopColor: 'var(--ink)' }} />
      <span>Analyzing…</span>
    </div>
  )
}