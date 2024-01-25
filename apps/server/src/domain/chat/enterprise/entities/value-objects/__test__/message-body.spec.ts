import { faker } from '@faker-js/faker'
import { MessageBody } from '../message-body'

describe('MessageBody', () => {
  test('create', () => {
    const body = MessageBody.create({
      content: faker.lorem.paragraph(),
      header: faker.person.firstName(),
    })

    expect(body).toBeTruthy()
  })

  test('format', () => {
    const body = MessageBody.create({
      content: faker.lorem.paragraph(),
    })

    const formattedBody = body.format()
    expect(formattedBody).toBe(body.content)
  })
})
