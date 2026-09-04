import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from './Icons'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-ink/50 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-md overflow-hidden rounded-t-3xl bg-white shadow-2xl animate-sheet-up">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-extrabold text-ink">{title ?? ''}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted transition-colors hover:bg-cream"
            aria-label="Cerrar"
          >
            <Icon name="x" size={20} />
          </button>
        </div>
        <div className="max-h-[75svh] overflow-y-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}