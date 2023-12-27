import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '../unique-entity-id'
import { WAContactID } from '../wa-contact-id'

describe('WAContactID', () => {
  test('create', () => {
    const contactId = new WAContactID({
      number: faker.helpers.fromRegExp(/[0-9]{13}/),
      server: 'us',
      type: 'c',
    })

    expect(contactId).toBeTruthy()
  })

  test('toString', () => {
    const contactId = new WAContactID({
      number: faker.helpers.fromRegExp(/[0-9]{13}/),
      server: 'us',
      type: 'c',
    })

    expect(contactId.toString()).toEqual(expect.any(String))
    expect(contactId.toString()).toMatch(/[0-9]{13}@c\.us/)
  })

  test('toUniqueEntityID', () => {
    const contactId = new WAContactID({
      number: faker.helpers.fromRegExp(/[0-9]{13}/),
      server: 'us',
      type: 'c',
    })

    expect(contactId.toUniqueEntityID()).toBeInstanceOf(UniqueEntityID)
  })

  test('createFromString', () => {
    const waNumber = faker.helpers.fromRegExp(/[0-9]{13}-[0-9]{10}/)
    const rawId = `${waNumber}@g.us`
    const contactId = WAContactID.createFromString(rawId)

    expect(contactId).toBeTruthy()
    expect(contactId.toString()).toEqual(rawId)
  })
})
