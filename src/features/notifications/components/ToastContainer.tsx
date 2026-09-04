import type { IconName } from '../../../components/ui/Icons'
import { Icon } from '../../../components/ui/Icons'
import type { ToastItem, ToastType } from '../types'

const styles: Record<ToastType, { box: string; icon: IconName }> = {
  info: { box: 'bg-info', icon: 'info' },
  success: { box: 'bg-success', icon: 'check' },
  error: { box: 'bg-error', icon: 'x' },
}

interface ToastContainerProps {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex flex-col items-center gap-2 px-4 pt-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl px-4 py-3 text-white shadow-lg animate-toast-in ${styles[toast.type].box}`}
        >
          <Icon name={styles[toast.type].icon} size={18} className="shrink-0" />
          <p className="flex-1 text-sm font-bold">{toast.message}</p>
          <button onClick={() => onDismiss(toast.id)} aria-label="Cerrar">
            <Icon name="x" size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}