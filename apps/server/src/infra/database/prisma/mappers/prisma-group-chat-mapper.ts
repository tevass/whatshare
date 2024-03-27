import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { GroupChat } from '@/domain/chat/enterprise/entities/group-chat'
import { Prisma, Chat as PrismaChat } from '@prisma/client'
import { RawContact } from './prisma-contact-mapper'
import {
  PrismaGroupMessageMapper,
  RawGroupMessage,
} from './prisma-group-message-mapper'

export type RawGroupChat = PrismaChat & {
  contact: RawContact
  lastMessage?: RawGroupMessage[]
  participants: RawContact[]
}

export class PrismaGroupChatMapper {
  static toDomain(raw: RawGroupChat): GroupChat {
    return GroupChat.create(
      {
        waChatId: WAEntityID.createFromString(raw.waChatId),
        whatsAppId: new UniqueEntityID(raw.whatsAppId),
        unreadCount: raw.unreadCount,
        deletedAt: raw.deletedAt,
        lastInteraction: raw.lastInteraction,
        lastMessage: raw.lastMessage?.[0]
          ? PrismaGroupMessageMapper.toDomain(raw.lastMessage[0])
          : null,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaCreate(chat: GroupChat): Prisma.ChatUncheckedCreateInput {
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
      participants: {
        connect: chat.participants.getItems().map((contact) => ({
          id: contact.id.toString(),
        })),
      },
    }
  }

  static toPrismaCreateMany(chat: GroupChat): Prisma.ChatCreateManyInput {
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
      participantsIds: chat.participants
        .getItems()
        .map((contact) => contact.id.toString()),
    }
  }

  static toPrismaUpdate(chat: GroupChat): Prisma.ChatUncheckedUpdateInput {
    return {
      contactId: chat.contact.id.toString(),
      deletedAt: chat.deletedAt,
      lastInteraction: chat.lastInteraction,
      unreadCount: chat.unreadCount,
      waChatId: chat.waChatId.toString(),
      whatsAppId: chat.whatsAppId.toString(),
      lastMessageId: chat.lastMessage?.id.toString(),
      isGroup: chat.isGroup,
      participants: {
        connect: chat.participants.getNewItems().map((contact) => ({
          id: contact.id.toString(),
        })),
        disconnect: chat.participants.getRemovedItems().map((contact) => ({
          id: contact.id.toString(),
        })),
      },
    }
  }
}
