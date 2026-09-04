import { useCallback, useEffect, useState } from 'react'
import { firstError, ValidationError } from '../../../lib/validators'
import { useNotification } from '../../notifications/hooks/useNotification'
import {
  createRutina,
  deleteRutina,
  getRutinas,
  setRutinaActiva,
  updateRutina,
} from '../service/Rutina.service'
import type { Rutina } from '../types'
import type { RutinaInput } from '../validators/Rutina.validator'

export function useRutina() {
  const [rutinas, setRutinas] = useState<Rutina[]>([])
  const [loading, setLoading] = useState(true)
  const notify = useNotification()

  const load = useCallback(async () => {
    setRutinas(await getRutinas())
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const create = useCallback(
    async (input: RutinaInput) => {
      try {
        const creada = await createRutina(input)
        await load()
        notify.success('Rutina creada')
        return creada
      } catch (e) {
        if (e instanceof ValidationError) notify.error(firstError(e.errors))
        throw e
      }
    },
    [load, notify],
  )

  const update = useCallback(
    async (id: string, input: RutinaInput) => {
      try {
        const actualizada = await updateRutina(id, input)
        await load()
        notify.success('Rutina actualizada')
        return actualizada
      } catch (e) {
        if (e instanceof ValidationError) notify.error(firstError(e.errors))
        throw e
      }
    },
    [load, notify],
  )

  const remove = useCallback(
    async (id: string) => {
      await deleteRutina(id)
      await load()
      notify.info('Rutina eliminada')
    },
    [load, notify],
  )

  const setActiva = useCallback(
    async (id: string) => {
      await setRutinaActiva(id)
      await load()
      notify.success('Rutina activa actualizada')
    },
    [load, notify],
  )

  return { rutinas, loading, create, update, remove, setActiva, refresh: load }
}