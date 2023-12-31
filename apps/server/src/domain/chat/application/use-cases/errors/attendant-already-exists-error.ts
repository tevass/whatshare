import { UseCaseError } from '@/core/errors/use-case-error'

export class AttendantAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Attendant "${identifier}" already exists.`)
  }
}
