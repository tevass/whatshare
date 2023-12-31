import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export function makeUniqueEntityID(override?: string) {
  return new UniqueEntityID(override)
}
