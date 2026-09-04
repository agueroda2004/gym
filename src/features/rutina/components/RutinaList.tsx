import { useNavigate } from 'react-router-dom'
import { Chip } from '../../../components/ui/Chip'
import { Icon } from '../../../components/ui/Icons'
import type { Rutina } from '../types'

interface RutinaListProps {
  rutinas: Rutina[]
  onSetActiva: (rutina: Rutina) => void
  onDelete: (rutina: Rutina) => void
}

export function RutinaList({ rutinas, onSetActiva, onDelete }: RutinaListProps) {
  const navigate = useNavigate()

  return (
    <ul className="space-y-3">
      {rutinas.map((rutina) => (
        <li
          key={rutina.id}
          className="rounded-3xl border-2 border-line bg-white p-4 transition-colors"
        >
          <button
            onClick={() => navigate(`/rutinas/${rutina.id}`)}
            className="flex w-full items-center gap-3 text-left"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-extrabold text-ink">{rutina.nombre}</p>
              <p className="mt-0.5 text-sm font-medium text-muted">
                Ver plan e historial →
              </p>
            </div>
            {rutina.activa && <Chip className="pointer-events-none">Activa</Chip>}
          </button>
          <div className="mt-3 flex items-center justify-end gap-1 border-t border-line pt-3">
            <button
              onClick={() => onSetActiva(rutina)}
              className={`flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-xs font-bold transition-colors ${
                rutina.activa
                  ? 'border-success bg-success text-white'
                  : 'border-line bg-white text-muted hover:border-success'
              }`}
            >
              <Icon name={rutina.activa ? 'check' : 'rutina'} size={14} />
              {rutina.activa ? 'Activa' : 'Marcar activa'}
            </button>
            <button
              onClick={() => navigate(`/rutinas/${rutina.id}`)}
              className="rounded-full p-2 text-muted transition-colors hover:bg-primary-light hover:text-primary"
              aria-label={`Editar ${rutina.nombre}`}
            >
              <Icon name="edit" size={18} />
            </button>
            <button
              onClick={() => onDelete(rutina)}
              className="rounded-full p-2 text-muted transition-colors hover:bg-error-light hover:text-error"
              aria-label={`Eliminar ${rutina.nombre}`}
            >
              <Icon name="trash" size={18} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}