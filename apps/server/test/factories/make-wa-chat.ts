import { WAChat, WAChatProps } from '@/domain/chat/application/entities/wa-chat'
import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'
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
      ...override,
    },
    id,
  )
}
