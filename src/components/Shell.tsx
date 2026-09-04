import { Outlet } from 'react-router-dom'
import { BottomNav } from './ui/BottomNav'

export function Shell() {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col bg-cream">
      <div className="flex-1 pb-24">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}