import { WAEntityID } from '@/core/entities/wa-entity-id'
import {
  WAContact,
  WAContactProps,
} from '@/domain/chat/application/entities/wa-contact'
import { faker } from '@faker-js/faker'
import { makeWAEntityID } from './make-wa-entity-id'

export const makeWAContact = (
  override: Partial<WAContactProps> = {},
  id: WAEntityID = makeWAEntityID(),
) => {
  return WAContact.create(
    {
      name: faker.person.fullName(),
      shortName: faker.person.firstName(),
      pushName: faker.person.lastName(),
      number: faker.helpers.fromRegExp(/[0-9]{13}/),
      imageUrl: faker.internet.url(),
      formattedNumber: faker.phone.number(),
      isGroup: faker.datatype.boolean(),
      isBusiness: faker.datatype.boolean(),
      isEnterprise: faker.datatype.boolean(),
      isMyContact: faker.datatype.boolean(),
      description: faker.company.buzzPhrase(),
      ...override,
    },
    id,
  )
}
