interface MarginNote {
  id: string
  note: string
  targetId: string   // id on the paragraph span this note annotates
}

interface MarginNotesProps {
  notes: MarginNote[]
  children: React.ReactNode  // the body copy column
}

export default function MarginNotes({ notes, children }: MarginNotesProps) {
  return (
    <div className="relative flex gap-0 items-start w-full">
      {/* Left margin column */}
      <div
        className="hidden md:flex flex-col gap-0 relative flex-shrink-0"
        style={{ width: 200, paddingRight: 24 }}
        aria-hidden="true"
      >
        {notes.map((note) => (
          <div
            key={note.id}
            className="relative mb-6"
          >
            <div
              className="text-xs font-sans leading-relaxed p-2.5 rounded-sm"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                color: 'var(--ink-soft)',
              }}
            >
              {note.note}
            </div>
            {/* Leader line to the right */}
            <svg
              className="absolute top-4"
              style={{ left: '100%', marginLeft: 4 }}
              width={20}
              height={2}
              aria-hidden="true"
            >
              <line x1={0} y1={1} x2={20} y2={1} stroke="var(--line)" strokeWidth={1} strokeDasharray="3 2" />
            </svg>
          </div>
        ))}
        {/* Thin vertical rule */}
        <div
          className="absolute top-0 bottom-0 right-0"
          style={{ width: 1, background: 'var(--line)' }}
        />
      </div>

      {/* Right body column */}
      <div
        className="flex-1 min-w-0 pl-0 md:pl-8"
        style={{ maxWidth: '68ch' }}
      >
        {children}
      </div>
    </div>
  )
}
