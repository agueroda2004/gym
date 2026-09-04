import { useEffect, useState } from 'react'
import { BottomSheet } from '../../../components/ui/BottomSheet'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { ValidationError } from '../../../lib/validators'
import { minutesToHHMM } from '../../../lib/utils'
import type { Ciclismo } from '../types'
import type { CiclismoFormInput } from '../validators/Ciclismo.validator'

interface CiclismoFormProps {
  open: boolean
  registro?: Ciclismo | null
  onClose: () => void
  onSubmit: (input: CiclismoFormInput) => Promise<unknown>
}

export function CiclismoForm({ open, registro, onClose, onSubmit }: CiclismoFormProps) {
  const [duracion, setDuracion] = useState('')
  const [distanciaKm, setDistanciaKm] = useState('')
  const [calorias, setCalorias] = useState('')
  const [velocidadKmh, setVelocidadKmh] = useState('')
  const [ritmoCardiaco, setRitmoCardiaco] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setDuracion(registro ? minutesToHHMM(registro.duracionMin) : '')
      setDistanciaKm(registro ? String(registro.distanciaKm) : '')
      setCalorias(registro ? String(registro.calorias) : '')
      setVelocidadKmh(registro ? String(registro.velocidadKmh) : '')
      setRitmoCardiaco(registro ? String(registro.ritmoCardiaco) : '')
      setErrors({})
    }
  }, [open, registro])

  const submit = async () => {
    setSaving(true)
    setErrors({})
    try {
      await onSubmit({
        duracion,
        distanciaKm: Number(distanciaKm),
        calorias: Number(calorias),
        velocidadKmh: Number(velocidadKmh),
        ritmoCardiaco: Number(ritmoCardiaco),
      })
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
      title={registro ? 'Editar ciclismo' : 'Registrar ciclismo'}
    >
      <div className="space-y-4">
        <Input
          label="Duración (HH:MM)"
          value={duracion}
          onChange={(e) => setDuracion(e.target.value)}
          error={errors.duracion}
          placeholder="01:00"
          inputMode="numeric"
        />
        <Input
          label="Distancia (km)"
          type="number"
          inputMode="decimal"
          min={0}
          step="0.1"
          value={distanciaKm}
          onChange={(e) => setDistanciaKm(e.target.value)}
          error={errors.distanciaKm}
          placeholder="20"
        />
        <Input
          label="Calorías"
          type="number"
          inputMode="numeric"
          min={0}
          value={calorias}
          onChange={(e) => setCalorias(e.target.value)}
          error={errors.calorias}
          placeholder="450"
        />
        <Input
          label="Velocidad promedio (km/h)"
          type="number"
          inputMode="decimal"
          min={0}
          step="0.1"
          value={velocidadKmh}
          onChange={(e) => setVelocidadKmh(e.target.value)}
          error={errors.velocidadKmh}
          placeholder="25"
        />
        <Input
          label="Ritmo cardíaco promedio"
          type="number"
          inputMode="numeric"
          min={30}
          max={250}
          value={ritmoCardiaco}
          onChange={(e) => setRitmoCardiaco(e.target.value)}
          error={errors.ritmoCardiaco}
          placeholder="140"
        />
        <div className="pt-2">
          <Button full type="button" onClick={() => void submit()} disabled={saving}>
            {registro ? 'Guardar cambios' : 'Registrar'}
          </Button>
        </div>
      </div>
    </BottomSheet>
  )
}