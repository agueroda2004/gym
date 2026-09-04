export function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function nowISO(): string {
  return new Date().toISOString()
}

export function hhmmToMinutes(value: string): number {
  const [h, m] = value.split(':').map(Number)
  return h * 60 + m
}

export function minutesToHHMM(total: number): string {
  const m = Math.max(0, Math.round(total))
  const h = Math.floor(m / 60)
  const mm = m % 60
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

export function diaDeHoy(): string {
  const name = new Date().toLocaleDateString('es-ES', { weekday: 'long' })
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export function formatFecha(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatFechaHora(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}