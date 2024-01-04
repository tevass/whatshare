import { WAMessageID } from '@/core/entities/wa-message-id'
import {
  CountManyByChatIdParams,
  FindManyByChatIdParams,
  FindToRevokeParams,
  MessagesRepository,
} from '@/domain/chat/application/repositories/messages-repository'
import { Message } from '@/domain/chat/enterprise/entities/message'
import { Pagination } from '@/domain/chat/enterprise/utilities/pagination'
import dayjs from 'dayjs'
import { BaseInMemory } from './base-in-memory'

export class InMemoryMessagesRepository
  extends BaseInMemory<Message>
  implements MessagesRepository
{
  async findAllByChatId(chatId: string): Promise<Message[]> {
    return this.items.filter((item) => item.chatId.toString() === chatId)
  }

  async findManyByChatId(params: FindManyByChatIdParams): Promise<Message[]> {
    const { chatId, take, page } = params

    return this.items
      .filter((item) => item.chatId.toString() === chatId)
      .slice(Pagination.skip({ limit: take, page }), page * take)
  }

  async countManyByChatId(params: CountManyByChatIdParams): Promise<number> {
    const { chatId } = params

    return this.items.filter((item) => item.chatId.toString() === chatId).length
  }

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
