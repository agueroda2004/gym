import { GRUPOS_MUSCULARES, type GrupoMuscular } from '../../../lib/constants'
import {
  collect,
  ValidationError,
  validateRequiredString,
} from '../../../lib/validators'

export interface EjercicioInput {
  nombre: string
  grupoMuscular: GrupoMuscular
  urlImagen: string
}

function read(obj: unknown): { nombre: unknown; grupoMuscular: unknown; urlImagen: unknown } {
  const o = (obj ?? {}) as Record<string, unknown>
  return { nombre: o.nombre, grupoMuscular: o.grupoMuscular, urlImagen: o.urlImagen }
}

function isUrl(value: string): boolean {
  if (!value) return true
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function validateCreate(obj: unknown): EjercicioInput {
  const { nombre, grupoMuscular, urlImagen } = read(obj)
  const errors: Record<string, string> = {}
  collect(errors, 'nombre', validateRequiredString(nombre, 'Nombre'))
  if (!GRUPOS_MUSCULARES.includes(grupoMuscular as GrupoMuscular)) {
    errors.grupoMuscular = 'Grupo muscular inválido'
  }
  const imagen = typeof urlImagen === 'string' ? urlImagen.trim() : ''
  if (imagen.length > 1000) {
    errors.urlImagen = 'La URL no puede superar 1000 caracteres'
  } else if (!isUrl(imagen)) {
    errors.urlImagen = 'Ingresa una URL válida (http/https)'
  }
  if (Object.keys(errors).length > 0) throw new ValidationError(errors)
  return {
    nombre: (nombre as string).trim(),
    grupoMuscular: grupoMuscular as GrupoMuscular,
    urlImagen: imagen,
  }
}

export function validateUpdate(id: string, obj: unknown): EjercicioInput & { id: string } {
  if (!id) throw new ValidationError({ id: 'ID requerido' })
  return { id, ...validateCreate(obj) }
}