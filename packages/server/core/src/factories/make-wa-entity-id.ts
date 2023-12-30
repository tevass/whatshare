import { faker } from '@faker-js/faker'
import { WAEntityID, WAEntityIDProps } from '../entities'

export function makeWAEntityID(override: Partial<WAEntityIDProps> = {}) {
  return new WAEntityID({
    ref: faker.helpers.fromRegExp(/[0-9]{13}/),
    ...override,
  })
}
