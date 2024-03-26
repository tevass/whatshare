import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '../unique-entity-id'
import { WAEntityID } from '../wa-entity-id'

describe('WAEntityID', () => {
  test('create', () => {
    const entityId = new WAEntityID({
      ref: faker.helpers.fromRegExp(/[0-9]{13}/),
      server: 'us',
      type: 'c',
    })

    expect(entityId).toBeTruthy()
  })

  test('toString', () => {
    const entityId = new WAEntityID({
      ref: faker.helpers.fromRegExp(/[0-9]{13}/),
      server: 'us',
      type: 'c',
    })

    expect(entityId.toString()).toEqual(expect.any(String))
    expect(entityId.toString()).toMatch(/[0-9]{13}@c\.us/)
  })

  test('toUniqueEntityID', () => {
    const entityId = new WAEntityID({
      ref: faker.helpers.fromRegExp(/[0-9]{13}/),
      server: 'us',
      type: 'c',
    })

    expect(entityId.toUniqueEntityID()).toBeInstanceOf(UniqueEntityID)
  })

  test('equals', () => {
    const entityId = new WAEntityID({
      ref: faker.helpers.fromRegExp(/[0-9]{13}/),
      server: 'us',
      type: 'c',
    })

    expect(entityId.equals(entityId)).toBe(true)
  })

  test('createFromString', () => {
    const waNumber = faker.helpers.fromRegExp(/[0-9]{13}-[0-9]{10}/)
    const rawId = `${waNumber}@g.us`
    const entityId = WAEntityID.createFromString(rawId)

    expect(entityId).toBeTruthy()
    expect(entityId.toString()).toEqual(rawId)
  })
})
