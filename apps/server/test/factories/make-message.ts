import {
  Message,
  MessageProps,
} from '@/domain/chat/enterprise/entities/message'
import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@whatshare/server-core/entities'
import {
  makeUniqueEntityID,
  makeWAEntityID,
  makeWAMessageID,
} from '@whatshare/server-core/factories'
import { makeAttendantProfile } from './make-attendant-profile'
import { makeContact } from './make-contact'
import { makeMessageMedia } from './make-message-media'

export const makeMessage = (
  override: Partial<MessageProps> = {},
  id?: UniqueEntityID,
) => {
  return Message.create(
    {
      ack: 'pending',
      author: makeContact(),
      body: faker.lorem.paragraph(),
      chatId: makeUniqueEntityID(),
      contacts: [makeContact()],
      createdAt: new Date(),
      deletedAt: null,
      isBroadcast: false,
      isForwarded: false,
      isFromMe: false,
      isGif: false,
      isStatus: false,
      media: makeMessageMedia(),
      revokedAt: null,
      revokedBy: makeAttendantProfile(),
      senderBy: makeAttendantProfile(),
      type: 'image',
      waChatId: makeWAEntityID(),
      waMessageId: makeWAMessageID(),
      whatsAppId: makeUniqueEntityID(),
      ...override,
    },
    id,
  )
}
