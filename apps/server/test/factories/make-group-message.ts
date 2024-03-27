import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  GroupMessage,
  GroupMessageProps,
} from '@/domain/chat/enterprise/entities/group-message'
import { makeUniqueEntityID } from './make-unique-entity-id'
import { makeWAEntityID } from './make-wa-entity-id'
import { makeAttendantProfile } from './value-objects/make-attendant-profile'
import { makeContact } from './make-contact'
import { makeMessageBody } from './value-objects/make-message-body'
import { makeWAMessageID } from './make-wa-message-id'
import { makeMessageMedia } from './make-message-media'

export const makeGroupMessage = (
  override: Partial<GroupMessageProps> = {},
  id?: UniqueEntityID,
) => {
  const messageId = id ?? new UniqueEntityID()

  return GroupMessage.create(
    {
      ack: 'pending',
      body: makeMessageBody(),
      chatId: makeUniqueEntityID(),
      contacts: [makeContact()],
      createdAt: new Date(),
      isForwarded: false,
      isFromMe: false,
      isGif: false,
      media: makeMessageMedia({ messageId }),
      revokedAt: null,
      revokedBy: makeAttendantProfile(),
      senderBy: makeAttendantProfile(),
      type: 'image',
      waChatId: makeWAEntityID(),
      waMessageId: makeWAMessageID(),
      whatsAppId: makeUniqueEntityID(),
      author: makeContact(),
      ...override,
    },
    messageId,
  )
}
