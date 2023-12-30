import {
  MessageMedia,
  MessageMediaProps,
} from '@/domain/chat/enterprise/entities/message-media'
import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@whatshare/server-core/entities'
import { makeUniqueEntityID } from '@whatshare/server-core/factories'

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
