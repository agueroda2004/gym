import { Icon } from './Icons'

export function Fab({ onClick }: { onClick: () => void }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-30 mx-auto w-full max-w-md px-4">
      <button
        onClick={onClick}
        className="pointer-events-auto ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_4px_0_var(--color-primary-dark)] transition-all active:translate-y-[4px] active:shadow-none"
        aria-label="Agregar"
      >
        <Icon name="plus" size={24} />
      </button>
    </div>
  )
}