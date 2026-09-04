import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  full?: boolean
  children: ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-white border-primary-dark shadow-[0_4px_0_var(--color-primary-dark)] active:translate-y-[4px] active:shadow-none',
  secondary:
    'bg-white text-ink border-line shadow-[0_2px_0_#d9d9d9] active:translate-y-[2px] active:shadow-none',
  success:
    'bg-success text-white border-success-dark shadow-[0_4px_0_var(--color-success-dark)] active:translate-y-[4px] active:shadow-none',
  danger:
    'bg-error text-white border-error-dark shadow-[0_4px_0_var(--color-error-dark)] active:translate-y-[4px] active:shadow-none',
  ghost: 'bg-transparent text-muted border-transparent',
}

export function Button({
  variant = 'primary',
  full,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-2xl border-2 px-5 py-3 text-base font-extrabold uppercase tracking-wide transition-all disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${full ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}