import type { GrupoMuscular } from '../../../lib/constants'
import { GRUPOS_MUSCULARES } from '../../../lib/constants'
import { Chip } from '../../../components/ui/Chip'
import { Icon } from '../../../components/ui/Icons'
import { Input } from '../../../components/ui/Input'

interface EjercicioFiltersProps {
  search: string
  onSearch: (value: string) => void
  grupo: GrupoMuscular | ''
  onGrupo: (value: GrupoMuscular | '') => void
}

export function EjercicioFilters({
  search,
  onSearch,
  grupo,
  onGrupo,
}: EjercicioFiltersProps) {
  return (
    <div className="mb-4 space-y-3">
      <div className="relative">
        <Icon
          name="search"
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
        />
        <Input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Buscar por nombre..."
          className="pl-11"
          aria-label="Buscar ejercicio"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <Chip active={grupo === ''} onClick={() => onGrupo('')}>
          Todos
        </Chip>
        {GRUPOS_MUSCULARES.map((g) => (
          <Chip key={g} active={grupo === g} onClick={() => onGrupo(g)}>
            {g}
          </Chip>
        ))}
      </div>
    </div>
  )
}