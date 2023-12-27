import { makeWAContactID } from '@/test/factories/make-wa-contact-id'
import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '../unique-entity-id'
import { WAMessageID } from '../wa-message-id'

describe('WAMessageID', () => {
  test('create', () => {
    const messageId = new WAMessageID({
      contactId: makeWAContactID(),
      isFromMe: true,
      ref: faker.database.mongodbObjectId(),
    })

    expect(messageId).toBeTruthy()
  })

  test('toString', () => {
    const messageId = new WAMessageID({
      contactId: makeWAContactID(),
      isFromMe: true,
      ref: faker.database.mongodbObjectId(),
    })

    expect(messageId.toString()).toEqual(expect.any(String))
    expect(messageId.toString()).toMatch(/true_[0-9]{13}@c\.us_[0-9a-fA-F]{24}/)
  })

  test('toUniqueEntityID', () => {
    const messageId = new WAMessageID({
      contactId: makeWAContactID(),
      isFromMe: true,
      ref: faker.database.mongodbObjectId(),
    })

    expect(messageId.toUniqueEntityID()).toBeInstanceOf(UniqueEntityID)
  })

  test('createFromString', () => {
    const contactId = makeWAContactID().toString()
    const ref = faker.database.mongodbObjectId()
    const rawId = `true_${contactId}_${ref}`

    const messageId = WAMessageID.createFromString(rawId)

    expect(messageId).toBeTruthy()
    expect(messageId.toString()).toEqual(rawId)
  })
})
