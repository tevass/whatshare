import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeMimeType } from '@/test/factories/value-objects/make-mime-type'
import { faker } from '@faker-js/faker'
import { Media, MediaProps } from '../media'

class RawMedia extends Media<MediaProps> {
  static create(props: MediaProps, id?: UniqueEntityID) {
    return new RawMedia(props, id)
  }
}

describe('Media', () => {
  test('create', () => {
    const media = RawMedia.create({
      filename: faker.system.fileName(),
      key: faker.string.uuid(),
      mimetype: makeMimeType(),
      url: faker.internet.url(),
    })

    expect(media).toBeTruthy()
  })
})
