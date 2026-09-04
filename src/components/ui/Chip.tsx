import type { ReactNode } from 'react'

interface ChipProps {
  active?: boolean
  onClick?: () => void
  children: ReactNode
  className?: string
}

export function Chip({ active, onClick, children, className = '' }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border-2 px-3.5 py-1.5 text-sm font-bold transition-colors ${
        active
          ? 'border-primary bg-primary text-white'
          : 'border-line bg-white text-muted hover:border-primary/40'
      } ${className}`}
    >
      {children}
    </button>
  )
}