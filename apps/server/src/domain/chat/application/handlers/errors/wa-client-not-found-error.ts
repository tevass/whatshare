import { UseCaseError } from '@/core/errors/use-case-error'

export class WAClientNotFoundError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`WAClient "${identifier}" not found`)
  }
}
