export class ValidationError extends Error {
  errors: Record<string, string>

  constructor(errors: Record<string, string>) {
    super('Error de validación')
    this.name = 'ValidationError'
    this.errors = errors
  }
}

export function firstError(errors: Record<string, string>): string {
  return Object.values(errors)[0] ?? 'Error de validación'
}

export function collect(
  errors: Record<string, string>,
  field: string,
  error: string | null,
): void {
  if (error) errors[field] = error
}

export function validateRequiredString(value: unknown, label: string): string | null {
  const v = typeof value === 'string' ? value.trim() : ''
  if (!v) return `${label} es requerido`
  if (v.length > 100) return `${label} no puede tener más de 100 caracteres`
  return null
}

export interface NumberOptions {
  min?: number
  max?: number
  required?: boolean
  integer?: boolean
}

export function validateNumber(
  value: unknown,
  label: string,
  opts: NumberOptions = {},
): string | null {
  const { min = 0, max = Number.POSITIVE_INFINITY, required = true, integer = false } = opts
  const isBlank = value === null || value === undefined || value === ''
  if (isBlank) return required ? `${label} es requerido` : null
  const num = Number(value)
  if (Number.isNaN(num)) return `${label} debe ser un número`
  if (integer && !Number.isInteger(num)) return `${label} debe ser un número entero`
  if (num < min) return `${label} no puede ser menor que ${min}`
  if (num > max) return `${label} no puede superar ${max}`
  return null
}

export function validateHHMM(value: unknown, label: string): string | null {
  const v = typeof value === 'string' ? value.trim() : ''
  if (!v) return `${label} es requerido`
  if (!/^\d{1,2}:\d{2}$/.test(v)) return `${label} debe tener formato HH:MM`
  const m = Number(v.split(':')[1])
  if (m > 59) return `${label} debe tener minutos válidos`
  return null
}