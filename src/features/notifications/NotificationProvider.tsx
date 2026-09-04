import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { uid } from '../../lib/utils'
import { ToastContainer } from './components/ToastContainer'
import { NotificationContext } from './context'
import type { ToastItem, ToastType } from './types'

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timers = useRef<Map<string, number>>(new Map())

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const timer = timers.current.get(id)
    if (timer !== undefined) {
      window.clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const push = useCallback(
    (type: ToastType, message: string) => {
      const id = uid()
      setToasts((prev) => [...prev.slice(-2), { id, type, message }])
      const timer = window.setTimeout(() => dismiss(id), 3000)
      timers.current.set(id, timer)
    },
    [dismiss],
  )

  const notify = useMemo(
    () => ({
      info: (m: string) => push('info', m),
      success: (m: string) => push('success', m),
      error: (m: string) => push('error', m),
    }),
    [push],
  )

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </NotificationContext.Provider>
  )
}