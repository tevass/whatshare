import { WAMessageID } from '@/core/entities/wa-message-id'
import {
  WAMessage,
  WAMessageProps,
} from '@/domain/chat/application/entities/wa-message'
import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'
import { makeWAEntityID } from './make-wa-entity-id'
import { makeWAMessageID } from './make-wa-message-id'

export const makeWAMessage = (
  override: Partial<WAMessageProps> = {},
  id: WAMessageID = makeWAMessageID(),
) => {
  return WAMessage.create(
    {
      ack: 'pending',
      author: makeWAEntityID(),
      body: faker.lorem.paragraph(),
      chatId: makeWAEntityID(),
      isBroadcast: faker.datatype.boolean(),
      isForwarded: faker.datatype.boolean(),
      isFromMe: faker.datatype.boolean(),
      isGif: faker.datatype.boolean(),
      isStatus: faker.datatype.boolean(),
      timestamp: dayjs().unix(),
      type: 'text',
      ...override,
    },
    id,
  )
}
