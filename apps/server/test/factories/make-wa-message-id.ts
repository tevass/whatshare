import { WAMessageID, WAMessageIDProps } from '@/core/entities/wa-message-id'
import { faker } from '@faker-js/faker'
import { makeWAEntityID } from './make-wa-entity-id'

export function makeWAMessageID(override: Partial<WAMessageIDProps> = {}) {
  return new WAMessageID({
    ref: faker.helpers.fromRegExp(/[0-9]{13}/),
    entityId: makeWAEntityID(),
    isFromMe: faker.datatype.boolean(),
    ...override,
  })
}
