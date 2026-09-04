import type { ReactNode } from 'react'
import { Icon } from './Icons'

interface HeaderProps {
  title: string
  subtitle?: string
  back?: boolean
  onBack?: () => void
  action?: ReactNode
}

export function Header({ title, subtitle, back, onBack, action }: HeaderProps) {
  return (
    <header className="mb-5 flex items-center gap-3">
      {back && (
        <button
          onClick={onBack}
          className="rounded-full border-2 border-line bg-white p-2 text-ink transition-colors hover:border-primary"
          aria-label="Volver"
        >
          <Icon name="arrow-left" size={18} />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-2xl font-extrabold text-ink">{title}</h1>
        {subtitle && <p className="text-sm font-medium text-muted">{subtitle}</p>}
      </div>
      {action}
    </header>
  )
}