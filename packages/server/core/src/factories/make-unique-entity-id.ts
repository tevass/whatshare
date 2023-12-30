import { UniqueEntityID } from '../entities'

export function makeUniqueEntityID(override?: string) {
  return new UniqueEntityID(override)
}
