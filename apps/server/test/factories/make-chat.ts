import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Chat, ChatProps } from '@/domain/chat/enterprise/entities/chat'
import { faker } from '@faker-js/faker'
import { makeContact } from './make-contact'
import { makeUniqueEntityID } from './make-unique-entity-id'
import { makeWAEntityID } from './make-wa-entity-id'

export const makeChat = (
  override: Partial<ChatProps> = {},
  id?: UniqueEntityID,
) => {
  return Chat.create(
    {
      contact: makeContact(),
      unreadCount: faker.number.int({ max: 99 }),
      whatsAppId: makeUniqueEntityID(),
      waChatId: makeWAEntityID(),
      ...override,
    },
    id,
  )
}
