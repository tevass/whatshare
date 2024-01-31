import { QuotedMessage } from '@/domain/chat/enterprise/types/quoted-message'
import {
  PrismaPrivateQuotedMessageMapper,
  RawPrivateQuotedMessage,
} from './prisma-private-quoted-message-mapper'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import {
  PrismaGroupQuotedMessageMapper,
  RawGroupQuotedMessage,
} from './prisma-group-quoted-message-mapper'

export type RawQuotedMessage = RawPrivateQuotedMessage | RawGroupQuotedMessage

function isRawPrivateQuotedMessage(
  quoted: RawQuotedMessage,
): quoted is RawPrivateQuotedMessage {
  return WAEntityID.createFromString(quoted.waChatId).type === 'c'
}

export class PrismaQuotedMessageMapper {
  static toDomain(raw: RawQuotedMessage): QuotedMessage {
    return isRawPrivateQuotedMessage(raw)
      ? PrismaPrivateQuotedMessageMapper.toDomain(raw)
      : PrismaGroupQuotedMessageMapper.toDomain(raw)
  }
}
