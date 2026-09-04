import type { IconName } from './Icons'
import { Icon } from './Icons'

interface EmptyStateProps {
  icon: IconName
  title: string
  message?: string
}

export function EmptyState({ icon, title, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-primary-light text-primary">
        <Icon name={icon} size={36} />
      </div>
      <h3 className="text-lg font-extrabold text-ink">{title}</h3>
      {message && <p className="max-w-xs text-sm font-medium text-muted">{message}</p>}
    </div>
  )
}