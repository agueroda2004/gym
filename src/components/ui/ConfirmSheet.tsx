import { BottomSheet } from './BottomSheet'
import { Button } from './Button'

interface ConfirmSheetProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  danger?: boolean
  loading?: boolean
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmSheet({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  danger,
  loading,
  onConfirm,
  onClose,
}: ConfirmSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose} title={title}>
      <div className="space-y-5">
        <p className="text-base font-medium text-muted">{message}</p>
        <div className="flex gap-3">
          <Button variant="secondary" full onClick={onClose}>
            Cancelar
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} full onClick={onConfirm} disabled={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </BottomSheet>
  )
}