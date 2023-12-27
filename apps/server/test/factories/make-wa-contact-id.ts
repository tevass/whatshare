import { WAContactID, WAContactIDProps } from '@/core/entities/wa-contact-id'
import { faker } from '@faker-js/faker'

export function makeWAContactID(override: Partial<WAContactIDProps> = {}) {
  return new WAContactID({
    number: faker.helpers.fromRegExp(/[0-9]{13}/),
    ...override,
  })
}
