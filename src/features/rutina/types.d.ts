import type { DiaSemana } from '../../lib/constants'
import type { Ejercicio } from '../ejercicio/types'

export interface Rutina {
  id: string
  nombre: string
  activa: boolean
  createdAt: string
  updatedAt: string
}

export interface Entrenamiento {
  id: string
  rutinaId: string
  diaSemana: DiaSemana
}

export interface EntrenamientoEjercicio {
  id: string
  entrenamientoId: string
  ejercicioId: string
  series: number
  repeticiones: number
  peso: number
  descanso: number
}

export interface Sesion {
  id: string
  rutinaId: string
  entrenamientoId: string
  fecha: string
  estado: 'en_progreso' | 'completada'
  completadaAt?: string
}

export interface SerieRegistrada {
  id: string
  sesionId: string
  ejercicioId: string
  set: number
  repeticiones: number
  peso: number
}

export interface PlanEjercicio extends EntrenamientoEjercicio {
  ejercicio: Ejercicio
}

export interface PlanDelDia {
  entrenamiento: Entrenamiento
  ejercicios: PlanEjercicio[]
}

export interface DiaCompleto {
  entrenamiento: Entrenamiento
  ejercicios: Array<{ data: EntrenamientoEjercicio; ejercicio: Ejercicio }>
}

export interface RutinaCompleta {
  rutina: Rutina
  dias: DiaCompleto[]
}

export interface SesionHistorial {
  sesion: Sesion
  ejercicios: Array<{ ejercicio: Ejercicio; series: SerieRegistrada[] }>
}