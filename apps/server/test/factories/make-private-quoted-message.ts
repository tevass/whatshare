import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  PrivateQuotedMessage,
  PrivateQuotedMessageProps,
} from '@/domain/chat/enterprise/entities/private-quoted-message'
import { makeAttendantProfile } from './make-attendant-profile'
import { makeMessageMedia } from './make-message-media'
import { makeUniqueEntityID } from './make-unique-entity-id'
import { makeWAEntityID } from './make-wa-entity-id'
import { makeWAMessageID } from './make-wa-message-id'
import { makeMessageBody } from './value-objects/make-message-body'

export const makePrivateQuotedMessage = (
  override: Partial<PrivateQuotedMessageProps> = {},
  id?: UniqueEntityID,
) => {
  const messageId = id ?? new UniqueEntityID()

  return PrivateQuotedMessage.create(
    {
      body: makeMessageBody(),
      chatId: makeUniqueEntityID(),
      isFromMe: false,
      isStatus: false,
      media: makeMessageMedia({ messageId }),
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
