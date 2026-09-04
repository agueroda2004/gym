import { createContext } from 'react'

export interface Notify {
  info: (message: string) => void
  success: (message: string) => void
  error: (message: string) => void
}

export const NotificationContext = createContext<Notify | null>(null)