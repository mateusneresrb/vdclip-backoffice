import { toast } from 'sonner'
import { i18n } from '@/i18n'
import { ApiError } from './api-client'

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

/**
 * Handle mutation errors with API error code awareness.
 *
 * Checks for a specific i18n key `toast.apiError.{ERROR_CODE}` first.
 * Falls back to the API error message, then to the provided generic fallback.
 *
 * Usage:
 * ```ts
 * onError: (err) => showMutationError(err, i18n.t('admin:toast.costCenterCreateError'))
 * ```
 */
export function showMutationError(err: unknown, fallbackTitle: string) {
  if (err instanceof ApiError) {
    // Try specific translated message for known error codes
    if (err.errorCode) {
      const codeKey = `admin:toast.apiError.${err.errorCode}`
      const translated = i18n.t(codeKey)

      if (translated !== codeKey) {
        showErrorToast({ title: translated })
        return
      }
    }

    // Fallback: show generic title with API message as description
    const apiMsg = err.errorMessage
    if (apiMsg && !apiMsg.startsWith('HTTP ')) {
      showErrorToast({ title: fallbackTitle, description: apiMsg })
      return
    }
  }

  showErrorToast({ title: fallbackTitle })
}
