import { toast } from 'sonner'

interface ToastOptions {
  title: string
  description?: string
}

export function showSuccessToast({ title, description }: ToastOptions) {
  toast.success(title, { description })
}

export function showErrorToast({ title, description }: ToastOptions) {
  toast.error(title, { description })
}

export function showWarningToast({ title, description }: ToastOptions) {
  toast.warning(title, { description })
}

export function showInfoToast({ title, description }: ToastOptions) {
  toast.info(title, { description })
}
