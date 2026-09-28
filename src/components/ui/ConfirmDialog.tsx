import { useEffect, useRef } from 'react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(27, 32, 39, 0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div
        ref={dialogRef}
        className="rounded-sm max-w-sm w-full p-6"
        style={{ background: 'var(--surface)', border: '1px solid var(--line)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
      >
        <h3
          id="confirm-title"
          className="font-instrument font-semibold text-lg m-0 mb-3"
          style={{ color: 'var(--ink)' }}
        >
          {title}
        </h3>
        <p
          className="font-serif-display text-[15px] leading-relaxed m-0 mb-6"
          style={{ color: 'var(--ink-soft)' }}
        >
          {message}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-sm text-sm font-sans font-semibold cursor-pointer transition-colors"
            style={{ background: 'var(--paper)', color: 'var(--ink-soft)', border: '1px solid var(--line)' }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-sm text-sm font-sans font-semibold cursor-pointer transition-colors"
            style={{ background: 'var(--ink)', color: 'var(--paper)', border: '1px solid var(--ink)' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
