import { UseCaseError } from '@/core/errors/use-case-error'

export class WAServiceNotFoundError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`WAService "${identifier}" not found`)
  }
}
