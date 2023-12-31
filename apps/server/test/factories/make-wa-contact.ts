import {
  WAContact,
  WAContactProps,
} from '@/domain/chat/application/entities/wa-contact'
import { faker } from '@faker-js/faker'
import { WAEntityID } from '@whatshare/server-core/entities'
import { makeWAEntityID } from '@whatshare/server-core/factories'

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
