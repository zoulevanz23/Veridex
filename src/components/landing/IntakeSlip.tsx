export default function IntakeSlip() {
  return (
    <div
      className="perf-edge inline-block relative overflow-hidden"
      style={{
        background: 'var(--surface)',
        padding: '20px 28px',
        maxWidth: 400,
      }}
      aria-label="Privacy notice: Analyzed and discarded. Not stored."
    >
      {/* RECEIVED stamp mark */}
      <div
        className="absolute top-3 right-4 font-sans font-bold text-[11px] tracking-[0.18em] uppercase select-none pointer-events-none"
        style={{
          color: 'var(--suspicious)',
          opacity: 0.22,
          transform: 'rotate(-8deg)',
          letterSpacing: '0.18em',
          border: '1.5px solid var(--suspicious)',
          padding: '2px 8px',
          borderRadius: 2,
        }}
        aria-hidden="true"
      >
        Received
      </div>

      {/* Lab intake fields */}
      <div className="grid gap-1.5">
        <div className="flex items-baseline gap-3">
          <span className="text-[10px] font-sans uppercase tracking-widest" style={{ color: 'var(--ink-soft)', minWidth: 60 }}>
            Intake
          </span>
          <span className="text-xs font-sans" style={{ color: 'var(--ink)' }}>
            Content submitted for examination
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-[10px] font-sans uppercase tracking-widest" style={{ color: 'var(--ink-soft)', minWidth: 60 }}>
            Retention
          </span>
          <span className="text-xs font-sans font-semibold" style={{ color: 'var(--ink)' }}>
            Analyzed and discarded. Not stored.
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-[10px] font-sans uppercase tracking-widest" style={{ color: 'var(--ink-soft)', minWidth: 60 }}>
            Account
          </span>
          <span className="text-xs font-sans" style={{ color: 'var(--ink)' }}>
            Not required
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-[10px] font-sans uppercase tracking-widest" style={{ color: 'var(--ink-soft)', minWidth: 60 }}>
            Server
          </span>
          <span className="text-xs font-sans" style={{ color: 'var(--ink)' }}>
            Rate-limited · validated · discarded
          </span>
        </div>
      </div>
    </div>
  )
}
