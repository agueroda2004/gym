import { getDB, STORE_NAMES, type AnyValue, type StoreName } from './db'

export const BACKUP_APP = 'gym'
export const BACKUP_VERSION = 1

export interface BackupData {
  version: number
  app: string
  exportedAt: string
  data: Record<StoreName, AnyValue[]>
}

export async function exportarDatos(): Promise<string> {
  const db = await getDB()
  const data = {} as Record<StoreName, AnyValue[]>
  for (const store of STORE_NAMES) {
    data[store] = await db.getAll(store)
  }
  const backup: BackupData = {
    version: BACKUP_VERSION,
    app: BACKUP_APP,
    exportedAt: new Date().toISOString(),
    data,
  }
  return JSON.stringify(backup, null, 2)
}

export function parseBackup(json: string): BackupData {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    throw new Error('El archivo no es un JSON válido')
  }
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('El archivo no es un respaldo válido')
  }
  const backup = parsed as Partial<BackupData>
  if (backup.app !== BACKUP_APP) {
    throw new Error('El archivo no es un respaldo de esta app')
  }
  if (!backup.data || typeof backup.data !== 'object') {
    throw new Error('El respaldo no contiene datos')
  }
  const data = backup.data as Record<string, unknown>
  for (const store of STORE_NAMES) {
    const records = data[store]
    if (!Array.isArray(records)) {
      throw new Error(`El respaldo no tiene la sección "${store}"`)
    }
    for (const item of records) {
      if (
        !item ||
        typeof item !== 'object' ||
        typeof (item as { id?: unknown }).id !== 'string'
      ) {
        throw new Error(`Hay un registro inválido en "${store}"`)
      }
    }
  }
  return {
    version: backup.version ?? BACKUP_VERSION,
    app: backup.app,
    exportedAt: backup.exportedAt ?? '',
    data: data as Record<StoreName, AnyValue[]>,
  }
}

export async function importarDatos(backup: BackupData): Promise<void> {
  const db = await getDB()
  const stores = [...STORE_NAMES]
  const tx = db.transaction(stores, 'readwrite')
  for (const store of stores) {
    await tx.objectStore(store).clear()
  }
  for (const store of stores) {
    for (const record of backup.data[store]) {
      await tx.objectStore(store).put(record)
    }
  }
  await tx.done
}