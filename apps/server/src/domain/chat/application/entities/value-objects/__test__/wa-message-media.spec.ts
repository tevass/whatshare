import { faker } from '@faker-js/faker'
import { WAMessageMedia } from '../wa-message-media'

describe('WAMessageMedia', () => {
  test('create', () => {
    const media = WAMessageMedia.create({
      data: faker.string.binary({ length: 5 }),
      mimetype: faker.system.mimeType(),
    })

    expect(media).toBeTruthy()
  })
})
