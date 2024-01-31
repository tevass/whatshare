import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { GroupMessage } from '@/domain/chat/enterprise/entities/group-message'
import { Prisma, Message as PrismaMessage } from '@prisma/client'
import { PrismaMessageTypeMapper } from './prisma-message-type-mapper'
import { PrismaMessageAckMapper } from './prisma-message-ack-mapper'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAMessageID } from '@/core/entities/wa-message-id'
import { PrismaMessageBodyMapper } from './prisma-message-body-mapper'
import { PrismaContactMapper, RawContact } from './prisma-contact-mapper'
import {
  PrismaMessageMediaMapper,
  RawMessageMedia,
} from './prisma-message-media-mapper'
import {
  PrismaAttendantProfileMapper,
  RawAttendantProfile,
} from './prisma-attendant-profile-mapper'
import {
  PrismaGroupQuotedMessageMapper,
  RawGroupQuotedMessage,
} from './prisma-group-quoted-message-mapper'

export type RawGroupMessage = PrismaMessage & {
  vCardsContacts?: RawContact[]
  media?: RawMessageMedia | null
  senderBy?: RawAttendantProfile | null
  revokedBy?: RawAttendantProfile | null
  quoted?: RawGroupQuotedMessage | null
  author: RawContact
  mentions?: RawContact[]
}

export class PrismaGroupMessageMapper {
  static toDomain(raw: RawGroupMessage): GroupMessage {
    return GroupMessage.create(
      {
        chatId: new UniqueEntityID(raw.chatId),
        waChatId: WAEntityID.createFromString(raw.waChatId),
        whatsAppId: new UniqueEntityID(raw.whatsAppId),
        waMessageId: WAMessageID.createFromString(raw.waMessageId),
        type: PrismaMessageTypeMapper.toDomain(raw.type),
        ack: PrismaMessageAckMapper.toDomain(raw.ack),
        body: raw.body ? PrismaMessageBodyMapper.toDomain(raw.body) : null,
        contacts: raw.vCardsContacts?.map(PrismaContactMapper.toDomain) ?? null,
        isForwarded: raw.isForwarded,
        isFromMe: raw.isFromMe,
        isGif: raw.isGif,
        createdAt: raw.createdAt,
        revokedAt: raw.revokedAt,
        media: raw.media ? PrismaMessageMediaMapper.toDomain(raw.media) : null,
        quoted: raw.quoted
          ? PrismaGroupQuotedMessageMapper.toDomain(raw.quoted)
          : null,
        revokedBy: raw.revokedBy
          ? PrismaAttendantProfileMapper.toDomain(raw.revokedBy)
          : null,
        senderBy: raw.senderBy
          ? PrismaAttendantProfileMapper.toDomain(raw.senderBy)
          : null,
        author: PrismaContactMapper.toDomain(raw.author),
        mentions: raw.mentions?.map(PrismaContactMapper.toDomain),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaCreate(
    message: GroupMessage,
  ): Prisma.MessageUncheckedCreateInput {
    return {
      id: message.id.toString(),
      chatId: message.chatId.toString(),
      revokerId: message.revokedBy?.id.toString(),
      senderId: message.senderBy?.id.toString(),
      waChatId: message.waChatId.toString(),
      waMessageId: message.waMessageId.toString(),
      whatsAppId: message.whatsAppId.toString(),
      ack: PrismaMessageAckMapper.toPrisma(message.ack),
      type: PrismaMessageTypeMapper.toPrisma(message.type),
      body: message.hasBody()
        ? PrismaMessageBodyMapper.toPrisma(message.body)
        : null,
      isForwarded: message.isForwarded,
      isFromMe: message.isFromMe,
      isGif: message.isGif,
      mediaId: message.media?.id.toString(),
      quotedId: message.quoted?.id.toString(),
      createdAt: message.createdAt,
      revokedAt: message.revokedAt,
      vCardsContactsIds: message.contacts?.map((contact) =>
        contact.id.toString(),
      ),
      authorId: message.author.id.toString(),
      mentionsIds: message.mentions?.map((contact) => contact.id.toString()),
      isBroadcast: false,
      isStatus: false,
    }
  }

  static toPrismaUpdate(
    message: GroupMessage,
  ): Prisma.MessageUncheckedUpdateInput {
    return {
      chatId: message.chatId.toString(),
      revokerId: message.revokedBy?.id.toString(),
      senderId: message.senderBy?.id.toString(),
      waChatId: message.waChatId.toString(),
      waMessageId: message.waMessageId.toString(),
      whatsAppId: message.whatsAppId.toString(),
      ack: PrismaMessageAckMapper.toPrisma(message.ack),
      type: PrismaMessageTypeMapper.toPrisma(message.type),
      body: message.hasBody()
        ? PrismaMessageBodyMapper.toPrisma(message.body)
        : null,
      isForwarded: message.isForwarded,
      isFromMe: message.isFromMe,
      isGif: message.isGif,
      mediaId: message.media?.id.toString(),
      quotedId: message.quoted?.id.toString(),
      createdAt: message.createdAt,
      revokedAt: message.revokedAt,
      vCardsContactsIds: message.contacts?.map((contact) =>
        contact.id.toString(),
      ),
      authorId: message.author.id.toString(),
      mentionsIds: message.mentions?.map((contact) => contact.id.toString()),
      isBroadcast: false,
      isStatus: false,
    }
  }
}
