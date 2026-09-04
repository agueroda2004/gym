import { Chip } from '../../../components/ui/Chip'
import { Icon } from '../../../components/ui/Icons'
import type { Ejercicio } from '../types'

interface EjercicioListProps {
  ejercicios: Ejercicio[]
  onEdit: (ejercicio: Ejercicio) => void
  onDelete: (ejercicio: Ejercicio) => void
}

export function EjercicioList({ ejercicios, onEdit, onDelete }: EjercicioListProps) {
  return (
    <ul className="space-y-3">
      {ejercicios.map((ejercicio) => (
        <li
          key={ejercicio.id}
          className="flex items-center gap-3 rounded-3xl border-2 border-line bg-white p-4"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-extrabold text-ink">{ejercicio.nombre}</p>
            <div className="mt-1">
              <Chip className="pointer-events-none">{ejercicio.grupoMuscular}</Chip>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(ejercicio)}
              className="rounded-full p-2 text-muted transition-colors hover:bg-primary-light hover:text-primary"
              aria-label={`Editar ${ejercicio.nombre}`}
            >
              <Icon name="edit" size={18} />
            </button>
            <button
              onClick={() => onDelete(ejercicio)}
              className="rounded-full p-2 text-muted transition-colors hover:bg-error-light hover:text-error"
              aria-label={`Eliminar ${ejercicio.nombre}`}
            >
              <Icon name="trash" size={18} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}