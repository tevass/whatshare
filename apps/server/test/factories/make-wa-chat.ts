import { WAChat, WAChatProps } from '@/domain/chat/application/entities/wa-chat'
import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'
import { makeUniqueEntityID } from './make-unique-entity-id'
import { makeWAContact } from './make-wa-contact'
import { makeWAEntityID } from './make-wa-entity-id'

export const makeWAChat = (
  override: Partial<WAChatProps> = {},
  id = makeWAEntityID(),
) => {
  return WAChat.create(
    {
      isGroup: faker.datatype.boolean(),
      name: faker.person.firstName(),
      timestamp: dayjs().unix(),
      unreadCount: faker.number.int({ max: 99 }),
      imageUrl: faker.internet.url(),
      contact: makeWAContact({}, id),
      waClientId: makeUniqueEntityID(),
      participants: Array.from(Array(2)).map(() => makeWAContact()),
      ...override,
    },
    id,
  )
}
