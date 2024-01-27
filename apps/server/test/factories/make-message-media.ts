import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  MessageMedia,
  MessageMediaProps,
} from '@/domain/chat/enterprise/entities/message-media'
import { faker } from '@faker-js/faker'
import { makeUniqueEntityID } from './make-unique-entity-id'
import { makeMimeType } from './value-objects/make-mime-type'

export const makeMessageMedia = (
  override: Partial<MessageMediaProps> = {},
  id?: UniqueEntityID,
) => {
  return MessageMedia.create(
    {
      key: faker.string.uuid(),
      messageId: makeUniqueEntityID(),
      mimetype: makeMimeType(),
      ...override,
    },
    id,
  )
}
