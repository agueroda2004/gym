import { useEffect, useState } from 'react'
import { BottomSheet } from '../../../components/ui/BottomSheet'
import { Button } from '../../../components/ui/Button'
import { Dropdown, type DropdownOption } from '../../../components/ui/Dropdown'
import { Input } from '../../../components/ui/Input'
import { GRUPOS_MUSCULARES, type GrupoMuscular } from '../../../lib/constants'
import { ValidationError } from '../../../lib/validators'
import type { Ejercicio } from '../types'
import type { EjercicioInput } from '../validators/Ejercicio.validator'

const opciones: DropdownOption<GrupoMuscular>[] = GRUPOS_MUSCULARES.map((g) => ({
  label: g,
  value: g,
}))

interface EjercicioFormProps {
  open: boolean
  ejercicio?: Ejercicio | null
  onClose: () => void
  onSubmit: (input: EjercicioInput) => Promise<unknown>
}

export function EjercicioForm({ open, ejercicio, onClose, onSubmit }: EjercicioFormProps) {
  const [nombre, setNombre] = useState('')
  const [grupo, setGrupo] = useState<GrupoMuscular | ''>('')
  const [urlImagen, setUrlImagen] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setNombre(ejercicio?.nombre ?? '')
      setGrupo(ejercicio?.grupoMuscular ?? '')
      setUrlImagen(ejercicio?.urlImagen ?? '')
      setErrors({})
    }
  }, [open, ejercicio])

  const submit = async () => {
    setSaving(true)
    setErrors({})
    try {
      await onSubmit({ nombre, grupoMuscular: grupo as GrupoMuscular, urlImagen })
      onClose()
    } catch (e) {
      if (e instanceof ValidationError) setErrors(e.errors)
    } finally {
      setSaving(false)
    }
  }

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={ejercicio ? 'Editar ejercicio' : 'Nuevo ejercicio'}
    >
      <div className="space-y-4">
        <Input
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          error={errors.nombre}
          placeholder="Press banca"
          maxLength={100}
        />
        <Dropdown
          label="Grupo muscular"
          value={grupo}
          onChange={setGrupo}
          options={opciones}
          error={errors.grupoMuscular}
        />
        <Input
          label="URL de imagen de ejemplo (opcional)"
          value={urlImagen}
          onChange={(e) => setUrlImagen(e.target.value)}
          error={errors.urlImagen}
          placeholder="https://ejemplo.com/press-banca.jpg"
          inputMode="url"
          autoCapitalize="none"
        />
        {urlImagen && (
          <div className="flex items-center gap-3 rounded-2xl border-2 border-line bg-cream p-3">
            <img
              src={urlImagen}
              alt="Vista previa del ejercicio"
              className="h-16 w-16 shrink-0 rounded-xl border-2 border-line bg-white object-cover"
            />
            <span className="min-w-0 flex-1 truncate text-xs font-semibold text-muted">
              Vista previa
            </span>
            <a
              href={urlImagen}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-full border-2 border-line bg-white px-3 py-1.5 text-xs font-bold text-muted transition-colors hover:border-primary hover:text-primary"
            >
              Ver
            </a>
          </div>
        )}
        <div className="pt-2">
          <Button full type="button" onClick={() => void submit()} disabled={saving}>
            {ejercicio ? 'Guardar cambios' : 'Crear ejercicio'}
          </Button>
        </div>
      </div>
    </BottomSheet>
  )
}