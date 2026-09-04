import { useContext } from 'react'
import { NotificationContext, type Notify } from '../context'

export function useNotification(): Notify {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotification debe usarse dentro de NotificationProvider')
  return ctx
}