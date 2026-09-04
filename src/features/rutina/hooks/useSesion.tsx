import { useCallback, useEffect, useState } from 'react'
import { firstError, ValidationError } from '../../../lib/validators'
import { useNotification } from '../../notifications/hooks/useNotification'
import {
  agregarSerie,
  completarSesion,
  eliminarSerie,
  getEntrenamiento,
  getPlanDelDia,
  getRutina,
  getSeriesDeSesion,
  getSesion,
  getUltimoPesoEjercicio,
} from '../service/Rutina.service'
import type { PlanEjercicio, Rutina, SerieRegistrada, Sesion } from '../types'
import type { SerieInput } from '../validators/Rutina.validator'

export function useSesion(sesionId?: string) {
  const [sesion, setSesion] = useState<Sesion | null>(null)
  const [rutina, setRutina] = useState<Rutina | null>(null)
  const [plan, setPlan] = useState<PlanEjercicio[]>([])
  const [series, setSeries] = useState<SerieRegistrada[]>([])
  const [lastWeights, setLastWeights] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const notify = useNotification()

  const load = useCallback(async () => {
    if (!sesionId) return
    setLoading(true)
    try {
      const s = await getSesion(sesionId)
      if (!s) return
      setSesion(s)
      setRutina((await getRutina(s.rutinaId)) ?? null)
      const entrenamiento = await getEntrenamiento(s.entrenamientoId)
      const planDelDia = entrenamiento
        ? await getPlanDelDia(s.rutinaId, entrenamiento.diaSemana)
        : null
      setPlan(planDelDia?.ejercicios ?? [])
      setSeries(await getSeriesDeSesion(sesionId))
      const pesos: Record<string, number> = {}
      for (const p of planDelDia?.ejercicios ?? []) {
        pesos[p.ejercicioId] = (await getUltimoPesoEjercicio(p.ejercicioId)) ?? 0
      }
      setLastWeights(pesos)
    } finally {
      setLoading(false)
    }
  }, [sesionId])

  useEffect(() => {
    void load()
  }, [load])

  const addSerie = useCallback(
    async (ejercicioId: string, input: SerieInput) => {
      if (!sesionId) return
      try {
        const serie = await agregarSerie(sesionId, ejercicioId, input)
        setSeries((prev) => [...prev, serie])
      } catch (e) {
        if (e instanceof ValidationError) notify.error(firstError(e.errors))
        throw e
      }
    },
    [sesionId, notify],
  )

  const removeSerie = useCallback(async (serieId: string) => {
    await eliminarSerie(serieId)
    setSeries((prev) => prev.filter((s) => s.id !== serieId))
  }, [])

  const completar = useCallback(async () => {
    if (!sesionId) return
    await completarSesion(sesionId)
    notify.success('Entrenamiento finalizado')
  }, [sesionId, notify])

  return {
    sesion,
    rutina,
    plan,
    series,
    lastWeights,
    loading,
    addSerie,
    removeSerie,
    completar,
    refresh: load,
  }
}