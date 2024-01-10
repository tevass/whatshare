import {
  CountManyByChatIdParams,
  FindAllByChatIdParams,
  FindByIdParams,
  FindByWAMessageIdParams,
  FindManyByChatIdParams,
  FindManyByWAMessagesIdsParams,
  FindToRevokeParams,
  MessagesRepository,
} from '@/domain/chat/application/repositories/messages-repository'
import { Message } from '@/domain/chat/enterprise/entities/message'
import { Pagination } from '@/domain/chat/enterprise/utilities/pagination'
import dayjs from 'dayjs'

export class InMemoryMessagesRepository implements MessagesRepository {
  items: Message[] = []

  async findById(params: FindByIdParams): Promise<Message | null> {
    const { id, includeDeleted = false } = params

    const item = this.items.find(
      (item) =>
        item.id.toString() === id &&
        (includeDeleted ? true : !item.isDeleted()),
    )

    if (!item) return null

    return item
  }

  async findManyByChatId(params: FindManyByChatIdParams): Promise<Message[]> {
    const { chatId, page, take, includeDeleted = false } = params

    return this.items
      .filter(
        (item) =>
          item.chatId.toString() === chatId &&
          (includeDeleted ? true : !item.isDeleted()),
      )
      .slice(Pagination.skip({ limit: take, page }), page * take)
  }

  async countManyByChatId(params: CountManyByChatIdParams): Promise<number> {
    const { chatId, includeDeleted = false } = params

    return this.items.filter(
      (item) =>
        item.chatId.toString() === chatId &&
        (includeDeleted ? true : !item.isDeleted()),
    ).length
  }

  async findAllByChatId(params: FindAllByChatIdParams): Promise<Message[]> {
    const { chatId, includeDeleted = false } = params

    return this.items.filter(
      (item) =>
        item.chatId.toString() === chatId &&
        (includeDeleted ? true : !item.isDeleted()),
    )
  }

  async findByWAMessageId(
    params: FindByWAMessageIdParams,
  ): Promise<Message | null> {
    const { waMessageId, includeDeleted = false } = params

    const item = this.items.find(
      (item) =>
        item.waMessageId.equals(waMessageId) &&
        (includeDeleted ? true : !item.isDeleted()),
    )

    if (!item) return null

    return item
  }

  async findManyByWAMessagesIds(
    params: FindManyByWAMessagesIdsParams,
  ): Promise<Message[]> {
    const { waMessagesIds, includeDeleted } = params

    return this.items.filter(
      (item) =>
        waMessagesIds.includes(item.waMessageId) &&
        (includeDeleted ? true : !item.isDeleted()),
    )
  }

  async findToRevoke(params: FindToRevokeParams): Promise<Message | null> {
    const { createdAt, waChatId, whatsAppId, includeDeleted = false } = params

    const message = this.items.find(
      (item) =>
        item.waChatId.equals(waChatId) &&
        item.whatsAppId.toString() === whatsAppId &&
        dayjs(createdAt).isSame(item.createdAt) &&
        (includeDeleted ? true : !item.isDeleted()),
    )

    if (!message) return null

    return message
  }

  async create(message: Message): Promise<void> {
    this.items.push(message)
  }

  async save(message: Message): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === message.id.toString(),
    )

    this.items[itemIndex] = message
  }

  async saveMany(entities: Message[]): Promise<void> {
    await Promise.all(entities.map((message) => this.save(message)))
  }
}
