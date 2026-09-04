import { useEffect, useState } from 'react'
import { BottomSheet } from '../../../components/ui/BottomSheet'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { ValidationError } from '../../../lib/validators'
import { minutesToHHMM } from '../../../lib/utils'
import type { Correr } from '../types'
import type { CorrerFormInput } from '../validators/Correr.validator'

interface CorrerFormProps {
  open: boolean
  registro?: Correr | null
  onClose: () => void
  onSubmit: (input: CorrerFormInput) => Promise<unknown>
}

export function CorrerForm({ open, registro, onClose, onSubmit }: CorrerFormProps) {
  const [distanciaKm, setDistanciaKm] = useState('')
  const [duracion, setDuracion] = useState('')
  const [calorias, setCalorias] = useState('')
  const [pasos, setPasos] = useState('')
  const [ritmoCardiaco, setRitmoCardiaco] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setDistanciaKm(registro ? String(registro.distanciaKm) : '')
      setDuracion(registro ? minutesToHHMM(registro.duracionMin) : '')
      setCalorias(registro ? String(registro.calorias) : '')
      setPasos(registro ? String(registro.pasos) : '')
      setRitmoCardiaco(registro ? String(registro.ritmoCardiaco) : '')
      setErrors({})
    }
  }, [open, registro])

  const submit = async () => {
    setSaving(true)
    setErrors({})
    try {
      await onSubmit({
        distanciaKm: Number(distanciaKm),
        duracion,
        calorias: Number(calorias),
        pasos: Number(pasos),
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
      title={registro ? 'Editar carrera' : 'Registrar carrera'}
    >
      <div className="space-y-4">
        <Input
          label="Distancia (km)"
          type="number"
          inputMode="decimal"
          min={0}
          step="0.1"
          value={distanciaKm}
          onChange={(e) => setDistanciaKm(e.target.value)}
          error={errors.distanciaKm}
          placeholder="5"
        />
        <Input
          label="Duración (HH:MM)"
          value={duracion}
          onChange={(e) => setDuracion(e.target.value)}
          error={errors.duracion}
          placeholder="00:45"
          inputMode="numeric"
        />
        <Input
          label="Calorías"
          type="number"
          inputMode="numeric"
          min={0}
          value={calorias}
          onChange={(e) => setCalorias(e.target.value)}
          error={errors.calorias}
          placeholder="350"
        />
        <Input
          label="Pasos"
          type="number"
          inputMode="numeric"
          min={0}
          value={pasos}
          onChange={(e) => setPasos(e.target.value)}
          error={errors.pasos}
          placeholder="6000"
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
          placeholder="145"
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