import {
  PrismaPrivateMessageMapper,
  RawPrivateMessage,
} from './prisma-private-message-mapper'
import {
  PrismaGroupMessageMapper,
  RawGroupMessage,
} from './prisma-group-message-mapper'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import {
  Message,
  isPrivateMessage,
} from '@/domain/chat/enterprise/types/message'
import { Prisma } from '@prisma/client'

export type RawMessage = RawPrivateMessage | RawGroupMessage

function isRawPrivateMessage(
  message: RawMessage,
): message is RawPrivateMessage {
  return WAEntityID.createFromString(message.waChatId).type === 'c'
}

export class PrismaMessageMapper {
  static toDomain(raw: RawMessage): Message {
    return isRawPrivateMessage(raw)
      ? PrismaPrivateMessageMapper.toDomain(raw)
      : PrismaGroupMessageMapper.toDomain(raw)
  }

  static toPrismaCreate(message: Message): Prisma.MessageUncheckedCreateInput {
    return isPrivateMessage(message)
      ? PrismaPrivateMessageMapper.toPrismaCreate(message)
      : PrismaGroupMessageMapper.toPrismaCreate(message)
  }

  static toPrismaUpdate(message: Message): Prisma.MessageUncheckedUpdateInput {
    return isPrivateMessage(message)
      ? PrismaPrivateMessageMapper.toPrismaUpdate(message)
      : PrismaGroupMessageMapper.toPrismaUpdate(message)
  }
}
