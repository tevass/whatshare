import {
  WAMessage,
  WAMessageProps,
} from '@/domain/chat/application/entities/wa-message'
import { faker } from '@faker-js/faker'
import { WAMessageID } from '@whatshare/server-core/entities'
import {
  makeWAEntityID,
  makeWAMessageID,
} from '@whatshare/server-core/factories'
import dayjs from 'dayjs'
import { makeWAContact } from './make-wa-contact'
import { makeWAMessageMedia } from './value-objects/make-wa-message-media'

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
      contacts: [makeWAContact()],
      media: makeWAMessageMedia(),
      ...override,
    },
    id,
  )
}
