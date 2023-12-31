import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { faker } from '@faker-js/faker'
import { MessageMedia } from '../message-media'

describe('MessageMedia', () => {
  test('create', () => {
    const media = MessageMedia.create({
      filename: faker.system.fileName(),
      key: faker.string.uuid(),
      messageId: makeUniqueEntityID(),
      url: faker.internet.url(),
    })

    expect(media).toBeTruthy()
  })
})
