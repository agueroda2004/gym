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
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setNombre(ejercicio?.nombre ?? '')
      setGrupo(ejercicio?.grupoMuscular ?? '')
      setErrors({})
    }
  }, [open, ejercicio])

  const submit = async () => {
    setSaving(true)
    setErrors({})
    try {
      await onSubmit({ nombre, grupoMuscular: grupo as GrupoMuscular })
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
        <div className="pt-2">
          <Button full type="button" onClick={() => void submit()} disabled={saving}>
            {ejercicio ? 'Guardar cambios' : 'Crear ejercicio'}
          </Button>
        </div>
      </div>
    </BottomSheet>
  )
}