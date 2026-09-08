import { getAll, getById, put, remove } from '../../../lib/db'
import { nowISO, uid } from '../../../lib/utils'
import type { Ejercicio } from '../types'
import {
  validateCreate,
  validateUpdate,
  type EjercicioInput,
} from '../validators/Ejercicio.validator'

export async function getEjercicios(): Promise<Ejercicio[]> {
  const list = await getAll<Ejercicio>('ejercicios')
  return list.sort((a, b) => a.nombre.localeCompare(b.nombre))
}

export async function getEjercicio(id: string): Promise<Ejercicio | undefined> {
  return getById<Ejercicio>('ejercicios', id)
}

export async function createEjercicio(input: EjercicioInput): Promise<Ejercicio> {
  const data = validateCreate(input)
  const ejercicio: Ejercicio = {
    id: uid(),
    nombre: data.nombre,
    grupoMuscular: data.grupoMuscular,
    urlImagen: data.urlImagen || undefined,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  }
  await put('ejercicios', ejercicio)
  return ejercicio
}

export async function updateEjercicio(
  id: string,
  input: EjercicioInput,
): Promise<Ejercicio> {
  const data = validateUpdate(id, input)
  const existente = await getEjercicio(id)
  if (!existente) throw new Error('Ejercicio no encontrado')
  const ejercicio: Ejercicio = {
    ...existente,
    nombre: data.nombre,
    grupoMuscular: data.grupoMuscular,
    urlImagen: data.urlImagen || undefined,
    updatedAt: nowISO(),
  }
  await put('ejercicios', ejercicio)
  return ejercicio
}

export async function deleteEjercicio(id: string): Promise<void> {
  await remove('ejercicios', id)
}