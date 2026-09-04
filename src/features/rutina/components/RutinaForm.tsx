import { useEffect, useState } from 'react'
import { BottomSheet } from '../../../components/ui/BottomSheet'
import { Button } from '../../../components/ui/Button'
import { Chip } from '../../../components/ui/Chip'
import { Icon } from '../../../components/ui/Icons'
import { Input } from '../../../components/ui/Input'
import { DIAS_SEMANA, type DiaSemana } from '../../../lib/constants'
import { ValidationError } from '../../../lib/validators'
import type { Ejercicio } from '../../ejercicio/types'
import type { Rutina } from '../types'
import type { RutinaInput } from '../validators/Rutina.validator'
import { EjercicioPicker } from './EjercicioPicker'

export interface RutinaFormValues {
  nombre: string
  dias: Array<{
    diaSemana: DiaSemana
    ejercicios: Array<{
      ejercicioId: string
      nombre?: string
      series: string
      repeticiones: string
      peso: string
      descanso: string
    }>
  }>
}

interface RutinaFormProps {
  open: boolean
  rutina?: Rutina | null
  initial?: RutinaFormValues
  onClose: () => void
  onSubmit: (input: RutinaInput) => Promise<unknown>
}

export function RutinaForm({ open, rutina, initial, onClose, onSubmit }: RutinaFormProps) {
  const [values, setValues] = useState<RutinaFormValues>({ nombre: '', dias: [] })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [picker, setPicker] = useState<{ diaIndex: number } | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setErrors({})
    if (initial) {
      setValues({
        nombre: initial.nombre,
        dias: initial.dias.map((d) => ({
          diaSemana: d.diaSemana,
          ejercicios: d.ejercicios.map((e) => ({
            ejercicioId: e.ejercicioId,
            nombre: e.nombre,
            series: e.series,
            repeticiones: e.repeticiones,
            peso: e.peso,
            descanso: e.descanso,
          })),
        })),
      })
    } else {
      setValues({ nombre: '', dias: [] })
    }
  }, [open, initial])

  const toggleDia = (dia: DiaSemana) => {
    setValues((v) => {
      const exists = v.dias.some((d) => d.diaSemana === dia)
      return {
        ...v,
        dias: exists
          ? v.dias.filter((d) => d.diaSemana !== dia)
          : [...v.dias, { diaSemana: dia, ejercicios: [] }],
      }
    })
  }

  const updateEjercicio = (
    diaIndex: number,
    ejIndex: number,
    patch: Partial<RutinaFormValues['dias'][number]['ejercicios'][number]>,
  ) => {
    setValues((v) => ({
      ...v,
      dias: v.dias.map((d, i) =>
        i !== diaIndex
          ? d
          : {
              ...d,
              ejercicios: d.ejercicios.map((e, j) =>
                j !== ejIndex ? e : { ...e, ...patch },
              ),
            },
      ),
    }))
  }

  const removeEjercicio = (diaIndex: number, ejIndex: number) => {
    setValues((v) => ({
      ...v,
      dias: v.dias.map((d, i) =>
        i !== diaIndex
          ? d
          : { ...d, ejercicios: d.ejercicios.filter((_, j) => j !== ejIndex) },
      ),
    }))
  }

  const addEjercicio = (ejercicio: Ejercicio) => {
    if (!picker) return
    setValues((v) => ({
      ...v,
      dias: v.dias.map((d, i) =>
        i !== picker.diaIndex
          ? d
          : {
              ...d,
              ejercicios: [
                ...d.ejercicios,
                {
                  ejercicioId: ejercicio.id,
                  nombre: ejercicio.nombre,
                  series: '3',
                  repeticiones: '10',
                  peso: '',
                  descanso: '60',
                },
              ],
            },
      ),
    }))
    setPicker(null)
  }

  const submit = async () => {
    setSaving(true)
    setErrors({})
    const input: RutinaInput = {
      nombre: values.nombre,
      dias: values.dias.map((d) => ({
        diaSemana: d.diaSemana,
        ejercicios: d.ejercicios.map((e) => ({
          ejercicioId: e.ejercicioId,
          series: Number(e.series),
          repeticiones: Number(e.repeticiones),
          peso: Number(e.peso),
          descanso: Number(e.descanso),
        })),
      })),
    }
    try {
      await onSubmit(input)
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
      title={rutina ? 'Editar rutina' : 'Nueva rutina'}
    >
      <div className="space-y-5">
        <Input
          label="Nombre de la rutina"
          value={values.nombre}
          onChange={(e) => setValues((v) => ({ ...v, nombre: e.target.value }))}
          error={errors.nombre}
          placeholder="Ej. Full body"
          maxLength={100}
        />

        <div>
          <span className="mb-2 block text-sm font-bold text-ink">Días de entrenamiento</span>
          <div className="flex flex-wrap gap-2">
            {DIAS_SEMANA.map((dia) => {
              const active = values.dias.some((d) => d.diaSemana === dia)
              return (
                <Chip key={dia} active={active} onClick={() => toggleDia(dia)}>
                  {dia}
                </Chip>
              )
            })}
          </div>
          {errors.dias && (
            <span className="mt-2 block text-sm font-semibold text-error">{errors.dias}</span>
          )}
        </div>

        {values.dias.map((dia, i) => (
          <div key={dia.diaSemana} className="rounded-3xl border-2 border-line bg-cream p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-ink">{dia.diaSemana}</h3>
              <span className="text-xs font-bold text-muted">
                {dia.ejercicios.length} ejercicio{dia.ejercicios.length !== 1 ? 's' : ''}
              </span>
            </div>

            {errors[`dias[${i}].ejercicios`] && (
              <p className="mb-3 text-sm font-semibold text-error">
                {errors[`dias[${i}].ejercicios`]}
              </p>
            )}

            <ul className="space-y-3">
              {dia.ejercicios.map((ej, j) => {
                const base = `dias[${i}].ejercicios[${j}]`
                return (
                  <li key={`${ej.ejercicioId}-${j}`} className="rounded-2xl border-2 border-line bg-white p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="min-w-0 flex-1 truncate text-sm font-extrabold text-ink">
                        {ej.nombre ?? 'Ejercicio'}
                      </span>
                      <button
                        onClick={() => removeEjercicio(i, j)}
                        className="rounded-full p-1.5 text-muted transition-colors hover:bg-error-light hover:text-error"
                        aria-label="Quitar ejercicio"
                      >
                        <Icon name="trash" size={16} />
                      </button>
                    </div>
                    {errors[`${base}.ejercicioId`] && (
                      <p className="mb-2 text-xs font-semibold text-error">
                        {errors[`${base}.ejercicioId`]}
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        label="Series"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        value={ej.series}
                        onChange={(e) => updateEjercicio(i, j, { series: e.target.value })}
                        error={errors[`${base}.series`]}
                        className="py-2 text-sm"
                      />
                      <Input
                        label="Repeticiones"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        value={ej.repeticiones}
                        onChange={(e) => updateEjercicio(i, j, { repeticiones: e.target.value })}
                        error={errors[`${base}.repeticiones`]}
                        className="py-2 text-sm"
                      />
                      <Input
                        label="Peso (lbs)"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="0.5"
                        value={ej.peso}
                        onChange={(e) => updateEjercicio(i, j, { peso: e.target.value })}
                        error={errors[`${base}.peso`]}
                        className="py-2 text-sm"
                      />
                      <Input
                        label="Descanso (s)"
                        type="number"
                        inputMode="numeric"
                        min={0}
                        value={ej.descanso}
                        onChange={(e) => updateEjercicio(i, j, { descanso: e.target.value })}
                        error={errors[`${base}.descanso`]}
                        className="py-2 text-sm"
                      />
                    </div>
                  </li>
                )
              })}
            </ul>

            <Button
              variant="secondary"
              full
              className="mt-3"
              type="button"
              onClick={() => setPicker({ diaIndex: i })}
            >
              Agregar ejercicio
            </Button>
          </div>
        ))}

        {values.dias.length === 0 && (
          <p className="text-center text-sm font-medium text-muted">
            Selecciona los días que entrenarás para agregar ejercicios.
          </p>
        )}

        <div className="pt-2">
          <Button full type="button" onClick={() => void submit()} disabled={saving}>
            {rutina ? 'Guardar cambios' : 'Crear rutina'}
          </Button>
        </div>
      </div>

      <EjercicioPicker
        open={picker !== null}
        onClose={() => setPicker(null)}
        onSelect={addEjercicio}
      />
    </BottomSheet>
  )
}