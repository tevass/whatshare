import { Chat, isPrivateChat } from '@/domain/chat/enterprise/types/chat'
import { Prisma } from '@prisma/client'
import { PrismaGroupChatMapper, RawGroupChat } from './prisma-group-chat-mapper'
import {
  PrismaPrivateChatMapper,
  RawPrivateChat,
} from './prisma-private-chat-mapper'

export type RawChat = RawPrivateChat | RawGroupChat

function isRawPrivateChat(chat: RawChat): chat is RawPrivateChat {
  return chat.isGroup
}

export class PrismaChatMapper {
  static toDomain(raw: RawChat): Chat {
    return isRawPrivateChat(raw)
      ? PrismaPrivateChatMapper.toDomain(raw)
      : PrismaGroupChatMapper.toDomain(raw)
  }

  static toPrismaCreate(chat: Chat): Prisma.ChatUncheckedCreateInput {
    return isPrivateChat(chat)
      ? PrismaPrivateChatMapper.toPrismaCreate(chat)
      : PrismaGroupChatMapper.toPrismaCreate(chat)
  }

  static toPrismaCreateMany(chat: Chat): Prisma.ChatCreateManyInput {
    return isPrivateChat(chat)
      ? PrismaPrivateChatMapper.toPrismaCreateMany(chat)
      : PrismaGroupChatMapper.toPrismaCreateMany(chat)
  }

  static toPrismaUpdate(chat: Chat): Prisma.ChatUncheckedUpdateInput {
    return isPrivateChat(chat)
      ? PrismaPrivateChatMapper.toPrismaUpdate(chat)
      : PrismaGroupChatMapper.toPrismaUpdate(chat)
  }
}
