import { WAMessageID } from '@/core/entities/wa-message-id'
import {
  FindToRevokeParams,
  MessagesRepository,
} from '@/domain/chat/application/repositories/messages-repository'
import { Message } from '@/domain/chat/enterprise/entities/message'
import dayjs from 'dayjs'
import { BaseInMemory } from './base-in-memory'

export class InMemoryMessagesRepository
  extends BaseInMemory<Message>
  implements MessagesRepository
{
  async findToRevoke(params: FindToRevokeParams): Promise<Message | null> {
    const { createdAt, waChatId, whatsAppId } = params

    const message = this.items.find(
      (item) =>
        item.waChatId.equals(waChatId) &&
        item.whatsAppId.toString() === whatsAppId &&
        dayjs(createdAt).isSame(item.createdAt),
    )

    if (!message) return null

    return message
  }

  async findByWAMessageId(waMessageId: WAMessageID): Promise<Message | null> {
    const message = this.items.find((item) =>
      item.waMessageId.equals(waMessageId),
    )

    if (!message) return null

    return message
  }
}
