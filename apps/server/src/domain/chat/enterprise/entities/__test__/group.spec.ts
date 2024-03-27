import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWAEntityID } from '@/test/factories/make-wa-entity-id'
import { faker } from '@faker-js/faker'
import { Group } from '../group'

describe('Group', () => {
  test('create', () => {
    const group = Group.create({
      name: faker.person.firstName(),
      waGroupId: makeWAEntityID(),
      whatsAppId: makeUniqueEntityID(),
    })

    expect(group).toBeTruthy()
  })
})
