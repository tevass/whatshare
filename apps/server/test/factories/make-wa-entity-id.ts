import { WAEntityID, WAEntityIDProps } from '@/core/entities/wa-entity-id'
import { faker } from '@faker-js/faker'

export function makeWAEntityID(override: Partial<WAEntityIDProps> = {}) {
  return new WAEntityID({
    ref: faker.helpers.fromRegExp(/[0-9]{13}/),
    ...override,
  })
}
