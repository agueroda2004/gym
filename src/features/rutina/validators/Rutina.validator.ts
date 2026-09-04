import type { DiaSemana } from '../../../lib/constants'
import { DIAS_SEMANA } from '../../../lib/constants'
import {
  collect,
  ValidationError,
  validateNumber,
  validateRequiredString,
} from '../../../lib/validators'

export interface EjercicioPlanInput {
  ejercicioId: string
  series: number
  repeticiones: number
  peso: number
  descanso: number
}

export interface DiaPlanInput {
  diaSemana: DiaSemana
  ejercicios: EjercicioPlanInput[]
}

export interface RutinaInput {
  nombre: string
  dias: DiaPlanInput[]
}

export interface SerieInput {
  repeticiones: number
  peso: number
}

function readArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : []
}

export function validateCreateRutina(obj: unknown): RutinaInput {
  const o = (obj ?? {}) as Record<string, unknown>
  const errors: Record<string, string> = {}
  collect(errors, 'nombre', validateRequiredString(o.nombre, 'Nombre'))

  const diasRaw = readArray(o.dias)
  if (diasRaw.length === 0) {
    errors.dias = 'Debes seleccionar al menos un día de entrenamiento'
  }

  const dias: DiaPlanInput[] = diasRaw.map((d, i) => {
    const dia = d.diaSemana as DiaSemana
    if (!DIAS_SEMANA.includes(dia)) {
      errors[`dias[${i}].diaSemana`] = 'Día inválido'
    }
    const ejerciciosRaw = readArray(d.ejercicios)
    if (ejerciciosRaw.length === 0) {
      errors[`dias[${i}].ejercicios`] = 'Agrega al menos un ejercicio'
    }
    const ejercicios: EjercicioPlanInput[] = ejerciciosRaw.map((e, j) => {
      const base = `dias[${i}].ejercicios[${j}]`
      const ejercicioId = typeof e.ejercicioId === 'string' ? e.ejercicioId.trim() : ''
      if (!ejercicioId) errors[`${base}.ejercicioId`] = 'Selecciona un ejercicio'
      collect(errors, `${base}.series`, validateNumber(e.series, 'Series', { min: 1, max: 50, integer: true }))
      collect(errors, `${base}.repeticiones`, validateNumber(e.repeticiones, 'Repeticiones', { min: 1, max: 500, integer: true }))
      collect(errors, `${base}.peso`, validateNumber(e.peso, 'Peso', { max: 1000 }))
      collect(errors, `${base}.descanso`, validateNumber(e.descanso, 'Descanso', { max: 600, integer: true }))
      return {
        ejercicioId,
        series: Number(e.series),
        repeticiones: Number(e.repeticiones),
        peso: Number(e.peso),
        descanso: Number(e.descanso),
      }
    })
    return { diaSemana: dia, ejercicios }
  })

  if (Object.keys(errors).length > 0) throw new ValidationError(errors)
  return { nombre: (o.nombre as string).trim(), dias }
}

export function validateUpdateRutina(id: string, obj: unknown): RutinaInput & { id: string } {
  if (!id) throw new ValidationError({ id: 'ID requerido' })
  return { id, ...validateCreateRutina(obj) }
}

export function validateSerie(obj: unknown): SerieInput {
  const o = (obj ?? {}) as Record<string, unknown>
  const errors: Record<string, string> = {}
  collect(errors, 'repeticiones', validateNumber(o.repeticiones, 'Repeticiones', { min: 1, max: 500, integer: true }))
  collect(errors, 'peso', validateNumber(o.peso, 'Peso', { max: 1000 }))
  if (Object.keys(errors).length > 0) throw new ValidationError(errors)
  return {
    repeticiones: Number(o.repeticiones),
    peso: Number(o.peso),
  }
}