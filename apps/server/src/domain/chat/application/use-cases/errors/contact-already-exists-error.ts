import { UseCaseError } from '@/core/errors/use-case-error'

export class ContactAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Contact "${identifier}" already exists.`)
  }
}
