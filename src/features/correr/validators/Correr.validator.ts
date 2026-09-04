import { hhmmToMinutes } from '../../../lib/utils'
import {
  collect,
  ValidationError,
  validateHHMM,
  validateNumber,
} from '../../../lib/validators'

export interface CorrerFormInput {
  distanciaKm: number
  duracion: string
  calorias: number
  pasos: number
  ritmoCardiaco: number
}

export interface CorrerInput {
  distanciaKm: number
  duracionMin: number
  calorias: number
  pasos: number
  ritmoCardiaco: number
}

export function validateCreate(obj: unknown): CorrerInput {
  const o = (obj ?? {}) as Record<string, unknown>
  const errors: Record<string, string> = {}
  collect(errors, 'distanciaKm', validateNumber(o.distanciaKm, 'Distancia', { max: 100 }))
  collect(errors, 'duracion', validateHHMM(o.duracion, 'Duración'))
  collect(errors, 'calorias', validateNumber(o.calorias, 'Calorías', { max: 5000, integer: true }))
  collect(errors, 'pasos', validateNumber(o.pasos, 'Pasos', { max: 100000, integer: true }))
  collect(errors, 'ritmoCardiaco', validateNumber(o.ritmoCardiaco, 'Ritmo cardíaco', { min: 30, max: 250, integer: true }))
  if (Object.keys(errors).length > 0) throw new ValidationError(errors)
  return {
    distanciaKm: Number(o.distanciaKm),
    duracionMin: hhmmToMinutes(o.duracion as string),
    calorias: Number(o.calorias),
    pasos: Number(o.pasos),
    ritmoCardiaco: Number(o.ritmoCardiaco),
  }
}

export function validateUpdate(id: string, obj: unknown): CorrerInput & { id: string } {
  if (!id) throw new ValidationError({ id: 'ID requerido' })
  return { id, ...validateCreate(obj) }
}