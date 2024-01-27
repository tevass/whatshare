import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { Chat } from '@/domain/chat/enterprise/entities/chat'
import { Prisma, Chat as PrismaChat } from '@prisma/client'
import { PrismaContactMapper, RawContact } from './prisma-contact-mapper'
import { PrismaMessageMapper, RawMessage } from './prisma-message-mapper'

type RawChat = PrismaChat & {
  contact: RawContact
  lastMessage?: RawMessage[]
}

export class PrismaChatMapper {
  static toDomain(raw: RawChat): Chat {
    return Chat.create(
      {
        unreadCount: raw.unreadCount,
        waChatId: WAEntityID.createFromString(raw.waChatId),
        whatsAppId: new UniqueEntityID(raw.whatsAppId),
        deletedAt: raw.deletedAt,
        lastInteraction: raw.lastInteraction,
        contact: PrismaContactMapper.toDomain(raw.contact),
        lastMessage: raw.lastMessage?.[0]
          ? PrismaMessageMapper.toDomain(raw.lastMessage[0])
          : null,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaCreate(chat: Chat): Prisma.ChatUncheckedCreateInput {
    return {
      id: chat.id.toString(),
      contactId: chat.contact.id.toString(),
      deletedAt: chat.deletedAt,
      lastInteraction: chat.lastInteraction,
      unreadCount: chat.unreadCount,
      waChatId: chat.waChatId.toString(),
      whatsAppId: chat.whatsAppId.toString(),
      lastMessageId: chat.lastMessage?.id.toString(),
    }
  }

  static toPrismaUpdate(chat: Chat): Prisma.ChatUncheckedUpdateInput {
    return {
      contactId: chat.contact.id.toString(),
      deletedAt: chat.deletedAt,
      lastInteraction: chat.lastInteraction,
      unreadCount: chat.unreadCount,
      waChatId: chat.waChatId.toString(),
      whatsAppId: chat.whatsAppId.toString(),
      lastMessageId: chat.lastMessage?.id.toString(),
    }
  }
}
