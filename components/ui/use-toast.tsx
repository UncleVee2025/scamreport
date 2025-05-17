"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

const ToastContext = React.createContext<{
  toasts: Toast[]
  addToast: (toast: Toast) => void
  removeToast: (id: string) => void
}>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
})

export type Toast = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, ...toast }])

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  const toast = React.useCallback(
    (props: Omit<Toast, "id">) => {
      context.addToast(props)
    },
    [context],
  )

  return { toast }
}

// Export toast as a named export to fix the error
export const toast = (props: Omit<Toast, "id">) => {
  const { toast: innerToast } = useToast()
  return innerToast(props)
}

function ToastContainer() {
  const { toasts, removeToast } = React.useContext(ToastContext)

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 max-w-md w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-start justify-between p-4 rounded-lg shadow-md bg-white border",
            toast.variant === "destructive" ? "border-red-500" : "border-gray-200",
            "animate-in slide-in-from-bottom-5",
          )}
        >
          <div className="flex-1">
            {toast.title && (
              <h3 className={cn("font-medium", toast.variant === "destructive" ? "text-red-500" : "text-gray-900")}>
                {toast.title}
              </h3>
            )}
            {toast.description && <p className="text-sm text-gray-500 mt-1">{toast.description}</p>}
          </div>
          <button onClick={() => removeToast(toast.id)} className="ml-4 text-gray-400 hover:text-gray-500">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
