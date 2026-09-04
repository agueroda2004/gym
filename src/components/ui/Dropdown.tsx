import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icons'

export interface DropdownOption<T extends string = string> {
  label: string
  value: T
}

interface DropdownProps<T extends string> {
  value: T | ''
  onChange: (value: T) => void
  options: DropdownOption<T>[]
  label?: string
  placeholder?: string
  error?: string
}

export function Dropdown<T extends string>({
  value,
  onChange,
  options,
  label,
  placeholder = 'Selecciona...',
  error,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    function onPointer(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div className="relative" ref={rootRef}>
      {label && <span className="mb-1 block text-sm font-bold text-ink">{label}</span>}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between rounded-2xl border-2 bg-white px-4 py-3 text-base font-semibold text-ink outline-none transition-colors focus:border-primary ${
          error ? 'border-error' : 'border-line'
        }`}
      >
        <span className={selected ? '' : 'font-normal text-muted/60'}>
          {selected ? selected.label : placeholder}
        </span>
        <Icon
          name="chevron-down"
          size={18}
          className={`text-muted transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute z-50 mt-1 w-full overflow-hidden rounded-2xl border-2 border-line bg-white shadow-xl animate-fade-in"
        >
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              role="option"
              aria-selected={o.value === value}
              onClick={() => {
                onChange(o.value)
                setOpen(false)
              }}
              className={`block w-full px-4 py-3 text-left text-base font-semibold transition-colors hover:bg-primary-light ${
                o.value === value ? 'bg-primary-light text-primary' : 'text-ink'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
      {error && <span className="mt-1 block text-sm font-semibold text-error">{error}</span>}
    </div>
  )
}