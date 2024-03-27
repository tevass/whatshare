import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  PrivateMessage,
  PrivateMessageProps,
} from '@/domain/chat/enterprise/entities/private-message'
import { makeContact } from './make-contact'
import { makeMessageMedia } from './make-message-media'
import { makeUniqueEntityID } from './make-unique-entity-id'
import { makeWAEntityID } from './make-wa-entity-id'
import { makeWAMessageID } from './make-wa-message-id'
import { makeMessageBody } from './value-objects/make-message-body'
import { makeAttendantProfile } from './value-objects/make-attendant-profile'

export const makePrivateMessage = (
  override: Partial<PrivateMessageProps> = {},
  id?: UniqueEntityID,
) => {
  const messageId = id ?? new UniqueEntityID()

  return PrivateMessage.create(
    {
      ack: 'pending',
      body: makeMessageBody(),
      chatId: makeUniqueEntityID(),
      contacts: [makeContact()],
      createdAt: new Date(),
      isBroadcast: false,
      isForwarded: false,
      isFromMe: false,
      isGif: false,
      isStatus: false,
      media: makeMessageMedia({ messageId }),
      revokedAt: null,
      revokedBy: makeAttendantProfile(),
      senderBy: makeAttendantProfile(),
      type: 'image',
      waChatId: makeWAEntityID(),
      waMessageId: makeWAMessageID(),
      whatsAppId: makeUniqueEntityID(),
      ...override,
    },
    messageId,
  )
}
