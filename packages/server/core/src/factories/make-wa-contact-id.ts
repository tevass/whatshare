import { faker } from '@faker-js/faker'
import { WAContactID, WAContactIDProps } from '../entities'

export function makeWAContactID(override: Partial<WAContactIDProps> = {}) {
  return new WAContactID({
    number: faker.helpers.fromRegExp(/[0-9]{13}/),
    ...override,
  })
}
