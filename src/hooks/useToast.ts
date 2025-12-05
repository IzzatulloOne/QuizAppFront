import { useState, useEffect, useRef } from "react"

export type ToastVariant = "default" | "destructive"

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface UseToastResult {
  toasts: Toast[]
  toast: (toast: Omit<Toast, "id">) => void
  dismiss: (id: string) => void
  dismissAll: () => void
}

export function useToast(): UseToastResult {
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastTimeoutsRef = useRef<Map<string, any>>(new Map())

  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      toastTimeoutsRef.current.forEach((timeout) => {
        clearTimeout(timeout)
      })
      toastTimeoutsRef.current.clear()
    }
  }, [])

  const toast = ({ title, description, variant = "default", duration = 5000 }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = {
      id,
      title,
      description,
      variant,
      duration,
    }

    setToasts((prev) => [...prev, newToast])

    // Auto dismiss after duration
    if (duration > 0) {
      const timeout = setTimeout(() => {
        dismiss(id)
      }, duration)

      toastTimeoutsRef.current.set(id, timeout)
    }

    return id
  }

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))

    // Clear timeout if it exists
    if (toastTimeoutsRef.current.has(id)) {
      clearTimeout(toastTimeoutsRef.current.get(id)!)
      toastTimeoutsRef.current.delete(id)
    }
  }

  const dismissAll = () => {
    setToasts([])

    // Clear all timeouts
    toastTimeoutsRef.current.forEach((timeout) => {
      clearTimeout(timeout)
    })
    toastTimeoutsRef.current.clear()
  }

  return {
    toasts,
    toast,
    dismiss,
    dismissAll,
  }
}