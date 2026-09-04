import { useCallback, useEffect, useState } from 'react'
import { firstError, ValidationError } from '../../../lib/validators'
import { useNotification } from '../../notifications/hooks/useNotification'
import {
  createCiclismo,
  deleteCiclismo,
  getCiclismos,
  updateCiclismo,
} from '../service/Ciclismo.service'
import type { Ciclismo } from '../types'
import type { CiclismoFormInput } from '../validators/Ciclismo.validator'

export function useCiclismo() {
  const [ciclismos, setCiclismos] = useState<Ciclismo[]>([])
  const [loading, setLoading] = useState(true)
  const notify = useNotification()

  const load = useCallback(async () => {
    setCiclismos(await getCiclismos())
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const create = useCallback(
    async (input: CiclismoFormInput) => {
      try {
        const creado = await createCiclismo(input)
        await load()
        notify.success('Ciclismo registrado')
        return creado
      } catch (e) {
        if (e instanceof ValidationError) notify.error(firstError(e.errors))
        throw e
      }
    },
    [load, notify],
  )

  const update = useCallback(
    async (id: string, input: CiclismoFormInput) => {
      try {
        const actualizado = await updateCiclismo(id, input)
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
      await deleteCiclismo(id)
      await load()
      notify.info('Registro eliminado')
    },
    [load, notify],
  )

  return { ciclismos, loading, create, update, remove, refresh: load }
}