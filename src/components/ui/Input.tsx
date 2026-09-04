import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className = '', ...props },
  ref,
) {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-sm font-bold text-ink">{label}</span>}
      <input
        ref={ref}
        style={{ fontSize: '1rem' }}
        className={`w-full rounded-2xl border-2 bg-white px-4 py-3 text-base font-semibold text-ink outline-none transition-colors placeholder:font-normal placeholder:text-muted/60 focus:border-primary ${
          error ? 'border-error bg-error-light/50' : 'border-line'
        } ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-sm font-semibold text-error">{error}</span>}
    </label>
  )
})