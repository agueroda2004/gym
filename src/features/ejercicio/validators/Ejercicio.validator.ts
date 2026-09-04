import { GRUPOS_MUSCULARES, type GrupoMuscular } from '../../../lib/constants'
import {
  collect,
  ValidationError,
  validateRequiredString,
} from '../../../lib/validators'

export interface EjercicioInput {
  nombre: string
  grupoMuscular: GrupoMuscular
}

function read(obj: unknown): { nombre: unknown; grupoMuscular: unknown } {
  const o = (obj ?? {}) as Record<string, unknown>
  return { nombre: o.nombre, grupoMuscular: o.grupoMuscular }
}

export function validateCreate(obj: unknown): EjercicioInput {
  const { nombre, grupoMuscular } = read(obj)
  const errors: Record<string, string> = {}
  collect(errors, 'nombre', validateRequiredString(nombre, 'Nombre'))
  if (!GRUPOS_MUSCULARES.includes(grupoMuscular as GrupoMuscular)) {
    errors.grupoMuscular = 'Grupo muscular inválido'
  }
  if (Object.keys(errors).length > 0) throw new ValidationError(errors)
  return {
    nombre: (nombre as string).trim(),
    grupoMuscular: grupoMuscular as GrupoMuscular,
  }
}

export function validateUpdate(id: string, obj: unknown): EjercicioInput & { id: string } {
  if (!id) throw new ValidationError({ id: 'ID requerido' })
  return { id, ...validateCreate(obj) }
}