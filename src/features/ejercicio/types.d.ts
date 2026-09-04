import type { GrupoMuscular } from '../../lib/constants'

export interface Ejercicio {
  id: string
  nombre: string
  grupoMuscular: GrupoMuscular
  createdAt: string
  updatedAt: string
}