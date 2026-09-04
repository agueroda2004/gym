import { getAll, getById, put, remove } from '../../../lib/db'
import { nowISO, uid } from '../../../lib/utils'
import type { Ciclismo } from '../types'
import {
  validateCreate,
  validateUpdate,
  type CiclismoFormInput,
} from '../validators/Ciclismo.validator'

export async function getCiclismos(): Promise<Ciclismo[]> {
  const list = await getAll<Ciclismo>('ciclismos')
  return list.sort((a, b) => b.fecha.localeCompare(a.fecha))
}

export async function getCiclismo(id: string): Promise<Ciclismo | undefined> {
  return getById<Ciclismo>('ciclismos', id)
}

export async function createCiclismo(input: CiclismoFormInput): Promise<Ciclismo> {
  const data = validateCreate(input)
  const item: Ciclismo = { id: uid(), ...data, fecha: nowISO() }
  await put('ciclismos', item)
  return item
}

export async function updateCiclismo(
  id: string,
  input: CiclismoFormInput,
): Promise<Ciclismo> {
  const data = validateUpdate(id, input)
  const existente = await getCiclismo(id)
  if (!existente) throw new Error('Registro no encontrado')
  const item: Ciclismo = { ...existente, ...data }
  await put('ciclismos', item)
  return item
}

export async function deleteCiclismo(id: string): Promise<void> {
  await remove('ciclismos', id)
}