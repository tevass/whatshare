import { faker } from '@faker-js/faker'
import { Token } from '../token'

describe('Token', () => {
  test('create', () => {
    const token = Token.create({
      value: faker.string.hexadecimal(),
    })

    expect(token).toBeTruthy()
  })
})
