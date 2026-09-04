import { useMemo, useState } from 'react'
import { BottomSheet } from '../../../components/ui/BottomSheet'
import { Chip } from '../../../components/ui/Chip'
import { Icon } from '../../../components/ui/Icons'
import { Input } from '../../../components/ui/Input'
import { useEjercicio } from '../../ejercicio/hooks/useEjercicio'
import type { Ejercicio } from '../../ejercicio/types'

interface EjercicioPickerProps {
  open: boolean
  onClose: () => void
  onSelect: (ejercicio: Ejercicio) => void
}

export function EjercicioPicker({ open, onClose, onSelect }: EjercicioPickerProps) {
  const { ejercicios, loading } = useEjercicio()
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () =>
      ejercicios.filter((e) =>
        e.nombre.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [ejercicios, search],
  )

  return (
    <BottomSheet open={open} onClose={onClose} title="Seleccionar ejercicio">
      <div className="space-y-3">
        <div className="relative">
          <Icon
            name="search"
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar ejercicio..."
            className="pl-11"
            autoFocus
          />
        </div>
        {loading ? (
          <p className="py-8 text-center text-sm font-medium text-muted">Cargando...</p>
        ) : filtered.length === 0 ? (
          <p className="py-8 text-center text-sm font-medium text-muted">
            No hay ejercicios. Crea uno en el módulo Ejercicios.
          </p>
        ) : (
          <ul className="space-y-2">
            {filtered.map((ejercicio) => (
              <li key={ejercicio.id}>
                <button
                  onClick={() => onSelect(ejercicio)}
                  className="flex w-full items-center gap-3 rounded-2xl border-2 border-line bg-white p-3 text-left transition-colors hover:border-primary"
                >
                  <span className="min-w-0 flex-1 truncate text-base font-bold text-ink">
                    {ejercicio.nombre}
                  </span>
                  <Chip className="pointer-events-none">{ejercicio.grupoMuscular}</Chip>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </BottomSheet>
  )
}