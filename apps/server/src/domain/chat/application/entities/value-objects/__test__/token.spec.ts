import { faker } from '@faker-js/faker'
import { Token } from '../token'

describe('Token', () => {
  test('create', () => {
    const token = Token.create({
      name: faker.internet.domainWord(),
      value: faker.string.hexadecimal(),
    })

    expect(token).toBeTruthy()
  })
})
