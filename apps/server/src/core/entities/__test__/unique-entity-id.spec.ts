import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '../unique-entity-id'

describe('UniEntityID', () => {
  test('create', () => {
    const uniqueId = new UniqueEntityID(faker.string.uuid())

    expect(uniqueId).toBeTruthy()
  })

  test('toString', () => {
    const uniqueId = new UniqueEntityID(faker.string.uuid())

    expect(uniqueId.toString()).toEqual(expect.any(String))
  })

  test('toString', () => {
    const uniqueId = new UniqueEntityID(faker.string.uuid())

    expect(uniqueId.equals(uniqueId)).toBe(true)
  })
})
