import type { DiaSemana } from '../../../lib/constants'
import { DIAS_SEMANA } from '../../../lib/constants'
import { getAll, getById, getMany, put, remove } from '../../../lib/db'
import { nowISO, uid } from '../../../lib/utils'
import { getEjercicio } from '../../ejercicio/service/Ejercicio.service'
import type {
  DiaCompleto,
  Entrenamiento,
  EntrenamientoEjercicio,
  PlanDelDia,
  PlanEjercicio,
  Rutina,
  RutinaCompleta,
  SerieRegistrada,
  Sesion,
  SesionHistorial,
} from '../types'
import {
  validateCreateRutina,
  validateSerie,
  validateUpdateRutina,
  type RutinaInput,
  type SerieInput,
} from '../validators/Rutina.validator'

export async function getRutinas(): Promise<Rutina[]> {
  const list = await getAll<Rutina>('rutinas')
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function getRutina(id: string): Promise<Rutina | undefined> {
  return getById<Rutina>('rutinas', id)
}

export async function getRutinaActiva(): Promise<Rutina | undefined> {
  const todas = await getRutinas()
  return todas.find((r) => r.activa)
}

async function getEntrenamientosDeRutina(rutinaId: string): Promise<Entrenamiento[]> {
  const all = await getAll<Entrenamiento>('entrenamientos')
  return all.filter((e) => e.rutinaId === rutinaId)
}

async function getEjerciciosDeEntrenamiento(
  entrenamientoId: string,
): Promise<EntrenamientoEjercicio[]> {
  const all = await getAll<EntrenamientoEjercicio>('entrenamientoEjercicios')
  return all.filter((e) => e.entrenamientoId === entrenamientoId)
}

export async function getEntrenamiento(id: string): Promise<Entrenamiento | undefined> {
  return getById<Entrenamiento>('entrenamientos', id)
}

export async function getPlanDelDia(
  rutinaId: string,
  dia: DiaSemana,
): Promise<PlanDelDia | null> {
  const entrenamientos = await getEntrenamientosDeRutina(rutinaId)
  const entrenamiento = entrenamientos.find((e) => e.diaSemana === dia)
  if (!entrenamiento) return null
  const plan = await getEjerciciosDeEntrenamiento(entrenamiento.id)
  const ejercicios: PlanEjercicio[] = []
  for (const p of plan) {
    const ejercicio = await getEjercicio(p.ejercicioId)
    if (ejercicio) ejercicios.push({ ...p, ejercicio })
  }
  return { entrenamiento, ejercicios }
}

export async function getRutinaCompleta(id: string): Promise<RutinaCompleta | null> {
  const rutina = await getRutina(id)
  if (!rutina) return null
  const entrenamientos = (await getEntrenamientosDeRutina(id)).sort(
    (a, b) => DIAS_SEMANA.indexOf(a.diaSemana) - DIAS_SEMANA.indexOf(b.diaSemana),
  )
  const dias: DiaCompleto[] = []
  for (const entrenamiento of entrenamientos) {
    const ejercicios: DiaCompleto['ejercicios'] = []
    for (const p of await getEjerciciosDeEntrenamiento(entrenamiento.id)) {
      const ejercicio = await getEjercicio(p.ejercicioId)
      if (ejercicio) ejercicios.push({ data: p, ejercicio })
    }
    dias.push({ entrenamiento, ejercicios })
  }
  return { rutina, dias }
}

export async function createRutina(input: RutinaInput): Promise<Rutina> {
  const data = validateCreateRutina(input)
  const rutina: Rutina = {
    id: uid(),
    nombre: data.nombre,
    activa: false,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  }
  await put('rutinas', rutina)
  for (const dia of data.dias) {
    const entrenamiento: Entrenamiento = {
      id: uid(),
      rutinaId: rutina.id,
      diaSemana: dia.diaSemana,
    }
    await put('entrenamientos', entrenamiento)
    for (const ej of dia.ejercicios) {
      await put('entrenamientoEjercicios', {
        id: uid(),
        entrenamientoId: entrenamiento.id,
        ejercicioId: ej.ejercicioId,
        series: ej.series,
        repeticiones: ej.repeticiones,
        peso: ej.peso,
        descanso: ej.descanso,
      })
    }
  }
  return rutina
}

async function removeSchedule(rutinaId: string): Promise<void> {
  const entrenamientos = await getEntrenamientosDeRutina(rutinaId)
  for (const entrenamiento of entrenamientos) {
    const ejercicios = await getEjerciciosDeEntrenamiento(entrenamiento.id)
    for (const ejercicio of ejercicios) {
      await remove('entrenamientoEjercicios', ejercicio.id)
    }
    await remove('entrenamientos', entrenamiento.id)
  }
}

export async function updateRutina(id: string, input: RutinaInput): Promise<Rutina> {
  const data = validateUpdateRutina(id, input)
  const existente = await getRutina(id)
  if (!existente) throw new Error('Rutina no encontrada')
  await removeSchedule(id)
  for (const dia of data.dias) {
    const entrenamiento: Entrenamiento = {
      id: uid(),
      rutinaId: id,
      diaSemana: dia.diaSemana,
    }
    await put('entrenamientos', entrenamiento)
    for (const ej of dia.ejercicios) {
      await put('entrenamientoEjercicios', {
        id: uid(),
        entrenamientoId: entrenamiento.id,
        ejercicioId: ej.ejercicioId,
        series: ej.series,
        repeticiones: ej.repeticiones,
        peso: ej.peso,
        descanso: ej.descanso,
      })
    }
  }
  const rutina: Rutina = { ...existente, nombre: data.nombre, updatedAt: nowISO() }
  await put('rutinas', rutina)
  return rutina
}

export async function deleteRutina(id: string): Promise<void> {
  const sesiones = (await getAll<Sesion>('sesiones')).filter((s) => s.rutinaId === id)
  const sesionIds = sesiones.map((s) => s.id)
  const series = (await getAll<SerieRegistrada>('seriesRegistradas')).filter((s) =>
    sesionIds.includes(s.sesionId),
  )
  for (const s of series) await remove('seriesRegistradas', s.id)
  for (const s of sesiones) await remove('sesiones', s.id)
  await removeSchedule(id)
  await remove('rutinas', id)
}

export async function setRutinaActiva(id: string): Promise<void> {
  const todas = await getAll<Rutina>('rutinas')
  for (const rutina of todas) {
    if (rutina.activa !== (rutina.id === id)) {
      await put('rutinas', { ...rutina, activa: rutina.id === id })
    }
  }
}

export async function getSesion(id: string): Promise<Sesion | undefined> {
  return getById<Sesion>('sesiones', id)
}

export async function getSesionEnProgreso(rutinaId: string): Promise<Sesion | undefined> {
  const all = await getAll<Sesion>('sesiones')
  return all.find((s) => s.rutinaId === rutinaId && s.estado === 'en_progreso')
}

export async function crearSesion(
  rutinaId: string,
  entrenamientoId: string,
): Promise<Sesion> {
  const sesion: Sesion = {
    id: uid(),
    rutinaId,
    entrenamientoId,
    fecha: nowISO(),
    estado: 'en_progreso',
  }
  await put('sesiones', sesion)
  return sesion
}

export async function getSeriesDeSesion(sesionId: string): Promise<SerieRegistrada[]> {
  const all = await getAll<SerieRegistrada>('seriesRegistradas')
  return all.filter((s) => s.sesionId === sesionId)
}

export async function agregarSerie(
  sesionId: string,
  ejercicioId: string,
  input: SerieInput,
): Promise<SerieRegistrada> {
  const data = validateSerie(input)
  const deSesion = (await getSeriesDeSesion(sesionId)).filter(
    (s) => s.ejercicioId === ejercicioId,
  )
  const serie: SerieRegistrada = {
    id: uid(),
    sesionId,
    ejercicioId,
    set: deSesion.length + 1,
    repeticiones: data.repeticiones,
    peso: data.peso,
  }
  await put('seriesRegistradas', serie)
  return serie
}

export async function eliminarSerie(serieId: string): Promise<void> {
  await remove('seriesRegistradas', serieId)
}

export async function completarSesion(sesionId: string): Promise<void> {
  const sesion = await getSesion(sesionId)
  if (!sesion) throw new Error('Sesión no encontrada')
  await put('sesiones', { ...sesion, estado: 'completada', completadaAt: nowISO() })
}

export async function deleteSesion(sesionId: string): Promise<void> {
  const series = (await getSeriesDeSesion(sesionId))
  for (const serie of series) await remove('seriesRegistradas', serie.id)
  await remove('sesiones', sesionId)
}

export async function getUltimoRegistroEjercicio(
  ejercicioId: string,
): Promise<{ peso: number; repeticiones: number } | null> {
  const todas = await getAll<SerieRegistrada>('seriesRegistradas')
  const series = todas.filter((s) => s.ejercicioId === ejercicioId)
  if (series.length === 0) return null
  const sesionIds = [...new Set(series.map((s) => s.sesionId))]
  const sesiones = (await getMany<Sesion>('sesiones', sesionIds)).filter(
    (s) => s.estado === 'completada' && s.completadaAt,
  )
  const fechaPorSesion = new Map<string, string>()
  for (const s of sesiones) fechaPorSesion.set(s.id, s.completadaAt ?? '')
  const conFecha = series.filter((s) => fechaPorSesion.has(s.sesionId))
  if (conFecha.length === 0) return null
  conFecha.sort((a, b) =>
    (fechaPorSesion.get(b.sesionId) ?? '').localeCompare(fechaPorSesion.get(a.sesionId) ?? ''),
  )
  const sesionMasReciente = conFecha[0].sesionId
  const deEsaSesion = conFecha.filter((s) => s.sesionId === sesionMasReciente)
  const mejor = deEsaSesion.reduce((a, b) => (b.peso > a.peso ? b : a))
  return { peso: mejor.peso, repeticiones: mejor.repeticiones }
}

export async function getSesionesCompletadas(rutinaId: string): Promise<SesionHistorial[]> {
  const all = await getAll<Sesion>('sesiones')
  const completadas = all
    .filter((s) => s.rutinaId === rutinaId && s.estado === 'completada')
    .sort((a, b) => (b.completadaAt ?? '').localeCompare(a.completadaAt ?? ''))
  const todasSeries = await getAll<SerieRegistrada>('seriesRegistradas')
  const result: SesionHistorial[] = []
  for (const sesion of completadas) {
    const series = todasSeries.filter((s) => s.sesionId === sesion.id)
    const ejerciciosIds = [...new Set(series.map((s) => s.ejercicioId))]
    const ejercicios: SesionHistorial['ejercicios'] = []
    for (const id of ejerciciosIds) {
      const ejercicio = await getEjercicio(id)
      if (ejercicio) {
        ejercicios.push({ ejercicio, series: series.filter((s) => s.ejercicioId === id) })
      }
    }
    result.push({ sesion, ejercicios })
  }
  return result
}