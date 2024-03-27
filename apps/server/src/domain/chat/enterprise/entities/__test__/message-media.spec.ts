import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeMimeType } from '@/test/factories/value-objects/make-mime-type'
import { faker } from '@faker-js/faker'
import { MessageMedia } from '../message-media'

describe('MessageMedia', () => {
  test('create', () => {
    const media = MessageMedia.create({
      key: faker.string.uuid(),
      messageId: makeUniqueEntityID(),
      mimetype: makeMimeType(),
    })

    expect(media).toBeTruthy()
  })
})
