import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAMessageID } from '@/core/entities/wa-message-id'
import { Message } from '@/domain/chat/enterprise/entities/message'
import { Message as PrismaMessage } from '@prisma/client'
import { PrismaContactMapper, RawContact } from './prisma-contact-mapper'
import { PrismaMessageAckMapper } from './prisma-message-ack-mapper'
import { PrismaMessageBodyMapper } from './prisma-message-body-mapper'
import { PrismaMessageTypeMapper } from './prisma-message-type-mapper'

export type RawQuotedMessage = PrismaMessage & {
  author?: RawContact | null
}

export class PrismaQuotedMessageMapper {
  static toDomain(raw: RawQuotedMessage): Message {
    return Message.create(
      {
        chatId: new UniqueEntityID(raw.chatId),
        waChatId: WAEntityID.createFromString(raw.waChatId),
        waMessageId: WAMessageID.createFromString(raw.waMessageId),
        whatsAppId: new UniqueEntityID(raw.whatsAppId),
        type: PrismaMessageTypeMapper.toDomain(raw.type),
        ack: PrismaMessageAckMapper.toDomain(raw.ack),
        isBroadcast: raw.isBroadcast,
        isForwarded: raw.isForwarded,
        isFromMe: raw.isFromMe,
        isGif: raw.isGif,
        isStatus: raw.isStatus,
        createdAt: raw.createdAt,
        revokedAt: raw.revokedAt,
        author: raw.author ? PrismaContactMapper.toDomain(raw.author) : null,
        body: raw.body ? PrismaMessageBodyMapper.toDomain(raw.body) : null,
      },
      new UniqueEntityID(raw.id),
    )
  }
}
