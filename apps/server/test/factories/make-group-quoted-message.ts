import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  GroupQuotedMessage,
  GroupQuotedMessageProps,
} from '@/domain/chat/enterprise/entities/group-quoted-message'
import { makeAttendantProfile } from './make-attendant-profile'
import { makeContact } from './make-contact'
import { makeMessageMedia } from './make-message-media'
import { makeUniqueEntityID } from './make-unique-entity-id'
import { makeWAEntityID } from './make-wa-entity-id'
import { makeWAMessageID } from './make-wa-message-id'
import { makeMessageBody } from './value-objects/make-message-body'

export const makeGroupQuotedMessage = (
  override: Partial<GroupQuotedMessageProps> = {},
  id?: UniqueEntityID,
) => {
  const messageId = id ?? new UniqueEntityID()

  return GroupQuotedMessage.create(
    {
      body: makeMessageBody(),
      chatId: makeUniqueEntityID(),
      isFromMe: false,
      media: makeMessageMedia({ messageId }),
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
