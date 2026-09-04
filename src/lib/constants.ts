export const GRUPOS_MUSCULARES = ['Pecho', 'Espalda', 'Piernas', 'Brazo'] as const
export type GrupoMuscular = (typeof GRUPOS_MUSCULARES)[number]

export const DIAS_SEMANA = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
] as const
export type DiaSemana = (typeof DIAS_SEMANA)[number]