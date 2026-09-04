import { useCallback, useEffect, useState } from 'react'
import { firstError, ValidationError } from '../../../lib/validators'
import { useNotification } from '../../notifications/hooks/useNotification'
import {
  createCorrida,
  deleteCorrida,
  getCorridas,
  updateCorrida,
} from '../service/Correr.service'
import type { Correr } from '../types'
import type { CorrerFormInput } from '../validators/Correr.validator'

export function useCorrer() {
  const [corridas, setCorridas] = useState<Correr[]>([])
  const [loading, setLoading] = useState(true)
  const notify = useNotification()

  const load = useCallback(async () => {
    setCorridas(await getCorridas())
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const create = useCallback(
    async (input: CorrerFormInput) => {
      try {
        const creado = await createCorrida(input)
        await load()
        notify.success('Carrera registrada')
        return creado
      } catch (e) {
        if (e instanceof ValidationError) notify.error(firstError(e.errors))
        throw e
      }
    },
    [load, notify],
  )

  const update = useCallback(
    async (id: string, input: CorrerFormInput) => {
      try {
        const actualizado = await updateCorrida(id, input)
        await load()
        notify.success('Registro actualizado')
        return actualizado
      } catch (e) {
        if (e instanceof ValidationError) notify.error(firstError(e.errors))
        throw e
      }
    },
    [load, notify],
  )

  const remove = useCallback(
    async (id: string) => {
      await deleteCorrida(id)
      await load()
      notify.info('Registro eliminado')
    },
    [load, notify],
  )

  return { corridas, loading, create, update, remove, refresh: load }
}