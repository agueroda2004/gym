import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

const DB_NAME = 'gym-db'
const DB_VERSION = 1

export type AnyValue = { id: string; [key: string]: unknown }

interface GymDB extends DBSchema {
  ejercicios: { key: string; value: AnyValue }
  rutinas: { key: string; value: AnyValue }
  entrenamientos: { key: string; value: AnyValue }
  entrenamientoEjercicios: { key: string; value: AnyValue }
  sesiones: { key: string; value: AnyValue }
  seriesRegistradas: { key: string; value: AnyValue }
  ciclismos: { key: string; value: AnyValue }
  correr: { key: string; value: AnyValue }
}

export const STORE_NAMES = [
  'ejercicios',
  'rutinas',
  'entrenamientos',
  'entrenamientoEjercicios',
  'sesiones',
  'seriesRegistradas',
  'ciclismos',
  'correr',
] as const

export type StoreName = (typeof STORE_NAMES)[number]

let dbPromise: Promise<IDBPDatabase<GymDB>> | null = null

function getDB(): Promise<IDBPDatabase<GymDB>> {
  if (!dbPromise) {
    dbPromise = openDB<GymDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        for (const name of STORE_NAMES) {
          if (!db.objectStoreNames.contains(name)) {
            db.createObjectStore(name, { keyPath: 'id' })
          }
        }
      },
    })
  }
  return dbPromise
}

export async function getAll<T>(store: StoreName): Promise<T[]> {
  const db = await getDB()
  const values = await db.getAll(store)
  return values as unknown as T[]
}

export async function getById<T>(store: StoreName, id: string): Promise<T | undefined> {
  const db = await getDB()
  return (await db.get(store, id)) as T | undefined
}

export async function getMany<T>(store: StoreName, ids: string[]): Promise<T[]> {
  if (ids.length === 0) return []
  const db = await getDB()
  const rows = await Promise.all(ids.map((id) => db.get(store, id)))
  return rows.filter((r) => r !== undefined) as T[]
}

export async function put<T extends { id: string }>(store: StoreName, value: T): Promise<void> {
  const db = await getDB()
  await db.put(store, value as unknown as AnyValue)
}

export async function remove(store: StoreName, id: string): Promise<void> {
  const db = await getDB()
  await db.delete(store, id)
}

export async function clearStore(store: StoreName): Promise<void> {
  const db = await getDB()
  await db.clear(store)
}