export type ToastType = 'info' | 'success' | 'error'

export interface ToastItem {
  id: string
  type: ToastType
  message: string
}