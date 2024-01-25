import { Prisma, Message as PrismaMessage } from '@prisma/client'
import { PrismaContactMapper, RawContact } from './prisma-contact-mapper'
import {
  PrismaAttendantProfileMapper,
  RawAttendantProfile,
} from './prisma-attendant-profile-mapper'
import {
  PrismaMessageMediaMapper,
  RawMessageMedia,
} from './prisma-message-media-mapper'
import { Message } from '@/domain/chat/enterprise/entities/message'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAMessageID } from '@/core/entities/wa-message-id'
import { PrismaMessageTypeMapper } from './prisma-message-type-mapper'
import { PrismaMessageAckMapper } from './prisma-message-ack-mapper'
import { PrismaMessageBodyMapper } from './prisma-message-body-mapper'

export type RawMessage = PrismaMessage & {
  vCardsContacts?: RawContact[]
  author?: RawContact | null
  media?: RawMessageMedia | null
  senderBy?: RawAttendantProfile | null
  revokedBy?: RawAttendantProfile | null
  quoted?: PrismaMessage | null
}

export class PrismaMessageMapper {
  static toDomain(raw: RawMessage): Message {
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
        deletedAt: raw.deletedAt,
        revokedAt: raw.revokedAt,
        author: raw.author ? PrismaContactMapper.toDomain(raw.author) : null,
        body: raw.body ? PrismaMessageBodyMapper.toDomain(raw.body) : null,
        contacts: raw.vCardsContacts?.length
          ? raw.vCardsContacts.map(PrismaContactMapper.toDomain)
          : null,
        media: raw.media ? PrismaMessageMediaMapper.toDomain(raw.media) : null,
        quoted: raw.quoted ? PrismaMessageMapper.toDomain(raw.quoted) : null,
        revokedBy: raw.revokedBy
          ? PrismaAttendantProfileMapper.toDomain(raw.revokedBy)
          : null,
        senderBy: raw.senderBy
          ? PrismaAttendantProfileMapper.toDomain(raw.senderBy)
          : null,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaCreate(message: Message): Prisma.MessageUncheckedCreateInput {
    return {
      id: message.id.toString(),
      authorId: message.author?.id.toString(),
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
      isBroadcast: message.isBroadcast,
      isForwarded: message.isForwarded,
      isFromMe: message.isFromMe,
      isGif: message.isGif,
      isStatus: message.isStatus,
      mediaId: message.media?.id.toString(),
      quotedId: message.quoted?.id.toString(),
      createdAt: message.createdAt,
      deletedAt: message.deletedAt,
      revokedAt: message.revokedAt,
      vCardsContactsIds: message.contacts?.map((contact) =>
        contact.id.toString(),
      ),
    }
  }

  static toPrismaUpdate(message: Message): Prisma.MessageUncheckedUpdateInput {
    return {
      authorId: message.author?.id.toString(),
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
      isBroadcast: message.isBroadcast,
      isForwarded: message.isForwarded,
      isFromMe: message.isFromMe,
      isGif: message.isGif,
      isStatus: message.isStatus,
      mediaId: message.media?.id.toString(),
      quotedId: message.quoted?.id.toString(),
      createdAt: message.createdAt,
      deletedAt: message.deletedAt,
      revokedAt: message.revokedAt,
      vCardsContactsIds: message.contacts?.map((contact) =>
        contact.id.toString(),
      ),
    }
  }
}
