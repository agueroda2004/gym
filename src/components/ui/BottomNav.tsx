import { NavLink } from 'react-router-dom'
import { Icon, type IconName } from './Icons'

const items: Array<{ to: string; label: string; icon: IconName }> = [
  { to: '/hoy', label: 'Hoy', icon: 'casa' },
  { to: '/rutinas', label: 'Rutinas', icon: 'rutina' },
  { to: '/ejercicios', label: 'Ejercicios', icon: 'musculo' },
  { to: '/deporte', label: 'Deporte', icon: 'deporte' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-line bg-white pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2.5 text-xs font-bold transition-colors ${
                isActive ? 'text-primary' : 'text-muted hover:text-ink'
              }`
            }
          >
            <Icon name={item.icon} size={22} />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}