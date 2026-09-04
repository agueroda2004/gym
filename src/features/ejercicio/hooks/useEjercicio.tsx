import { useCallback, useEffect, useState } from 'react'
import { firstError, ValidationError } from '../../../lib/validators'
import { useNotification } from '../../notifications/hooks/useNotification'
import {
  createEjercicio,
  deleteEjercicio,
  getEjercicios,
  updateEjercicio,
} from '../service/Ejercicio.service'
import type { Ejercicio } from '../types'
import type { EjercicioInput } from '../validators/Ejercicio.validator'

export function useEjercicio() {
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([])
  const [loading, setLoading] = useState(true)
  const notify = useNotification()

  const load = useCallback(async () => {
    setEjercicios(await getEjercicios())
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const create = useCallback(
    async (input: EjercicioInput) => {
      try {
        const creado = await createEjercicio(input)
        await load()
        notify.success('Ejercicio creado')
        return creado
      } catch (e) {
        if (e instanceof ValidationError) notify.error(firstError(e.errors))
        throw e
      }
    },
    [load, notify],
  )

  const update = useCallback(
    async (id: string, input: EjercicioInput) => {
      try {
        const actualizado = await updateEjercicio(id, input)
        await load()
        notify.success('Ejercicio actualizado')
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
      await deleteEjercicio(id)
      await load()
      notify.info('Ejercicio eliminado')
    },
    [load, notify],
  )

  return { ejercicios, loading, create, update, remove, refresh: load }
}