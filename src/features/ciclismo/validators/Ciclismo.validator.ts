import { hhmmToMinutes } from '../../../lib/utils'
import {
  collect,
  ValidationError,
  validateHHMM,
  validateNumber,
} from '../../../lib/validators'

export interface CiclismoFormInput {
  duracion: string
  distanciaKm: number
  calorias: number
  velocidadKmh: number
  ritmoCardiaco: number
}

export interface CiclismoInput {
  duracionMin: number
  distanciaKm: number
  calorias: number
  velocidadKmh: number
  ritmoCardiaco: number
}

export function validateCreate(obj: unknown): CiclismoInput {
  const o = (obj ?? {}) as Record<string, unknown>
  const errors: Record<string, string> = {}
  collect(errors, 'duracion', validateHHMM(o.duracion, 'Duración'))
  collect(errors, 'distanciaKm', validateNumber(o.distanciaKm, 'Distancia', { max: 100 }))
  collect(errors, 'calorias', validateNumber(o.calorias, 'Calorías', { max: 5000, integer: true }))
  collect(errors, 'velocidadKmh', validateNumber(o.velocidadKmh, 'Velocidad', { max: 100 }))
  collect(errors, 'ritmoCardiaco', validateNumber(o.ritmoCardiaco, 'Ritmo cardíaco', { min: 30, max: 250, integer: true }))
  if (Object.keys(errors).length > 0) throw new ValidationError(errors)
  return {
    duracionMin: hhmmToMinutes(o.duracion as string),
    distanciaKm: Number(o.distanciaKm),
    calorias: Number(o.calorias),
    velocidadKmh: Number(o.velocidadKmh),
    ritmoCardiaco: Number(o.ritmoCardiaco),
  }
}

export function validateUpdate(id: string, obj: unknown): CiclismoInput & { id: string } {
  if (!id) throw new ValidationError({ id: 'ID requerido' })
  return { id, ...validateCreate(obj) }
}