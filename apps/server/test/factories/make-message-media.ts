import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  MessageMedia,
  MessageMediaProps,
} from '@/domain/chat/enterprise/entities/message-media'
import { faker } from '@faker-js/faker'
import { makeUniqueEntityID } from './make-unique-entity-id'

export const makeMessageMedia = (
  override: Partial<MessageMediaProps> = {},
  id?: UniqueEntityID,
) => {
  return MessageMedia.create(
    {
      filename: faker.system.fileName(),
      key: faker.string.uuid(),
      messageId: makeUniqueEntityID(),
      url: faker.internet.url(),
      ...override,
    },
    id,
  )
}
