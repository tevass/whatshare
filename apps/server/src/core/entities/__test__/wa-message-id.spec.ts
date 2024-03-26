import { makeWAEntityID } from '@/test/factories/make-wa-entity-id'
import { makeWAMessageOwnerID } from '@/test/factories/make-wa-message-owner-id'
import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '../unique-entity-id'
import { WAMessageID } from '../wa-message-id'

describe('WAMessageID', () => {
  test('create', () => {
    const messageId = new WAMessageID({
      entityId: makeWAEntityID(),
      isFromMe: true,
      ref: faker.database.mongodbObjectId(),
      owner: makeWAMessageOwnerID(),
    })

    expect(messageId).toBeTruthy()
  })

  test('hasOwner', () => {
    const messageId = new WAMessageID({
      entityId: makeWAEntityID(),
      isFromMe: true,
      ref: faker.database.mongodbObjectId(),
      owner: makeWAMessageOwnerID(),
    })

    expect(messageId.hasOwner()).toBe(true)
  })

  test('toString', () => {
    const messageId = new WAMessageID({
      entityId: makeWAEntityID(),
      isFromMe: true,
      ref: faker.database.mongodbObjectId(),
      owner: makeWAMessageOwnerID(),
    })

    expect(messageId.toString()).toEqual(expect.any(String))
    expect(messageId.toString()).toMatch(/true_[0-9]{13}@c\.us_[0-9a-fA-F]{24}/)
  })

  test('toUniqueEntityID', () => {
    const messageId = new WAMessageID({
      entityId: makeWAEntityID(),
      isFromMe: true,
      ref: faker.database.mongodbObjectId(),
      owner: makeWAMessageOwnerID(),
    })

    expect(messageId.toUniqueEntityID()).toBeInstanceOf(UniqueEntityID)
  })

  test('equals', () => {
    const messageId = new WAMessageID({
      entityId: makeWAEntityID(),
      isFromMe: true,
      ref: faker.database.mongodbObjectId(),
      owner: makeWAMessageOwnerID(),
    })

    expect(messageId.equals(messageId)).toBe(true)
  })

  test('createFromString', () => {
    const entityId = makeWAEntityID().toString()
    const ownerId = makeWAEntityID().toString()
    const ref = faker.database.mongodbObjectId()
    const rawId = `true_${entityId}_${ref}_${ownerId}`

    const messageId = WAMessageID.createFromString(rawId)

    expect(messageId).toBeTruthy()
    expect(messageId.toString()).toEqual(rawId)
  })
})
