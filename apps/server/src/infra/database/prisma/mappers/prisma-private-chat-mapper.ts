import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { PrivateChat } from '@/domain/chat/enterprise/entities/private-chat'
import { Prisma, Chat as PrismaChat } from '@prisma/client'
import { PrismaContactMapper, RawContact } from './prisma-contact-mapper'
import {
  PrismaPrivateMessageMapper,
  RawPrivateMessage,
} from './prisma-private-message-mapper'

export type RawPrivateChat = PrismaChat & {
  contact: RawContact
  lastMessage?: RawPrivateMessage[]
}

export class PrismaPrivateChatMapper {
  static toDomain(raw: RawPrivateChat): PrivateChat {
    return PrivateChat.create(
      {
        waChatId: WAEntityID.createFromString(raw.waChatId),
        whatsAppId: new UniqueEntityID(raw.whatsAppId),
        contact: PrismaContactMapper.toDomain(raw.contact),
        unreadCount: raw.unreadCount,
        deletedAt: raw.deletedAt,
        lastInteraction: raw.lastInteraction,
        lastMessage: raw.lastMessage?.[0]
          ? PrismaPrivateMessageMapper.toDomain(raw.lastMessage[0])
          : null,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaCreate(chat: PrivateChat): Prisma.ChatUncheckedCreateInput {
    return {
      id: chat.id.toString(),
      contactId: chat.contact.id.toString(),
      deletedAt: chat.deletedAt,
      lastInteraction: chat.lastInteraction,
      unreadCount: chat.unreadCount,
      waChatId: chat.waChatId.toString(),
      whatsAppId: chat.whatsAppId.toString(),
      lastMessageId: chat.lastMessage?.id.toString(),
      isGroup: chat.isGroup,
    }
  }

  static toPrismaUpdate(chat: PrivateChat): Prisma.ChatUncheckedUpdateInput {
    return {
      contactId: chat.contact.id.toString(),
      deletedAt: chat.deletedAt,
      lastInteraction: chat.lastInteraction,
      unreadCount: chat.unreadCount,
      waChatId: chat.waChatId.toString(),
      whatsAppId: chat.whatsAppId.toString(),
      lastMessageId: chat.lastMessage?.id.toString(),
      isGroup: chat.isGroup,
    }
  }
}
