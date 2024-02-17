import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAMessageID } from '@/core/entities/wa-message-id'
import { GroupQuotedMessage } from '@/domain/chat/enterprise/entities/group-quoted-message'
import { Message as PrismaMessage } from '@prisma/client'
import {
  PrismaAttendantProfileMapper,
  RawAttendantProfile,
} from './prisma-attendant-profile-mapper'
import { PrismaContactMapper, RawContact } from './prisma-contact-mapper'
import { PrismaMessageBodyMapper } from './prisma-message-body-mapper'
import {
  PrismaMessageMediaMapper,
  RawMessageMedia,
} from './prisma-message-media-mapper'
import { PrismaMessageTypeMapper } from './prisma-message-type-mapper'

export type RawGroupQuotedMessage = PrismaMessage & {
  media?: RawMessageMedia | null
  senderBy?: RawAttendantProfile | null
  author: RawContact
  mentions?: RawContact[]
}

export class PrismaGroupQuotedMessageMapper {
  static toDomain(raw: RawGroupQuotedMessage): GroupQuotedMessage {
    return GroupQuotedMessage.create(
      {
        chatId: new UniqueEntityID(raw.chatId),
        waChatId: WAEntityID.createFromString(raw.waChatId),
        whatsAppId: new UniqueEntityID(raw.whatsAppId),
        waMessageId: WAMessageID.createFromString(raw.waMessageId),
        type: PrismaMessageTypeMapper.toDomain(raw.type),
        body: raw.body ? PrismaMessageBodyMapper.toDomain(raw.body) : null,
        isFromMe: raw.isFromMe,
        media: raw.media ? PrismaMessageMediaMapper.toDomain(raw.media) : null,
        senderBy: raw.senderBy
          ? PrismaAttendantProfileMapper.toDomain(raw.senderBy)
          : null,
        author: PrismaContactMapper.toDomain(raw.author),
        mentions: raw.mentions?.map(PrismaContactMapper.toDomain),
      },
      new UniqueEntityID(raw.id),
    )
  }
}
