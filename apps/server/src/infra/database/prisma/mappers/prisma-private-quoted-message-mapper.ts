import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAMessageID } from '@/core/entities/wa-message-id'
import { PrivateQuotedMessage } from '@/domain/chat/enterprise/entities/private-quoted-message'
import { Message as PrismaMessage } from '@prisma/client'
import { PrismaMessageTypeMapper } from './prisma-message-type-mapper'
import { PrismaMessageBodyMapper } from './prisma-message-body-mapper'
import {
  PrismaMessageMediaMapper,
  RawMessageMedia,
} from './prisma-message-media-mapper'
import {
  PrismaAttendantProfileMapper,
  RawAttendantProfile,
} from './prisma-attendant-profile-mapper'

export type RawPrivateQuotedMessage = PrismaMessage & {
  media?: RawMessageMedia | null
  senderBy?: RawAttendantProfile | null
}

export class PrismaPrivateQuotedMessageMapper {
  static toDomain(raw: RawPrivateQuotedMessage): PrivateQuotedMessage {
    return PrivateQuotedMessage.create(
      {
        chatId: new UniqueEntityID(raw.chatId),
        waChatId: WAEntityID.createFromString(raw.waChatId),
        whatsAppId: new UniqueEntityID(raw.whatsAppId),
        waMessageId: WAMessageID.createFromString(raw.waMessageId),
        type: PrismaMessageTypeMapper.toDomain(raw.type),
        body: raw.body ? PrismaMessageBodyMapper.toDomain(raw.body) : null,
        isFromMe: raw.isFromMe,
        isStatus: raw.isStatus,
        media: raw.media ? PrismaMessageMediaMapper.toDomain(raw.media) : null,
        senderBy: raw.senderBy
          ? PrismaAttendantProfileMapper.toDomain(raw.senderBy)
          : null,
      },
      new UniqueEntityID(raw.id),
    )
  }
}
