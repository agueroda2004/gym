import { getAll, getById, put, remove } from '../../../lib/db'
import { nowISO, uid } from '../../../lib/utils'
import type { Correr } from '../types'
import {
  validateCreate,
  validateUpdate,
  type CorrerFormInput,
} from '../validators/Correr.validator'

export async function getCorridas(): Promise<Correr[]> {
  const list = await getAll<Correr>('correr')
  return list.sort((a, b) => b.fecha.localeCompare(a.fecha))
}

export async function getCorrida(id: string): Promise<Correr | undefined> {
  return getById<Correr>('correr', id)
}

export async function createCorrida(input: CorrerFormInput): Promise<Correr> {
  const data = validateCreate(input)
  const item: Correr = { id: uid(), ...data, fecha: nowISO() }
  await put('correr', item)
  return item
}

export async function updateCorrida(id: string, input: CorrerFormInput): Promise<Correr> {
  const data = validateUpdate(id, input)
  const existente = await getCorrida(id)
  if (!existente) throw new Error('Registro no encontrado')
  const item: Correr = { ...existente, ...data }
  await put('correr', item)
  return item
}

export async function deleteCorrida(id: string): Promise<void> {
  await remove('correr', id)
}