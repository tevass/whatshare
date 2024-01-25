import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Message,
  MessageProps,
} from '@/domain/chat/enterprise/entities/message'
import { makeAttendantProfile } from './make-attendant-profile'
import { makeContact } from './make-contact'
import { makeMessageMedia } from './make-message-media'
import { makeUniqueEntityID } from './make-unique-entity-id'
import { makeWAEntityID } from './make-wa-entity-id'
import { makeWAMessageID } from './make-wa-message-id'
import { makeMessageBody } from './value-objects/make-message-body'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaMessageMapper } from '@/infra/database/prisma/mappers/prisma-message-mapper'

export const makeMessage = (
  override: Partial<MessageProps> = {},
  id?: UniqueEntityID,
) => {
  return Message.create(
    {
      ack: 'pending',
      author: makeContact(),
      body: makeMessageBody(),
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

@Injectable()
export class FakeMessageFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaMessage(
    data: Partial<MessageProps> = {},
    id?: UniqueEntityID,
  ): Promise<Message> {
    const message = makeMessage(
      {
        author: null,
        media: null,
        quoted: null,
        contacts: null,
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
