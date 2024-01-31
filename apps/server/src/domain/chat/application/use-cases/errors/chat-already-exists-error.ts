import { UseCaseError } from '@/core/errors/use-case-error'

export class ChatAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Chat "${identifier}" already exists.`)
  }
}
