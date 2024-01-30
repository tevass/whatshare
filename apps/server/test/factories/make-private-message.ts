import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  PrivateMessage,
  PrivateMessageProps,
} from '@/domain/chat/enterprise/entities/private-message'
import { PrismaMessageMapper } from '@/infra/database/prisma/mappers/prisma-message-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { makeAttendantProfile } from './make-attendant-profile'
import { makeContact } from './make-contact'
import { makeMessageMedia } from './make-message-media'
import { makeUniqueEntityID } from './make-unique-entity-id'
import { makeWAEntityID } from './make-wa-entity-id'
import { makeWAMessageID } from './make-wa-message-id'
import { makeMessageBody } from './value-objects/make-message-body'

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

// TODO: REFACTOR
@Injectable()
export class FakeMessageFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaMessage(
    data: Partial<PrivateMessageProps> = {},
    id?: UniqueEntityID,
  ): Promise<PrivateMessage> {
    const message = makePrivateMessage(
      {
        media: null,
        quoted: null,
        contacts: null,
        senderBy: null,
        revokedBy: null,
        type: 'text',
        ...data,
      },
      id,
    )

    await this.prisma.message.create({
      data: PrismaMessageMapper.toPrismaCreate(message),
    })

    return message
  }
}
