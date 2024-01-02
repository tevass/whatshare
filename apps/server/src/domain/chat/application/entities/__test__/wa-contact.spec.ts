import { Contact } from '@/domain/chat/enterprise/entities/contact'
import { makeWAEntityID } from '@/test/factories/make-wa-entity-id'
import { faker } from '@faker-js/faker'
import { WAContact } from '../wa-contact'

describe('WAContact', () => {
  test('create', () => {
    const waContact = WAContact.create(
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
      },
      makeWAEntityID(),
    )

    expect(waContact).toBeTruthy()
  })

  test('createFromVCard', () => {
    const waContact = WAContact.createFromVCard(
      [
        'BEGIN:VCARD\n',
        'VERSION:3.0\n',
        `N:;${faker.person.firstName()};;;\n`,
        `FN:${faker.person.firstName()}\n`,
        `TEL;type=CELL;waid=${faker.helpers.fromRegExp(
          /[0-9]{13}/,
        )}:${faker.phone.number()}\n`,
        `X-WA-BIZ-NAME:${faker.company.name()}\n`,
        `X-WA-BIZ-DESCRIPTION:${faker.company.buzzPhrase()}\n`,
        'END:VCARD',
      ].join(''),
    )

    expect(waContact).toBeTruthy()
  })

  test('toContact', () => {
    const waContact = WAContact.create(
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
      },
      makeWAEntityID(),
    )

    expect(waContact.toContact()).toBeInstanceOf(Contact)
  })
})
