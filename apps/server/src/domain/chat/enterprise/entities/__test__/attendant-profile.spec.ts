import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { faker } from '@faker-js/faker'
import { AttendantProfile } from '../attendant-profile'

describe('Attendant Profile', () => {
  test('create', () => {
    const attendant = AttendantProfile.create({
      attendantId: makeUniqueEntityID(),
      email: faker.internet.email(),
      name: faker.person.firstName(),
      displayName: faker.internet.userName(),
    })

    expect(attendant).toBeTruthy()
  })
})
