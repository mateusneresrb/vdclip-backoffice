import { setupWorker } from 'msw/browser'

import { financeHandlers } from './handlers/finance'

export const worker = setupWorker(...financeHandlers)
