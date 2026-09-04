import { Icon, type IconName } from '../../../components/ui/Icons'
import { formatFechaHora, minutesToHHMM } from '../../../lib/utils'
import type { Correr } from '../types'

interface CorrerListProps {
  registros: Correr[]
  onEdit: (registro: Correr) => void
  onDelete: (registro: Correr) => void
}

function Stat({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon name={icon} size={14} className="text-primary" />
      <span className="text-xs font-bold text-ink">{value}</span>
      <span className="text-xs font-medium text-muted">{label}</span>
    </div>
  )
}

export function CorrerList({ registros, onEdit, onDelete }: CorrerListProps) {
  return (
    <ul className="space-y-3">
      {registros.map((r) => (
        <li key={r.id} className="rounded-3xl border-2 border-line bg-white p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-sm font-extrabold text-ink">
              <Icon name="correr" size={16} className="text-primary" />
              {formatFechaHora(r.fecha)}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(r)}
                className="rounded-full p-1.5 text-muted transition-colors hover:bg-primary-light hover:text-primary"
                aria-label="Editar registro"
              >
                <Icon name="edit" size={16} />
              </button>
              <button
                onClick={() => onDelete(r)}
                className="rounded-full p-1.5 text-muted transition-colors hover:bg-error-light hover:text-error"
                aria-label="Eliminar registro"
              >
                <Icon name="trash" size={16} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-2">
            <Stat icon="distancia" label="km" value={String(r.distanciaKm)} />
            <Stat icon="reloj" label="" value={minutesToHHMM(r.duracionMin)} />
            <Stat icon="pasos" label="pasos" value={r.pasos.toLocaleString('es-ES')} />
            <Stat icon="corazon" label="bpm" value={String(r.ritmoCardiaco)} />
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-muted">
            <Icon name="fuego" size={14} className="text-primary" />
            {r.calorias} kcal
          </p>
        </li>
      ))}
    </ul>
  )
}